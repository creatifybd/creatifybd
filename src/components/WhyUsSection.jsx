import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Repeat, 
  X, 
  RotateCcw, 
  Zap, 
  UserCheck, 
  Award, 
  LayoutGrid, 
  FileCode,
  Users
} from 'lucide-react';

const EASE_EXPO = [0.16, 1, 0.3, 1];

const WHY_CARDS = [
  {
    id: 'flexibility',
    bg: '#FEF3D8',
    accent: '#F59E0B',
    title: 'Flexibility & Peace of Mind',
    image: null,
    items: [
      { icon: <Repeat size={18} />, title: 'Unlimited Revisions', desc: 'We revise until you\'re 100% satisfied — no limit on rounds.' },
      { icon: <X size={18} />, title: 'Cancel Anytime', desc: 'No lock-in contracts. Pause or cancel your subscription whenever you need.' },
      { icon: <RotateCcw size={18} />, title: '7-Day Money-Back Guarantee', desc: 'Not happy in the first week? Get a full refund, no questions asked.' },
      { icon: <Users size={18} />, title: 'Dedicated Account Manager', desc: 'One point of contact who knows your brand, your style, and your goals.' },
    ],
  },
  {
    id: 'quality',
    bg: '#E8F5E9',
    accent: '#22C55E',
    title: 'Speed & Professional Quality',
    image: null,
    items: [
      { icon: <Zap size={18} />, title: '48-Hour First Delivery', desc: 'First drafts land in your inbox within 48 business hours of project start.' },
      { icon: <UserCheck size={18} />, title: 'Senior-Level Creatives', desc: 'Every project is handled by experienced designers and social media strategists.' },
      { icon: <Award size={18} />, title: 'Quality-Reviewed Output', desc: 'Senior review on every delivery before it reaches you — zero unfinished work.' },
    ],
  },
  {
    id: 'organization',
    bg: '#EDE9FE',
    accent: '#7C3AED',
    title: 'Organization & Full Control',
    image: null,
    items: [
      { icon: <LayoutGrid size={18} />, title: 'Trello Project Management', desc: 'View every task, revision, and delivery in real time on your shared Trello board.' },
      { icon: <FileCode size={18} />, title: 'Native Source Files Included', desc: 'All original Figma/PSD/AI files delivered with every project — you own everything.' },
    ],
  },
];

