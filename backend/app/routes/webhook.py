"""
Webhook + WebSocket Routes
---------------------------
POST /webhook/aftership     → Receives live updates from AfterShip
WS   /ws/tracking           → WebSocket for frontend live updates
"""
import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Request
from app.services.websocket_manager import manager
from app.services.tracking_service  import map_status

router = APIRouter()


# ── AfterShip Webhook ─────────────────────────
@router.post("/aftership")
async def aftership_webhook(request: Request):
    """
    AfterShip calls this endpoint when a parcel status changes.
    We parse the update and broadcast to all frontend clients.
    """
    try:
        payload = await request.json()
        print(f"📦 Webhook received from AfterShip")

        # Extract tracking data from AfterShip payload
        event    = payload.get("event",    "")
        tracking = payload.get("msg",      {})

        tracking_number = tracking.get("tracking_number", "")
        tag             = tracking.get("tag",             "Pending")
        slug            = tracking.get("slug",            "")
        courier_name    = tracking.get("courier_name",    "Unknown")

        # Get last checkpoint
        checkpoints     = tracking.get("checkpoints", [])
        last_checkpoint = checkpoints[-1] if checkpoints else {}

        # Map status
        status = map_status(tag)

        # Build update message for frontend
        update = {
            "type":            "TRACKING_UPDATE",
            "event":           event,
            "tracking_number": tracking_number,
            "carrier":         slug.upper(),
            "carrier_name":    courier_name,
            "status":          status["status"],
            "status_emoji":    status["emoji"],
            "status_color":    status["color"],
            "risk_level":      status["risk"],
            "last_location":   last_checkpoint.get("location", ""),
            "last_message":    last_checkpoint.get("message",  ""),
            "last_update":     last_checkpoint.get("created_at", ""),
            "expected_delivery": tracking.get("expected_delivery", None),
        }

        print(f"📡 Broadcasting update: {tracking_number} → {status['status']}")

        # Broadcast to ALL connected frontend clients
        await manager.broadcast(update)

        return {"status": "ok", "message": "Webhook processed"}

    except Exception as e:
        print(f"❌ Webhook error: {e}")
        return {"status": "error", "message": str(e)}


# ── WebSocket Connection ──────────────────────
@router.websocket("/ws/tracking")
async def websocket_tracking(websocket: WebSocket):
    """
    Frontend connects here to receive live parcel updates.
    Stays connected and receives push notifications instantly.
    """
    await manager.connect(websocket)
    print("🔌 Frontend connected to live tracking WebSocket")

    try:
        # Send welcome message
        await manager.send_personal({
            "type":    "CONNECTED",
            "message": "Connected to live tracking! 🚀",
        }, websocket)

        # Keep connection alive
        while True:
            # Wait for any message from client (ping/pong)
            data = await websocket.receive_text()
            msg  = json.loads(data)

            # Handle ping
            if msg.get("type") == "PING":
                await manager.send_personal({
                    "type":    "PONG",
                    "message": "alive",
                }, websocket)

    except WebSocketDisconnect:
        manager.disconnect(websocket)
        print("🔌 Frontend disconnected from live tracking")
    except Exception as e:
        print(f"❌ WebSocket error: {e}")
        manager.disconnect(websocket)