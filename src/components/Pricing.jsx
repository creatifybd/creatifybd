import React, { useEffect, useMemo, useState } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { FadeReveal, StaggerReveal } from './MotionReveal';
import { BarChart2, Palette, Video, Globe2, ArrowRight, Check, Star } from 'lucide-react';

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

const tabConfig = [
  { key: 'social',    label: 'Social Media',    Icon: BarChart2, color: '#3B82F6' },
  { key: 'branding',  label: 'Graphic Design',  Icon: Palette,   color: '#8B5CF6' },
  { key: 'video',     label: 'Video Editing',   Icon: Video,     color: '#EC4899' },
  { key: 'web',       label: 'Website Design',  Icon: Globe2,    color: '#10B981' },
];

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
  const [activeTab, setActiveTab] = useState('social');
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
    if (billing === 'yearly') {
      return plans.map(p => ({
        ...p,
        _displayPrice: p.price && !isNaN(p.price) ? Math.round(Number(p.price) * 0.8) : p.price,
        _yearly: true,
      }));
    }
    return plans.map(p => ({ ...p, _displayPrice: p.price }));
  }, [activeTab, highlight, pricingData, billing]);

  const activeGroup = Object.values(serviceGroups).find(g => g.categories.includes(activeTab));
  const activeTabConfig = tabConfig.find(t => t.key === activeTab);

  return (
    <section className={`section pricing-section ${fullPage ? 'full-page-section' : ''}`} id="pricing">
      <div className="container">
        {!fullPage && (
          <div className="pricing-header text-center">
            <h2 className="section-h">Premium agency execution without the markup</h2>
            <p className="section-sub">Value-driven pricing with transparent packages. Get enterprise quality for growing businesses. Cancel or pause anytime.</p>
          </div>
        )}

        {/* Billing Toggle */}
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

        {/* Service Tabs */}
        <FadeReveal delay={0.2}>
          <div className="pricing-tabs-wrapper">
            <div className="pricing-service-tabs" role="tablist" aria-label="Service categories">
              {tabConfig.map(({ key, label, Icon, color }) => (
                <button
                  key={key}
                  role="tab"
                  aria-selected={activeTab === key}
                  className={`pricing-service-tab ${activeTab === key ? 'active' : ''}`}
                  onClick={() => setActiveTab(key)}
                  style={{ '--tab-color': color }}
                >
                  <span className="tab-icon-wrap">
                    <Icon size={18} strokeWidth={2} />
                  </span>
                  <span className="tab-label">{label}</span>
                </button>
              ))}
            </div>

            {/* Service Info Strip */}
            {activeGroup && (
              <div className="pricing-service-info">
                <span className="service-tag">{activeGroup.label}</span>
                <p className="service-info-desc">{activeGroup.description}</p>
              </div>
            )}
          </div>
        </FadeReveal>

        {/* Pricing Cards */}
        <StaggerReveal delay={0.3} className="pricing-grid active">
          {displayPlans.map((plan) => (
            <FadeReveal key={plan.id || plan.tier}>
              <article className={`price-card ${plan.featured ? 'featured' : ''}`}>
                {plan.featured && (
                  <div className="popular-badge">
                    <Star size={12} strokeWidth={2.5} />
                    Most Popular
                  </div>
                )}
                <div className="price-tier">{plan.tier}</div>
                <div className="price-amount">
                  <span className="currency">$</span>
                  {plan._displayPrice}
                  {plan._yearly && !isNaN(plan.price) && (
                    <span className="price-original">${plan.price}</span>
                  )}
                </div>
                <div className="price-desc">{plan.desc}</div>
                <div className="price-divider" />
                <ul className="price-features">
                  {plan.features?.map((feat) => (
                    <li key={feat}>
                      <Check size={14} strokeWidth={2.5} />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link to="/contact" className="btn-red price-cta">
                  Get Started
                  <ArrowRight size={15} strokeWidth={2.5} />
                </Link>
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
        /* ══ PRICING ════════════════════════════════════════════════ */

        /* Billing toggle */
        .pricing-billing-toggle {
          display: flex;
          align-items: center;
          gap: 4px;
          background: var(--surface-soft);
          border: 1px solid var(--border);
          border-radius: 100px;
          padding: 4px;
          width: fit-content;
          margin: 0 auto 2.5rem;
        }
        .pbt-btn {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.55rem 1.4rem;
          border-radius: 100px;
          border: none;
          background: transparent;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--muted);
          cursor: pointer;
          transition: all 0.22s ease;
          white-space: nowrap;
        }
        .pbt-btn.active {
          background: var(--brand-red);
          color: #fff;
          box-shadow: 0 4px 12px rgba(232,25,44,0.28);
        }
        .pbt-save {
          font-size: 0.7rem;
          font-weight: 700;
          background: rgba(255,255,255,0.25);
          padding: 0.1rem 0.45rem;
          border-radius: 100px;
          letter-spacing: 0.02em;
        }
        .pbt-btn:not(.active) .pbt-save {
          background: rgba(34,197,94,0.12);
          color: #16a34a;
        }

        /* Tabs wrapper */
        .pricing-tabs-wrapper {
          margin-bottom: 2.5rem;
        }

        /* Service tabs row */
        .pricing-service-tabs {
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }
        .pricing-service-tab {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0.7rem 1.35rem;
          border: 1.5px solid var(--border);
          background: var(--surface-card);
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--muted);
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          position: relative;
        }
        .pricing-service-tab:hover {
          border-color: var(--tab-color, var(--brand-red));
          color: var(--tab-color, var(--brand-red));
          background: rgba(232,25,44,0.05);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.08);
        }
        .pricing-service-tab.active {
          background: var(--tab-color, var(--brand-red));
          border-color: var(--tab-color, var(--brand-red));
          color: #fff;
          font-weight: 700;
          box-shadow: 0 6px 20px rgba(0,0,0,0.18);
          transform: translateY(-2px);
        }
        .tab-icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          flex-shrink: 0;
        }
        .tab-label { line-height: 1; }

        /* Service info strip */
        .pricing-service-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 0.85rem 1.5rem;
          background: var(--surface-soft);
          border-radius: 12px;
          border: 1px solid var(--border);
          flex-wrap: wrap;
        }
        .service-tag {
          display: inline-flex;
          align-items: center;
          padding: 0.3rem 0.9rem;
          background: var(--surface-card);
          color: var(--ink);
          border-radius: 100px;
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border: 1px solid var(--border);
          white-space: nowrap;
          flex-shrink: 0;
        }
        .service-info-desc {
          font-size: 0.9rem;
          color: var(--muted);
          margin: 0;
          line-height: 1.5;
          font-weight: 500;
        }

        /* Cards Grid */
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          align-items: start;
        }

        /* Price Card */
        .price-card {
          background: var(--surface-card);
          border: 1.5px solid var(--border);
          border-radius: 20px;
          padding: 2rem 1.75rem;
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 0;
          transition: transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        }
        .price-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.09);
          border-color: rgba(16,24,40,0.14);
        }
        .price-card.featured {
          border-color: var(--brand-red);
          background: linear-gradient(160deg, #fff 60%, rgba(232,25,44,0.025) 100%);
          box-shadow: 0 8px 32px rgba(232,25,44,0.12), 0 2px 8px rgba(0,0,0,0.04);
          transform: translateY(-4px) scale(1.02);
        }
        .price-card.featured:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 56px rgba(232,25,44,0.18);
        }

        /* Popular badge */
        .popular-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          position: absolute;
          top: -13px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--brand-red);
          color: #fff;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 0.3rem 0.9rem;
          border-radius: 100px;
          white-space: nowrap;
          box-shadow: 0 4px 14px rgba(232,25,44,0.35);
        }

        /* Tier name */
        .price-tier {
          font-family: var(--font-display);
          font-size: 0.78rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--muted);
          margin-bottom: 0.85rem;
        }

        /* Price amount */
        .price-amount {
          display: flex;
          align-items: baseline;
          gap: 2px;
          font-family: var(--font-display);
          font-size: 2.8rem;
          font-weight: 900;
          color: var(--ink);
          letter-spacing: -0.04em;
          line-height: 1;
          margin-bottom: 0.5rem;
        }
        .currency {
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--muted);
          align-self: flex-start;
          padding-top: 0.35rem;
        }
        .price-original {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--muted);
          text-decoration: line-through;
          margin-left: 6px;
          opacity: 0.6;
        }

        /* Description */
        .price-desc {
          font-size: 0.875rem;
          color: var(--muted);
          line-height: 1.55;
          margin-bottom: 1.25rem;
        }

        /* Divider */
        .price-divider {
          height: 1px;
          background: var(--border);
          margin-bottom: 1.25rem;
        }

        /* Features list */
        .price-features {
          list-style: none;
          padding: 0;
          margin: 0 0 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
          flex: 1;
        }
        .price-features li {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          font-size: 0.875rem;
          color: var(--ink-soft);
          line-height: 1.45;
        }
        .price-features li svg {
          color: var(--brand-red);
          flex-shrink: 0;
          margin-top: 2px;
        }
        .price-card.featured .price-features li svg {
          color: var(--brand-red);
        }

        /* CTA button */
        .price-cta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.85rem 1.5rem;
          font-size: 0.875rem;
          font-weight: 700;
          width: 100%;
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.22s ease;
          margin-top: auto;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .pricing-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .price-card.featured {
            transform: none;
          }
          .price-card.featured:hover {
            transform: translateY(-4px);
          }
        }

        @media (max-width: 640px) {
          .pricing-service-tabs {
            display: grid;
            grid-template-columns: 1fr 1fr;
            justify-items: stretch;
          }
          .pricing-service-tab {
            justify-content: center;
            padding: 0.65rem 1rem;
            font-size: 0.82rem;
          }
          .pricing-service-info {
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
          }
          .pricing-grid {
            grid-template-columns: 1fr;
          }
          .price-card.featured {
            order: -1;
          }
          .price-amount {
            font-size: 2.4rem;
          }
        }

        @media (max-width: 400px) {
          .pricing-service-tab {
            padding: 0.6rem 0.75rem;
            font-size: 0.78rem;
            gap: 6px;
          }
          .tab-icon-wrap svg {
            width: 15px;
            height: 15px;
          }
          .pbt-btn {
            padding: 0.5rem 1rem;
            font-size: 0.82rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Pricing;
