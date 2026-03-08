from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.utils.db import Base

class Shipment(Base):
    __tablename__ = "shipments"

    id            = Column(Integer, primary_key=True, index=True)
    supplier_id   = Column(Integer, ForeignKey("suppliers.id"), nullable=False)
    origin        = Column(String, nullable=False)
    destination   = Column(String, nullable=False)
    date_sent     = Column(Date, nullable=False)
    date_expected = Column(Date, nullable=False)
    status        = Column(String, default="in_transit")
    # status options: in_transit | delivered | delayed | cancelled
    created_at    = Column(DateTime, default=datetime.utcnow)

    # Relationships
    supplier   = relationship("Supplier", back_populates="shipments")
    risk_score = relationship("RiskScore", back_populates="shipment", uselist=False)

    def __repr__(self):
        return f"<Shipment {self.origin} → {self.destination}>"