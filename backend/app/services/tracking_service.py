"""
AfterShip Tracking Service
---------------------------
Fetches real-time parcel tracking data
from AfterShip API (1000+ carriers supported)
"""
import os
import httpx
from datetime import datetime

AFTERSHIP_API_KEY = os.getenv("AFTERSHIP_API_KEY", "your-aftership-key")
AFTERSHIP_URL     = "https://api.aftership.com/v4"

HEADERS = {
    "aftership-api-key": AFTERSHIP_API_KEY,
    "Content-Type":      "application/json",
}


# ── Status Mapper ─────────────────────────────
def map_status(tag: str) -> dict:
    """Convert AfterShip status to our app status"""
    status_map = {
        "Delivered":        {"status": "delivered",   "emoji": "✅", "color": "#22c55e", "risk": "LOW"},
        "InTransit":        {"status": "in_transit",  "emoji": "🚚", "color": "#6366f1", "risk": "LOW"},
        "OutForDelivery":   {"status": "in_transit",  "emoji": "🛵", "color": "#6366f1", "risk": "LOW"},
        "AttemptFail":      {"status": "delayed",     "emoji": "⚠️", "color": "#f59e0b", "risk": "MEDIUM"},
        "Exception":        {"status": "delayed",     "emoji": "🔴", "color": "#ef4444", "risk": "HIGH"},
        "Pending":          {"status": "pending",     "emoji": "⏳", "color": "#94a3b8", "risk": "LOW"},
        "InfoReceived":     {"status": "pending",     "emoji": "📋", "color": "#94a3b8", "risk": "LOW"},
        "Expired":          {"status": "delayed",     "emoji": "❌", "color": "#ef4444", "risk": "HIGH"},
    }
    return status_map.get(tag, {"status": "unknown", "emoji": "❓", "color": "#94a3b8", "risk": "UNKNOWN"})


# ── Add Tracking ──────────────────────────────
async def add_tracking(tracking_number: str, carrier_slug: str = None) -> dict:
    """
    Add a new tracking number to AfterShip.
    carrier_slug examples: 'dhl', 'fedex', 'jt-express', 'ninja-van'
    Leave None for auto-detection.
    """
    try:
        payload = {
            "tracking": {
                "tracking_number": tracking_number,
            }
        }
        if carrier_slug:
            payload["tracking"]["slug"] = carrier_slug

        async with httpx.AsyncClient(timeout=15) as client:
            res  = await client.post(
                f"{AFTERSHIP_URL}/trackings",
                headers=HEADERS,
                json=payload
            )
            data = res.json()

            if res.status_code in [200, 201]:
                return {
                    "success":         True,
                    "tracking_number": tracking_number,
                    "message":         "Tracking added successfully",
                }
            elif res.status_code == 4003:
                return {
                    "success":         True,
                    "tracking_number": tracking_number,
                    "message":         "Tracking already exists",
                }
            else:
                return {
                    "success": False,
                    "message": data.get("meta", {}).get("message", "Failed to add tracking"),
                }
    except Exception as e:
        return {"success": False, "message": str(e)}


# ── Get Single Tracking ───────────────────────
async def get_tracking(tracking_number: str, carrier_slug: str = None) -> dict:
    """Fetch live tracking info for a single parcel"""
    try:
        # Build URL
        if carrier_slug:
            url = f"{AFTERSHIP_URL}/trackings/{carrier_slug}/{tracking_number}"
        else:
            url = f"{AFTERSHIP_URL}/trackings/{tracking_number}"

        async with httpx.AsyncClient(timeout=15) as client:
            res  = await client.get(url, headers=HEADERS)
            data = res.json()

            if res.status_code != 200:
                return {
                    "success": False,
                    "message": data.get("meta", {}).get("message", "Tracking not found"),
                }

            tracking = data.get("data", {}).get("tracking", {})
            tag      = tracking.get("tag", "Pending")
            status   = map_status(tag)

            # Get last checkpoint
            checkpoints = tracking.get("checkpoints", [])
            last_checkpoint = checkpoints[-1] if checkpoints else {}

            return {
                "success":          True,
                "tracking_number":  tracking.get("tracking_number"),
                "carrier":          tracking.get("slug", "unknown").upper(),
                "carrier_name":     tracking.get("courier_name", "Unknown Carrier"),
                "status":           status["status"],
                "status_emoji":     status["emoji"],
                "status_color":     status["color"],
                "risk_level":       status["risk"],
                "origin":           tracking.get("origin_country_iso3", ""),
                "destination":      tracking.get("destination_country_iso3", ""),
                "expected_delivery": tracking.get("expected_delivery", None),
                "last_update":      last_checkpoint.get("created_at", ""),
                "last_location":    last_checkpoint.get("location", "Unknown"),
                "last_message":     last_checkpoint.get("message", ""),
                "checkpoints":      [
                    {
                        "time":     cp.get("created_at", ""),
                        "location": cp.get("location", ""),
                        "message":  cp.get("message", ""),
                        "status":   cp.get("tag", ""),
                    }
                    for cp in checkpoints[-5:]  # last 5 checkpoints
                ],
            }
    except Exception as e:
        return {"success": False, "message": str(e)}


# ── Get All Trackings ─────────────────────────
async def get_all_trackings() -> dict:
    """Fetch all tracked parcels with summary stats"""
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            res  = await client.get(
                f"{AFTERSHIP_URL}/trackings",
                headers=HEADERS,
                params={"limit": 50}
            )
            data = res.json()

            if res.status_code != 200:
                return {"success": False, "trackings": [], "summary": {}}

            trackings_raw = data.get("data", {}).get("trackings", [])
            trackings     = []

            for t in trackings_raw:
                tag    = t.get("tag", "Pending")
                status = map_status(tag)
                trackings.append({
                    "tracking_number": t.get("tracking_number"),
                    "carrier":         t.get("slug", "").upper(),
                    "carrier_name":    t.get("courier_name", "Unknown"),
                    "status":          status["status"],
                    "status_emoji":    status["emoji"],
                    "status_color":    status["color"],
                    "risk_level":      status["risk"],
                    "origin":          t.get("origin_country_iso3", ""),
                    "destination":     t.get("destination_country_iso3", ""),
                    "expected_delivery": t.get("expected_delivery", None),
                    "last_update":     t.get("updated_at", ""),
                    "last_location":   t.get("last_checkpoint", {}).get("location", ""),
                })

            # Summary stats
            total     = len(trackings)
            delivered = sum(1 for t in trackings if t["status"] == "delivered")
            in_transit = sum(1 for t in trackings if t["status"] == "in_transit")
            delayed   = sum(1 for t in trackings if t["status"] == "delayed")
            pending   = sum(1 for t in trackings if t["status"] == "pending")
            high_risk = sum(1 for t in trackings if t["risk_level"] == "HIGH")

            return {
                "success":   True,
                "trackings": trackings,
                "summary": {
                    "total":      total,
                    "delivered":  delivered,
                    "in_transit": in_transit,
                    "delayed":    delayed,
                    "pending":    pending,
                    "high_risk":  high_risk,
                }
            }
    except Exception as e:
        return {"success": False, "trackings": [], "summary": {}, "message": str(e)}


# ── Delete Tracking ───────────────────────────
async def delete_tracking(tracking_number: str, carrier_slug: str) -> dict:
    """Remove a tracking number"""
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            res = await client.delete(
                f"{AFTERSHIP_URL}/trackings/{carrier_slug}/{tracking_number}",
                headers=HEADERS
            )
            return {"success": res.status_code == 200}
    except Exception as e:
        return {"success": False, "message": str(e)}