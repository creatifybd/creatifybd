import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';
import { FadeReveal, StaggerReveal } from './MotionReveal';
import { BarChart2, Palette, Video, Globe2, ArrowRight, Check, Star } from 'lucide-react';

const fallbackPricing = {
  social: [
    {
      id: 's1',
      tier: 'প্যাকেজ ০১',
      specialOffer: true,
      badge: 'স্পেশাল অফার',
      price: '৫,০০০',
      rawPrice: 5000,
      period: '/মাস',
      desc: 'দৈনিক ২টি পোস্টার ও সাপ্তাহিক ভিডিও সহ স্টার্টার সোশ্যাল গ্রোথ',
      features: [
        'দৈনিক ২টি সোশ্যাল মিডিয়া পোস্টার (মাসে ৬০টি পোস্টার)',
        'সপ্তাহে ১টি প্রমোশনাল ভিডিও (মাসে ৪টি ভিডিও)',
        'আকর্ষণীয় বাংলা/ইংলিশ ক্যাপশন ও নিশ হ্যাশট্যাগ',
        'মান্থলি কনটেন্ট প্ল্যানিং ও ডিজাইন সিডিউল',
        '১টি প্ল্যাটফর্ম ফুল ম্যানেজমেন্ট ও সাপোর্ট'
      ]
    },
    {
      id: 's2',
      tier: 'প্যাকেজ ০২',
      specialOffer: true,
      badge: 'স্পেশাল অফার',
      featured: true,
      popularLabel: 'সবচেয়ে জনপ্রিয়',
      price: '৭,০০০',
      rawPrice: 7000,
      period: '/মাস',
      desc: 'দৈনিক ৩টি পোস্টার ও সাপ্তাহিক ভিডিও সহ রেগুলার ব্র্যান্ড গ্রোথ',
      features: [
        'দৈনিক ৩টি সোশ্যাল মিডিয়া পোস্টার (মাসে ৯০টি পোস্টার)',
        'সপ্তাহে ১টি প্রমোশনাল ভিডিও (মাসে ৪টি ভিডিও)',
        'ট্রেন্ডিং রিলস কনসেপ্ট ও মোশন গ্রাফিক্স',
        'ফেসবুক ও ইনস্টাগ্রাম ২ প্ল্যাটফর্ম সাপোর্ট',
        'এনগেজিং ক্যাপশন ও রেগুলার কনটেন্ট সিডিউলিং'
      ]
    },
    {
      id: 's3',
      tier: 'প্যাকেজ ০৩',
      specialOffer: true,
      badge: 'স্পেশাল অফার',
      price: '১০,০০০',
      rawPrice: 10000,
      period: '/মাস',
      desc: 'দৈনিক ৫টি পোস্টার ও সপ্তাহে ২টি ভিডিও সহ ফুল-স্কেল ডমিনেশন',
      features: [
        'দৈনিক ৫টি সোশ্যাল মিডিয়া পোস্টার (মাসে ১৫০টি পোস্টার)',
        'সপ্তাহে ২টি প্রমোশনাল ভিডিও (মাসে ৮টি ভিডিও)',
        'হাই-কনভার্সন ভিডিও ও সেলস-ফোকাসড ক্রিয়েটিভস',
        'মাল্টি-প্ল্যাটফর্ম ফুল ম্যানেজমেন্ট',
        'ডেডিকেটেড ক্রিয়েটিভ ম্যানেজার ও প্রায়োরিটি সাপোর্ট'
      ]
    }
  ],
  branding: [
    {
      id: 'b1',
      tier: 'লোগো ও বেসিক ব্র্যান্ডিং',
      isCustom: true,
      price: 'কাস্টম বাজেট',
      desc: 'ইউনিক লোগো, কালার প্যালেট ও সোশ্যাল কিট',
      features: [
        'কাস্টম ভেক্টর লোগো কনসেপ্ট',
        'কালার ও টাইপোগ্রাফি গাইডলাইন',
        'সোশ্যাল মিডিয়া প্রোফাইল ও কভার কিট',
        'প্রিন্ট ও ওয়েব রেডি সোর্স ফাইল'
      ]
    },
    {
      id: 'b2',
      tier: 'কমপ্লিট ব্র্যান্ড আইডেন্টিটি',
      isCustom: true,
      price: 'কাস্টম বাজেট',
      desc: 'ফুল ভিজ্যুয়াল আইডেন্টিটি ও বিজনেস মেটেরিয়ালস',
      features: [
        'মাস্টার ব্র্যান্ড গাইডবুক',
        'স্টেশনারি ও ভিজিটিং কার্ড ডিজাইন',
        'প্যাকেজিং অথবা মার্কেটিং কোলাটেরাল',
        '১০০% কাস্টমাইজড প্রজেক্ট সাপোর্ট'
      ],
      featured: true
    },
    {
      id: 'b3',
      tier: 'এন্টারপ্রাইজ ব্র্যান্ডিং',
      isCustom: true,
      price: 'কাস্টম বাজেট',
      desc: 'লার্জ-স্কেল ব্যবসা ও রি-ব্র্যান্ডিং সলিউশন',
      features: [
        'কম্প্রিহেনসিভ ব্র্যান্ড সিস্টেম ও অ্যাসেট লাইব্রেরি',
        'মার্কেটিং ক্যাম্পেইন টেমপ্লেট ও ব্যানার প্যাক',
        'আনলিমিটেড আর্টওয়ার্ক ভ্যারিয়েশন',
        'ডেডিকেটেড সিনিয়র আর্ট ডিরেক্টর'
      ]
    }
  ],
  video: [
    {
      id: 'v1',
      tier: 'শর্ট-ফর্ম ভিডিও ও রিলস',
      isCustom: true,
      price: 'কাস্টম বাজেট',
      desc: 'ইনস্টাগ্রাম, ফেসবুক ও টিকটক রিলস এডিটিং',
      features: [
        'ডায়নামিক হুক ও মোশন ক্যাপশন',
        'ট্রেন্ডিং সাউন্ড ও সাউন্ড ইফেক্টস',
        'কালার কারেকশন ও হাই-কোয়ালিটি রেন্ডার'
      ]
    },
    {
      id: 'v2',
      tier: 'প্রোডাক্ট ও কমার্শিয়াল প্রমো',
      isCustom: true,
      price: 'কাস্টম বাজেট',
      desc: 'সেলস ও প্রমোশনাল ভিডিও বিজ্ঞাপন',
      features: [
        'স্ক্রিপ্ট ও ভয়েসওভার সিঙ্কিং',
        'মোশন গ্রাফিক্স ও প্রোডাক্ট হাইলাইটস',
        'হাই-কনভার্সন ভিডিও অ্যাডস ফরমুলা'
      ],
      featured: true
    },
    {
      id: 'v3',
      tier: 'ইউটিউব ও ফুল প্রোডাকশন এডিট',
      isCustom: true,
      price: 'কাস্টম বাজেট',
      desc: 'লং-ফর্ম কন্টেন্ট ও ব্র্যান্ড স্টোরিটেলিং',
      features: [
        'মাল্টি-ক্যামেরা এডিটিং ও B-Roll ইন্টিগ্রেশন',
        'সিনেমাটিক কালার গ্রেডিং ও অডিও মাস্টারিং',
        'কাস্টম থাম্বনেইল ও সোশ্যাল ভার্সন'
      ]
    }
  ],
  web: [
    {
      id: 'w1',
      tier: 'হাই-কনভার্সন ল্যান্ডিং পেজ',
      isCustom: true,
      price: 'কাস্টম বাজেট',
      desc: 'সিঙ্গেল প্রমোশনাল পেজ ও ক্যাম্পেইন ল্যান্ডার',
      features: [
        'সুপার ফাস্ট লোডিং স্পিড',
        'মোবাইল-ফার্স্ট রেসপন্সিভ ডিজাইন',
        'হোয়াটসঅ্যাপ ও লিড ফর্ম ইন্টিগ্রেশন',
        'বেসিক অন-পেজ এসইও সেটআপ'
      ]
    },
    {
      id: 'w2',
      tier: 'কমপ্লিট বিজনেস ওয়েবসাইট',
      isCustom: true,
      price: 'কাস্টম বাজেট',
      desc: 'প্রফেশনাল কর্পোরেট ও সার্ভিস ওয়েবসাইট',
      features: [
        'কাস্টম UI/UX ডিজাইন',
        'সার্ভিস, পোর্টফোলিও ও ব্লগ পেজ',
        'ডায়নামিক কনটেন্ট ও ইউজার ফ্রেন্ডলি প্যানেল',
        'ফুল সিকিউরিটি ও স্পিড অপ্টিমাইজেশন'
      ],
      featured: true
    },
    {
      id: 'w3',
      tier: 'ই-কমার্স ও কাস্টম ওয়েব সলিউশন',
      isCustom: true,
      price: 'কাস্টম বাজেট',
      desc: 'ফুল স্কেল অনলাইন শপ ও ডায়নামিক পোর্টাল',
      features: [
        'প্রোডাক্ট ক্যাটালগ ও অর্ডার ম্যানেজমেন্ট',
        'পেমেন্ট ও কুরিয়ার গেটওয়ে ইন্টিগ্রেশন',
        'অ্যাডভান্সড অ্যানালিটিক্স ও কাস্টমার ট্র্যাকিং',
        'ডেডিকেটেড টেকনিক্যাল সাপোর্ট'
      ]
    }
  ]
};

