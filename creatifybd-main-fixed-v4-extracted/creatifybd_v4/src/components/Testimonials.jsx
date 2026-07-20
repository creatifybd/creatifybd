import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { CLIENT_REVIEWS } from '../data/clientReviews';

const EASE = [0.16, 1, 0.3, 1];

const getInitials = (name) => {
  return (name || 'Client')
    .split(/[_\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('') || 'C';
};

const getColor = (name) => {
  const palette = ['#c084fc', '#3b82f6', '#f97316', '#0d9488', '#e8192c', '#ec4899', '#22c55e', '#f59e0b'];
  const index = (name || '').split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % palette.length;
  return palette[index];
};

const transformReviews = (reviews) => {
  return reviews.map(review => ({
    id: review.id,
    name: review.clientName,
    role: review.country,
    initials: getInitials(review.clientName),
    color: getColor(review.clientName),
    stars: Math.round(review.rating),
    tag: review.gigTitle,
    text: review.reviewText
  }));
};

const REAL_TESTIMONIALS = transformReviews(CLIENT_REVIEWS);

const Stars = ({ count = 5 }) => (
  <div className="testi-stars" aria-label={`${count} out of 5 stars`}>
    {Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < count ? '#f59e0b' : '#e5e7eb' }}>★</span>
    ))}
  </div>
);

// Single scrolling row
const MarqueeRow = ({ items, reverse = false }) => (
  <div className="testi-marquee-outer">
    <div className={`testi-marquee-track${reverse ? ' reverse' : ''}`}>
      {[...items, ...items].map((t, i) => (
        <article key={`${t.id}-${i}`} className="testi-card">
          <div className="testi-card-top">
            <Stars count={t.stars} />
            <span className="testi-tag">{t.tag}</span>
          </div>
          <p className="testi-text">"{t.text}"</p>
          <div className="testi-author">
            <div className="testi-avatar" style={{ background: `${t.color}22`, color: t.color }}>
              {t.initials}
            </div>
            <div>
              <div className="testi-name">{t.name}</div>
              <div className="testi-role">{t.role}</div>
            </div>
          </div>
        </article>
      ))}
    </div>
  </div>
);

const Testimonials = () => {
  const half = Math.ceil(REAL_TESTIMONIALS.length / 2);
  const row1 = REAL_TESTIMONIALS.slice(0, half);
  const row2 = REAL_TESTIMONIALS.slice(half);

  return (
    <section className="testi-section section" id="testimonials">
      {/* Header */}
      <div className="container">
        <motion.div
          className="testi-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: EASE }}
        >
          <div className="eyebrow">Client testimonials</div>
          <h2 className="section-h">
            Trusted by brands <span className="text-red">worldwide</span>
          </h2>
          <p className="section-sub">
            Real results from real clients — businesses that came to us for design and stayed for the experience.
          </p>
        </motion.div>
      </div>

      {/* Marquee rows */}
      <div className="testi-marquee-wrap">
        <MarqueeRow items={row1} reverse={false} />
        <MarqueeRow items={row2} reverse={true}  />
      </div>

      {/* CTA */}
      <div className="container">
        <motion.div
          className="testi-cta"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: EASE, delay: 0.2 }}
        >
          <Link to="/contact" className="testi-cta-link">
            Start your project <ArrowUpRight size={16} />
          </Link>
        </motion.div>
      </div>

      <style>{`
        /* ══ TESTIMONIALS ══════════════════════════════════════ */
        .testi-section {
          padding: var(--section-padding) 0;
          background: var(--surface-soft);
          border-top: 1px solid var(--border);
          overflow: hidden;
        }

        .testi-header {
          max-width: 640px;
          margin: 0 auto 4rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        /* Marquee area */
        .testi-marquee-wrap {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 3.5rem;
          mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
        }

        .testi-marquee-outer {
          overflow: hidden;
          width: 100%;
        }

        .testi-marquee-track {
          display: flex;
          gap: 1rem;
          width: max-content;
          animation: testiScroll 40s linear infinite;
        }
        .testi-marquee-track.reverse {
          animation-direction: reverse;
          animation-duration: 45s;
        }

        @keyframes testiScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        /* Card */
        .testi-card {
          width: 340px;
          flex-shrink: 0;
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          box-shadow: 0 2px 16px rgba(0,0,0,0.04);
          transition: box-shadow 0.25s;
        }
        .testi-card:hover { box-shadow: 0 12px 40px rgba(0,0,0,0.08); }

        .testi-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }

        .testi-stars {
          display: flex;
          gap: 2px;
          font-size: 0.88rem;
        }

        .testi-tag {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--muted);
          background: var(--surface-soft);
          border: 1px solid var(--border);
          border-radius: 100px;
          padding: 0.22rem 0.65rem;
          white-space: nowrap;
        }

        .testi-text {
          font-size: 0.9rem;
          color: var(--ink-soft);
          line-height: 1.72;
          margin: 0;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 5;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .testi-author {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border-top: 1px solid var(--border);
          padding-top: 1rem;
        }

        .testi-avatar {
          width: 40px; height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-size: 0.78rem;
          font-weight: 800;
          flex-shrink: 0;
          letter-spacing: 0.02em;
        }

        .testi-name {
          font-family: var(--font-display);
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--ink);
          letter-spacing: -0.02em;
          line-height: 1.2;
        }
        .testi-role {
          font-size: 0.76rem;
          color: var(--muted);
          line-height: 1.3;
        }

        /* CTA */
        .testi-cta {
          display: flex;
          justify-content: center;
        }
        .testi-cta-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-family: var(--font-body);
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--brand-red);
          text-decoration: none;
          border-bottom: 1.5px solid rgba(232,25,44,0.3);
          padding-bottom: 2px;
          transition: border-color 0.2s;
        }
        .testi-cta-link:hover { border-color: var(--brand-red); color: var(--brand-red); }

        @media (prefers-reduced-motion: reduce) {
          .testi-marquee-track { animation: none; }
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
