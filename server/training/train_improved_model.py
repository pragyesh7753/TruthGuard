"""
Improved Training Script for Fake News Detection
Focus: Better real news detection, reduced false positives
"""

import pandas as pd
import re
import pickle
import numpy as np
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.linear_model import LogisticRegression
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
import warnings
warnings.filterwarnings('ignore')

print("=" * 60)
print("IMPROVED FAKE NEWS DETECTION MODEL TRAINING")
print("=" * 60)

# Load dataset
print("\n[1/7] Loading dataset...")
try:
    fake = pd.read_csv("dataset/Fake.csv")
    true = pd.read_csv("dataset/True.csv")
    print(f"  ✓ Fake news articles: {len(fake)}")
    print(f"  ✓ Real news articles: {len(true)}")
except Exception as e:
    print(f"  ✗ Error loading dataset: {e}")
    exit(1)

# Label data
fake["label"] = 1  # 1 = Fake
true["label"] = 0  # 0 = Real

# Balance dataset to reduce bias
print("\n[2/7] Balancing dataset...")
min_samples = min(len(fake), len(true))
fake_balanced = fake.sample(n=min_samples, random_state=42)
true_balanced = true.sample(n=min_samples, random_state=42)
data = pd.concat([fake_balanced, true_balanced]).sample(frac=1, random_state=42).reset_index(drop=True)
print(f"  ✓ Balanced dataset size: {len(data)}")
print(f"  ✓ Fake: {len(fake_balanced)}, Real: {len(true_balanced)}")

# Improved text cleaning
print("\n[3/7] Cleaning text data...")
stop_words = set(stopwords.words("english"))

# Add custom stop words to reduce bias
custom_stop_words = {"said", "say", "get", "got", "new", "according"}
stop_words.update(custom_stop_words)

def clean_text_improved(text):
    """
    Enhanced text cleaning:
    - Remove URLs
    - Remove special characters
    - Convert to lowercase
    - Remove stopwords
    - Remove extra whitespace
    """
    # Remove URLs
    text = re.sub(r'http\S+|www\S+|https\S+', '', str(text), flags=re.MULTILINE)
    
    # Remove email addresses
    text = re.sub(r'\S+@\S+', '', text)
    
    # Remove special characters but keep important punctuation
    text = re.sub(r'[^a-zA-Z\s]', ' ', text)
    
    # Convert to lowercase
    text = text.lower()
    
    # Split into words
    words = text.split()
    
    # Remove stopwords and short words (< 3 chars)
    words = [w for w in words if w not in stop_words and len(w) >= 3]
    
    # Join back
    return " ".join(words)

# Apply cleaning
data["clean_text"] = data["text"].apply(clean_text_improved)
print(f"  ✓ Text cleaning complete")

# Better vectorization with optimized parameters
print("\n[4/7] Vectorizing text (TF-IDF)...")
vectorizer = TfidfVectorizer(
    max_features=3000,           # Reduced from 5000 to avoid overfitting
    min_df=5,                     # Ignore words appearing in < 5 docs
    max_df=0.8,                   # Ignore words appearing in > 80% docs
    ngram_range=(1, 2),           # Use unigrams and bigrams
    strip_accents='unicode',
    lowercase=True,
    analyzer='word',
    token_pattern=r'\w{1,}',
    stop_words='english'
)

X = vectorizer.fit_transform(data["clean_text"])
y = data["label"]
print(f"  ✓ Vocabulary size: {len(vectorizer.get_feature_names_out())}")
print(f"  ✓ Feature matrix shape: {X.shape}")

# Split data
print("\n[5/7] Splitting data (80/20)...")
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
print(f"  ✓ Training set: {X_train.shape[0]}")
print(f"  ✓ Test set: {X_test.shape[0]}")

# Improved model with better parameters
print("\n[6/7] Training improved LogisticRegression model...")
model = LogisticRegression(
    max_iter=2000,               # Increased iterations for better convergence
    solver='lbfgs',              # Better solver for convergence
    C=1.0,                       # Regularization parameter
    class_weight='balanced',     # Handle class imbalance
    random_state=42,
    verbose=0
)

# Use calibrated classifier for better probability estimates
calibrated_model = CalibratedClassifierCV(model, method='sigmoid', cv=5)
calibrated_model.fit(X_train, y_train)

# Cross-validation
print("\n  Running 5-fold cross-validation...")
cv_scores = cross_val_score(calibrated_model, X_train, y_train, cv=5, scoring='f1')
print(f"  ✓ Cross-validation F1 scores: {cv_scores}")
print(f"  ✓ Mean CV F1: {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")

# Predictions
print("\n[7/7] Evaluating model...")
y_pred = calibrated_model.predict(X_test)
y_pred_proba = calibrated_model.predict_proba(X_test)

# Detailed metrics
accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred)
recall = recall_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)

print(f"\n  📊 MODEL PERFORMANCE METRICS:")
print(f"  ├─ Accuracy:  {accuracy:.4f} ({accuracy*100:.2f}%)")
print(f"  ├─ Precision: {precision:.4f} ({precision*100:.2f}%)")
print(f"  ├─ Recall:    {recall:.4f} ({recall*100:.2f}%)")
print(f"  └─ F1 Score:  {f1:.4f}")

# Confusion matrix
tn, fp, fn, tp = confusion_matrix(y_test, y_pred).ravel()
print(f"\n  📋 CONFUSION MATRIX:")
print(f"  ├─ True Negatives (Real correctly):  {tn}")
print(f"  ├─ False Positives (Real as Fake):   {fp} ⚠️ (should be LOW)")
print(f"  ├─ False Negatives (Fake as Real):   {fn}")
print(f"  └─ True Positives (Fake correctly):  {tp}")

# Calculate false positive rate (important for real news detection)
fpr = fp / (fp + tn) if (fp + tn) > 0 else 0
fnr = fn / (fn + tp) if (fn + tp) > 0 else 0
print(f"\n  ⚡ KEY METRICS:")
print(f"  ├─ False Positive Rate: {fpr:.4f} ({fpr*100:.2f}%)")
print(f"  │  (Real news being marked as fake)")
print(f"  └─ False Negative Rate: {fnr:.4f} ({fnr*100:.2f}%)")
print(f"     (Fake news being marked as real)")

# Save model with better version
print(f"\n  💾 Saving improved model...")
pickle.dump(calibrated_model, open("app/models/model.pkl", "wb"))
pickle.dump(vectorizer, open("app/models/vectorizer.pkl", "wb"))

# Save model info
model_info = {
    'accuracy': accuracy,
    'precision': precision,
    'recall': recall,
    'f1_score': f1,
    'false_positive_rate': fpr,
    'false_negative_rate': fnr,
    'training_samples': len(data),
    'features': len(vectorizer.get_feature_names_out()),
    'version': '2.1 (Improved)'
}
pickle.dump(model_info, open("app/models/model_info.pkl", "wb"))

print("  ✓ Model saved to: app/models/model.pkl")
print("  ✓ Vectorizer saved to: app/models/vectorizer.pkl")
print("  ✓ Model info saved to: app/models/model_info.pkl")

print("\n" + "=" * 60)
print("✅ TRAINING COMPLETE!")
print("=" * 60)
print(f"\n🎯 SUMMARY:")
print(f"   Model Accuracy: {accuracy*100:.2f}%")
print(f"   Real news false positive rate: {fpr*100:.2f}%")
print(f"   Status: {'✅ Ready' if accuracy > 0.75 else '⚠️  Needs improvement'}")
print("\n" + "=" * 60)
