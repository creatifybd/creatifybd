import React from 'react';
import { motion } from 'framer-motion';
import { Repeat, RotateCcw, Zap, UserCheck, LayoutGrid, FileCode } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1];

const FEATURES = [
  {
    num: '01',
    icon: <UserCheck size={22} />,
    title: 'Every Brief Gets Full Attention',
    desc: 'Real people reviewing your project, not a queue. Every piece of work gets a proper pass before it reaches you.',
    accent: '#E8192C',
  },
  {
    num: '02',
    icon: <Zap size={22} />,
    title: 'Work Happens On Your Schedule',
    desc: 'We coordinate asynchronously through shared dashboards, so you\u2019re not stuck waiting on a meeting to get an update.',
    accent: '#F59E0B',
  },
  {
    num: '03',
    icon: <LayoutGrid size={22} />,
    title: 'No Surprise Costs',
    desc: 'You get a clear quote before we start, and that\u2019s what you pay — no hidden fees added halfway through.',
    accent: '#22C55E',
  },
  {
    num: '04',
    icon: <Repeat size={22} />,
    title: 'We Revise Until It\u2019s Right',
    desc: 'We keep refining the work until it actually matches what you had in mind — revisions are part of the process, not an extra charge.',
    accent: '#6366F1',
  },
  {
    num: '05',
    icon: <FileCode size={22} />,
    title: 'You Own Every File',
    desc: 'Every source file gets handed over at completion. What we build for you is fully yours, always.',
    accent: '#EC4899',
  },
  {
    num: '06',
    icon: <RotateCcw size={22} />,
    title: 'No Long-Term Contracts Required',
    desc: 'Start a project, pause it, or come back later — there\u2019s no lock-in keeping you here.',
    accent: '#14B8A6',
  },
];

const WhyUsSection = () => (
  <section className="why-section section" aria-labelledby="why-heading">
    <div className="container">
      {/* Header */}
      <motion.div
        className="why-header"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, ease: EASE }}
      >
        <div className="eyebrow">Why CreatifyBD</div>
        <h2 id="why-heading" className="section-h">
          Elite creative operations<br />
          <span className="text-red">without the agency markup</span>
        </h2>
        <p className="section-sub">
          Senior-level talent, async project management, and transparent pricing — premium results at a fraction of standard agency rates.
        </p>
      </motion.div>

      {/* Feature grid */}
      <div className="why-grid">
        {FEATURES.map((f, i) => (
          <motion.article
            key={f.num}
            className="why-card"
            style={{ '--accent': f.accent }}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.55, ease: EASE, delay: i * 0.07 }}
            whileHover={{ y: -8, transition: { duration: 0.28, ease: EASE } }}
          >
            <div className="why-card-top">
              <span className="why-card-num">{f.num}</span>
              <div className="why-card-icon" style={{ color: f.accent, background: `${f.accent}14` }}>
                {f.icon}
              </div>
            </div>
            <h3 className="why-card-title">{f.title}</h3>
            <p className="why-card-desc">{f.desc}</p>
            <div className="why-card-bar" />
          </motion.article>
        ))}
      </div>
    </div>

    <style>{`
      /* ══ WHY US ════════════════════════════════════════════ */
      .why-section {
        padding: var(--section-padding) 0;
        background: var(--surface);
        position: relative;
        overflow: hidden;
      }
      .why-section::before {
        content: '';
        position: absolute;
        inset: 0;
        background: radial-gradient(ellipse 55% 35% at 50% 0%, rgba(232,25,44,0.04) 0%, transparent 70%);
        pointer-events: none;
      }

      .why-header {
        max-width: 700px;
        margin: 0 auto 4.5rem;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.1rem;
        position: relative;
        z-index: 1;
      }

      /* Grid */
      .why-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.5rem;
        max-width: 1140px;
        margin: 0 auto;
        position: relative;
        z-index: 1;
      }

      .why-card {
        position: relative;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 20px;
        padding: 2.25rem 2rem;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        gap: 0.85rem;
        transition: border-color 0.3s, box-shadow 0.3s;
        cursor: default;
      }
      .why-card:hover {
        border-color: var(--accent);
        box-shadow: 0 20px 56px rgba(0,0,0,0.07);
      }

      .why-card-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .why-card-num {
        font-family: var(--font-display);
        font-size: 0.72rem;
        font-weight: 900;
        letter-spacing: 0.12em;
        color: var(--muted);
        opacity: 0.35;
      }
      .why-card:hover .why-card-num { opacity: 1; color: var(--accent); }

      .why-card-icon {
        width: 48px; height: 48px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: transform 0.3s;
      }
      .why-card:hover .why-card-icon { transform: scale(1.1) rotate(-6deg); }

      .why-card-title {
        font-family: var(--font-display);
        font-size: 1.1rem;
        font-weight: 700;
        color: var(--ink);
        letter-spacing: -0.025em;
        line-height: 1.3;
        margin: 0;
        transition: color 0.25s;
      }
      .why-card:hover .why-card-title { color: var(--accent); }

      .why-card-desc {
        font-size: 0.875rem;
        color: var(--muted);
        line-height: 1.7;
        margin: 0;
      }

      .why-card-bar {
        position: absolute;
        bottom: 0; left: 0;
        height: 3px;
        width: 0;
        background: var(--accent);
        transition: width 0.35s cubic-bezier(0.16,1,0.3,1);
        border-radius: 0 2px 0 0;
      }
      .why-card:hover .why-card-bar { width: 100%; }

      /* Trust strip */
      .why-trust-strip {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0;
        margin: 4rem auto 0;
        max-width: 860px;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 20px;
        padding: 2rem;
        box-shadow: 0 4px 24px rgba(0,0,0,0.05);
        position: relative;
        z-index: 1;
      }
      .why-trust-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.2rem;
        padding: 0 1.5rem;
        text-align: center;
      }
      .why-trust-item strong {
        font-family: var(--font-display);
        font-size: 1.6rem;
        font-weight: 800;
        color: var(--ink);
        letter-spacing: -0.04em;
        line-height: 1;
      }
      .why-trust-item span {
        font-size: 0.68rem;
        font-weight: 600;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.07em;
        line-height: 1.4;
      }
      .why-trust-div {
        width: 1px;
        height: 36px;
        background: var(--border);
        flex-shrink: 0;
      }

      /* Responsive */
      @media (max-width: 960px) { .why-grid { grid-template-columns: repeat(2, 1fr); } }
      @media (max-width: 600px) {
        .why-grid { grid-template-columns: 1fr; gap: 1rem; }
        .why-card { padding: 1.75rem 1.5rem; }
        .why-trust-strip { flex-wrap: wrap; gap: 1.5rem; padding: 1.5rem; }
        .why-trust-item { flex: 0 0 45%; }
        .why-trust-div { display: none; }
      }
    `}</style>
  </section>
);

export default WhyUsSection;
