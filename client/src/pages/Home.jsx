import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Newspaper,
  BrainCircuit,
  Cpu,
  CheckCircle,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

/* =========================================
   How It Works — pipeline steps
   ========================================= */
const PIPELINE_STEPS = [
  {
    icon: Newspaper,
    title: "News Article",
    description: "Paste any news article URL or text you want to verify.",
  },
  {
    icon: BrainCircuit,
    title: "NLP Processing",
    description: "Natural Language Processing extracts key linguistic features.",
  },
  {
    icon: Cpu,
    title: "AI Model",
    description: "Our trained deep learning model analyzes patterns and credibility.",
  },
  {
    icon: CheckCircle,
    title: "Prediction",
    description: "Get a clear verdict — Real or Fake — with a confidence score.",
  },
];

/* =========================================
   Tech Stack — technologies used
   ========================================= */
const TECH_STACK = [
  { name: "React", description: "Modern UI framework" },
  { name: "Python", description: "Backend & ML pipeline" },
  { name: "TensorFlow", description: "Deep learning model" },
  { name: "NLP", description: "Text analysis engine" },
  { name: "Node.js", description: "API server runtime" },
  { name: "MongoDB", description: "Data storage layer" },
];

/* =========================================
   Home Page Component
   ========================================= */
function Home() {
  return (
    <div className="home-page">
      <HeroSection />
      <HowItWorksSection />
      <TechStackSection />
    </div>
  );
}

/* -----------------------------------------
   Hero Section
   ----------------------------------------- */
function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-grid">
        {/* Left — Text content */}
        <div className="hero-content">
          <div className="hero-badge">
            <ShieldCheck size={16} />
            <span>AI-Powered Verification</span>
          </div>

          <h1 className="hero-title">
            AI-Powered{" "}
            <span className="text-gradient">Fake News</span>{" "}
            Detection
          </h1>

          <p className="hero-description">
            TruthGuard uses advanced Natural Language Processing and deep learning
            to analyze news articles in real time. Detect misinformation before
            it spreads — fast, accurate, and transparent.
          </p>

          <div className="hero-actions">
            <Link to="/detector" className="btn-primary">
              Try Detector
              <ArrowRight size={18} />
            </Link>
            <a href="#how-it-works" className="btn-secondary">
              How It Works
              <ChevronRight size={18} />
            </a>
          </div>

          {/* Quick stats */}
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-value">96%</span>
              <span className="hero-stat-label">Accuracy</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-value">50K+</span>
              <span className="hero-stat-label">Articles Analyzed</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-value">&lt;2s</span>
              <span className="hero-stat-label">Avg. Response</span>
            </div>
          </div>
        </div>

        {/* Right — AI illustration */}
        <div className="hero-illustration">
          <div className="hero-image-wrapper">
            <img
              src="/ai-hero.png"
              alt="AI neural network illustration representing fake news detection"
              className="hero-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* -----------------------------------------
   How It Works Section
   ----------------------------------------- */
function HowItWorksSection() {
  return (
    <section id="how-it-works" className="section">
      <div className="section-container">
        <h2 className="section-title">
          How It <span className="text-gradient">Works</span>
        </h2>
        <p className="section-subtitle">
          From article input to AI prediction — a streamlined four-step pipeline.
        </p>

        <div className="pipeline-grid">
          {PIPELINE_STEPS.map((step, index) => (
            <div key={step.title} className="pipeline-card glass-card">
              {/* Step number */}
              <span className="pipeline-step-number">
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Icon */}
              <div className="pipeline-icon">
                <step.icon size={28} />
              </div>

              <h3 className="pipeline-card-title">{step.title}</h3>
              <p className="pipeline-card-description">{step.description}</p>

              {/* Connector arrow (not on the last card) */}
              {index < PIPELINE_STEPS.length - 1 && (
                <div className="pipeline-connector">
                  <ChevronRight size={20} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -----------------------------------------
   Tech Stack Section
   ----------------------------------------- */
function TechStackSection() {
  return (
    <section className="section">
      <div className="section-container">
        <h2 className="section-title">
          Built With <span className="text-gradient">Modern Tech</span>
        </h2>
        <p className="section-subtitle">
          Industry-standard tools and frameworks powering TruthGuard.
        </p>

        <div className="tech-grid">
          {TECH_STACK.map((tech) => (
            <div key={tech.name} className="tech-card glass-card">
              <h3 className="tech-card-name">{tech.name}</h3>
              <p className="tech-card-description">{tech.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Home;
