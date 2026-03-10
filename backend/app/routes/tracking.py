"""
Tracking Routes
----------------
POST /tracking/add           → Add new tracking number
GET  /tracking/all           → Get all parcels + summary
GET  /tracking/{number}      → Get single parcel details
DELETE /tracking/{number}    → Remove tracking
GET  /tracking/summary       → Stats overview
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional

from app.utils.auth import get_current_user
from app.models.user import User
from app.services.tracking_service import (
    add_tracking,
    get_tracking,
    get_all_trackings,
    delete_tracking,
)

router = APIRouter()


# ── Schemas ───────────────────────────────────
class AddTrackingRequest(BaseModel):
    tracking_number: str
    carrier_slug:    Optional[str] = None  # e.g. "dhl", "fedex", "jt-express"
    label:           Optional[str] = None  # e.g. "Order from Alibaba"


class TrackingResponse(BaseModel):
    success: bool
    message: Optional[str] = None


# ── Add Tracking ──────────────────────────────
@router.post("/add")
async def add_new_tracking(
    payload:      AddTrackingRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Add a new parcel tracking number.
    Carrier auto-detected if not provided.
    """
    if not payload.tracking_number.strip():
        raise HTTPException(status_code=400, detail="Tracking number is required")

    result = await add_tracking(
        tracking_number = payload.tracking_number.strip(),
        carrier_slug    = payload.carrier_slug,
    )

    if not result["success"]:
        raise HTTPException(status_code=400, detail=result.get("message", "Failed to add tracking"))

    return result


# ── Get All Parcels ───────────────────────────
@router.get("/all")
async def get_all_parcels(
    current_user: User = Depends(get_current_user)
):
    """
    Get all tracked parcels with summary stats.
    Returns total, delivered, in_transit, delayed counts.
    """
    result = await get_all_trackings()
    return result


# ── Summary Stats ─────────────────────────────
@router.get("/summary")
async def get_summary(
    current_user: User = Depends(get_current_user)
):
    """
    Get quick stats overview of all parcels.
    """
    result = await get_all_trackings()
    return {
        "success": result["success"],
        "summary": result.get("summary", {})
    }


# ── Get Single Parcel ─────────────────────────
@router.get("/{tracking_number}")
async def get_parcel(
    tracking_number: str,
    carrier_slug:    Optional[str] = None,
    current_user:    User = Depends(get_current_user)
):
    """
    Get detailed tracking info for a single parcel.
    Includes full checkpoint history.
    """
    result = await get_tracking(
        tracking_number = tracking_number,
        carrier_slug    = carrier_slug,
    )

    if not result["success"]:
        raise HTTPException(
            status_code = 404,
            detail      = result.get("message", "Tracking not found")
        )

    return result


# ── Delete Tracking ───────────────────────────
@router.delete("/{tracking_number}")
async def remove_tracking(
    tracking_number: str,
    carrier_slug:    str,
    current_user:    User = Depends(get_current_user)
):
    """Remove a parcel from tracking"""
    result = await delete_tracking(
        tracking_number = tracking_number,
        carrier_slug    = carrier_slug,
    )

    if not result["success"]:
        raise HTTPException(status_code=400, detail="Failed to remove tracking")

    return {"success": True, "message": "Tracking removed"}