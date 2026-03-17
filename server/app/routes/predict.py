from fastapi import APIRouter
from app.services.predictor import predict_news

router = APIRouter()


@router.post("/predict")
def predict(data: dict):

    text = data.get("news", "")

    prediction, probability = predict_news(text)

    return {"prediction": int(prediction), "confidence": float(probability)}
