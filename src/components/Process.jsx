import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { globalizeCopy } from '../utils/contentText';

const EASE = [0.16, 1, 0.3, 1];

const defaultSteps = [
  {
    num: '01',
    title: 'Tell us about your brand',
    desc: 'Tell us about your brand, your goals, and the kind of design you need. The more you share, the better the outcome.',
  },
  {
    num: '02',
    title: 'Brief & Confirm',
    desc: 'Once you confirm, we go over the details together to make sure nothing gets lost in translation. Scope, timeline, and expectations are set clearly.',
  },
  {
    num: '03',
    title: 'Concept Development',
    desc: 'We start with rough concepts and directions so you can see the ideas before final artwork begins. No surprises, just progress.',
  },
  {
    num: '04',
    title: 'First Draft Delivery',
    desc: 'You receive the first design draft, ready for your feedback. Every deliverable is organised and clearly labelled.',
  },
  {
    num: '05',
    title: 'Feedback & Revisions',
    desc: 'Share your feedback and we refine the design until it truly represents your brand. Revisions are structured and transparent.',
  },
];

const Process = ({ highlight = false, fullPage = false }) => {
  const { content } = useSettings();
  const processContent = content?.process || {};
  const [openIdx, setOpenIdx] = useState(0);
  const hoverTimer = useRef(null);

  const editableSteps = Array.isArray(processContent.steps) && processContent.steps.length
    ? processContent.steps.map((step, i) => ({ ...defaultSteps[i % defaultSteps.length], ...step }))
    : defaultSteps;

  const titleText = globalizeCopy(
    processContent.title,
    'A clear process from first brief to <span class="text-red">final delivery</span>'
  );
  const subtitleText = globalizeCopy(
    processContent.subtitle,
    'Every project follows a visible workflow so you always know what is happening, what needs approval, and when deliverables are due.'
  );

  return (
    <section className={`process-new-section section${fullPage ? ' full-page-section' : ''}`} id="process">
      <div className="container">
        {/* Header */}
        {!fullPage && (
          <div className="process-new-header">
            <motion.h2
              className="section-h"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: EASE, delay: 0.08 }}
              dangerouslySetInnerHTML={{ __html: titleText }}
            />
            <motion.p
              className="section-sub"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.16 }}
            >
              {subtitleText}
            </motion.p>
          </div>
        )}

        {/* Accordion steps */}
        <div className="process-new-layout">
          {/* Left: accordion */}
          <div className="process-accordion">
            {editableSteps.map((step, idx) => {
              const isOpen = openIdx === idx;
              return (
                <motion.div
                  key={step.num}
                  className={`process-item${isOpen ? ' open' : ''}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.6, ease: EASE, delay: idx * 0.07 }}
                  onMouseEnter={() => {
                    // clear any pending timer, open after short delay to avoid flicker
                    clearTimeout(hoverTimer.current);
                    hoverTimer.current = setTimeout(() => setOpenIdx(idx), 120);
                  }}
                  onMouseLeave={() => {
                    clearTimeout(hoverTimer.current);
                  }}
                >
                  <button
                    className="process-item-trigger"
                    onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                    aria-expanded={isOpen}
                  >
                    <span className="process-item-num">{step.num}</span>
                    <span className="process-item-title">{step.title}</span>
                    <span className="process-item-toggle">
                      {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        className="process-item-body"
                        key="body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.38, ease: EASE }}
                        style={{ overflow: 'hidden' }}
                      >
                        <p>{step.desc}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Right: large step number display */}
          <div className="process-display" aria-hidden="true">
            <AnimatePresence mode="wait">
              <motion.div
                key={openIdx}
                className="process-display-inner"
                initial={{ opacity: 0, scale: 0.88, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: -12 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <span className="process-display-num">
                  {openIdx >= 0 && openIdx < editableSteps.length
                    ? editableSteps[openIdx].num
                    : '01'}
                </span>
                <span className="process-display-label">
                  {openIdx >= 0 && openIdx < editableSteps.length
                    ? editableSteps[openIdx].title
                    : editableSteps[0].title}
                </span>
                <div className="process-display-progress">
                  {editableSteps.map((_, i) => (
                    <button
                      key={i}
                      className={`process-dot${i === openIdx ? ' active' : ''}`}
                      onClick={() => setOpenIdx(i)}
                      aria-label={`Step ${i + 1}`}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {highlight && (
          <motion.div
            className="section-action"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.3 }}
          >
            <Link to="/contact" className="btn-red">Start your project →</Link>
          </motion.div>
        )}
      </div>

      <style>{`
        /* ══ PROCESS ══════════════════════════════════════════ */
        .process-new-section {
          background: var(--surface-soft);
          padding: var(--section-padding) 0;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }

        .process-new-header {
          max-width: 660px;
          margin: 0 auto 4.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        /* Two column layout */
        .process-new-layout {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 5rem;
          align-items: start;
          max-width: 1100px;
          margin: 0 auto;
        }

        /* Accordion */
        .process-accordion {
          display: flex;
          flex-direction: column;
          gap: 0;
          border-top: 1px solid var(--border);
        }

        .process-item {
          border-bottom: 1px solid var(--border);
          background: transparent;
          transition: background 0.22s, border-left-color 0.22s;
          border-left: 3px solid transparent;
          cursor: pointer;
        }
        .process-item:hover { background: rgba(232,25,44,0.02); border-left-color: rgba(232,25,44,0.3); }
        .process-item.open { background: var(--surface); border-left-color: var(--brand-red); }

        .process-item-trigger {
          width: 100%;
          display: grid;
          grid-template-columns: 3rem 1fr auto;
          align-items: center;
          gap: 1rem;
          padding: 1.6rem 1rem 1.6rem 0;
          background: transparent;
          border: none;
          cursor: pointer;
          text-align: left;
          transition: all 0.18s;
        }
        .process-item-trigger:hover { padding-left: 0.5rem; }

        .process-item-num {
          font-family: var(--font-display);
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0.1em;
          color: var(--muted);
          opacity: 0.4;
          transition: color 0.22s, opacity 0.22s;
        }
        .process-item:hover .process-item-num {
          color: var(--brand-red);
          opacity: 0.7;
        }
        .process-item.open .process-item-num {
          color: var(--brand-red);
          opacity: 1;
        }

        .process-item-title {
          font-family: var(--font-display);
          font-size: clamp(1rem, 1.6vw, 1.2rem);
          font-weight: 700;
          color: var(--ink);
          letter-spacing: -0.025em;
          line-height: 1.3;
          transition: color 0.22s;
        }
        .process-item:hover .process-item-title { color: var(--brand-red); opacity: 0.75; }
        .process-item.open .process-item-title { color: var(--brand-red); opacity: 1; }

        .process-item-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px; height: 32px;
          border-radius: 50%;
          border: 1.5px solid var(--border);
          color: var(--muted);
          flex-shrink: 0;
          transition: background 0.22s, color 0.22s, border-color 0.22s, transform 0.22s;
        }
        .process-item:hover .process-item-toggle {
          border-color: rgba(232,25,44,0.4);
          color: var(--brand-red);
          transform: scale(1.08);
        }
        .process-item.open .process-item-toggle {
          background: var(--brand-red);
          border-color: var(--brand-red);
          color: #fff;
          transform: scale(1);
        }

        .process-item-body {
          padding: 0 1rem 1.5rem 4rem;
        }
        .process-item-body p {
          font-size: 0.92rem;
          color: var(--muted);
          line-height: 1.75;
          margin: 0;
        }

        /* Right display */
        .process-display {
          position: sticky;
          top: calc(var(--nav-height, 90px) + 2rem);
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 3rem 2.5rem;
          min-height: 320px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 12px 48px rgba(0,0,0,0.06);
        }
        .process-display-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
          text-align: center;
        }
        .process-display-num {
          font-family: var(--font-display);
          font-size: clamp(4rem, 8vw, 6.5rem);
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.06em;
          color: var(--brand-red);
          opacity: 0.12;
          display: block;
        }
        .process-display-label {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--ink);
          letter-spacing: -0.02em;
          display: block;
          max-width: 220px;
          line-height: 1.3;
        }
        .process-display-progress {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        .process-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--border);
          border: none;
          cursor: pointer;
          padding: 0;
          transition: background 0.22s, transform 0.22s;
        }
        .process-dot.active {
          background: var(--brand-red);
          transform: scale(1.4);
        }

        /* Responsive */
        @media (max-width: 900px) {
          .process-new-layout { grid-template-columns: 1fr; gap: 2.5rem; }
          .process-display { display: none; }
        }
        @media (max-width: 540px) {
          .process-item-trigger { grid-template-columns: 2rem 1fr auto; }
          .process-item-body { padding-left: 3rem; }
        }
      `}</style>
    </section>
  );
};

export default Process;
