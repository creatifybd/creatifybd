import React, { useEffect, useState, useMemo } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import GigCard from '../../components/GigCard';
import { gigs, categories } from '../../data/gigs';
import { Search, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';

const EASE_EXPO = [0.16, 1, 0.3, 1];

const GigsCatalogPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [maxDelivery, setMaxDelivery] = useState('any');
  const [budgetRange, setBudgetRange] = useState('any');
  const [frequency, setFrequency] = useState('all');
  const [sortBy, setSortBy] = useState('recommended');
  const [gigOverrides, setGigOverrides] = useState({});

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'gig_overrides'), (snap) => {
      const next = {};
      snap.docs.forEach(item => {
        const data = item.data();
        if (typeof data.active === 'boolean') next[item.id] = data.active;
      });
      setGigOverrides(next);
    }, (err) => {
      console.error('Failed to load gig overrides:', err);
    });
    return () => unsub();
  }, []);

  const filteredGigs = useMemo(() => {
    return gigs
      .filter((gig) => {
        const isActive = gigOverrides[gig.id] ?? (gig.status === 'active');
        if (!isActive) return false;
        const matchesSearch =
          gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          gig.overview.toLowerCase().includes(searchQuery.toLowerCase()) ||
          gig.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCat = selectedCat === 'all' || gig.category === selectedCat;
        const delTime = gig.packages?.basic?.deliveryTime || gig.deliveryTime || 7;
        const matchesDelivery =
          maxDelivery === 'any' ||
          (maxDelivery === '3' && delTime <= 3) ||
          (maxDelivery === '7' && delTime <= 7) ||
          (maxDelivery === '14' && delTime <= 14) ||
          (maxDelivery === '30' && delTime <= 30);
        const price = gig.startingPrice;
        const matchesBudget =
          budgetRange === 'any' ||
          (budgetRange === 'under-100' && price < 100) ||
          (budgetRange === '100-300' && price >= 100 && price <= 300) ||
          (budgetRange === '300-600' && price > 300 && price <= 600) ||
          (budgetRange === 'above-600' && price > 600);
        const isMonthly = gig.category === 'social-media-management' || gig.tags.includes('monthly');
        const matchesFreq =
          frequency === 'all' ||
          (frequency === 'monthly' && isMonthly) ||
          (frequency === 'one-time' && !isMonthly);
        return matchesSearch && matchesCat && matchesDelivery && matchesBudget && matchesFreq;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.startingPrice - b.startingPrice;
        if (sortBy === 'price-high') return b.startingPrice - a.startingPrice;
        if (sortBy === 'delivery-fast') {
          const aDel = a.packages?.basic?.deliveryTime || a.deliveryTime || 7;
          const bDel = b.packages?.basic?.deliveryTime || b.deliveryTime || 7;
          return aDel - bDel;
        }
        return b.rating * b.reviewCount - a.rating * a.reviewCount;
      });
  }, [searchQuery, selectedCat, maxDelivery, budgetRange, frequency, sortBy, gigOverrides]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCat('all');
    setMaxDelivery('any');
    setBudgetRange('any');
    setFrequency('all');
  };

  return (
    <div className="gigs-catalog-page">
      <SEO
        title="Browse Creative Gigs & Packages | CreatifyBD"
        description="Browse professional creative services. Order social media management, logo design, video edits, and custom websites with clear fixed price packages."
        keywords="creatifybd gigs, buy logo design, order video editing, monthly social media manager"
      />

      <Navbar />

      {/* ── Hero ── */}
      <div className="page-header page-header-light">
        <div className="container">
          <motion.div
            className="eyebrow"
            style={{ marginBottom: '1rem' }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE_EXPO, delay: 0 }}
          >
            Fixed-Price Creative Services
          </motion.div>

          <motion.h1
            className="page-title"
            initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.85, ease: EASE_EXPO, delay: 0.08 }}
          >
            Browse Creative <span className="red">Gigs</span>
          </motion.h1>

          <motion.p
            className="page-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE_EXPO, delay: 0.2 }}
          >
            Select transparent, fixed-price services designed to make your brand look premium online.
          </motion.p>
        </div>
      </div>

      <div className="container" style={{ padding: '4rem 1rem' }}>

        {/* Marketplace Info Banner */}
        <motion.div
          className="marketplace-banner"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_EXPO, delay: 0.15 }}
        >
          <div className="banner-inner">
            <Info size={20} className="banner-icon" />
            <div className="banner-text">
              <h5>Global Production Advantage</h5>
              <p>Get international-quality deliverables managed through a professional creative workflow. Prices are in USD, with structured review and approval before order signoff.</p>
            </div>
          </div>
        </motion.div>

        {/* Filter Controls */}
        <motion.div
          className="catalog-controls"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: EASE_EXPO, delay: 0.28 }}
        >
          <div className="search-box-wrap">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search services (e.g. Logo, Reels, Monthly)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filters-row-grid">
            <div className="filter-select-wrap">
              <label htmlFor="cat-filter">Category</label>
              <select id="cat-filter" value={selectedCat} onChange={e => setSelectedCat(e.target.value)}>
                <option value="all">All Categories</option>
                {Object.values(categories).map(cat => (
                  <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="filter-select-wrap">
              <label htmlFor="del-filter">Delivery Time</label>
              <select id="del-filter" value={maxDelivery} onChange={e => setMaxDelivery(e.target.value)}>
                <option value="any">Any Time</option>
                <option value="3">Up to 3 days</option>
                <option value="7">Up to 7 days</option>
                <option value="14">Up to 14 days</option>
                <option value="30">Up to 30 days</option>
              </select>
            </div>

            <div className="filter-select-wrap">
              <label htmlFor="budget-filter">Budget</label>
              <select id="budget-filter" value={budgetRange} onChange={e => setBudgetRange(e.target.value)}>
                <option value="any">Any Price</option>
                <option value="under-100">Under $100 USD</option>
                <option value="100-300">$100 - $300 USD</option>
                <option value="300-600">$300 - $600 USD</option>
                <option value="above-600">$600+ USD</option>
              </select>
            </div>

            <div className="filter-select-wrap">
              <label htmlFor="freq-filter">Billing Style</label>
              <select id="freq-filter" value={frequency} onChange={e => setFrequency(e.target.value)}>
                <option value="all">All Frequencies</option>
                <option value="monthly">Monthly retainer plan</option>
                <option value="one-time">One-time project</option>
              </select>
            </div>

            <div className="filter-select-wrap">
              <label htmlFor="sort-filter">Sort By</label>
              <select id="sort-filter" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="recommended">Best Seller</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="delivery-fast">Delivery Speed</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Active filter count — re-animates on change */}
        <div className="active-filters-summary">
          <span>
            Found{' '}
            <AnimatePresence mode="wait">
              <motion.strong
                key={filteredGigs.length}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.25, ease: EASE_EXPO }}
                style={{ display: 'inline-block' }}
              >
                {filteredGigs.length}
              </motion.strong>
            </AnimatePresence>
            {' '}active gigs
          </span>
        </div>

        {/* Gigs Grid */}
        <div style={{ marginTop: '2rem' }}>
          {filteredGigs.length > 0 ? (
            <div className="catalog-gigs-grid">
              <AnimatePresence mode="popLayout">
                {filteredGigs.map((gig, index) => (
                  <motion.div
                    layout
                    key={gig.id}
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16, transition: { duration: 0.18 } }}
                    transition={{ duration: 0.45, ease: EASE_EXPO, delay: Math.min(index * 0.06, 0.4) }}
                  >
                    <GigCard gig={gig} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div
              className="no-gigs-found"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: EASE_EXPO }}
            >
              <h4>No gigs match your filters</h4>
              <p>Try clearing your keywords or selecting another category.</p>
              <button onClick={resetFilters} className="btn-red">Reset Filters</button>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />

      <style>{`
        .gigs-catalog-page {
          background: var(--surface-soft);
        }

        .marketplace-banner {
          background: var(--brand-red-soft);
          border: 1px solid var(--brand-red);
          border-radius: 12px;
          padding: 1.5rem 2rem;
          margin-bottom: 3rem;
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
        }

        .banner-inner {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .banner-icon {
          color: var(--brand-red);
          flex-shrink: 0;
          margin-top: 0.2rem;
        }

        .banner-text h5 {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--ink);
          margin-bottom: 0.25rem;
        }

        .banner-text p {
          font-size: 0.85rem;
          color: var(--muted);
          line-height: 1.5;
        }

        .catalog-controls {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 2rem;
          box-shadow: var(--shadow-md);
        }

        .search-box-wrap {
          position: relative;
          width: 100%;
        }

        .search-icon {
          position: absolute;
          left: 1.25rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--muted);
        }

        .search-input {
          width: 100%;
          background: var(--surface-soft);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 1rem 1rem 1rem 3.25rem;
          color: var(--ink);
          font-size: 0.95rem;
          outline: none;
          transition: all 0.2s;
        }

        .search-input:focus {
          border-color: var(--brand-red);
          background: var(--surface);
          box-shadow: 0 0 0 4px var(--brand-red-soft);
        }

        .filters-row-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1rem;
        }

        @media (max-width: 968px) {
          .filters-row-grid { grid-template-columns: repeat(3, 1fr); }
        }

        @media (max-width: 600px) {
          .filters-row-grid { grid-template-columns: 1fr; }
        }

        .filter-select-wrap {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .filter-select-wrap label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .filter-select-wrap select {
          background: var(--surface-soft);
          border: 1px solid var(--border);
          color: var(--ink);
          padding: 0.75rem;
          border-radius: 8px;
          outline: none;
          font-weight: 500;
          font-size: 0.85rem;
          cursor: none;
          transition: all 0.2s;
        }

        .filter-select-wrap select:focus {
          border-color: var(--brand-red);
          background: var(--surface);
          box-shadow: 0 0 0 4px var(--brand-red-soft);
        }

        .active-filters-summary {
          max-width: 1200px;
          margin: 1.5rem auto 0;
          color: var(--muted);
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          overflow: hidden;
        }

        .active-filters-summary strong {
          color: var(--ink);
          font-weight: 800;
        }

        .catalog-gigs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .no-gigs-found {
          text-align: center;
          padding: 4rem 2rem;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          max-width: 600px;
          margin: 0 auto;
          box-shadow: var(--shadow-md);
        }

        .no-gigs-found h4 {
          font-size: 1.3rem;
          margin-bottom: 0.5rem;
          color: var(--ink);
        }

        .no-gigs-found p {
          color: var(--muted);
          font-size: 0.9rem;
          margin-bottom: 2rem;
        }
      `}</style>
    </div>
  );
};

export default GigsCatalogPage;
