import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

const EASE_EXPO = [0.16, 1, 0.3, 1];

/* Brand palette — colorful identity chips */
const PALETTE = [
  { color: '#c084fc', bg: '#faf5ff' },
  { color: '#3b82f6', bg: '#eff6ff' },
  { color: '#0d9488', bg: '#f0fdfa' },
  { color: '#e8192c', bg: '#fff1f2' },
  { color: '#f59e0b', bg: '#fffbeb' },
  { color: '#ec4899', bg: '#fdf2f8' },
  { color: '#6366f1', bg: '#eef2ff' },
  { color: '#f97316', bg: '#fff7ed' },
  { color: '#22c55e', bg: '#f0fdf4' },
  { color: '#14b8a6', bg: '#f0fdfa' },
  { color: '#a855f7', bg: '#faf5ff' },
  { color: '#0ea5e9', bg: '#f0f9ff' },
];

const DEFAULT_BRANDS = [
  { name: 'Aurevia',       abbr: 'AV' },
  { name: 'NexoPay',       abbr: 'NX' },
  { name: 'Harbor & Pine', abbr: 'HP' },
  { name: 'NovaGrid',      abbr: 'NG' },
  { name: 'Petello',       abbr: 'PE' },
  { name: 'Solenne',       abbr: 'SO' },
  { name: 'ByteWave',      abbr: 'BW' },
  { name: 'Brasa Fire',    abbr: 'BF' },
  { name: 'EduBridge',     abbr: 'EB' },
  { name: 'Summit Fit',    abbr: 'SF' },
  { name: 'CraftNest',     abbr: 'CN' },
  { name: 'Riverside Co',  abbr: 'RC' },
];

const BrandChip = ({ brand, idx }) => {
  const pal = PALETTE[idx % PALETTE.length];
  return (
    <div
      className="cl-chip"
      style={{ '--cl-color': pal.color, '--cl-bg': pal.bg }}
    >
      <span
        className="cl-chip-abbr"
        style={{ color: pal.color, background: pal.bg }}
      >
        {brand.abbr}
      </span>
      <span className="cl-chip-name">{brand.name}</span>
    </div>
  );
};

const Clients = () => {
  const { content } = useSettings();
  const clientsContent = content?.clients || {};

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
      }));
    }
    return DEFAULT_BRANDS;
  })();

  const track = [...brands, ...brands, ...brands];

  return (
    <section className="cl2-section" aria-label="Trusted by global brands">
      {/* Header */}
      <motion.div
        className="cl2-header"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: EASE_EXPO }}
      >
        <div className="cl2-title-row">
          <Globe size={16} className="cl2-globe" aria-hidden="true" />
          <p className="cl2-label">Trusted by brands globally</p>
        </div>
        <div className="cl2-count-row">
          <span className="cl2-count">100<span className="cl2-plus">+</span></span>
          <span className="cl2-count-label">brands served worldwide</span>
        </div>
      </motion.div>

      {/* Marquee */}
      <div className="cl2-marquee-wrap" aria-hidden="true">
        <div className="cl2-marquee-track">
          {track.map((brand, i) => (
            <BrandChip key={`${brand.name}-${i}`} brand={brand} idx={i} />
          ))}
        </div>
      </div>

      <style>{`
        .cl2-section {
          padding: 5rem 0;
          background: var(--surface-soft, #FFFBFB);
          border-bottom: 1px solid var(--border-soft, rgba(0,0,0,0.06));
          overflow: hidden;
          position: relative;
        }
        .cl2-section::before {
          content: '';
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(232,25,44,0.025) 0%, transparent 70%);
          pointer-events: none;
        }
        .cl2-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 2.5rem;
          position: relative;
          z-index: 1;
        }
        .cl2-title-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .cl2-globe { color: var(--brand-red, #E8192C); }
        .cl2-label {
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted, #9CA3AF);
          margin: 0;
        }
        .cl2-count-row {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
        }
        .cl2-count {
          font-size: 2.5rem;
          font-weight: 900;
          color: var(--ink, #0F0F12);
          letter-spacing: -0.04em;
          line-height: 1;
        }
        .cl2-plus {
          color: var(--brand-red, #E8192C);
        }
        .cl2-count-label {
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--muted, #6B7280);
          letter-spacing: -0.01em;
        }

        /* Marquee */
        .cl2-marquee-wrap {
          width: 100%;
          overflow: hidden;
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 7%, #000 93%, transparent 100%);
          mask-image: linear-gradient(90deg, transparent 0%, #000 7%, #000 93%, transparent 100%);
        }
        .cl2-marquee-track {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          width: max-content;
          animation: cl2-scroll 42s linear infinite;
        }
        .cl2-marquee-track:hover { animation-play-state: paused; }
        @keyframes cl2-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }

        /* Chip */
        .cl-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.6rem 1.1rem 0.6rem 0.6rem;
          background: #fff;
          border: 1.5px solid rgba(0,0,0,0.07);
          border-radius: 14px;
          flex-shrink: 0;
          white-space: nowrap;
          cursor: default;
          transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .cl-chip:hover {
          border-color: var(--cl-color);
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }
        .cl-chip-abbr {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: 10px;
          font-size: 0.7rem;
          font-weight: 900;
          letter-spacing: -0.01em;
          flex-shrink: 0;
        }
        .cl-chip-name {
          font-size: 0.87rem;
          font-weight: 700;
          color: var(--ink, #0F0F12);
          letter-spacing: -0.02em;
        }

        @media (max-width: 640px) {
          .cl2-section { padding: 3.5rem 0; }
          .cl2-header { gap: 0.5rem; margin-bottom: 2rem; }
          .cl2-count { font-size: 2rem; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cl2-marquee-track { animation: none; }
          .cl-chip:hover { transform: none; }
        }
      `}</style>
    </section>
  );
};

export default Clients;
