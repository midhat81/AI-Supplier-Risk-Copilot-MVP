"""
AI Risk Prediction
-------------------
Used by FastAPI backend to get risk scores.
Falls back to formula if model not trained yet.

Usage:
    from ai.predict import predict_risk
    score = predict_risk(0.85, 2.0, 14.0)
"""
import os
import pickle
import numpy as np

MODEL_PATH = os.path.join(os.path.dirname(__file__), "risk_model.pkl")

_model = None

def load_model():
    """Load model from disk once, cache in memory"""
    global _model
    if _model is None and os.path.exists(MODEL_PATH):
        with open(MODEL_PATH, "rb") as f:
            _model = pickle.load(f)
        print("✅ ML model loaded from risk_model.pkl")
    return _model


def predict_risk(
    supplier_reliability: float,
    avg_delay_days:       float,
    expected_days:        float
) -> float:
    """
    Predict risk score between 0.0 and 1.0.

    Args:
        supplier_reliability : 0.0 (bad) to 1.0 (great)
        avg_delay_days       : average days delayed
        expected_days        : expected transit days

    Returns:
        float: risk score 0.0 – 1.0
    """
    model = load_model()

    if model:
        # Use trained ML model
        X = np.array([[
            supplier_reliability,
            avg_delay_days,
            expected_days
        ]])
        score = float(model.predict(X)[0])
    else:
        # Fallback: use formula
        print("⚠️  No model found, using formula fallback")
        score = (
            (1 - supplier_reliability) * 0.4 +
            (avg_delay_days / max(expected_days, 1)) * 0.6
        )

    return round(float(np.clip(score, 0.0, 1.0)), 4)


if __name__ == "__main__":
    # Quick test
    test_cases = [
        (0.90, 0,  14, "Great supplier, no delay"),
        (0.60, 3,  14, "Average supplier, small delay"),
        (0.30, 10, 14, "Poor supplier, big delay"),
    ]
    print("\n🧪 Risk Prediction Test:\n")
    for reliability, delay, expected, label in test_cases:
        score = predict_risk(reliability, delay, expected)
        level = "🟢 LOW" if score < 0.4 else "🟡 MEDIUM" if score < 0.7 else "🔴 HIGH"
        print(f"  {label}")
        print(f"  Score: {score:.4f}  →  {level}\n")