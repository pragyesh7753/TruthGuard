import pandas as pd
import os
from difflib import SequenceMatcher
from app.services.preprocess import clean_text

# Load datasets once
DATASETS_LOADED = False
TRUE_NEWS = []
FAKE_NEWS = []

def load_datasets():
    """Load True.csv and Fake.csv into memory"""
    global DATASETS_LOADED, TRUE_NEWS, FAKE_NEWS
    
    if DATASETS_LOADED:
        return
    
    try:
        # Load true news
        true_path = "server/dataset/True.csv"
        if not os.path.exists(true_path):
            true_path = "dataset/True.csv"
        
        df_true = pd.read_csv(true_path)
        # Combine text and title columns if they exist
        if 'text' in df_true.columns:
            TRUE_NEWS = df_true['text'].tolist()
        elif 'news' in df_true.columns:
            TRUE_NEWS = df_true['news'].tolist()
        else:
            TRUE_NEWS = df_true.iloc[:, 0].tolist()  # First column
        
        # Load fake news
        fake_path = "server/dataset/Fake.csv"
        if not os.path.exists(fake_path):
            fake_path = "dataset/Fake.csv"
        
        df_fake = pd.read_csv(fake_path)
        # Combine text and title columns if they exist
        if 'text' in df_fake.columns:
            FAKE_NEWS = df_fake['text'].tolist()
        elif 'news' in df_fake.columns:
            FAKE_NEWS = df_fake['news'].tolist()
        else:
            FAKE_NEWS = df_fake.iloc[:, 0].tolist()  # First column
        
        DATASETS_LOADED = True
        print(f"Loaded {len(TRUE_NEWS)} true news and {len(FAKE_NEWS)} fake news articles")
        
    except Exception as e:
        print(f"Error loading datasets: {e}")
        DATASETS_LOADED = False


def similarity_ratio(text1, text2):
    """Calculate similarity between two texts (0.0 to 1.0)"""
    return SequenceMatcher(None, text1.lower(), text2.lower()).ratio()


def find_best_match(input_text, news_list, threshold=0.5):
    """Find best matching news from list, return (best_match_text, confidence)"""
    if not news_list or not input_text:
        return None, 0.0
    
    cleaned_input = clean_text(input_text)
    best_match = None
    best_similarity = 0.0
    
    # Optimized sampling: check more articles but not all
    # Use stratified sampling across the dataset for better coverage
    sample_size = min(5000, len(news_list))
    
    if sample_size >= len(news_list):
        # If dataset is small enough, check all
        sample_indices = range(len(news_list))
    else:
        # Sample evenly across the dataset instead of just first N
        step = len(news_list) // sample_size
        sample_indices = range(0, len(news_list), step)[:sample_size]
    
    for idx in sample_indices:
        try:
            news = news_list[int(idx)]
            cleaned_news = clean_text(str(news))
            similarity = similarity_ratio(cleaned_input, cleaned_news)
            
            if similarity > best_similarity:
                best_similarity = similarity
                best_match = news
        except Exception as e:
            # Skip articles that cause processing errors
            continue
    
    if best_similarity >= threshold:
        return best_match, best_similarity
    
    return None, best_similarity


def predict_from_dataset(text):
    """
    Match input text against datasets.
    Returns (prediction, confidence)
    prediction: 0 = Real (found in True.csv), 1 = Fake (found in Fake.csv)
    confidence: 0.0-1.0 similarity score
    """
    load_datasets()
    
    if not text or not text.strip():
        return 0, 0.0
    
    # Check against fake news first (more important to catch)
    fake_match, fake_confidence = find_best_match(text, FAKE_NEWS, threshold=0.5)
    
    # Check against true news
    true_match, true_confidence = find_best_match(text, TRUE_NEWS, threshold=0.5)
    
    print(f"Matching results:")
    print(f"   True match confidence: {true_confidence:.2%}")
    print(f"   Fake match confidence: {fake_confidence:.2%}")
    
    # Strategy: Compare which dataset the text matches better with
    # The one with HIGHER confidence is the predicted classification
    # If fake_confidence is higher, it's fake (prediction=1)
    # If true_confidence is higher, it's real (prediction=0)
    
    if fake_confidence > true_confidence:
        # Fake news match is stronger
        return 1, fake_confidence
    elif true_confidence > fake_confidence:
        # Real news match is stronger
        return 0, true_confidence
    elif fake_confidence >= 0.3 or true_confidence >= 0.3:
        # One has decent match, use that
        return (1, fake_confidence) if fake_confidence >= true_confidence else (0, true_confidence)
    else:
        # Both too weak - default to real (conservative approach)
        return 0, max(true_confidence, fake_confidence)
