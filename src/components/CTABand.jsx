import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';

const EASE = [0.16, 1, 0.3, 1];

const CTABand = () => {
  const { content } = useSettings();
  const cta = content?.cta_band || {};

  const headline = cta.heading || 'What would your business look like with a real creative team behind it?';
  const subtext  = cta.subheading  || "Most of our clients say the same thing after the first project: 'I wish I’d done this sooner.' Start with one project. See the difference.";
  const ctaLabel = cta.btn_primary || "Start a Project";
  const ctaLink  = cta.primary_link || "/contact";
  const secondaryLabel = cta.btn_secondary || "hello@creatifybd.com";
  const secondaryLink  = cta.secondary_link || "mailto:hello@creatifybd.com";

  return (
    <section className="ctaband-section" aria-labelledby="ctaband-heading">
      {/* Subtle grid overlay */}
      <div className="ctaband-grid" aria-hidden="true" />

      <div className="container">
        <motion.div
          className="ctaband-inner"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <motion.h2
            id="ctaband-heading"
            className="ctaband-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          >
            {headline}
          </motion.h2>

          <motion.p
            className="ctaband-sub"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.18 }}
          >
            {subtext}
          </motion.p>

          <motion.div
            className="ctaband-actions"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.28 }}
          >
            <Link to={ctaLink} className="ctaband-btn-primary">
              {ctaLabel}
              <ArrowRight size={18} />
            </Link>
            <a href={secondaryLink} className="ctaband-btn-ghost">
              {secondaryLabel}
            </a>
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        /* ══ CTA BAND ══════════════════════════════════════════ */
        .ctaband-section {
          position: relative;
          background: var(--ink, #0f0f12);
          padding: clamp(5rem, 9vw, 9rem) 0;
          overflow: hidden;
        }

        .ctaband-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, black 20%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, black 20%, transparent 100%);
          pointer-events: none;
        }

        .ctaband-inner {
          max-width: 820px;
          margin: 0 auto;
          text-align: center;
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .ctaband-pulse {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--brand-red);
          animation: heroPulse 2s ease-in-out infinite;
        }

        .ctaband-heading {
          font-family: var(--font-display);
          font-size: clamp(2rem, 4.5vw, 3.6rem);
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.04em;
          line-height: 1.1;
          margin: 0;
          max-width: 760px;
        }

        .ctaband-sub {
          font-size: clamp(0.95rem, 1.5vw, 1.05rem);
          color: rgba(255,255,255,0.55);
          max-width: 520px;
          line-height: 1.75;
          margin: 0;
        }

        .ctaband-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 0.5rem;
        }

        .ctaband-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.9rem 2.25rem;
          background: var(--brand-red);
          color: #fff;
          font-family: var(--font-body);
          font-weight: 700;
          font-size: 0.92rem;
          border-radius: 100px;
          text-decoration: none;
          transition: background 0.22s, transform 0.22s, box-shadow 0.22s;
          box-shadow: 0 8px 32px rgba(232,25,44,0.36);
          letter-spacing: -0.01em;
        }
        .ctaband-btn-primary:hover {
          background: var(--brand-red-dark);
          transform: translateY(-3px);
          box-shadow: 0 16px 48px rgba(232,25,44,0.44);
          color: #fff;
        }

        .ctaband-btn-ghost {
          display: inline-flex;
          align-items: center;
          padding: 0.9rem 2rem;
          background: transparent;
          color: rgba(255,255,255,0.7);
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 0.9rem;
          border-radius: 100px;
          border: 1.5px solid rgba(255,255,255,0.15);
          text-decoration: none;
          transition: color 0.2s, border-color 0.2s, transform 0.2s;
          letter-spacing: -0.01em;
        }
        .ctaband-btn-ghost:hover {
          color: #fff;
          border-color: rgba(255,255,255,0.4);
          transform: translateY(-3px);
        }

        @media (max-width: 540px) {
          .ctaband-actions { flex-direction: column; gap: 0.75rem; }
          .ctaband-btn-primary, .ctaband-btn-ghost { width: 100%; justify-content: center; }
        }
      `}</style>
    </section>
  );
};

export default CTABand;
