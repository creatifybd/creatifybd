import React from 'react';
import { motion } from 'framer-motion';
import {
  Repeat, RotateCcw, Zap, UserCheck, LayoutGrid, FileCode,
} from 'lucide-react';

const EASE_EXPO = [0.16, 1, 0.3, 1];

const FEATURES = [
  {
    num: '01',
    accent: '#E8192C',
    icon: <UserCheck size={20} />,
    title: 'Senior-Level Creatives',
    desc: 'Every piece of content, design, and video is crafted by senior creative experts, ensuring top-tier global standards.',
  },
  {
    num: '02',
    accent: '#F59E0B',
    icon: <Zap size={20} />,
    title: 'Async Efficiency (No Meetings)',
    desc: 'We coordinate asynchronously via shared dashboards, eliminating useless alignment meetings to save you hours of time.',
  },
  {
    num: '03',
    accent: '#22C55E',
    icon: <LayoutGrid size={20} />,
    title: 'Up to 40% Less Retainers',
    desc: 'No sales commissions, no physical offices, and no administrative bloat. We pass 100% of these savings directly to you.',
  },
  {
    num: '04',
    accent: '#6366F1',
    icon: <Repeat size={20} />,
    title: 'Unlimited Revisions',
    desc: 'We iterate and refine designs or copywriting until they match your expectations perfectly — no extra fees.',
  },
  {
    num: '05',
    accent: '#EC4899',
    icon: <FileCode size={20} />,
    title: 'Source Files Included',
    desc: 'All Figma, PSD, AI, or project files are delivered upon completion. You own 100% of your assets.',
  },
  {
    num: '06',
    accent: '#14B8A6',
    icon: <RotateCcw size={20} />,
    title: 'Zero Long-Term Lock-in',
    desc: 'No complex agency contracts or commitments. Pause, cancel, or resume your subscription anytime.',
  },
];

