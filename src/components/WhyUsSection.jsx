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
          padding: 7rem 0;
          background: var(--surface, #FFFBFB);
        }
        .why-us-header {
          text-align: center;
          max-width: 680px;
          margin: 0 auto 4rem;
        }
        .why-us-tabs-container {
          max-width: 900px;
          margin: 0 auto;
        }
        .why-us-tabs {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          border-bottom: 2px solid var(--border-soft, #e5e7eb);
          padding-bottom: 0.5rem;
        }
        .why-us-tab {
          flex: 1;
          padding: 1rem 1.5rem;
          background: transparent;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          position: relative;
          transition: all 0.3s ease;
        }
        .why-us-tab-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--ink-soft, #252A33);
          text-align: center;
          line-height: 1.3;
        }
        .why-us-tab--active .why-us-tab-title {
          color: var(--ink, #0F0F12);
        }
        .why-us-tab-indicator {
          position: absolute;
          bottom: -0.5rem;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--tab-accent, #F59E0B);
          border-radius: 2px;
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }
        .why-us-tab--active .why-us-tab-indicator {
          transform: scaleX(1);
        }
        .why-us-tab:hover {
          background: var(--surface-hover, #FEF2F2);
        }
        .why-us-content {
          min-height: 300px;
        }
        .why-us-content-inner {
          background: var(--content-bg, #FEF3D8);
          border-radius: var(--radius-xl, 32px);
          padding: 2.5rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        .why-us-item {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }
        .why-us-item-icon {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: rgba(255,255,255,0.65);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(4px);
        }
        .why-us-item-title {
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--ink, #0F0F12);
          margin-bottom: 0.25rem;
        }
        .why-us-item-desc {
          font-size: 0.85rem;
          color: var(--ink-soft, #252A33);
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .why-us-tabs {
            flex-direction: column;
            gap: 0.5rem;
          }
          .why-us-tab {
            padding: 0.75rem 1rem;
          }
          .why-us-content-inner {
            padding: 1.5rem;
            grid-template-columns: 1fr;
          }
          .why-us-section { padding: 5rem 0; }
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
