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
          padding: 3.5rem 0 3rem;
          background: #fff;
          border-top: 1px solid #f0f0f4;
          border-bottom: 1px solid #f0f0f4;
          overflow: hidden;
        }
        .cl-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.75rem;
        }
        .cl-label {
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: #9ca3af;
        }

        /* Marquee */
        .cl-marquee-wrap {
          width: 100%;
          overflow: hidden;
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%);
          mask-image: linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%);
        }
        .cl-marquee-track {
          display: flex;
          gap: 1rem;
          width: max-content;
          animation: cl-scroll 36s linear infinite;
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
          gap: 0.55rem;
          padding: 0.5rem 1.1rem 0.5rem 0.55rem;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 100px;
          white-space: nowrap;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          transition: box-shadow 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
          flex-shrink: 0;
        }
        .cl-brand-pill:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
          border-color: #d1d5db;
          transform: translateY(-1px);
        }
        .cl-brand-abbr {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px; height: 30px;
          border-radius: 50%;
          font-size: 0.65rem;
          font-weight: 900;
          letter-spacing: -0.01em;
          flex-shrink: 0;
        }
        .cl-brand-name {
          font-size: 0.82rem;
          font-weight: 700;
          color: #374151;
          letter-spacing: -0.01em;
        }
      `}</style>
    </section>
  );
};

export default Clients;
