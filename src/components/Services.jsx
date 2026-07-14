import React, { useEffect, useMemo, useState } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';
import { ArrowUpRight, BarChart3, Clapperboard, Code2, Megaphone, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const EASE = [0.16, 1, 0.3, 1];

const defaultServices = [
  {
    id: 'social-media',
    icon: <BarChart3 size={22} />,
    title: 'Strategic Social Media Management',
    desc: 'Data-driven content strategies that increase engagement and drive conversions. Full-service management from strategy to execution.',
    price: '$299/mo',
    badge: 'Most Popular',
  },
  {
    id: 'graphic-design',
    icon: <Palette size={22} />,
    title: 'Brand Identity & Logo Design',
    desc: 'Comprehensive visual identity that communicates your unique value proposition. From brand strategy to execution-ready assets.',
    price: 'From $45',
  },
  {
    id: 'video-editing',
    icon: <Clapperboard size={22} />,
    title: 'Professional Video Production',
    desc: 'Strategic video content that tells your brand story and drives action. From concept to final delivery with platform optimisation.',
    price: 'From $60',
  },
  {
    id: 'digital-marketing',
    icon: <Megaphone size={22} />,
    title: 'Digital Marketing & Ads',
    desc: 'Campaign planning, ad creative and landing-page funnels built to convert. Performance-focused from day one.',
    price: 'From $99',
  },
  {
    id: 'website-design',
    icon: <Code2 size={22} />,
    title: 'Conversion-Focused Web Design',
    desc: 'Responsive business websites that turn visitors into customers. UX design with business goals at the centre.',
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
        const all = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const sorted = all.sort((a, b) => (a.order || 0) - (b.order || 0));
        setServices(sorted.filter((s) => !s.hidden));
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <div className="eyebrow">Our services</div>
            </motion.div>

            <motion.h2
              className="section-h svc-heading"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.08 }}
            >
              {fullPage ? (
                <>Strategic creative services that <span className="text-red">drive business results.</span></>
              ) : (
                <>Professional creative support for <span className="text-red">growing businesses.</span></>
              )}
            </motion.h2>

            <motion.p
              className="section-sub"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.16 }}
            >
              A dedicated creative partner that understands your business goals. From strategy to execution, we deliver measurable results without the agency overhead.
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
                    <span className="svc-price">{svc.price || 'Custom quote'}</span>
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
                      initial={{ opacity: 0, scale: 0.88, x: 16 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.88, x: 16 }}
                      transition={{ duration: 0.32, ease: EASE }}
                    >
                      <img
                        src={svc.imageUrl || serviceImages[idx % serviceImages.length]}
                        alt=""
                        loading="lazy"
                      />
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
          position: absolute;
          right: -220px;
          top: 50%;
          transform: translateY(-50%);
          width: 200px;
          height: 150px;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.14);
          z-index: 10;
          pointer-events: none;
        }
        .svc-preview img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
        }

        /* Responsive */
        @media (max-width: 1200px) {
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
