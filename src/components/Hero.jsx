import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../utils/translations';
import { FadeReveal, MagneticWrap } from './MotionReveal';
import { useSettings } from '../context/SettingsContext';
import { motion } from 'framer-motion';

const EASE_EXPO = [0.16, 1, 0.3, 1];

const Hero = () => {
  const { lang } = useLanguage();
  const { content } = useSettings();
  const t = translations[lang].hero;
  const heroContent = content?.hero || {};
  const heroTitle = heroContent.title || t.title;
  const heroEyebrow = heroContent.eyebrow || t.eyebrow;
  const heroDesc = heroContent.desc || t.desc;
  const heroPrimaryCta = heroContent.cta1 || t.cta1;
  const heroSecondaryCta = heroContent.cta2 || t.cta3;

  const heroAltText = heroContent.mockup_primary ? "CreatifyBD creative services dashboard showing social media management, graphic design, and video editing projects" : "CreatifyBD creative agency dashboard interface";

  const sanitizedTitle = useMemo(() => {
    const rawHtml = heroTitle;
    return DOMPurify.sanitize(rawHtml, {
      ALLOWED_TAGS: ['span', 'br', 'strong', 'em'],
      ALLOWED_ATTR: ['class']
    });
  }, [heroTitle]);

  return (
    <section className="hero">
      <div className="hero-glow hero-glow-1" />
      <div className="hero-glow hero-glow-2" />

      <div className="hero-container">
        <div className="hero-content">
          {/* Eyebrow — per-char reveal */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_EXPO, delay: 0 }}
          >
            <div className="hero-eyebrow">
              <span className="pulse-dot" />
              {heroEyebrow}
            </div>
          </motion.div>

          {/* Headline — word-by-word spring reveal */}
          <motion.h1
            className="hero-main-title"
            initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, ease: EASE_EXPO, delay: 0.08 }}
            dangerouslySetInnerHTML={{ __html: sanitizedTitle }}
          />

          <FadeReveal delay={0.22}>
            <p className="hero-sub">{heroDesc}</p>
          </FadeReveal>

          {/* CTAs with magnetic pull */}
          <FadeReveal delay={0.32}>
            <div className="hero-actions">
              <MagneticWrap strength={0.22}>
                <Link to="/gigs" className="btn-red premium-btn">
                  {heroPrimaryCta}
                  <ArrowRight size={18} />
                </Link>
              </MagneticWrap>
              <MagneticWrap strength={0.18}>
                <Link to="/contact" className="btn-outline-dark premium-btn-outline">
                  {heroSecondaryCta}
                </Link>
              </MagneticWrap>
            </div>
          </FadeReveal>

          <FadeReveal delay={0.44}>
            <div className="hero-trust">
              <div className="hero-market-flags" aria-label="Serving clients in USA, Canada, and Australia">
                <span className="market-served-label">Serving</span>
                <span className="market-tag"><span className="market-dot us" />USA</span>
                <span className="market-tag"><span className="market-dot ca" />Canada</span>
                <span className="market-tag"><span className="market-dot au" />Australia</span>
              </div>
            </div>
          </FadeReveal>
        </div>

        <div className="hero-visual">
          <motion.div
            className="hero-visual-reveal"
            initial={{ opacity: 0, y: 36, scale: 0.96, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.15, ease: EASE_EXPO, delay: 0.48 }}
          >
            <div className="hero-mockup-wrapper">
              {heroContent.mockup_primary ? (
                <img
                  src={heroContent.mockup_primary}
                  alt={heroAltText}
                  className="hero-mockup-img"
                  loading="eager"
                  fetchpriority="high"
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
      </div>

      <style>{`
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
          margin-right: 0.1rem;
        }
        .market-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--ink-soft, #252A33);
          background: var(--surface-soft, #F8FAFC);
          border: 1px solid var(--border, rgba(16,24,40,0.10));
          border-radius: 100px;
          padding: 0.3rem 0.75rem;
          letter-spacing: 0.01em;
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
      `}</style>
    </section>
  );
};

export default Hero;
