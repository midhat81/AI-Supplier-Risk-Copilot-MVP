"""
AI Supplier Risk Copilot - FastAPI Backend
Main entry point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.utils.db import Base, engine
from app.routes import auth, supplier, shipment, risk

# ── Create all DB tables ──────────────────────────
Base.metadata.create_all(bind=engine)

# ── App instance ──────────────────────────────────
app = FastAPI(
    title       = "AI Supplier Risk Copilot API",
    description = "Predictive risk scoring for SME supply chains",
    version     = "0.1.0",
    docs_url    = "/docs",
    redoc_url   = "/redoc",
)

# ── CORS Middleware ───────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins     = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials = True,
    allow_methods     = ["*"],
    allow_headers     = ["*"],
)

# ── Routers ───────────────────────────────────────
app.include_router(auth.router,     prefix="/auth",      tags=["Auth"])
app.include_router(supplier.router, prefix="/suppliers", tags=["Suppliers"])
app.include_router(shipment.router, prefix="/shipments", tags=["Shipments"])
app.include_router(risk.router,     prefix="/risk",      tags=["Risk"])

# ── Root Routes ───────────────────────────────────
@app.get("/", tags=["Root"])
def root():
    return {
        "message": "🤖 AI Supplier Risk Copilot API is running!",
        "version": "0.1.0",
        "docs":    "http://localhost:8000/docs",
        "status":  "ok"
    }

@app.get("/health", tags=["Root"])
def health():
    return {"status": "ok"}