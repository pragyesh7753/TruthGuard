# 🛡️ TruthGuard - AI Fake News Detector

A full-stack application using React frontend + Python/FastAPI backend to detect fake news using machine learning.

---

## 🚀 Quick Start (30 seconds)

### Windows:
```bash
START.bat
```

### Mac/Linux:
```bash
bash START.sh
```

Then open:
- **Frontend:** http://localhost:5173
- **Backend:** http://127.0.0.1:8000
- **API Docs:** http://127.0.0.1:8000/docs

---

## 📋 Manual Setup

### Backend
```bash
cd server
python -m venv .venv
.venv\Scripts\activate  # or: source .venv/bin/activate (Mac/Linux)
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd client
npm install
npm run dev
```

---

## ✅ Features

### 🎯 Detector Page - LIVE ✅
- Real-time news analysis with ML model
- Confidence score display (0-100%)
- Animated verdict (Real or Fake)
- Direct backend API integration
- Error handling with helpful messages

### 📊 Dashboard Page - LIVE ✅
- Pie chart: Fake vs Real news distribution
- Bar chart: Top fake news topics
- Live data from dataset analysis
- Responsive design

### 🏠 Home Page
- Landing page with project overview
- Beautiful animations
- Call to action to Detector

---

## 🔌 Connection Status

| Component | Status | Connection |
|-----------|--------|-----------|
| Detector | ✅ LIVE | POST /predict |
| Dashboard | ✅ LIVE | GET /analytics |
| API Helper | ✅ READY | Debug logging enabled |
| Error Handling | ✅ READY | User-friendly messages |

---

## 📊 How It Works

### Detector Flow
```
User input → Click "Analyze" → POST /predict 
→ ML Model analyzes → Returns prediction 
→ Frontend shows result with animation
```

### Dashboard Flow
```
Page loads → GET /analytics 
→ Backend analyzes datasets → Returns counts + topics
→ Frontend renders charts
```

---

## 🔍 API Endpoints

### POST /predict
```json
Request: { "news": "article text..." }
Response: { "prediction": 0, "confidence": 0.95 }
```
- prediction: 0 = Real, 1 = Fake
- confidence: 0.0-1.0

### GET /analytics
```json
Response: {
  "fake_count": 23481,
  "real_count": 21417,
  "top_topics": [{"topic": "politics", "count": 12000}]
}
```

---

## 📚 Documentation

- **FRONTEND_BACKEND_GUIDE.md** - Complete setup & troubleshooting
- **TESTING_GUIDE.md** - Step-by-step testing instructions  
- **IMPLEMENTATION_SUMMARY.md** - What was changed & how

---

## 🐛 Debugging

### Console Logs
All API requests logged with `[API]` prefix. Open F12 → Console to see:
```
[API] Request Start: ...
[API] Response Status: 200 OK
[Detector] Starting analysis...
```

### Quick Checks
1. Backend running? → http://127.0.0.1:8000
2. Frontend running? → http://localhost:5173
3. API working? → Check F12 Console
4. Models loaded? → Check `server/app/models/`
5. Dataset loaded? → Check `server/dataset/`

---

## 📁 Project Structure

```
TruthGuard/
├── client/                    # React Frontend
│   ├── src/pages/
│   │   ├── Detector.jsx      # News analyzer (LIVE ✅)
│   │   ├── Dashboard.jsx     # Analytics (LIVE ✅)
│   │   └── Home.jsx
│   ├── src/services/
│   │   └── api.js            # API + debug logging
│   └── package.json
│
├── server/                    # Python Backend
│   ├── app/routes/
│   │   ├── predict.py        # /predict endpoint
│   │   └── analytics.py      # /analytics endpoint
│   ├── app/models/           # model.pkl, vectorizer.pkl
│   ├── dataset/              # Fake.csv, True.csv
│   └── requirements.txt
│
├── FRONTEND_BACKEND_GUIDE.md
├── TESTING_GUIDE.md
├── IMPLEMENTATION_SUMMARY.md
├── START.bat                 # Windows quick start
├── START.sh                  # Mac/Linux quick start
└── README.md                 # This file
```

---

## ✨ Recently Added

✅ Full frontend-backend connection
✅ Debug logging in API helper
✅ Enhanced error messages
✅ Console logs for debugging
✅ Configuration examples
✅ Complete documentation
✅ Testing guides
✅ Quick start scripts

---

## 🆘 Troubleshooting

### "Backend not reachable"
- Start backend: `uvicorn app.main:app --reload` in server folder
- Check: http://127.0.0.1:8000

### "No prediction returned"
- Check model files exist: `server/app/models/model.pkl`
- Check vectorizer: `server/app/models/vectorizer.pkl`
- Check backend logs for errors

### "Dashboard shows no data"
- Check dataset files: `server/dataset/Fake.csv`, `True.csv`
- Check backend logs for Spark errors

### Check Logs
- Browser: F12 → Console (look for `[API]` logs)
- Backend: Terminal where uvicorn is running
- Both show `[ERROR]` if something fails

---

## 🎯 Status

✅ **FULLY CONNECTED AND WORKING**
- Detector: Analyzing news with ML model
- Dashboard: Showing real statistics
- Debugging: Console logs enabled
- Error handling: User-friendly messages

Ready to use! Open http://localhost:5173 🚀
