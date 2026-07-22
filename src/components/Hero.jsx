import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, Globe, Zap } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
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

const PROOF_PILLS = [
  { icon: Star, text: 'Rated 4.9★ by 39+ verified clients' },
  { icon: Globe, text: 'Serving brands across 11+ countries' },
  { icon: Clock, text: '24h response time, always' },
  { icon: Zap, text: '200+ brands grown since 2017' },
];

const ProofTicker = () => {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive(i => (i + 1) % PROOF_PILLS.length), 3200);
    return () => clearInterval(t);
  }, []);
  const pill = PROOF_PILLS[active];
  const Icon = pill.icon;
  return (
    <div className="hero-proof-ticker">
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          className="hero-proof-pill"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <Icon size={14} className="hero-proof-icon" />
          <span>{pill.text}</span>
        </motion.div>
      </AnimatePresence>
      <div className="hero-proof-dots">
        {PROOF_PILLS.map((_, i) => (
          <button key={i} className={`hero-proof-dot${i === active ? ' active' : ''}`} onClick={() => setActive(i)} aria-label={`Proof ${i+1}`} />
        ))}
      </div>
    </div>
  );
};

const Hero = () => {
  const { content } = useSettings();
  const heroContent = content?.hero || {};

  const eyebrow     = heroContent.eyebrow   || "For founders who've outgrown freelancers";
  const headline     = heroContent.title    || 'Your Brand Deserves Creative Work That Actually Converts.';
  const description  = heroContent.desc     ||
    "CreatifyBD is a dedicated creative team — branding, social, video, and web — built to make your business look and feel like an industry leader, without the industry-sized budget. No more chasing freelancers. No more agency price shock.";
  const cta1Label    = heroContent.cta1     || 'See Real Client Results';
  const cta2Label    = heroContent.cta2     || 'Get a Free Quote';
  const heroImage    = heroContent.mockup_primary || heroContent.hero_image || '/assets/hero-visual.png';

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
        {/* Eyebrow pill */}
          <motion.div
            className="hero-eyebrow-pill"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE_EXPO, delay: 0 }}
          >
            <span className="hero-eyebrow-dot" />
            {eyebrow}
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="hero-agency-h1"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE_EXPO, delay: 0.1 }}
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

          {/* Animated proof ticker */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: EASE_EXPO, delay: 0.55 }}
          >
            <ProofTicker />
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

            {/* Floating trust badge */}
            <motion.div
              className="hero-trust-badge"
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE_EXPO, delay: 0.9 }}
            >
              <div className="hero-trust-stars">
                {[0,1,2,3,4].map(i => <Star key={i} size={11} fill="#F59E0B" color="#F59E0B" />)}
              </div>
              <span className="hero-trust-text">4.9★ &mdash; 39+ verified reviews</span>
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

        /* Eyebrow pill */
        .hero-eyebrow-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.45rem 1rem 0.45rem 0.6rem;
          background: rgba(232,25,44,0.06);
          border: 1px solid rgba(232,25,44,0.18);
          border-radius: 100px;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--brand-red);
          letter-spacing: -0.01em;
          margin-bottom: 1.4rem;
          width: fit-content;
        }
        .hero-eyebrow-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--brand-red);
          animation: heroPulse 2s ease-in-out infinite;
          flex-shrink: 0;
        }

        /* Proof ticker */
        .hero-proof-ticker {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-top: 0;
        }
        .hero-proof-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.5rem 1.1rem 0.5rem 0.75rem;
          background: rgba(255,255,255,0.9);
          border: 1px solid var(--border);
          border-radius: 100px;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--ink);
          backdrop-filter: blur(8px);
          box-shadow: 0 2px 12px rgba(0,0,0,0.07);
          white-space: nowrap;
        }
        .hero-proof-icon {
          color: var(--brand-red);
          flex-shrink: 0;
        }
        .hero-proof-dots {
          display: flex;
          gap: 5px;
        }
        .hero-proof-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--border);
          border: none;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
          padding: 0;
        }
        .hero-proof-dot.active {
          background: var(--brand-red);
          transform: scale(1.3);
        }

        /* Floating trust badge */
        .hero-trust-badge {
          position: absolute;
          bottom: -1.5rem;
          left: -1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          padding: 0.75rem 1.1rem;
          background: rgba(255,255,255,0.95);
          border: 1px solid var(--border);
          border-radius: 14px;
          backdrop-filter: blur(12px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          z-index: 10;
        }
        .hero-trust-stars { display: flex; gap: 2px; }
        .hero-trust-text {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--ink);
          letter-spacing: -0.01em;
          white-space: nowrap;
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
          .hero-proof-ticker { justify-content: center; }
          .hero-agency-visual { max-width: 640px; margin: 0 auto; width: 100%; }
          .hero-trust-badge { left: 0.5rem; bottom: -1rem; }
        }
        @media (max-width: 640px) {
          .hero-agency-h1 { font-size: clamp(2.4rem, 11vw, 3.5rem); }
          .hero-agency-inner { padding: 2.5rem 1.25rem 3.5rem; }
          .hero-proof-pill { font-size: 0.75rem; }
          .hero-trust-badge { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-agency-pulse { animation: none; }
          .hero-eyebrow-dot { animation: none; }
          .hero-cta-primary:hover,
          .hero-cta-ghost:hover { transform: none; }
          .hero-img-single img { transition: none; }
        }
      `}</style>
    </section>
  );
};

export default Hero;
