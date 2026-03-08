from sqlalchemy.orm import Session
from datetime import date
from app.models.shipment  import Shipment
from app.models.supplier  import Supplier
from app.models.risk_score import RiskScore


def calculate_risk_score(
    supplier_reliability: float,
    avg_delay_days: float,
    expected_days: float
) -> float:
    """
    MVP Risk Formula:
    risk_score = (1 - supplier_reliability) * 0.4
               + (avg_delay_days / expected_days) * 0.6
    Returns value between 0.0 and 1.0
    """
    reliability_factor = (1 - supplier_reliability) * 0.4
    delay_factor       = (avg_delay_days / max(expected_days, 1)) * 0.6
    return round(min(reliability_factor + delay_factor, 1.0), 4)


def get_risk_label(score: float) -> str:
    """Convert score to human-readable label"""
    if score < 0.4:  return "Low"
    if score < 0.7:  return "Medium"
    return                  "High"


def compute_and_save_risk(shipment_id: int, db: Session) -> RiskScore:
    """
    Compute risk for a shipment and save to DB.
    Called after every new shipment is created.
    """
    # Fetch shipment + supplier
    shipment = db.query(Shipment).filter(Shipment.id == shipment_id).first()
    if not shipment:
        raise ValueError(f"Shipment {shipment_id} not found")

    supplier = db.query(Supplier).filter(Supplier.id == shipment.supplier_id).first()
    if not supplier:
        raise ValueError(f"Supplier {shipment.supplier_id} not found")

    # Calculate delay
    today         = date.today()
    expected_days = (shipment.date_expected - shipment.date_sent).days
    actual_days   = (today - shipment.date_sent).days
    delay_days    = max(actual_days - expected_days, 0)

    # Calculate score
    score = calculate_risk_score(
        supplier_reliability = supplier.reliability_score,
        avg_delay_days       = delay_days,
        expected_days        = expected_days
    )

    # Save or update risk score
    existing = db.query(RiskScore).filter(RiskScore.shipment_id == shipment_id).first()
    if existing:
        existing.risk_score    = score
        existing.calculated_on = date.today()
        db.commit()
        db.refresh(existing)
        return existing

    new_score = RiskScore(shipment_id=shipment_id, risk_score=score)
    db.add(new_score)
    db.commit()
    db.refresh(new_score)
    return new_score


def get_all_risk_scores(db: Session) -> list:
    """Return all risk scores with shipment + supplier info"""
    results = (
        db.query(
            RiskScore.id,
            RiskScore.risk_score,
            RiskScore.calculated_on,
            Shipment.origin,
            Shipment.destination,
            Shipment.status,
            Supplier.name.label("supplier_name"),
        )
        .join(Shipment, RiskScore.shipment_id == Shipment.id)
        .join(Supplier, Shipment.supplier_id == Supplier.id)
        .all()
    )
    return [
        {
            "id":            r.id,
            "risk_score":    r.risk_score,
            "risk_label":    get_risk_label(r.risk_score),
            "calculated_on": str(r.calculated_on),
            "origin":        r.origin,
            "destination":   r.destination,
            "status":        r.status,
            "supplier_name": r.supplier_name,
        }
        for r in results
    ]