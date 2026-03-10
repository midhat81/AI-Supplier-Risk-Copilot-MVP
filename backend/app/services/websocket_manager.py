"""
WebSocket Connection Manager
-----------------------------
Manages all active frontend connections.
When AfterShip sends a webhook, we broadcast
the update to ALL connected frontend clients instantly.
"""
from fastapi import WebSocket
from typing import List
import json


class WebSocketManager:
    def __init__(self):
        # All active frontend connections
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        """Accept new frontend connection"""
        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"✅ WebSocket connected! Total: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        """Remove disconnected frontend"""
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        print(f"❌ WebSocket disconnected! Total: {len(self.active_connections)}")

    async def broadcast(self, message: dict):
        """
        Send update to ALL connected frontends instantly.
        Called when AfterShip webhook arrives.
        """
        if not self.active_connections:
            print("⚠️  No active connections to broadcast to")
            return

        dead_connections = []
        for connection in self.active_connections:
            try:
                await connection.send_text(json.dumps(message))
                print(f"📡 Broadcasted to {len(self.active_connections)} clients")
            except Exception as e:
                print(f"❌ Failed to send to client: {e}")
                dead_connections.append(connection)

        # Clean up dead connections
        for dead in dead_connections:
            self.active_connections.remove(dead)

    async def send_personal(self, message: dict, websocket: WebSocket):
        """Send message to a single client"""
        await websocket.send_text(json.dumps(message))


# Global instance — shared across entire app
manager = WebSocketManager()