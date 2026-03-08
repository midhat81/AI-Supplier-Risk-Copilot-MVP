import numpy as np

def normalize(
    value: float,
    min_val: float = 0.0,
    max_val: float = 1.0
) -> float:
    """Normalize a value between 0.0 and 1.0"""
    return max(0.0, min(1.0, (value - min_val) / (max_val - min_val)))


def generate_sample_data(n: int = 200):
    """
    Generate synthetic training data for risk model.
    Returns:
        X — feature matrix (reliability, avg_delay, expected_days)
        y — risk scores 0.0 to 1.0
    """
    np.random.seed(42)

    reliability   = np.random.uniform(0.3, 1.0, n)
    avg_delay     = np.random.uniform(0, 15,  n)
    expected_days = np.random.uniform(5, 30,  n)

    # MVP formula as ground truth
    risk_scores = (
        (1 - reliability)              * 0.4 +
        (avg_delay / expected_days)    * 0.6
    )
    risk_scores = np.clip(risk_scores, 0, 1)

    X = np.column_stack([reliability, avg_delay, expected_days])
    return X, risk_scores


def get_risk_label(score: float) -> str:
    """Convert numeric score to label"""
    if score < 0.4: return "Low"
    if score < 0.7: return "Medium"
    return                  "High"


def get_risk_color(score: float) -> str:
    """Return hex color for risk score"""
    label = get_risk_label(score)
    return {
        "Low":    "#10b981",
        "Medium": "#f59e0b",
        "High":   "#ef4444"
    }[label]