"""
Risk Routes
GET  /risk              - Get all risk scores
GET  /risk/{shipment_id} - Get risk for specific shipment
POST /risk/calculate/{shipment_id} - Recalculate risk
GET  /risk/summary      - Get risk summary stats
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.utils.db   import get_db
from app.utils.auth import get_current_user
from app.models.user       import User
from app.models.risk_score import RiskScore
from app.models.shipment   import Shipment
from app.models.supplier   import Supplier
from app.services.risk_service import (
    compute_and_save_risk,
    get_all_risk_scores,
    get_risk_label
)

router = APIRouter()


# ── Get All Risk Scores ───────────────────────────
@router.get("/")
def get_all_risks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_all_risk_scores(db)


# ── Risk Summary Stats ────────────────────────────
@router.get("/summary")
def get_risk_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    all_scores = db.query(RiskScore).all()

    if not all_scores:
        return {
            "total":        0,
            "high_risk":    0,
            "medium_risk":  0,
            "low_risk":     0,
            "avg_score":    0.0,
        }

    scores     = [r.risk_score for r in all_scores]
    avg_score  = sum(scores) / len(scores)
    high_risk  = sum(1 for s in scores if s >= 0.7)
    medium_risk= sum(1 for s in scores if 0.4 <= s < 0.7)
    low_risk   = sum(1 for s in scores if s < 0.4)

    return {
        "total":        len(scores),
        "high_risk":    high_risk,
        "medium_risk":  medium_risk,
        "low_risk":     low_risk,
        "avg_score":    round(avg_score, 4),
    }


# ── Get Risk for Specific Shipment ────────────────
@router.get("/{shipment_id}")
def get_risk_by_shipment(
    shipment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    risk = db.query(RiskScore).filter(
        RiskScore.shipment_id == shipment_id
    ).first()

    if not risk:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail      = f"No risk score found for shipment {shipment_id}"
        )

    return {
        "shipment_id":   shipment_id,
        "risk_score":    risk.risk_score,
        "risk_label":    get_risk_label(risk.risk_score),
        "calculated_on": risk.calculated_on,
    }


# ── Recalculate Risk ──────────────────────────────
@router.post("/calculate/{shipment_id}")
def recalculate_risk(
    shipment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    shipment = db.query(Shipment).filter(Shipment.id == shipment_id).first()
    if not shipment:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail      = f"Shipment {shipment_id} not found"
        )

    risk = compute_and_save_risk(shipment_id, db)
    return {
        "message":     "Risk recalculated successfully",
        "shipment_id": shipment_id,
        "risk_score":  risk.risk_score,
        "risk_label":  get_risk_label(risk.risk_score),
    }