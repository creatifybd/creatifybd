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


const PORTFOLIO_CATS = [
  { key: 'all',       label: 'সব প্রজেক্ট',         label_bn: 'সব প্রজেক্ট' },
  { key: 'social',    label: 'সোশ্যাল মিডিয়া',       label_bn: 'সোশ্যাল মিডিয়া' },
  { key: 'branding',  label: 'ব্র্যান্ডিং ও লোগো',   label_bn: 'ব্র্যান্ডিং ও লোগো' },
  { key: 'packaging', label: 'প্রোডাক্ট প্যাকেজিং',  label_bn: 'প্রোডাক্ট প্যাকেজিং' },
  { key: 'video',     label: 'ভিডিও ও রিলস',        label_bn: 'ভিডিও ও রিলস' },
  { key: 'web',       label: 'ওয়েবসাইট ডিজাইন',     label_bn: 'ওয়েবসাইট ডিজাইন' },
  { key: 'apparel',   label: 'টি-শার্ট ও মার্চেন্ডাইজ', label_bn: 'টি-শার্ট ও মার্চেন্ডাইজ' },
  { key: 'marketing', label: 'ডিজিটাল মার্কেটিং',    label_bn: 'ডিজিটাল মার্কেটিং' },
  { key: 'graphic',   label: 'গ্রাফিক ডিজাইন',       label_bn: 'গ্রাফিক ডিজাইন' },
];

const PORTFOLIO_CAT_DISPLAY = {
  social: 'সোশ্যাল মিডিয়া ম্যানেজমেন্ট',
  graphic: 'গ্রাফিক ডিজাইন',
  branding: 'ব্র্যান্ডিং ও লোগো ডিজাইন',
  packaging: 'প্রোডাক্ট প্যাকেজিং ডিজাইন',
  web: 'ওয়েবসাইট ডিজাইন',
  video: 'ভিডিও এডিটিং ও রিলস',
  apparel: 'টি-শার্ট ও মার্চেন্ডাইজ',
  marketing: 'ডিজিটাল মার্কেটিং'
};

