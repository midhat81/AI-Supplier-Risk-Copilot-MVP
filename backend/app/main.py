from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.utils.db import Base, engine

# ── Import routers (will be filled Day 6) ──
# from app.routes import auth, supplier, shipment

# ── Create all DB tables on startup ──
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title       = "AI Supplier Risk Copilot API",
    description = "Predictive risk scoring for SME supply chains",
    version     = "0.1.0",
)

# ── CORS ──
app.add_middleware(
    CORSMiddleware,
    allow_origins     = ["http://localhost:3000"],
    allow_credentials = True,
    allow_methods     = ["*"],
    allow_headers     = ["*"],
)

# ── Health check routes ──
@app.get("/", tags=["Root"])
def root():
    return {
        "message": "🤖 AI Supplier Risk Copilot API is running!",
        "version": "0.1.0",
        "docs":    "/docs"
    }

@app.get("/health", tags=["Root"])
def health():
    return {"status": "ok"}

# ── Routers added Day 6 ──
# app.include_router(auth.router,     prefix="/auth",      tags=["Auth"])
# app.include_router(supplier.router, prefix="/suppliers", tags=["Suppliers"])
# app.include_router(shipment.router, prefix="/shipments", tags=["Shipments"])