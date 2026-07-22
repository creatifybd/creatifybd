import React, { useEffect, useMemo, useState } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';
import OptimizedImage from './OptimizedImage';
import { ArrowUpRight, BarChart3, Clapperboard, Code2, Megaphone, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const EASE = [0.16, 1, 0.3, 1];

const formatUSDPrice = (priceStr) => {
  if (!priceStr) return 'Custom quote';
  let cleaned = String(priceStr)
    .replace(/[৳Tk]/g, '$')
    .replace(/BDT/gi, 'USD')
    .trim();
  if (/^\d/.test(cleaned)) {
    cleaned = '$' + cleaned;
  }
  return cleaned;
};

const defaultServices = [
  {
    id: 'social-media',
    icon: <BarChart3 size={22} />,
    title: 'Turn silence into a loyal following',
    desc: 'We handle everything — strategy, design, captions, scheduling — so your brand stays active and building trust while you run your business.',
    price: '$299/mo',
    badge: 'Most Popular',
  },
  {
    id: 'graphic-design',
    icon: <Palette size={22} />,
    title: 'Look like the leader you’re becoming',
    desc: 'A brand identity that makes your business impossible to forget — whether you’re pitching investors, launching a product, or winning international clients.',
    price: 'From $45',
  },
  {
    id: 'video-editing',
    icon: <Clapperboard size={22} />,
    title: 'Content that makes people stop scrolling',
    desc: 'Short-form reels, promos, and edits that capture attention in the first 3 seconds — and convert viewers into followers, customers, and buyers.',
    price: 'From $60',
  },
  {
    id: 'digital-marketing',
    icon: <Megaphone size={22} />,
    title: 'Put your offer in front of the right people',
    desc: 'Ads, funnels, and campaigns built around conversions — not just clicks. Every campaign is built to grow revenue, not just impressions.',
    price: 'From $99',
  },
  {
    id: 'website-design',
    icon: <Code2 size={22} />,
    title: 'A website that works while you sleep',
    desc: 'Clean, fast, and conversion-focused — designed to build instant trust and capture leads 24/7, without you having to say a word.',
    price: 'From $249',
  },
];

const serviceImages = [
  '/assets/portfolio/social-media-management/social-media-management-01.jpg',
  '/assets/portfolio/logo-design-branding/logo-design-branding-01.jpg',
  '/assets/portfolio/video-editing/video-editing-01.jpg',
  '/assets/portfolio/digital-marketing/digital-marketing-01.jpg',
  '/assets/portfolio/website-design/website-design-01.jpg',
];

const Services = ({ highlight = false, fullPage = false }) => {
  const [services, setServices] = useState([]);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'services'),
      (snap) => {
        try {
          const docs = Array.isArray(snap?.docs) ? snap.docs : [];
          const all = docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          const sorted = all.sort((a, b) => (Number(a?.order) || 0) - (Number(b?.order) || 0));
          setServices(sorted.filter((s) => !s?.hidden));
        } catch (err) {
          console.error('Services: failed to process snapshot, using defaults', err);
          setServices([]);
        }
      },
      () => setServices([])
    );
    return () => unsub();
  }, []);

  const displayServices = useMemo(() => {
    const source = services.length > 0 ? services : defaultServices;
    return highlight ? source.slice(0, 5) : source;
  }, [highlight, services]);

  return (
    <section className={`svc-section section${fullPage ? ' full-page-section' : ''}`} id="services">
      <div className="container">
        <div className="svc-layout">
          {/* Left sticky header */}
          <div className="svc-header">
            <motion.h2
              className="section-h svc-heading"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.08 }}
            >
              {fullPage ? (
                <>
                  Pick your growth lever.
                  {' '}<span className="text-red">Every service is built to move your business forward.</span>
                </>
              ) : (
                <>
                  Five ways we grow your business.
                  {' '}<span className="text-red">Pick the one you need most.</span>
                </>
              )}
            </motion.h2>

            <motion.p
              className="section-sub"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.16 }}
            >
              Whether you need one service or all five, each one is built around the same goal: making your business look better, reach more people, and convert more customers.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: EASE, delay: 0.26 }}
            >
              <Link
                to={fullPage ? '/contact' : '/services'}
                className="svc-explore-link"
              >
                {fullPage ? 'Discuss your project' : 'Explore all services'}
                <ArrowUpRight size={16} />
              </Link>
            </motion.div>
          </div>

          {/* Right: numbered service list */}
          <div className="svc-list">
            {displayServices.map((svc, idx) => (
              <motion.article
                key={svc.id || idx}
                className={`svc-row${hoveredIdx === idx ? ' is-hovered' : ''}`}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.6, ease: EASE, delay: idx * 0.06 }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <div className="svc-row-inner">
                  {/* Number */}
                  <span className="svc-num">
                    {String(idx + 1).padStart(2, '0')}
                  </span>

                  {/* Icon */}
                  <div className="svc-icon">{svc.icon || <Palette size={22} />}</div>

                  {/* Copy */}
                  <div className="svc-copy">
                    <div className="svc-title-row">
                      <h3 className="svc-title">{svc.title}</h3>
                      {idx === 0 && (
                        <span className="svc-badge">{svc.badge || 'Most Popular'}</span>
                      )}
                    </div>
                    <p className="svc-desc">{svc.desc || svc.description}</p>
                  </div>

                  {/* Price + Arrow */}
                  <div className="svc-action">
                    <span className="svc-price">
                      {formatUSDPrice(svc.price)}
                    </span>
                    <a href="/contact" className="svc-arrow" aria-label={`Discuss ${svc.title}`}>
                      <ArrowUpRight size={20} />
                    </a>
                  </div>

                </div>

                {/* Hover preview image */}
                <AnimatePresence>
                  {hoveredIdx === idx && (
                    <motion.div
                      className="svc-preview"
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.32, ease: EASE }}
                    >
                      <div className="svc-preview-content">
                        <OptimizedImage
                          src={svc.imageUrl || serviceImages[idx % serviceImages.length]}
                          alt={svc.title}
                          objectFit="cover"
                        />

                        {(svc.hoverDetails || svc.deliverables) && (
                          <div className="svc-preview-overlay">
                            {svc.hoverDetails && (
                              <p className="svc-preview-details">{svc.hoverDetails}</p>
                            )}
                            {svc.deliverables && Array.isArray(svc.deliverables) && svc.deliverables.length > 0 && (
                              <ul className="svc-preview-deliverables">
                                {svc.deliverables.map((item, i) => (
                                  <li key={i}>{item}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        /* ══ SERVICES ══════════════════════════════════════════ */
        .svc-section { padding: var(--section-padding) 0; background: var(--surface); }

        .svc-layout {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: clamp(3rem, 6vw, 8rem);
          align-items: start;
        }

        .svc-header {
          position: sticky;
          top: calc(var(--nav-height, 90px) + 2rem);
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          padding-bottom: 2rem;
        }

        .svc-heading {
          margin: 0 !important;
          font-size: clamp(1.85rem, 3vw, 2.6rem) !important;
        }

        .svc-explore-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-family: var(--font-body);
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--brand-red);
          text-decoration: none;
          letter-spacing: -0.01em;
          border-bottom: 1.5px solid rgba(232,25,44,0.3);
          padding-bottom: 2px;
          transition: border-color 0.2s;
        }
        .svc-explore-link:hover { border-color: var(--brand-red); color: var(--brand-red); }

        /* List */
        .svc-list {
          display: flex;
          flex-direction: column;
          border-top: 1px solid var(--border);
        }

        .svc-row {
          position: relative;
          border-bottom: 1px solid var(--border);
          cursor: pointer;
          transition: background 0.22s;
          overflow: visible;
        }
        .svc-row:hover { background: var(--surface-soft); }

        .svc-row-inner {
          display: grid;
          grid-template-columns: 3rem 2.5rem 1fr auto;
          align-items: center;
          gap: 1.25rem;
          padding: 1.75rem 1.5rem 1.75rem 0;
          min-height: 90px;
        }

        /* Number */
        .svc-num {
          font-family: var(--font-display);
          font-size: 0.8rem;
          font-weight: 900;
          letter-spacing: 0.06em;
          color: var(--muted);
          opacity: 0.45;
          user-select: none;
        }
        .svc-row.is-hovered .svc-num { opacity: 1; color: var(--brand-red); }

        /* Icon */
        .svc-icon {
          width: 2.5rem; height: 2.5rem;
          display: flex; align-items: center; justify-content: center;
          background: var(--surface-soft);
          border-radius: 10px;
          border: 1px solid var(--border);
          color: var(--ink);
          flex-shrink: 0;
          transition: background 0.22s, color 0.22s, border-color 0.22s;
        }
        .svc-row.is-hovered .svc-icon {
          background: rgba(232,25,44,0.07);
          color: var(--brand-red);
          border-color: rgba(232,25,44,0.2);
        }

        /* Copy */
        .svc-copy { min-width: 0; }
        .svc-title-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-bottom: 0.4rem;
        }
        .svc-title {
          font-family: var(--font-display);
          font-size: clamp(1rem, 1.6vw, 1.2rem);
          font-weight: 700;
          color: var(--ink);
          letter-spacing: -0.025em;
          line-height: 1.25;
          margin: 0;
          transition: color 0.22s;
        }
        .svc-row.is-hovered .svc-title { color: var(--brand-red); }
        .svc-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.22rem 0.7rem;
          background: rgba(232,25,44,0.08);
          color: var(--brand-red);
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          border-radius: 100px;
          border: 1px solid rgba(232,25,44,0.18);
          white-space: nowrap;
        }
        .svc-desc {
          font-size: 0.875rem;
          color: var(--muted);
          line-height: 1.65;
          margin: 0;
          max-width: 480px;
        }

        /* Action */
        .svc-action {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-shrink: 0;
          padding-left: 1rem;
        }
        .svc-price {
          font-family: var(--font-display);
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--ink);
          letter-spacing: -0.02em;
          white-space: nowrap;
        }
        .svc-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px; height: 40px;
          border-radius: 50%;
          border: 1.5px solid var(--border);
          color: var(--ink);
          text-decoration: none;
          transition: background 0.22s, border-color 0.22s, color 0.22s, transform 0.22s;
          flex-shrink: 0;
        }
        .svc-row:hover .svc-arrow {
          background: var(--brand-red);
          border-color: var(--brand-red);
          color: #fff;
          transform: rotate(-5deg);
        }

        /* Preview image */
        .svc-preview {
          position: relative;
          width: 100%;
          max-width: 400px;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.14);
          pointer-events: none;
        }
        .svc-preview-content {
          position: relative;
          width: 100%;
        }
        .svc-preview img {
          width: 100%;
          height: auto;
          max-height: 300px;
          object-fit: cover;
          display: block;
        }
        .svc-preview-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.65) 70%, transparent 100%);
          padding: 1.5rem;
          color: #fff;
        }
        .svc-preview-details {
          font-size: 0.85rem;
          font-weight: 600;
          margin: 0 0 0.75rem 0;
          line-height: 1.4;
        }
        .svc-preview-deliverables {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .svc-preview-deliverables li {
          font-size: 0.75rem;
          background: rgba(255,255,255,0.15);
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
          backdrop-filter: blur(4px);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .svc-preview { display: none; }
        }
        @media (max-width: 900px) {
          .svc-layout { grid-template-columns: 1fr; gap: 2.5rem; }
          .svc-header { position: static; }
          .svc-row-inner { grid-template-columns: 2.5rem 2rem 1fr auto; gap: 1rem; padding: 1.35rem 0.75rem 1.35rem 0; }
        }
        @media (max-width: 540px) {
          .svc-row-inner { grid-template-columns: 2rem 1fr auto; }
          .svc-icon { display: none; }
          .svc-action { gap: 0.5rem; padding-left: 0.5rem; }
          .svc-price { display: none; }
        }
      `}</style>
    </section>
  );
};

export default Services;
