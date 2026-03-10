"""
AI Chat Routes
--------------
POST /ai/chat        → Send message to Ollama with live data
GET  /ai/status      → Check Ollama status
GET  /ai/news        → Get latest supply chain news
GET  /ai/weather/{city} → Get weather for a city
"""
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Optional

from app.utils.auth import get_current_user
from app.models.user import User
from app.services.ollama_service import (
    chat_with_ollama,
    check_ollama_status,
)
from app.services.data_fetcher import (
    fetch_supply_chain_news,
    fetch_weather_for_city,
    fetch_all_context,
)

router = APIRouter()


# ── Schemas ───────────────────────────────────
class ChatMessage(BaseModel):
    role:    str  # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    message:      str
    history:      List[ChatMessage] = []
    origins:      List[str]         = []
    destinations: List[str]         = []

class ChatResponse(BaseModel):
    response:     str
    live_data_used: bool


# ── Chat Endpoint ─────────────────────────────
@router.post("/chat", response_model=ChatResponse)
async def chat(
    payload: ChatRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Send a message to Ollama AI with live supply chain data injected.
    Automatically fetches news + weather before responding.
    """
    # Convert history to list of dicts
    history = [
        {"role": msg.role, "content": msg.content}
        for msg in payload.history
    ]

    # Get AI response with live data
    response = await chat_with_ollama(
        message      = payload.message,
        history      = history,
        origins      = payload.origins,
        destinations = payload.destinations,
    )

    return {
        "response":       response,
        "live_data_used": True,
    }


# ── Ollama Status ─────────────────────────────
@router.get("/status")
async def ollama_status(
    current_user: User = Depends(get_current_user)
):
    """Check if Ollama is running and Llama3 is available"""
    status = await check_ollama_status()
    return status


# ── Live News ─────────────────────────────────
@router.get("/news")
async def get_news(
    current_user: User = Depends(get_current_user)
):
    """Get latest supply chain disruption news"""
    news = await fetch_supply_chain_news()
    return {
        "count": len(news),
        "news":  news,
    }


# ── Weather for City ──────────────────────────
@router.get("/weather/{city}")
async def get_weather(
    city: str,
    current_user: User = Depends(get_current_user)
):
    """Get weather risk for a shipping city"""
    weather = await fetch_weather_for_city(city)
    return weather


# ── Full Context (for debugging) ──────────────
@router.get("/context")
async def get_context(
    current_user: User = Depends(get_current_user)
):
    """Get all live data that would be sent to AI"""
    context = await fetch_all_context(
        origins      = ["Shanghai", "Jakarta"],
        destinations = ["Kuala Lumpur", "Penang"],
    )
    return context