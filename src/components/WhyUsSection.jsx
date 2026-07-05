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

        {/* Cards Grid */}
        <div className="why-us-grid">
          {WHY_CARDS.map((card, i) => (
            <motion.div
              key={card.id}
              className={`why-us-card ${active === i ? 'why-us-card--active' : ''}`}
              style={{ '--card-bg': card.bg, '--card-accent': card.accent }}
              onClick={() => setActive(i)}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: EASE_EXPO, delay: i * 0.1 }}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && setActive(i)}
              aria-expanded={active === i}
            >
              <div className="why-us-card-header">
                <h3 className="why-us-card-title">{card.title}</h3>
                <div className="why-us-card-indicator" style={{ background: card.accent }} />
              </div>

              <div className={`why-us-card-body ${active === i ? 'why-us-card-body--open' : ''}`}>
                {card.items.map((item, j) => (
                  <div className="why-us-item" key={j}>
                    <div className="why-us-item-icon" style={{ color: card.accent }}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="why-us-item-title">{item.title}</div>
                      <div className="why-us-item-desc">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .why-us-section {
          padding: 7rem 0;
          background: var(--surface);
        }
        .why-us-header {
          text-align: center;
          max-width: 680px;
          margin: 0 auto 4rem;
        }
        .why-us-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        .why-us-card {
          background: var(--card-bg, #FEF3D8);
          border-radius: var(--radius-xl);
          padding: 2rem;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 2px solid transparent;
          position: relative;
          overflow: hidden;
        }
        .why-us-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          border: 2px solid var(--card-accent, #F59E0B);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .why-us-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.08);
        }
        .why-us-card--active {
          transform: translateY(-4px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.1);
        }
        .why-us-card--active::before {
          opacity: 1;
        }
        .why-us-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .why-us-card-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--ink);
          line-height: 1.3;
        }
        .why-us-card-indicator {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 4px;
        }
        .why-us-card-body {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .why-us-item {
          display: flex;
          gap: 0.85rem;
          align-items: flex-start;
        }
        .why-us-item-icon {
          flex-shrink: 0;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(255,255,255,0.65);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(4px);
        }
        .why-us-item-title {
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--ink);
          margin-bottom: 0.2rem;
        }
        .why-us-item-desc {
          font-size: 0.82rem;
          color: var(--ink-soft);
          line-height: 1.5;
          opacity: 0.8;
        }

        @media (max-width: 900px) {
          .why-us-grid { grid-template-columns: 1fr; }
          .why-us-section { padding: 5rem 0; }
        }
        @media (max-width: 600px) {
          .why-us-card { padding: 1.5rem; }
          .why-us-card-title { font-size: 1rem; }
        }
        @media (prefers-reduced-motion: reduce) {
          .why-us-card { transition: none; }
          .why-us-card:hover { transform: none; }
        }
      `}</style>
    </section>
  );
};

export default WhyUsSection;
