import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

const EASE_EXPO = [0.16, 1, 0.3, 1];

/* Platform trust items */
const ITEMS = [
  {
    name: 'Fiverr Pro',
    detail: 'Verified Seller',
    color: '#1DBF73',
    bg: '#F0FDF4',
    icon: (
      <svg viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#1DBF73"/>
        <path d="M8 17h9m0 0V9m0 8 5-5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="22" cy="10" r="1.5" fill="#fff"/>
      </svg>
    ),
  },
  {
    name: 'Google',
    detail: '4.9 ★ Rating',
    color: '#4285F4',
    bg: '#EFF6FF',
    icon: (
      <svg viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#fff" stroke="#E5E7EB"/>
        <path d="M26 16.2c0-.7-.06-1.37-.18-2.02H16v3.83h5.61c-.24 1.26-.98 2.33-2.09 3.04v2.53h3.38C24.87 21.72 26 19.17 26 16.2z" fill="#4285F4"/>
        <path d="M16 26c2.81 0 5.16-.93 6.88-2.52l-3.38-2.53c-.93.63-2.12 1-3.5 1-2.69 0-4.97-1.82-5.78-4.26H6.72v2.6C8.44 23.52 11.97 26 16 26z" fill="#34A853"/>
        <path d="M10.22 17.69A6.08 6.08 0 0 1 9.88 16c0-.59.1-1.16.28-1.69V11.7H6.72A9.99 9.99 0 0 0 6 16c0 1.62.39 3.14 1.07 4.47l3.15-2.78z" fill="#FBBC04"/>
        <path d="M16 9.74c1.52 0 2.89.52 3.96 1.55l2.97-2.97C21.15 6.71 18.8 5.74 16 5.74c-4.03 0-7.56 2.48-9.28 6.06l3.5 2.7C11.03 11.56 13.31 9.74 16 9.74z" fill="#EA4335"/>
      </svg>
    ),
  },
  {
    name: 'Clutch',
    detail: 'Top Agency',
    color: '#E8192C',
    bg: '#FFF1F2',
    icon: (
      <svg viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#E8192C"/>
        <path d="M16 8l2.47 4.93 5.53.8-4 3.87.94 5.4L16 20.27l-4.94 2.73.94-5.4-4-3.87 5.53-.8L16 8z" fill="#fff"/>
      </svg>
    ),
  },
  {
    name: 'Upwork',
    detail: 'Top Rated',
    color: '#14A800',
    bg: '#F0FDF4',
    icon: (
      <svg viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#14A800"/>
        <path d="M20.5 11a4.5 4.5 0 0 0-4.31 3.2L14.7 18.5a2.8 2.8 0 0 1-2.7 2 2.8 2.8 0 0 1-2.8-2.8 2.8 2.8 0 0 1 2.8-2.8c.35 0 .68.07 1 .18L14 12.6a6.3 6.3 0 0 0-2-.33A6.3 6.3 0 0 0 5.7 18.5 6.3 6.3 0 0 0 12 24.8a6.3 6.3 0 0 0 6.1-4.5l1.49-4.3a2.8 2.8 0 0 1 2.7-2 2.8 2.8 0 0 1 2.81 2.8 2.8 2.8 0 0 1-2.81 2.8c-.34 0-.67-.06-.98-.18l-1 2.46a6.3 6.3 0 0 0 1.98.32 6.3 6.3 0 0 0 6.3-6.3A6.3 6.3 0 0 0 22.3 9.7" fill="#fff"/>
      </svg>
    ),
  },
  {
    name: '500+ Projects',
    detail: 'Delivered',
    color: '#F59E0B',
    bg: '#FFFBEB',
    icon: (
      <svg viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#F59E0B"/>
        <path d="M16 8l2.47 5.01L24 14l-4 3.89.94 5.5L16 20.68l-4.94 2.7L12 17.9 8 14l5.53-.99L16 8z" fill="#fff"/>
      </svg>
    ),
  },
  {
    name: '100+ Clients',
    detail: 'Worldwide',
    color: '#8B5CF6',
    bg: '#F5F3FF',
    icon: (
      <svg viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#8B5CF6"/>
        <circle cx="16" cy="13" r="3.5" fill="#fff"/>
        <path d="M8 24c0-4 3.58-7 8-7s8 3 8 7" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
];

/* Duplicate for seamless marquee */
const TRACK = [...ITEMS, ...ITEMS, ...ITEMS];

const FeaturedIn = () => (
  <section className="fi2-section" aria-label="Credentials and recognition">

    <motion.div
      className="fi2-label"
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: EASE_EXPO }}
    >
      <ShieldCheck size={14} aria-hidden="true" />
      Recognized &amp; Verified Across Platforms
    </motion.div>

    {/* Marquee */}
    <div className="fi2-marquee-wrap" aria-hidden="true">
      <div className="fi2-marquee-track">
        {TRACK.map((item, i) => (
          <div
            key={`${item.name}-${i}`}
            className="fi2-tile"
            style={{ '--ti-color': item.color, '--ti-bg': item.bg }}
          >
            <div className="fi2-tile-icon">{item.icon}</div>
            <div className="fi2-tile-body">
              <span className="fi2-tile-name">{item.name}</span>
              <span className="fi2-tile-detail">{item.detail}</span>
            </div>
          </div>
        ))}
      </div>
    </div>

    <style>{`
      .fi2-section {
        padding: 3.5rem 0;
        background: var(--surface-base, #fff);
        border-top: 1px solid var(--border-soft, rgba(0,0,0,0.06));
        border-bottom: 1px solid var(--border-soft, rgba(0,0,0,0.06));
        overflow: hidden;
      }
      .fi2-label {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.45rem;
        font-size: 0.68rem;
        font-weight: 800;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--muted, #9CA3AF);
        margin-bottom: 2rem;
      }
      .fi2-label svg { color: var(--brand-red, #E8192C); flex-shrink: 0; }

      .fi2-marquee-wrap {
        overflow: hidden;
        width: 100%;
        -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%);
        mask-image: linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%);
      }
      .fi2-marquee-track {
        display: flex;
        align-items: center;
        gap: 1rem;
        width: max-content;
        animation: fi2-scroll 35s linear infinite;
      }
      .fi2-marquee-track:hover { animation-play-state: paused; }
      @keyframes fi2-scroll {
        from { transform: translateX(0); }
        to   { transform: translateX(-33.333%); }
      }

      .fi2-tile {
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.7rem 1.25rem 0.7rem 0.7rem;
        background: var(--ti-bg, #f8f8f8);
        border: 1.5px solid color-mix(in srgb, var(--ti-color) 15%, transparent);
        border-radius: 14px;
        flex-shrink: 0;
        cursor: default;
        transition: transform 0.3s cubic-bezier(0.16,1,0.3,1),
                    box-shadow 0.3s cubic-bezier(0.16,1,0.3,1),
                    border-color 0.3s;
        white-space: nowrap;
      }
      .fi2-tile:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        border-color: var(--ti-color);
      }
      .fi2-tile-icon {
        width: 34px;
        height: 34px;
        border-radius: 9px;
        overflow: hidden;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .fi2-tile-icon svg {
        width: 100%;
        height: 100%;
        display: block;
      }
      .fi2-tile-body {
        display: flex;
        flex-direction: column;
        gap: 0.1rem;
      }
      .fi2-tile-name {
        font-size: 0.88rem;
        font-weight: 800;
        color: var(--ink, #0F0F12);
        letter-spacing: -0.02em;
        line-height: 1.2;
      }
      .fi2-tile-detail {
        font-size: 0.7rem;
        font-weight: 600;
        color: var(--ti-color);
        letter-spacing: 0.02em;
        line-height: 1;
      }

      @media (max-width: 640px) {
        .fi2-section { padding: 2.5rem 0; }
        .fi2-tile { padding: 0.55rem 1rem 0.55rem 0.55rem; gap: 0.6rem; }
        .fi2-tile-icon { width: 28px; height: 28px; }
        .fi2-tile-name { font-size: 0.82rem; }
        .fi2-tile-detail { font-size: 0.65rem; }
      }
      @media (prefers-reduced-motion: reduce) {
        .fi2-marquee-track { animation: none; }
        .fi2-tile:hover { transform: none; }
      }
    `}</style>
  </section>
);

export default FeaturedIn;
