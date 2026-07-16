import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
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

  const headline     = heroContent.title    || 'Elite Creative Operations For Global Brands';
  const eyebrow      = heroContent.eyebrow  || 'Trusted Global Creative Partner';
  const description  = heroContent.desc     ||
    'Get dedicated senior-level social media management, brand design, video editing, and website creation. Premium agency-grade execution delivered at up to 50% lower cost than traditional market markup.';
  const cta1Label    = heroContent.cta1     || 'View Our Work';
  const cta2Label    = heroContent.cta2     || 'Get a Free Proposal';
  const previewImages = heroContent.preview_images || PREVIEW_IMAGES;

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 600], [0, -60]);
  const y2 = useTransform(scrollY, [0, 600], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);


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
          {/* Eyebrow */}
          <motion.div
            className="hero-agency-eyebrow"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE_EXPO }}
          >
            <span className="hero-agency-pulse" />
            {eyebrow}
          </motion.div>

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

        {/* ── RIGHT VISUAL GRID ── */}
        <motion.div
          className="hero-agency-visual"
          initial={{ opacity: 0, x: 40, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1.1, ease: EASE_EXPO, delay: 0.15 }}
          style={{ y: y1 }}
        >
          <div className="hero-img-grid">
            {/* Main large image */}
            <motion.div className="hero-img-main" style={{ y: y2 }}>
              <img
                src={previewImages[0]}
                alt="Brand identity design"
                loading="eager"
                fetchPriority="high"
              />
            </motion.div>

            {/* Tall side stack */}
            <div className="hero-img-col">
              <motion.div className="hero-img-sm" style={{ y: y1 }}>
                <img src={previewImages[1]} alt="Logo design" loading="eager" />
              </motion.div>
              <motion.div className="hero-img-sm" style={{ y: y2 }}>
                <img src={previewImages[2]} alt="Packaging design" loading="lazy" />
              </motion.div>
              <motion.div className="hero-img-sm" style={{ y: y1 }}>
                <img src={previewImages[3]} alt="Brand mark" loading="lazy" />
              </motion.div>
            </div>

            {/* Bottom strip */}
            <motion.div className="hero-img-wide" style={{ y: y1 }}>
              <img src={previewImages[4]} alt="Creative design" loading="lazy" />
            </motion.div>

            {/* Floating badge top */}
            <motion.div
              className="hero-badge hero-badge--tr"
              initial={{ opacity: 0, scale: 0.7, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE_EXPO, delay: 1.1 }}
            >
              <span className="hero-badge-star">★</span>
              5.0 Rated Designer
            </motion.div>

            {/* Floating badge bottom */}
            <motion.div
              className="hero-badge hero-badge--bl"
              initial={{ opacity: 0, scale: 0.7, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE_EXPO, delay: 1.25 }}
            >
              <span className="hero-badge-dot" />
              Available for new projects
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
          position: absolute;
          width: 900px; height: 900px;
          top: -300px; right: -200px;
          background: radial-gradient(circle, rgba(232,25,44,0.07) 0%, transparent 60%);
          border-radius: 50%;
        }
        .hero-agency-glow-b {
          position: absolute;
          width: 400px; height: 400px;
          bottom: -100px; left: -80px;
          background: radial-gradient(circle, rgba(232,25,44,0.04) 0%, transparent 60%);
          border-radius: 50%;
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

        /* Eyebrow */
        .hero-agency-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-body);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--brand-red);
          background: rgba(232,25,44,0.06);
          border: 1px solid rgba(232,25,44,0.16);
          border-radius: 100px;
          padding: 0.45rem 1.1rem;
          margin-bottom: 2rem;
        }
        .hero-agency-pulse {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--brand-red);
          flex-shrink: 0;
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
        .hero-img-grid {
          position: relative;
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: auto auto;
          gap: 0.7rem;
        }

        /* Images */
        .hero-img-main {
          grid-column: 1;
          grid-row: 1;
          border-radius: 18px;
          overflow: hidden;
          aspect-ratio: 4/3;
          background: var(--surface-soft);
        }
        .hero-img-col {
          grid-column: 2;
          grid-row: 1;
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }
        .hero-img-sm {
          border-radius: 14px;
          overflow: hidden;
          flex: 1;
          background: var(--surface-soft);
          min-height: 100px;
        }
        .hero-img-wide {
          grid-column: 1 / -1;
          grid-row: 2;
          border-radius: 14px;
          overflow: hidden;
          aspect-ratio: 16/5;
          background: var(--surface-soft);
        }
        .hero-img-main img,
        .hero-img-sm img,
        .hero-img-wide img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.55s cubic-bezier(0.25,0.8,0.25,1);
        }
        .hero-img-main:hover img,
        .hero-img-sm:hover img,
        .hero-img-wide:hover img { transform: scale(1.05); }

        /* Floating badges */
        .hero-badge {
          position: absolute;
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: #fff;
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 100px;
          padding: 0.5rem 1.1rem;
          font-family: var(--font-body);
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--ink);
          box-shadow: 0 8px 32px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.05);
          white-space: nowrap;
          z-index: 5;
        }
        .hero-badge--tr { top: -14px; right: -14px; }
        .hero-badge--bl { bottom: 62px; left: -14px; }
        .hero-badge-star { color: #f59e0b; font-size: 0.85rem; }
        .hero-badge-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #22c55e;
          flex-shrink: 0;
          animation: heroPulse 2.5s ease-in-out infinite;
        }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .hero-agency-inner {
            grid-template-columns: 1fr;
            gap: 3.5rem;
            padding-bottom: 4rem;
          }
          .hero-agency-copy { align-items: center; text-align: center; }
          .hero-agency-desc { max-width: 600px; }
          .hero-agency-ctas { justify-content: center; }
          .hero-agency-stats { align-self: center; }
          .hero-agency-visual { max-width: 640px; margin: 0 auto; width: 100%; }
          .hero-badge--tr { top: -10px; right: 10px; }
          .hero-badge--bl { bottom: 48px; left: 10px; }
        }
        @media (max-width: 640px) {
          .hero-agency-h1 { font-size: clamp(2.4rem, 11vw, 3.5rem); }
          .hero-agency-inner { padding: 2.5rem 1.25rem 3.5rem; }
          .hero-agency-stats { padding: 1rem; }
          .hero-stat-item { padding: 0 0.85rem; }
          .hero-stat-item strong { font-size: 1.2rem; }
          .hero-img-wide { display: none; }
          .hero-badge { font-size: 0.68rem; padding: 0.4rem 0.8rem; }
          .hero-badge--tr { top: -8px; right: 8px; }
          .hero-badge--bl { bottom: 12px; left: 8px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-agency-pulse, .hero-badge-dot { animation: none; }
          .hero-cta-primary:hover,
          .hero-cta-ghost:hover { transform: none; }
          .hero-img-main img,
          .hero-img-sm img,
          .hero-img-wide img { transition: none; }
        }
      `}</style>
    </section>
  );
};

export default Hero;
