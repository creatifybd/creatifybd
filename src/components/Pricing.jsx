import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';
import { FadeReveal, StaggerReveal } from './MotionReveal';
import { BarChart2, Palette, Video, Globe2, ArrowRight, Check, Sparkles, Zap, ShieldCheck, MessageCircle } from 'lucide-react';

const fallbackPricing = {
  social: [
    {
      id: 's1',
      tier: 'প্যাকেজ ০১',
      tierSub: 'স্টার্টার গ্রোথ',
      badge: 'স্টার্টার প্যাক',
      badgeType: 'starter',
      price: '৫,০০০',
      rawPrice: 5000,
      period: '/মাস',
      desc: 'নতুন বা ছোট পেজের জন্য নিয়মিত পোস্ট ও প্রাথমিক অডিয়েন্স এনগেজমেন্ট।',
      features: [
        'দৈনিক ২টি প্রফেশনাল পোস্টার (মাসে ৬০টি)',
        'সপ্তাহে ১টি প্রমোশনাল ভিডিও/রিলস (মাসে ৪টি)',
        'আকর্ষণীয় বাংলা ক্যাপশন ও নিশ হ্যাশট্যাগ',
        'মান্থলি কনটেন্ট প্ল্যানিং ও ডিজাইন শিডিউল',
        '১টি প্ল্যাটফর্ম (ফেসবুক অথবা ইনস্টাগ্রাম)'
      ]
    },
    {
      id: 's2',
      tier: 'প্যাকেজ ০২',
      tierSub: 'প্রো গ্রোথ ও সেলস',
      badge: 'সর্বাধিক জনপ্রিয় 🔥',
      badgeType: 'popular',
      featured: true,
      price: '৭,০০০',
      rawPrice: 7000,
      period: '/মাস',
      desc: 'দ্রুত পেজ গ্রোথ ও নিয়মিত সেলসের জন্য সবচেয়ে ব্যালান্সড ও সেরা প্যাকেজ।',
      features: [
        'দৈনিক ৩টি আকর্ষণীয় পোস্টার (মাসে ৯০টি)',
        'সপ্তাহে ১টি ট্রেন্ডিং ভিডিও/রিলস (মাসে ৪টি)',
        'মোশন গ্রাফিক্স ও ডায়নামিক কনটেন্ট আইডিয়া',
        'ফেসবুক ও ইনস্টাগ্রাম ২ প্ল্যাটফর্ম সাপোর্ট',
        'এনগেজিং ক্যাপশন ও রেগুলার কনটেন্ট শিডিউলিং',
        'সরাসরি ডেডিকেটেড ক্রিয়েটিভ সাপোর্ট'
      ]
    },
    {
      id: 's3',
      tier: 'প্যাকেজ ০৩',
      tierSub: 'ফুল-স্কেল ডমিনেশন',
      badge: 'আলটিমেট পাওয়ার 👑',
      badgeType: 'vip',
      price: '১০,০০০',
      rawPrice: 10000,
      period: '/মাস',
      desc: 'বড় ব্র্যান্ড ও এগ্রেসিভ মার্কেটিংয়ের জন্য ফুল-স্কেল সোশ্যাল মিডিয়া সাপোর্ট।',
      features: [
        'দৈনিক ৫টি হাই-কোয়ালিটি পোস্টার (মাসে ১৫০টি)',
        'সপ্তাহে ২টি হাই-কনভার্সন ভিডিও (মাসে ৮টি)',
        'হাই-কনভার্সন সেলস ও ট্রেন্ডিং রিলস ক্রিয়েটিভস',
        'মাল্টি-প্ল্যাটফর্ম ফুল ম্যানেজমেন্ট',
        'ডেডিকেটেড সিনিয়র ম্যানেজার ও প্রায়োরিটি ডেলিভারি',
        'ফ্রি ক্যাম্পেইন প্ল্যানিং ও ডিজাইন কনসাল্টেশন'
      ]
    }
  ],
  branding: [
    {
      id: 'b1',
      tier: 'লোগো ও বেসিক ব্র্যান্ডিং',
      tierSub: 'স্টার্টআপ আইডেন্টিটি',
      badge: 'স্টার্টআপ',
      badgeType: 'starter',
      isCustom: true,
      price: 'কাস্টম বাজেট',
      desc: 'নতুন ব্যবসার জন্য আধুনিক ভেক্টর লোগো ও প্রাথমিক ব্র্যান্ড অ্যাসেটস।',
      features: [
        'কাস্টম ইউনিক লোগো ডিজাইন কনসেপ্ট',
        'কালার প্যালেট ও টাইপোগ্রাফি গাইডলাইন',
        'সোশ্যাল মিডিয়া প্রোফাইল ও কভার ব্যানার',
        'প্রিন্ট ও ওয়েব রেডি হাই-রেজ সোর্স ফাইল'
      ]
    },
    {
      id: 'b2',
      tier: 'কমপ্লিট ব্র্যান্ড আইডেন্টিটি',
      tierSub: 'বিজনেস কমপ্লিট প্যাকেজ',
      badge: 'ফুল প্যাকেজ 🔥',
      badgeType: 'popular',
      featured: true,
      isCustom: true,
      price: 'কাস্টম বাজেট',
      desc: 'কর্পোরেট প্রতিষ্ঠান ও ব্র্যান্ডের পূর্ণাঙ্গ ভিজ্যুয়াল আইডেন্টিটি সিস্টেম।',
      features: [
        'মাস্টার ব্র্যান্ড স্টাইল গাইডবুক',
        'ভিজিটিং কার্ড, লেটারহেড ও ইনভয়েস ডিজাইন',
        'প্রোডাক্ট প্যাকেজিং অথবা মার্কেটিং কোলাটেরাল',
        'ফুল ভেক্টর সোর্স ফাইল (AI, EPS, PDF, PNG)',
        '১০০% কাস্টমাইজড আর্ট ডিরেকশন'
      ]
    },
    {
      id: 'b3',
      tier: 'এন্টারপ্রাইজ ব্র্যান্ডিং',
      tierSub: 'লার্জ-স্কেল সলিউশন',
      badge: 'এন্টারপ্রাইজ 👑',
      badgeType: 'vip',
      isCustom: true,
      price: 'কাস্টম বাজেট',
      desc: 'বড় ব্যবসা, রি-ব্র্যান্ডিং ও মাল্টি-চ্যানেল মার্কেটিং ম্যাটেরিয়ালস।',
      features: [
        'কম্প্রিহেনসিভ ব্র্যান্ড সিস্টেম ও অ্যাসেট লাইব্রেরি',
        'মার্কেটিং ক্যাম্পেইন টেমপ্লেট ও অ্যাড ব্যানার প্যাক',
        'প্যাকেজিং ও মার্চেন্ডাইজ ডিজাইন',
        'আনলিমিটেড আর্টওয়ার্ক রিভিশন সাপোর্ট',
        'ডেডিকেটেড সিনিয়র আর্ট ডিরেক্টর'
      ]
    }
  ],
  video: [
    {
      id: 'v1',
      tier: 'শর্ট-ফর্ম ভিডিও ও রিলস',
      tierSub: 'সোশ্যাল রিলস প্যাক',
      badge: 'ট্রেন্ডিং প্যাক',
      badgeType: 'starter',
      isCustom: true,
      price: 'কাস্টম বাজেট',
      desc: 'ফেসবুক, ইনস্টাগ্রাম ও টিকটকের জন্য হাই-এনগেজিং শর্ট ভিডিও এডিটিং।',
      features: [
        'ডায়নামিক হুক ও মোশন টেক্সট ক্যাপশন',
        'ট্রেন্ডিং অডিও ও সাউন্ড এফেক্টস (SFX)',
        'স্মুথ ট্রানজিশন ও জুম এফেক্টস',
        'কালার কারেকশন ও 4K/1080p রেন্ডারিং'
      ]
    },
    {
      id: 'v2',
      tier: 'কমার্শিয়াল ভিডিও অ্যাডস',
      tierSub: 'প্রোডাক্ট ও সেলস ভিডিও',
      badge: 'হাই কনভার্সন 🔥',
      badgeType: 'popular',
      featured: true,
      isCustom: true,
      price: 'কাস্টম বাজেট',
      desc: 'পণ্য বিক্রি ও ব্র্যান্ড প্রমোশনের জন্য সেলস-ফোকাসড ভিডিও ক্রিয়েটিভস।',
      features: [
        'স্ক্রিপ্ট ও ভয়েসওভার পারফেক্ট সিঙ্কিং',
        'মোশন গ্রাফিক্স ও প্রোডাক্ট ফিচার হাইলাইটস',
        'ফেসবুক/ইনস্টাগ্রাম অ্যাড রেডি রেশিও (9:16, 1:1, 16:9)',
        'হাই-কনভার্সন অডিয়েন্স রিটেনশন হুক্স'
      ]
    },
    {
      id: 'v3',
      tier: 'ইউটিউব ও লং-ফর্ম ভিডিও',
      tierSub: 'ফুল প্রোডাকশন এডিটিং',
      badge: 'ফুল প্রোডাকশন 👑',
      badgeType: 'vip',
      isCustom: true,
      price: 'কাস্টম বাজেট',
      desc: 'ইউটিউব ভিডিও, পডকাস্ট ও ডকুমেন্টারি স্টাইলের ফুল-লেন্থ এডিটিং।',
      features: [
        'মাল্টি-ক্যামেরা এডিটিং ও B-Roll ইন্টিগ্রেশন',
        'সিনেমাটিক কালার গ্রেডিং ও অডিও মাস্টারিং',
        'কাস্টম আই-ক্যাচিং থাম্বনেইল ডিজাইন',
        'সোশ্যাল মিডিয়া শর্ট টিজার ক্লিপস'
      ]
    }
  ],
  web: [
    {
      id: 'w1',
      tier: 'হাই-কনভার্সন ল্যান্ডিং পেজ',
      tierSub: 'সিঙ্গেল প্রোডাক্ট/ক্যাম্পেইন',
      badge: 'ক্যাম্পেইন রেডি',
      badgeType: 'starter',
      isCustom: true,
      price: 'কাস্টম বাজেট',
      desc: 'বিজ্ঞাপনের জন্য দ্রুত লোডিং ও উচ্চ বিক্রয় রূপান্তরের ল্যান্ডিং পেজ।',
      features: [
        'সুপার ফাস্ট আল্ট্রা-লাইট লোডিং স্পিড',
        '১০০% মোবাইল-ফার্স্ট রেসপন্সিভ ডিজাইন',
        '১-ট্যাপ WhatsApp ও লিড ফর্ম ইন্টিগ্রেশন',
        'বেসিক অন-পেজ এসইও ও মেটা সেটআপ'
      ]
    },
    {
      id: 'w2',
      tier: 'কমপ্লিট বিজনেস ওয়েবসাইট',
      tierSub: 'কর্পোরেট ও কোম্পানি সাইট',
      badge: 'মোস্ট ওয়ান্টেড 🔥',
      badgeType: 'popular',
      featured: true,
      isCustom: true,
      price: 'কাস্টম বাজেট',
      desc: 'আপনার প্রতিষ্ঠানের আস্থা ও গ্রহণযোগ্যতা বাড়াতে আধুনিক বিজনেস ওয়েবসাইট।',
      features: [
        'কাস্টম ইউনিক UI/UX ডিজাইন',
        'হোম, সার্ভিস, পোর্টফোলিও, রিভিউ ও যোগাযোগ পেজ',
        'সহজে কনটেন্ট পরিবর্তনের ব্যাকএন্ড প্যানেল',
        'ফুল সিকিউরিটি, এসএসএল ও স্পিড অপ্টিমাইজেশন',
        '১ বছর ফ্রি টেকনিক্যাল মেইনটেন্যান্স'
      ]
    },
    {
      id: 'w3',
      tier: 'ই-কমার্স ও কাস্টম ওয়েব',
      tierSub: 'ফুল স্কেল অনলাইন শপ',
      badge: 'এন্টারপ্রাইজ শপ 👑',
      badgeType: 'vip',
      isCustom: true,
      price: 'কাস্টম বাজেট',
      desc: 'অটোমেটেড সেলস, পেমেন্ট ও ইনভেন্টরি সহ ফুল অনলাইন স্টোর।',
      features: [
        'প্রোডাক্ট ক্যাটালগ ও ইনভেন্টরি ম্যানেজমেন্ট',
        'বিকাশ, নগদ ও কার্ড পেমেন্ট গেটওয়ে ইন্টিগ্রেশন',
        'কুরিয়ার ও ডেলিভারি ট্র্যাকিং অটোমেশন',
        'ফেসবুক পিক্সেল ও অ্যাডভান্সড কনভার্সন API'
      ]
    }
  ]
};

