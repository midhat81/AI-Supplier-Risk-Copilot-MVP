from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional

class ShipmentCreate(BaseModel):
    supplier_id:   int
    origin:        str
    destination:   str
    date_sent:     date
    date_expected: date
    status:        str = "in_transit"

class ShipmentUpdate(BaseModel):
    origin:        str  | None = None
    destination:   str  | None = None
    date_sent:     date | None = None
    date_expected: date | None = None
    status:        str  | None = None

class ShipmentOut(BaseModel):
    id:            int
    supplier_id:   int
    origin:        str
    destination:   str
    date_sent:     date
    date_expected: date
    status:        str
    created_at:    datetime

    class Config:
        from_attributes = True

class RiskScoreOut(BaseModel):
    id:            int
    shipment_id:   int
    risk_score:    float
    risk_label:    str
    calculated_on: datetime

    class Config:
        from_attributes = True