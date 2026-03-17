import { useState, useEffect } from "react";
import {
  Search,
  Loader,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  BarChart3,
  Clock,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

/* =========================================
   Detector Page

   UI-only fake news detector interface.
   Simulates: idle → loading → result flow.
   Enhanced with Framer Motion animations,
   Lottie loading, and toast notifications.
   ========================================= */

const STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  RESULT: "result",
};

const MOCK_RESULT = {
  verdict: "Likely Fake",
  confidence: 87,
  label: "fake",
  summary:
    "The article contains several misleading claims, emotionally charged language, and references unverified sources. Our AI model detected patterns commonly associated with fabricated news.",
  indicators: [
    { label: "Sensational Language", level: "high" },
    { label: "Source Credibility", level: "low" },
    { label: "Factual Consistency", level: "low" },
    { label: "Emotional Manipulation", level: "high" },
  ],
};

/* =========================================
   Framer Motion variants
   ========================================= */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut", delay },
  }),
};

const resultSpring = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15, mass: 0.8 },
  },
  exit: {
    opacity: 0,
    y: -30,
    scale: 0.95,
    transition: { duration: 0.25 },
  },
};

const loadingVariant = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.2 },
  },
};

/* =========================================
   Main Detector Component
   ========================================= */
function Detector() {
  const [newsText, setNewsText] = useState("");
  const [status, setStatus] = useState(STATUS.IDLE);
  const [result, setResult] = useState(null);

  const handleAnalyze = () => {
    if (!newsText.trim()) return;

    setStatus(STATUS.LOADING);
    setResult(null);
    try { toast.info("🔍 Analyzing article...", { autoClose: 2000 }); } catch(e) {}

    setTimeout(() => {
      setResult(MOCK_RESULT);
      setStatus(STATUS.RESULT);
      try { toast.success("✅ Analysis complete!", { autoClose: 3000 }); } catch(e) {}
    }, 2500);
  };

  const handleReset = () => {
    setNewsText("");
    setStatus(STATUS.IDLE);
    setResult(null);
  };

  return (
    <div className="detector-page">
      <div className="detector-container">
        {/* Page header — fade in */}
        <motion.div
          className="detector-header"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <h1 className="detector-title">
            News <span className="text-gradient">Detector</span>
          </h1>
          <p className="detector-subtitle">
            Paste a news article below and let our AI analyze its credibility.
          </p>
        </motion.div>

        {/* Input card — fade in with delay */}
        <motion.div
          className="detector-input-card glass-card"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.15}
        >
          <label htmlFor="news-input" className="detector-label">
            <FileText size={18} />
            News Article Text
          </label>

          <textarea
            id="news-input"
            className="detector-textarea"
            placeholder="Paste the full news article or claim here..."
            rows={8}
            value={newsText}
            onChange={(e) => setNewsText(e.target.value)}
            disabled={status === STATUS.LOADING}
          />

          <div className="detector-input-footer">
            <span className="detector-char-count">
              {newsText.length} characters
            </span>

            <div className="detector-actions">
              {status !== STATUS.IDLE && (
                <button
                  className="btn-secondary"
                  onClick={handleReset}
                  type="button"
                >
                  Clear
                </button>
              )}
              <button
                className="btn-primary"
                onClick={handleAnalyze}
                disabled={!newsText.trim() || status === STATUS.LOADING}
                type="button"
              >
                {status === STATUS.LOADING ? (
                  <>
                    <Loader size={18} className="spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    Analyze News
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Animated loading / result area */}
        <AnimatePresence mode="wait">
          {status === STATUS.LOADING && (
            <motion.div
              key="loading"
              variants={loadingVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <LoadingIndicator />
            </motion.div>
          )}

          {status === STATUS.RESULT && result && (
            <motion.div
              key="result"
              variants={resultSpring}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <ResultCard result={result} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* -----------------------------------------
   Loading Indicator — CSS pulsing scanner
   ----------------------------------------- */
function LoadingIndicator() {
  return (
    <div className="detector-loading glass-card">
      <div className="scanner-rings">
        <div className="scanner-ring scanner-ring-1" />
        <div className="scanner-ring scanner-ring-2" />
        <div className="scanner-ring scanner-ring-3" />
        <div className="scanner-dot" />
      </div>
      <p className="loading-text">Analyzing article with AI...</p>
      <p className="loading-subtext">
        Running NLP pipeline and deep learning model
      </p>
    </div>
  );
}

/* -----------------------------------------
   Animated Confidence Bar
   ----------------------------------------- */
function ConfidenceBar({ value, colorClass }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // Trigger animation after mount
    const timeout = setTimeout(() => setWidth(value), 100);
    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <div className="confidence-bar-container">
      <div className="confidence-bar-track">
        <motion.div
          className={`confidence-bar-fill ${colorClass}`}
          initial={{ width: "0%" }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
      </div>
      <span className="confidence-bar-label">{value}% confidence</span>
    </div>
  );
}

/* -----------------------------------------
   Result Card — with staggered sections
   ----------------------------------------- */
function ResultCard({ result }) {
  const verdictConfig = {
    fake: {
      icon: ShieldAlert,
      colorClass: "verdict-fake",
      bgClass: "verdict-bg-fake",
      barClass: "bar-fill-fake",
    },
    real: {
      icon: ShieldCheck,
      colorClass: "verdict-real",
      bgClass: "verdict-bg-real",
      barClass: "bar-fill-real",
    },
    uncertain: {
      icon: AlertTriangle,
      colorClass: "verdict-uncertain",
      bgClass: "verdict-bg-uncertain",
      barClass: "bar-fill-uncertain",
    },
  };

  const config = verdictConfig[result.label] || verdictConfig.uncertain;
  const VerdictIcon = config.icon;

  return (
    <div className="detector-result glass-card">
      {/* Verdict header */}
      <div className={`result-verdict-bar ${config.bgClass}`}>
        <div className="result-verdict-left">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 }}
          >
            <VerdictIcon size={28} />
          </motion.div>
          <div>
            <p className="result-verdict-label">Verdict</p>
            <h2 className={`result-verdict-text ${config.colorClass}`}>
              {result.verdict}
            </h2>
          </div>
        </div>

        <div className="result-confidence">
          <BarChart3 size={18} />
          <span className="result-confidence-value">
            {result.confidence}%
          </span>
          <span className="result-confidence-label">confidence</span>
        </div>
      </div>

      {/* Animated confidence bar */}
      <div className="result-section">
        <ConfidenceBar value={result.confidence} colorClass={config.barClass} />
      </div>

      {/* Summary */}
      <motion.div
        className="result-section"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <h3 className="result-section-title">
          <Clock size={16} />
          Analysis Summary
        </h3>
        <p className="result-summary">{result.summary}</p>
      </motion.div>

      {/* Risk indicators — staggered */}
      <motion.div
        className="result-section"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <h3 className="result-section-title">
          <AlertTriangle size={16} />
          Risk Indicators
        </h3>
        <div className="result-indicators">
          {result.indicators.map((indicator, i) => (
            <motion.div
              key={indicator.label}
              className="indicator-item"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.7 + i * 0.1 }}
            >
              <span className="indicator-label">{indicator.label}</span>
              <span className={`indicator-level level-${indicator.level}`}>
                {indicator.level}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default Detector;
