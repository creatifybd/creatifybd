import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import usePageSEO from '../../hooks/usePageSEO';
import { db } from '../../firebase/config';
import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import { Star, Globe, Quote, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { CLIENT_REVIEWS } from '../../data/clientReviews';

const EASE_EXPO = [0.16, 1, 0.3, 1];
const FALLBACK_REVIEWS = CLIENT_REVIEWS;

const getAvatarUrl = (review) => {
  if (review.avatarUrl) return review.avatarUrl;
  const label = (review.clientName || 'Client')
    .split(/[_\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('') || 'C';
  const palette = [
    ['var(--brand-red-soft)', '#e8192c'],
    ['var(--info-soft)', 'var(--info)'],
    ['var(--success-soft)', 'var(--success-dark)'],
    ['var(--warning-soft)', 'var(--warning)'],
    ['rgba(139,92,246,0.10)', 'rgb(109,53,199)'],
  ];
  const index = (review.clientName || '').split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % palette.length;
  const [bg, fg] = palette[index];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" rx="64" fill="${bg}"/><text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="44" font-weight="800" fill="${fg}">${label}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const StarDisplay = ({ rating }) => (
  <div style={{ display: 'flex', gap: '0.1rem' }}>
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={15}
        fill={i < rating ? 'var(--red)' : 'none'}
        stroke={i < rating ? 'var(--red)' : 'var(--ink-soft)'}
      />
    ))}
  </div>
);

const ReviewCard = ({ review, idx }) => (
  <motion.div
    className="review-card-pub"
    initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.55, ease: EASE_EXPO, delay: (idx % 9) * 0.055 }}
    whileHover={{ y: -4, transition: { duration: 0.28, ease: EASE_EXPO } }}
  >
    <div className="rc-header">
      <div className="rc-avatar">
        <img src={getAvatarUrl(review)} alt={`${review.clientName} profile`} loading="lazy" />
      </div>
      <div className="rc-meta">
        <h5 className="rc-name">{review.clientName}</h5>
        <div className="rc-sub">
          <Globe size={12} />
          <span>{review.country}</span>
          <span className="bullet">·</span>
          <span>Verified order</span>
          {review.repeatClient && <span>Repeat client</span>}
        </div>
      </div>
      <div className="rc-stars">
        <StarDisplay rating={review.rating} />
      </div>
    </div>

    <div className="rc-quote-icon"><Quote size={28} /></div>
    <p className="rc-text">"{review.reviewText}"</p>

    {review.gigTitle && (
      <div className="rc-service-tag">
        <span>Service: {review.gigTitle}</span>
      </div>
    )}
  </motion.div>
);

