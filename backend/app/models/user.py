from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime
from app.utils.db import Base

class User(Base):
    __tablename__ = "users"

    id              = Column(Integer, primary_key=True, index=True)
    email           = Column(String, unique=True, index=True, nullable=False)
    full_name       = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role            = Column(String, default="user")  # "admin" or "user"
    is_active       = Column(Boolean, default=True)
    created_at      = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<User {self.email}>"