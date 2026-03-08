from pydantic import BaseModel, Field
from datetime import datetime

class SupplierCreate(BaseModel):
    name:              str
    contact_info:      str
    reliability_score: float = Field(default=1.0, ge=0.0, le=1.0)

class SupplierUpdate(BaseModel):
    name:              str   | None = None
    contact_info:      str   | None = None
    reliability_score: float | None = None

class SupplierOut(BaseModel):
    id:                int
    name:              str
    contact_info:      str
    reliability_score: float
    created_at:        datetime

    class Config:
        from_attributes = True