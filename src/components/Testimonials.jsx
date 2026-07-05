import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const EASE_EXPO = [0.16, 1, 0.3, 1];

/* ── Clean English-only fallback testimonials ── */
const FALLBACK = [
  {
    id: 'f1',
    name: 'Emily Carter',
    role: 'Founder, Aurevia Skincare',
    initials: 'EC',
    color: '#c084fc',
    text: 'CreatifyBD gave Aurevia a complete brand identity that finally matches our product quality. The logo direction and packaging mockups impressed every retail buyer we pitched to.',
    stars: 5,
    tag: 'Branding & Identity',
  },
  {
    id: 'f2',
    name: 'Daniel Osei',
    role: 'Co-Founder, NexoPay',
    initials: 'DO',
    color: '#3b82f6',
    text: 'The brand system CreatifyBD built for NexoPay felt instantly credible to investors. Clean, professional, and exactly the fintech identity we needed.',
    stars: 5,
    tag: 'Branding & Identity',
  },
  {
    id: 'f3',
    name: 'Marco Ruiz',
    role: 'Owner, Brasa Fire Restaurant',
    initials: 'MR',
    color: '#f97316',
    text: 'Our restaurant branding needed personality and warmth. CreatifyBD nailed it — the new identity is on every menu, sign, and social post now.',
    stars: 5,
    tag: 'Brand & Print',
  },
  {
    id: 'f4',
    name: 'Claire Whitman',
    role: 'GM, Harbor & Pine Hotels',
    initials: 'CW',
    color: '#0d9488',
    text: 'Guests comment on our new branding constantly. CreatifyBD understood exactly the boutique hospitality feel we were going for.',
    stars: 5,
    tag: 'Branding & Identity',
  },
  {
    id: 'f5',
    name: 'Priya Nair',
    role: 'Head of Marketing, NovaGrid',
    initials: 'PN',
    color: '#e8192c',
    text: 'Our SaaS landing page and brand kit from CreatifyBD helped us close bigger enterprise deals. First impressions matter, and now ours is strong.',
    stars: 5,
    tag: 'Website Design',
  },
  {
    id: 'f6',
    name: 'Isabelle Moreau',
    role: 'Creative Director, Solenne',
    initials: 'IM',
    color: '#ec4899',
    text: 'Our fashion identity needed to feel luxury without being cold. CreatifyBD delivered exactly that balance — refined, warm, and unmistakably us.',
    stars: 5,
    tag: 'Branding & Identity',
  },
  {
    id: 'f7',
    name: 'Marcus Reed',
    role: 'Director, BrightNest Academy',
    initials: 'MR',
    color: '#22c55e',
    text: 'Enrollment inquiries went up noticeably after CreatifyBD rebuilt our brand and social presence. Parents trust us more because we look more professional.',
    stars: 5,
    tag: 'Social Media',
  },
  {
    id: 'f8',
    name: 'Olivia Bennett',
    role: 'Owner, Crumb & Hearth Bakery',
    initials: 'OB',
    color: '#f59e0b',
    text: "Our bakery's social content calendar from CreatifyBD noticeably increased foot traffic from Instagram alone. Worth every penny.",
    stars: 5,
    tag: 'Social Media',
  },
  {
    id: 'f9',
    name: 'Carlos Medina',
    role: 'Founder, Monterra Coffee Co.',
    initials: 'CM',
    color: '#78716c',
    text: 'The packaging CreatifyBD designed helped Monterra get accepted into three new retail chains. The investment paid for itself in the first month.',
    stars: 5,
    tag: 'Packaging Design',
  },
];

const StarRating = ({ count = 5 }) => (
  <div className="tm-stars" aria-label={`${count} out of 5 stars`}>
    {Array.from({ length: count }).map((_, i) => (
      <Star key={i} size={13} fill="#e8192c" color="#e8192c" />
    ))}
  </div>
);

