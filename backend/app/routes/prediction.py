from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from app.auth import get_current_user

from app.database import transactions_collection
from app.services.fraud_service import predict_fraud


router = APIRouter(
    prefix="/api",
    tags=["Fraud Detection"],
    dependencies=[Depends(get_current_user)]
)

class PredictionRequest(BaseModel):
    Time: float
    V1: float
    V2: float
    V3: float
    V4: float
    V5: float
    V6: float
    V7: float
    V8: float
    V9: float
    V10: float
    V11: float
    V12: float
    V13: float
    V14: float
    V15: float
    V16: float
    V17: float
    V18: float
    V19: float
    V20: float
    V21: float
    V22: float
    V23: float
    V24: float
    V25: float
    V26: float
    V27: float
    V28: float
    Amount: float


@router.post("/predict")
def predict(request: PredictionRequest):
    prediction = predict_fraud(request.model_dump())

    record = {
        **prediction,
        "timestamp": datetime.now(timezone.utc)
    }

    transactions_collection.insert_one(record)

    return prediction

@router.get("/history")
def get_history():
    records = list(
        transactions_collection
        .find({}, {"_id": 0})
        .sort("timestamp", -1)
        .limit(50)
    )

    return records

@router.delete("/history")
def clear_history():
    result = transactions_collection.delete_many({})

    return {
        "message": "Transaction history cleared successfully.",
        "deleted_count": result.deleted_count
    }
    
@router.get("/analytics")
def get_analytics():
    total_transactions = transactions_collection.count_documents({})

    fraud_transactions = transactions_collection.count_documents({
        "is_fraud": True
    })

    high_risk_transactions = transactions_collection.count_documents({
        "risk_level": "HIGH"
    })

    medium_risk_transactions = transactions_collection.count_documents({
        "risk_level": "MEDIUM"
    })

    low_risk_transactions = transactions_collection.count_documents({
        "risk_level": "LOW"
    })

    average_result = list(
        transactions_collection.aggregate([
            {
                "$group": {
                    "_id": None,
                    "average_risk_score": {
                        "$avg": "$risk_score"
                    }
                }
            }
        ])
    )

    average_risk_score = (
        average_result[0]["average_risk_score"]
        if average_result
        else 0
    )

    fraud_rate = (
        (fraud_transactions / total_transactions) * 100
        if total_transactions > 0
        else 0
    )

    recent_high_risk = list(
        transactions_collection.find(
            {"risk_level": "HIGH"},
            {"_id": 0}
        )
        .sort("timestamp", -1)
        .limit(5)
    )

    return {
        "total_transactions": total_transactions,
        "fraud_transactions": fraud_transactions,
        "fraud_rate": round(fraud_rate, 2),
        "high_risk_transactions": high_risk_transactions,
        "medium_risk_transactions": medium_risk_transactions,
        "low_risk_transactions": low_risk_transactions,
        "average_risk_score": round(
            float(average_risk_score),
            2
        ),
        "risk_distribution": {
            "high": high_risk_transactions,
            "medium": medium_risk_transactions,
            "low": low_risk_transactions
        },
        "recent_high_risk": recent_high_risk
    }
@router.get("/alerts")
def get_alerts():
    alerts = list(
        transactions_collection.find(
            {"risk_level": "HIGH"},
            {"_id": 0}
        )
        .sort("timestamp", -1)
        .limit(50)
    )

    return alerts