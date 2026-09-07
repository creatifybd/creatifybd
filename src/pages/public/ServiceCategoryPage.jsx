import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import { categories, getGigsByCategory } from '../../data/gigs';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  CheckCircle2, 
  MessageSquare, 
  ChevronDown, 
  Clock, 
  RotateCcw, 
  Sparkles, 
  ShieldCheck, 
  Star,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

const EASE_EXPO = [0.16, 1, 0.3, 1];

const ServiceCategoryPage = () => {
  const { categorySlug } = useParams();
  const category = categories[categorySlug];

  if (!category) {
    return <Navigate to="/services" replace />;
  }

  const [selectedGig, setSelectedGig] = useState(null);
  const [activePackageTab, setActivePackageTab] = useState('basic');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const categoryGigs = getGigsByCategory(categorySlug);

  const categoryDetails = {
    'social-media-management': {
      tagline: 'সম্পূর্ণ সোশ্যাল মিডিয়া গ্রোথ সল্যুশন',
      headline: 'সোশ্যাল মিডিয়া ম্যানেজমেন্ট ও ব্র্যান্ড গ্রোথ সার্ভিস',
      subheadline: 'CreatifyBD বাংলাদেশের উদ্যোক্তা ও ব্যবসার জন্য নিয়ে এসেছে প্রিমিয়াম সোশ্যাল মিডিয়া সল্যুশন—কন্টেন্ট ক্যালেন্ডার, নজরকাড়া পোস্ট ডিজাইন, ক্যাপশন ও টার্গেটেড গ্রোথ স্ট্র্যাটেজি।',
      benefits: [
        'কনটেন্ট ক্যালেন্ডার: পুরো মাসের পোস্টের সুনির্দিষ্ট পরিকল্পনা ও অগ্রিম ড্রাফট রিভিউয়ের সুবিধা।',
        'হাই-কনভার্সন ক্রিয়েটিভস: সোশ্যাল মিডিয়া ফিডে গ্রাহকের দৃষ্টি আকর্ষণের মতো প্রিমিয়াম ডিজাইন ও রিলস।',
        'স্মার্ট ক্যাপশন ও হ্যাশট্যাগ: আকর্ষণীয় বাংলা/ইংলিশ ক্যাপশন রাইটিং এবং এসইও নিশ হ্যাশট্যাগ।',
        'মাসিক গ্রোথ রিপোর্ট: স্পষ্ট অ্যানালিটিক্স, পারফরম্যান্স রিভিউ ও ভবিষ্যৎ দিকনির্দেশনা।'
      ],
      process: [
        { title: 'ব্র্যান্ড অডিট ও রোডম্যাপ', desc: 'আপনার বর্তমান সোশ্যাল মিডিয়া বিশ্লেষণ করে মাসিক কনটেন্ট ক্যালেন্ডার তৈরি।' },
        { title: 'ডিজাইন ও কনটেন্ট প্রোডাকশন', desc: 'অভিজ্ঞ ডিজাইনারদের মাধ্যমে কাস্টম পোস্টার, ব্যানার ও রিলস ভিডিও তৈরি।' },
        { title: 'রিভিউ ও সিডিউলিং', desc: 'আপনার চূড়ান্ত অনুমোদনের পর সেরা সময়ে পোস্ট পাবলিশ বা সরাসরি ডেলিভারি।' }
      ],
      faqs: [
        { question: 'কোন কোন প্ল্যাটফর্ম ম্যানেজ করেন?', answer: 'আমরা মূলত ফেসবুক, ইনস্টাগ্রাম, লিংকডইন ও ইউটিউব নিয়ে প্রফেশনালি কাজ করি।' },
        { question: 'কনটেন্ট কীভাবে অ্যাপ্রুভ করব?', answer: 'আমরা কাজ শুরুর আগে পুরো মাসের কনটেন্ট ড্রাফট গুগল ড্রাইভ/শিটে শেয়ার করি। আপনার চূড়ান্ত অনুমোদনের পরই তা পাবলিশ করা হয়।' },
        { question: 'পেইড অ্যাড ক্যাম্পেইন করেন?', answer: 'হ্যাঁ, অ্যাড ক্রিয়েটিভ ডিজাইনের পাশাপাশি আমরা মেটা পেইড অ্যাডস রান ও ক্যাম্পেইন অপটিমাইজ করি।' },
        { question: 'পেমেন্ট মেথড কী?', answer: 'আমরা বিকাশ, নগদ ও ব্যাংক ট্রান্সফারের মাধ্যমে ৫০% অগ্রিম ও কাজ শুরুর প্রক্রিয়ায় পেমেন্ট গ্রহণ করি।' }
      ],
      seo: {
        title: 'সোশ্যাল মিডিয়া ম্যানেজমেন্ট সার্ভিস | CreatifyBD',
        description: 'বাংলাদেশের বিশ্বস্ত সোশ্যাল মিডিয়া ম্যানেজমেন্ট ও ডিজিটাল মার্কেটিং এজেন্সি। সম্পূর্ণ মাসিক কনটেন্ট প্ল্যানিং ও ডিজাইন।',
        keywords: 'social media management bd, facebook marketing bangladesh, instagram marketing dhaka, smm package bangladesh'
      }
    },
    'graphic-design': {
      tagline: 'প্রিমিয়াম ভিজ্যুয়াল ব্র্যান্ডিং ও গ্রাফিক্স',
      headline: 'প্রফেশনাল গ্রাফিক ডিজাইন ও ব্র্যান্ড আইডেন্টিটি সার্ভিস',
      subheadline: 'ইউনিক লোগো ডিজাইন, সম্পূর্ণ ব্র্যান্ড আইডেন্টিটি, সোশ্যাল মিডিয়া ব্যানার ও প্রিন্ট মেটেরিয়ালস—আপনার ব্যবসার সম্পূর্ণ প্রিমিয়াম ভিজ্যুয়াল রূপান্তর।',
      benefits: [
        'ব্র্যান্ড স্টাইল গাইড: প্রতিটি মাধ্যমে কালার, ফন্ট ও টাইপোগ্রাফির ১০০% ভিজ্যুয়াল ধারাবাহিকতা।',
        'অনন্য ভেক্টর লোগো: আধুনিক, মিনিমাল ও দীর্ঘস্থায়ী ব্র্যান্ড লোগো যা গ্রাহকের গভীর বিশ্বাস তৈরি করে।',
        'হাই-রেজোলিউশন ফাইলস: প্রিন্ট ও ওয়েব ব্যবহারের জন্য AI, EPS, SVG, PNG ও PDF ফরম্যাট।',
        '১০০% ইউনিক ক্রিয়েটিভিটি: কোনো রেডিমেড টেমপ্লেট নয়, প্রতিটি ডিজাইন একদম স্ক্র্যাচ থেকে তৈরি।'
      ],
      process: [
        { title: 'ব্রিফিং ও মুডবোর্ড', desc: 'আপনার বিজনেসের পছন্দ, নিশ, কালার ও আইডিয়া বিস্তারিত জেনে নেওয়া।' },
        { title: 'কনসেপ্ট ডিজাইন', desc: 'একাধিক ইউনিক কনসেপ্ট তৈরি করে আপনার সাথে শেয়ার করা।' },
        { title: 'রিভিশন ও সোর্স ফাইল', desc: 'প্রয়োজনীয় সংশোধন শেষে সম্পূর্ণ এডিটেবল ভেক্টর ফাইল বুঝিয়ে দেওয়া।' }
      ],
      faqs: [
        { question: 'কী কী ফাইল ফরম্যাট পাব?', answer: 'প্রিন্ট এবং ওয়েব ব্যবহারের জন্য AI, EPS, SVG, PDF, হাই-রেজোলিউশন PNG এবং JPEG ফরম্যাট পাবেন।' },
        { question: 'ডিজাইনে কতবার রিভিশন দেওয়া যাবে?', answer: 'আপনার শতভাগ সন্তুষ্টি নিশ্চিত করতে আমরা আন্তরিকতার সাথে প্রয়োজনীয় রিভিশন দিয়ে থাকি।' },
        { question: 'লোগো ডিজাইনে কতদিন সময় লাগে?', answer: 'সাধারণত ৩ থেকে ৫ কার্যদিবসের মধ্যে প্রাথমিক কনসেপ্ট ডেলিভারি দেওয়া হয়।' }
      ],
      seo: {
        title: 'গ্রাফিক ডিজাইন ও ব্র্যান্ডিং সার্ভিস | CreatifyBD',
        description: 'প্রফেশনাল গ্রাফিক ডিজাইন ও লোগো ডিজাইন সার্ভিস। ইউনিক ও আকর্ষণীয় ব্র্যান্ড আইডেন্টিটি।',
        keywords: 'graphic design bangladesh, logo design agency dhaka, brand identity design bangladesh'
      }
    },
    'video-editing': {
      tagline: 'হাই-কনভার্সন ভিডিও এডিটিং ও রিলস',
      headline: 'প্রফেশনাল ভিডিও এডিটিং ও রিলস প্রোডাকশন সার্ভিস',
      subheadline: 'সোশ্যাল মিডিয়া রিলস, টিকটক, ইউটিউব ভিডিও, প্রোডাক্ট প্রমো ও সেলস অ্যাডস—আধুনিক ভিডিও এডিটিং দিয়ে অডিয়েন্সের শতভাগ নজর কাড়ুন।',
      benefits: [
        'শর্ট-ফর্ম রিলস ও টিকটক: ট্রেন্ডি ডায়নামিক ক্যাপশন, সাউন্ড ডিজাইন ও হুক-ফোকাসড কাট।',
        'ইউটিউব ও প্রমোশনাল ভিডিও: সিনেমাটিক কাট, B-roll, সাবটাইটেল ও ব্যাকগ্রাউন্ড মিউজিক ব্যালেন্সিং।',
        'হাই-কনভার্সন ভিডিও অ্যাডস: প্রথম ৩ সেকেন্ডেই দর্শককে ধরে রাখার শক্তিশালী সেলস কৌশল।',
        'ক্রিস্টাল ক্লিয়ার অডিও: নয়েজ রিমুভাল ও প্রফেশনাল সাউন্ড মাস্টারিং।'
      ],
      process: [
        { title: 'ফুটেজ ও ব্রিফ সাবমিট', desc: 'আপনার র ভিডিও ফুটেজ এবং পছন্দের স্টাইল বা রেফারেন্স শেয়ার করুন।' },
        { title: 'ক্রিয়েটিভ এডিটিং', desc: 'সাউন্ড ইফেক্ট, কালার গ্রেডিং ও ক্যাপশন যোগ করে ফাইনাল টাচ।' },
        { title: 'রিভিউ ও ডেলিভারি', desc: 'ড্রাফট দেখে ফিডব্যাক দিন এবং ফুল HD বা 4K কোয়ালিটিতে ফাইল বুঝে নিন।' }
      ],
      faqs: [
        { question: 'ভিডিও ডেলিভারি ফরম্যাট কী হবে?', answer: 'ইউটিউব বা সোশ্যাল মিডিয়ার জন্য উপযুক্ত 1080p Full HD বা 4K MP4 ফরম্যাটে ডেলিভারি দেওয়া হয়।' },
        { question: 'সাবটাইটেল বা ক্যাপশন যুক্ত করা যাবে?', answer: 'হ্যাঁ, ট্রেন্ডি বাংলা ও ইংলিশ উভয় ভাষার ডায়নামিক সাবটাইটেল ও ইমোজি যুক্ত করে দেওয়া হয়।' },
        { question: 'একটি রিলস এডিটে কতদিন সময় লাগে?', answer: 'সাধারণত ২৪ থেকে ৪৮ ঘণ্টার মধ্যে রিলস বা শর্ট ভিডিও এডিট ডেলিভারি করা হয়।' }
      ],
      seo: {
        title: 'ভিডিও এডিটিং ও রিলস সার্ভিস | CreatifyBD',
        description: 'বাংলাদেশের সেরা ভিডিও এডিটিং ও রিলস মেকিং সার্ভিস। হাই-কনভার্সন ভিডিও অ্যাডস ও ইউটিউব ভিডিও এডিটিং।',
        keywords: 'video editing bangladesh, reels editing service dhaka, promo video production'
      }
    },
    'website-design': {
      tagline: 'সুপার ফাস্ট ওয়েবসাইট ও ল্যান্ডিং পেজ',
      headline: 'রেসপন্সিভ ওয়েবসাইট ডিজাইন ও ওয়েব ডেভেলপমেন্ট',
      subheadline: 'হাই-কনভার্সন ল্যান্ডিং পেজ, বিজনেস ওয়েবসাইট ও কাস্টম ওয়েব পোর্টাল—দ্রুতগতির, আধুনিক ও সেলস-ফোকাসড ওয়েব সল্যুশন।',
      benefits: [
        '১০০% মোবাইল ফ্রেন্ডলি: মোবাইল, ট্যাব ও ডেক্সটপ সব ডিভাইসে নিখুঁত ও চমৎকার ডিসপ্লে।',
        'সুপার ফাস্ট স্পিড: মাত্র ১-২ সেকেন্ডে লোড হয়, যা বাউন্স রেট কমিয়ে কাস্টমার সেলস বাড়ায়।',
        'লিড কালেকশন ও WhatsApp: সরাসরি কাস্টমার ইনকোয়ারি ফর্ম ও ১-ক্লিক হোয়াটসঅ্যাপ ইন্টিগ্রেশন।',
        'বেসিক এসইও অপটিমাইজেশন: গুগলে দ্রুত ইনডেক্সিং ও র‌্যাঙ্কিংয়ের উপযোগী ক্লিন কোডিং।'
      ],
      process: [
        { title: 'প্ল্যানিং ও সাইটম্যাপ', desc: 'ওয়েবসাইটের কাঠামো, প্রয়োজনীয় পেজ সংখ্যা ও ডিজাইন স্টাইল চূড়ান্ত করা।' },
        { title: 'ডিজাইন ও ডেভেলপমেন্ট', desc: 'আধুনিক ফ্রেমওয়ার্ক (React/WordPress) দিয়ে দ্রুতগতির ওয়েবসাইট তৈরি।' },
        { title: 'টেস্টিং ও লাইভ লঞ্চ', desc: 'সব ডিভাইসে পরীক্ষা-নিরীক্ষা শেষে আপনার ডোমেইনে সফলভাবে লাইভ করা।' }
      ],
      faqs: [
        { question: 'কোন প্রযুক্তিতে ওয়েবসাইট তৈরি করেন?', answer: 'আমরা মূলত আধুনিক, দ্রুতগতির React / Next.js এবং সহজে ম্যানেজ করার জন্য ওয়ার্ডপ্রেস দিয়ে ওয়েবসাইট তৈরি করি।' },
        { question: 'ওয়েবসাইটের স্পিড কেমন থাকবে?', answer: 'আমাদের ওয়েবসাইটগুলো অপটিমাইজড কোড ও ছবির কারণে মাত্র ১-২ সেকেন্ডে লোড হয় (Google PageSpeed 90+ Score)।' },
        { question: 'ডোমেইন ও হোস্টিং কি আপনারা দেন?', answer: 'আমরা আপনার পছন্দের ডোমেইন-হোস্টিং কানেক্ট করে দিই অথবা প্রয়োজনে প্রিমিয়াম হোস্টিং সেটআপে সম্পূর্ণ সহায়তা করি।' }
      ],
      seo: {
        title: 'ওয়েবসাইট ডিজাইন ও ডেভেলপমেন্ট সার্ভিস | CreatifyBD',
        description: 'আধুনিক ও দ্রুতগতির বিজনেস ওয়েবসাইট ও ল্যান্ডিং পেজ ডিজাইন। মোবাইল ফ্রেন্ডলি ও এসইও অপটিমাইজড।',
        keywords: 'web design agency bangladesh, website development dhaka, landing page design bd'
      }
    }
  };

  const details = categoryDetails[categorySlug] || {
    tagline: 'প্রিমিয়াম ক্রিয়েটিভ সার্ভিস',
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

      {/* ── Category Hero ── */}
      <section className="scp-hero">
        <div className="container">
          <div className="scp-hero-inner">
            {/* Breadcrumb */}
            <nav className="scp-breadcrumb" aria-label="Breadcrumb">
              <Link to="/">হোম</Link>
              <ChevronRight size={14} className="breadcrumb-arrow" />
              <Link to="/services">সার্ভিসসমূহ</Link>
              <ChevronRight size={14} className="breadcrumb-arrow" />
              <span className="current">{category.name}</span>
            </nav>

            <motion.div
              className="scp-badge"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE_EXPO }}
            >
              <Sparkles size={14} />
              <span>{details.tagline || 'CreatifyBD অফিসিয়াল সার্ভিস'}</span>
            </motion.div>

            <motion.h1
              className="scp-hero-title"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE_EXPO, delay: 0.08 }}
            >
              {details.headline}
            </motion.h1>

            <motion.p
              className="scp-hero-desc"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_EXPO, delay: 0.16 }}
            >
              {details.subheadline}
            </motion.p>

            <motion.div
              className="scp-hero-actions"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE_EXPO, delay: 0.24 }}
            >
              <a href="#gigs-section" className="btn-primary-luxury">
                প্যাকেজ ও বিবরণ দেখুন <ArrowRight size={17} />
              </a>
              <a
                href={`https://wa.me/8801951676600?text=${encodeURIComponent(`আসসালামু আলাইকুম CreatifyBD! আমি "${category.name}" সার্ভিস সম্পর্কে জানতে আগ্রহী।`)}`}
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp-luxury"
              >
                <MessageSquare size={17} /> WhatsApp-এ সরাসরি কথা বলুন
              </a>
            </motion.div>

            {/* Trust Highlights */}
            <motion.div 
              className="scp-hero-highlights"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.35 }}
            >
              <div className="highlight-item">
                <CheckCircle2 size={16} className="highlight-icon" />
                <span>১০০% কাস্টম ডিজাইন</span>
              </div>
              <div className="highlight-item">
                <Clock size={16} className="highlight-icon" />
                <span>দ্রুত ডেলিভারি ও সাপোর্ট</span>
              </div>
              <div className="highlight-item">
                <RotateCcw size={16} className="highlight-icon" />
                <span>প্রয়োজন অনুযায়ী রিভিশন</span>
              </div>
              <div className="highlight-item">
                <ShieldCheck size={16} className="highlight-icon" />
                <span>সার্বক্ষণিক সহায়তা</span>
              </div>
            </motion.div>
          </div>
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
            <span className="scp-section-tag">সার্ভিস ক্যাটালগ</span>
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
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, ease: EASE_EXPO, delay: idx * 0.06 }}
                onClick={() => { setSelectedGig(gig); setActivePackageTab('basic'); }}
              >
                <div className="scp-gig-badge-row">
                  <span className="scp-gig-badge">{gig.subcategory || 'ক্রিয়েটিভ সার্ভিস'}</span>
                  {gig.isSpecialOffer ? (
                    <span className="scp-special-tag">⚡ স্পেশাল অফার</span>
                  ) : (
                    <span className="scp-standard-tag">প্রিমিয়াম কোয়ালিটি</span>
                  )}
                </div>

                <h3 className="scp-gig-title">{gig.shortTitle || gig.title}</h3>
                <p className="scp-gig-desc">{gig.overview}</p>

                <div className="scp-gig-rating">
                  <div className="stars">
                    <Star size={14} fill="#FFB800" color="#FFB800" />
                    <Star size={14} fill="#FFB800" color="#FFB800" />
                    <Star size={14} fill="#FFB800" color="#FFB800" />
                    <Star size={14} fill="#FFB800" color="#FFB800" />
                    <Star size={14} fill="#FFB800" color="#FFB800" />
                  </div>
                  <span className="scp-rating-val">{gig.rating.toFixed(1)}</span>
                  <span className="scp-rating-count">({gig.reviewCount} ক্লায়েন্ট রিভিউ)</span>
                </div>

                <div className="scp-gig-footer">
                  <div className="scp-gig-price">
                    <span className="scp-price-lbl">{gig.isSpecialOffer ? 'শুরু মাত্র' : 'প্রাইসিং'}</span>
                    <span className="scp-price-val">{formatBDT(gig.startingPrice, gig.isSpecialOffer)}</span>
                  </div>
                  <button className="scp-gig-btn" onClick={(e) => {
                    e.stopPropagation();
                    setSelectedGig(gig);
                    setActivePackageTab('basic');
                  }}>
                    প্যাকেজ দেখুন <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Custom plan CTA Card */}
          <div className="scp-custom-cta">
            <div className="custom-cta-content">
              <Sparkles size={28} className="cta-icon-sparkle" />
              <div>
                <h3>আপনার কি কাস্টম কোনো প্যাকেজ প্রয়োজন?</h3>
                <p>আপনার ব্র্যান্ডের নির্দিষ্ট রিকোয়ারমেন্ট এবং বাজেট অনুযায়ী আমরা তৈরি করব কাস্টম সল্যুশন।</p>
              </div>
            </div>
            <a
              href={`https://wa.me/8801951676600?text=${encodeURIComponent(`আসসালামু আলাইকুম CreatifyBD! আমি "${category.name}" সার্ভিসের জন্য কাস্টম বাজেট ও রিকোয়ারমেন্ট নিয়ে আলোচনা করতে চাই।`)}`}
              target="_blank"
              rel="noreferrer"
              className="btn-primary-luxury"
            >
              কাস্টম অফার নিন <ArrowRight size={16} />
            </a>
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
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ duration: 0.25, ease: EASE_EXPO }}
            >
              <button className="scp-modal-close" onClick={() => setSelectedGig(null)} aria-label="Close">
                &times;
              </button>

              <div className="scp-modal-header">
                <div className="scp-gig-badge-row" style={{ marginBottom: '0.5rem' }}>
                  <span className="scp-gig-badge">{selectedGig.subcategory}</span>
                  {selectedGig.isSpecialOffer && (
                    <span className="scp-special-tag">⚡ স্পেশাল অফার</span>
                  )}
                </div>
                <h2 className="scp-modal-title">{selectedGig.title}</h2>
                <div className="scp-modal-rating">
                  <div className="stars">
                    <Star size={14} fill="#FFB800" color="#FFB800" />
                    <Star size={14} fill="#FFB800" color="#FFB800" />
                    <Star size={14} fill="#FFB800" color="#FFB800" />
                    <Star size={14} fill="#FFB800" color="#FFB800" />
                    <Star size={14} fill="#FFB800" color="#FFB800" />
                  </div>
                  <span className="scp-rating-val">{selectedGig.rating.toFixed(1)}</span>
                  <span className="scp-rating-count">({selectedGig.reviewCount} ক্লায়েন্ট রিভিউ)</span>
                </div>
              </div>

              <div className="scp-modal-grid">
                {/* Left — details */}
                <div className="scp-modal-left">
                  <div>
                    <p className="scp-sec-label">সার্ভিস বিবরণ</p>
                    <p className="scp-sec-text">{selectedGig.description}</p>
                  </div>
                  <div>
                    <p className="scp-sec-label">কাদের জন্য উপযোগী?</p>
                    <p className="scp-sec-text">{selectedGig.whoIsThisFor}</p>
                  </div>
                  {selectedGig.requirements && (
                    <div>
                      <p className="scp-sec-label">কাজের জন্য যা যা প্রয়োজন হবে</p>
                      <ul className="scp-req-list">
                        {selectedGig.requirements.map((req, i) => (
                          <li key={i}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {selectedGig.revisionPolicy && (
                    <div className="scp-revision-note">
                      <p className="scp-sec-label">রিভিশন ও সাপোর্ট পলিসি</p>
                      <p className="scp-sec-text" style={{ color: '#666' }}>{selectedGig.revisionPolicy}</p>
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
                          <span><Clock size={13} /> {pkg.deliveryTime ? `${pkg.deliveryTime} দিন` : 'নির্ধারিত সময়ে'}</span>
                          <span><RotateCcw size={13} /> {pkg.revisions === 10 || pkg.revisions === 'প্রয়োজন অনুযায়ী' ? 'প্রয়োজন অনুযায়ী রিভিশন' : `${pkg.revisions} বার রিভিশন`}</span>
                        </div>

                        <ul className="scp-pkg-features">
                          {pkg.deliverables?.map((del, i) => (
                            <li key={i}><CheckCircle2 size={15} className="scp-check" /><span>{del}</span></li>
                          ))}
                        </ul>

                        {isSpecial ? (
                          <a
                            href={`https://wa.me/8801951676600?text=${encodeURIComponent(`আসসালামু আলাইকুম CreatifyBD! আমি "${selectedGig.title}" সার্ভিসের "${pkg.name}" (৳${pkg.price}/মাস) প্যাকেজটি নিতে আগ্রহী।`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="scp-pkg-order-btn"
                          >
                            <MessageSquare size={16} /> প্যাকেজটি শুরু করুন <ArrowRight size={16} />
                          </a>
                        ) : (
                          <a
                            href={`https://wa.me/8801951676600?text=${encodeURIComponent(`আসসালামু আলাইকুম CreatifyBD! আমি "${selectedGig.title}" সার্ভিসের (${pkg.name}) জন্য কাস্টম কোটেশন ও বাজেট জানতে চাই।`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="scp-pkg-order-btn"
                          >
                            <MessageSquare size={16} /> কাস্টম কোটেশন নিন <ArrowRight size={16} />
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
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: EASE_EXPO }}
          >
            <div className="scp-benefits-text">
              <span className="scp-section-tag">আমাদের বিশেষত্ব</span>
              <h2 className="section-h">কেন CreatifyBD বেছে নেবেন?</h2>
              <p className="scp-benefits-intro">
                আমরা আন্তর্জাতিক মানের ক্রিয়েটিভ স্ট্যান্ডার্ড প্রদান করি সম্পূর্ণ স্থানীয় ও সাশ্রয়ী বাজেটে, যাতে প্রতিটি ব্যবসা সর্বোচ্চ রিটার্ন পায়।
              </p>
              <ul className="scp-benefits-list">
                {details.benefits.map((benefit, idx) => {
                  const [title, desc] = benefit.split(': ');
                  return (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, ease: EASE_EXPO, delay: idx * 0.08 }}
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
              <div className="advantage-header">
                <Sparkles size={22} className="advantage-icon" />
                <span className="scp-advantage-badge">কোয়ালিটি স্ট্যান্ডার্ড</span>
              </div>
              <h4>প্রফেশনাল প্রোডাকশন নিশ্চয়তা</h4>
              <p>আমরা প্রতিটি ক্লায়েন্টের ব্র্যান্ডকে নিজস্ব ব্র্যান্ডের মতো গভীর আন্তরিকতা ও যত্নের সাথে পরিচালনা করি।</p>
              <div className="scp-advantage-bars">
                <div className="scp-bar">
                  <span>আন্তর্জাতিক ডিজাইন কোয়ালিটি</span>
                  <strong>১০০%</strong>
                </div>
                <div className="scp-bar">
                  <span>অন-টাইম ডেলিভারি রেকর্ড</span>
                  <strong>১০০%</strong>
                </div>
                <div className="scp-bar">
                  <span>সাশ্রয়ী ও ন্যায্য বাজেট</span>
                  <strong>সেরা ভ্যালু</strong>
                </div>
              </div>

              <div className="advantage-footer-cta">
                <a
                  href={`https://wa.me/8801951676600?text=${encodeURIComponent(`আসসালামু আলাইকুম CreatifyBD! আমি "${category.name}" সার্ভিস নিয়ে আলোচনা করতে চাই।`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-whatsapp-sm"
                >
                  <MessageSquare size={15} /> সরাসরি WhatsApp-এ কথা বলুন
                </a>
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
            <span className="scp-section-tag">কার্যপ্রণালী</span>
            <h2 className="section-h">আমাদের কাজের সহজ ৩টি ধাপ</h2>
            <p className="section-sub">প্রথম ব্রিফিং থেকে শুরু করে ফাইনাল ডেলিভারি পর্যন্ত সম্পূর্ণ স্বচ্ছ কাজের রোডম্যাপ।</p>
          </motion.div>

          <div className="scp-process-grid">
            {details.process.map((step, idx) => (
              <motion.div
                key={idx}
                className="scp-step-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, ease: EASE_EXPO, delay: idx * 0.1 }}
              >
                <div className="scp-step-num">০{idx + 1}</div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ Section (Interactive Accordion) ── */}
      {details.faqs && details.faqs.length > 0 && (
        <section className="scp-faq-section">
          <div className="container">
            <motion.div
              className="section-header text-center"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.65, ease: EASE_EXPO }}
            >
              <span className="scp-section-tag">প্রশ্ন ও উত্তর</span>
              <h2 className="section-h">সাধারণ <span className="red">জিজ্ঞাসাসমূহ (FAQ)</span></h2>
              <p className="section-sub">আপনার মনে থাকা সাধারণ প্রশ্নের উত্তর জেনে নিন।</p>
            </motion.div>

            <div className="scp-faq-accordion">
              {details.faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={idx} className={`faq-item ${isOpen ? 'active' : ''}`}>
                    <button 
                      className="faq-question-btn" 
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                    >
                      <span>{faq.question}</span>
                      <ChevronDown size={18} className={`faq-chevron ${isOpen ? 'rotate' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          className="faq-answer-wrap"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: EASE_EXPO }}
                        >
                          <div className="faq-answer">{faq.answer}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Bottom Floating WhatsApp Bar for Mobile Landing Page ── */}
      <div className="scp-mobile-sticky-bar">
        <div className="sticky-bar-info">
          <span className="sticky-bar-title">{category.name}</span>
          <span className="sticky-bar-sub">সরাসরি বুকিং ও পরামর্শ</span>
        </div>
        <a
          href={`https://wa.me/8801951676600?text=${encodeURIComponent(`আসসালামু আলাইকুম CreatifyBD! আমি "${category.name}" সার্ভিস সম্পর্কে জানতে ও বুক করতে চাই।`)}`}
          target="_blank"
          rel="noreferrer"
          className="sticky-bar-btn"
        >
          <MessageSquare size={16} /> WhatsApp-এ বুক করুন
        </a>
      </div>

      <Footer />

      <style>{`
        /* ── Page Wrapper ───────────────────────────────────────── */
        .category-landing-page {
          background: #ffffff;
          color: var(--ink, #0f0f12);
          overflow-x: hidden;
        }

        /* ── Hero ──────────────────────────────────────────────── */
        .scp-hero {
          padding: 8.5rem 1.5rem 4.5rem;
          text-align: center;
          background: radial-gradient(circle at 50% -20%, rgba(232, 25, 44, 0.07) 0%, rgba(255, 255, 255, 0) 70%), #ffffff;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          position: relative;
        }
        .scp-hero-inner {
          max-width: 820px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
        }

        /* Breadcrumb */
        .scp-breadcrumb {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          color: #777;
          background: rgba(0, 0, 0, 0.03);
          padding: 0.35rem 0.9rem;
          border-radius: 100px;
          border: 1px solid rgba(0, 0, 0, 0.05);
          margin-bottom: 0.25rem;
        }
        .scp-breadcrumb a {
          color: #666;
          text-decoration: none;
          transition: color 0.2s;
        }
        .scp-breadcrumb a:hover {
          color: var(--brand-red, #E8192C);
        }
        .breadcrumb-arrow {
          color: #aaa;
        }
        .scp-breadcrumb .current {
          color: var(--ink, #0f0f12);
          font-weight: 700;
        }

        /* Tag badge */
        .scp-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(232, 25, 44, 0.08);
          color: var(--brand-red, #E8192C);
          padding: 0.3rem 0.85rem;
          border-radius: 100px;
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.02em;
          border: 1px solid rgba(232, 25, 44, 0.15);
        }
        .scp-section-tag {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--brand-red, #E8192C);
          background: rgba(232, 25, 44, 0.08);
          padding: 0.25rem 0.75rem;
          border-radius: 100px;
          margin-bottom: 0.6rem;
        }

        .scp-hero-title {
          font-family: var(--font-display);
          font-size: clamp(2rem, 4.5vw, 3.2rem);
          font-weight: 800;
          line-height: 1.35;
          color: var(--ink, #0f0f12);
          letter-spacing: 0;
          overflow: visible;
          margin: 0;
        }
        .scp-hero-desc {
          font-size: clamp(0.96rem, 2vw, 1.12rem);
          color: var(--muted, #555);
          line-height: 1.75;
          letter-spacing: 0;
          max-width: 680px;
          margin: 0;
        }
        .scp-hero-actions {
          display: flex;
          gap: 0.85rem;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 0.5rem;
        }

        /* Action Buttons */
        .btn-primary-luxury {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #E8192C 0%, #C41223 100%);
          color: #ffffff !important;
          padding: 0.85rem 1.6rem;
          border-radius: 100px;
          font-size: 0.92rem;
          font-weight: 800;
          text-decoration: none;
          box-shadow: 0 8px 24px rgba(232, 25, 44, 0.28);
          transition: transform 0.2s, box-shadow 0.2s;
          border: none;
          cursor: pointer;
        }
        .btn-primary-luxury:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(232, 25, 44, 0.38);
        }

        .btn-whatsapp-luxury {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: #ffffff;
          color: #075E54 !important;
          padding: 0.85rem 1.5rem;
          border-radius: 100px;
          font-size: 0.92rem;
          font-weight: 800;
          text-decoration: none;
          border: 1.5px solid rgba(37, 211, 102, 0.4);
          box-shadow: 0 4px 16px rgba(37, 211, 102, 0.12);
          transition: transform 0.2s, background 0.2s, border-color 0.2s;
        }
        .btn-whatsapp-luxury:hover {
          background: #f0fdf4;
          border-color: #25D366;
          transform: translateY(-2px);
        }

        /* Hero Highlights Bar */
        .scp-hero-highlights {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1.5rem;
          margin-top: 1.25rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
          width: 100%;
        }
        .highlight-item {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.84rem;
          font-weight: 700;
          color: var(--ink, #222);
        }
        .highlight-icon {
          color: var(--brand-red, #E8192C);
          flex-shrink: 0;
        }

        /* ── Gigs Section ─────────────────────────────────────── */
        .scp-gigs-section {
          padding: 5rem 1.5rem;
          background: #f8f9fb;
        }
        .scp-gigs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
          gap: 1.5rem;
          max-width: 1200px;
          margin: 2.5rem auto 0;
        }

        /* Gig card */
        .scp-gig-card {
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.07);
          border-radius: 18px;
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          min-height: 290px;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s, border-color 0.25s;
          position: relative;
        }
        .scp-gig-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(232, 25, 44, 0.16);
          border-color: rgba(232, 25, 44, 0.24);
        }
        .scp-gig-special-card {
          border: 1.5px solid rgba(232, 25, 44, 0.28);
          background: linear-gradient(175deg, #ffffff 75%, rgba(232, 25, 44, 0.03) 100%);
        }
        .scp-gig-badge-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .scp-gig-badge {
          background: rgba(232, 25, 44, 0.08);
          color: var(--brand-red, #E8192C);
          font-size: 0.68rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.25rem 0.65rem;
          border-radius: 100px;
        }
        .scp-special-tag {
          font-size: 0.68rem;
          font-weight: 800;
          color: #fff;
          background: linear-gradient(135deg, #E8192C 0%, #B91C1C 100%);
          padding: 0.22rem 0.6rem;
          border-radius: 100px;
          box-shadow: 0 2px 8px rgba(232, 25, 44, 0.25);
          white-space: nowrap;
        }
        .scp-standard-tag {
          font-size: 0.65rem;
          font-weight: 700;
          color: #555;
          background: #f0f1f3;
          padding: 0.22rem 0.55rem;
          border-radius: 100px;
        }
        .scp-gig-title {
          font-size: 1.12rem;
          font-weight: 800;
          color: var(--ink, #0f0f12);
          line-height: 1.35;
          margin: 0 0 0.5rem;
        }
        .scp-gig-desc {
          font-size: 0.84rem;
          color: var(--muted, #666);
          line-height: 1.6;
          flex: 1;
          margin: 0 0 1rem;
        }
        .scp-gig-rating {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          margin-bottom: 1.1rem;
          font-size: 0.82rem;
        }
        .scp-gig-rating .stars {
          display: inline-flex;
          gap: 2px;
        }
        .scp-rating-val {
          font-size: 0.82rem;
          font-weight: 800;
          color: var(--ink, #0f0f12);
        }
        .scp-rating-count {
          font-size: 0.74rem;
          color: #888;
        }
        .scp-gig-footer {
          border-top: 1px solid rgba(0, 0, 0, 0.06);
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
          font-size: 0.65rem;
          color: #888;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.04em;
        }
        .scp-price-val {
          font-size: 1.18rem;
          font-weight: 900;
          color: var(--ink, #0f0f12);
        }
        .scp-gig-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.5rem 0.95rem;
          background: #f0f1f4;
          border: 1px solid rgba(0, 0, 0, 0.08);
          color: var(--ink, #0f0f12);
          font-size: 0.78rem;
          font-weight: 800;
          border-radius: 100px;
          cursor: pointer;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
        }
        .scp-gig-card:hover .scp-gig-btn {
          background: var(--brand-red, #E8192C);
          border-color: var(--brand-red, #E8192C);
          color: #fff;
        }

        /* Custom CTA block */
        .scp-custom-cta {
          margin-top: 3.5rem;
          background: #ffffff;
          border: 1.5px solid rgba(232, 25, 44, 0.15);
          padding: 2.25rem 2.5rem;
          border-radius: 20px;
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
        }
        .custom-cta-content {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .cta-icon-sparkle {
          color: var(--brand-red, #E8192C);
          flex-shrink: 0;
        }
        .scp-custom-cta h3 {
          font-size: 1.25rem;
          color: var(--ink, #0f0f12);
          margin: 0 0 0.3rem;
          font-weight: 800;
        }
        .scp-custom-cta p {
          color: var(--muted, #666);
          font-size: 0.9rem;
          margin: 0;
          line-height: 1.5;
        }

        /* ── Modal ─────────────────────────────────────────────── */
        .scp-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10, 10, 15, 0.65);
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
          max-width: 860px;
          border-radius: 24px;
          box-shadow: 0 35px 90px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(0, 0, 0, 0.08);
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
          width: 36px; height: 36px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: #555;
          font-size: 1.5rem;
          line-height: 1;
          transition: background 0.2s, color 0.2s;
          z-index: 10;
        }
        .scp-modal-close:hover { background: var(--brand-red, #E8192C); color: white; }
        .scp-modal-header {
          padding: 2.25rem 2.25rem 1.25rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        }
        .scp-modal-title {
          font-size: 1.65rem;
          font-weight: 900;
          color: var(--ink, #0f0f12);
          margin: 0.35rem 2.5rem 0 0;
          letter-spacing: -0.02em;
          line-height: 1.25;
        }
        .scp-modal-rating {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-top: 0.4rem;
          font-size: 0.85rem;
        }
        .scp-modal-rating .stars {
          display: inline-flex;
          gap: 2px;
        }
        .scp-modal-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 2rem;
          padding: 1.75rem 2.25rem 2.25rem;
        }
        .scp-modal-left {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .scp-sec-label {
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--brand-red, #E8192C);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin: 0 0 0.35rem;
        }
        .scp-sec-text {
          font-size: 0.88rem;
          color: var(--ink, #333);
          line-height: 1.65;
          margin: 0;
        }
        .scp-req-list {
          list-style: square;
          padding-left: 1.2rem;
          margin: 0;
          font-size: 0.84rem;
          color: #444;
          line-height: 1.6;
        }
        .scp-revision-note {
          border-top: 1px solid rgba(0, 0, 0, 0.06);
          padding-top: 1rem;
        }

        /* Package Panel */
        .scp-pkg-panel {
          background: #f8f9fb;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 18px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          align-self: start;
          position: sticky;
          top: 1rem;
        }
        .scp-pkg-tabs {
          display: flex;
          background: #e9ecef;
          padding: 0.25rem;
          border-radius: 12px;
          margin-bottom: 1.25rem;
        }
        .scp-pkg-tab {
          flex: 1;
          background: transparent;
          border: none;
          padding: 0.55rem 0;
          font-size: 0.78rem;
          font-weight: 800;
          border-radius: 9px;
          cursor: pointer;
          color: #777;
          transition: background 0.2s, color 0.2s, box-shadow 0.2s;
        }
        .scp-pkg-tab.active {
          background: #ffffff;
          color: var(--ink, #0f0f12);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
        }
        .scp-pkg-price-wrap {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .scp-pkg-price {
          font-size: 2.2rem;
          font-weight: 900;
          color: var(--ink, #0f0f12);
          letter-spacing: -0.04em;
          line-height: 1;
          display: flex;
          align-items: baseline;
          gap: 2px;
        }
        .scp-pkg-period {
          font-size: 0.95rem;
          font-weight: 700;
          color: #777;
        }
        .scp-pkg-custom-price {
          font-size: 1.7rem;
          color: var(--ink, #0f0f12);
        }
        .scp-special-pill {
          font-size: 0.68rem;
          font-weight: 800;
          color: #fff;
          background: linear-gradient(135deg, #E8192C 0%, #B91C1C 100%);
          padding: 0.22rem 0.6rem;
          border-radius: 100px;
          white-space: nowrap;
        }
        .scp-pkg-name {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--ink, #0f0f12);
          margin-bottom: 0.35rem;
        }
        .scp-pkg-desc {
          font-size: 0.82rem;
          color: var(--muted, #666);
          line-height: 1.5;
          margin-bottom: 0.9rem;
        }
        .scp-pkg-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.76rem;
          color: var(--muted, #555);
          font-weight: 700;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          padding-bottom: 0.9rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }
        .scp-pkg-meta span {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
        }
        .scp-pkg-features {
          list-style: none;
          padding: 0;
          margin: 0 0 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }
        .scp-pkg-features li {
          font-size: 0.82rem;
          color: var(--ink, #333);
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          line-height: 1.45;
        }
        .scp-check {
          color: #10B981;
          flex-shrink: 0;
          margin-top: 0.15rem;
        }
        .scp-pkg-order-btn {
          width: 100%;
          padding: 0.85rem;
          background: linear-gradient(135deg, #E8192C 0%, #C41223 100%);
          color: white !important;
          border: none;
          font-weight: 800;
          font-size: 0.9rem;
          border-radius: 12px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          box-shadow: 0 6px 20px rgba(232, 25, 44, 0.28);
          text-decoration: none;
        }
        .scp-pkg-order-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 26px rgba(232, 25, 44, 0.38);
        }

        /* ── Benefits Section ─────────────────────────────────── */
        .scp-benefits-section {
          padding: 5.5rem 1.5rem;
          background: #ffffff;
          position: relative;
        }
        .scp-benefits-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 4rem;
          max-width: 1200px;
          margin: 0 auto;
          align-items: center;
        }
        .scp-benefits-text h2 {
          color: var(--ink, #0f0f12);
        }
        .scp-benefits-intro {
          color: var(--muted, #666);
          margin-bottom: 2rem;
          font-size: 1.02rem;
          line-height: 1.65;
        }
        .scp-benefits-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .scp-benefits-list li {
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
        }
        .scp-benefits-list li strong {
          color: var(--ink, #0f0f12);
          font-size: 0.98rem;
          display: block;
          margin-bottom: 0.2rem;
        }
        .scp-benefits-list li p {
          color: var(--muted, #666);
          font-size: 0.86rem;
          line-height: 1.55;
          margin: 0;
        }
        .scp-check-icon {
          color: var(--brand-red, #E8192C);
          flex-shrink: 0;
          margin-top: 0.15rem;
        }

        /* Advantage card */
        .scp-advantage-card {
          background: linear-gradient(145deg, #f8f9fb 0%, #f0f3f8 100%);
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          position: relative;
        }
        .advantage-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.85rem;
        }
        .advantage-icon {
          color: var(--brand-red, #E8192C);
        }
        .scp-advantage-badge {
          background: rgba(232, 25, 44, 0.1);
          color: var(--brand-red, #E8192C);
          font-size: 0.68rem;
          font-weight: 800;
          padding: 0.25rem 0.65rem;
          border-radius: 100px;
          letter-spacing: 0.04em;
        }
        .scp-advantage-card h4 {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--ink, #0f0f12);
          margin: 0 0 0.5rem;
        }
        .scp-advantage-card > p {
          font-size: 0.85rem;
          color: var(--muted, #666);
          line-height: 1.6;
          margin: 0 0 1.5rem;
        }
        .scp-advantage-bars {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        .scp-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 10px;
          font-size: 0.84rem;
        }
        .scp-bar span { color: var(--muted, #555); font-weight: 600; }
        .scp-bar strong { color: var(--brand-red, #E8192C); font-weight: 900; }
        .advantage-footer-cta {
          border-top: 1px solid rgba(0, 0, 0, 0.06);
          padding-top: 1.25rem;
        }
        .btn-whatsapp-sm {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          width: 100%;
          background: #25D366;
          color: #ffffff !important;
          padding: 0.75rem;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 800;
          text-decoration: none;
          box-shadow: 0 4px 14px rgba(37, 211, 102, 0.25);
          transition: transform 0.2s;
        }
        .btn-whatsapp-sm:hover {
          transform: translateY(-2px);
        }

        /* ── Process Section ──────────────────────────────────── */
        .scp-process-section {
          padding: 5.5rem 1.5rem;
          background: #f8f9fb;
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
          border: 1px solid rgba(0, 0, 0, 0.07);
          border-radius: 18px;
          padding: 2.25rem 2rem;
          position: relative;
          overflow: hidden;
          transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
        }
        .scp-step-card:hover {
          border-color: rgba(232, 25, 44, 0.22);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.07);
          transform: translateY(-4px);
        }
        .scp-step-num {
          font-size: 3rem;
          font-weight: 900;
          color: rgba(232, 25, 44, 0.06);
          position: absolute;
          top: 0.75rem;
          right: 1.25rem;
          letter-spacing: -0.04em;
          line-height: 1;
        }
        .scp-step-card h4 {
          font-size: 1.12rem;
          color: var(--ink, #0f0f12);
          font-weight: 800;
          margin: 0 0 0.6rem;
        }
        .scp-step-card p {
          font-size: 0.86rem;
          color: var(--muted, #666);
          line-height: 1.6;
          margin: 0;
        }

        /* ── FAQ Section ──────────────────────────────────────── */
        .scp-faq-section {
          padding: 5.5rem 1.5rem;
          background: #ffffff;
        }
        .scp-faq-accordion {
          max-width: 820px;
          margin: 2.5rem auto 0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .faq-item {
          background: #f8f9fb;
          border: 1px solid rgba(0, 0, 0, 0.07);
          border-radius: 14px;
          overflow: hidden;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .faq-item.active {
          border-color: rgba(232, 25, 44, 0.25);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
          background: #ffffff;
        }
        .faq-question-btn {
          width: 100%;
          background: transparent;
          border: none;
          padding: 1.25rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-align: left;
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--ink, #0f0f12);
          cursor: pointer;
          gap: 1rem;
        }
        .faq-chevron {
          color: #888;
          transition: transform 0.25s ease;
          flex-shrink: 0;
        }
        .faq-chevron.rotate {
          transform: rotate(180deg);
          color: var(--brand-red, #E8192C);
        }
        .faq-answer-wrap {
          overflow: hidden;
        }
        .faq-answer {
          padding: 0 1.5rem 1.25rem;
          font-size: 0.88rem;
          color: var(--muted, #555);
          line-height: 1.65;
        }

        /* ── Sticky Mobile Booking Bar ────────────────────────── */
        .scp-mobile-sticky-bar {
          display: none;
        }

        /* ── Responsive Media Queries ─────────────────────────── */
        @media (max-width: 968px) {
          .scp-benefits-grid { grid-template-columns: 1fr; gap: 2.5rem; }
          .scp-process-grid { grid-template-columns: 1fr 1fr; }
          .scp-custom-cta { flex-direction: column; text-align: center; }
          .custom-cta-content { flex-direction: column; }
        }
        @media (max-width: 768px) {
          .scp-modal-grid { grid-template-columns: 1fr; gap: 1.5rem; padding: 1.25rem; }
          .scp-modal-header { padding: 1.5rem 1.5rem 1rem; }
          .scp-process-grid { grid-template-columns: 1fr; }
          .scp-hero-highlights { gap: 0.85rem; }
          .highlight-item { font-size: 0.78rem; }
        }
        @media (max-width: 640px) {
          .scp-hero { padding: 6.5rem 1.25rem 3.5rem; }
          .scp-gigs-grid { grid-template-columns: 1fr; }
          .scp-hero-actions { flex-direction: column; width: 100%; }
          .scp-hero-actions a { width: 100%; }
          .scp-custom-cta { padding: 1.75rem 1.25rem; }

          /* Show mobile sticky conversion bar */
          .scp-mobile-sticky-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #ffffff;
            border-top: 1px solid rgba(0, 0, 0, 0.1);
            padding: 0.75rem 1rem;
            z-index: 9999;
            box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
          }
          .sticky-bar-info {
            display: flex;
            flex-direction: column;
          }
          .sticky-bar-title {
            font-size: 0.82rem;
            font-weight: 800;
            color: var(--ink, #0f0f12);
          }
          .sticky-bar-sub {
            font-size: 0.7rem;
            color: #777;
          }
          .sticky-bar-btn {
            display: inline-flex;
            align-items: center;
            gap: 0.35rem;
            background: #25D366;
            color: #ffffff !important;
            padding: 0.6rem 1rem;
            border-radius: 100px;
            font-size: 0.8rem;
            font-weight: 800;
            text-decoration: none;
            box-shadow: 0 4px 12px rgba(37, 211, 102, 0.28);
          }
        }
      `}</style>
    </div>
  );
};

export default ServiceCategoryPage;
