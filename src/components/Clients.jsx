import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { motion } from 'framer-motion';

/* Premium styled brand logos — displayed as pill badges with initials + color identity */
const DEFAULT_BRANDS = [
  { name: 'Aurevia',       abbr: 'AV', color: '#c084fc', bg: '#f5f3ff' },
  { name: 'NexoPay',       abbr: 'NX', color: '#3b82f6', bg: '#eff6ff' },
  { name: 'Harbor & Pine', abbr: 'HP', color: '#0d9488', bg: '#f0fdfa' },
  { name: 'NovaGrid',      abbr: 'NG', color: '#e8192c', bg: '#fff1f2' },
  { name: 'Petello',       abbr: 'PE', color: '#f59e0b', bg: '#fffbeb' },
  { name: 'Solenne',       abbr: 'SO', color: '#ec4899', bg: '#fdf2f8' },
  { name: 'ByteWave',      abbr: 'BW', color: '#6366f1', bg: '#eef2ff' },
  { name: 'Brasa Fire',    abbr: 'BF', color: '#f97316', bg: '#fff7ed' },
  { name: 'EduBridge',     abbr: 'EB', color: '#22c55e', bg: '#f0fdf4' },
  { name: 'Summit Fit',    abbr: 'SF', color: '#14b8a6', bg: '#f0fdfa' },
  { name: 'CraftNest',     abbr: 'CN', color: '#a855f7', bg: '#faf5ff' },
  { name: 'Riverside Co',  abbr: 'RC', color: '#0ea5e9', bg: '#f0f9ff' },
];

const BrandLogo = ({ brand }) => (
  <div className="cl-brand-pill">
    <span
      className="cl-brand-abbr"
      style={{ color: brand.color, background: brand.bg }}
    >
      {brand.abbr}
    </span>
    <span className="cl-brand-name">{brand.name}</span>
  </div>
);

const Clients = () => {
  const { content } = useSettings();
  const clientsContent = content?.clients || {};

  /* Parse custom client list if provided, otherwise use defaults */
  const brands = (() => {
    if (clientsContent.brands && Array.isArray(clientsContent.brands)) {
      return clientsContent.brands;
    }
    if (clientsContent.list) {
      const names = clientsContent.list
        .split(',')
        .map(s => s.trim())
        .filter(s => s && !/(bangladesh|dhaka|\bbd\b)/i.test(s));
      return names.map((name, i) => ({
        name,
        abbr: name.slice(0, 2).toUpperCase(),
        color: DEFAULT_BRANDS[i % DEFAULT_BRANDS.length].color,
        bg:    DEFAULT_BRANDS[i % DEFAULT_BRANDS.length].bg,
      }));
    }
    return DEFAULT_BRANDS;
  })();

  /* Duplicate for seamless scroll */
  const track = [...brands, ...brands, ...brands];

  return (
    <section className="clients-section-v2" aria-label="Trusted by global brands">
      <div className="cl-inner">
        <motion.p
          className="cl-label"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          Trusted by brands across the US, Canada & Australia
        </motion.p>

        <div className="cl-marquee-wrap">
          <div className="cl-marquee-track">
            {track.map((brand, i) => (
              <BrandLogo key={`${brand.name}-${i}`} brand={brand} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .clients-section-v2 {
          padding: 5rem 0 4rem;
          background: var(--surface-soft, #FFFBFB);
          border-top: 1px solid var(--border-soft, rgba(232,25,44,0.06));
          border-bottom: 1px solid var(--border-soft, rgba(232,25,44,0.06));
          overflow: hidden;
          position: relative;
        }
        .clients-section-v2::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(232,25,44,0.03) 0%, transparent 70%);
          pointer-events: none;
        }
        .cl-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2.5rem;
          position: relative;
          z-index: 1;
        }
        .cl-label {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted, #9ca3af);
          text-align: center;
          max-width: 600px;
          line-height: 1.5;
        }

        /* Marquee */
        .cl-marquee-wrap {
          width: 100%;
          overflow: hidden;
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%);
          mask-image: linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%);
        }
        .cl-marquee-track {
          display: flex;
          gap: 1.5rem;
          width: max-content;
          animation: cl-scroll 40s linear infinite;
        }
        .cl-marquee-track:hover { animation-play-state: paused; }
        @keyframes cl-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }

        /* Brand pill */
        .cl-brand-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.4rem 0.75rem 0.75rem;
          background: #fff;
          border: 1.5px solid var(--border-card, #e5e7eb);
          border-radius: 16px;
          white-space: nowrap;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
        }
        .cl-brand-pill::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, transparent 50%);
          pointer-events: none;
        }
        .cl-brand-pill:hover {
          box-shadow: 0 8px 28px rgba(0,0,0,0.12);
          border-color: var(--brand-red, #E8192C);
          transform: translateY(-3px);
        }
        .cl-brand-abbr {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px; height: 36px;
          border-radius: 10px;
          font-size: 0.72rem;
          font-weight: 900;
          letter-spacing: -0.02em;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
        }
        .cl-brand-name {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--ink, #0F0F12);
          letter-spacing: -0.02em;
          position: relative;
          z-index: 1;
        }

        @media (max-width: 768px) {
          .clients-section-v2 {
            padding: 3.5rem 0 3rem;
          }
          .cl-inner {
            gap: 2rem;
          }
          .cl-label {
            font-size: 0.68rem;
            padding: 0 1rem;
          }
          .cl-marquee-track {
            gap: 1rem;
          }
          .cl-brand-pill {
            padding: 0.6rem 1.1rem 0.6rem 0.6rem;
            gap: 0.6rem;
          }
          .cl-brand-abbr {
            width: 32px; height: 32px;
            font-size: 0.68rem;
          }
          .cl-brand-name {
            font-size: 0.82rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Clients;
