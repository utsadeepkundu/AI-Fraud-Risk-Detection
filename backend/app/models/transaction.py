from datetime import datetime, timezone

from pydantic import BaseModel, Field


class TransactionRecord(BaseModel):
    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    fraud_probability: float
    risk_score: float
    risk_level: str
    is_fraud: bool
    top_factors: list[dict]
    