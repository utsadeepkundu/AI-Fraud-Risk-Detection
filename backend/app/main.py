from fastapi import FastAPI

app = FastAPI(
    title="AI Fraud & Risk Detection API",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "AI Fraud & Risk Detection API",
        "status": "running"
    }


@app.get("/api/health")
def health():
    return {
        "status": "healthy"
    }