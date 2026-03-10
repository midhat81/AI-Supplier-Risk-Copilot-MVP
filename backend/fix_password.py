from sqlalchemy import create_engine, text
from passlib.context import CryptContext

ctx      = CryptContext(schemes=["bcrypt"], deprecated="auto")
new_hash = ctx.hash("password123")
print("New hash:", new_hash[:30], "...")

engine = create_engine("sqlite:///./supplier_risk.db")
with engine.connect() as conn:
    conn.execute(
        text("UPDATE users SET hashed_password = :hash WHERE email = 'admin@test.com'"),
        {"hash": new_hash}
    )
    conn.commit()
    print("✅ Password updated!")

print("Testing verify:", ctx.verify("password123", new_hash))