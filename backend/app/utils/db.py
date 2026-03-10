import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# db.py is at: backend/app/utils/db.py
# We need:     backend/supplier_risk.db
# So go up 3 levels from db.py
THIS_FILE    = os.path.abspath(__file__)           # backend/app/utils/db.py
UTILS_DIR    = os.path.dirname(THIS_FILE)          # backend/app/utils
APP_DIR      = os.path.dirname(UTILS_DIR)          # backend/app
BACKEND_DIR  = os.path.dirname(APP_DIR)            # backend  ✅
DATABASE_URL = f"sqlite:///{BACKEND_DIR}/supplier_risk.db"

print(f"🗄️  Database: {DATABASE_URL}")

engine       = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base         = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()