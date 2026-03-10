"""
Live Data Fetcher Service
--------------------------
Pulls real-time data from:
- NewsAPI        → supply chain news
- OpenWeatherMap → weather on trade routes
- World Bank     → country logistics index
- REST Countries → country risk info
"""
import os
import httpx
import asyncio
from datetime import datetime

NEWS_API_KEY    = os.getenv("NEWS_API_KEY",    "your-newsapi-key")
WEATHER_API_KEY = os.getenv("WEATHER_API_KEY", "your-openweather-key")


# ── 1. Supply Chain News ──────────────────────
async def fetch_supply_chain_news() -> list:
    """Fetch latest supply chain disruption news"""
    try:
        url = "https://newsapi.org/v2/everything"
        params = {
            "q":        "supply chain disruption OR shipping delay OR port congestion",
            "sortBy":   "publishedAt",
            "pageSize": 5,
            "language": "en",
            "apiKey":   NEWS_API_KEY,
        }
        async with httpx.AsyncClient(timeout=10) as client:
            res = await client.get(url, params=params)
            data = res.json()
            articles = data.get("articles", [])
            return [
                {
                    "title":       a.get("title",       ""),
                    "description": a.get("description", ""),
                    "source":      a.get("source", {}).get("name", ""),
                    "published":   a.get("publishedAt", ""),
                    "url":         a.get("url",         ""),
                }
                for a in articles[:5]
            ]
    except Exception as e:
        print(f"⚠️ News fetch error: {e}")
        return [{"title": "News unavailable", "description": str(e)}]


# ── 2. Weather on Trade Routes ────────────────
async def fetch_weather_for_city(city: str) -> dict:
    """Get current weather for a shipping city"""
    try:
        url = "https://api.openweathermap.org/data/2.5/weather"
        params = {
            "q":     city,
            "appid": WEATHER_API_KEY,
            "units": "metric",
        }
        async with httpx.AsyncClient(timeout=10) as client:
            res  = await client.get(url, params=params)
            data = res.json()
            return {
                "city":        city,
                "condition":   data.get("weather", [{}])[0].get("description", "unknown"),
                "temperature": data.get("main", {}).get("temp", 0),
                "wind_speed":  data.get("wind", {}).get("speed", 0),
                "humidity":    data.get("main", {}).get("humidity", 0),
                "risk_flag":   _weather_risk(data),
            }
    except Exception as e:
        print(f"⚠️ Weather fetch error: {e}")
        return {"city": city, "condition": "unavailable", "risk_flag": "unknown"}


def _weather_risk(data: dict) -> str:
    """Flag weather risk based on conditions"""
    try:
        condition = data.get("weather", [{}])[0].get("main", "").lower()
        wind      = data.get("wind", {}).get("speed", 0)
        if condition in ["thunderstorm", "tornado", "hurricane"]:
            return "HIGH"
        if condition in ["snow", "extreme"] or wind > 20:
            return "MEDIUM"
        return "LOW"
    except:
        return "UNKNOWN"


# ── 3. Country Logistics Index (World Bank) ───
async def fetch_country_logistics(country_code: str) -> dict:
    """
    Fetch World Bank Logistics Performance Index for a country
    LPI Score: 1 (worst) to 5 (best)
    """
    try:
        url = f"https://api.worldbank.org/v2/country/{country_code}/indicator/LP.LPI.OVRL.XQ"
        params = {
            "format":   "json",
            "per_page": 1,
            "mrv":      1,
        }
        async with httpx.AsyncClient(timeout=10) as client:
            res  = await client.get(url, params=params)
            data = res.json()
            value = data[1][0].get("value") if data and len(data) > 1 else None
            return {
                "country":    country_code.upper(),
                "lpi_score":  round(value, 2) if value else None,
                "risk_level": _lpi_risk(value),
            }
    except Exception as e:
        print(f"⚠️ World Bank fetch error: {e}")
        return {"country": country_code, "lpi_score": None, "risk_level": "UNKNOWN"}


def _lpi_risk(score) -> str:
    """Convert LPI score to risk level"""
    if score is None:  return "UNKNOWN"
    if score >= 3.5:   return "LOW"
    if score >= 2.5:   return "MEDIUM"
    return                    "HIGH"


# ── 4. Fetch All Context Together ─────────────
async def fetch_all_context(origins: list = [], destinations: list = []) -> dict:
    """
    Fetch all live data in parallel for AI context.
    Called before sending message to Ollama.
    """
    cities = list(set(origins + destinations))[:3]  # max 3 cities

    # Run all fetches in parallel
    tasks = [fetch_supply_chain_news()]
    for city in cities:
        tasks.append(fetch_weather_for_city(city))

    results = await asyncio.gather(*tasks, return_exceptions=True)

    news    = results[0] if not isinstance(results[0], Exception) else []
    weather = {}
    for i, city in enumerate(cities):
        w = results[i + 1]
        if not isinstance(w, Exception):
            weather[city] = w

    return {
        "fetched_at":    datetime.utcnow().isoformat(),
        "news":          news,
        "weather":       weather,
        "cities_checked": cities,
    }