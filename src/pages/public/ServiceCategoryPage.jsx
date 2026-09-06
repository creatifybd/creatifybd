import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import { categories, getGigsByCategory } from '../../data/gigs';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const EASE_EXPO = [0.16, 1, 0.3, 1];

const ServiceCategoryPage = () => {
  const { categorySlug } = useParams();
  const category = categories[categorySlug];

  if (!category) {
    return <Navigate to="/services" replace />;
  }

  const [selectedGig, setSelectedGig] = useState(null);
  const [activePackageTab, setActivePackageTab] = useState('basic');

  const categoryGigs = getGigsByCategory(categorySlug);

  const categoryDetails = {
    'social-media-management': {
      headline: 'সোশ্যাল মিডিয়া ম্যানেজমেন্ট ও ব্র্যান্ড গ্রোথ সার্ভিস',
      subheadline: 'CreatifyBD বাংলাদেশের উদ্যোক্তা ও ব্যবসার জন্য নিয়ে এসেছে সম্পূর্ণ সোশ্যাল মিডিয়া সল্যুশন—কন্টেন্ট ক্যালেন্ডার, পোস্ট ডিজাইন, ক্যাপশন ও টার্গেটেড গ্রোথ স্ট্র্যাটেজি।',
      benefits: [
        'কনটেন্ট ক্যালেন্ডার: পুরো মাসের পোস্টের পরিকল্পনা ও অগ্রিম ড্রাফট রিভিউয়ের সুবিধা।',
        'হাই-কনভার্সন ক্রিয়েটিভস: সোশ্যাল মিডিয়া ফিডে গ্রাহকের দৃষ্টি আকর্ষণের মতো প্রিমিয়াম ডিজাইন।',
        'স্মার্ট ক্যাপশন ও হ্যাশট্যাগ: আকর্ষণীয় ও প্রফেশনাল ক্যাপশন রাইটিং এবং এসইও হ্যাশট্যাগ।',
        'মাসিক গ্রোথ রিপোর্ট: স্পষ্ট অ্যানালিটিক্স ও ভবিষ্যৎ দিকনির্দেশনা।'
      ],
      process: [
        { title: 'ব্র্যান্ড অডিট ও স্ট্র্যাটেজি', desc: 'আপনার বর্তমান সোশ্যাল মিডিয়া বিশ্লেষণ করে মাসিক কনটেন্ট রোডম্যাপ তৈরি।' },
        { title: 'ডিজাইন ও কনটেন্ট প্রোডাকশন', desc: 'অভিজ্ঞ ডিজাইনারদের মাধ্যমে কাস্টম পোস্ট ও রিলস তৈরি।' },
        { title: 'রিভিউ ও শিডিউলিং', desc: 'আপনার অনুমোদনের পর সেরা সময়ে পোস্ট পাবলিশ বা ডেলিভারি।' }
      ],
      faqs: [
        { question: 'কোন কোন প্ল্যাটফর্ম ম্যানেজ করেন?', answer: 'আমরা মূলত ফেসবুক, ইনস্টাগ্রাম, লিংকডইন ও ইউটিউব নিয়ে কাজ করি।' },
        { question: 'কনটেন্ট কীভাবে অ্যাপ্রুভ করব?', answer: 'আমরা আগে থেকেই পুরো মাসের কনটেন্ট ড্রাফট শেয়ার করি। আপনার চূড়ান্ত অনুমোদনের পরই তা পাবলিশ করা হয়।' },
        { question: 'পেইড অ্যাড ক্যাম্পেইন করেন?', answer: 'হ্যাঁ, অ্যাড ক্রিয়েটিভ ডিজাইনের পাশাপাশি পেইড অ্যাডস রান ও অপটিমাইজেশনের ব্যবস্থা রয়েছে।' }
      ],
      seo: {
        title: 'সোশ্যাল মিডিয়া ম্যানেজমেন্ট সার্ভিস | CreatifyBD',
        description: 'বাংলাদেশের বিশ্বস্ত সোশ্যাল মিডিয়া ম্যানেজমেন্ট ও ডিজিটাল মার্কেটিং এজেন্সি।',
        keywords: 'social media management bd, facebook marketing bangladesh, instagram marketing dhaka'
      }
    },
    'graphic-design': {
      headline: 'প্রফেশনাল গ্রাফিক ডিজাইন ও ব্র্যান্ডিং সার্ভিস',
      subheadline: 'লোগো ডিজাইন, ব্র্যান্ড আইডেন্টিটি, সোশ্যাল মিডিয়া ব্যানার ও প্রিন্ট মেটেরিয়ালস—আপনার ব্যবসার সম্পূর্ণ ভিজ্যুয়াল রূপান্তর।',
      benefits: [
        'ব্র্যান্ড স্টাইল গাইড: প্রতিটি মাধ্যমে কালার ও টাইপোগ্রাফির ১০০% ধারাবাহিকতা।',
        'অনন্য ভেক্টর লোগো: আধুনিক ও দীর্ঘস্থায়ী ব্র্যান্ড লোগো যা গ্রাহকের বিশ্বাস অর্জন করে।',
        'হাই-রেজোলিউশন ফাইলস: প্রিন্ট ও ডিজিটাল ব্যবহারের জন্য AI, EPS, SVG, PNG ও PDF ফরম্যাট।',
        'আনলিমিটেড ক্রিয়েটিভিটি: কোনো রেডিমেড টেমপ্লেট নয়, প্রতিটি ডিজাইন একদম শূন্য থেকে তৈরি।'
      ],
      process: [
        { title: 'ব্রিফিং ও মুডবোর্ড', desc: 'আপনার পছন্দ, কালার ও আইডিয়া বিস্তারিত জেনে নেওয়া।' },
        { title: 'কনসেপ্ট ডিজাইন', desc: 'একাধিক ইউনিক কনসেপ্ট তৈরি করে আপনার সাথে শেয়ার করা।' },
        { title: 'রিভিশন ও সোর্স ফাইল', desc: 'প্রয়োজনীয় সংশোধন শেষে সম্পূর্ণ এডিটেবল ফাইল বুঝিয়ে দেওয়া।' }
      ],
      faqs: [
        { question: 'কী কী ফাইল ফরম্যাট পাব?', answer: 'প্রিন্ট এবং ওয়েব ব্যবহারের জন্য AI, EPS, SVG, PDF, হাই-রেজোলিউশন PNG এবং JPEG ফরম্যাট পাবেন।' },
        { question: 'ডিজাইনে কতবার রিভিশন দেওয়া যাবে?', answer: 'আপনার শতভাগ সন্তুষ্টি নিশ্চিত করতে আমরা আন্তরিকতার সাথে প্রয়োজনীয় রিভিশন দিয়ে থাকি।' }
      ],
      seo: {
        title: 'গ্রাফিক ডিজাইন ও ব্র্যান্ডিং সার্ভিস | CreatifyBD',
        description: 'প্রফেশনাল গ্রাফিক ডিজাইন ও লোগো ডিজাইন সার্ভিস।',
        keywords: 'graphic design bangladesh, logo design agency dhaka'
      }
    },
    'video-editing': {
      headline: 'প্রফেশনাল ভিডিও এডিটিং ও রিলস প্রোডাকশন',
      subheadline: 'সোশ্যাল মিডিয়া রিলস, ইউটিউব ভিডিও, প্রোডাক্ট প্রমো ও অ্যাডস—আধুনিক ভিডিও এডিটিং দিয়ে অডিয়েন্সের নজর কাড়ুন।',
      benefits: [
        'শর্ট-ফর্ম রিলস ও টিকটক: ট্রেন্ডি ক্যাপশন, সাউন্ড ডিজাইন ও হুক-ফোকাসড এডিটিং।',
        'ইউটিউব ও প্রমোশনাল ভিডিও: সিনেমাটিক কাট, B-roll, সাবটাইটেল ও ব্যাকগ্রাউন্ড মিউজিক।',
        'হাই-কনভার্সন ভিডিও অ্যাডস: প্রথম ৩ সেকেন্ডেই দর্শককে ধরে রাখার শক্তিশালী কৌশল।',
        'ক্রিস্টাল ক্লিয়ার অডিও: নয়েজ রিমুভাল ও ভয়েস-ওভার ব্যালেন্সিং।'
      ],
      process: [
        { title: 'ফুটেজ ও ব্রিফ সাবমিট', desc: 'আপনার র ফুটেজ এবং পছন্দের স্টাইল শেয়ার করুন।' },
        { title: 'ক্রিয়েটিভ এডিটিং', desc: 'সাউন্ড ইফেক্ট, কালার গ্রেডিং ও ক্যাপশন যোগ করে ফাইনাল টাচ।' },
        { title: 'রিভিউ ও ডেলিভারি', desc: 'ড্রাফট দেখে ফিডব্যাক দিন এবং ফুল HD কোয়ালিটিতে ফাইল বুঝে নিন।' }
      ],
      faqs: [
        { question: 'ভিডিও ডেলিভারি ফরম্যাট কী হবে?', answer: 'ইউটিউব বা সোশ্যাল মিডিয়ার জন্য উপযুক্ত 1080p Full HD বা 4K MP4 ফরম্যাটে ডেলিভারি দেওয়া হয়।' },
        { question: 'সাবটাইটেল বা ক্যাপশন যুক্ত করা যাবে?', answer: 'হ্যাঁ, ট্রেন্ডি বাংলা ও ইংলিশ উভয় ভাষার ডায়নামিক সাবটাইটেল যুক্ত করে দেওয়া হয়।' }
      ],
      seo: {
        title: 'ভিডিও এডিটিং ও রিলস সার্ভিস | CreatifyBD',
        description: 'বাংলাদেশের সেরা ভিডিও এডিটিং ও রিলস মেকিং সার্ভিস।',
        keywords: 'video editing bangladesh, reels editing service dhaka'
      }
    },
    'website-design': {
      headline: 'রেসপন্সিভ ওয়েবসাইট ডিজাইন ও ডেভেলপমেন্ট',
      subheadline: 'ল্যান্ডিং পেজ, বিজনেস ওয়েবসাইট ও ই-কমার্স প্ল্যাটফর্ম—দ্রুতগতির, আধুনিক ও কনভার্সন-ফোকাসড ওয়েব সল্যুশন।',
      benefits: [
        '১০০% মোবাইল ফ্রেন্ডলি: মোবাইল, ট্যাব ও ডেক্সটপ সব ডিভাইসে নিখুঁত ডিসপ্লে।',
        'সুপার ফাস্ট স্পিড: দ্রুত লোডিং টাইম যা বাউন্স রেট কমিয়ে সেলস বাড়ায়।',
        'লিড কালেকশন ও ফর্ম: কাস্টমার ডাটাবেজ ও হোয়াটসঅ্যাপ ইন্টিগ্রেশন।',
        'বেসিক এসইও অপটিমাইজেশন: গুগলে দ্রুত ইনডেক্সিং ও র‌্যাঙ্কিংয়ের উপযোগী কোড।'
      ],
      process: [
        { title: 'প্ল্যানিং ও সাইটম্যাপ', desc: 'ওয়েবসাইটের কাঠামো, পেজ সংখ্যা ও ডিজাইন স্টাইল চূড়ান্ত করা।' },
        { title: 'ডিজাইন ও ডেভেলপমেন্ট', desc: 'আধুনিক ফ্রেমওয়ার্ক দিয়ে দ্রুতগতির ওয়েবসাইট তৈরি।' },
        { title: 'টেস্টিং ও লাইভ লঞ্চ', desc: 'সব ডিভাইসে পরীক্ষা-নিরীক্ষা শেষে আপনার ডোমেইনে লাইভ করা।' }
      ],
      faqs: [
        { question: 'কোন প্রযুক্তিতে ওয়েবসাইট তৈরি করেন?', answer: 'আমরা মূলত আধুনিক, দ্রুতগতির React / Next.js এবং ওয়ার্ডপ্রেস দিয়ে ওয়েবসাইট তৈরি করি।' },
        { question: 'ওয়েবসাইটের স্পিড কেমন থাকবে?', answer: 'আমাদের ওয়েবসাইটগুলো অপটিমাইজড কোড ও ছবির কারণে মাত্র ১-২ সেকেন্ডে লোড হয়।' }
      ],
      seo: {
        title: 'ওয়েবসাইট ডিজাইন ও ডেভেলপমেন্ট সার্ভিস | CreatifyBD',
        description: 'আধুনিক ও দ্রুতগতির বিজনেস ওয়েবসাইট ও ল্যান্ডিং পেজ ডিজাইন।',
        keywords: 'web design agency bangladesh, website development dhaka'
      }
    }
  };

  const details = categoryDetails[categorySlug] || {
    headline: category.name,
    subheadline: category.desc,
    benefits: [],
    process: [],
    seo: {},
    faqs: []
  };

  const formatBDT = (val, isSpecial = false) => {
    if (!val) return 'কাস্টম বাজেট';
    if (String(val).includes('কাস্টম') || String(val).includes('আলোচনা')) return 'কাস্টম বাজেট';
    if (isSpecial) return `৳${val}/মাস`;
    return 'কাস্টম বাজেট';
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": category.name,
    "name": details.headline,
    "description": details.subheadline,
    "provider": { "@type": "Organization", "name": "CreatifyBD", "url": "https://creatifybd.com" },
    "areaServed": "Bangladesh"
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://creatifybd.com" },
      { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://creatifybd.com/services" },
      { "@type": "ListItem", "position": 3, "name": category.name, "item": `https://creatifybd.com/services/${categorySlug}` }
    ]
  };

  const faqSchema = details.faqs && details.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": details.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
    }))
  } : null;

  const combinedSchema = faqSchema ? [serviceSchema, breadcrumbSchema, faqSchema] : [serviceSchema, breadcrumbSchema];

  return (
    <div className="category-landing-page">
      <SEO
        title={details.seo?.title || `${category.name} Services | CreatifyBD`}
        description={details.seo?.description || details.subheadline}
        keywords={details.seo?.keywords || `${categorySlug}, creatifybd services`}
        schema={combinedSchema}
      />

      <Navbar />

      {/* ── Hero ── */}
      <section className="scp-hero">
        <div className="scp-hero-inner">
          <motion.div
            className="scp-hero-icon"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: EASE_EXPO }}
          >
            {category.icon}
          </motion.div>

          <motion.h1
            className="scp-hero-title"
            initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.85, ease: EASE_EXPO, delay: 0.1 }}
          >
            {details.headline}
          </motion.h1>

          <motion.p
            className="scp-hero-desc"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE_EXPO, delay: 0.22 }}
          >
            {details.subheadline}
          </motion.p>

          <motion.div
            className="scp-hero-actions"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_EXPO, delay: 0.35 }}
          >
            <a href="#gigs-section" className="premium-btn">
              প্যাকেজসমূহ দেখুন <ArrowRight size={18} />
            </a>
            <Link to="/contact" className="premium-btn-outline">ফ্রি পরামর্শ নিন</Link>
          </motion.div>
        </div>
      </section>

      {/* ── Services / Gigs Grid ── */}
      <section id="gigs-section" className="scp-gigs-section">
        <div className="container">
          <motion.div
            className="section-header text-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: EASE_EXPO }}
          >
            <h2 className="section-h">
              উপলব্ধ <span className="red">সার্ভিস ও প্যাকেজসমূহ</span>
            </h2>
            <p className="section-sub">
              আপনার ব্যবসার প্রয়োজনীয় সার্ভিসটি নির্বাচন করে বিস্তারিত বিবরণ ও কাজের রূপরেখা দেখে নিন।
            </p>
          </motion.div>

          <div className="scp-gigs-grid">
            {categoryGigs.map((gig, idx) => (
              <motion.div
                key={gig.id}
                className={`scp-gig-card ${gig.isSpecialOffer ? 'scp-gig-special-card' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, ease: EASE_EXPO, delay: idx * 0.08 }}
                onClick={() => { setSelectedGig(gig); setActivePackageTab('basic'); }}
              >
                <div className="scp-gig-badge-row">
                  <span className="scp-gig-badge">{gig.subcategory || 'ক্রিয়েটিভ সার্ভিস'}</span>
                  {gig.isSpecialOffer && (
                    <span className="scp-special-tag">⚡ স্পেশাল অফার</span>
                  )}
                </div>
                <h3 className="scp-gig-title">{gig.shortTitle || gig.title}</h3>
                <p className="scp-gig-desc">{gig.overview}</p>

                <div className="scp-gig-rating">
                  <span style={{ color: '#FFB800' }}>★★★★★</span>
                  <span className="scp-rating-val">{gig.rating.toFixed(1)}</span>
                  <span className="scp-rating-count">({gig.reviewCount} রিভিউ)</span>
                </div>

                <div className="scp-gig-footer">
                  <div className="scp-gig-price">
                    <span className="scp-price-lbl">{gig.isSpecialOffer ? 'শুরু মাত্র' : 'প্রাইসিং'}</span>
                    <span className="scp-price-val">{formatBDT(gig.startingPrice, gig.isSpecialOffer)}</span>
                  </div>
                  <button className="scp-gig-btn">
                    প্যাকেজ দেখুন <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Custom plan CTA */}
          <div className="scp-custom-cta">
            <h3>আপনার কি কাস্টম কোনো প্যাকেজ প্রয়োজন?</h3>
            <p>আপনার ব্র্যান্ডের নির্দিষ্ট রিকোয়ারমেন্ট এবং বাজেট অনুযায়ী আমরা তৈরি করব কাস্টম সল্যুশন।</p>
            <Link to="/contact" className="premium-btn">
              আমাদের সাথে কথা বলুন <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Gig Modal ── */}
      <AnimatePresence>
        {selectedGig && (
          <div className="scp-modal-overlay" onClick={() => setSelectedGig(null)}>
            <motion.div
              className="scp-modal"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.28, ease: EASE_EXPO }}
            >
              <button className="scp-modal-close" onClick={() => setSelectedGig(null)} aria-label="Close">
                &times;
              </button>

              <div className="scp-modal-header">
                <span className="scp-gig-badge" style={{ marginBottom: '0.5rem' }}>{selectedGig.subcategory}</span>
                <h2 className="scp-modal-title">{selectedGig.title}</h2>
                <div className="scp-modal-rating">
                  <span style={{ color: '#FFB800' }}>★★★★★</span>
                  <span className="scp-rating-val">{selectedGig.rating.toFixed(1)}</span>
                  <span className="scp-rating-count">({selectedGig.reviewCount} ক্লায়েন্ট রিভিউ)</span>
                </div>
              </div>

              <div className="scp-modal-grid">
                {/* Left — details */}
                <div className="scp-modal-left">
                  <div>
                    <p className="scp-sec-label">বিবরণ</p>
                    <p className="scp-sec-text">{selectedGig.description}</p>
                  </div>
                  <div>
                    <p className="scp-sec-label">কাদের জন্য উপযোগী?</p>
                    <p className="scp-sec-text">{selectedGig.whoIsThisFor}</p>
                  </div>
                  {selectedGig.industries && (
                    <div>
                      <p className="scp-sec-label">প্রস্তাবিত ইন্ডাস্ট্রি</p>
                      <div className="scp-industries">
                        {selectedGig.industries.map((ind, i) => (
                          <span key={i} className="scp-industry-tag">{ind}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedGig.revisionPolicy && (
                    <div className="scp-revision-note">
                      <p className="scp-sec-label">রিভিশন পলিসি</p>
                      <p className="scp-sec-text" style={{ fontStyle: 'italic', color: '#777' }}>{selectedGig.revisionPolicy}</p>
                    </div>
                  )}
                </div>

                {/* Right — packages */}
                <div className="scp-pkg-panel">
                  {selectedGig.packages && (
                    <div className="scp-pkg-tabs">
                      {Object.keys(selectedGig.packages).map((key) => (
                        <button
                          key={key}
                          className={`scp-pkg-tab ${activePackageTab === key ? 'active' : ''}`}
                          onClick={() => setActivePackageTab(key)}
                        >
                          {key === 'basic' ? 'প্যাকেজ ০১' : key === 'standard' ? 'প্যাকেজ ০২' : 'প্যাকেজ ০৩'}
                        </button>
                      ))}
                    </div>
                  )}

                  {(() => {
                    const pkg = selectedGig.packages?.[activePackageTab] || Object.values(selectedGig.packages || {})[0];
                    if (!pkg) return null;
                    const isSpecial = selectedGig.isSpecialOffer;

                    return (
                      <>
                        <div className="scp-pkg-price-wrap">
                          {isSpecial ? (
                            <div className="scp-pkg-price">
                              <span>৳{pkg.price}</span>
                              <span className="scp-pkg-period">/মাস</span>
                            </div>
                          ) : (
                            <div className="scp-pkg-price scp-pkg-custom-price">কাস্টম বাজেট</div>
                          )}
                          {isSpecial && (
                            <span className="scp-special-pill">⚡ স্পেশাল অফার</span>
                          )}
                        </div>

                        <div className="scp-pkg-name">{pkg.name}</div>
                        {pkg.desc && <div className="scp-pkg-desc">{pkg.desc}</div>}
                        
                        <div className="scp-pkg-meta">
                          <span>⏱ {pkg.deliveryTime ? `${pkg.deliveryTime} দিন` : 'নির্ধারিত সময়ে'}</span>
                          <span>↺ {pkg.revisions === 10 || pkg.revisions === 'প্রয়োজন অনুযায়ী' ? 'প্রয়োজন অনুযায়ী রিভিশন' : `${pkg.revisions} বার রিভিশন`}</span>
                        </div>

                        <ul className="scp-pkg-features">
                          {pkg.deliverables?.map((del, i) => (
                            <li key={i}><span className="scp-check">✓</span>{del}</li>
                          ))}
                        </ul>

                        {isSpecial ? (
                          <a
                            href={`https://wa.me/8801951676600?text=${encodeURIComponent(`আসসালামু আলাইকুম CreatifyBD! আমি "${selectedGig.title}" সার্ভিসের "${pkg.name}" (৳${pkg.price}/মাস) স্পেশাল অফার প্যাকেজটি নিতে আগ্রহী।`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="scp-pkg-order-btn"
                          >
                            প্যাকেজটি শুরু করুন <ArrowRight size={16} />
                          </a>
                        ) : (
                          <a
                            href={`https://wa.me/8801951676600?text=${encodeURIComponent(`আসসালামু আলাইকুম CreatifyBD! আমি "${selectedGig.title}" সার্ভিসের (${pkg.name}) জন্য কাস্টম কোটেশন ও বাজেট জানতে চাই।`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="scp-pkg-order-btn"
                          >
                            কাস্টম কোটেশন নিন <ArrowRight size={16} />
                          </a>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Benefits / Why Us ── */}
      <section className="scp-benefits-section">
        <div className="container">
          <motion.div
            className="scp-benefits-grid"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.75, ease: EASE_EXPO }}
          >
            <div className="scp-benefits-text">
              <h2 className="section-h">কেন আমাদের সাথে কাজ করবেন?</h2>
              <p className="scp-benefits-intro">
                আমরা আন্তর্জাতিক মানের ক্রিয়েটিভ স্ট্যান্ডার্ড প্রদান করি সম্পূর্ণ স্থানীয় বাজেটে, যাতে প্রতিটি ব্যবসা সর্বোচ্চ রিটার্ন পায়।
              </p>
              <ul className="scp-benefits-list">
                {details.benefits.map((benefit, idx) => {
                  const [title, desc] = benefit.split(': ');
                  return (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.55, ease: EASE_EXPO, delay: idx * 0.08 }}
                    >
                      <CheckCircle2 size={20} className="scp-check-icon" />
                      <div>
                        <strong>{title}</strong>
                        {desc && <p>{desc}</p>}
                      </div>
                    </motion.li>
                  );
                })}
              </ul>
            </div>

            <div className="scp-advantage-card">
              <span className="scp-advantage-badge">ক্রিয়েটিফাই কোয়ালিটি স্ট্যান্ডার্ড</span>
              <h4>প্রফেশনাল প্রোডাকশন সুবিধা</h4>
              <p>আমরা প্রতিটি ব্র্যান্ডকে নিজস্ব ব্র্যান্ডের মতো আন্তরিকতা ও যত্নের সাথে ট্রিট করি।</p>
              <div className="scp-advantage-bars">
                <div className="scp-bar"><span>আন্তর্জাতিক কোয়ালিটি</span><strong>১০০%</strong></div>
                <div className="scp-bar"><span>নিখুঁত রিভিউ ও সমর্থন</span><strong>১০০%</strong></div>
                <div className="scp-bar"><span>সাশ্রয়ী ও ন্যায্য বাজেট</span><strong>সেরা ভ্যালু</strong></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Process ── */}
      <section className="scp-process-section">
        <div className="container">
          <motion.div
            className="section-header text-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: EASE_EXPO }}
          >
            <h2 className="section-h">আমাদের কাজের সহজ ধাপসমূহ</h2>
            <p className="section-sub">প্রথম ব্রিফিং থেকে শুরু করে ফাইনাল ডেলিভারি পর্যন্ত সম্পূর্ণ স্বচ্ছ কাজের রোডম্যাপ।</p>
          </motion.div>

          <div className="scp-process-grid">
            {details.process.map((step, idx) => (
              <motion.div
                key={idx}
                className="scp-step-card"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.65, ease: EASE_EXPO, delay: idx * 0.12 }}
              >
                <div className="scp-step-num">০{idx + 1}</div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        /* ── Page Wrapper ───────────────────────────────────────── */
        .category-landing-page {
          background: var(--surface, #ffffff);
          color: var(--ink, #0f0f12);
        }

        /* ── Hero ──────────────────────────────────────────────── */
        .scp-hero {
          padding: 8rem 2rem 5rem;
          text-align: center;
          background: #ffffff;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          position: relative;
          overflow: hidden;
        }
        .scp-hero::before {
          content: '';
          position: absolute;
          width: 800px; height: 600px;
          border-radius: 50%;
          top: -250px; left: 50%;
          transform: translateX(-50%);
          background: radial-gradient(circle, rgba(232,25,44,0.05) 0%, transparent 65%);
          pointer-events: none;
        }
        .scp-hero-inner {
          position: relative;
          max-width: 760px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
        }
        .scp-hero-icon {
          width: 64px; height: 64px;
          border-radius: 18px;
          background: rgba(232, 25, 44, 0.06);
          border: 1px solid rgba(232, 25, 44, 0.12);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.75rem;
          color: var(--brand-red);
          margin-bottom: 0.25rem;
        }
        .scp-hero-title {
          font-size: clamp(1.85rem, 4.5vw, 3.2rem);
          font-weight: 900;
          line-height: 1.1;
          color: var(--ink, #0f0f12);
          letter-spacing: -0.03em;
          margin: 0;
        }
        .scp-hero-desc {
          font-size: clamp(0.93rem, 2vw, 1.08rem);
          color: var(--muted, #666);
          line-height: 1.7;
          max-width: 600px;
          margin: 0;
        }
        .scp-hero-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 0.5rem;
        }

        /* ── Gigs Section ─────────────────────────────────────── */
        .scp-gigs-section {
          padding: 5rem 2rem;
          background: #f7f8fa;
        }
        .scp-gigs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
          max-width: 1200px;
          margin: 2.5rem auto 0;
        }

        /* Gig card */
        .scp-gig-card {
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 16px;
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          min-height: 270px;
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s, border-color 0.25s;
        }
        .scp-gig-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(232,25,44,0.14);
          border-color: rgba(232,25,44,0.2);
        }
        .scp-gig-special-card {
          border: 1.5px solid rgba(232,25,44,0.25);
          background: linear-gradient(170deg, #ffffff 80%, rgba(232,25,44,0.02) 100%);
        }
        .scp-gig-badge-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .scp-gig-badge {
          background: rgba(232,25,44,0.08);
          color: var(--brand-red);
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 0.25rem 0.65rem;
          border-radius: 100px;
          align-self: flex-start;
          margin-bottom: 0;
        }
        .scp-special-tag {
          font-size: 0.68rem;
          font-weight: 800;
          color: #fff;
          background: linear-gradient(135deg, #E8192C 0%, #B91C1C 100%);
          padding: 0.22rem 0.6rem;
          border-radius: 100px;
          box-shadow: 0 2px 8px rgba(232,25,44,0.25);
          white-space: nowrap;
        }
        .scp-gig-title {
          font-size: 1.08rem;
          font-weight: 800;
          color: var(--ink, #0f0f12);
          line-height: 1.3;
          margin: 0 0 0.5rem;
        }
        .scp-gig-desc {
          font-size: 0.82rem;
          color: var(--muted, #666);
          line-height: 1.55;
          flex: 1;
          margin: 0 0 1rem;
        }
        .scp-gig-rating {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          margin-bottom: 1.1rem;
          font-size: 0.9rem;
        }
        .scp-rating-val {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--ink, #0f0f12);
        }
        .scp-rating-count {
          font-size: 0.74rem;
          color: #999;
        }
        .scp-gig-footer {
          border-top: 1px solid rgba(0,0,0,0.06);
          padding-top: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .scp-gig-price {
          display: flex;
          flex-direction: column;
        }
        .scp-price-lbl {
          font-size: 0.62rem;
          color: #999;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.04em;
        }
        .scp-price-val {
          font-size: 1.2rem;
          font-weight: 900;
          color: var(--ink, #0f0f12);
        }
        .scp-gig-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.48rem 0.9rem;
          background: #f0f1f3;
          border: 1px solid rgba(0,0,0,0.07);
          color: var(--ink, #0f0f12);
          font-size: 0.76rem;
          font-weight: 700;
          border-radius: 100px;
          cursor: pointer;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
        }
        .scp-gig-card:hover .scp-gig-btn {
          background: var(--brand-red);
          border-color: var(--brand-red);
          color: #fff;
        }

        /* Custom CTA block */
        .scp-custom-cta {
          margin-top: 3.5rem;
          text-align: center;
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.06);
          padding: 2.5rem;
          border-radius: 16px;
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
        }
        .scp-custom-cta h3 {
          font-size: 1.2rem;
          color: var(--ink, #0f0f12);
          margin-bottom: 0.4rem;
          font-weight: 800;
        }
        .scp-custom-cta p {
          color: var(--muted, #666);
          font-size: 0.88rem;
          margin-bottom: 1.25rem;
        }
        .scp-custom-cta { margin-top: 3.5rem; }

        /* ── Modal ─────────────────────────────────────────────── */
        .scp-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10,10,15,0.6);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100005;
          padding: 1.5rem;
        }
        .scp-modal {
          background: #ffffff;
          width: 100%;
          max-width: 820px;
          border-radius: 20px;
          box-shadow: 0 30px 80px rgba(0,0,0,0.25);
          border: 1px solid rgba(0,0,0,0.06);
          position: relative;
          max-height: 90vh;
          overflow-y: auto;
        }
        .scp-modal-close {
          position: absolute;
          right: 1.25rem;
          top: 1.25rem;
          background: #f1f2f4;
          border: none;
          width: 34px; height: 34px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: #555;
          font-size: 1.4rem;
          line-height: 1;
          transition: background 0.2s, color 0.2s;
        }
        .scp-modal-close:hover { background: var(--brand-red); color: white; }
        .scp-modal-header {
          padding: 2rem 2rem 1.25rem;
          border-bottom: 1px solid rgba(0,0,0,0.06);
        }
        .scp-modal-title {
          font-size: 1.6rem;
          font-weight: 900;
          color: var(--ink, #0f0f12);
          margin: 0.35rem 2.5rem 0 0;
          letter-spacing: -0.02em;
        }
        .scp-modal-rating {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          margin-top: 0.4rem;
          font-size: 0.9rem;
        }
        .scp-modal-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 2rem;
          padding: 1.75rem 2rem 2rem;
        }
        .scp-modal-left {
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
        }
        .scp-sec-label {
          font-size: 0.68rem;
          font-weight: 800;
          color: var(--brand-red);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin: 0 0 0.3rem;
        }
        .scp-sec-text {
          font-size: 0.875rem;
          color: var(--ink, #333);
          line-height: 1.6;
          margin: 0;
        }
        .scp-industries {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-top: 0.35rem;
        }
        .scp-industry-tag {
          background: #f0f1f3;
          color: #555;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
        }
        .scp-revision-note {
          border-top: 1px solid rgba(0,0,0,0.06);
          padding-top: 1rem;
        }

        /* Package Panel */
        .scp-pkg-panel {
          background: #f7f8fa;
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 16px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          align-self: start;
          position: sticky;
          top: 1rem;
        }
        .scp-pkg-tabs {
          display: flex;
          background: #eef0f2;
          padding: 0.2rem;
          border-radius: 10px;
          margin-bottom: 1.1rem;
        }
        .scp-pkg-tab {
          flex: 1;
          background: transparent;
          border: none;
          padding: 0.52rem 0;
          font-size: 0.76rem;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
          color: #888;
          transition: background 0.2s, color 0.2s, box-shadow 0.2s;
          letter-spacing: 0.03em;
        }
        .scp-pkg-tab.active {
          background: #ffffff;
          color: var(--ink, #0f0f12);
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
        }
        .scp-pkg-price-wrap {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          margin-bottom: 0.4rem;
        }
        .scp-pkg-price {
          font-size: 2.1rem;
          font-weight: 900;
          color: var(--ink, #0f0f12);
          letter-spacing: -0.04em;
          line-height: 1;
          display: flex;
          align-items: baseline;
          gap: 2px;
        }
        .scp-pkg-period {
          font-size: 0.9rem;
          font-weight: 600;
          color: #777;
        }
        .scp-pkg-custom-price {
          font-size: 1.65rem;
          color: var(--ink, #0f0f12);
        }
        .scp-special-pill {
          font-size: 0.68rem;
          font-weight: 800;
          color: #fff;
          background: linear-gradient(135deg, #E8192C 0%, #B91C1C 100%);
          padding: 0.2rem 0.6rem;
          border-radius: 100px;
          white-space: nowrap;
        }
        .scp-pkg-name {
          font-size: 1rem;
          font-weight: 800;
          color: var(--ink, #0f0f12);
          margin-bottom: 0.3rem;
        }
        .scp-pkg-desc {
          font-size: 0.8rem;
          color: var(--muted, #666);
          line-height: 1.5;
          margin-bottom: 0.9rem;
        }
        .scp-pkg-meta {
          display: flex;
          gap: 0.75rem;
          font-size: 0.74rem;
          color: var(--muted, #555);
          font-weight: 600;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          padding-bottom: 0.85rem;
          margin-bottom: 0.9rem;
          flex-wrap: wrap;
        }
        .scp-pkg-features {
          list-style: none;
          padding: 0;
          margin: 0 0 1.1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .scp-pkg-features li {
          font-size: 0.8rem;
          color: var(--ink, #333);
          display: flex;
          align-items: flex-start;
          gap: 0.45rem;
          line-height: 1.4;
        }
        .scp-check {
          color: var(--brand-red);
          font-weight: bold;
          flex-shrink: 0;
          line-height: 1.5;
        }
        .scp-pkg-order-btn {
          width: 100%;
          padding: 0.8rem;
          background: var(--brand-red);
          color: white;
          border: none;
          font-weight: 800;
          font-size: 0.875rem;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          box-shadow: 0 6px 20px rgba(232,25,44,0.22);
          text-decoration: none;
        }
        .scp-pkg-order-btn:hover {
          background: var(--brand-red-dark, #c01020);
          transform: translateY(-1px);
          box-shadow: 0 10px 24px rgba(232,25,44,0.3);
          color: white;
        }

        /* Modal responsive */
        @media (max-width: 768px) {
          .scp-modal-grid { grid-template-columns: 1fr; gap: 1.25rem; padding: 1.25rem; }
          .scp-modal-header { padding: 1.5rem 1.5rem 1rem; }
        }

        /* ── Benefits Section ─────────────────────────────────── */
        .scp-benefits-section {
          padding: 5rem 2rem;
          background: #ffffff;
          position: relative;
          overflow: hidden;
        }
        .scp-benefits-section::before {
          content: '';
          position: absolute;
          width: 600px; height: 500px;
          border-radius: 50%;
          top: -150px; right: -100px;
          background: radial-gradient(circle, rgba(232,25,44,0.04) 0%, transparent 65%);
          pointer-events: none;
        }
        .scp-benefits-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 4rem;
          max-width: 1200px;
          margin: 0 auto;
          align-items: center;
          position: relative;
        }
        .scp-benefits-text h2 {
          color: var(--ink, #0f0f12);
        }
        .scp-benefits-intro {
          color: var(--muted, #666);
          margin-bottom: 2rem;
          font-size: 1rem;
          line-height: 1.65;
        }
        .scp-benefits-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }
        .scp-benefits-list li {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }
        .scp-benefits-list li strong {
          color: var(--ink, #0f0f12);
          font-size: 0.95rem;
          display: block;
          margin-bottom: 0.15rem;
        }
        .scp-benefits-list li p {
          color: var(--muted, #666);
          font-size: 0.85rem;
          line-height: 1.5;
          margin: 0;
        }
        .scp-check-icon {
          color: var(--brand-red);
          flex-shrink: 0;
          margin-top: 0.1rem;
        }

        /* Advantage card */
        .scp-advantage-card {
          background: #f7f8fa;
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 16px;
          padding: 1.75rem;
          box-shadow: 0 6px 24px rgba(0,0,0,0.05);
          position: relative;
          overflow: hidden;
        }
        .scp-advantage-card::before {
          content: '';
          position: absolute;
          width: 180px; height: 180px;
          border-radius: 50%;
          top: -60px; right: -30px;
          background: radial-gradient(circle, rgba(232,25,44,0.06) 0%, transparent 65%);
          pointer-events: none;
        }
        .scp-advantage-badge {
          background: rgba(232,25,44,0.1);
          color: var(--brand-red);
          font-size: 0.65rem;
          font-weight: 700;
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
          display: inline-block;
          margin-bottom: 0.75rem;
          letter-spacing: 0.05em;
        }
        .scp-advantage-card h4 {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--ink, #0f0f12);
          margin: 0 0 0.4rem;
        }
        .scp-advantage-card > p {
          font-size: 0.83rem;
          color: var(--muted, #666);
          line-height: 1.55;
          margin: 0 0 1.25rem;
        }
        .scp-advantage-bars {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .scp-bar {
          display: flex;
          justify-content: space-between;
          padding: 0.65rem 0.85rem;
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 8px;
          font-size: 0.8rem;
        }
        .scp-bar span { color: var(--muted, #666); }
        .scp-bar strong { color: var(--brand-red); font-weight: 800; }

        /* ── Process Section ──────────────────────────────────── */
        .scp-process-section {
          padding: 5rem 2rem;
          background: #f7f8fa;
        }
        .scp-process-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          max-width: 1200px;
          margin: 3rem auto 0;
        }
        .scp-step-card {
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 14px;
          padding: 2rem 1.75rem;
          position: relative;
          overflow: hidden;
          transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
        }
        .scp-step-card::before {
          content: '';
          position: absolute;
          width: 180px; height: 180px;
          border-radius: 50%;
          top: -70px; right: -30px;
          background: radial-gradient(circle, rgba(232,25,44,0.04) 0%, transparent 65%);
          pointer-events: none;
        }
        .scp-step-card:hover {
          border-color: rgba(232,25,44,0.18);
          box-shadow: 0 8px 24px rgba(0,0,0,0.06);
          transform: translateY(-3px);
        }
        .scp-step-num {
          font-size: 2.5rem;
          font-weight: 900;
          color: rgba(0,0,0,0.04);
          position: absolute;
          top: 1rem;
          right: 1.25rem;
          letter-spacing: -0.04em;
          line-height: 1;
        }
        .scp-step-card h4 {
          font-size: 1.05rem;
          color: var(--ink, #0f0f12);
          font-weight: 800;
          margin: 0 0 0.6rem;
        }
        .scp-step-card p {
          font-size: 0.85rem;
          color: var(--muted, #666);
          line-height: 1.6;
          margin: 0;
        }

        /* ── Responsive ───────────────────────────────────────── */
        @media (max-width: 968px) {
          .scp-benefits-grid { grid-template-columns: 1fr; gap: 2.5rem; }
          .scp-process-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 640px) {
          .scp-hero { padding: 6.5rem 1.25rem 4rem; }
          .scp-gigs-grid { grid-template-columns: 1fr; }
          .scp-hero-actions { flex-direction: column; align-items: center; }
          .scp-process-grid { grid-template-columns: 1fr; }
          .scp-benefits-grid { gap: 2rem; }
        }
      `}</style>
    </div>
  );
};

export default ServiceCategoryPage;
