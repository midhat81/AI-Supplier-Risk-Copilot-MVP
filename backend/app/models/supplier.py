from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.utils.db import Base

class Supplier(Base):
    __tablename__ = "suppliers"

    id                = Column(Integer, primary_key=True, index=True)
    name              = Column(String, nullable=False)
    contact_info      = Column(String, nullable=True)
    reliability_score = Column(Float, default=1.0)  # 0.0 – 1.0
    created_at        = Column(DateTime, default=datetime.utcnow)

    # Relationship to shipments
    shipments = relationship("Shipment", back_populates="supplier")

    def __repr__(self):
        return f"<Supplier {self.name}>"