const FALLBACK_WORK = [
  {
    id: 'logo-branding-01',
    title: 'প্রফেশনাল লোগো ও ব্র্যান্ড আইডেন্টিটি',
    category: 'branding',
    image: '/assets/portfolio/logo-design-branding/logo-design-branding-01.jpg'
  },
  {
    id: 'social-media-01',
    title: 'সোশ্যাল মিডিয়া কন্টেন্ট ম্যানেজমেন্ট',
    category: 'social',
    image: '/assets/portfolio/social-media-management/social-media-management-01.jpg'
  },
  {
    id: 'product-packaging-01',
    title: 'প্রোডাক্ট প্যাকেজিং ডিজাইন',
    category: 'packaging',
    image: '/assets/portfolio/product-packaging-design/product-packaging-design-01.jpg'
  },
  {
    id: 'logo-branding-03',
    title: 'কর্পোরেট ব্র্যান্ড আইডেন্টিটি',
    category: 'branding',
    image: '/assets/portfolio/logo-design-branding/logo-design-branding-03.jpg'
  },
  {
    id: 'website-design-01',
    title: 'মডার্ন বিজনেস ওয়েবসাইট',
    category: 'web',
    image: '/assets/portfolio/website-design/website-design-01.jpg'
  },
  {
    id: 'social-media-02',
    title: 'ব্র্যান্ড সোশ্যাল মিডিয়া পোস্ট',
    category: 'social',
    image: '/assets/portfolio/social-media-management/social-media-management-02.jpg'
  },
  {
    id: 'logo-branding-05',
    title: 'মিনিমাল লোগো ডিজাইন',
    category: 'branding',
    image: '/assets/portfolio/logo-design-branding/logo-design-branding-05.jpg'
  },
  {
    id: 'product-packaging-02',
    title: 'প্রিমিয়াম প্যাকেজিং ডিজাইন',
    category: 'packaging',
    image: '/assets/portfolio/product-packaging-design/product-packaging-design-02.jpg'
  },
  {
    id: 'digital-marketing-01',
    title: 'ডিজিটাল মার্কেটিং ক্রিয়েটিভ',
    category: 'marketing',
    image: '/assets/portfolio/digital-marketing/digital-marketing-01.jpg'
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
  // Featured items (marked in admin dashboard) come first, sorted by featuredOrder
  const featuredItems = [...interleavedCuratedItems, ...adminItems]
    .filter(item => item.featured === true)
    .sort((a, b) => (a.featuredOrder || 0) - (b.featuredOrder || 0));
  const nonFeaturedItems = [...interleavedCuratedItems, ...adminItems]
    .filter(item => item.featured !== true);
  // All items: featured first, then the rest
  const portfolioItems = (featuredItems.length > 0 || nonFeaturedItems.length > 0)
    ? [...featuredItems, ...nonFeaturedItems]
    : (CURATED_PORTFOLIO.length > 0 ? CURATED_PORTFOLIO : FALLBACK_WORK);

  const displaySource = featuredItems.length > 0 ? featuredItems : portfolioItems;

  const filteredItems = activeFilter === 'all'
    ? (highlight ? displaySource : portfolioItems)
    : portfolioItems.filter(i => i.category === activeFilter);

  // Show all items — no pagination
  const displayItems = highlight ? filteredItems.slice(0, 24) : filteredItems;

  const availableCats = PORTFOLIO_CATS.filter(c => {
    if (c.key === 'all') return true;
    return portfolioItems.some(i => i.category === c.key);
  });

  const handleFilterChange = (key) => {
    setActiveFilter(key);
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
                <TextReveal className="wk-heading">
                  {lang === 'bn' ? (
                    <>আমাদের <span className="text-red">সফল প্রজেক্টগুলো</span></>
                  ) : (
                    <>Our <span className="text-red">Works</span></>
                  )}
                </TextReveal>
                <FadeReveal delay={0.2}>
                  <p className="wk-header-copy">
                    {lang === 'bn'
                      ? 'ব্র্যান্ডিং, সোশ্যাল মিডিয়া গ্রোথ, ভিডিও ও রিলস এডিটিং এবং কনভার্সন-ফোকাসড ওয়েবসাইট—বাংলাদেশের বিভিন্ন ব্র্যান্ডের জন্য আমাদের তৈরি কাজের এক ঝলক।'
                      : 'Social content, campaign design, brand systems, video edits, and websites presented as one continuous creative wall.'}
                  </p>
                </FadeReveal>
                <FadeReveal delay={0.4}>
                  <div className="wk-stats-row">
                    <div className="wk-stat"><strong><Counter target={portfolioItems.length || 50} />+</strong><span>{lang === 'bn' ? 'সফল প্রজেক্ট' : 'Projects'}</span></div>
                    <div className="wk-stat-div" />
                    <div className="wk-stat"><strong><Counter target={350} />+</strong><span>{lang === 'bn' ? 'সন্তুষ্ট ক্লায়েন্ট' : 'Happy Clients'}</span></div>
                    <div className="wk-stat-div" />
                    <div className="wk-stat"><strong><Counter target={24} />h</strong><span>{lang === 'bn' ? 'সাপোর্ট ও রেসপন্স' : 'Response Time'}</span></div>
                  </div>
                </FadeReveal>
              </div>
            </div>
            <PortfolioMarquee items={displayItems} onOpen={openLightbox} />
            <div className="wk-inner">
              <FadeReveal delay={0.4}>
                <div className="wk-footer" style={{ marginTop: '4rem', textAlign: 'center' }}>
                  <Link to="/portfolio" className="btn-red">{lang === 'bn' ? 'সব কাজ একসাথে দেখুন →' : 'See All Our Works →'}</Link>
                </div>
              </FadeReveal>
            </div>
          </>
        ) : (
          <div className="wk-inner">
            {fullPage && (
              <div className="agency-work-page-header">
                <div>
                  <TextReveal className="wk-heading">
                    {lang === 'bn' ? (
                      <>আমাদের <span className="text-red">পোর্টফোলিও</span></>
                    ) : (
                      <>CreatifyBD <span className="text-red">Portfolio</span></>
                    )}
                  </TextReveal>
                  <FadeReveal delay={0.2}>
                    <p>
                      {lang === 'bn'
                        ? 'প্রতিটি ডিজাইন ও ভিডিওর পেছনে থাকে সুনির্দিষ্ট ব্র্যান্ড স্ট্র্যাটেজি। দেখুন আমাদের তৈরি কিছু সেরা কাজ।'
                        : 'Visual work, brand systems, campaigns, videos, and web experiences built for ambitious brands.'}
                    </p>
                  </FadeReveal>
                </div>
                <FadeReveal delay={0.35}>
                  <div className="agency-work-page-stats">
                    <div><strong><Counter target={portfolioItems.length || 50} />+</strong><span>{lang === 'bn' ? 'সফল প্রজেক্ট' : 'Projects'}</span></div>
                    <div><strong><Counter target={350} />+</strong><span>{lang === 'bn' ? 'সন্তুষ্ট ক্লায়েন্ট' : 'Happy Clients'}</span></div>
                    <div><strong><Counter target={24} />h</strong><span>{lang === 'bn' ? 'সাপোর্ট ও রেসপন্স' : 'Response Time'}</span></div>
                  </div>
                </FadeReveal>
              </div>
            )}
            {!fullPage && (
              <div className="wk-header">
                <TextReveal className="wk-heading">
                  {lang === 'bn' ? (
                    <>আমাদের <span className="text-red">সফল প্রজেক্টগুলো</span></>
                  ) : (
                    <>Our <span className="text-red">Works</span></>
                  )}
                </TextReveal>
                <FadeReveal delay={0.2}>
                  <p className="wk-header-copy">
                    {lang === 'bn'
                      ? 'ব্র্যান্ডিং, সোশ্যাল মিডিয়া গ্রোথ, ভিডিও ও রিলস এডিটিং এবং কনভার্সন-ফোকাসড ওয়েবসাইট—বাংলাদেশের বিভিন্ন ব্র্যান্ডের জন্য আমাদের তৈরি কাজের এক ঝলক।'
                      : 'Social content, campaign design, brand systems, video edits, and websites presented as one continuous creative wall.'}
                  </p>
                </FadeReveal>
                <FadeReveal delay={0.4}>
                  <div className="wk-stats-row">
                    <div className="wk-stat"><strong><Counter target={portfolioItems.length || 50} />+</strong><span>{lang === 'bn' ? 'সফল প্রজেক্ট' : 'Projects'}</span></div>
                    <div className="wk-stat-div" />
                    <div className="wk-stat"><strong><Counter target={350} />+</strong><span>{lang === 'bn' ? 'সন্তুষ্ট ক্লায়েন্ট' : 'Happy Clients'}</span></div>
                    <div className="wk-stat-div" />
                    <div className="wk-stat"><strong><Counter target={24} />h</strong><span>{lang === 'bn' ? 'সাপোর্ট ও রেসপন্স' : 'Response Time'}</span></div>
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
                      {layoutMode === 'masonry' ? (lang === 'bn' ? 'গ্রিড ভিউ' : 'Grid') : (lang === 'bn' ? 'ম্যাসনরি ভিউ' : 'Masonry')}
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
