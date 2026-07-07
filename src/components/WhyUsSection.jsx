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
    icon: <Repeat size={20} />,
    title: 'Unlimited Revisions',
    desc: 'We revise until you\'re 100% satisfied — no round limit, no extra charge.',
  },
  {
    num: '02',
    accent: '#F59E0B',
    icon: <Zap size={20} />,
    title: '48-Hour First Delivery',
    desc: 'First drafts land in your inbox within 48 business hours of kickoff.',
  },
  {
    num: '03',
    accent: '#22C55E',
    icon: <UserCheck size={20} />,
    title: 'Senior-Level Creatives',
    desc: 'Every project is handled by experienced designers and strategists, not juniors.',
  },
  {
    num: '04',
    accent: '#6366F1',
    icon: <LayoutGrid size={20} />,
    title: 'Full Transparency',
    desc: 'Real-time progress tracking on your shared Trello board — always in the loop.',
  },
  {
    num: '05',
    accent: '#EC4899',
    icon: <FileCode size={20} />,
    title: 'Source Files Included',
    desc: 'All Figma/PSD/AI source files delivered with every project. You own everything.',
  },
  {
    num: '06',
    accent: '#14B8A6',
    icon: <RotateCcw size={20} />,
    title: '7-Day Money-Back',
    desc: 'Not happy in the first week? Full refund, no questions asked. Zero risk.',
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
        <div className="section-eyebrow">Why CreatifyBD</div>
        <h2 id="why-v3-heading" className="section-heading">
          A reliable creative team without<br />
          <span className="text-red">agency overhead</span>
        </h2>
        <p className="section-subtext">
          Structured creative operations, international quality standards,
          and practical monthly pricing — all under one roof.
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
                style={{ color: f.accent, background: `${f.accent}1A` }}
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
        padding: 8rem 0;
        background: var(--surface-light, #FCFCFD);
        position: relative;
        overflow: hidden;
      }
      .why-v3-section::before {
        content: '';
        position: absolute;
        top: 0; left: 50%;
        transform: translateX(-50%);
        width: 1px;
        height: 100%;
        background: linear-gradient(to bottom, transparent, rgba(232,25,44,0.08), transparent);
        pointer-events: none;
      }
      .why-v3-header {
        text-align: center;
        max-width: 660px;
        margin: 0 auto 5rem;
        position: relative;
        z-index: 1;
      }
      .why-v3-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.25rem;
        max-width: 1100px;
        margin: 0 auto;
        position: relative;
        z-index: 1;
      }
      .why-v3-card {
        position: relative;
        background: #fff;
        border: 1.5px solid #EBEBF0;
        border-radius: 20px;
        padding: 2rem 1.75rem;
        overflow: hidden;
        cursor: default;
        transition: transform 0.35s cubic-bezier(0.16,1,0.3,1),
                    box-shadow 0.35s cubic-bezier(0.16,1,0.3,1),
                    border-color 0.35s;
      }
      .why-v3-card::after {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0;
        height: 3px;
        background: var(--card-accent);
        border-radius: 20px 20px 0 0;
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
      }
      .why-v3-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 24px 60px rgba(0,0,0,0.09);
        border-color: var(--card-accent);
      }
      .why-v3-card:hover::after { transform: scaleX(1); }
      .why-v3-top {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 1.5rem;
      }
      .why-v3-num {
        font-size: 0.7rem;
        font-weight: 900;
        letter-spacing: 0.12em;
        color: #D0D5DD;
        padding-top: 0.35rem;
      }
      .why-v3-icon {
        width: 46px;
        height: 46px;
        border-radius: 13px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
      }
      .why-v3-card:hover .why-v3-icon { transform: scale(1.1) rotate(-4deg); }
      .why-v3-title {
        font-size: 1.02rem;
        font-weight: 800;
        color: var(--ink, #0F0F12);
        line-height: 1.25;
        margin: 0 0 0.6rem;
        letter-spacing: -0.022em;
      }
      .why-v3-desc {
        font-size: 0.875rem;
        color: var(--muted, #6B7280);
        line-height: 1.7;
        margin: 0;
      }
      .why-v3-accent-line {
        position: absolute;
        bottom: 0; left: 0;
        height: 2px;
        width: 0%;
        background: linear-gradient(90deg, var(--card-accent), transparent);
        transition: width 0.4s cubic-bezier(0.16,1,0.3,1);
      }
      .why-v3-card:hover .why-v3-accent-line { width: 60%; }

      /* Trust strip */
      .why-v3-strip {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0;
        margin-top: 4rem;
        padding: 2rem;
        background: #fff;
        border: 1.5px solid #EBEBF0;
        border-radius: 20px;
        max-width: 800px;
        margin-inline: auto;
        margin-top: 4rem;
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