const WhyUsSection = () => {
  const [active, setActive] = useState(0);

  return (
    <section className="why-us-section" aria-labelledby="why-us-heading">
      <div className="section-container">
        {/* Header */}
        <motion.div
          className="why-us-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE_EXPO }}
        >
          <div className="section-eyebrow">Why CreatifyBD</div>
          <h2 id="why-us-heading" className="section-heading">
            A reliable creative team without<br />
            <span className="text-red">agency overhead</span>
          </h2>
          <p className="section-subtext">
            We combine structured creative operations with international service standards — dependable output at practical monthly pricing.
          </p>
        </motion.div>

        {/* Horizontal Tab Layout */}
        <div className="why-us-tabs-container">
          {/* Tab Buttons */}
          <div className="why-us-tabs" role="tablist" aria-label="Why choose CreatifyBD">
            {WHY_CARDS.map((card, i) => (
              <motion.button
                key={card.id}
                className={`why-us-tab ${active === i ? 'why-us-tab--active' : ''}`}
                style={{ '--tab-accent': card.accent }}
                onClick={() => setActive(i)}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: EASE_EXPO, delay: i * 0.08 }}
                aria-selected={active === i}
                role="tab"
                aria-controls={`panel-${card.id}`}
                id={`tab-${card.id}`}
              >
                <span className="why-us-tab-title">{card.title}</span>
                <div className="why-us-tab-indicator" />
              </motion.button>
            ))}
          </div>

          {/* Tab Content */}
          <motion.div
            className="why-us-content"
            key={active}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: EASE_EXPO }}
            role="tabpanel"
            id={`panel-${WHY_CARDS[active].id}`}
            aria-labelledby={`tab-${WHY_CARDS[active].id}`}
          >
            <div className="why-us-content-inner" style={{ '--content-bg': WHY_CARDS[active].bg }}>
              {WHY_CARDS[active].items.map((item, j) => (
                <motion.div
                  className="why-us-item"
                  key={j}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: EASE_EXPO, delay: j * 0.08 }}
                >
                  <div className="why-us-item-icon" style={{ color: WHY_CARDS[active].accent }}>
                    {item.icon}
                  </div>
                  <div>
                    <div className="why-us-item-title">{item.title}</div>
                    <div className="why-us-item-desc">{item.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        .why-us-section {
          padding: 8rem 0;
          background: #fff;
          position: relative;
          overflow: hidden;
        }
        .why-us-section::before {
          content: '';
          position: absolute;
          top: -100px;
          right: -100px;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(232,25,44,0.04) 0%, transparent 70%);
          pointer-events: none;
        }
        .why-us-section::after {
          content: '';
          position: absolute;
          bottom: -100px;
          left: -100px;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(232,25,44,0.03) 0%, transparent 70%);
          pointer-events: none;
        }
        .why-us-header {
          text-align: center;
          max-width: 720px;
          margin: 0 auto 5rem;
          position: relative;
          z-index: 1;
        }
        .why-us-tabs-container {
          max-width: 1000px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        .why-us-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2.5rem;
          padding: 0.5rem;
          background: var(--surface-soft, #FFFBFB);
          border-radius: 16px;
          border: 1.5px solid var(--border-soft, rgba(232,25,44,0.08));
        }
        .why-us-tab {
          flex: 1;
          padding: 1.25rem 1.5rem;
          background: transparent;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          position: relative;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .why-us-tab-title {
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--muted, #9ca3af);
          text-align: center;
          line-height: 1.4;
        }
        .why-us-tab--active .why-us-tab-title {
          color: var(--ink, #0F0F12);
        }
        .why-us-tab--active {
          background: #fff;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
        }
        .why-us-tab:hover:not(.why-us-tab--active) {
          background: rgba(255,255,255,0.5);
        }
        .why-us-content {
          min-height: 320px;
        }
        .why-us-content-inner {
          background: var(--content-bg, #FEF3D8);
          border-radius: 24px;
          padding: 3rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          position: relative;
          overflow: hidden;
        }
        .why-us-content-inner::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%);
          pointer-events: none;
        }
        .why-us-item {
          display: flex;
          gap: 1.25rem;
          align-items: flex-start;
          position: relative;
          z-index: 1;
        }
        .why-us-item-icon {
          flex-shrink: 0;
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: rgba(255,255,255,0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(8px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .why-us-item-title {
          font-weight: 700;
          font-size: 1rem;
          color: var(--ink, #0F0F12);
          margin-bottom: 0.4rem;
          line-height: 1.3;
        }
        .why-us-item-desc {
          font-size: 0.88rem;
          color: var(--ink-soft, #252A33);
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .why-us-section {
            padding: 6rem 0;
          }
          .why-us-header {
            margin: 0 auto 3rem;
          }
          .why-us-tabs {
            flex-direction: column;
            gap: 0.35rem;
          }
          .why-us-tab {
            padding: 1rem 1.25rem;
          }
          .why-us-tab-title {
            font-size: 0.88rem;
          }
          .why-us-content-inner {
            padding: 2rem;
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          .why-us-item {
            gap: 1rem;
          }
          .why-us-item-icon {
            width: 42px;
            height: 42px;
          }
          .why-us-item-title {
            font-size: 0.95rem;
          }
          .why-us-item-desc {
            font-size: 0.85rem;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .why-us-tab { transition: none; }
          .why-us-tab-indicator { transition: none; }
        }
      `}</style>
    </section>
  );
};

export default WhyUsSection;
