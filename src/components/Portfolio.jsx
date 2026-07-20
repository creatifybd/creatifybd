import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { db } from '../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TextReveal, FadeReveal, StaggerReveal } from './MotionReveal';
import OptimizedImage from './OptimizedImage';
import { ArrowUpRight } from 'lucide-react';
import { CURATED_PORTFOLIO } from '../data/portfolioItems';

const CATS = [
  { key: 'all', label: 'All Work', label_bn: 'সব কাজ' },
  { key: 'graphic', label: 'Graphic Design', label_bn: 'গ্রাফিক ডিজাইন' },
  { key: 'branding', label: 'Branding', label_bn: 'ব্র্যান্ডিং' },
  { key: 'web', label: 'Web Design', label_bn: 'ওয়েব ডিজাইন' },
  { key: 'video', label: 'Video', label_bn: 'ভিডিও' },
];

const CAT_DISPLAY = {
  graphic: 'Graphic Design',
  branding: 'Branding',
  web: 'Web Design',
  video: 'Video',
};

const PORTFOLIO_CATS = [
  { key: 'all', label: 'All Work', label_bn: 'All Work' },
  { key: 'social', label: 'Social Media', label_bn: 'Social Media' },
  { key: 'branding', label: 'Branding', label_bn: 'Branding' },
  { key: 'web', label: 'Web Design', label_bn: 'Web Design' },
  { key: 'video', label: 'Video Editing', label_bn: 'Video Editing' },
  { key: 'graphic', label: 'Graphic Design', label_bn: 'Graphic Design' },
];