const tabConfig = [
  { key: 'social',    label: 'সোশ্যাল মিডিয়া ম্যানেজমেন্ট',  Icon: BarChart2, color: '#E8192C' },
  { key: 'branding',  label: 'লোগো ও ব্র্যান্ডিং',        Icon: Palette,   color: '#8B5CF6' },
  { key: 'video',     label: 'ভিডিও এডিটিং',             Icon: Video,     color: '#EC4899' },
  { key: 'web',       label: 'ওয়েবসাইট ডিজাইন',          Icon: Globe2,    color: '#10B981' },
];

const serviceGroups = {
  retainers: {
    label: 'স্পেশাল অফার — মান্থলি ম্যানেজমেন্ট প্যাকেজ',
    description: 'প্রতিদিন পোস্টার ও সাপ্তাহিক ভিডিও সহ আপনার সোশ্যাল মিডিয়া পেজের সম্পূর্ণ গ্রোথ ও ডিজাইন সাপোর্ট।',
    categories: ['social']
  },
  projectBased: {
    label: 'প্রজেক্ট-ভিত্তিক কাস্টম সার্ভিস',
    description: 'আপনার প্রজেক্টের রিকোয়ারমেন্ট ও চাহিদা অনুযায়ী কাস্টম কোটেশন ও অন-টাইম ডেলিভারি।',
    categories: ['branding', 'video', 'web']
  }
};

