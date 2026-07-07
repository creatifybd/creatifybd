import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const EASE_EXPO = [0.16, 1, 0.3, 1];

const STATS = [
  { value: 500, suffix: '+', label: 'Projects Delivered', desc: 'Across design, video, social & web' },
  { value: 100, suffix: '+', label: 'Happy Clients', desc: 'USA · Canada · Australia · UK' },
  { value: 4.9, suffix: '★', label: 'Average Rating', desc: 'From verified client reviews' },
  { value: 48,  suffix: 'h', label: 'First Delivery', desc: 'From project kickoff to first draft' },
];

const useCountUp = (target, duration = 1800, start = false) => {
  const [count, setCount] = useState(0);
  const isFloat = !Number.isInteger(target);

  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;
      setCount(isFloat ? parseFloat(current.toFixed(1)) : Math.floor(current));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [start, target, duration, isFloat]);

  return count;
};

const StatItem = ({ stat, index, inView }) => {
  const count = useCountUp(stat.value, 1600, inView);

  return (
    <motion.div
      className="sc-item"
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: EASE_EXPO, delay: index * 0.1 }}
      role="listitem"
      aria-label={`${stat.label}: ${stat.value}${stat.suffix}`}
    >
      <div className="sc-value">
        {count}{stat.suffix}
      </div>
      <div className="sc-label">{stat.label}</div>
      <div className="sc-desc">{stat.desc}</div>
    </motion.div>
  );
};

const StatsCounter = () => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="sc-section" ref={ref} aria-label="Company statistics">
      <div className="container">
        <div className="sc-grid" role="list">
          {STATS.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} index={i} inView={inView} />
          ))}
        </div>
      </div>

      <style>{`
        .sc-section {
          padding: 5rem 0;
          background: linear-gradient(135deg, var(--surface-dark, #0a0a0f) 0%, var(--surface-dark-secondary, #1a1a20) 50%, var(--surface-dark, #0a0a0f) 100%);
          position: relative;
          overflow: hidden;
        }
        .sc-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 20% 50%, rgba(232,25,44,0.15) 0%, transparent 50%),
                      radial-gradient(circle at 80% 50%, rgba(232,25,44,0.1) 0%, transparent 50%);
          pointer-events: none;
        }
        .sc-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
        }
        .sc-item {
          text-align: center;
          padding: 2.5rem 1.5rem;
          position: relative;
          z-index: 1;
        }
        .sc-item:not(:last-child)::after {
          content: '';
          position: absolute;
          right: 0; top: 25%; bottom: 25%;
          width: 2px;
          background: linear-gradient(180deg, transparent 0%, rgba(232,25,44,0.4) 20%, rgba(232,25,44,0.4) 80%, transparent 100%);
          animation: separatorPulse 3s ease-in-out infinite;
        }
        @keyframes separatorPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .sc-value {
          font-family: var(--font-display, 'Plus Jakarta Sans', sans-serif);
          font-size: clamp(3rem, 5vw, 4.5rem);
          font-weight: 900;
          letter-spacing: -0.05em;
          line-height: 1;
          background: linear-gradient(135deg, #E8192C 0%, #ff6b6b 50%, #C0142A 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.75rem;
          text-shadow: 0 0 40px rgba(232,25,44,0.3);
          filter: drop-shadow(0 0 20px rgba(232,25,44,0.2));
        }
        .sc-label {
          font-size: 1rem;
          font-weight: 800;
          color: var(--white, #fff);
          margin-bottom: 0.35rem;
          letter-spacing: -0.01em;
          text-transform: uppercase;
        }
        .sc-desc {
          font-size: 0.8rem;
          color: var(--text-dim-dark, rgba(255,255,255,0.6));
          line-height: 1.5;
          max-width: 140px;
          margin: 0 auto;
        }
        @media (max-width: 768px) {
          .sc-grid { grid-template-columns: 1fr 1fr; }
          .sc-item:nth-child(2)::after { display: none; }
          .sc-item:nth-child(odd):not(:last-child)::after {
            right: 0; top: 20%; bottom: 20%;
            width: 1px; height: auto;
          }
          .sc-item:nth-child(1),
          .sc-item:nth-child(2) {
            border-bottom: 1px solid rgba(232,25,44,0.15);
          }
        }
        @media (max-width: 480px) {
          .sc-grid { grid-template-columns: 1fr 1fr; }
          .sc-value { font-size: 2rem; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sc-value { transition: none; }
        }
      `}</style>
    </section>
  );
};

export default StatsCounter;
