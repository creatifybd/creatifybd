import React, { useMemo, useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock, RefreshCw, Shield, Star, TrendingUp, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';

const EASE_EXPO = [0.16, 1, 0.3, 1];
const EASE_OUT  = [0.25, 0.46, 0.45, 0.94];

const TRUST_PILLS = [
  { icon: <RefreshCw size={13} />, label: 'Unlimited Revisions' },
  { icon: <Clock size={13} />,     label: '48h First Delivery' },
  { icon: <Shield size={13} />,    label: '7-Day Money-Back' },
  { icon: <CheckCircle2 size={13} />, label: '100+ Projects Delivered' },
];

const STATS = [
  { value: '100+', label: 'Happy Clients' },
  { value: '500+', label: 'Projects Done' },
  { value: '48h',  label: 'First Delivery' },
  { value: '4.9★', label: 'Avg. Rating' },
];

/* ─── Noise canvas for grain texture ─── */
const NoiseCanvas = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width  = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;
    const img = ctx.createImageData(W, H);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() * 255;
      img.data[i] = img.data[i+1] = img.data[i+2] = v;
      img.data[i+3] = 18; // very subtle alpha
    }
    ctx.putImageData(img, 0, 0);
  }, []);
  return <canvas ref={canvasRef} className="hero-v2-noise" aria-hidden="true" />;
};

