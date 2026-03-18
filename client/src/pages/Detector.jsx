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
  Zap,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { predictNews } from "../services/api";


const STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  RESULT: "result",
};

const DEFAULT_INDICATORS = [
  { label: "Sensational Language", level: "medium" },
  { label: "Source Credibility", level: "medium" },
  { label: "Factual Consistency", level: "medium" },
  { label: "Emotional Manipulation", level: "medium" },
];

function getConfidencePercent(value) {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return 0;
  return numeric <= 1 ? Math.round(numeric * 100) : Math.round(numeric);
}

function buildResult(prediction, confidence, importantFeatures = [], cleanedText = "", realProb = 0, fakeProb = 0) {
  const label = prediction === 0 ? "real" : "fake";
  const confidencePercent = getConfidencePercent(confidence);

  return {
    verdict: label === "real" ? "Likely Real" : "Likely Fake",
    confidence: confidencePercent,
    label,
    summary:
      label === "real"
        ? "The model found the content consistent with credible reporting patterns and factual language."
        : "The model detected patterns commonly associated with fabricated or misleading content.",
    indicators: DEFAULT_INDICATORS,
    importantFeatures: importantFeatures || [],
    cleanedText: cleanedText || "",
    realProb: getConfidencePercent(realProb),
    fakeProb: getConfidencePercent(fakeProb),
  };
}

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

  const handleAnalyze = async () => {
    if (!newsText.trim()) {
      toast.warning("⚠️ Please enter some text to analyze.", { autoClose: 2000 });
      return;
    }
    if (status === STATUS.LOADING) return;

    setStatus(STATUS.LOADING);
    setResult(null);
    console.log("[Detector] Starting analysis with text length:", newsText.trim().length);
    
    try {
      toast.info("🔍 Analyzing article...", { autoClose: 2000 });
    } catch (e) {}

    try {
      console.log("[Detector] Calling predictNews API...");
      const data = await predictNews(newsText.trim());
      console.log("[Detector] API Response:", data);
      
      const prediction = Number(data?.prediction);
      const confidence = Number(data?.confidence);
      const importantFeatures = data?.important_features || [];
      const cleanedText = data?.cleaned_text || "";
      const realProb = Number(data?.real_probability || 0);
      const fakeProb = Number(data?.fake_probability || 0);
      
      console.log("[Detector] Parsed -> prediction:", prediction, "confidence:", confidence);
      console.log("[Detector] Important features:", importantFeatures);
      
      if (Number.isNaN(prediction)) {
        throw new Error("Invalid prediction value from server");
      }
      
      const nextResult = buildResult(prediction, confidence, importantFeatures, cleanedText, realProb, fakeProb);
      console.log("[Detector] Built result:", nextResult);

      setResult(nextResult);
      setStatus(STATUS.RESULT);
      try {
        toast.success("✅ Analysis complete!", { autoClose: 3000 });
      } catch (e) {}
    } catch (error) {
      console.error("[Detector] Error during analysis:", error);
      setStatus(STATUS.IDLE);
      setResult(null);
      try {
        const errorMsg = error?.message || "Failed to analyze the article. Please check if the backend is running.";
        toast.error(errorMsg, {
          autoClose: 4000,
        });
      } catch (e) {}
    }
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

      {/* Probability breakdown */}
      <motion.div
        className="result-section"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.8 }}
      >
        <h3 className="result-section-title">
          <BarChart3 size={16} />
          Probability Analysis
        </h3>
        <div className="probability-breakdown">
          <div className="prob-item real">
            <div className="prob-label">Real</div>
            <div className="prob-bar-container">
              <motion.div
                className="prob-bar real-bar"
                initial={{ width: "0%" }}
                animate={{ width: `${result.realProb}%` }}
                transition={{ duration: 1, delay: 0.9 }}
              />
            </div>
            <div className="prob-value">{result.realProb}%</div>
          </div>
          <div className="prob-item fake">
            <div className="prob-label">Fake</div>
            <div className="prob-bar-container">
              <motion.div
                className="prob-bar fake-bar"
                initial={{ width: "0%" }}
                animate={{ width: `${result.fakeProb}%` }}
                transition={{ duration: 1, delay: 0.9 }}
              />
            </div>
            <div className="prob-value">{result.fakeProb}%</div>
          </div>
        </div>
      </motion.div>

      {/* Important features that influenced prediction */}
      {result.importantFeatures && result.importantFeatures.length > 0 && (
        <motion.div
          className="result-section"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 1.0 }}
        >
          <h3 className="result-section-title">
            <Zap size={16} />
            Key Words Influencing Prediction
          </h3>
          <div className="features-list">
            {result.importantFeatures.map((feature, i) => (
              <motion.div
                key={i}
                className="feature-item"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 1.1 + i * 0.08 }}
              >
                <span className="feature-word">"{feature.word}"</span>
                <span className={`feature-impact ${feature.impact}`}>
                  {feature.impact === "increases_fake" ? "Suggests Fake" : "Suggests Real"}
                </span>
                <div className="feature-importance">
                  <div className="feature-bar-container">
                    <motion.div
                      className="feature-bar"
                      initial={{ width: "0%" }}
                      animate={{ width: `${Math.min(feature.importance * 100, 100)}%` }}
                      transition={{ duration: 0.8, delay: 1.2 + i * 0.08 }}
                    />
                  </div>
                  <span className="feature-score">
                    {(feature.importance).toFixed(2)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Cleaned text preview */}
      {result.cleanedText && (
        <motion.div
          className="result-section"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 1.3 }}
        >
          <h3 className="result-section-title">
            <Eye size={16} />
            Processed Text (Cleaned)
          </h3>
          <div className="cleaned-text-preview">
            {result.cleanedText.substring(0, 400)}
            {result.cleanedText.length > 400 ? "..." : ""}
          </div>
          <p className="cleaned-text-note">
            This is how the model sees your text after removing stopwords and special characters.
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default Detector;
