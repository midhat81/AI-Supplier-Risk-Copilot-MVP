"""
AI Risk Model Training Script
------------------------------
Trains a RandomForest model on synthetic supply chain data.

Usage:
    cd ai
    python train_model.py

Output:
    risk_model.pkl  ← saved trained model
"""
import pickle
import numpy as np
from sklearn.ensemble          import RandomForestRegressor
from sklearn.model_selection   import train_test_split
from sklearn.metrics           import mean_squared_error, r2_score
from utils                     import generate_sample_data


def train():
    print("🔧 Generating training data...")
    X, y = generate_sample_data(n=500)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    print("🤖 Training RandomForest model...")
    model = RandomForestRegressor(
        n_estimators = 100,
        max_depth    = 6,
        random_state = 42
    )
    model.fit(X_train, y_train)

    # Evaluate
    preds = model.predict(X_test)
    mse   = mean_squared_error(y_test, preds)
    r2    = r2_score(y_test, preds)

    print(f"✅ MSE    : {mse:.4f}")
    print(f"✅ R2     : {r2:.4f}")

    # Feature importance
    features = ["reliability", "avg_delay", "expected_days"]
    print("\n📊 Feature Importances:")
    for feat, imp in zip(features, model.feature_importances_):
        print(f"   {feat:15s} → {imp:.4f}")

    # Save model
    with open("risk_model.pkl", "wb") as f:
        pickle.dump(model, f)

    print("\n💾 Model saved → risk_model.pkl")
    print("🚀 Ready to use in predict.py")


if __name__ == "__main__":
    train()