const Hero = () => {
  const { content } = useSettings();
  const heroContent = content?.hero || {};

  const heroTitle = heroContent.title ||
    'The creative team that makes your brand <span class="hero-highlight">impossible to ignore</span>';

  const heroEyebrow = heroContent.eyebrow ||
    'Serving brands across USA · Canada · Australia';

  const heroDesc = heroContent.desc ||
    'Social media, design, video, and web — delivered monthly by a dedicated creative team. Structured packages, clear timelines, zero agency overhead.';

  const heroPrimaryCta  = heroContent.cta1 || 'See Our Work';
  const heroSecondaryCta = heroContent.cta2 || 'Get a Free Proposal';

  const sanitizedTitle = useMemo(() => {
    return DOMPurify.sanitize(heroTitle, {
      ALLOWED_TAGS: ['span', 'br', 'strong', 'em'],
      ALLOWED_ATTR: ['class'],
    });
  }, [heroTitle]);

  return (
    <section className="hero-v2">
      {/* ── Rich multi-layer background ── */}
      <div className="hero-v2-bg" aria-hidden="true">
        <div className="hero-v2-glow-a" />
        <div className="hero-v2-glow-b" />
        <div className="hero-v2-glow-c" />
        <div className="hero-v2-grid" />
        <NoiseCanvas />
      </div>

      <div className="hero-v2-inner">
        {/* ── Eyebrow ── */}
        <motion.div
          className="hero-v2-eyebrow-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_EXPO, delay: 0 }}
        >
          <div className="hero-v2-eyebrow">
            <span className="hero-v2-pulse" />
            {heroEyebrow}
          </div>
        </motion.div>

        {/* ── Main Headline ── */}
        <motion.h1
          className="hero-v2-title"
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_EXPO, delay: 0.08 }}
          dangerouslySetInnerHTML={{ __html: sanitizedTitle }}
        />

        {/* ── Description ── */}
        <motion.p
          className="hero-v2-desc"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: EASE_EXPO, delay: 0.2 }}
        >
          {heroDesc}
        </motion.p>

        {/* ── CTAs ── */}
        <motion.div
          className="hero-v2-actions"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: EASE_EXPO, delay: 0.3 }}
        >
          <Link to="/portfolio" className="hero-v2-btn-primary">
            {heroPrimaryCta}
            <ArrowRight size={18} />
          </Link>
          <Link to="/contact" className="hero-v2-btn-outline">
            {heroSecondaryCta}
          </Link>
        </motion.div>

        {/* ── Trust Pills ── */}
        <motion.div
          className="hero-v2-trust"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, ease: EASE_EXPO, delay: 0.46 }}
        >
          {TRUST_PILLS.map((pill, i) => (
            <div className="hero-v2-pill" key={i}>
              {pill.icon}
              <span>{pill.label}</span>
            </div>
          ))}
        </motion.div>

        {/* ── Visual mockup card ── */}
        <motion.div
          className="hero-v2-visual"
          initial={{ opacity: 0, y: 56, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: EASE_EXPO, delay: 0.52 }}
        >
          {heroContent.mockup_primary ? (
            <img
              src={heroContent.mockup_primary}
              alt="CreatifyBD creative services dashboard"
              className="hero-v2-mockup-img"
              loading="eager"
              fetchPriority="high"
              width="1200"
              height="640"
            />
          ) : (
            <div className="hero-v2-dashboard">
              {/* Dashboard header */}
              <div className="hd-header">
                <div className="hd-dots">
                  <span /><span /><span />
                </div>
                <span className="hd-url">creatifybd.com · Client Portal</span>
                <div className="hd-actions">
                  <span className="hd-badge hd-badge-green">● Live</span>
                </div>
              </div>

              {/* Dashboard body */}
              <div className="hd-body">
                {/* Sidebar */}
                <div className="hd-sidebar">
                  <div className="hd-sb-logo">CB</div>
                  <nav className="hd-sb-nav">
                    {['Campaigns', 'Deliveries', 'Brief', 'Revisions', 'Reports'].map((item, i) => (
                      <div key={item} className={`hd-sb-item${i === 0 ? ' active' : ''}`}>
                        <span className="hd-sb-dot" />
                        {item}
                      </div>
                    ))}
                  </nav>
                  <div className="hd-sb-footer">
                    <div className="hd-sb-avatar">MD</div>
                    <div>
                      <strong>Mark Davis</strong>
                      <span>Pro Plan</span>
                    </div>
                  </div>
                </div>

                {/* Main panel */}
                <div className="hd-main">
                  {/* Stats row */}
                  <div className="hd-stats-row">
                    {STATS.map((s) => (
                      <div className="hd-stat" key={s.label}>
                        <strong>{s.value}</strong>
                        <span>{s.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Two column cards */}
                  <div className="hd-cards">
                    <div className="hd-card">
                      <div className="hd-card-head">
                        <span className="hd-card-title">Active Campaign</span>
                        <span className="hd-badge hd-badge-red">SMM</span>
                      </div>
                      <div className="hd-progress-track">
                        <div className="hd-progress-bar" style={{ width: '72%' }} />
                      </div>
                      <div className="hd-delivery-list">
                        {['Post_Design_v3.png', 'Reel_Script_Apr.docx', 'Stories_Pack.zip'].map((f) => (
                          <div className="hd-delivery-row" key={f}>
                            <span className="hd-file-dot" />
                            <span className="hd-file-name">{f}</span>
                            <span className="hd-file-badge">Ready</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="hd-card">
                      <div className="hd-card-head">
                        <span className="hd-card-title">This Week</span>
                        <span className="hd-badge hd-badge-blue">Schedule</span>
                      </div>
                      <div className="hd-calendar">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                          <div key={i} className={`hd-cal-day${i < 5 ? ' active' : ''}${i === 2 ? ' today' : ''}`}>
                            <span>{d}</span>
                            {i < 5 && <div className="hd-cal-bar" />}
                          </div>
                        ))}
                      </div>
                      <div className="hd-review-item">
                        <Star size={11} className="hd-star" />
                        <span>"Delivered exactly on time, great quality!"</span>
                      </div>
                    </div>
                  </div>

                  {/* Analytics mini strip */}
                  <div className="hd-analytics">
                    <div className="hd-analytics-item">
                      <TrendingUp size={14} className="hd-anal-icon hd-anal-green" />
                      <span className="hd-anal-val">+38%</span>
                      <span className="hd-anal-label">Reach this month</span>
                    </div>
                    <div className="hd-analytics-item">
                      <Zap size={14} className="hd-anal-icon hd-anal-red" />
                      <span className="hd-anal-val">12</span>
                      <span className="hd-anal-label">Posts scheduled</span>
                    </div>
                    <div className="hd-analytics-item">
                      <CheckCircle2 size={14} className="hd-anal-icon hd-anal-blue" />
                      <span className="hd-anal-val">3</span>
                      <span className="hd-anal-label">Awaiting approval</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Floating notification badges */}
          <motion.div
            className="hero-v2-float-badge hero-v2-float-badge--br"
            initial={{ opacity: 0, scale: 0.7, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT, delay: 1.1 }}
          >
            <CheckCircle2 size={16} />
            <span>Delivery approved!</span>
          </motion.div>

          <motion.div
            className="hero-v2-float-badge hero-v2-float-badge--tl"
            initial={{ opacity: 0, scale: 0.7, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT, delay: 1.3 }}
          >
            <Star size={14} className="badge-star" />
            <span>4.9 avg. rating</span>
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        /* ══════════════════════ HERO V2 ══════════════════════ */
        .hero-v2 {
          position: relative;
          background: #f8f5f2;
          overflow: hidden;
          padding-top: 120px;
        }

        /* ── Layered background ── */
        .hero-v2-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          user-select: none;
          z-index: 0;
        }
        .hero-v2-glow-a {
          position: absolute;
          width: 900px; height: 900px;
          border-radius: 50%;
          top: -300px; right: -200px;
          background: radial-gradient(circle, rgba(232,25,44,0.10) 0%, transparent 60%);
        }
        .hero-v2-glow-b {
          position: absolute;
          width: 700px; height: 700px;
          border-radius: 50%;
          bottom: 0; left: -200px;
          background: radial-gradient(circle, rgba(232,25,44,0.07) 0%, transparent 60%);
        }
        .hero-v2-glow-c {
          position: absolute;
          width: 500px; height: 500px;
          border-radius: 50%;
          top: 20%; left: 35%;
          background: radial-gradient(circle, rgba(255,140,50,0.05) 0%, transparent 65%);
        }
        /* Subtle grid lines */
        .hero-v2-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 0%, black 30%, transparent 100%);
        }
        .hero-v2-noise {
          position: absolute;
          inset: 0;
          width: 100%; height: 100%;
          mix-blend-mode: multiply;
          opacity: 0.35;
        }

        /* ── Center stack ── */
        .hero-v2-inner {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 1020px;
          margin: 0 auto;
          padding: 0 2rem 0;
        }

        /* Eyebrow */
        .hero-v2-eyebrow-wrap { margin-bottom: 1.75rem; }
        .hero-v2-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: var(--brand-red, #e8192c);
          background: rgba(232,25,44,0.06);
          border: 1px solid rgba(232,25,44,0.20);
          border-radius: 100px;
          padding: 0.45rem 1.2rem;
          backdrop-filter: blur(4px);
        }
        .hero-v2-pulse {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--brand-red, #e8192c);
          flex-shrink: 0;
          animation: heroV2Pulse 2s ease-in-out infinite;
        }
        @keyframes heroV2Pulse {
          0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 0 0 rgba(232,25,44,0.4); }
          50% { opacity: 0.6; transform: scale(1.3); box-shadow: 0 0 0 5px rgba(232,25,44,0); }
        }

        /* Headline */
        .hero-v2-title {
          font-size: clamp(3rem, 6.5vw, 5.5rem);
          font-weight: 900;
          line-height: 1.04;
          letter-spacing: -0.035em;
          color: #0a0a0f;
          margin: 0 0 1.75rem;
          max-width: 900px;
        }
        .hero-v2-title .hero-highlight {
          position: relative;
          color: var(--brand-red, #e8192c);
          display: inline-block;
        }
        .hero-v2-title .hero-highlight::after {
          content: '';
          position: absolute;
          bottom: 2px; left: 0; right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--brand-red, #e8192c), rgba(232,25,44,0.3));
          border-radius: 4px;
          opacity: 0.3;
        }

        /* Description */
        .hero-v2-desc {
          font-size: clamp(1rem, 2vw, 1.18rem);
          color: #4b5563;
          max-width: 600px;
          line-height: 1.8;
          margin: 0 0 2.5rem;
          font-weight: 400;
        }

        /* CTAs */
        .hero-v2-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 2rem;
        }
        .hero-v2-btn-primary {
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
          transition: background 0.22s ease, transform 0.22s ease, box-shadow 0.22s ease;
          box-shadow: 0 8px 28px rgba(232,25,44,0.28), 0 2px 6px rgba(232,25,44,0.18);
          letter-spacing: -0.01em;
        }
        .hero-v2-btn-primary:hover {
          background: #c41024;
          transform: translateY(-3px);
          box-shadow: 0 16px 40px rgba(232,25,44,0.38);
        }
        .hero-v2-btn-outline {
          display: inline-flex;
          align-items: center;
          padding: 0.95rem 2.25rem;
          background: rgba(255,255,255,0.8);
          color: #0a0a0f;
          font-weight: 700;
          font-size: 0.95rem;
          border-radius: 100px;
          border: 1.5px solid #e0e0e6;
          text-decoration: none;
          transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
          backdrop-filter: blur(4px);
          letter-spacing: -0.01em;
        }
        .hero-v2-btn-outline:hover {
          border-color: #0a0a0f;
          background: rgba(10,10,15,0.05);
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }

        /* Trust pills */
        .hero-v2-trust {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.55rem;
          flex-wrap: wrap;
          margin-bottom: 4.5rem;
        }
        .hero-v2-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.76rem;
          font-weight: 600;
          color: #374151;
          background: rgba(255,255,255,0.85);
          border: 1px solid #e5e7eb;
          border-radius: 100px;
          padding: 0.38rem 0.85rem;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
          transition: box-shadow 0.18s ease, transform 0.18s ease;
          backdrop-filter: blur(4px);
        }
        .hero-v2-pill:hover {
          box-shadow: 0 4px 14px rgba(0,0,0,0.10);
          transform: translateY(-2px);
        }
        .hero-v2-pill svg { color: var(--brand-red, #e8192c); flex-shrink: 0; }

        /* ── Dashboard Visual ── */
        .hero-v2-visual {
          position: relative;
          width: 100%;
          max-width: 1040px;
        }
        .hero-v2-mockup-img {
          width: 100%;
          border-radius: 16px;
          display: block;
        }
        .hero-v2-dashboard {
          width: 100%;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 16px 16px 0 0;
          box-shadow:
            0 0 0 1px rgba(0,0,0,0.04),
            0 40px 100px rgba(0,0,0,0.12),
            0 12px 32px rgba(232,25,44,0.07);
          overflow: hidden;
        }

        /* Dashboard header bar */
        .hd-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.25rem;
          border-bottom: 1px solid #f0f0f4;
          background: #fafafa;
        }
        .hd-dots { display: flex; gap: 5px; }
        .hd-dots span { width: 10px; height: 10px; border-radius: 50%; background: #e5e7eb; }
        .hd-dots span:first-child  { background: #f87171; }
        .hd-dots span:nth-child(2) { background: #fbbf24; }
        .hd-dots span:nth-child(3) { background: #34d399; }
        .hd-url {
          flex: 1;
          font-size: 0.72rem;
          color: #9ca3af;
          font-weight: 500;
          text-align: center;
        }
        .hd-badge {
          font-size: 0.68rem;
          font-weight: 700;
          padding: 0.2rem 0.6rem;
          border-radius: 100px;
        }
        .hd-badge-green { background: #dcfce7; color: #166534; }
        .hd-badge-red   { background: #fee2e2; color: #991b1b; }
        .hd-badge-blue  { background: #dbeafe; color: #1e40af; }

        /* Dashboard body */
        .hd-body {
          display: grid;
          grid-template-columns: 160px 1fr;
          min-height: 360px;
        }

        /* Sidebar */
        .hd-sidebar {
          border-right: 1px solid #f0f0f4;
          padding: 1.25rem 0;
          display: flex;
          flex-direction: column;
          background: #fafafa;
        }
        .hd-sb-logo {
          width: 34px; height: 34px;
          border-radius: 8px;
          background: var(--brand-red, #e8192c);
          color: #fff;
          font-size: 0.72rem;
          font-weight: 900;
          display: flex; align-items: center; justify-content: center;
          margin: 0 1rem 1.25rem;
          box-shadow: 0 4px 12px rgba(232,25,44,0.30);
        }
        .hd-sb-nav { flex: 1; }
        .hd-sb-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.55rem 1rem;
          font-size: 0.72rem;
          font-weight: 600;
          color: #9ca3af;
          transition: background 0.15s;
        }
        .hd-sb-item.active {
          color: var(--brand-red, #e8192c);
          background: rgba(232,25,44,0.06);
          border-right: 2px solid var(--brand-red, #e8192c);
        }
        .hd-sb-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: currentColor;
          opacity: 0.4;
          flex-shrink: 0;
        }
        .hd-sb-footer {
          display: flex; align-items: center; gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-top: 1px solid #f0f0f4;
          margin-top: auto;
        }
        .hd-sb-avatar {
          width: 28px; height: 28px; border-radius: 50%;
          background: var(--brand-red, #e8192c); color: #fff;
          font-size: 0.6rem; font-weight: 900;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .hd-sb-footer strong { font-size: 0.7rem; display: block; line-height: 1.2; color: #111; }
        .hd-sb-footer span { font-size: 0.6rem; color: #9ca3af; }

        /* Main panel */
        .hd-main { padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; }

        .hd-stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.6rem;
        }
        .hd-stat {
          background: #fafafa;
          border: 1px solid #f0f0f4;
          border-radius: 10px;
          padding: 0.65rem 0.75rem;
          display: flex; flex-direction: column; gap: 0.15rem;
        }
        .hd-stat strong {
          font-size: 1rem; font-weight: 900;
          color: var(--brand-red, #e8192c); line-height: 1;
        }
        .hd-stat span { font-size: 0.62rem; color: #9ca3af; font-weight: 500; }

        .hd-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
        .hd-card {
          border: 1px solid #f0f0f4;
          border-radius: 10px;
          padding: 0.85rem;
          display: flex; flex-direction: column; gap: 0.6rem;
        }
        .hd-card-head { display: flex; align-items: center; justify-content: space-between; }
        .hd-card-title { font-size: 0.72rem; font-weight: 700; color: #111; }

        .hd-progress-track { height: 4px; background: #f3f4f6; border-radius: 100px; overflow: hidden; }
        .hd-progress-bar { height: 100%; background: var(--brand-red, #e8192c); border-radius: 100px; }

        .hd-delivery-list { display: flex; flex-direction: column; gap: 0.3rem; }
        .hd-delivery-row { display: flex; align-items: center; gap: 0.4rem; font-size: 0.63rem; }
        .hd-file-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--brand-red, #e8192c); flex-shrink: 0; }
        .hd-file-name { flex: 1; color: #374151; font-weight: 500; }
        .hd-file-badge { background: #dcfce7; color: #166534; font-size: 0.58rem; font-weight: 700; padding: 0.1rem 0.4rem; border-radius: 100px; }

        .hd-calendar { display: flex; gap: 0.3rem; align-items: flex-end; }
        .hd-cal-day { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.25rem; }
        .hd-cal-day span { font-size: 0.57rem; color: #9ca3af; font-weight: 600; }
        .hd-cal-bar { width: 100%; height: 24px; border-radius: 4px; background: #f3f4f6; }
        .hd-cal-day.active .hd-cal-bar { background: rgba(232,25,44,0.15); }
        .hd-cal-day.today .hd-cal-bar { background: var(--brand-red, #e8192c); }

        .hd-review-item {
          display: flex; align-items: flex-start; gap: 0.4rem;
          background: #fafafa; border-radius: 8px;
          padding: 0.5rem 0.6rem;
          font-size: 0.61rem; color: #374151; font-style: italic;
        }
        .hd-star { color: #f59e0b; flex-shrink: 0; margin-top: 1px; }

        /* Analytics mini strip */
        .hd-analytics {
          display: flex; gap: 0.6rem;
        }
        .hd-analytics-item {
          flex: 1; display: flex; align-items: center; gap: 0.35rem;
          background: #fafafa; border: 1px solid #f0f0f4;
          border-radius: 8px; padding: 0.55rem 0.65rem;
        }
        .hd-anal-icon { flex-shrink: 0; }
        .hd-anal-val { font-size: 0.8rem; font-weight: 800; color: #111; }
        .hd-anal-label { font-size: 0.58rem; color: #9ca3af; }
        .hd-anal-green { color: #22c55e; }
        .hd-anal-red   { color: #e8192c; }
        .hd-anal-blue  { color: #3b82f6; }

        /* Floating badges */
        .hero-v2-float-badge {
          position: absolute;
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: #fff;
          border-radius: 100px;
          padding: 0.55rem 1.15rem;
          font-size: 0.8rem;
          font-weight: 700;
          color: #0a0a0f;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06);
          white-space: nowrap;
          border: 1px solid rgba(0,0,0,0.06);
        }
        .hero-v2-float-badge--br {
          bottom: -18px; right: 40px;
        }
        .hero-v2-float-badge--br svg { color: #22c55e; }
        .hero-v2-float-badge--tl {
          top: -18px; left: 40px;
        }
        .hero-v2-float-badge--tl .badge-star { color: #f59e0b; }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .hero-v2 { padding-top: 100px; }
          .hero-v2-title { font-size: clamp(2.4rem, 10vw, 3.4rem); }
          .hero-v2-inner { padding: 0 1.25rem; }
          .hd-body { grid-template-columns: 1fr; }
          .hd-sidebar { display: none; }
          .hd-stats-row { grid-template-columns: repeat(2, 1fr); }
          .hd-cards { grid-template-columns: 1fr; }
          .hd-analytics { flex-direction: column; }
          .hero-v2-float-badge--br { right: 12px; bottom: -14px; font-size: 0.7rem; }
          .hero-v2-float-badge--tl { left: 12px; top: -14px; font-size: 0.7rem; }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-v2-pulse { animation: none; }
          .hero-v2-btn-primary:hover,
          .hero-v2-btn-outline:hover,
          .hero-v2-pill:hover { transform: none; }
        }
      `}</style>
    </section>
  );
};

export default Hero;
