from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import predict
from app.routes import analytics

app = FastAPI()

# CORS (for React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(predict.router)
app.include_router(analytics.router)


@app.get("/")
def home():
    return {"message": "TruthGuard API is running"}