const Pricing = ({ highlight = false, fullPage = false }) => {
  const [pricingData, setPricingData] = useState({ social: [], branding: [], web: [], video: [] });
  const [activeTab, setActiveTab] = useState('social');
  const [billing, setBilling] = useState('monthly');

  useEffect(() => {
    // Read from Firestore if available, but fallbackPricing is the primary baseline
    const unsub = onSnapshot(
      collection(db, 'pricing'),
      (snap) => {
        try {
          const docs = Array.isArray(snap?.docs) ? snap.docs : [];
          if (docs.length > 0) {
            const data = { social: [], branding: [], web: [], video: [] };
            docs
              .map(doc => ({ id: doc.id, ...doc.data() }))
              .filter(item => item?.hidden !== true)
              .sort((a, b) => (Number(a?.order) || 0) - (Number(b?.order) || 0))
              .forEach(item => {
                if (item?.category && data[item.category]) data[item.category].push(item);
              });
            // Only set if docs actually contain Bengali content
            const hasValidBn = Object.values(data).some(arr => arr.some(p => p.tier_bn || (p.tier && /[\u0980-\u09FF]/.test(p.tier))));
            if (hasValidBn) {
              setPricingData(data);
            }
          }
        } catch (err) {
          console.error('Pricing snapshot handling fallback:', err);
        }
      },
      () => {}
    );
    return () => unsub();
  }, []);

  const displayPlans = useMemo(() => {
    const remotePlans = pricingData[activeTab] || [];
    const source = remotePlans.length > 0 ? remotePlans : fallbackPricing[activeTab];
    const plans = highlight ? source.slice(0, 3) : source;
    return plans.map(p => {
      const tierName = p.tier_bn || p.tier;
      const descText = p.desc_bn || p.desc;
      const featuresList = (p.features_bn && p.features_bn.length > 0) ? p.features_bn : p.features;
      const priceText = p.bdtPrice || p.price;
      const isCustom = p.isCustom || String(priceText).includes('কাস্টম') || !priceText || priceText === '0';
      return {
        ...p,
        tier: tierName,
        desc: descText,
        features: featuresList,
        _isCustom: isCustom,
        _displayPrice: isCustom ? 'কাস্টম বাজেট' : priceText
      };
    });
  }, [activeTab, highlight, pricingData]);

  const activeGroup = Object.values(serviceGroups).find(g => g.categories.includes(activeTab));
  const isSocialTab = activeTab === 'social';

  return (
    <section className={`section pricing-section ${fullPage ? 'full-page-section' : ''}`} id="pricing">
      <div className="container">
        {!fullPage && (
          <div className="pricing-header text-center">
            <h2 className="section-h">স্বচ্ছ প্যাকেজ ও <span className="red">স্পেশাল অফার</span></h2>
            <p className="section-sub">সোশ্যাল মিডিয়া গ্রোথের জন্য রয়েছে আকর্ষণীয় স্পেশাল অফার প্যাকেজ। অন্যান্য সার্ভিসের জন্য আপনার প্রজেক্ট অনুযায়ী সরাসরি কথা বলে কাস্টম কোটেশন নিন।</p>
          </div>
        )}

        {/* Service Tabs */}
        <FadeReveal delay={0.15}>
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
                  {key === 'social' && (
                    <span className="tab-special-badge">অফার</span>
                  )}
                </button>
              ))}
            </div>

            {/* Service Info Strip */}
            {activeGroup && (
              <div className="pricing-service-info">
                <span className={`service-tag ${isSocialTab ? 'tag-special' : ''}`}>{activeGroup.label}</span>
                <p className="service-info-desc">{activeGroup.description}</p>
              </div>
            )}
          </div>
        </FadeReveal>

        {/* Pricing Cards */}
        <StaggerReveal delay={0.25} className="pricing-grid active">
          {displayPlans.map((plan) => (
            <FadeReveal key={plan.id || plan.tier}>
              <article className={`price-card ${plan.featured ? 'featured' : ''} ${plan.specialOffer ? 'special-offer-card' : ''}`}>
                {plan.specialOffer && (
                  <div className="special-offer-badge">
                    ⚡ {plan.badge || 'স্পেশাল অফার'}
                  </div>
                )}
                {plan.featured && !plan.specialOffer && (
                  <div className="popular-badge">
                    <Star size={12} strokeWidth={2.5} />
                    {plan.popularLabel || 'সবচেয়ে জনপ্রিয়'}
                  </div>
                )}
                <div className="price-tier">{plan.tier}</div>

                <div className="price-amount">
                  {plan._isCustom ? (
                    <span className="price-custom-text">{plan._displayPrice}</span>
                  ) : (
                    <>
                      <span className="currency">৳</span>
                      {plan._displayPrice}
                      <span className="price-period">{plan.period || '/মাস'}</span>
                    </>
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

                {plan._isCustom ? (
                  <a
                    href={`https://wa.me/8801951676600?text=${encodeURIComponent(`আসসালামু আলাইকুম CreatifyBD! আমি "${plan.tier}" সার্ভিসের জন্য কাস্টম কোটেশন ও বাজেট আলোচনা করতে চাই।`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-outline-red price-cta"
                  >
                    কাস্টম কোটেশন নিন
                    <ArrowRight size={15} strokeWidth={2.5} />
                  </a>
                ) : (
                  <a
                    href={`https://wa.me/8801951676600?text=${encodeURIComponent(`আসসালামু আলাইকুম CreatifyBD! আমি সোশ্যাল মিডিয়া ম্যানেজমেন্টের "${plan.tier}" (৳${plan._displayPrice}/মাস) স্পেশাল অফার প্যাকেজটি নিতে আগ্রহী।`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-red price-cta"
                  >
                    প্যাকেজটি শুরু করুন
                    <ArrowRight size={15} strokeWidth={2.5} />
                  </a>
                )}
              </article>
            </FadeReveal>
          ))}
        </StaggerReveal>

        {highlight && (
          <FadeReveal delay={0.4}>
            <div className="section-action">
              <Link to="/pricing" className="btn-outline-red">সব প্যাকেজ একসাথে দেখুন</Link>
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

        .tag-special {
          background: rgba(232,25,44,0.1) !important;
          color: var(--brand-red) !important;
          border-color: rgba(232,25,44,0.25) !important;
        }

        .tab-special-badge {
          font-size: 0.65rem;
          font-weight: 800;
          background: #E8192C;
          color: #fff;
          padding: 0.15rem 0.45rem;
          border-radius: 100px;
          margin-left: 4px;
          letter-spacing: 0.02em;
        }
        .pricing-service-tab.active .tab-special-badge {
          background: #fff;
          color: var(--brand-red);
        }

        /* Special offer card */
        .price-card.special-offer-card {
          border-color: rgba(232,25,44,0.35);
          background: linear-gradient(165deg, var(--surface-card) 70%, rgba(232,25,44,0.03) 100%);
        }
        .price-card.special-offer-card.featured {
          border-color: var(--brand-red);
          box-shadow: 0 10px 36px rgba(232,25,44,0.16), 0 2px 8px rgba(0,0,0,0.04);
        }

        /* Special offer badge */
        .special-offer-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          position: absolute;
          top: -13px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #E8192C 0%, #C41223 100%);
          color: #fff;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          padding: 0.32rem 0.95rem;
          border-radius: 100px;
          white-space: nowrap;
          box-shadow: 0 4px 14px rgba(232,25,44,0.38);
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
          background: #3B82F6;
          color: #fff;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 0.3rem 0.9rem;
          border-radius: 100px;
          white-space: nowrap;
          box-shadow: 0 4px 14px rgba(59,130,246,0.35);
        }

        /* Tier name */
        .price-tier {
          font-family: var(--font-display);
          font-size: 0.85rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--ink);
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
        .price-custom-text {
          font-size: 1.85rem;
          letter-spacing: -0.02em;
          color: var(--ink);
          font-weight: 800;
        }
        .currency {
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--muted);
          align-self: flex-start;
          padding-top: 0.35rem;
        }
        .price-period {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--muted);
          margin-left: 4px;
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