const tabConfig = [
  { key: 'social',    label: 'সোশ্যাল মিডিয়া ম্যানেজমেন্ট',  Icon: BarChart2, color: '#E8192C', badge: 'স্পেশাল অফার' },
  { key: 'branding',  label: 'লোগো ও ব্র্যান্ডিং',        Icon: Palette,   color: '#8B5CF6' },
  { key: 'video',     label: 'ভিডিও এডিটিং',             Icon: Video,     color: '#EC4899' },
  { key: 'web',       label: 'ওয়েবসাইট ডিজাইন',          Icon: Globe2,    color: '#10B981' },
];

const Pricing = ({ highlight = false, fullPage = false }) => {
  const [pricingData, setPricingData] = useState({ social: [], branding: [], web: [], video: [] });
  const [activeTab, setActiveTab] = useState('social');

  useEffect(() => {
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
      const tierSub = p.tierSub || '';
      const descText = p.desc_bn || p.desc;
      const featuresList = (p.features_bn && p.features_bn.length > 0) ? p.features_bn : p.features;
      const priceText = p.bdtPrice || p.price;
      const isCustom = p.isCustom || String(priceText).includes('কাস্টম') || !priceText || priceText === '0';
      return {
        ...p,
        tier: tierName,
        tierSub,
        desc: descText,
        features: featuresList,
        _isCustom: isCustom,
        _displayPrice: isCustom ? 'কাস্টম বাজেট' : priceText
      };
    });
  }, [activeTab, highlight, pricingData]);

  const isSocialTab = activeTab === 'social';

  return (
    <section className={`pricing-master-section ${fullPage ? 'full-page-section' : ''}`} id="pricing">
      {/* Subtle ambient lighting */}
      <div className="pricing-ambient-glow" aria-hidden="true" />

      <div className="container">
        {!fullPage && (
          <div className="pricing-header-v4 text-center">
            <span className="pricing-eyebrow">
              <Sparkles size={14} className="text-red animate-pulse" />
              <span>সাশ্রয়ী মূল্যে প্রিমিয়াম কোয়ালিটি</span>
            </span>
            <h2 className="pricing-title-v4">
              স্বচ্ছ প্যাকেজ ও <span className="text-gradient-red">স্পেশাল অফার</span>
            </h2>
            <p className="pricing-subtitle-v4">
              সোশ্যাল মিডিয়া গ্রোথের জন্য রয়েছে আকর্ষণীয় মান্থলি অফার প্যাকেজ। এছাড়া যেকোনো কাস্টম প্রজেক্টে পান দ্রুত ডেলিভারি ও শতভাগ সাপোর্ট।
            </p>
          </div>
        )}

        {/* ── Modern Segmented Filter Bar ── */}
        <FadeReveal delay={0.1}>
          <div className="pricing-nav-container">
            <div className="pricing-segmented-bar" role="tablist">
              {tabConfig.map(({ key, label, Icon, color, badge }) => (
                <button
                  key={key}
                  role="tab"
                  aria-selected={activeTab === key}
                  className={`pricing-seg-btn ${activeTab === key ? 'active' : ''}`}
                  onClick={() => setActiveTab(key)}
                  style={{ '--tab-theme': color }}
                >
                  <span className="seg-icon-pill">
                    <Icon size={16} />
                  </span>
                  <span className="seg-label">{label}</span>
                  {badge && <span className="seg-badge">{badge}</span>}
                </button>
              ))}
            </div>
          </div>
        </FadeReveal>

        {/* ── Contextual Offer Micro-Banner ── */}
        <div className="pricing-info-pill-wrap">
          <div className="pricing-info-pill">
            <span className="info-pill-dot" />
            <span className="info-pill-text">
              {isSocialTab
                ? '🔥 স্পেশাল অফার: প্রতিদিন পোস্টার ও ভিডিও সহ সোশ্যাল পেজের সম্পূর্ণ গ্রোথ ও ডিজাইন সাপোর্ট'
                : '✨ আপনার প্রজেক্টের রিকোয়ারমেন্ট অনুযায়ী কাস্টম কোটেশন ও অন-টাইম ডেলিভারি গ্যারান্টি'}
            </span>
          </div>
        </div>

        {/* ── Pricing Cards Grid ── */}
        <StaggerReveal delay={0.2} className="pricing-cards-grid">
          {displayPlans.map((plan) => (
            <FadeReveal key={plan.id || plan.tier}>
              <div
                className={`luxury-price-card ${plan.featured ? 'is-featured' : ''} ${plan.badgeType === 'vip' ? 'is-vip' : ''}`}
              >
                {/* Popular / Badge banner */}
                {plan.badge && (
                  <div className={`card-top-badge badge-${plan.badgeType || 'default'}`}>
                    <span>{plan.badge}</span>
                  </div>
                )}

                {/* Card Header */}
                <div className="card-head">
                  <div className="card-tier-wrap">
                    <h3 className="card-tier-name">{plan.tier}</h3>
                    {plan.tierSub && <span className="card-tier-sub">{plan.tierSub}</span>}
                  </div>
                  <p className="card-desc">{plan.desc}</p>
                </div>

                {/* Price Display */}
                <div className="card-price-block">
                  {plan._isCustom ? (
                    <div className="custom-price-display">
                      <span className="custom-price-tag">কাস্টম বাজেট</span>
                      <span className="custom-price-sub">প্রজেক্ট অনুযায়ী সাশ্রয়ী কোটেশন</span>
                    </div>
                  ) : (
                    <div className="fixed-price-display">
                      <div className="price-number-row">
                        <span className="currency-symbol">৳</span>
                        <span className="price-digits">{plan._displayPrice}</span>
                        <span className="price-tenure">{plan.period || '/মাস'}</span>
                      </div>
                      <span className="price-guarantee-tag">নো হিডেন চার্জ · ১০০% কোয়ালিটি</span>
                    </div>
                  )}
                </div>

                <div className="card-divider-line" />

                {/* Features List */}
                <div className="card-features-block">
                  <span className="features-headline">প্যাকেজে যা যা পাচ্ছেন:</span>
                  <ul className="features-checklist">
                    {plan.features?.map((feat, idx) => (
                      <li key={idx}>
                        <span className="check-bullet">
                          <Check size={13} strokeWidth={3} />
                        </span>
                        <span className="feat-text">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Action CTA */}
                <div className="card-action-wrap">
                  {plan._isCustom ? (
                    <a
                      href={`https://wa.me/8801951676600?text=${encodeURIComponent(`আসসালামু আলাইকুম CreatifyBD! আমি "${plan.tier}" (${plan.tierSub || ''}) সার্ভিসের জন্য কাস্টম বাজেট ও কোটেশন আলোচনা করতে চাই।`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="card-cta-btn btn-ghost-luxury"
                    >
                      <MessageCircle size={16} />
                      <span>কাস্টম কোটেশন নিন</span>
                      <ArrowRight size={15} />
                    </a>
                  ) : (
                    <a
                      href={`https://wa.me/8801951676600?text=${encodeURIComponent(`আসসালামু আলাইকুম CreatifyBD! আমি সোশ্যাল মিডিয়া ম্যানেজমেন্টের "${plan.tier}" (৳${plan._displayPrice}/মাস) স্পেশাল অফার প্যাকেজটি বুক করতে চাই।`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className={`card-cta-btn ${plan.featured ? 'btn-red-luxury-glow' : 'btn-red-luxury'}`}
                    >
                      <Zap size={16} />
                      <span>এই প্যাকেজটি বুক করুন</span>
                      <ArrowRight size={15} />
                    </a>
                  )}
                </div>
              </div>
            </FadeReveal>
          ))}
        </StaggerReveal>

        {/* ── Trust Footnote ── */}
        <div className="pricing-trust-strip">
          <div className="trust-strip-item">
            <ShieldCheck size={18} className="text-red" />
            <span>কোনো হিডেন ফি নেই</span>
          </div>
          <div className="trust-strip-dot" />
          <div className="trust-strip-item">
            <Zap size={18} className="text-red" />
            <span>দ্রুত ডেলিভারি ও রেসপন্স</span>
          </div>
          <div className="trust-strip-dot" />
          <div className="trust-strip-item">
            <MessageCircle size={18} className="text-red" />
            <span>২৪/৭ WhatsApp সাপোর্ট</span>
          </div>
        </div>

        {highlight && (
          <FadeReveal delay={0.4}>
            <div className="section-action" style={{ textAlign: 'center', marginTop: '3rem' }}>
              <Link to="/pricing" className="btn-outline-red">সব প্যাকেজ ও বিস্তারিত দেখুন →</Link>
            </div>
          </FadeReveal>
        )}
      </div>

      <style>{`
        /* ═══════════════════════════════════════════════════════════
           CREATIFYBD — LUXURY PRICING SECTION V4
           ═══════════════════════════════════════════════════════════ */
        .pricing-master-section {
          position: relative;
          background: #ffffff;
          padding: clamp(4.5rem, 7vw, 6.5rem) 0;
          overflow: hidden;
        }

        .pricing-ambient-glow {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 800px;
          height: 400px;
          background: radial-gradient(ellipse at top, rgba(232, 25, 44, 0.05) 0%, rgba(232, 25, 44, 0) 70%);
          pointer-events: none;
          z-index: 0;
        }

        /* ── Header ── */
        .pricing-header-v4 {
          max-width: 680px;
          margin: 0 auto 2.5rem;
          position: relative;
          z-index: 1;
        }

        .pricing-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0.35rem 1rem;
          background: rgba(232, 25, 44, 0.07);
          border: 1px solid rgba(232, 25, 44, 0.18);
          border-radius: 100px;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--brand-red, #E8192C);
          margin-bottom: 1.25rem;
        }

        .pricing-title-v4 {
          font-family: var(--font-display, 'Bricolage Grotesque', sans-serif);
          font-size: clamp(2.25rem, 5vw, 3.5rem);
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -0.04em;
          color: var(--ink, #0F0F12);
          margin-bottom: 1rem;
        }

        .text-gradient-red {
          color: var(--brand-red, #E8192C);
          background: linear-gradient(135deg, #E8192C 0%, #B91C1C 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .pricing-subtitle-v4 {
          font-size: 1.02rem;
          color: var(--muted, #667085);
          line-height: 1.7;
          margin: 0 auto;
        }

        /* ── Segmented Control Filter Bar ── */
        .pricing-nav-container {
          display: flex;
          justify-content: center;
          margin-bottom: 1.5rem;
          position: relative;
          z-index: 1;
        }

        .pricing-segmented-bar {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px;
          background: #F4F4F6;
          border: 1px solid rgba(15, 15, 18, 0.07);
          border-radius: 100px;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.03);
          max-width: 100%;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .pricing-segmented-bar::-webkit-scrollbar { display: none; }

        .pricing-seg-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0.65rem 1.35rem;
          border: none;
          background: transparent;
          border-radius: 100px;
          font-family: var(--font-body, 'Hind Siliguri', sans-serif);
          font-size: 0.88rem;
          font-weight: 600;
          color: #555A64;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          white-space: nowrap;
          user-select: none;
        }

        .pricing-seg-btn:hover {
          color: #11141A;
          background: rgba(255, 255, 255, 0.6);
        }

        .pricing-seg-btn.active {
          background: #ffffff;
          color: #0F0F12;
          font-weight: 700;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0,0,0,0.04);
        }

        .seg-icon-pill {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.05);
          color: inherit;
        }
        .pricing-seg-btn.active .seg-icon-pill {
          background: rgba(232, 25, 44, 0.1);
          color: var(--brand-red, #E8192C);
        }

        .seg-badge {
          font-size: 0.68rem;
          font-weight: 800;
          padding: 0.15rem 0.5rem;
          border-radius: 100px;
          background: #E8192C;
          color: #ffffff;
          letter-spacing: 0.02em;
        }

        /* ── Micro-Banner ── */
        .pricing-info-pill-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: 2.75rem;
          position: relative;
          z-index: 1;
        }

        .pricing-info-pill {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 0.5rem 1.25rem;
          background: #FAFAFC;
          border: 1px solid #ECECF1;
          border-radius: 100px;
          font-size: 0.86rem;
          color: #4A505C;
          text-align: center;
          max-width: 90%;
        }

        .info-pill-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22C55E;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);
          flex-shrink: 0;
        }

        /* ── Cards Grid ── */
        .pricing-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.75rem;
          align-items: stretch;
          position: relative;
          z-index: 1;
        }

        /* ── Luxury Price Card ── */
        .luxury-price-card {
          position: relative;
          display: flex;
          flex-direction: column;
          background: #ffffff;
          border: 1.5px solid #EBEBF0;
          border-radius: 24px;
          padding: 2.5rem 2rem 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s ease;
        }

        .luxury-price-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 48px rgba(0, 0, 0, 0.08);
          border-color: #D1D5DB;
        }

        /* Featured Card (Middle Hero) */
        .luxury-price-card.is-featured {
          border-color: #E8192C;
          background: linear-gradient(180deg, #FFFFFF 0%, #FFF8F8 100%);
          box-shadow: 0 12px 40px rgba(232, 25, 44, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04);
          transform: translateY(-8px);
        }

        .luxury-price-card.is-featured:hover {
          transform: translateY(-12px);
          box-shadow: 0 24px 60px rgba(232, 25, 44, 0.2);
        }

        /* VIP Card */
        .luxury-price-card.is-vip {
          border-color: #1E293B;
        }

        /* ── Badges ── */
        .card-top-badge {
          position: absolute;
          top: -14px;
          left: 50%;
          transform: translateX(-50%);
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 0.35rem 1.1rem;
          border-radius: 100px;
          font-size: 0.76rem;
          font-weight: 800;
          white-space: nowrap;
          letter-spacing: 0.02em;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
        }

        .badge-popular {
          background: linear-gradient(135deg, #E8192C 0%, #FF4D5E 100%);
          color: #ffffff;
          box-shadow: 0 6px 18px rgba(232, 25, 44, 0.38);
        }

        .badge-starter {
          background: #F1F5F9;
          color: #334155;
          border: 1px solid #CBD5E1;
        }

        .badge-vip {
          background: linear-gradient(135deg, #0F172A 0%, #334155 100%);
          color: #F8FAFC;
        }

        /* ── Card Header ── */
        .card-head {
          margin-bottom: 1.5rem;
        }

        .card-tier-wrap {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 0.5rem;
        }

        .card-tier-name {
          font-family: var(--font-display, 'Bricolage Grotesque', sans-serif);
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--ink, #0F0F12);
          margin: 0;
          letter-spacing: -0.02em;
        }

        .card-tier-sub {
          font-size: 0.78rem;
          font-weight: 700;
          color: #64748B;
          background: rgba(0,0,0,0.04);
          padding: 0.2rem 0.6rem;
          border-radius: 6px;
        }

        .card-desc {
          font-size: 0.88rem;
          color: var(--muted, #667085);
          line-height: 1.6;
          margin: 0;
          min-height: 42px;
        }

        /* ── Price Display ── */
        .card-price-block {
          margin-bottom: 1.5rem;
        }

        .fixed-price-display {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .price-number-row {
          display: flex;
          align-items: baseline;
          gap: 2px;
          color: #0F0F12;
        }

        .currency-symbol {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--brand-red, #E8192C);
          margin-right: 2px;
        }

        .price-digits {
          font-family: var(--font-display, 'Bricolage Grotesque', sans-serif);
          font-size: 3rem;
          font-weight: 900;
          letter-spacing: -0.05em;
          line-height: 1;
        }

        .price-tenure {
          font-size: 1rem;
          font-weight: 600;
          color: #64748B;
          margin-left: 4px;
        }

        .price-guarantee-tag {
          font-size: 0.75rem;
          font-weight: 600;
          color: #16A34A;
        }

        .custom-price-display {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          padding: 0.5rem 0;
        }

        .custom-price-tag {
          font-family: var(--font-display, 'Bricolage Grotesque', sans-serif);
          font-size: 1.95rem;
          font-weight: 900;
          color: #0F0F12;
          letter-spacing: -0.03em;
          line-height: 1.1;
        }

        .custom-price-sub {
          font-size: 0.78rem;
          color: #64748B;
          font-weight: 500;
        }

        .card-divider-line {
          height: 1px;
          background: #EBEBF0;
          margin-bottom: 1.5rem;
        }

        /* ── Features List ── */
        .card-features-block {
          flex: 1;
          margin-bottom: 2rem;
        }

        .features-headline {
          display: block;
          font-size: 0.78rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #94A3B8;
          margin-bottom: 1rem;
        }

        .features-checklist {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .features-checklist li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.88rem;
          color: #334155;
          line-height: 1.5;
        }

        .check-bullet {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(232, 25, 44, 0.09);
          color: var(--brand-red, #E8192C);
          flex-shrink: 0;
          margin-top: 1px;
        }

        .is-featured .check-bullet {
          background: var(--brand-red, #E8192C);
          color: #ffffff;
        }

        .feat-text {
          font-weight: 500;
        }

        /* ── CTA Buttons ── */
        .card-action-wrap {
          margin-top: auto;
        }

        .card-cta-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 0.95rem 1.5rem;
          border-radius: 14px;
          font-family: var(--font-body, 'Hind Siliguri', sans-serif);
          font-size: 0.92rem;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .btn-red-luxury {
          background: #0F172A;
          color: #ffffff;
        }
        .btn-red-luxury:hover {
          background: var(--brand-red, #E8192C);
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(232, 25, 44, 0.3);
        }

        .btn-red-luxury-glow {
          background: linear-gradient(135deg, #E8192C 0%, #D41224 100%);
          color: #ffffff;
          box-shadow: 0 8px 26px rgba(232, 25, 44, 0.32);
        }
        .btn-red-luxury-glow:hover {
          background: linear-gradient(135deg, #FF2E42 0%, #E8192C 100%);
          transform: translateY(-3px) scale(1.01);
          box-shadow: 0 14px 36px rgba(232, 25, 44, 0.42);
        }

        .btn-ghost-luxury {
          background: #F8FAFC;
          color: #0F172A;
          border: 1.5px solid #E2E8F0;
        }
        .btn-ghost-luxury:hover {
          border-color: #0F172A;
          background: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
        }

        /* ── Trust Strip ── */
        .pricing-trust-strip {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          margin-top: 3.5rem;
          padding: 1.25rem 2rem;
          background: #FAFAFC;
          border: 1px solid #ECECF1;
          border-radius: 100px;
          width: fit-content;
          margin-left: auto;
          margin-right: auto;
          flex-wrap: wrap;
        }

        .trust-strip-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.88rem;
          font-weight: 600;
          color: #334155;
        }

        .trust-strip-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #CBD5E1;
        }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .pricing-cards-grid {
            grid-template-columns: 1fr;
            max-width: 480px;
            margin: 0 auto;
            gap: 2.25rem;
          }
          .luxury-price-card.is-featured {
            transform: none;
          }
          .luxury-price-card.is-featured:hover {
            transform: translateY(-4px);
          }
        }

        @media (max-width: 640px) {
          .pricing-title-v4 {
            font-size: clamp(2rem, 8vw, 2.75rem);
          }
          .pricing-segmented-bar {
            border-radius: 16px;
            padding: 4px;
            width: 100%;
          }
          .pricing-seg-btn {
            flex: 1;
            justify-content: center;
            padding: 0.55rem 0.75rem;
            font-size: 0.8rem;
          }
          .seg-label {
            font-size: 0.78rem;
          }
          .luxury-price-card {
            padding: 2.25rem 1.35rem 1.5rem;
          }
          .pricing-trust-strip {
            border-radius: 20px;
            gap: 1rem;
            padding: 1rem 1.25rem;
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
};

export default Pricing;
