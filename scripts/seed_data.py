"""
Seed Database with Sample Data
--------------------------------
Run from root folder:
    cd backend
    python ../scripts/seed_data.py
"""
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app.utils.db        import SessionLocal, engine, Base
from app.utils.auth      import hash_password
from app.models.user     import User
from app.models.supplier import Supplier
from app.models.shipment import Shipment
from app.services.risk_service import compute_and_save_risk
from datetime import date


def seed():
    print("🌱 Starting database seed...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # ── Check already seeded ──────────────────
        if db.query(User).first():
            print("⚠️  Database already seeded! Skipping.")
            return

        # ── Users ─────────────────────────────────
        print("👤 Creating users...")
        admin = User(
            email           = "admin@test.com",
            full_name       = "Admin User",
            hashed_password = hash_password("password123"),
            role            = "admin",
            is_active       = True,
        )
        db.add(admin)
        db.flush()

        # ── Suppliers ─────────────────────────────
        print("🏭 Creating suppliers...")
        suppliers = [
            Supplier(
                name              = "FastShip Co",
                contact_info      = "fast@ship.com",
                reliability_score = 0.85,
            ),
            Supplier(
                name              = "MegaLogistics",
                contact_info      = "mega@logistics.com",
                reliability_score = 0.60,
            ),
            Supplier(
                name              = "QuickFreight",
                contact_info      = "quick@freight.com",
                reliability_score = 0.35,
            ),
            Supplier(
                name              = "AsiaTrade Ltd",
                contact_info      = "asia@trade.com",
                reliability_score = 0.75,
            ),
            Supplier(
                name              = "GlobalMove",
                contact_info      = "global@move.com",
                reliability_score = 0.45,
            ),
        ]
        db.add_all(suppliers)
        db.flush()

        # ── Shipments ─────────────────────────────
        print("🚢 Creating shipments...")
        shipments = [
            Shipment(
                supplier_id   = suppliers[0].id,
                origin        = "Shanghai",
                destination   = "Kuala Lumpur",
                date_sent     = date(2024, 1, 1),
                date_expected = date(2024, 1, 15),
                status        = "delivered",
            ),
            Shipment(
                supplier_id   = suppliers[1].id,
                origin        = "Jakarta",
                destination   = "Penang",
                date_sent     = date(2024, 1, 5),
                date_expected = date(2024, 1, 20),
                status        = "in_transit",
            ),
            Shipment(
                supplier_id   = suppliers[2].id,
                origin        = "Guangzhou",
                destination   = "Johor Bahru",
                date_sent     = date(2024, 1, 8),
                date_expected = date(2024, 1, 18),
                status        = "delayed",
            ),
            Shipment(
                supplier_id   = suppliers[3].id,
                origin        = "Bangkok",
                destination   = "Kuala Lumpur",
                date_sent     = date(2024, 1, 10),
                date_expected = date(2024, 1, 22),
                status        = "in_transit",
            ),
            Shipment(
                supplier_id   = suppliers[4].id,
                origin        = "Singapore",
                destination   = "Penang",
                date_sent     = date(2024, 1, 12),
                date_expected = date(2024, 1, 19),
                status        = "delayed",
            ),
        ]
        db.add_all(shipments)
        db.commit()

        # ── Risk Scores ───────────────────────────
        print("📊 Calculating risk scores...")
        for shipment in shipments:
            compute_and_save_risk(shipment.id, db)

        print("\n✅ Database seeded successfully!")
        print("─────────────────────────────────")
        print(f"👤 Users     : 1")
        print(f"🏭 Suppliers : {len(suppliers)}")
        print(f"🚢 Shipments : {len(shipments)}")
        print(f"📊 Risks     : {len(shipments)}")
        print("─────────────────────────────────")
        print("🔑 Login: admin@test.com / password123")

    except Exception as e:
        db.rollback()
        print(f"❌ Error: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()