const PORTFOLIO_CAT_DISPLAY = {
  social: 'Social Media Management',
  graphic: 'Graphic Design',
  branding: 'Branding & Logo Design',
  web: 'Website Design',
  video: 'Video Editing',
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

  return createPortal((
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pf-lightbox" 
      onClick={(e) => e.target === e.currentTarget && onClose()}
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
        initial={{ scale: 0.94, opacity: 0, y: 28 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.97, opacity: 0, y: 16 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="pf-lb-content"
        data-lenis-prevent
      >
        <div className="pf-lb-visual">
          <OptimizedImage
            src={item.imageUrl || item.image || item.imgUrl || item.img || item.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop'}
            alt={item.title}
            className="pf-lb-img"
            priority={true}
            objectFit="contain"
          />
        </div>
        <div className="pf-lb-meta">
          <span className="pf-lb-kicker">{item.service || PORTFOLIO_CAT_DISPLAY[item.category] || 'Selected work'}</span>
          <h3 className="pf-lb-title">{item.title}</h3>
          {item.description && <p className="pf-lb-desc">{item.description}</p>}
          {(item.service || item.industry) && (
            <div className="pf-lb-details">
              {item.service && <span>{item.service}</span>}
              {item.industry && <span>{item.industry}</span>}
            </div>
          )}
          {Array.isArray(item.tags) && item.tags.length > 0 && (
            <div className="pf-lb-tags">
              {item.tags.slice(0, 4).map(tag => <span key={tag}>{tag}</span>)}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  ), document.body);
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
const WORK_TILE_PATTERNS = ['hero', 'tall', 'wide', 'square', 'wide', 'tall', 'square', 'hero'];

const getWorkImage = (item) => item.imageUrl || item.image || item.imgUrl || item.img || item.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop';

const WorkCard = React.forwardRef(({ item, onClick, priority = 0 }, ref) => {
  const pattern = WORK_TILE_PATTERNS[priority % WORK_TILE_PATTERNS.length];
  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`duck-work-tile duck-work-tile--${pattern}`}
      onClick={() => onClick(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(item)}
      data-cursor="View"
    >
      <div className="duck-work-media">
        <OptimizedImage
          src={getWorkImage(item)}
          alt={item.title}
          className="duck-work-image"
          priority={priority < 6}
          objectFit="contain"
        />
        <div className="duck-work-overlay">
          <div>
            <span>{item.service || PORTFOLIO_CAT_DISPLAY[item.category] || CAT_DISPLAY[item.category] || item.category || 'Creative work'}</span>
            <h3>{item.title}</h3>
            {item.industry && <p>{item.industry}</p>}
          </div>
          <span className="duck-work-arrow"><ArrowUpRight size={22} /></span>
        </div>
      </div>
      <div className="duck-work-mobile-meta">
        <span>{item.service || PORTFOLIO_CAT_DISPLAY[item.category] || CAT_DISPLAY[item.category] || item.category || 'Creative work'}</span>
        <div>
          <h3>{item.title}</h3>
          <span className="duck-work-mobile-arrow" aria-hidden="true"><ArrowUpRight size={19} /></span>
        </div>
      </div>
    </motion.div>
  );
});

WorkCard.displayName = 'WorkCard';

const MarqueeWorkCard = ({ item, onClick, priority = false, duplicate = false }) => (
  <button
    type="button"
    className="portfolio-marquee-card"
    onClick={() => onClick(item)}
    aria-label={duplicate ? undefined : `View ${item.title}`}
    aria-hidden={duplicate ? 'true' : undefined}
    tabIndex={duplicate ? -1 : 0}
  >
    <span className="portfolio-marquee-media">
      <OptimizedImage
        src={getWorkImage(item)}
        alt={duplicate ? '' : item.title}
        className="portfolio-marquee-image"
        priority={priority}
        objectFit="contain"
      />
    </span>
  </button>
);

const PortfolioMarquee = ({ items, onOpen }) => {
  const rowOne = items.filter((_, index) => index % 2 === 0);
  const rowTwo = items.filter((_, index) => index % 2 === 1);

  return (
    <div className="portfolio-marquee" aria-label="Featured creative work">
      {[rowOne, rowTwo].map((row, rowIndex) => (
        <div className={`portfolio-marquee-row portfolio-marquee-row--${rowIndex === 0 ? 'left' : 'right'}`} key={rowIndex}>
          <div className="portfolio-marquee-track">
            {[false, true].map(duplicate => (
              <div
                className="portfolio-marquee-group"
                key={duplicate ? 'duplicate' : 'primary'}
                aria-hidden={duplicate ? 'true' : undefined}
              >
                {row.map((item, itemIndex) => (
                  <MarqueeWorkCard
                    key={`${duplicate ? 'duplicate' : 'primary'}-${item.id}`}
                    item={item}
                    onClick={onOpen}
                    priority={!duplicate && rowIndex === 0 && itemIndex < 3}
                    duplicate={duplicate}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const Portfolio = ({ highlight = false, fullPage = false, theme = 'light' }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxItem, setLightboxItem] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [layoutMode, setLayoutMode] = useState('masonry'); // 'masonry' or 'grid'
  const [visibleCount, setVisibleCount] = useState(12);
  const { lang } = useLanguage();

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'portfolio'),
      (snap) => {
        try {
          const docs = Array.isArray(snap?.docs) ? snap.docs : [];
          const allItems = docs.map(doc => ({ id: doc.id, ...doc.data() }));
          // Sort in JS instead of Firestore query to avoid index requirements
          const sorted = allItems.sort((a, b) => String(a?.title || '').localeCompare(String(b?.title || '')));
          setItems(sorted);
        } catch (err) {
          console.error('Portfolio: failed to process snapshot, keeping curated fallback', err);
          setItems([]);
        } finally {
          setLoading(false);
        }
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, []);

  const curatedIds = new Set(CURATED_PORTFOLIO.map(item => item.id));
  const adminById = new Map(items.map(item => [item.id, item]));
  const syncedCuratedItems = CURATED_PORTFOLIO
    .map(item => {
      const override = adminById.get(item.id);
      return {
        ...item,
        image: override?.imageUrl || override?.image || item.image,
        hidden: override?.hidden !== undefined ? override.hidden : item.hidden,
        featured: override?.featured !== undefined ? override.featured : item.featured || false,
        featuredOrder: override?.featuredOrder !== undefined ? override.featuredOrder : item.featuredOrder || 0
      };
    })
    .filter(item => item.hidden !== true);
  const adminItems = items.filter(item => !curatedIds.has(item.id) && item.hidden !== true);
  const curatedGroups = ['social', 'branding', 'packaging', 'apparel', 'marketing', 'video', 'web']
    .map(category => syncedCuratedItems.filter(item => item.category === category));
  const longestGroup = Math.max(...curatedGroups.map(group => group.length));
  const interleavedCuratedItems = Array.from({ length: longestGroup }, (_, index) =>
    curatedGroups.map(group => group[index]).filter(Boolean)
  ).flat();
  const portfolioItems = [...interleavedCuratedItems, ...adminItems];

  // Filter by featured status when in highlight mode (homepage)
  const featuredItems = portfolioItems
    .filter(item => item.featured === true)
    .sort((a, b) => (a.featuredOrder || 0) - (b.featuredOrder || 0));

  const filteredItems = activeFilter === 'all'
    ? (highlight ? featuredItems : portfolioItems)
    : portfolioItems.filter(i => i.category === activeFilter);

  const displayItems = highlight ? filteredItems.slice(0, 24) : filteredItems.slice(0, visibleCount);
  const hasMoreItems = filteredItems.length > visibleCount && !highlight;

  const availableCats = PORTFOLIO_CATS.filter(c => {
    if (c.key === 'all') return true;
    return portfolioItems.some(i => i.category === c.key);
  });

  const handleFilterChange = (key) => {
    setActiveFilter(key);
    setVisibleCount(12); // Reset pagination on filter change
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 12);
  };
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

  if (loading && CURATED_PORTFOLIO.length === 0 && items.length === 0) {
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
        
        {highlight ? (
          <>
            <div className="wk-inner">
              <div className="wk-header">
                <FadeReveal>
                  <div className="wk-eyebrow"><span className="wk-eyebrow-dot" />{lang === 'bn' ? 'নির্বাচিত প্রজেক্টস' : 'FEATURED PROJECTS'}</div>
                </FadeReveal>
                <TextReveal className="wk-heading">
                  {lang === 'bn' ? (
                    'আমাদের কাজ'
                  ) : (
                    <>Our <span className="text-red">Works</span></>
                  )}
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
                    <div className="wk-stat"><strong><Counter target={11} />+</strong><span>{lang === 'bn' ? 'দেশ' : 'Countries'}</span></div>
                    <div className="wk-stat-div" />
                    <div className="wk-stat"><strong><Counter target={24} />h</strong><span>{lang === 'bn' ? 'প্রতিক্রিয়া সময়' : 'Response Time'}</span></div>
                  </div>
                </FadeReveal>
              </div>
            </div>
            <PortfolioMarquee items={displayItems} onOpen={openLightbox} />
            <div className="wk-inner">
              <FadeReveal delay={0.4}>
                <div className="wk-footer" style={{ marginTop: '4rem', textAlign: 'center' }}>
                  <Link to="/portfolio" className="btn-red">{lang === 'bn' ? 'সব কাজ দেখুন →' : 'See All Our Works →'}</Link>
                </div>
              </FadeReveal>
            </div>
          </>
        ) : (
          <div className="wk-inner">
            {fullPage && (
              <div className="agency-work-page-header">
                <div>
                  <FadeReveal>
                    <div className="wk-eyebrow"><span className="wk-eyebrow-dot" />Selected work</div>
                  </FadeReveal>
                  <TextReveal className="wk-heading">
                    CreatifyBD Portfolio
                  </TextReveal>
                  <FadeReveal delay={0.2}>
                    <p>
                      Visual work, brand systems, campaigns, videos, and web experiences built for ambitious brands.
                    </p>
                  </FadeReveal>
                </div>
                <FadeReveal delay={0.35}>
                  <div className="agency-work-page-stats">
                    <div><strong><Counter target={portfolioItems.length} />+</strong><span>Projects</span></div>
                    <div><strong><Counter target={11} />+</strong><span>Countries</span></div>
                    <div><strong><Counter target={24} />h</strong><span>Response Time</span></div>
                  </div>
                </FadeReveal>
              </div>
            )}
            {!fullPage && (
              <div className="wk-header">
                <FadeReveal>
                  <div className="wk-eyebrow"><span className="wk-eyebrow-dot" />{lang === 'bn' ? 'নির্বাচিত প্রজেক্টস' : 'FEATURED PROJECTS'}</div>
                </FadeReveal>
                <TextReveal className="wk-heading">
                  {lang === 'bn' ? (
                    'আমাদের কাজ'
                  ) : (
                    <>Our <span className="text-red">Works</span></>
                  )}
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
                    <div className="wk-stat"><strong><Counter target={11} />+</strong><span>{lang === 'bn' ? 'দেশ' : 'Countries'}</span></div>
                    <div className="wk-stat-div" />
                    <div className="wk-stat"><strong><Counter target={24} />h</strong><span>{lang === 'bn' ? 'প্রতিক্রিয়া সময়' : 'Response Time'}</span></div>
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
                  {fullPage && (
                    <button
                      className="wk-layout-toggle"
                      onClick={() => setLayoutMode(layoutMode === 'masonry' ? 'grid' : 'masonry')}
                      title={layoutMode === 'masonry' ? 'Switch to Grid' : 'Switch to Masonry'}
                    >
                      {layoutMode === 'masonry' ? 'Grid' : 'Masonry'}
                    </button>
                  )}
                </div>
              </FadeReveal>
            )}

            <div className="duck-work-gallery-wrap">
              <StaggerReveal>
                <motion.div layout className={`duck-work-gallery duck-work-gallery--${layoutMode}`}>
                  <AnimatePresence mode="popLayout">
                    {displayItems.map((item, index) => (
                      <WorkCard 
                        key={item.id} 
                        item={item} 
                        onClick={openLightbox} 
                        priority={index}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              </StaggerReveal>
              {hasMoreItems && (
                <FadeReveal delay={0.3}>
                  <div className="wk-load-more">
                    <button onClick={handleLoadMore} className="btn-outline-white">
                      Load More Projects ({filteredItems.length - visibleCount} remaining)
                    </button>
                  </div>
                </FadeReveal>
              )}
            </div>
          </div>
        )}
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
