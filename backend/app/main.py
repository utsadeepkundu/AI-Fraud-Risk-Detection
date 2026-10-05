import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import client
from app.routes.auth import router as auth_router
from app.routes.prediction import router as prediction_router


app = FastAPI(
    title="AI Fraud & Risk Detection API",
    version="1.0.0"
)


cors_origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://localhost:5174"
).split(",")

cors_origins = [
    origin.strip()
    for origin in cors_origins
    if origin.strip()
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "AI Fraud & Risk Detection API",
        "status": "running"
    }


@app.get("/api/health")
def health():
    try:
        client.admin.command("ping")

        return {
            "status": "healthy",
            "database": "connected"
        }

    except Exception as e:
        return {
            "status": "healthy",
            "database": "disconnected",
            "error": str(e)
        }


app.include_router(auth_router)
app.include_router(prediction_router)