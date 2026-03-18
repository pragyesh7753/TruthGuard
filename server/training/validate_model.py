"""
Validation Script for Fake News Detection Model
Tests against legitimate news sources (Indian Government, BBC, Reuters, etc.)
"""

import pickle
import numpy as np
from app.services.preprocess import clean_text

# Load model
try:
    with open("app/models/model.pkl", 'rb') as f:
        model = pickle.load(f)
    with open("app/models/vectorizer.pkl", 'rb') as f:
        vectorizer = pickle.load(f)
    print("✅ Model loaded successfully")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    exit(1)

# Test articles from legitimate sources
legitimate_articles = {
    "Government of India": [
        """
        New Delhi: The Ministry of External Affairs announced on Tuesday that India 
        will establish a new cultural exchange program with ten South Asian nations. 
        The initiative aims to promote bilateral relations and cultural understanding. 
        According to officials, the program will involve student scholarships, 
        faculty exchanges, and art exhibitions. The first phase will commence in 
        January 2026. This decision was taken during a meeting of the Cabinet Committee 
        on Security, chaired by the Prime Minister.
        """,
        """
        The Department of Telecommunications has released new guidelines for 5G 
        deployment in rural areas. Officials stated that the initiative will provide 
        high-speed internet connectivity to over 50,000 villages. The implementation 
        will be completed in phases starting from the Eastern region. Technology 
        companies have been invited to participate in the program through a transparent 
        bid process. The government aims to bridge the digital divide and promote 
        economic development in rural communities.
        """
    ],
    
    "BBC News": [
        """
        London: Scientists at Oxford University have published a groundbreaking study 
        on renewable energy storage. The research, conducted over five years and funded 
        by the European Science Foundation, demonstrates a new battery technology that 
        could revolutionize energy storage. The findings have been peer-reviewed and 
        published in the journal Nature Energy. According to the lead researcher, 
        the technology could reduce energy costs by up to 40 percent within the next decade.
        """,
        """
        International development officials report that global poverty rates have declined 
        for the seventh consecutive year. Data from the World Bank indicates that extreme 
        poverty fell from 8.4% to 7.1% between 2020 and 2025. The improvement is attributed 
        to economic growth in developing nations, increased foreign investment, and improved 
        access to education. However, experts warn that progress remains uneven across regions.
        """
    ],
    
    "Reuters": [
        """
        The International Monetary Fund released its latest economic forecast, projecting 
        global growth of 3.2% for 2026. The analysis indicates that emerging markets will 
        experience stronger growth rates compared to developed economies. According to the 
        IMF's chief economist, inflation pressures have eased in most regions. The fund 
        recommends that policymakers focus on sustainable development and fiscal prudence.
        """,
        """
        Agricultural experts report that India's wheat production reached a record 
        high of 120 million tonnes in the 2025-26 harvest season. The increase is 
        attributed to improved farming techniques, better rainfall patterns, and 
        government support programs. Farmers received fair prices for their produce, 
        with minimum support prices increased by 7 percent this year. Agricultural 
        scientists attribute the success to the adoption of precision farming methods.
        """
    ],
    
    "The Hindu": [
        """
        Chennai: The Madras High Court issued important directives on environmental 
        protection in coastal regions. The court mandated that industrial units within 
        five kilometers of coastlines must implement stricter pollution control measures. 
        Environmental groups welcomed the decision, stating it represents a significant 
        step toward sustainable development. The ruling applies to over 200 industrial 
        establishments in Tamil Nadu. Implementation must be completed within six months.
        """,
        """
        New Delhi: The Central Board of Secondary Education announced an overhaul of 
        its examination system. The new format aims to reduce student stress while 
        maintaining educational standards. Board officials stated that the changes 
        will include continuous assessment and skill-based evaluation. The reforms 
        will be implemented starting from the next academic year. Student organizations 
        have responded positively to the announcements.
        """
    ]
}

# Potentially problematic articles (test for false positives)
test_real_articles = {
    "Scientific Research": """
    Researchers at Stanford University have developed a new method for early cancer 
    detection using artificial intelligence. The technology, which underwent clinical 
    trials with 10,000 patients, achieved 94% accuracy. Results were published in 
    The Lancet, one of the world's most respected medical journals. The peer-reviewed 
    study shows the method costs 60% less than traditional diagnostic procedures. 
    The research team plans to make the technology available for clinical use within 
    two years.
    """,
    
    "Economic Report": """
    The Reserve Bank of India's latest monetary policy review notes that inflation 
    has stabilized within target ranges. The RBI maintained its repo rate at 6.5%, 
    citing stable macroeconomic conditions. Economic growth remains robust at 6.8%, 
    according to official estimates. Employment figures show improvement across all 
    sectors. The central bank expressed confidence in India's long-term economic 
    prospects.
    """,
    
    "Technology News": """
    Major technology companies have announced a collaborative initiative to develop 
    open-source artificial intelligence tools. The project aims to make AI technology 
    accessible to smaller companies and startups. Industry experts believe this move 
    will accelerate innovation in the technology sector. Universities have also been 
    invited to participate in the research program. The initiative represents a departure 
    from traditional competitive approaches in the industry.
    """
}

def test_prediction(text, source_name, article_label=""):
    """Test a single article prediction"""
    cleaned = clean_text(text)
    if not cleaned:
        return None
    
    X = vectorizer.transform([cleaned])
    prediction = model.predict(X)[0]
    confidence = max(model.predict_proba(X)[0])
    proba = model.predict_proba(X)[0]
    
    verdict = "Real ✅" if prediction == 0 else "Fake ❌"
    real_prob = proba[0] * 100
    fake_prob = proba[1] * 100
    
    return {
        'prediction': prediction,
        'confidence': confidence,
        'verdict': verdict,
        'real_prob': real_prob,
        'fake_prob': fake_prob,
        'source': source_name,
        'label': article_label
    }

# Run validation
print("\n" + "=" * 80)
print("VALIDATION AGAINST LEGITIMATE NEWS SOURCES")
print("=" * 80)

results = []
correct_predictions = 0
total_predictions = 0

# Test legitimate articles
print("\n📰 LEGITIMATE NEWS SOURCES:")
print("(Expected: Should be predicted as REAL)")
print("-" * 80)

for source, articles in legitimate_articles.items():
    print(f"\n🔹 {source}:")
    for i, article in enumerate(articles, 1):
        result = test_prediction(article, source, "Legitimate")
        if result:
            results.append(result)
            is_correct = result['prediction'] == 0  # Should be Real (0)
            correct_predictions += is_correct
            total_predictions += 1
            
            status = "✅ CORRECT" if is_correct else "❌ FALSE POSITIVE"
            print(f"   Article {i}: {result['verdict']} ({result['confidence']*100:.1f}%) {status}")
            print(f"              Real: {result['real_prob']:.1f}% | Fake: {result['fake_prob']:.1f}%")

# Test other real articles
print(f"\n✍️  OTHER CREDIBLE ARTICLES:")
print("(Expected: Should be predicted as REAL)")
print("-" * 80)

for label, article in test_real_articles.items():
    result = test_prediction(article, label, "Credible")
    if result:
        results.append(result)
        is_correct = result['prediction'] == 0  # Should be Real (0)
        correct_predictions += is_correct
        total_predictions += 1
        
        status = "✅ CORRECT" if is_correct else "❌ FALSE POSITIVE"
        print(f"\n🔹 {label}: {result['verdict']} ({result['confidence']*100:.1f}%) {status}")
        print(f"   Real: {result['real_prob']:.1f}% | Fake: {result['fake_prob']:.1f}%")

# Summary statistics
print("\n" + "=" * 80)
print("VALIDATION SUMMARY")
print("=" * 80)

if results:
    accuracy = (correct_predictions / total_predictions) * 100
    false_positives = sum(1 for r in results if r['prediction'] != 0)
    
    print(f"\n📊 STATISTICS:")
    print(f"   Total tests: {total_predictions}")
    print(f"   Correct predictions: {correct_predictions}")
    print(f"   Accuracy: {accuracy:.1f}%")
    print(f"   False positives (Real marked as Fake): {false_positives}")
    
    print(f"\n⚠️  FALSE POSITIVE RATE ANALYSIS:")
    false_positive_ratio = (false_positives / total_predictions) * 100
    print(f"   Current false positive rate: {false_positive_ratio:.1f}%")
    
    if false_positive_ratio > 10:
        print(f"   🔴 WARNING: High false positive rate!")
        print(f"   Recommendation: Rebalance model or adjust threshold")
    elif false_positive_ratio > 5:
        print(f"   🟡 CAUTION: Moderate false positive rate")
        print(f"   Recommendation: Monitor and consider fine-tuning")
    else:
        print(f"   🟢 GOOD: Low false positive rate")
        print(f"   Recommendation: Model is performing well on real articles")
    
    # Average confidence scores
    avg_confidence = np.mean([r['confidence'] for r in results])
    print(f"\n📈 CONFIDENCE METRICS:")
    print(f"   Average confidence: {avg_confidence*100:.1f}%")
    print(f"   Confidence range: {min(r['confidence'] for r in results)*100:.1f}% - {max(r['confidence'] for r in results)*100:.1f}%")

print("\n" + "=" * 80)
print("✅ VALIDATION COMPLETE")
print("=" * 80)
