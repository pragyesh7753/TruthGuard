import { useState } from "react";
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

/* =========================================
   Detector Page
   
   UI-only fake news detector interface.
   Simulates: idle → loading → result flow.
   No real API calls — ready to integrate later.
   ========================================= */

/* Status enum for readability */
const STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  RESULT: "result",
};

/* Mock result data — will be replaced with API response */
const MOCK_RESULT = {
  verdict: "Likely Fake",
  confidence: 87,
  label: "fake", // "real" | "fake" | "uncertain"
  summary:
    "The article contains several misleading claims, emotionally charged language, and references unverified sources. Our AI model detected patterns commonly associated with fabricated news.",
  indicators: [
    { label: "Sensational Language", level: "high" },
    { label: "Source Credibility", level: "low" },
    { label: "Factual Consistency", level: "low" },
    { label: "Emotional Manipulation", level: "high" },
  ],
};

function Detector() {
  const [newsText, setNewsText] = useState("");
  const [status, setStatus] = useState(STATUS.IDLE);
  const [result, setResult] = useState(null);

  /**
   * Handles the analyze action.
   * Simulates a loading delay, then shows mock results.
   * Replace the setTimeout with a real API call later.
   */
  const handleAnalyze = () => {
    if (!newsText.trim()) return;

    setStatus(STATUS.LOADING);
    setResult(null);

    // Simulated delay — replace with actual API call
    setTimeout(() => {
      setResult(MOCK_RESULT);
      setStatus(STATUS.RESULT);
    }, 2000);
  };

  /** Resets the form back to idle state */
  const handleReset = () => {
    setNewsText("");
    setStatus(STATUS.IDLE);
    setResult(null);
  };

  return (
    <div className="detector-page">
      <div className="detector-container">
        {/* Page header */}
        <div className="detector-header">
          <h1 className="detector-title">
            News <span className="text-gradient">Detector</span>
          </h1>
          <p className="detector-subtitle">
            Paste a news article below and let our AI analyze its credibility.
          </p>
        </div>

        {/* Input card */}
        <div className="detector-input-card glass-card">
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
        </div>

        {/* Loading state */}
        {status === STATUS.LOADING && <LoadingIndicator />}

        {/* Result card */}
        {status === STATUS.RESULT && result && (
          <ResultCard result={result} />
        )}
      </div>
    </div>
  );
}

/* -----------------------------------------
   Loading Indicator
   Shown while the "AI model" processes.
   ----------------------------------------- */
function LoadingIndicator() {
  return (
    <div className="detector-loading glass-card">
      <div className="loading-spinner" />
      <p className="loading-text">Analyzing article with AI...</p>
      <p className="loading-subtext">
        Running NLP pipeline and deep learning model
      </p>
    </div>
  );
}

/* -----------------------------------------
   Result Card
   Displays the analysis verdict, confidence,
   summary, and risk indicators.
   ----------------------------------------- */
function ResultCard({ result }) {
  const verdictConfig = {
    fake: {
      icon: ShieldAlert,
      colorClass: "verdict-fake",
      bgClass: "verdict-bg-fake",
    },
    real: {
      icon: ShieldCheck,
      colorClass: "verdict-real",
      bgClass: "verdict-bg-real",
    },
    uncertain: {
      icon: AlertTriangle,
      colorClass: "verdict-uncertain",
      bgClass: "verdict-bg-uncertain",
    },
  };

  const config = verdictConfig[result.label] || verdictConfig.uncertain;
  const VerdictIcon = config.icon;

  return (
    <div className="detector-result glass-card">
      {/* Verdict header */}
      <div className={`result-verdict-bar ${config.bgClass}`}>
        <div className="result-verdict-left">
          <VerdictIcon size={28} />
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

      {/* Summary */}
      <div className="result-section">
        <h3 className="result-section-title">
          <Clock size={16} />
          Analysis Summary
        </h3>
        <p className="result-summary">{result.summary}</p>
      </div>

      {/* Risk indicators */}
      <div className="result-section">
        <h3 className="result-section-title">
          <AlertTriangle size={16} />
          Risk Indicators
        </h3>
        <div className="result-indicators">
          {result.indicators.map((indicator) => (
            <div key={indicator.label} className="indicator-item">
              <span className="indicator-label">{indicator.label}</span>
              <span className={`indicator-level level-${indicator.level}`}>
                {indicator.level}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Detector;
