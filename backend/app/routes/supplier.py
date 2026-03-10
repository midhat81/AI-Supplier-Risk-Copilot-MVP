"""
Supplier Routes
GET    /suppliers        - List all suppliers
POST   /suppliers        - Create new supplier
GET    /suppliers/{id}   - Get single supplier
PUT    /suppliers/{id}   - Update supplier
DELETE /suppliers/{id}   - Delete supplier
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.utils.db   import get_db
from app.utils.auth import get_current_user
from app.models.user     import User
from app.models.supplier import Supplier
from app.schemas.supplier_schema import (
    SupplierCreate,
    SupplierUpdate,
    SupplierOut
)

router = APIRouter()


# ── List All ──────────────────────────────────────
@router.get("/", response_model=List[SupplierOut])
def get_suppliers(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Supplier).offset(skip).limit(limit).all()


# ── Create ────────────────────────────────────────
@router.post("/", response_model=SupplierOut, status_code=201)
def create_supplier(
    payload: SupplierCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check duplicate name
    existing = db.query(Supplier).filter(Supplier.name == payload.name).first()
    if existing:
        raise HTTPException(
            status_code = status.HTTP_400_BAD_REQUEST,
            detail      = "Supplier with this name already exists"
        )

    supplier = Supplier(**payload.model_dump())
    db.add(supplier)
    db.commit()
    db.refresh(supplier)
    return supplier


# ── Get Single ────────────────────────────────────
@router.get("/{supplier_id}", response_model=SupplierOut)
def get_supplier(
    supplier_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
    if not supplier:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail      = f"Supplier {supplier_id} not found"
        )
    return supplier


# ── Update ────────────────────────────────────────
@router.put("/{supplier_id}", response_model=SupplierOut)
def update_supplier(
    supplier_id: int,
    payload: SupplierUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
    if not supplier:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail      = f"Supplier {supplier_id} not found"
        )

    # Only update provided fields
    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(supplier, key, value)

    db.commit()
    db.refresh(supplier)
    return supplier


# ── Delete ────────────────────────────────────────
@router.delete("/{supplier_id}", status_code=204)
def delete_supplier(
    supplier_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
    if not supplier:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail      = f"Supplier {supplier_id} not found"
        )
    db.delete(supplier)
    db.commit()
    return None