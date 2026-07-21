import React, { useEffect, useMemo, useState } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { FadeReveal, StaggerReveal } from './MotionReveal';

const fallbackPricing = {
  social: [
    { id: 's1', tier: 'Starter', price: '299', desc: 'For one active channel', features: ['12 custom posts', 'Captions and hashtags', 'Monthly content calendar', 'Basic profile optimization'] },
    { id: 's2', tier: 'Growth', price: '499', desc: 'Most popular for growing teams', features: ['20 posts and stories', '2 platform management', 'Reels direction and templates', 'Monthly performance report'], featured: true },
    { id: 's3', tier: 'Scale', price: '799', desc: 'Full social presence support', features: ['30 posts plus 5 reels', '3 platform management', 'Dedicated content manager', 'Bi-weekly strategy check-in'] }
  ],
  branding: [
    { id: 'b1', tier: 'Logo Starter', price: '99', desc: 'Clean logo foundation', features: ['2 logo concepts', 'PNG and JPEG exports', 'Color variations'] },
    { id: 'b2', tier: 'Brand Kit', price: '249', desc: 'Identity for new businesses', features: ['Logo refinement', 'Color and type system', 'Social media starter kit'], featured: true },
    { id: 'b3', tier: 'Brand System', price: '499', desc: 'Complete visual identity', features: ['Full brand guide', 'Stationery assets', 'Campaign templates'] }
  ],
  video: [
    { id: 'v1', tier: 'Short Edit', price: '60', desc: 'Fast short-form video', features: ['Up to 30 seconds', 'Captions and sound sync', 'Platform-ready export'] },
    { id: 'v2', tier: 'Promo Edit', price: '150', desc: 'Product or service promotion', features: ['Script support', 'Motion titles', 'Stock footage integration'], featured: true },
    { id: 'v3', tier: 'Campaign Pack', price: '399', desc: 'Multiple ad/video assets', features: ['3 video variations', 'Hook testing versions', 'Multi-format exports'] }
  ],
  web: [
    { id: 'w1', tier: 'Landing Page', price: '249', desc: 'Single campaign page', features: ['Responsive design', 'Lead capture form', 'Basic SEO setup'] },
    { id: 'w2', tier: 'Business Site', price: '899', desc: 'Complete brand website', features: ['Up to 6 pages', 'Custom UI/UX', 'Inquiry database setup'], featured: true },
    { id: 'w3', tier: 'Growth Platform', price: '1499', desc: 'Advanced web presence', features: ['Up to 12 pages', 'CMS or admin workflow', 'Speed and SEO optimization'] }
  ]
};

const tabLabels = {
  social: 'Social Media',
  branding: 'Graphic Design',
  video: 'Video Editing',
  web: 'Website Design'
};

const serviceGroups = {
  retainers: {
    label: 'Monthly Retainers',
    description: 'Ongoing creative support with predictable monthly pricing',
    categories: ['social']
  },
  projectBased: {
    label: 'Project-Based Services',
    description: 'One-time deliverables with clear scope and fixed quote',
    categories: ['branding', 'video', 'web']
  }
};

