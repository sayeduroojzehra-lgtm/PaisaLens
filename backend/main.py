from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.database import create_transactions_table
from backend.routes import router


app = FastAPI(
    title="PaisaLens API",
    description="Financial clarity platform by Nexora",
    version="1.0.0"
)


# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register API routes
app.include_router(router)


# Create database table when application starts
@app.on_event("startup")
def startup():
    create_transactions_table()


@app.get("/")
def home():
    return {
        "message": "Welcome to PaisaLens!",
        "team": "Nexora",
        "status": "Backend is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }
