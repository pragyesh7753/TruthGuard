import re
from nltk.corpus import stopwords

stop_words = set(stopwords.words("english"))


def clean_text(text):
    text = re.sub("[^a-zA-Z]", " ", str(text))
    text = text.lower()
    words = text.split()
    words = [w for w in words if w not in stop_words]
    return " ".join(words)
