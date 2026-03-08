from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.utils.db import Base

class RiskScore(Base):
    __tablename__ = "risk_scores"

    id            = Column(Integer, primary_key=True, index=True)
    shipment_id   = Column(Integer, ForeignKey("shipments.id"), nullable=False)
    risk_score    = Column(Float, nullable=False)   # 0.0 – 1.0
    calculated_on = Column(DateTime, default=datetime.utcnow)

    # Relationship
    shipment = relationship("Shipment", back_populates="risk_score")

    def __repr__(self):
        return f"<RiskScore {self.risk_score} for shipment {self.shipment_id}>"