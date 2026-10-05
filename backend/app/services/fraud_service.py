import json
from pathlib import Path

import joblib
import pandas as pd
import shap


BASE_DIR = Path(__file__).resolve().parents[3]

MODEL_PATH = BASE_DIR / "ml" / "models" / "fraud_xgboost.joblib"
SCALER_PATH = BASE_DIR / "ml" / "models" / "fraud_scaler.joblib"
METADATA_PATH = BASE_DIR / "ml" / "models" / "model_metadata.json"


model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

with open(METADATA_PATH, "r") as f:
    metadata = json.load(f)

THRESHOLD = metadata["threshold"]
FEATURES = metadata["features"]

explainer = shap.TreeExplainer(model)


def predict_fraud(data: dict):
    df = pd.DataFrame([data], columns=FEATURES)

    df[["Time", "Amount"]] = scaler.transform(
        df[["Time", "Amount"]]
    )

    probability = float(model.predict_proba(df)[0][1])

    is_fraud = probability >= THRESHOLD

    if probability >= THRESHOLD:
        risk_level = "HIGH"
    elif probability >= 0.50:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    shap_result = explainer(df)

    values = shap_result.values[0]

    explanations = sorted(
        zip(FEATURES, values),
        key=lambda x: abs(x[1]),
        reverse=True
    )[:5]

    return {
        "fraud_probability": round(probability, 6),
        "risk_score": round(probability * 100, 2),
        "risk_level": risk_level,
        "is_fraud": bool(is_fraud),
        "top_factors": [
            {
                "feature": feature,
                "impact": round(float(impact), 6)
            }
            for feature, impact in explanations
        ]
    }