import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const BADGES = [
  { 
    label: 'Fiverr Pro', 
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 16.5V7.5L16 12L10 16.5Z" fill="#1dbf73"/>
      </svg>
    ), 
    color: '#1dbf73', 
    bg: '#f0fdf4' 
  },
  { 
    label: 'Google ⭐ 4.9', 
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    ), 
    color: '#4285f4', 
    bg: '#eff6ff' 
  },
  { 
    label: 'Clutch Verified', 
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#e8192c"/>
        <path d="M2 17L12 22L22 17V7L12 12L2 7V17Z" fill="#c41024"/>
        <path d="M12 12V22" stroke="#fff" strokeWidth="2"/>
        <path d="M12 12L2 7" stroke="#fff" strokeWidth="2"/>
        <path d="M12 12L22 7" stroke="#fff" strokeWidth="2"/>
      </svg>
    ), 
    color: '#e8192c', 
    bg: '#fff1f2' 
  },
  { 
    label: '500+ Projects', 
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#f59e0b"/>
      </svg>
    ), 
    color: '#f59e0b', 
    bg: '#fffbeb' 
  },
  { 
    label: 'Upwork Top Rated', 
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.56 3.44C16.78 1.66 14.5 0.5 12 0.5C9.5 0.5 7.22 1.66 5.44 3.44C3.66 5.22 2.5 7.5 2.5 10C2.5 12.5 3.66 14.78 5.44 16.56C7.22 18.34 9.5 19.5 12 19.5C14.5 19.5 16.78 18.34 18.56 16.56C20.34 14.78 21.5 12.5 21.5 10C21.5 7.5 20.34 5.22 18.56 3.44ZM12 17.5C10.14 17.5 8.44 16.78 7.17 15.6C8.5 14.28 9.5 12.5 9.5 10.5C9.5 8.5 8.5 6.72 7.17 5.4C8.44 4.22 10.14 3.5 12 3.5C13.86 3.5 15.56 4.22 16.83 5.4C15.5 6.72 14.5 8.5 14.5 10.5C14.5 12.5 15.5 14.28 16.83 15.6C15.56 16.78 13.86 17.5 12 17.5Z" fill="#6fda44"/>
        <circle cx="12" cy="10" r="3" fill="#6fda44"/>
      </svg>
    ), 
    color: '#6fda44', 
    bg: '#f0fdf4' 
  },
  { 
    label: '100+ Clients', 
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="#6366f1" strokeWidth="2" fill="none"/>
        <path d="M2 12H22" stroke="#6366f1" strokeWidth="2"/>
        <path d="M12 2C12 2 12 12 12 22" stroke="#6366f1" strokeWidth="2"/>
        <circle cx="12" cy="12" r="4" fill="#6366f1"/>
      </svg>
    ), 
    color: '#6366f1', 
    bg: '#eef2ff' 
  },
];

// Duplicate badges for seamless infinite scroll
const MARQUEE_BADGES = [...BADGES, ...BADGES, ...BADGES];

const FeaturedIn = () => {
  const marqueeRef = useRef(null);
  const [marqueeWidth, setMarqueeWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (marqueeRef.current) {
        // Calculate width of a single badge set (total width / 3 since we have 3 duplicates)
        const totalWidth = marqueeRef.current.scrollWidth;
        const singleSetWidth = totalWidth / 3;
        setMarqueeWidth(singleSetWidth);
      }
    };

    // Use setTimeout to ensure DOM is fully rendered
    const timeoutId = setTimeout(updateWidth, 100);
    
    window.addEventListener('resize', updateWidth);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  return (
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

        <div className="featured-in-marquee-wrapper">
          <motion.div 
            ref={marqueeRef}
            className="featured-in-marquee"
            animate={{ x: [0, -marqueeWidth] }}
            transition={{ 
              x: { 
                repeat: Infinity, 
                repeatType: "loop", 
                duration: 30, 
                ease: "linear" 
              } 
            }}
            style={{ animation: 'none' }}
          >
          {MARQUEE_BADGES.map((b, i) => (
            <div
              key={`${b.label}-${i}`}
              className="fi-badge"
              style={{ '--fi-color': b.color, '--fi-bg': b.bg }}
            >
              <span className="fi-badge-icon">{b.icon}</span>
              <span className="fi-badge-label">{b.label}</span>
            </div>
          ))}
        </motion.div>
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
      .featured-in-marquee-wrapper {
        overflow: hidden;
        width: 100%;
        position: relative;
      }
      .featured-in-marquee-wrapper::before,
      .featured-in-marquee-wrapper::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100px;
        z-index: 2;
        pointer-events: none;
      }
      .featured-in-marquee-wrapper::before {
        left: 0;
        background: linear-gradient(to right, var(--surface-soft, #FFF0F1), transparent);
      }
      .featured-in-marquee-wrapper::after {
        right: 0;
        background: linear-gradient(to left, var(--surface-soft, #FFF0F1), transparent);
      }
      .featured-in-marquee {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        width: max-content;
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
      .fi-badge-icon {
        width: 20px; height: 20px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .fi-badge-icon svg {
        width: 100%;
        height: 100%;
      }
      .fi-badge-label { line-height: 1; }

      @media (max-width: 640px) {
        .featured-in-badges { gap: 0.5rem; }
        .fi-badge { font-size: 0.74rem; padding: 0.42rem 0.85rem; }
      }
      @media (prefers-reduced-motion: reduce) {
        .fi-badge:hover { transform: none; }
        .featured-in-marquee { animation: none !important; }
      }
    `}</style>
      </div>
    </section>
  );
};

export default FeaturedIn;
