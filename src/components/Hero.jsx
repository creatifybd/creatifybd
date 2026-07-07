import React, { useMemo, useEffect, useRef, useState } from 'react';
import DOMPurify from 'dompurify';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock, RefreshCw, Shield, Star, Play } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';

const EASE_EXPO = [0.16, 1, 0.3, 1];

const TRUST_PILLS = [
  { icon: <RefreshCw size={13} />, label: 'Unlimited Revisions' },
  { icon: <Clock size={13} />,     label: 'Premium Turnaround' },
  { icon: <Shield size={13} />,    label: '7-Day Money-Back' },
  { icon: <CheckCircle2 size={13} />, label: '500+ Projects Done' },
];

const STATS = [
  { value: '500+', label: 'Projects' },
  { value: '100+', label: 'Clients' },
  { value: '5.0★', label: 'Rating' },
  { value: 'Global', label: 'Coverage' },
];

/* Portfolio preview images for the visual grid */
const PREVIEW_IMAGES = [
  '/assets/portfolio/logo-design-branding/logo-design-branding-01.jpg',
  '/assets/portfolio/social-media-management/social-media-management-01.jpg',
  '/assets/portfolio/video-editing/video-editing-01.jpg',
  '/assets/portfolio/website-design/website-design-01.jpg',
];

const NoiseCanvas = () => {
  const canvasRef = useRef(null);
  
  const noiseData = useMemo(() => {
    const W = 100;
    const H = 100;
    const img = new Uint8ClampedArray(W * H * 4);
    for (let i = 0; i < img.length; i += 4) {
      const v = Math.random() * 255;
      img[i] = img[i+1] = img[i+2] = v;
      img[i+3] = 14;
    }
    return { W, H, img };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const imageData = ctx.createImageData(noiseData.W, noiseData.H);
    for (let i = 0; i < noiseData.img.length; i++) {
      imageData.data[i] = noiseData.img[i];
    }
    
    // Scale up the noise pattern
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = noiseData.W;
    tempCanvas.height = noiseData.H;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.putImageData(imageData, 0, 0);
    
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
  }, [noiseData]);
  
  return <canvas ref={canvasRef} className="hero-noise" aria-hidden="true" />;
};

