from fastapi import APIRouter
from app.services.predictor import predict_news
from app.services.preprocess import clean_text

router = APIRouter()


@router.post("/predict")
def predict(data: dict):
    """
    Predict if news is real or fake with feature importance.
    
    Request: {"news": "article text"}
    Response: {
        "prediction": 0/1,
        "confidence": 0.0-1.0,
        "cleaned_text": "processed text",
        "important_features": [{"word": "...", "importance": 0.5, "impact": "increases_fake"}],
        "real_probability": 0.8,
        "fake_probability": 0.2
    }
    """
    text = data.get("news", "")
    
    if not text or not text.strip():
        return {
            "prediction": 0,
            "confidence": 0.0,
            "cleaned_text": "",
            "important_features": [],
            "real_probability": 0.0,
            "fake_probability": 0.0,
            "error": "Empty text provided"
        }
    
    # Clean the text
    cleaned_text = clean_text(text)
    
    # Get prediction with features
    prediction, confidence, features = predict_news(cleaned_text)
    
    # Calculate both probabilities (we have the max, need to derive the other)
    # confidence is max(probabilities), so the other is 1 - confidence
    if prediction == 0:  # Real
        real_prob = confidence
        fake_prob = 1 - confidence
    else:  # Fake
        fake_prob = confidence
        real_prob = 1 - confidence
    
    return {
        "prediction": int(prediction),
        "confidence": float(confidence),
        "cleaned_text": cleaned_text,
        "important_features": features,
        "real_probability": float(real_prob),
        "fake_probability": float(fake_prob)
    }
