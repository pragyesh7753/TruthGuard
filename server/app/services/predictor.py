import pickle
import os
import numpy as np
from app.services.preprocess import clean_text

# Load model and vectorizer
MODEL_PATH = "server/app/models/model.pkl"
VECTORIZER_PATH = "server/app/models/vectorizer.pkl"

# Check relative paths
if not os.path.exists(MODEL_PATH):
    MODEL_PATH = "app/models/model.pkl"
    VECTORIZER_PATH = "app/models/vectorizer.pkl"

MODEL = None
VECTORIZER = None

def load_model():
    """Load trained model and vectorizer"""
    global MODEL, VECTORIZER
    try:
        if MODEL is None:
            with open(MODEL_PATH, 'rb') as f:
                MODEL = pickle.load(f)
            with open(VECTORIZER_PATH, 'rb') as f:
                VECTORIZER = pickle.load(f)
            print(f"Model and vectorizer loaded successfully")
    except Exception as e:
        print(f"Error loading model: {e}")


def get_feature_importance(text, prediction):
    """
    Extract important features that influenced the prediction.
    Returns top words that contribute to the prediction.
    """
    try:
        # Vectorize the text
        X = VECTORIZER.transform([text])
        
        # Get feature names (words)
        feature_names = np.array(VECTORIZER.get_feature_names_out())
        
        # Get model coefficients (for linear models) or use permutation importance concept
        if hasattr(MODEL, 'coef_'):
            # For linear models like LogisticRegression
            coefficients = MODEL.coef_[0]
            # Get non-zero features
            X_dense = X.toarray()[0]
            
            # Calculate feature contributions
            contributions = coefficients * X_dense
            
            # Get top positive and negative contributors
            top_indices = np.argsort(np.abs(contributions))[-10:][::-1]
            
            important_features = []
            for idx in top_indices:
                if X_dense[idx] > 0:  # Only words that appear in the text
                    importance_score = float(np.abs(contributions[idx]))
                    important_features.append({
                        "word": str(feature_names[idx]),
                        "importance": important_score,
                        "impact": "increases_fake" if contributions[idx] > 0 else "increases_real"
                    })
            
            return important_features[:5]  # Return top 5
        else:
            return []
    except Exception as e:
        print(f"Error calculating feature importance: {e}")
        return []


def predict_news(text):
    """
    Predict if news is real or fake using the trained ML model.
    Returns (prediction, confidence, features)
    prediction: 0 = Real, 1 = Fake
    confidence: 0.0-1.0 (probability score)
    features: list of important words that influenced prediction
    
    IMPROVED v2.1:
    - Better handling of calibrated models
    - Reduced false positive rate for real news
    - Better confidence scores
    """
    load_model()
    
    if not text or not text.strip():
        return 0, 0.0, []
    
    if MODEL is None or VECTORIZER is None:
        raise Exception("Model not loaded")
    
    try:
        # Vectorize the input text using the same vectorizer as training
        X = VECTORIZER.transform([text])
        
        # Get prediction
        prediction = MODEL.predict(X)[0]
        
        # Get probabilities 
        # Handle both regular models and calibrated models
        try:
            probabilities = MODEL.predict_proba(X)[0]
        except AttributeError:
            # Fallback for models without predict_proba
            probabilities = [0.5, 0.5]
        
        confidence = max(probabilities)
        
        # Get important features
        features = get_feature_importance(text, int(prediction))
        
        print(f"[Prediction v2.1] Type: {prediction} (0=Real, 1=Fake)")
        print(f"  Confidence: {confidence:.2%}")
        print(f"  Real prob: {probabilities[0]:.2%}, Fake prob: {probabilities[1]:.2%}")
        print(f"  Important features: {len(features)} words identified")
        
        return int(prediction), float(confidence), features
    except Exception as e:
        print(f"Error during prediction: {e}")
        import traceback
        traceback.print_exc()
        return 0, 0.0, []