const Hero = () => {
  const { content } = useSettings();
  const heroContent = content?.hero || {};

  const heroTitle = heroContent.title ||
    'The creative team that makes your brand <span class="hero-hl">impossible to ignore</span>';

  const heroEyebrow = heroContent.eyebrow ||
    'High-end creative execution globally';

  const heroDesc = heroContent.desc ||
    'Social media, design, video, and web — delivered monthly by a dedicated creative team. Structured packages, clear timelines, zero agency overhead.';

  const heroPrimaryCta  = heroContent.cta1 || 'See Our Work';
  const heroSecondaryCta = heroContent.cta2 || 'Get a Free Proposal';

  const sanitizedTitle = useMemo(() => DOMPurify.sanitize(heroTitle, {
    ALLOWED_TAGS: ['span', 'br', 'strong', 'em'],
    ALLOWED_ATTR: ['class'],
  }), [heroTitle]);

  // Split title into words for stagger animation
  const titleWords = useMemo(() => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = sanitizedTitle;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    return text.split(' ').map((word, i) => (
      <span key={i} className="hero-word">{word}</span>
    ));
  }, [sanitizedTitle]);

  const previewImages = heroContent.preview_images || PREVIEW_IMAGES;

  // Parallax effect for visual grid
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -50]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);

  return (
    <section className="hero-split">
      {/* Background */}
      <div className="hero-split-bg" aria-hidden="true">
        <div className="hero-split-glow-a" />
        <div className="hero-split-glow-b" />
        <div className="hero-split-grid" />
        <NoiseCanvas />
      </div>

      <div className="hero-split-inner">
        {/* ── LEFT COLUMN ── */}
        <div className="hero-split-copy">
          <motion.div
            className="hero-split-eyebrow-wrap"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_EXPO }}
          >
            <div className="hero-split-eyebrow">
              <span className="hero-split-pulse" />
              {heroEyebrow}
            </div>
          </motion.div>

          <motion.h1
            className="hero-split-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_EXPO, delay: 0.08 }}
          >
            {titleWords.map((word, i) => (
              <motion.span
                key={i}
                className="hero-word-wrapper"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE_EXPO, delay: 0.1 + i * 0.05 }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            className="hero-split-desc"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: EASE_EXPO, delay: 0.2 }}
          >
            {heroDesc}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="hero-split-actions"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE_EXPO, delay: 0.3 }}
          >
            <Link to="/portfolio" className="hero-split-btn-primary">
              {heroPrimaryCta}
              <ArrowRight size={18} />
            </Link>
            <Link to="/contact" className="hero-split-btn-outline">
              {heroSecondaryCta}
            </Link>
            {heroContent.reel_url && (
              <a
                href={heroContent.reel_url}
                target="_blank"
                rel="noreferrer"
                className="hero-split-btn-reel"
                aria-label="Watch our reel"
              >
                <span className="hero-reel-icon"><Play size={14} fill="currentColor" /></span>
                Watch Reel
              </a>
            )}
          </motion.div>

          {/* Trust pills */}
          <motion.div
            className="hero-split-trust"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease: EASE_EXPO, delay: 0.44 }}
          >
            {TRUST_PILLS.map((pill, i) => (
              <div className="hero-split-pill" key={i}>
                {pill.icon}
                <span>{pill.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Inline stats */}
          <motion.div
            className="hero-split-stats"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE_EXPO, delay: 0.55 }}
          >
            {STATS.map((s, i) => (
              <React.Fragment key={s.label}>
                <div className="hero-split-stat">
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
                {i < STATS.length - 1 && <div className="hero-split-stat-div" aria-hidden="true" />}
              </React.Fragment>
            ))}
          </motion.div>
        </div>

        {/* ── RIGHT COLUMN — Visual Grid ── */}
        <motion.div
          className="hero-split-visual"
          initial={{ opacity: 0, x: 48, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: EASE_EXPO, delay: 0.18 }}
          style={{ y: y1 }}
        >
          {heroContent.mockup_primary ? (
            <img
              src={heroContent.mockup_primary}
              alt="CreatifyBD creative services"
              className="hero-split-mockup-img"
              loading="eager"
              fetchPriority="high"
              width="640"
              height="560"
            />
          ) : (
            <div className="hero-split-grid-wrap">
              {/* Large featured image */}
              <motion.div className="hero-grid-main" style={{ y: y2 }}>
                <img
                  src={previewImages[0]}
                  alt="Graphic design work"
                  loading="eager"
                  fetchPriority="high"
                />
                <div className="hero-grid-overlay">
                  <span>Graphic Design</span>
                </div>
              </motion.div>

              {/* Right column — 2 stacked */}
              <div className="hero-grid-col">
                <motion.div className="hero-grid-item" style={{ y: y1 }}>
                  <img src={previewImages[1]} alt="Social media content" loading="eager" />
                  <div className="hero-grid-overlay"><span>Social Media</span></div>
                </motion.div>
                <motion.div className="hero-grid-item" style={{ y: y2 }}>
                  <img src={previewImages[2]} alt="Video editing" loading="lazy" />
                  <div className="hero-grid-overlay"><span>Video Editing</span></div>
                </motion.div>
              </div>

              {/* Bottom strip */}
              <motion.div className="hero-grid-bottom" style={{ y: y1 }}>
                <img src={previewImages[3]} alt="Digital marketing" loading="lazy" />
                <div className="hero-grid-overlay"><span>Digital Marketing</span></div>
              </motion.div>

              {/* Floating badges */}
              <motion.div
                className="hero-float-badge hero-float-badge--tr"
                initial={{ opacity: 0, scale: 0.7, y: -12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE_EXPO, delay: 1.1 }}
              >
                <Star size={14} className="badge-star" />
                <span>5.0 avg. rating</span>
              </motion.div>

              <motion.div
                className="hero-float-badge hero-float-badge--bl"
                initial={{ opacity: 0, scale: 0.7, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE_EXPO, delay: 1.3 }}
              >
                <CheckCircle2 size={15} />
                <span>Delivery approved!</span>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>

      <style>{`
        /* ══════════════════ HERO SPLIT ══════════════════ */
        .hero-split {
          position: relative;
          background: var(--surface, #FFFBFB);
          overflow: hidden;
          padding-top: var(--nav-height, 90px);
        }

        /* Background layers */
        .hero-split-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }
        .hero-split-glow-a {
          position: absolute;
          width: 800px; height: 800px;
          border-radius: 50%;
          top: -250px; right: -150px;
          background: radial-gradient(circle, rgba(232,25,44,0.10) 0%, transparent 60%);
        }
        .hero-split-glow-b {
          position: absolute;
          width: 500px; height: 500px;
          border-radius: 50%;
          bottom: -100px; left: -100px;
          background: radial-gradient(circle, rgba(232,25,44,0.06) 0%, transparent 60%);
        }
        .hero-split-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,0,0,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.025) 1px, transparent 1px);
          background-size: 52px 52px;
          mask-image: radial-gradient(ellipse 90% 80% at 60% 0%, black 20%, transparent 100%);
        }
        .hero-noise {
          position: absolute;
          inset: 0;
          width: 100%; height: 100%;
          mix-blend-mode: multiply;
          opacity: 0.3;
        }

        /* Inner two-column layout */
        .hero-split-inner {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: clamp(3rem, 5vw, 6rem);
          max-width: 1280px;
          margin: 0 auto;
          padding: clamp(3.5rem, 6vw, 6rem) clamp(1.5rem, 4vw, 3rem) clamp(4rem, 7vw, 7rem);
        }

        /* ── Copy column ── */
        .hero-split-copy {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0;
        }

        /* Eyebrow */
        .hero-split-eyebrow-wrap { margin-bottom: 1.75rem; }
        .hero-split-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--brand-red, #e8192c);
          background: rgba(232,25,44,0.06);
          border: 1px solid rgba(232,25,44,0.18);
          border-radius: 100px;
          padding: 0.42rem 1.1rem;
        }
        .hero-split-pulse {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--brand-red, #e8192c);
          flex-shrink: 0;
          animation: heroSplitPulse 2s ease-in-out infinite;
        }
        @keyframes heroSplitPulse {
          0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 0 0 rgba(232,25,44,0.4); }
          50% { opacity: 0.6; transform: scale(1.3); box-shadow: 0 0 0 5px rgba(232,25,44,0); }
        }

        /* Headline */
        .hero-split-title {
          font-size: clamp(2.8rem, 5.5vw, 5rem);
          font-weight: 900;
          line-height: 1.04;
          letter-spacing: -0.035em;
          color: var(--ink, #0a0a0f);
          margin: 0 0 1.5rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.3em;
        }
        .hero-word-wrapper {
          display: inline-block;
          white-space: nowrap;
        }
        .hero-word-wrapper .hero-hl {
          position: relative;
          color: var(--brand-red, #e8192c);
          display: inline-block;
        }
        .hero-word-wrapper .hero-hl::after {
          content: '';
          position: absolute;
          bottom: 2px; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--brand-red, #e8192c), rgba(232,25,44,0.25));
          border-radius: 4px;
          opacity: 0.35;
        }

        /* Description */
        .hero-split-desc {
          font-size: clamp(0.98rem, 1.6vw, 1.12rem);
          color: var(--ink-soft, #1f2937);
          max-width: 520px;
          line-height: 1.8;
          margin: 0 0 2.25rem;
          font-weight: 400;
        }

        /* CTAs */
        .hero-split-actions {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          flex-wrap: wrap;
          margin-bottom: 1.75rem;
        }
        .hero-split-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.9rem 2rem;
          background: var(--brand-red, #e8192c);
          color: var(--white, #fff);
          font-weight: 700;
          font-size: 0.92rem;
          border-radius: 100px;
          text-decoration: none;
          transition: background 0.22s ease, transform 0.22s ease, box-shadow 0.22s ease;
          box-shadow: 0 8px 28px rgba(232,25,44,0.28), 0 2px 6px rgba(232,25,44,0.18);
          letter-spacing: -0.01em;
        }
        .hero-split-btn-primary:hover {
          background: var(--brand-red-dark, #c41024);
          transform: translateY(-3px);
          box-shadow: 0 16px 40px rgba(232,25,44,0.38);
          color: var(--white, #fff);
        }
        .hero-split-btn-outline {
          display: inline-flex;
          align-items: center;
          padding: 0.9rem 2rem;
          background: rgba(255,255,255,0.85);
          color: var(--ink, #0a0a0f);
          font-weight: 700;
          font-size: 0.92rem;
          border-radius: 100px;
          border: 1.5px solid #e0e0e6;
          text-decoration: none;
          transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
          backdrop-filter: blur(4px);
          letter-spacing: -0.01em;
        }
        .hero-split-btn-outline:hover {
          border-color: var(--ink, #0a0a0f);
          background: rgba(10,10,15,0.05);
          transform: translateY(-3px);
          color: var(--ink, #0a0a0f);
        }
        .hero-split-btn-reel {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.9rem 1.5rem;
          background: transparent;
          color: var(--brand-red, #e8192c);
          font-weight: 700;
          font-size: 0.88rem;
          border-radius: 100px;
          text-decoration: none;
          transition: background 0.2s ease;
        }
        .hero-split-btn-reel:hover { background: rgba(232,25,44,0.06); color: var(--brand-red, #e8192c); }
        .hero-reel-icon {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: var(--brand-red, #e8192c);
          color: var(--white, #fff);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(232,25,44,0.3);
        }

        /* Trust pills */
        .hero-split-trust {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 2rem;
        }
        .hero-split-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.38rem;
          font-size: 0.73rem;
          font-weight: 600;
          color: var(--ink, #0a0a0f);
          background: rgba(255,255,255,0.9);
          border: 1px solid #e5e7eb;
          border-radius: 100px;
          padding: 0.35rem 0.8rem;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          transition: box-shadow 0.18s ease, transform 0.18s ease;
          backdrop-filter: blur(4px);
        }
        .hero-split-pill:hover { box-shadow: 0 4px 14px rgba(0,0,0,0.08); transform: translateY(-2px); }
        .hero-split-pill svg { color: var(--brand-red, #e8192c); flex-shrink: 0; }

        /* Stats row */
        .hero-split-stats {
          display: flex;
          align-items: center;
          gap: 0;
          padding: 1.25rem 1.5rem;
          background: rgba(255,255,255,0.85);
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          backdrop-filter: blur(8px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        }
        .hero-split-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.15rem;
          padding: 0 1.5rem;
          text-align: center;
        }
        .hero-split-stat strong {
          font-size: 1.5rem;
          font-weight: 900;
          color: var(--brand-red, #e8192c);
          line-height: 1;
          letter-spacing: -0.03em;
          font-family: var(--font-display, 'Plus Jakarta Sans', sans-serif);
        }
        .hero-split-stat span {
          font-size: 0.68rem;
          color: var(--text-dim, #9ca3af);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .hero-split-stat-div {
          width: 1px;
          height: 32px;
          background: var(--border, #e5e7eb);
          flex-shrink: 0;
        }

        /* ── Visual column ── */
        .hero-split-visual {
          position: relative;
        }
        .hero-split-mockup-img {
          width: 100%;
          border-radius: 20px;
          display: block;
          box-shadow: 0 32px 80px rgba(0,0,0,0.12);
        }

        /* Image grid */
        .hero-split-grid-wrap {
          position: relative;
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: auto auto;
          gap: 0.75rem;
        }
        .hero-grid-main {
          grid-column: 1;
          grid-row: 1;
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          aspect-ratio: 4/3;
          background: var(--surface-soft, #f4f4f2);
        }
        .hero-grid-col {
          grid-column: 2;
          grid-row: 1;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .hero-grid-item {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          flex: 1;
          background: var(--surface-soft, #f4f4f2);
          min-height: 120px;
        }
        .hero-grid-bottom {
          grid-column: 1 / -1;
          grid-row: 2;
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          aspect-ratio: 16/5;
          background: var(--surface-soft, #f4f4f2);
        }
        .hero-grid-main img,
        .hero-grid-item img,
        .hero-grid-bottom img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.55s cubic-bezier(0.25,0.8,0.25,1);
        }
        .hero-grid-main:hover img,
        .hero-grid-item:hover img,
        .hero-grid-bottom:hover img { transform: scale(1.05); }
        .hero-grid-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 40%, rgba(10,10,15,0.72) 100%);
          display: flex;
          align-items: flex-end;
          padding: 0.75rem;
          opacity: 0;
          transition: opacity 0.28s ease;
        }
        .hero-grid-main:hover .hero-grid-overlay,
        .hero-grid-item:hover .hero-grid-overlay,
        .hero-grid-bottom:hover .hero-grid-overlay { opacity: 1; }
        .hero-grid-overlay span {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--white, #fff);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        /* Floating badges */
        .hero-float-badge {
          position: absolute;
          display: inline-flex;
          align-items: center;
          gap: 0.42rem;
          background: var(--white, #fff);
          border-radius: 100px;
          padding: 0.5rem 1rem;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--ink, #0a0a0f);
          box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06);
          white-space: nowrap;
          border: 1px solid rgba(0,0,0,0.06);
          z-index: 2;
        }
        .hero-float-badge--tr { top: -14px; right: -14px; }
        .hero-float-badge--tr .badge-star { color: var(--warning, #f59e0b); }
        .hero-float-badge--bl { bottom: 60px; left: -14px; }
        .hero-float-badge--bl svg { color: var(--success, #22c55e); }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .hero-split-inner {
            grid-template-columns: 1fr;
            gap: 3rem;
            padding-bottom: 4rem;
          }
          .hero-split-copy { align-items: center; text-align: center; }
          .hero-split-desc { max-width: 600px; }
          .hero-split-actions { justify-content: center; }
          .hero-split-trust { justify-content: center; }
          .hero-split-stats { align-self: center; }
          .hero-split-visual { max-width: 640px; margin: 0 auto; width: 100%; }
          .hero-float-badge--tr { top: -10px; right: 10px; }
          .hero-float-badge--bl { bottom: 50px; left: 10px; }
        }
        @media (max-width: 640px) {
          .hero-split-title { font-size: clamp(2.2rem, 10vw, 3.2rem); }
          .hero-split-inner { padding: 2.5rem 1.25rem 3.5rem; }
          .hero-split-stats { padding: 1rem; gap: 0; }
          .hero-split-stat { padding: 0 0.85rem; }
          .hero-split-stat strong { font-size: 1.2rem; }
          .hero-grid-bottom { display: none; }
          .hero-float-badge { font-size: 0.68rem; padding: 0.4rem 0.75rem; }
          .hero-float-badge--tr { top: -8px; right: 8px; }
          .hero-float-badge--bl { bottom: 12px; left: 8px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-split-pulse { animation: none; }
          .hero-split-btn-primary:hover,
          .hero-split-btn-outline:hover,
          .hero-split-pill:hover { transform: none; }
          .hero-grid-main img,
          .hero-grid-item img,
          .hero-grid-bottom img { transition: none; }
        }
      `}</style>
    </section>
  );
};

export default Hero;
