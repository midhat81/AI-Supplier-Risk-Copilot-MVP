"""
Ollama AI Service
------------------
Connects to local Ollama instance running Llama3.
Injects live supply chain data as context automatically.
"""
import httpx
import json
from app.services.data_fetcher import fetch_all_context


OLLAMA_URL   = "http://localhost:11434"
OLLAMA_MODEL = "llama3.2:3b"    


# ── Build System Prompt ───────────────────────
def build_system_prompt(live_data: dict) -> str:
    """
    Build a rich system prompt with live data injected.
    This tells Llama3 WHO it is and WHAT data it has.
    """
    news_text = ""
    for article in live_data.get("news", [])[:3]:
        news_text += f"- {article.get('title', '')}\n"
        if article.get('description'):
            news_text += f"  {article.get('description', '')[:100]}\n"

    weather_text = ""
    for city, w in live_data.get("weather", {}).items():
        weather_text += (
            f"- {city}: {w.get('condition', 'unknown')}, "
            f"{w.get('temperature', '?')}°C, "
            f"Wind: {w.get('wind_speed', '?')} m/s, "
            f"Risk: {w.get('risk_flag', 'unknown')}\n"
        )

    fetched_at = live_data.get("fetched_at", "unknown")

    return f"""You are RiskCopilot AI, an intelligent supply chain risk assistant.
You help SMEs in import/export track supplier risk, shipment delays, and trade disruptions.

You have access to LIVE real-time data fetched at {fetched_at}:

📰 LATEST SUPPLY CHAIN NEWS:
{news_text if news_text else "No news available right now."}

🌤️ WEATHER ON ACTIVE TRADE ROUTES:
{weather_text if weather_text else "No weather data available right now."}

📊 YOUR ROLE:
- Analyze supply chain risks clearly and concisely
- Explain risk scores in simple business terms
- Give actionable advice to SME owners
- Reference the live news and weather data when relevant
- Keep answers short, clear, and practical
- Always end with a clear recommendation

If you don't have specific data, say so honestly and give general guidance.
"""


# ── Chat with Ollama ──────────────────────────
async def chat_with_ollama(
    message:      str,
    history:      list = [],
    origins:      list = [],
    destinations: list = [],
) -> str:
    """
    Send message to Ollama with live data context.

    Args:
        message:      User's question
        history:      Previous messages [{role, content}]
        origins:      Shipment origin cities for weather context
        destinations: Shipment destination cities for weather context

    Returns:
        AI response string
    """
    # Fetch live data first
    print("🌐 Fetching live data for AI context...")
    live_data = await fetch_all_context(origins, destinations)
    print(f"✅ Live data fetched: {len(live_data.get('news', []))} news, "
          f"{len(live_data.get('weather', {}))} cities")

    # Build messages array
    system_prompt = build_system_prompt(live_data)
    messages = [{"role": "system", "content": system_prompt}]

    # Add conversation history (last 6 messages)
    for msg in history[-6:]:
        messages.append({
            "role":    msg.get("role",    "user"),
            "content": msg.get("content", ""),
        })

    # Add current message
    messages.append({"role": "user", "content": message})

    # Call Ollama
    try:
        async with httpx.AsyncClient(timeout=60) as client:
            res = await client.post(
                f"{OLLAMA_URL}/api/chat",
                json={
                    "model":    OLLAMA_MODEL,
                    "messages": messages,
                    "stream":   False,
                    "options": {
                        "temperature": 0.7,
                        "top_p":       0.9,
                    }
                }
            )
            data = res.json()
            return data.get("message", {}).get("content", "Sorry, I could not generate a response.")

    except httpx.ConnectError:
        return (
            "⚠️ Ollama is not running! Please start it with:\n\n"
            "`ollama serve`\n\n"
            "Then make sure Llama3 is installed:\n"
            "`ollama pull llama3`"
        )
    except Exception as e:
        return f"❌ AI Error: {str(e)}"


# ── Check Ollama Status ───────────────────────
async def check_ollama_status() -> dict:
    """Check if Ollama is running and which models are available"""
    try:
        async with httpx.AsyncClient(timeout=5) as client:
            res    = await client.get(f"{OLLAMA_URL}/api/tags")
            data   = res.json()
            models = [m.get("name") for m in data.get("models", [])]
            return {
                "status":  "running",
                "models":  models,
                "has_llama3": any("llama3" in m for m in models),
            }
    except:
        return {
            "status":     "offline",
            "models":     [],
            "has_llama3": False,
        }