const WhyUsSection = () => (
  <section className="why-v3-section" aria-labelledby="why-v3-heading">
    <div className="section-container">

      {/* Header */}
      <motion.div
        className="why-v3-header"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: EASE_EXPO }}
      >
        <div className="eyebrow why-v3-eyebrow">Why CreatifyBD</div>
        <h2 id="why-v3-heading" className="section-h why-v3-heading">
          Elite creative operations<br />
          <span className="text-red">without the agency markup</span>
        </h2>
        <p className="section-subtext">
          We combine senior-level talent, asynchronous project management, and upfront value pricing to deliver premium results at a fraction of standard rates.
        </p>
      </motion.div>

      {/* Feature grid */}
      <div className="why-v3-grid">
        {FEATURES.map((f, i) => (
          <motion.article
            key={f.num}
            className="why-v3-card"
            style={{ '--card-accent': f.accent }}
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, ease: EASE_EXPO, delay: i * 0.07 }}
            aria-label={f.title}
          >
            <div className="why-v3-top">
              <span className="why-v3-num">{f.num}</span>
              <div
                className="why-v3-icon"
                style={{ color: f.accent, background: `${f.accent}14` }}
              >
                {f.icon}
              </div>
            </div>
            <h3 className="why-v3-title">{f.title}</h3>
            <p className="why-v3-desc">{f.desc}</p>
            <div className="why-v3-accent-line" />
          </motion.article>
        ))}
      </div>

      {/* Bottom trust strip */}
      <motion.div
        className="why-v3-strip"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: EASE_EXPO, delay: 0.4 }}
      >
        {[
          { val: 'No', label: 'Lock-in contracts' },
          { val: '24h', label: 'Response guarantee' },
          { val: '100%', label: 'Scope transparency' },
          { val: '7-day', label: 'Money-back window' },
        ].map((s) => (
          <div className="why-v3-strip-item" key={s.label}>
            <strong>{s.val}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </motion.div>
    </div>

    <style>{`
      .why-v3-section {
        padding: 9rem 0;
        background: var(--surface);
        position: relative;
        overflow: hidden;
      }
      .why-v3-section::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background: radial-gradient(ellipse 60% 40% at 50% 10%, rgba(232,25,44,0.05) 0%, transparent 70%);
        pointer-events: none;
      }
      .why-v3-header {
        text-align: center;
        max-width: 800px;
        margin: 0 auto 6rem;
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .why-v3-eyebrow {
        margin-bottom: 1.5rem;
      }
      .why-v3-heading {
        margin: 0 auto 1.5rem !important;
      }
      .section-subtext {
        font-size: clamp(1rem, 2.5vw, 1.15rem);
        color: var(--muted);
        max-width: 640px;
        line-height: 1.6;
      }
      .why-v3-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.75rem;
        max-width: 1200px;
        margin: 0 auto;
        position: relative;
        z-index: 1;
      }
      .why-v3-card {
        position: relative;
        background: var(--glass);
        backdrop-filter: var(--glass-blur);
        -webkit-backdrop-filter: var(--glass-blur);
        border: 1px solid var(--glass-border);
        border-radius: 24px;
        padding: 3rem 2.25rem;
        overflow: hidden;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.02);
      }
      .why-v3-card::before {
        content: '';
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at 100% 100%, var(--card-accent) 0%, transparent 60%);
        opacity: 0;
        transition: opacity 0.4s ease;
        z-index: 0;
      }
      .why-v3-card:hover {
        transform: translateY(-8px) scale(1.01);
        border-color: var(--card-accent) !important;
        box-shadow: 0 30px 60px rgba(0, 0, 0, 0.08), var(--shadow-md) !important;
      }
      .why-v3-card:hover::before {
        opacity: 0.08;
      }
      .why-v3-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 2rem;
        position: relative;
        z-index: 1;
      }
      .why-v3-num {
        font-size: 0.8rem;
        font-weight: 900;
        letter-spacing: 0.15em;
        color: var(--muted);
        opacity: 0.4;
      }
      .why-v3-icon {
        width: 52px;
        height: 52px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s;
        background: var(--surface-soft);
        box-shadow: inset 0 0 0 1px rgba(255,255,255,0.1);
      }
      .why-v3-card:hover .why-v3-icon {
        transform: scale(1.1) rotate(-8deg);
        box-shadow: 0 10px 20px rgba(0,0,0,0.05);
      }
      .why-v3-title {
        font-size: 1.25rem;
        font-weight: 900;
        color: var(--ink);
        line-height: 1.25;
        margin: 0 0 0.8rem;
        letter-spacing: -0.02em;
        position: relative;
        z-index: 1;
        transition: color 0.3s;
      }
      .why-v3-card:hover .why-v3-title {
        color: var(--card-accent);
      }
      .why-v3-desc {
        font-size: 0.92rem;
        color: var(--muted);
        line-height: 1.7;
        margin: 0;
        position: relative;
        z-index: 1;
      }
      .why-v3-accent-line {
        position: absolute;
        bottom: 0; left: 0;
        height: 3px;
        width: 0%;
        background: var(--card-accent);
        transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        z-index: 1;
      }
      .why-v3-card:hover .why-v3-accent-line { width: 100%; }

      /* Trust strip */
      .why-v3-strip {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0;
        margin-top: 6rem;
        padding: 2.5rem;
        background: var(--glass);
        backdrop-filter: var(--glass-blur);
        -webkit-backdrop-filter: var(--glass-blur);
        border: 1px solid var(--glass-border);
        border-radius: 24px;
        max-width: 900px;
        margin-inline: auto;
        box-shadow: var(--shadow-md);
        position: relative;
        z-index: 1;
      }
      .why-v3-strip-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;
        padding: 0 1.5rem;
        border-right: 1px solid #EBEBF0;
      }
      .why-v3-strip-item:last-child { border-right: none; }
      .why-v3-strip-item strong {
        font-size: 1.5rem;
        font-weight: 900;
        color: var(--ink, #0F0F12);
        letter-spacing: -0.04em;
        line-height: 1;
      }
      .why-v3-strip-item span {
        font-size: 0.72rem;
        font-weight: 600;
        color: var(--muted, #9CA3AF);
        text-transform: uppercase;
        letter-spacing: 0.06em;
        text-align: center;
        line-height: 1.4;
      }

      @media (max-width: 900px) {
        .why-v3-grid { grid-template-columns: repeat(2, 1fr); }
      }
      @media (max-width: 600px) {
        .why-v3-section { padding: 5rem 0; }
        .why-v3-header { margin-bottom: 3rem; }
        .why-v3-grid { grid-template-columns: 1fr; gap: 1rem; }
        .why-v3-card { padding: 1.5rem; }
        .why-v3-strip { flex-wrap: wrap; gap: 1.5rem; padding: 1.5rem; }
        .why-v3-strip-item { border-right: none; padding: 0; flex: 0 0 45%; }
      }
    `}</style>
  </section>
);

export default WhyUsSection;
