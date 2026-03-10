from sqlalchemy import create_engine, text
from passlib.context import CryptContext

engine = create_engine("sqlite:///./supplier_risk.db")
ctx    = CryptContext(schemes=["bcrypt"], deprecated="auto")

with engine.connect() as conn:
    result = conn.execute(text("SELECT email, hashed_password FROM users"))
    for row in result:
        email  = row[0]
        hashed = row[1]
        print(f"Email : {email}")
        print(f"Hash  : {hashed}")
        print(f"Length: {len(hashed)}")
        match  = ctx.verify("password123", hashed)
        print(f"Match : {match}")