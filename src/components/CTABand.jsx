import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';

const EASE_EXPO = [0.16, 1, 0.3, 1];

const STATS = [
  { value: '100+', label: 'Brands served' },
  { value: '48h',  label: 'First delivery' },
  { value: '4.9★', label: 'Average rating' },
];

const CTABand = () => {
  const { content } = useSettings();
  const cta = content?.cta_band || {};

  return (
    <section className="ctab-section" aria-labelledby="ctab-heading">
      {/* Background layers */}
      <div className="ctab-bg" aria-hidden="true">
        <div className="ctab-glow-a" />
        <div className="ctab-glow-b" />
        <div className="ctab-grid" />
        <div className="ctab-particles">
          <div className="ctab-particle" />
          <div className="ctab-particle" />
          <div className="ctab-particle" />
          <div className="ctab-particle" />
          <div className="ctab-particle" />
          <div className="ctab-particle" />
          <div className="ctab-particle" />
          <div className="ctab-particle" />
        </div>
      </div>

      <div className="container">
        <div className="ctab-inner">
          {/* Stats strip */}
          <motion.div
            className="ctab-stats"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE_EXPO }}
          >
            {STATS.map((s, i) => (
              <div className="ctab-stat" key={i}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Heading */}
          <motion.div
            className="ctab-copy"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE_EXPO, delay: 0.08 }}
          >
            <div className="eyebrow ctab-eyebrow">
              {cta.eyebrow || 'Ready when you are'}
            </div>
            <h2 id="ctab-heading" className="ctab-heading">
              {cta.title || (
                <>
                  Stop patching freelancers.<br />
                  Get a <span className="ctab-heading-red">dedicated creative team.</span>
                </>
              )}
            </h2>
            <p className="ctab-sub">
              {cta.subtitle || 'Tell us your goals — we\'ll recommend the right package, timeline, and first deliverables. No sales calls, no lock-in.'}
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div
            className="ctab-actions"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: EASE_EXPO, delay: 0.18 }}
          >
            <Link to={cta.primary_link || '/contact'} className="ctab-btn-primary">
              {cta.primary_btn || 'Start a Project'}
              <ArrowRight size={18} />
            </Link>
            <a
              href={`mailto:${cta.email || 'hello@creatifybd.com'}`}
              className="ctab-btn-outline"
            >
              <Mail size={16} />
              {cta.secondary_btn || 'Email Us Directly'}
            </a>
          </motion.div>

          {/* Trust note */}
          <motion.p
            className="ctab-trust"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE_EXPO, delay: 0.28 }}
          >
            No contracts. 7-day money-back guarantee. We respond within 24 hours.
          </motion.p>
        </div>
      </div>

      <style>{`
        .ctab-section {
          position: relative;
          background: var(--surface-dark, #0a0a0f);
          padding: 7rem 0;
          overflow: hidden;
        }
        .ctab-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .ctab-glow-a {
          position: absolute;
          width: 800px; height: 800px;
          border-radius: 50%;
          top: -200px; left: 50%;
          transform: translateX(-50%);
          background: radial-gradient(circle, rgba(232,25,44,0.22) 0%, transparent 65%);
        }
        .ctab-glow-b {
          position: absolute;
          width: 400px; height: 400px;
          border-radius: 50%;
          bottom: -100px; right: 10%;
          background: radial-gradient(circle, rgba(232,25,44,0.12) 0%, transparent 65%);
        }
        .ctab-grid {
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(circle, rgba(232,25,44,0.15) 1px, transparent 1px),
            radial-gradient(circle, rgba(232,25,44,0.08) 1px, transparent 1px);
          background-size: 32px 32px;
          background-position: 0 0, 16px 16px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 0%, black 30%, transparent 100%);
          animation: gridPulse 8s ease-in-out infinite;
        }
        @keyframes gridPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        
        /* Animated floating particles */
        .ctab-particles {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .ctab-particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(232,25,44,0.4);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }
        .ctab-particle:nth-child(1) { left: 10%; top: 20%; animation-delay: 0s; }
        .ctab-particle:nth-child(2) { left: 20%; top: 60%; animation-delay: 1s; }
        .ctab-particle:nth-child(3) { left: 80%; top: 30%; animation-delay: 2s; }
        .ctab-particle:nth-child(4) { left: 70%; top: 70%; animation-delay: 3s; }
        .ctab-particle:nth-child(5) { left: 50%; top: 40%; animation-delay: 4s; }
        .ctab-particle:nth-child(6) { left: 30%; top: 80%; animation-delay: 5s; }
        .ctab-particle:nth-child(7) { left: 90%; top: 50%; animation-delay: 2.5s; }
        .ctab-particle:nth-child(8) { left: 15%; top: 35%; animation-delay: 1.5s; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.4; }
          50% { transform: translateY(-20px) scale(1.2); opacity: 0.8; }
        }

        .ctab-inner {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 720px;
          margin: 0 auto;
          gap: 2rem;
        }

        /* Stats */
        .ctab-stats {
          display: flex;
          gap: 2.5rem;
          align-items: center;
        }
        .ctab-stat {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          text-align: center;
        }
        .ctab-stat strong {
          font-size: 1.75rem;
          font-weight: 900;
          color: var(--white, #fff);
          letter-spacing: -0.04em;
          line-height: 1;
        }
        .ctab-stat span {
          font-size: 0.72rem;
          color: var(--text-dim-dark, rgba(255,255,255,0.45));
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        /* Divider between stats */
        .ctab-stats .ctab-stat:not(:last-child) {
          border-right: 1px solid rgba(255,255,255,0.1);
          padding-right: 2.5rem;
        }

        /* Copy */
        .ctab-copy { display: flex; flex-direction: column; gap: 1rem; }
        .ctab-eyebrow {
          color: rgba(232,25,44,0.85) !important;
          border-color: rgba(232,25,44,0.25) !important;
          background: rgba(232,25,44,0.08) !important;
        }
        .ctab-heading {
          font-size: clamp(2.5rem, 5.5vw, 4rem);
          font-weight: 900;
          color: var(--white, #fff);
          line-height: 1.05;
          letter-spacing: -0.04em;
          margin: 0;
        }
        .ctab-heading-red { color: var(--brand-red, #e8192c); }
        .ctab-sub {
          font-size: 1.15rem;
          color: var(--text-dim-dark, rgba(255,255,255,0.65));
          line-height: 1.7;
          max-width: 580px;
          margin: 0 auto;
        }

        /* Actions */
        .ctab-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        .ctab-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.95rem 2.25rem;
          background: var(--brand-red, #e8192c);
          color: #fff;
          font-weight: 700;
          font-size: 0.95rem;
          border-radius: 100px;
          text-decoration: none;
          transition: background 0.22s, transform 0.22s, box-shadow 0.22s;
          box-shadow: 0 8px 28px rgba(232,25,44,0.40);
          letter-spacing: -0.01em;
        }
        .ctab-btn-primary:hover {
          background: #c41024;
          transform: translateY(-3px);
          box-shadow: 0 16px 40px rgba(232,25,44,0.55);
        }
        .ctab-btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.95rem 2.25rem;
          background: rgba(255,255,255,0.06);
          color: var(--text-dim-dark, rgba(255,255,255,0.85));
          font-weight: 700;
          font-size: 0.95rem;
          border-radius: 100px;
          border: 1.5px solid rgba(255,255,255,0.15);
          text-decoration: none;
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
          letter-spacing: -0.01em;
        }
        .ctab-btn-outline:hover {
          background: rgba(255,255,255,0.10);
          border-color: rgba(255,255,255,0.35);
          transform: translateY(-3px);
        }

        /* Trust */
        .ctab-trust {
          font-size: 0.78rem;
          color: var(--text-dim-dark, rgba(255,255,255,0.30));
          margin: 0;
          letter-spacing: 0.01em;
        }

        @media (max-width: 600px) {
          .ctab-section { padding: 5rem 0; }
          .ctab-stats { gap: 1.5rem; flex-wrap: wrap; justify-content: center; }
          .ctab-stats .ctab-stat:not(:last-child) { border-right: none; padding-right: 0; }
          .ctab-heading { font-size: clamp(1.75rem, 8vw, 2.4rem); }
          .ctab-actions { flex-direction: column; align-items: center; }
          .ctab-btn-primary, .ctab-btn-outline { width: 100%; justify-content: center; }
        }
      `}</style>
    </section>
  );
};

export default CTABand;
