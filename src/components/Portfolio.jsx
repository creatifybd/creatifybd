import React, { useState, useEffect, useRef, useCallback } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TextReveal, FadeReveal, StaggerReveal } from './MotionReveal';
import OptimizedImage from './OptimizedImage';
import { ArrowUpRight } from 'lucide-react';

const CATS = [
  { key: 'all', label: 'All Work', label_bn: 'সব কাজ' },
  { key: 'graphic', label: 'Graphic Design', label_bn: 'গ্রাফিক ডিজাইন' },
  { key: 'branding', label: 'Branding', label_bn: 'ব্র্যান্ডিং' },
  { key: 'web', label: 'Web Design', label_bn: 'ওয়েব ডিজাইন' },
  { key: 'video', label: 'Video', label_bn: 'ভিডিও' },
  { key: 'ai', label: 'AI Art', label_bn: 'এআই আর্ট' },
];

const CAT_DISPLAY = {
  graphic: 'Graphic Design',
  branding: 'Branding',
  web: 'Web Design',
  video: 'Video',
  ai: 'AI Art',
};

const FALLBACK_WORK = [
  {
    id: 'local-service-social-growth',
    title: 'Local Service Brand Content System',
    category: 'graphic',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1400&auto=format&fit=crop'
  },
  {
    id: 'restaurant-reel-campaign',
    title: 'Restaurant Reels and Launch Creatives',
    category: 'video',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1400&auto=format&fit=crop'
  },
  {
    id: 'clinic-website-redesign',
    title: 'Clinic Website Redesign',
    category: 'web',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1400&auto=format&fit=crop'
  },
  {
    id: 'fitness-brand-identity',
    title: 'Fitness Studio Brand Identity',
    category: 'branding',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1400&auto=format&fit=crop'
  },
  {
    id: 'home-service-ad-pack',
    title: 'Home Service Ad Creative Pack',
    category: 'graphic',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1400&auto=format&fit=crop'
  },
  {
    id: 'saas-landing-page',
    title: 'SaaS Landing Page Visual Direction',
    category: 'web',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1400&auto=format&fit=crop'
  }
];

// ── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ item, onClose, onPrev, onNext, hasPrev, hasNext }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [hasPrev, hasNext, onClose, onPrev, onNext]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pf-lightbox" 
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', background: 'rgba(0,0,0,0.85)' }}
    >
      <button className="pf-lb-close" onClick={onClose} aria-label="Close">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      {hasPrev && (
        <button className="pf-lb-nav pf-lb-prev" onClick={onPrev} aria-label="Previous">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
      )}
      {hasNext && (
        <button className="pf-lb-nav pf-lb-next" onClick={onNext} aria-label="Next">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      )}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="pf-lb-content"
      >
        <OptimizedImage 
          src={item.imageUrl || item.image || item.imgUrl || item.img || item.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop'} 
          alt={item.title} 
          className="pf-lb-img" 
          priority={true}
        />
        <div className="pf-lb-meta">
          <h3 className="pf-lb-title" style={{ fontSize: '2rem', fontWeight: 800 }}>{item.title}</h3>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Animated Number Counter ───────────────────────────────────────────────────
function Counter({ target, duration = 1200 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = Date.now();
        const tick = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.round(eased * target));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count}</span>;
}

