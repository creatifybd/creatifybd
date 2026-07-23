import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import OptimizedImage from './OptimizedImage';
import { useSettings } from '../context/SettingsContext';

const EASE_EXPO = [0.16, 1, 0.3, 1];

const PREVIEW_IMAGES = [
  '/assets/portfolio/logo-design-branding/logo-design-branding-01.jpg',
  '/assets/portfolio/logo-design-branding/logo-design-branding-02.jpg',
  '/assets/portfolio/product-packaging-design/product-packaging-design-01.jpg',
  '/assets/portfolio/logo-design-branding/logo-design-branding-03.jpg',
  '/assets/portfolio/product-packaging-design/product-packaging-design-02.jpg',
  '/assets/portfolio/logo-design-branding/logo-design-branding-04.jpg',
];

const STATS = [
  { value: '200+', label: 'Clients Served' },
  { value: '7+',   label: 'Years Experience' },
  { value: '98%',  label: 'Satisfaction Rate' },
];

const Hero = () => {
  const { content } = useSettings();
  const heroContent = content?.hero || {};

  const headline     = heroContent.title    || 'Grow Your Brand with a Trusted Creative Partner';
  const description  = heroContent.desc     ||
    'CreatifyBD is a full-service creative team — branding, social media, video, and web — working together instead of scattered across freelancers who\u2019ve never spoken to each other. Real people, real turnaround times, and pricing built around your actual project.';
  const cta1Label    = heroContent.cta1     || 'See Our Work';
  const cta2Label    = heroContent.cta2     || 'Get a Custom Quote';
  const heroImage    = heroContent.mockup_primary || heroContent.hero_image || '/assets/hero-visual.png';

  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollY } = useScroll();
  const rawY1 = useTransform(scrollY, [0, 600], [0, -60]);
  const rawY2 = useTransform(scrollY, [0, 600], [0, -100]);

  // Disable parallax shifts on mobile screens to prevent overlap with copy/buttons
  const y1 = isMobile ? 0 : rawY1;
  const y2 = isMobile ? 0 : rawY2;

  return (
    <section className="hero-agency" id="hero">
      {/* Ambient background */}
      <div className="hero-agency-bg" aria-hidden="true">
        <div className="hero-agency-glow-a" />
        <div className="hero-agency-glow-b" />
        <div className="hero-agency-grid" />
      </div>

      <div className="hero-agency-inner">
        {/* ── LEFT COPY ── */}
        <div className="hero-agency-copy">
          {/* Headline */}
          <motion.h1
            className="hero-agency-h1"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE_EXPO, delay: 0.05 }}
            dangerouslySetInnerHTML={{ __html: headline }}
          />

          {/* Description */}
          <motion.p
            className="hero-agency-desc"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_EXPO, delay: 0.32 }}
          >
            {description}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="hero-agency-ctas"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_EXPO, delay: 0.44 }}
          >
            <Link to="/portfolio" className="hero-cta-primary">
              {cta1Label}
              <ArrowRight size={17} />
            </Link>
            <Link to="/contact" className="hero-cta-ghost">
              {cta2Label}
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            className="hero-agency-stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease: EASE_EXPO, delay: 0.6 }}
          >
            {STATS.map((s, i) => (
              <React.Fragment key={s.label}>
                <div className="hero-stat-item">
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
                {i < STATS.length - 1 && (
                  <div className="hero-stat-divider" aria-hidden="true" />
                )}
              </React.Fragment>
            ))}
          </motion.div>
        </div>

        {/* ── RIGHT VISUAL ── */}
        <motion.div
          className="hero-agency-visual"
          initial={{ opacity: 0, x: 40, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1.1, ease: EASE_EXPO, delay: 0.15 }}
          style={{ y: y1 }}
        >
          <div className="hero-img-single">
            <motion.div style={{ y: y2 }}>
              <img
                src={heroImage}
                alt="Creative work showcase"
                loading="eager"
                fetchPriority="high"
                onError={(e) => {
                  if (e.target.src !== '/assets/hero-visual.png') {
                    e.target.src = '/assets/hero-visual.png';
                  }
                }}
              />
            </motion.div>
          </div>

        </motion.div>
      </div>

      <style>{`
        /* ══ HERO AGENCY ══════════════════════════════════════════ */
        .hero-agency {
          position: relative;
          background: var(--surface);
          overflow: hidden;
          padding-top: var(--nav-height, 90px);
        }

        /* Background */
        .hero-agency-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }
        .hero-agency-glow-a {
          display: none;
        }
        .hero-agency-glow-b {
          display: none;
        }
        .hero-agency-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,0,0,0.028) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.028) 1px, transparent 1px);
          background-size: 56px 56px;
          mask-image: radial-gradient(ellipse 85% 70% at 65% 0%, black 15%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 85% 70% at 65% 0%, black 15%, transparent 100%);
        }

        /* Two-column inner */
        .hero-agency-inner {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: clamp(3rem, 5vw, 7rem);
          max-width: var(--container-max-xl);
          margin: 0 auto;
          padding: clamp(4rem, 7vw, 7rem) var(--container-margin-lg) clamp(4rem, 6vw, 6rem);
        }

        @media (min-width: 1440px) {
          .hero-agency-inner {
            max-width: var(--container-max-2xl);
            padding: clamp(4rem, 7vw, 7rem) var(--container-margin-xl) clamp(4rem, 6vw, 6rem);
          }
        }

        @media (min-width: 1920px) {
          .hero-agency-inner {
            padding: clamp(4rem, 7vw, 7rem) var(--container-margin-2xl) clamp(4rem, 6vw, 6rem);
          }
        }

        @media (max-width: 1024px) {
          .hero-agency-inner {
            max-width: var(--container-max-md);
            padding: clamp(3rem, 6vw, 5rem) var(--container-margin-md) clamp(3rem, 5vw, 4rem);
          }
        }

        @media (max-width: 768px) {
          .hero-agency-inner {
            max-width: var(--container-max-sm);
            padding: clamp(2.5rem, 5vw, 4rem) var(--container-margin-sm) clamp(2.5rem, 5vw, 3.5rem);
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
        }

        /* ── Copy ── */
        .hero-agency-copy {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0;
        }

        .hero-agency-pulse {
          animation: heroPulse 2s ease-in-out infinite;
        }
        @keyframes heroPulse {
          0%,100% { opacity:1; transform:scale(1); box-shadow: 0 0 0 0 rgba(232,25,44,0.4); }
          50%      { opacity:0.6; transform:scale(1.3); box-shadow: 0 0 0 5px rgba(232,25,44,0); }
        }

        /* Headline */
        .hero-agency-h1 {
          font-family: var(--font-display);
          font-size: clamp(3rem, 6vw, 5.5rem);
          font-weight: 800;
          line-height: 1.04;
          letter-spacing: -0.04em;
          color: var(--ink);
          margin: 0 0 1.75rem;
          display: flex;
          flex-wrap: wrap;
        }
        .hero-word {
          display: inline-block;
          overflow: hidden;
        }

        /* Description */
        .hero-agency-desc {
          font-size: clamp(0.95rem, 1.5vw, 1.08rem);
          color: var(--muted);
          max-width: 520px;
          line-height: 1.82;
          margin: 0 0 2.5rem;
          font-weight: 400;
        }

        /* CTAs */
        .hero-agency-ctas {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          flex-wrap: wrap;
          margin-bottom: 2.75rem;
        }
        .hero-cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.9rem 2rem;
          background: var(--brand-red);
          color: #fff;
          font-family: var(--font-body);
          font-weight: 700;
          font-size: 0.9rem;
          border-radius: 100px;
          text-decoration: none;
          letter-spacing: -0.01em;
          transition: background 0.22s, transform 0.22s, box-shadow 0.22s;
          box-shadow: 0 8px 28px rgba(232,25,44,0.28), 0 2px 8px rgba(232,25,44,0.16);
        }
        .hero-cta-primary:hover {
          background: var(--brand-red-dark);
          transform: translateY(-3px);
          box-shadow: 0 16px 44px rgba(232,25,44,0.36);
          color: #fff;
        }
        .hero-cta-ghost {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.9rem 2rem;
          background: transparent;
          color: var(--ink);
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 0.9rem;
          border-radius: 100px;
          border: 1.5px solid rgba(15,15,18,0.15);
          text-decoration: none;
          transition: border-color 0.2s, background 0.2s, transform 0.2s;
          letter-spacing: -0.01em;
        }
        .hero-cta-ghost:hover {
          border-color: var(--ink);
          background: rgba(15,15,18,0.04);
          transform: translateY(-3px);
          color: var(--ink);
        }

        /* Stats */
        .hero-agency-stats {
          display: flex;
          align-items: center;
          gap: 0;
          padding: 1.25rem 1.5rem;
          background: rgba(255,255,255,0.85);
          border: 1px solid var(--border);
          border-radius: 16px;
          backdrop-filter: blur(12px);
          box-shadow: 0 4px 24px rgba(0,0,0,0.05);
        }
        .hero-stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.15rem;
          padding: 0 1.5rem;
          text-align: center;
        }
        .hero-stat-item strong {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--brand-red);
          line-height: 1;
          letter-spacing: -0.04em;
        }
        .hero-stat-item span {
          font-size: 0.67rem;
          font-weight: 600;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .hero-stat-divider {
          width: 1px;
          height: 34px;
          background: var(--border);
          flex-shrink: 0;
        }

        /* ── Visual column ── */
        .hero-agency-visual {
          position: relative;
        }
        .hero-img-single {
          position: relative;
          border-radius: 0;
          overflow: visible;
          background: transparent;
          box-shadow: none;
        }
        .hero-img-single img {
          width: 100%;
          height: auto;
          object-fit: contain;
          display: block;
          transition: transform 0.55s cubic-bezier(0.25,0.8,0.25,1);
          box-shadow: none;
          border-radius: 0;
        }
        .hero-img-single:hover img { transform: scale(1.05); }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .hero-agency-inner {
            grid-template-columns: 1fr;
            gap: 2.5rem;
            padding-top: calc(var(--nav-height, 80px) + 1rem);
            padding-bottom: 3.5rem;
          }
          .hero-agency-copy { align-items: center; text-align: center; }
          .hero-agency-h1 { text-align: center; justify-content: center; margin-bottom: 1.25rem; }
          .hero-agency-desc { max-width: 580px; text-align: center; margin-bottom: 2rem; }
          .hero-agency-ctas { justify-content: center; width: 100%; margin-bottom: 2rem; }
          .hero-agency-stats { align-self: center; width: 100%; max-width: 480px; justify-content: space-around; margin-bottom: 1rem; }
          .hero-agency-visual {
            max-width: 540px;
            margin: 1.5rem auto 0;
            width: 100%;
            transform: none !important;
          }
          .hero-img-single motion.div,
          .hero-img-single div {
            transform: none !important;
          }
        }
        @media (max-width: 640px) {
          .hero-agency-h1 { font-size: clamp(2.1rem, 9vw, 3.2rem); }
          .hero-agency-inner { padding: 2rem 1rem 3rem; }
          .hero-agency-ctas { flex-direction: column; width: 100%; gap: 0.75rem; }
          .hero-cta-primary, .hero-cta-ghost { width: 100%; justify-content: center; }
          .hero-agency-stats { padding: 0.85rem; flex-wrap: wrap; gap: 0.5rem; justify-content: center; }
          .hero-stat-item { padding: 0 0.5rem; }
          .hero-stat-item strong { font-size: 1.2rem; }
          .hero-stat-divider { height: 24px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-agency-pulse { animation: none; }
          .hero-cta-primary:hover,
          .hero-cta-ghost:hover { transform: none; }
          .hero-img-single img { transition: none; }
        }
      `}</style>
    </section>
  );
};

export default Hero;
