import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1];

const STATS = [
  { value: 200, suffix: '+', label: 'Global Clients',      desc: 'Brands served worldwide' },
  { value: 7,   suffix: '+', label: 'Years Experience',    desc: 'In brand & logo design'  },
  { value: 98,  suffix: '%', label: 'Satisfaction Rate',   desc: 'From verified reviews'   },
  { value: 24,  suffix: 'h', label: 'Response Time',       desc: 'Direct communication'    },
];

const useCountUp = (target, duration = 1600, active = false) => {
  const [count, setCount] = useState(0);
  const isFloat = !Number.isInteger(target);
  useEffect(() => {
    if (!active) return;
    let startTime = null;
    const tick = (ts) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setCount(isFloat ? parseFloat((e * target).toFixed(1)) : Math.floor(e * target));
      if (p < 1) requestAnimationFrame(tick);
      else setCount(target);
    };
    requestAnimationFrame(tick);
  }, [active, target, duration, isFloat]);
  return count;
};

const StatItem = ({ stat, idx, inView }) => {
  const count = useCountUp(stat.value, 1500, inView);
  return (
    <motion.div
      className="stats-item"
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: EASE, delay: idx * 0.1 }}
    >
      <div className="stats-value">{count}{stat.suffix}</div>
      <div className="stats-label">{stat.label}</div>
      <div className="stats-desc">{stat.desc}</div>
    </motion.div>
  );
};

const StatsCounter = () => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.25 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="stats-section" ref={ref} aria-label="Company statistics">
      <div className="container">
        <div className="stats-grid">
          {STATS.map((s, i) => (
            <React.Fragment key={s.label}>
              <StatItem stat={s} idx={i} inView={inView} />
              {i < STATS.length - 1 && (
                <div className="stats-divider" aria-hidden="true" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <style>{`
        /* ══ STATS COUNTER ══════════════════════════════════════ */
        .stats-section {
          background: var(--surface);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: 3.5rem 0;
        }

        .stats-grid {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          max-width: 980px;
          margin: 0 auto;
        }

        .stats-item {
          flex: 1;
          text-align: center;
          padding: 1.5rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }

        .stats-value {
          font-family: var(--font-display);
          font-size: clamp(2.2rem, 4vw, 3.2rem);
          font-weight: 800;
          letter-spacing: -0.05em;
          color: var(--brand-red);
          line-height: 1;
        }

        .stats-label {
          font-family: var(--font-display);
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--ink);
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin-top: 0.35rem;
        }

        .stats-desc {
          font-size: 0.75rem;
          color: var(--muted);
          line-height: 1.4;
        }

        .stats-divider {
          width: 1px;
          height: 60px;
          background: var(--border);
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .stats-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0;
          }
          .stats-divider { display: none; }
          .stats-item {
            border: 1px solid var(--border);
            border-collapse: collapse;
            margin: -0.5px;
          }
        }
        @media (max-width: 420px) {
          .stats-item { padding: 1.25rem 1rem; }
          .stats-value { font-size: 1.75rem; }
        }
      `}</style>
    </section>
  );
};

export default StatsCounter;