const ReviewsPage = () => {
  const [reviews, setReviews] = useState(FALLBACK_REVIEWS);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [displayCount, setDisplayCount] = useState(9);

  const countries = [
    'all',
    ...Array.from(new Set(reviews.map(r => r.country).filter(Boolean))).sort((a, b) => {
      const priority = ['USA', 'Canada', 'Australia', 'UK', 'Germany'];
      const aPriority = priority.indexOf(a);
      const bPriority = priority.indexOf(b);
      if (aPriority !== -1 || bPriority !== -1) {
        return (aPriority === -1 ? 99 : aPriority) - (bPriority === -1 ? 99 : bPriority);
      }
      return a.localeCompare(b);
    }),
  ];

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const q = query(
          collection(db, 'reviews'),
          where('status', '==', 'approved'),
          orderBy('createdAt', 'desc'),
          limit(60)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          setReviews(data);
        }
      } catch (err) {
        console.warn('Using fallback reviews:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const filtered = filter === 'all' ? reviews : reviews.filter(r => r.country === filter);
  const displayed = filtered.slice(0, displayCount);

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const fiveStarCount = reviews.filter(r => r.rating === 5).length;

  const stats = [
    { num: avgRating.toFixed(1), label: 'Average Rating', extra: <StarDisplay rating={5} /> },
    { num: `${reviews.length}+`, label: 'Total Reviews' },
    { num: `${Math.round((fiveStarCount / reviews.length) * 100)}%`, label: 'Five-Star Ratings' },
  ];

  const seo = usePageSEO('reviews', {
    title: "Client Reviews \u2014 What It's Actually Like Working With Us | CreatifyBD",
    description: "Real feedback from real clients, pulled straight from our project history \u2014 unedited, including the imperfect ones."
  });

  return (
    <div className="reviews-page-pub">
      <SEO
        title={seo.title}
        description={seo.description}
        keywords="creatifybd reviews, client testimonials, creative agency feedback"
      />

      <Navbar />

      {/* ── Hero ── */}
      <section className="reviews-hero reviews-hero-light">
        <div className="container">
          <motion.div
            className="eyebrow"
            style={{ marginBottom: '1rem', justifyContent: 'center' }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE_EXPO, delay: 0 }}
          >
            Verified by Order History
          </motion.div>

          <motion.h1
            className="page-title"
            initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.85, ease: EASE_EXPO, delay: 0.08 }}
          >
            Verified Client <span className="red">Reviews</span>
          </motion.h1>

          <motion.p
            className="page-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE_EXPO, delay: 0.2 }}
          >
            Real client feedback from completed creative orders, reviewed through our delivery and approval workflow.
          </motion.p>

          {/* Staggered aggregate stats */}
          <div className="reviews-aggregate-stats">
            {stats.map((stat, i) => (
              <React.Fragment key={stat.label}>
                {i > 0 && <div className="agg-divider" />}
                <motion.div
                  className="agg-stat"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE_EXPO, delay: 0.32 + i * 0.1 }}
                >
                  <span className="agg-num">{stat.num}</span>
                  {stat.extra}
                  <span className="agg-lbl">{stat.label}</span>
                </motion.div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── Workflow band ── */}
      <section className="review-workflow-band" aria-label="Verified review workflow">
        <div className="container">
          <div className="review-workflow-row">
            {[
              'Order placed',
              'Delivery reviewed',
              'Feedback submitted',
              'Published after approval',
            ].map((item, index) => (
              <div className="review-workflow-step" key={item}>
                <span>{index + 1}</span>
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reviews grid ── */}
      <section className="reviews-content-section">
        <div className="container">
          <div className="country-filter-tabs">
            {countries.map(c => (
              <motion.button
                key={c}
                type="button"
                data-country={c === 'all' ? 'All Countries' : c}
                className={`filter-tab-btn ${filter === c ? 'active' : ''}`}
                onClick={() => { setFilter(c); setDisplayCount(9); }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                {c === 'all' ? 'All Countries' : `🌏 ${c}`}
              </motion.button>
            ))}
          </div>

          <div className="reviews-masonry-grid">
            {displayed.map((review, idx) => (
              <ReviewCard key={review.id} review={review} idx={idx} />
            ))}
          </div>

          {filtered.length > displayCount && (
            <motion.div
              style={{ textAlign: 'center', marginTop: '3rem' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <button
                type="button"
                className="btn-outline-dark"
                onClick={() => setDisplayCount(prev => prev + 9)}
              >
                <ChevronDown size={18} />
                Load More Reviews
              </button>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />

      <style>{`
        .reviews-hero {
          padding: 8rem 1rem 5rem;
          text-align: center;
          border-bottom: 1px solid var(--border);
        }

        .reviews-aggregate-stats {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 3rem;
          margin-top: 3rem;
          flex-wrap: wrap;
        }

        .agg-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
        }

        .agg-num {
          font-size: 2.5rem;
          font-weight: 900;
          color: var(--ink);
        }

        .agg-lbl {
          font-size: 0.8rem;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .agg-divider {
          width: 1px;
          height: 60px;
          background: var(--border);
        }

        .reviews-content-section {
          padding: 5rem 1rem 6rem;
          background: var(--surface-soft);
        }

        .review-workflow-band {
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          padding: 1.25rem 1rem;
        }

        .review-workflow-row {
          max-width: 980px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 0.75rem;
        }

        .review-workflow-step {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          min-width: 0;
          color: var(--ink);
          font-size: 0.84rem;
          font-weight: 700;
        }

        .review-workflow-step span {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
          background: var(--brand-red-soft);
          color: var(--red);
          border: 1px solid rgba(232,25,44,0.16);
          font-size: 0.75rem;
          font-weight: 900;
        }

        @media (max-width: 720px) {
          .review-workflow-row {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        .country-filter-tabs {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-bottom: 3.5rem;
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
        }

        .filter-tab-btn {
          padding: 0.6rem 1.25rem;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 100px;
          color: var(--muted);
          font-size: 0;
          font-weight: 600;
          cursor: none;
          transition: all 0.2s;
        }

        .filter-tab-btn::after {
          content: attr(data-country);
          font-size: 0.85rem;
        }

        .filter-tab-btn:hover,
        .filter-tab-btn.active {
          background: var(--red);
          border-color: var(--red);
          color: white;
        }

        .reviews-masonry-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .review-card-pub {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          position: relative;
          overflow: hidden;
          transition: border-color 0.25s;
          box-shadow: 0 14px 36px var(--border);
        }

        .review-card-pub:hover {
          border-color: rgba(232, 25, 44, 0.2);
        }

        .rc-header {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .rc-avatar {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: var(--brand-red-soft);
          border: 1px solid rgba(232,25,44,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--red);
          flex-shrink: 0;
          overflow: hidden;
        }

        .rc-avatar img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        .rc-meta {
          flex-grow: 1;
          min-width: 0;
        }

        .rc-name {
          font-size: 1rem;
          color: var(--ink);
          font-weight: 700;
          margin-bottom: 0.2rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .rc-sub {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          color: var(--muted);
          flex-wrap: wrap;
        }

        .rc-sub .bullet {
          display: none;
          color: var(--muted);
        }

        .rc-stars {
          flex-shrink: 0;
        }

        .rc-quote-icon {
          color: rgba(232, 25, 44, 0.15);
        }

        .rc-text {
          color: var(--ink-soft);
          font-size: 0.9rem;
          line-height: 1.6;
          font-style: italic;
          flex-grow: 1;
        }

        .rc-service-tag {
          margin-top: auto;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border);
        }

        .rc-service-tag span {
          font-size: 0.7rem;
          color: var(--red);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .btn-outline-dark {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 2rem;
          background: transparent;
          border: 1.5px solid var(--border);
          color: var(--ink);
          border-radius: 100px;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: none;
          transition: all 0.2s;
        }

        .btn-outline-dark:hover {
          border-color: var(--red);
          color: var(--red);
        }
      `}</style>
    </div>
  );
};

export default ReviewsPage;
