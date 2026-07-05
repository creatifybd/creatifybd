import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock, RefreshCw, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';

const EASE_EXPO = [0.16, 1, 0.3, 1];

// Trust bar items — mirrors duck.design's value proposition approach
const TRUST_PILLS = [
  { icon: <RefreshCw size={13} />, label: 'Unlimited Revisions' },
  { icon: <Clock size={13} />, label: '48h First Delivery' },
  { icon: <Shield size={13} />, label: '7-Day Money-Back' },
  { icon: <CheckCircle2 size={13} />, label: '100+ Projects Delivered' },
];

const Hero = () => {
  const { content } = useSettings();
  const heroContent = content?.hero || {};

  const heroTitle = heroContent.title ||
    'Your Dedicated Creative Team — Delivered Reliably, Every Month.';

  const heroEyebrow = heroContent.eyebrow ||
    'Social media, design & video for international brands';

  const heroDesc = heroContent.desc ||
    'Stop losing clients to brands that look more professional than you. CreatifyBD gives growing brands in the US, Canada, and Australia a dedicated creative team — without the agency overhead or freelancer unreliability.';

  const heroPrimaryCta = heroContent.cta1 || 'Browse Services';
  const heroSecondaryCta = heroContent.cta2 || 'Get a Free Proposal';

  const sanitizedTitle = useMemo(() => {
    return DOMPurify.sanitize(heroTitle, {
      ALLOWED_TAGS: ['span', 'br', 'strong', 'em'],
      ALLOWED_ATTR: ['class'],
    });
  }, [heroTitle]);

  return (
    <section className="hero">
      {/* Ambient glow orbs */}
      <div className="hero-glow hero-glow-1" aria-hidden="true" />
      <div className="hero-glow hero-glow-2" aria-hidden="true" />

      <div className="hero-container">
        {/* ─── LEFT: Content ─── */}
        <div className="hero-content">

          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_EXPO, delay: 0 }}
          >
            <div className="hero-eyebrow">
              <span className="pulse-dot" />
              {heroEyebrow}
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="hero-main-title"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: EASE_EXPO, delay: 0.1 }}
            dangerouslySetInnerHTML={{ __html: sanitizedTitle }}
          />

          {/* Description */}
          <motion.p
            className="hero-sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_EXPO, delay: 0.22 }}
          >
            {heroDesc}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_EXPO, delay: 0.34 }}
          >
            <Link to="/gigs" className="btn-red premium-btn">
              {heroPrimaryCta}
              <ArrowRight size={18} />
            </Link>
            <Link to="/contact" className="btn-outline-dark premium-btn-outline">
              {heroSecondaryCta}
            </Link>
          </motion.div>

          {/* Market flags */}
          <motion.div
            className="hero-trust"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: EASE_EXPO, delay: 0.44 }}
          >
            <div className="hero-market-flags" aria-label="Serving clients in USA, Canada, and Australia">
              <span className="market-served-label">Serving</span>
              <span className="market-tag"><span className="market-dot us" />USA</span>
              <span className="market-tag"><span className="market-dot ca" />Canada</span>
              <span className="market-tag"><span className="market-dot au" />Australia</span>
            </div>
          </motion.div>
        </div>

        {/* ─── RIGHT: Visual ─── */}
        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, ease: EASE_EXPO, delay: 0.48 }}
        >
          <div className="hero-mockup-wrapper">
            {heroContent.mockup_primary ? (
              <img
                src={heroContent.mockup_primary}
                alt="CreatifyBD creative services dashboard"
                className="hero-mockup-img"
                loading="eager"
                fetchPriority="high"
                width="620"
                height="480"
              />
            ) : (
              <div className="hero-mockup-wrap">
                <div className="dashboard-mockup-grid">
                  <div className="mock-sidebar">
                    <div className="mock-sb-item mock-sb-item-active">Campaigns</div>
                    <div className="mock-sb-item">Deliveries</div>
                    <div className="mock-sb-item">Intake Brief</div>
                    <div className="mock-sb-item">Revisions</div>
                  </div>
                  <div className="mock-content-panel">
                    <div className="mock-card">
                      <h3 className="mock-card-title">Campaign Performance</h3>
                      <div className="mock-stats-grid">
                        <div className="mock-stat-item">
                          <small className="mock-stat-label">Content Calendar</small>
                          <strong className="mock-stat-value mock-stat-value-red">Active</strong>
                        </div>
                        <div className="mock-stat-item">
                          <small className="mock-stat-label">Posts Ready</small>
                          <strong className="mock-stat-value">12</strong>
                        </div>
                        <div className="mock-stat-item">
                          <small className="mock-stat-label">Scheduled</small>
                          <strong className="mock-stat-value">8</strong>
                        </div>
                      </div>
                      <div className="mock-schedule-section">
                        <small className="mock-schedule-label">Weekly Schedule</small>
                        <div className="calendar-grid">
                          <div className="calendar-day active"><span>Mon</span><div className="active-bar-content" /></div>
                          <div className="calendar-day active"><span>Tue</span><div className="active-bar-content" /></div>
                          <div className="calendar-day active calendar-day-green"><span>Wed</span><div className="active-bar-content active-bar-content-green" /></div>
                          <div className="calendar-day"><span>Thu</span></div>
                        </div>
                      </div>
                    </div>
                    <div className="mock-card">
                      <h3 className="mock-card-title">Recent Deliveries</h3>
                      <div className="mock-deliveries-list">
                        <div className="mock-delivery-item">
                          <span className="mock-delivery-name">SMM_Post_v2.png</span>
                          <span className="mock-delivery-action">Download</span>
                        </div>
                        <div className="mock-delivery-item">
                          <span className="mock-delivery-name">Campaign_Teaser.mp4</span>
                          <span className="mock-delivery-action">Download</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* ─── Trust Bar (below hero columns) ─── */}
      <motion.div
        className="hero-trust-bar"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE_EXPO, delay: 0.6 }}
        aria-label="Key guarantees"
      >
        {TRUST_PILLS.map((pill, i) => (
          <div className="hero-trust-pill" key={i}>
            {pill.icon}
            <span>{pill.label}</span>
          </div>
        ))}
      </motion.div>

      <style>{`
        /* ── Hero Trust Bar ── */
        .hero-trust-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: 3.5rem;
          padding-top: 2.5rem;
          border-top: 1px solid var(--border-soft);
        }
        .hero-trust-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--ink-soft);
          background: var(--surface-card);
          border: 1px solid var(--border-card);
          border-radius: var(--radius-pill);
          padding: 0.45rem 1rem;
          box-shadow: var(--shadow-sm);
          transition: box-shadow 0.2s ease, transform 0.2s ease;
        }
        .hero-trust-pill:hover {
          box-shadow: var(--shadow-card);
          transform: translateY(-1px);
        }
        .hero-trust-pill svg {
          color: var(--brand-red);
          flex-shrink: 0;
        }

        /* ── Market flags ── */
        .hero-market-flags {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .market-served-label {
          font-size: 0.75rem;
          color: var(--muted);
          font-weight: 500;
        }
        .market-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--ink-soft);
          background: var(--surface-soft);
          border: 1px solid var(--border);
          border-radius: 100px;
          padding: 0.3rem 0.75rem;
        }
        .market-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .market-dot.us { background: #B22234; }
        .market-dot.ca { background: #FF0000; }
        .market-dot.au { background: #00008B; }

        /* Reduce motion */
        @media (prefers-reduced-motion: reduce) {
          .hero-trust-pill { transition: none; }
        }
      `}</style>
    </section>
  );
};

export default Hero;
