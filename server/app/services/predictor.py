import pickle
from app.services.preprocess import clean_text

# Load model
model = pickle.load(open("app/models/model.pkl", "rb"))
vectorizer = pickle.load(open("app/models/vectorizer.pkl", "rb"))


def predict_news(text):

    cleaned = clean_text(text)

    vec = vectorizer.transform([cleaned])

    prediction = model.predict(vec)[0]

    probability = model.predict_proba(vec).max()

    return prediction, probability

