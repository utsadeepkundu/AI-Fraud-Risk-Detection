import json
import joblib
import pandas as pd


MODEL_PATH = "../models/fraud_xgboost.joblib"
SCALER_PATH = "../models/fraud_scaler.joblib"
METADATA_PATH = "../models/model_metadata.json"


model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

with open(METADATA_PATH, "r") as f:
    metadata = json.load(f)


print("Model loaded:", type(model).__name__)
print("Scaler loaded:", type(scaler).__name__)
print("Threshold:", metadata["threshold"])
print("Features:", len(metadata["features"]))

print("\nModel artifacts loaded successfully.")