import { useState, useEffect, useRef } from "react";
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
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";

/* =========================================
   Typewriter Hook — loops forever
   ========================================= */
const TYPEWRITER_FULL_TEXT = "AI-Powered Fake News Detection";
const TYPING_SPEED = 80;
const ERASING_SPEED = 40;
const PAUSE_AFTER_TYPING = 1500;
const PAUSE_AFTER_ERASING = 500;

function useTypewriter(text, typingSpeed, erasingSpeed) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let charIndex = 0;
    let isErasing = false;
    let timeout;

    function tick() {
      if (!isErasing) {
        charIndex++;
        setDisplayedText(text.slice(0, charIndex));
        if (charIndex >= text.length) {
          isErasing = true;
          timeout = setTimeout(tick, PAUSE_AFTER_TYPING);
        } else {
          timeout = setTimeout(tick, typingSpeed);
        }
      } else {
        charIndex--;
        setDisplayedText(text.slice(0, charIndex));
        if (charIndex <= 0) {
          isErasing = false;
          timeout = setTimeout(tick, PAUSE_AFTER_ERASING);
        } else {
          timeout = setTimeout(tick, erasingSpeed);
        }
      }
    }

    timeout = setTimeout(tick, typingSpeed);
    return () => clearTimeout(timeout);
  }, [text, typingSpeed, erasingSpeed]);

  return { displayedText };
}

/* =========================================
   Render typed text with gradient on "Fake News"
   ========================================= */
function renderTypedTitle(text) {
  const gradientStart = TYPEWRITER_FULL_TEXT.indexOf("Fake News");
  const gradientEnd = gradientStart + "Fake News".length;

  if (text.length <= gradientStart) {
    return <>{text}</>;
  } else if (text.length <= gradientEnd) {
    const before = text.slice(0, gradientStart);
    const gradientPart = text.slice(gradientStart);
    return (
      <>
        {before}
        <span className="text-gradient">{gradientPart}</span>
      </>
    );
  } else {
    const before = text.slice(0, gradientStart);
    const gradientPart = text.slice(gradientStart, gradientEnd);
    const after = text.slice(gradientEnd);
    return (
      <>
        {before}
        <span className="text-gradient">{gradientPart}</span>
        {after}
      </>
    );
  }
}

/* =========================================
   Custom CountUp Hook — React 19 safe
   Uses requestAnimationFrame for smooth counting.
   ========================================= */
function useCountUp(end, duration = 2000, shouldStart = false) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!shouldStart) return;
    let startTime = null;
    let raf;

    function animate(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress);
      setValue(Math.floor(eased * end));
      if (progress < 1) {
        raf = requestAnimationFrame(animate);
      } else {
        setValue(end);
      }
    }

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [end, duration, shouldStart]);

  return value;
}

/* =========================================
   Framer Motion — reusable animation variants
   ========================================= */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const staggerChild = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/* =========================================
   Data constants
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

const TECH_STACK = [
  { name: "React", description: "Modern UI framework" },
  { name: "Python", description: "Backend & ML pipeline" },
  { name: "TensorFlow", description: "Deep learning model" },
  { name: "NLP", description: "Text analysis engine" },
  { name: "Node.js", description: "API server runtime" },
  { name: "MongoDB", description: "Data storage layer" },
];

/* =========================================
   Animated Stat — counts up when in view
   ========================================= */
function AnimatedStat({ end, suffix = "", prefix = "", label }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });
  const count = useCountUp(end, 2000, inView);

  return (
    <div className="hero-stat" ref={ref}>
      <span className="hero-stat-value">
        {prefix}{count}{suffix}
      </span>
      <span className="hero-stat-label">{label}</span>
    </div>
  );
}

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
  const { displayedText } = useTypewriter(
    TYPEWRITER_FULL_TEXT,
    TYPING_SPEED,
    ERASING_SPEED
  );

  // Parallax for the hero illustration
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <section className="hero-section" ref={heroRef}>
      <div className="hero-grid">
        {/* Left — Text content with scroll reveal */}
        <motion.div
          className="hero-content"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div className="hero-badge" variants={staggerChild}>
            <ShieldCheck size={16} />
            <span>AI-Powered Verification</span>
          </motion.div>

          <motion.h1 className="hero-title" variants={staggerChild}>
            {renderTypedTitle(displayedText)}
            <span className="typewriter-cursor">|</span>
          </motion.h1>

          <motion.p className="hero-description" variants={staggerChild}>
            TruthGuard uses advanced Natural Language Processing and deep learning
            to analyze news articles in real time. Detect misinformation before
            it spreads — fast, accurate, and transparent.
          </motion.p>

          <motion.div className="hero-actions" variants={staggerChild}>
            <Link to="/detector" className="btn-primary">
              Try Detector
              <ArrowRight size={18} />
            </Link>
            <a href="#how-it-works" className="btn-secondary">
              How It Works
              <ChevronRight size={18} />
            </a>
          </motion.div>

          {/* Animated stats */}
          <motion.div className="hero-stats" variants={staggerChild}>
            <AnimatedStat end={96} suffix="%" label="Accuracy" />
            <div className="hero-stat-divider" />
            <AnimatedStat end={50} suffix="K+" label="Articles Analyzed" />
            <div className="hero-stat-divider" />
            <AnimatedStat end={2} prefix="<" suffix="s" label="Avg. Response" />
          </motion.div>
        </motion.div>

        {/* Right — AI illustration with parallax */}
        <motion.div
          className="hero-illustration"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          style={{ y: parallaxY }}
        >
          <div className="hero-image-wrapper">
            <img
              src="/ai-hero.png"
              alt="AI neural network illustration representing fake news detection"
              className="hero-image"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* -----------------------------------------
   How It Works Section — staggered cards
   ----------------------------------------- */
function HowItWorksSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <section id="how-it-works" className="section">
      <div className="section-container">
        <motion.h2
          className="section-title"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          custom={0}
        >
          How It <span className="text-gradient">Works</span>
        </motion.h2>
        <motion.p
          className="section-subtitle"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          custom={0.1}
        >
          From article input to AI prediction — a streamlined four-step pipeline.
        </motion.p>

        <motion.div
          className="pipeline-grid"
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {PIPELINE_STEPS.map((step, index) => (
            <motion.div
              key={step.title}
              className="pipeline-card glass-card"
              variants={staggerChild}
            >
              <span className="pipeline-step-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="pipeline-icon">
                <step.icon size={28} />
              </div>
              <h3 className="pipeline-card-title">{step.title}</h3>
              <p className="pipeline-card-description">{step.description}</p>
              {index < PIPELINE_STEPS.length - 1 && (
                <div className="pipeline-connector">
                  <ChevronRight size={20} />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* -----------------------------------------
   Tech Stack Section — fade-in cards
   ----------------------------------------- */
function TechStackSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <section className="section">
      <div className="section-container">
        <motion.h2
          className="section-title"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          custom={0}
        >
          Built With <span className="text-gradient">Modern Tech</span>
        </motion.h2>
        <motion.p
          className="section-subtitle"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          custom={0.1}
        >
          Industry-standard tools and frameworks powering TruthGuard.
        </motion.p>

        <motion.div
          className="tech-grid"
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {TECH_STACK.map((tech) => (
            <motion.div
              key={tech.name}
              className="tech-card glass-card"
              variants={staggerChild}
            >
              <h3 className="tech-card-name">{tech.name}</h3>
              <p className="tech-card-description">{tech.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Home;
