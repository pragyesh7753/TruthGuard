import pandas as pd
import re
import pickle
from pathlib import Path
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import RandomizedSearchCV, train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# Resolve paths relative to this script so it works from any cwd.
BASE_DIR = Path(__file__).resolve().parents[1]
DATASET_DIR = BASE_DIR / "dataset"
MODEL_DIR = BASE_DIR / "app" / "models"

# Load dataset
fake = pd.read_csv(DATASET_DIR / "Fake.csv")
true = pd.read_csv(DATASET_DIR / "True.csv")

fake["label"] = 1
true["label"] = 0

data = pd.concat([fake, true])

# Clean text
stop_words = set(stopwords.words("english"))


def clean_text(text):
    text = re.sub("[^a-zA-Z]", " ", str(text))
    text = text.lower()
    words = text.split()
    words = [w for w in words if w not in stop_words]
    return " ".join(words)


data["clean_text"] = data["text"].apply(clean_text)

# Vectorization
vectorizer = TfidfVectorizer(max_features=5000)
X = vectorizer.fit_transform(data["clean_text"])
y = data["label"]

# Train test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Model tuning
rf = RandomForestClassifier(random_state=42, n_jobs=-1)
param_dist = {
    "n_estimators": [200, 300, 500],
    "max_depth": [None, 20, 40],
    "min_samples_split": [2, 5, 10],
    "min_samples_leaf": [1, 2, 4],
}

search = RandomizedSearchCV(
    estimator=rf,
    param_distributions=param_dist,
    n_iter=12,
    cv=3,
    scoring="accuracy",
    random_state=42,
    n_jobs=-1,
)
search.fit(X_train, y_train)
model = search.best_estimator_
print("Best params:", search.best_params_)

# Accuracy
pred = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, pred))

# Save model
MODEL_DIR.mkdir(parents=True, exist_ok=True)
pickle.dump(model, open(MODEL_DIR / "model.pkl", "wb"))
pickle.dump(vectorizer, open(MODEL_DIR / "vectorizer.pkl", "wb"))

print("Model saved successfully!")