const Pricing = ({ highlight = false, fullPage = false }) => {
  const [pricingData, setPricingData] = useState({ social: [], branding: [], web: [], video: [] });
  const [activeTab, setActiveTab] = useState(fullPage ? 'social' : 'social');
  const [billing, setBilling] = useState('monthly');

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'pricing'),
      (snap) => {
        try {
          const data = { social: [], branding: [], web: [], video: [] };
          const docs = Array.isArray(snap?.docs) ? snap.docs : [];
          docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(item => item?.hidden !== true)
            .sort((a, b) => (Number(a?.order) || 0) - (Number(b?.order) || 0))
            .forEach(item => {
              if (item?.category && data[item.category]) data[item.category].push(item);
            });
          setPricingData(data);
        } catch (err) {
          console.error('Pricing: failed to process snapshot, using empty defaults', err);
          setPricingData({ social: [], branding: [], web: [], video: [] });
        }
      },
      () => setPricingData({ social: [], branding: [], web: [], video: [] })
    );
    return () => unsub();
  }, []);

  const displayPlans = useMemo(() => {
    const remotePlans = pricingData[activeTab] || [];
    const source = remotePlans.length > 0 ? remotePlans : fallbackPricing[activeTab];
    const plans = highlight ? source.slice(0, 3) : source;
    // Apply yearly discount (20% off) to monthly prices
    if (billing === 'yearly') {
      return plans.map(p => ({
        ...p,
        _displayPrice: p.price && !isNaN(p.price) ? Math.round(Number(p.price) * 0.8) : p.price,
        _yearly: true,
      }));
    }
    return plans.map(p => ({ ...p, _displayPrice: p.price }));
  }, [activeTab, highlight, pricingData, billing]);

  return (
    <section className={`section pricing-section ${fullPage ? 'full-page-section' : ''}`} id="pricing">
      <div className="container">
        {!fullPage && (
          <div className="pricing-header text-center">
            <FadeReveal>
              <div className="eyebrow">Pricing</div>
            </FadeReveal>
            <h2 className="section-h">Premium agency execution without the markup</h2>
            <p className="section-sub">Value-driven pricing with transparent packages. Get enterprise quality for growing businesses. Cancel or pause anytime.</p>
          </div>
        )}

        <FadeReveal delay={0.15}>
          <div className="pricing-billing-toggle">
            <button
              className={`pbt-btn ${billing === 'monthly' ? 'active' : ''}`}
              onClick={() => setBilling('monthly')}
            >Monthly</button>
            <button
              className={`pbt-btn ${billing === 'yearly' ? 'active' : ''}`}
              onClick={() => setBilling('yearly')}
            >
              Yearly
              <span className="pbt-save">Save 20%</span>
            </button>
          </div>
        </FadeReveal>

        <FadeReveal delay={0.2}>
          <div className="pricing-tabs">
            {Object.entries(serviceGroups).map(([groupKey, group]) => (
              <div key={groupKey} className="pricing-tab-group">
                <div className="pricing-group-header">
                  <h3 className="pricing-group-title">{group.label}</h3>
                  <p className="pricing-group-desc">{group.description}</p>
                </div>
                <div className="pricing-tab-buttons">
                  {group.categories.map(catKey => (
                    <button 
                      key={catKey} 
                      className={`ptab ${activeTab === catKey ? 'active' : ''}`} 
                      onClick={() => setActiveTab(catKey)}
                    >
                      {tabLabels[catKey]}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </FadeReveal>

        <StaggerReveal delay={0.3} className="pricing-grid active">
          {displayPlans.map((plan) => (
            <FadeReveal key={plan.id || plan.tier}>
              <article className={`price-card ${plan.featured ? 'featured' : ''}`}>
                {plan.featured && activeTab === 'web' && <div className="popular-badge">Most Popular</div>}
                <div className="price-tier">{plan.tier}</div>
                <div className="price-amount">
                  <span className="currency">$</span>{plan._displayPrice}
                  {plan._yearly && !isNaN(plan.price) && (
                    <span className="price-original">${plan.price}</span>
                  )}
                </div>
                <div className="price-desc">{plan.desc}</div>
                <div className="price-divider" />
                <ul className="price-features">
                  {plan.features?.map((feat) => <li key={feat}>{feat}</li>)}
                </ul>
                <Link to="/contact" className="btn-red price-cta">Get Started -&gt;</Link>
              </article>
            </FadeReveal>
          ))}
        </StaggerReveal>

        {highlight && (
          <FadeReveal delay={0.4}>
            <div className="section-action">
              <Link to="/pricing" className="btn-outline-red">View All Pricing Plans</Link>
            </div>
          </FadeReveal>
        )}
      </div>
      
      <style>{`
        .pricing-tab-group {
          margin-bottom: 2rem;
        }
        .pricing-group-header {
          margin-bottom: 1rem;
        }
        .pricing-group-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--ink);
          margin: 0 0 0.35rem 0;
          letter-spacing: -0.02em;
        }
        .pricing-group-desc {
          font-size: 0.85rem;
          color: var(--muted);
          margin: 0;
          line-height: 1.5;
        }
        .pricing-tab-buttons {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .pricing-tabs {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        @media (max-width: 768px) {
          .pricing-tab-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </section>
  );
};

export default Pricing;
