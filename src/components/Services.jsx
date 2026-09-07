import React, { useEffect, useMemo, useState } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';
import OptimizedImage from './OptimizedImage';
import { ArrowUpRight, BarChart3, Clapperboard, Code2, Megaphone, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const EASE = [0.16, 1, 0.3, 1];

const bengaliServiceMap = {
  web: {
    title: 'ওয়েবসাইট ডিজাইন ও ডেভেলপমেন্ট',
    desc: 'রেসপন্সিভ, এসইও-অপ্টিমাইজড ও হাই-স্পিড বিজনেস ওয়েবসাইট এবং ই-কমার্স সলিউশন।',
    price: 'কাস্টম বাজেট',
    slug: 'website-design'
  },
  video: {
    title: 'প্রফেশনাল ভিডিও প্রোডাকশন ও রিলস',
    desc: 'হাই-কনভার্সন শর্ট-ফর্ম রিলস, ইউটিউব ভিডিও এবং সিনেমাটিক ব্র্যান্ড প্রমোশন।',
    price: 'কাস্টম বাজেট',
    slug: 'video-editing'
  },
  social: {
    title: 'সোশ্যাল মিডিয়া ম্যানেজমেন্ট',
    desc: 'প্রতিদিন আকর্ষণীয় পোস্ট ডিজাইন, ট্রেন্ডিং রিলস আইডিয়া ও পেজের সম্পূর্ণ গ্রোথ সাপোর্ট।',
    price: 'স্পেশাল প্যাকেজ',
    slug: 'social-media-management'
  },
  marketing: {
    title: 'ডিজিটাল মার্কেটিং ও অ্যাড ক্যাম্পেইন',
    desc: 'টার্গেটেড ফেসবুক ও ইনস্টাগ্রাম অ্যাডস, অডিয়েন্স রিসার্চ এবং সেলস ফানেল অপ্টিমাইজেশন।',
    price: 'কাস্টম বাজেট',
    slug: 'digital-marketing'
  },
  advertising: {
    title: 'ডিজিটাল মার্কেটিং ও অ্যাড ক্যাম্পেইন',
    desc: 'টার্গেটেড ফেসবুক ও ইনস্টাগ্রাম অ্যাডস, অডিয়েন্স রিসার্চ এবং সেলস ফানেল অপ্টিমাইজেশন।',
    price: 'কাস্টম বাজেট',
    slug: 'digital-marketing'
  },
  branding: {
    title: 'ব্র্যান্ড আইডেন্টিটি ও লোগো ডিজাইন',
    desc: 'কাস্টম ইউনিক ভেক্টর লোগো, ব্র্যান্ড গাইডলাইন, প্যাকেজিং ও সোশ্যাল মিডিয়া কিট।',
    price: 'কাস্টম বাজেট',
    slug: 'graphic-design'
  },
  graphic: {
    title: 'ব্র্যান্ড আইডেন্টিটি ও লোগো ডিজাইন',
    desc: 'কাস্টম ইউনিক ভেক্টর লোগো, ব্র্যান্ড গাইডলাইন, প্যাকেজিং ও সোশ্যাল মিডিয়া কিট।',
    price: 'কাস্টম বাজেট',
    slug: 'graphic-design'
  }
};

const defaultServices = [
  {
    id: 'website-design',
    icon: <Code2 size={22} />,
    title: 'ওয়েবসাইট ডিজাইন ও ডেভেলপমেন্ট',
    desc: 'রেসপন্সিভ, এসইও-অপ্টিমাইজড ও হাই-স্পিড বিজনেস ওয়েবসাইট এবং ই-কমার্স সলিউশন।',
    price: 'কাস্টম বাজেট',
    badge: 'সবচেয়ে জনপ্রিয়',
    slug: 'website-design'
  },
  {
    id: 'video-editing',
    icon: <Clapperboard size={22} />,
    title: 'প্রফেশনাল ভিডিও প্রোডাকশন ও রিলস',
    desc: 'হাই-কনভার্সন শর্ট-ফর্ম রিলস, ইউটিউব ভিডিও এবং সিনেমাটিক ব্র্যান্ড প্রমোশন।',
    price: 'কাস্টম বাজেট',
    slug: 'video-editing'
  },
  {
    id: 'social-media',
    icon: <BarChart3 size={22} />,
    title: 'সোশ্যাল মিডিয়া ম্যানেজমেন্ট',
    desc: 'প্রতিদিন আকর্ষণীয় পোস্ট ডিজাইন, ট্রেন্ডিং রিলস আইডিয়া ও পেজের সম্পূর্ণ গ্রোথ সাপোর্ট।',
    price: 'স্পেশাল প্যাকেজ',
    slug: 'social-media-management'
  },
  {
    id: 'digital-marketing',
    icon: <Megaphone size={22} />,
    title: 'ডিজিটাল মার্কেটিং ও অ্যাড ক্যাম্পেইন',
    desc: 'টার্গেটেড ফেসবুক ও ইনস্টাগ্রাম অ্যাডস, অডিয়েন্স রিসার্চ এবং সেলস ফানেল অপ্টিমাইজেশন।',
    price: 'কাস্টম বাজেট',
    slug: 'digital-marketing'
  },
  {
    id: 'graphic-design',
    icon: <Palette size={22} />,
    title: 'ব্র্যান্ড আইডেন্টিটি ও লোগো ডিজাইন',
    desc: 'কাস্টম ইউনিক ভেক্টর লোগো, ব্র্যান্ড গাইডলাইন, প্যাকেজিং ও সোশ্যাল মিডিয়া কিট।',
    price: 'কাস্টম বাজেট',
    slug: 'graphic-design'
  },
];

const serviceImages = [
  '/assets/portfolio/website-design/website-design-01.jpg',
  '/assets/portfolio/video-editing/video-editing-01.jpg',
  '/assets/portfolio/social-media-management/social-media-management-01.jpg',
  '/assets/portfolio/digital-marketing/digital-marketing-01.jpg',
  '/assets/portfolio/logo-design-branding/logo-design-branding-01.jpg',
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
          if (docs.length > 0) {
            const all = docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            const sorted = all.sort((a, b) => (Number(a?.order) || 0) - (Number(b?.order) || 0));
            const visibleServices = sorted.filter((s) => !s?.hidden);
            if (visibleServices.length > 0) {
              setServices(visibleServices);
            }
          }
        } catch (err) {
          console.error('Services: snapshot fallback', err);
        }
      },
      () => {}
    );
    return () => unsub();
  }, []);

  const displayServices = useMemo(() => {
    const source = services.length > 0 ? services : defaultServices;
    const mapped = source.map((s) => {
      const rawTitle = String(s.title_bn || s.title || '').toLowerCase();
      const rawDesc = s.desc_bn || s.desc || s.description || '';
      
      let matched = null;
      if (rawTitle.includes('web') || rawTitle.includes('ওয়েব')) matched = bengaliServiceMap['web'];
      else if (rawTitle.includes('video') || rawTitle.includes('ভিডিও')) matched = bengaliServiceMap['video'];
      else if (rawTitle.includes('social') || rawTitle.includes('সোসাল') || rawTitle.includes('সোশ্যাল')) matched = bengaliServiceMap['social'];
      else if (rawTitle.includes('advert') || rawTitle.includes('ad ') || rawTitle.includes('campaign') || rawTitle.includes('মার্কেটিং') || rawTitle.includes('marketing')) matched = bengaliServiceMap['marketing'];
      else if (rawTitle.includes('brand') || rawTitle.includes('logo') || rawTitle.includes('ব্র্যান্ড') || rawTitle.includes('লোগো') || rawTitle.includes('graphic') || rawTitle.includes('গ্রাফিক')) matched = bengaliServiceMap['branding'];

      const finalTitle = s.title_bn || (matched ? matched.title : s.title);
      const finalDesc = s.desc_bn || (matched ? matched.desc : rawDesc);
      
      const isSocial = (s.id === 'social-media' || finalTitle.includes('সোশ্যাল') || rawTitle.includes('social'));
      const finalPrice = isSocial ? 'স্পেশাল প্যাকেজ' : 'কাস্টম বাজেট';
      const targetSlug = matched ? matched.slug : (s.slug || (isSocial ? 'social-media-management' : 'graphic-design'));

      return {
        ...s,
        title: finalTitle,
        desc: finalDesc,
        price: finalPrice,
        slug: targetSlug
      };
    });
    return highlight ? mapped.slice(0, 5) : mapped;
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
                <>আপনার বিজনেসের জন্য <span className="text-red">কমপ্লিট ক্রিয়েটিভ সলিউশন।</span></>
              ) : (
                <>আপনার বিজনেসের জন্য <span className="text-red">স্মার্ট ক্রিয়েটিভ সলিউশন।</span></>
              )}
            </motion.h2>

            <motion.p
              className="section-sub"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.16 }}
            >
              একটি নিবেদিত ক্রিয়েটিভ টিম যারা আপনার ব্যবসার লক্ষ্য ও কাস্টমারদের বোঝে। স্ট্র্যাটেজি থেকে এক্সিকিউশন—সবকিছুতেই প্রফেশনাল মান।
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
                {fullPage ? 'প্রজেক্ট নিয়ে কথা বলুন' : 'সব সার্ভিস একসাথে দেখুন'}
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
                        <span className="svc-badge">{svc.badge || 'সবচেয়ে জনপ্রিয়'}</span>
                      )}
                    </div>
                    <p className="svc-desc">{svc.desc || svc.description}</p>
                  </div>

                  {/* Price + Arrow */}
                  <div className="svc-action">
                    <span className="svc-price">
                      {svc.price}
                    </span>
                    <Link to={svc.price === 'স্পেশাল প্যাকেজ' ? '/pricing' : `/services/${svc.slug || 'graphic-design'}`} className="svc-arrow" aria-label={`Explore ${svc.title}`}>
                      <ArrowUpRight size={20} />
                    </Link>
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

        /* Sticky left header */
        .svc-header {
          position: sticky;
          top: calc(var(--nav-height, 90px) + 2rem);
        }
        .svc-heading {
          font-family: var(--font-display);
          font-size: clamp(2rem, 3.4vw, 3rem);
          font-weight: 800;
          color: var(--ink);
          letter-spacing: -0.015em;
          line-height: 1.2;
          margin: 0 0 1rem;
        }
        .svc-header .section-sub {
          font-size: 0.95rem;
          color: var(--muted);
          line-height: 1.65;
          margin: 0 0 2rem;
          max-width: 340px;
        }
        .svc-explore-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-family: var(--font-display);
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--brand-red);
          text-decoration: none;
          letter-spacing: -0.01em;
          transition: gap 0.22s, color 0.22s;
        }
        .svc-explore-link:hover {
          gap: 0.65rem;
          color: var(--brand-red-dark);
        }

        /* Numbered row list */
        .svc-list {
          display: flex;
          flex-direction: column;
        }
        .svc-row {
          border-bottom: 1px solid var(--border);
          padding: 1.75rem 0;
          transition: border-color 0.25s, background 0.25s;
          position: relative;
        }
        .svc-row:first-child {
          border-top: 1px solid var(--border);
        }
        .svc-row-inner {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        /* Number */
        .svc-num {
          font-family: var(--font-display);
          font-size: 0.82rem;
          font-weight: 800;
          color: var(--muted);
          letter-spacing: 0.04em;
          width: 28px;
          flex-shrink: 0;
          opacity: 0.55;
        }
        .svc-row.is-hovered .svc-num { color: var(--brand-red); opacity: 1; }

        /* Icon container */
        .svc-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          background: var(--surface-soft);
          color: var(--ink);
          border: 1px solid var(--border);
          flex-shrink: 0;
          transition: background 0.22s, color 0.22s, border-color 0.22s;
        }
        .svc-row.is-hovered .svc-icon {
          background: var(--brand-red);
          border-color: var(--brand-red);
          color: #ffffff;
        }

        /* Title + desc */
        .svc-copy {
          flex: 1;
          min-width: 0;
        }
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
          aspect-ratio: 16 / 9;
          background: var(--surface-muted);
        }
        .svc-preview-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 1.25rem;
          color: #ffffff;
        }
        .svc-preview-details {
          font-size: 0.82rem;
          line-height: 1.45;
          margin: 0 0 0.5rem;
          color: rgba(255,255,255,0.92);
        }
        .svc-preview-deliverables {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
        }
        .svc-preview-deliverables li {
          font-size: 0.72rem;
          padding: 0.2rem 0.6rem;
          background: rgba(255,255,255,0.18);
          border-radius: 100px;
          backdrop-filter: blur(4px);
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .svc-layout {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
          .svc-header {
            position: static;
          }
          .svc-header .section-sub {
            max-width: 100%;
          }
          .svc-row-inner {
            flex-wrap: wrap;
            gap: 1rem;
          }
          .svc-action {
            width: 100%;
            justify-content: space-between;
            padding-left: 0;
            margin-top: 0.5rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Services;
