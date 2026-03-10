"""
Shipment Routes
GET    /shipments        - List all shipments
POST   /shipments        - Create new shipment
GET    /shipments/{id}   - Get single shipment
PUT    /shipments/{id}   - Update shipment
DELETE /shipments/{id}   - Delete shipment
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.utils.db   import get_db
from app.utils.auth import get_current_user
from app.models.user      import User
from app.models.shipment  import Shipment
from app.models.supplier  import Supplier
from app.schemas.shipment_schema import (
    ShipmentCreate,
    ShipmentUpdate,
    ShipmentOut
)
from app.services.risk_service import compute_and_save_risk

router = APIRouter()


# ── List All ──────────────────────────────────────
@router.get("/", response_model=List[ShipmentOut])
def get_shipments(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Shipment).offset(skip).limit(limit).all()


# ── Create ────────────────────────────────────────
@router.post("/", response_model=ShipmentOut, status_code=201)
def create_shipment(
    payload: ShipmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify supplier exists
    supplier = db.query(Supplier).filter(
        Supplier.id == payload.supplier_id
    ).first()
    if not supplier:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail      = f"Supplier {payload.supplier_id} not found"
        )

    # Create shipment
    shipment = Shipment(**payload.model_dump())
    db.add(shipment)
    db.commit()
    db.refresh(shipment)

    # Auto calculate risk score
    try:
        compute_and_save_risk(shipment.id, db)
    except Exception as e:
        print(f"Risk calculation warning: {e}")

    return shipment


# ── Get Single ────────────────────────────────────
@router.get("/{shipment_id}", response_model=ShipmentOut)
def get_shipment(
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
    return shipment


# ── Update ────────────────────────────────────────
@router.put("/{shipment_id}", response_model=ShipmentOut)
def update_shipment(
    shipment_id: int,
    payload: ShipmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    shipment = db.query(Shipment).filter(Shipment.id == shipment_id).first()
    if not shipment:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail      = f"Shipment {shipment_id} not found"
        )

    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(shipment, key, value)

    db.commit()
    db.refresh(shipment)

    # Recalculate risk after update
    try:
        compute_and_save_risk(shipment.id, db)
    except Exception as e:
        print(f"Risk calculation warning: {e}")

    return shipment


# ── Delete ────────────────────────────────────────
@router.delete("/{shipment_id}", status_code=204)
def delete_shipment(
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
    db.delete(shipment)
    db.commit()
    return None