const TestimonialCard = ({ item, isActive, onClick }) => (
  <motion.article
    className={`tm-card ${isActive ? 'tm-card--active' : ''}`}
    onClick={onClick}
    role="button"
    tabIndex={0}
    onKeyDown={e => e.key === 'Enter' && onClick()}
    aria-pressed={isActive}
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-30px' }}
    transition={{ duration: 0.65, ease: EASE_EXPO }}
    whileHover={{ y: -4, transition: { duration: 0.28 } }}
  >
    <div className="tm-card-top">
      <span
        className="tm-avatar"
        style={{ background: item.color || '#e8192c' }}
        aria-hidden="true"
      >
        {item.initials || item.name?.slice(0, 2).toUpperCase()}
      </span>
      <div className="tm-card-meta">
        <div className="tm-name">{item.name}</div>
        <div className="tm-role">{item.role}</div>
      </div>
      {item.tag && <div className="tm-tag">{item.tag}</div>}
    </div>

    <StarRating count={item.stars || 5} />

    <blockquote className="tm-quote">"{item.text}"</blockquote>
  </motion.article>
);

const Testimonials = () => {
  const [items, setItems]   = useState([]);
  const [active, setActive] = useState(0);
  const intervalRef         = useRef(null);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'testimonials'),
      snap => {
        if (!snap.empty) {
          const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setItems(data);
        }
      },
      () => {}
    );
    return () => unsub();
  }, []);

  const display = items.length > 0 ? items : FALLBACK;

  /* Auto-rotate featured quote */
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActive(prev => (prev + 1) % display.length);
    }, 5500);
    return () => clearInterval(intervalRef.current);
  }, [display.length]);

  const handleSelect = idx => {
    clearInterval(intervalRef.current);
    setActive(idx);
    intervalRef.current = setInterval(() => {
      setActive(prev => (prev + 1) % display.length);
    }, 5500);
  };

  const featured = display[active];

  return (
    <section className="tm-section" id="testimonials">
      {/* Subtle bg glow */}
      <div className="tm-bg" aria-hidden="true">
        <div className="tm-bg-glow" />
      </div>

      <div className="container">
        <div className="tm-layout">
          {/* ── Left: Featured large quote ── */}
          <div className="tm-left">
            <motion.div
              className="tm-header"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE_EXPO }}
            >
              <div className="eyebrow">Client Testimonials</div>
              <h2 className="section-h tm-heading">
                Trusted by<br />
                <span className="tm-heading-accent">visionaries.</span>
              </h2>
              <p className="section-sub tm-subtext">
                Real results from real clients across the US, Canada, and Australia. Here's what they say about working with CreatifyBD.
              </p>
            </motion.div>

            {/* Featured animated quote */}
            <AnimatePresence mode="wait">
              <motion.div
                key={featured?.id}
                className="tm-featured"
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.55, ease: EASE_EXPO }}
              >
                <Quote size={42} className="tm-quote-icon" aria-hidden="true" />
                <blockquote className="tm-featured-quote">
                  "{featured?.text}"
                </blockquote>
                <div className="tm-featured-author">
                  <span
                    className="tm-featured-avatar"
                    style={{ background: featured?.color || '#e8192c' }}
                    aria-hidden="true"
                  >
                    {featured?.initials || featured?.name?.slice(0, 2).toUpperCase()}
                  </span>
                  <div>
                    <div className="tm-featured-name">{featured?.name}</div>
                    <div className="tm-featured-role">{featured?.role}</div>
                    <StarRating count={featured?.stars || 5} />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Dot navigation */}
            <div className="tm-dots" role="tablist" aria-label="Testimonials navigation">
              {display.map((_, i) => (
                <button
                  key={i}
                  className={`tm-dot ${active === i ? 'tm-dot--active' : ''}`}
                  onClick={() => handleSelect(i)}
                  aria-label={`View testimonial ${i + 1}`}
                  role="tab"
                  aria-selected={active === i}
                />
              ))}
            </div>
          </div>

          {/* ── Right: Card grid ── */}
          <div className="tm-right">
            <div className="tm-cards-grid">
              {display.map((item, i) => (
                <TestimonialCard
                  key={item.id}
                  item={item}
                  isActive={active === i}
                  onClick={() => handleSelect(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .tm-section {
          position: relative;
          padding: 7rem 0;
          background: #fff;
          overflow: hidden;
        }
        .tm-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .tm-bg-glow {
          position: absolute;
          width: 600px; height: 600px;
          border-radius: 50%;
          top: -200px; right: -150px;
          background: radial-gradient(circle, rgba(232,25,44,0.06) 0%, transparent 70%);
        }

        /* Layout */
        .tm-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: start;
        }
        .tm-left { position: sticky; top: 120px; }
        .tm-header { margin-bottom: 2.5rem; }
        .tm-heading { line-height: 1.08; }
        .tm-heading-accent { color: var(--brand-red, #e8192c); }
        .tm-subtext { margin-top: 0.75rem; }

        /* Featured quote */
        .tm-featured { margin-top: 2rem; }
        .tm-quote-icon {
          color: var(--brand-red, #e8192c);
          opacity: 0.2;
          margin-bottom: 1rem;
        }
        .tm-featured-quote {
          font-size: 1.15rem;
          font-weight: 500;
          color: var(--ink, #0f0f12);
          line-height: 1.7;
          margin: 0 0 1.5rem;
          font-style: italic;
          letter-spacing: -0.01em;
        }
        .tm-featured-author {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }
        .tm-featured-avatar {
          width: 44px; height: 44px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.78rem; font-weight: 900; color: #fff;
          flex-shrink: 0;
        }
        .tm-featured-name {
          font-weight: 800;
          font-size: 0.9rem;
          color: var(--ink, #0f0f12);
          margin-bottom: 0.1rem;
        }
        .tm-featured-role {
          font-size: 0.78rem;
          color: var(--muted, #6b7280);
          margin-bottom: 0.3rem;
        }

        /* Dot nav */
        .tm-dots {
          display: flex;
          gap: 0.5rem;
          margin-top: 2rem;
          flex-wrap: wrap;
        }
        .tm-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #e5e7eb;
          border: none;
          cursor: pointer;
          transition: background 0.25s ease, width 0.25s ease;
          padding: 0;
        }
        .tm-dot--active {
          background: var(--brand-red, #e8192c);
          width: 24px;
          border-radius: 4px;
        }

        /* Right card grid */
        .tm-right { max-height: 600px; overflow-y: auto; scrollbar-width: none; }
        .tm-right::-webkit-scrollbar { display: none; }
        .tm-cards-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        /* Card */
        .tm-card {
          background: #fafafa;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 1.25rem;
          cursor: pointer;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .tm-card:hover,
        .tm-card--active {
          border-color: rgba(232,25,44,0.25);
          box-shadow: 0 4px 20px rgba(232,25,44,0.07);
          background: #fff;
        }
        .tm-card-top {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }
        .tm-avatar {
          width: 36px; height: 36px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.65rem; font-weight: 900; color: #fff;
          flex-shrink: 0;
        }
        .tm-card-meta { flex: 1; min-width: 0; }
        .tm-name {
          font-weight: 700;
          font-size: 0.85rem;
          color: var(--ink, #0f0f12);
          line-height: 1.2;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .tm-role {
          font-size: 0.73rem;
          color: var(--muted, #6b7280);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .tm-tag {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--brand-red, #e8192c);
          background: rgba(232,25,44,0.07);
          border: 1px solid rgba(232,25,44,0.14);
          border-radius: 100px;
          padding: 0.2rem 0.6rem;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .tm-stars {
          display: flex;
          gap: 2px;
          margin-bottom: 0.6rem;
        }
        .tm-quote {
          font-size: 0.82rem;
          color: var(--ink-soft, #374151);
          line-height: 1.65;
          margin: 0;
          font-style: italic;

          /* Clamp to 3 lines */
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .tm-card--active .tm-quote { -webkit-line-clamp: unset; }

        @media (max-width: 900px) {
          .tm-layout { grid-template-columns: 1fr; gap: 3rem; }
          .tm-left { position: static; }
          .tm-right { max-height: none; }
          .tm-section { padding: 5rem 0; }
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
