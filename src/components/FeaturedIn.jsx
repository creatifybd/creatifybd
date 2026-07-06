import React from 'react';
import { motion } from 'framer-motion';

const BADGES = [
  { label: 'Fiverr Pro', icon: '🟢', color: '#1dbf73', bg: '#f0fdf4' },
  { label: 'Google ⭐ 4.9', icon: '🔵', color: '#4285f4', bg: '#eff6ff' },
  { label: 'Clutch Verified', icon: '🔴', color: '#e8192c', bg: '#fff1f2' },
  { label: '500+ Projects', icon: '🏆', color: '#f59e0b', bg: '#fffbeb' },
  { label: 'Upwork Top Rated', icon: '🟤', color: '#6fda44', bg: '#f0fdf4' },
  { label: '100+ Clients', icon: '🌍', color: '#6366f1', bg: '#eef2ff' },
];

const FeaturedIn = () => (
  <section className="featured-in-section" aria-label="Credentials and recognition">
    <div className="container">
      <motion.p
        className="featured-in-label"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        Recognized & verified across platforms
      </motion.p>

      <div className="featured-in-badges">
        {BADGES.map((b, i) => (
          <motion.div
            key={b.label}
            className="fi-badge"
            style={{ '--fi-color': b.color, '--fi-bg': b.bg }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.07 }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
          >
            <span className="fi-badge-dot" />
            <span className="fi-badge-label">{b.label}</span>
          </motion.div>
        ))}
      </div>
    </div>

    <style>{`
      .featured-in-section {
        padding: 3rem 0;
        background: var(--surface-soft, #FFF0F1);
        border-top: 1px solid var(--border-soft, rgba(232,25,44,0.06));
        border-bottom: 1px solid var(--border-soft, rgba(232,25,44,0.06));
      }
      .featured-in-label {
        text-align: center;
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--muted, #667085);
        margin-bottom: 1.5rem;
      }
      .featured-in-badges {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        flex-wrap: wrap;
      }
      .fi-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        padding: 0.5rem 1.1rem;
        background: var(--fi-bg, #fff);
        border: 1.5px solid color-mix(in srgb, var(--fi-color) 20%, transparent);
        border-radius: 100px;
        font-size: 0.8rem;
        font-weight: 700;
        color: var(--fi-color, #374151);
        cursor: default;
        transition: box-shadow 0.2s ease, transform 0.2s ease;
        box-shadow: 0 1px 4px rgba(0,0,0,0.04);
      }
      .fi-badge:hover {
        box-shadow: 0 6px 20px rgba(0,0,0,0.08);
      }
      .fi-badge-dot {
        width: 8px; height: 8px;
        border-radius: 50%;
        background: var(--fi-color, #374151);
        flex-shrink: 0;
        opacity: 0.85;
      }
      .fi-badge-label { line-height: 1; }

      @media (max-width: 640px) {
        .featured-in-badges { gap: 0.5rem; }
        .fi-badge { font-size: 0.74rem; padding: 0.42rem 0.85rem; }
      }
      @media (prefers-reduced-motion: reduce) {
        .fi-badge:hover { transform: none; }
      }
    `}</style>
  </section>
);

export default FeaturedIn;