// ── Helper for Masonry Spans ────────────────────────────────────────────────
// ── Work Card ─────────────────────────────────────────────────────────────────
const WorkCard = React.forwardRef(({ item, onClick, priority = 0 }, ref) => {
  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 40, skewY: 2 }}
      whileInView={{ opacity: 1, y: 0, skewY: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="duck-work-tile"
      onClick={() => onClick(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(item)}
      data-cursor="View"
    >
      <div className="duck-work-media">
        <OptimizedImage
          src={item.imageUrl || item.image || item.imgUrl || item.img || item.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop'}
          alt={item.title}
          className="duck-work-image"
          priority={priority < 6}
        />
        <div className="duck-work-overlay">
          <div>
            <span>{CAT_DISPLAY[item.category] || item.category || 'Creative work'}</span>
            <h3>{item.title}</h3>
          </div>
          <span className="duck-work-arrow"><ArrowUpRight size={22} /></span>
        </div>
      </div>
    </motion.div>
  );
});

WorkCard.displayName = 'WorkCard';

// ── Main Component ────────────────────────────────────────────────────────────
const Portfolio = ({ highlight = false, fullPage = false, theme = 'light' }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxItem, setLightboxItem] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const { lang } = useLanguage();

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'portfolio'), (snap) => {
      const allItems = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort in JS instead of Firestore query to avoid index requirements
      const sorted = allItems.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      setItems(sorted.filter(item => item.hidden !== true));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const portfolioItems = items.length > 0 ? items : FALLBACK_WORK;

  const filteredItems = activeFilter === 'all'
    ? portfolioItems
    : portfolioItems.filter(i => i.category === activeFilter);

  const displayItems = highlight ? filteredItems.slice(0, 6) : filteredItems;

  const availableCats = CATS.filter(c => {
    if (c.key === 'all') return true;
    return portfolioItems.some(i => i.category === c.key);
  });

  const handleFilterChange = (key) => setActiveFilter(key);
  const openLightbox = useCallback((item) => {
    const idx = displayItems.findIndex(i => i.id === item.id);
    setLightboxItem(item);
    setLightboxIndex(idx);
  }, [displayItems]);
  const closeLightbox = useCallback(() => { setLightboxItem(null); setLightboxIndex(null); }, []);
  const goPrev = useCallback(() => {
    const newIdx = lightboxIndex - 1;
    if (newIdx >= 0) { setLightboxItem(displayItems[newIdx]); setLightboxIndex(newIdx); }
  }, [lightboxIndex, displayItems]);
  const goNext = useCallback(() => {
    const newIdx = lightboxIndex + 1;
    if (newIdx < displayItems.length) { setLightboxItem(displayItems[newIdx]); setLightboxIndex(newIdx); }
  }, [lightboxIndex, displayItems]);

  if (loading && items.length === 0) {
    return (
      <section className="wk-section" id="portfolio">
        <div className="wk-loading"><div className="wk-loading-dots"><span/><span/><span/></div></div>
      </section>
    );
  }

  return (
    <>
      <section className={`wk-section agency-work-section ${fullPage ? 'full-page-section agency-work-page' : ''}`} id="portfolio">

        {!fullPage && <div className="wk-grain" aria-hidden="true" />}
        <div className="wk-inner">
          {fullPage && (
            <div className="agency-work-page-header">
              <div>
                <FadeReveal>
                  <div className="wk-eyebrow"><span className="wk-eyebrow-dot" />Selected work</div>
                </FadeReveal>
                <TextReveal className="wk-heading">
                  Work made to be seen, remembered, and acted on.
                </TextReveal>
                <FadeReveal delay={0.2}>
                  <p>
                    Social content, campaigns, brand identities, videos, and websites created for ambitious small businesses.
                  </p>
                </FadeReveal>
              </div>
              <FadeReveal delay={0.35}>
                <div className="agency-work-page-stats">
                  <div><strong><Counter target={portfolioItems.length} />+</strong><span>Projects</span></div>
                  <div><strong><Counter target={50} />+</strong><span>Clients</span></div>
                  <div><strong><Counter target={5} /></strong><span>Years</span></div>
                </div>
              </FadeReveal>
            </div>
          )}
          {!fullPage && (
            <div className="wk-header">
              <FadeReveal>
                <div className="wk-eyebrow"><span className="wk-eyebrow-dot" />{lang === 'bn' ? 'আমাদের কাজ' : 'Our Work'}</div>
              </FadeReveal>
              <TextReveal className="wk-heading">
                {lang === 'bn' ? 'সৃজনশীলতা যেখানে ফলাফল আনে' : 'Creativity that drives results'}
              </TextReveal>
              <FadeReveal delay={0.2}>
                <p className="wk-header-copy">
                  Social content, campaign design, brand systems, video edits, and websites presented as one continuous creative wall.
                </p>
              </FadeReveal>
              <FadeReveal delay={0.4}>
                <div className="wk-stats-row">
                  <div className="wk-stat"><strong><Counter target={portfolioItems.length} />+</strong><span>{lang === 'bn' ? 'প্রজেক্ট' : 'Projects'}</span></div>
                  <div className="wk-stat-div" />
                  <div className="wk-stat"><strong><Counter target={50} />+</strong><span>{lang === 'bn' ? 'সন্তুষ্ট ক্লায়েন্ট' : 'Happy Clients'}</span></div>
                  <div className="wk-stat-div" />
                  <div className="wk-stat"><strong><Counter target={5} /></strong><span>{lang === 'bn' ? 'বছরের অভিজ্ঞতা' : 'Years Experience'}</span></div>
                </div>
              </FadeReveal>
            </div>
          )}

          {!highlight && (
            <FadeReveal delay={0.2}>
              <div className="wk-filter-bar" role="tablist">
                {availableCats.map(cat => (
                  <button
                    key={cat.key}
                    role="tab"
                    aria-selected={activeFilter === cat.key}
                    className={`wk-filter-btn${activeFilter === cat.key ? ' wk-filter-btn--active' : ''}`}
                    onClick={() => handleFilterChange(cat.key)}
                  >
                    {lang === 'bn' ? cat.label_bn : cat.label}
                    {activeFilter === cat.key && (
                      <motion.span layoutId="filter-count" className="wk-filter-count">
                        {cat.key === 'all' ? portfolioItems.length : portfolioItems.filter(i => i.category === cat.key).length}
                      </motion.span>
                    )}
                  </button>
                ))}
              </div>
            </FadeReveal>
          )}

          <div className="duck-work-gallery-wrap">
            <StaggerReveal>
              <motion.div layout className="duck-work-gallery">
                <AnimatePresence mode="popLayout">
                  {displayItems.map((item, index) => (
                    <WorkCard key={item.id} item={item} onClick={openLightbox} priority={index} />
                  ))}
                </AnimatePresence>
              </motion.div>
            </StaggerReveal>
          </div>

          {highlight && (
            <FadeReveal delay={0.4}>
              <div className="wk-footer" style={{ marginTop: '4rem', textAlign: 'center' }}>
                <Link to="/portfolio" className="btn-red">{lang === 'bn' ? 'সব কাজ দেখুন →' : 'View Full Portfolio →'}</Link>
              </div>
            </FadeReveal>
          )}
        </div>
      </section>

      <AnimatePresence>
        {lightboxItem && (
          <Lightbox
            item={lightboxItem}
            onClose={closeLightbox}
            onPrev={goPrev}
            onNext={goNext}
            hasPrev={lightboxIndex > 0}
            hasNext={lightboxIndex < displayItems.length - 1}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Portfolio;
