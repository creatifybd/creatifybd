import React, { useEffect, useState, Suspense, lazy } from 'react';
import useReveal from '../utils/useReveal';

import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import InfiniteMarquee from '../components/InfiniteMarquee';
import SEO from '../components/SEO';

import { useSettings } from '../context/SettingsContext';
import usePageSEO from '../hooks/usePageSEO';

const Portfolio  = lazy(() => import('../components/Portfolio'));
const Services   = lazy(() => import('../components/Services'));
const AboutTrust = lazy(() => import('../components/AboutTrust'));
const Process    = lazy(() => import('../components/Process'));
const Pricing    = lazy(() => import('../components/Pricing'));
const Testimonials = lazy(() => import('../components/Testimonials'));
const Contact    = lazy(() => import('../components/Contact'));
const Footer     = lazy(() => import('../components/Footer'));

const Home = () => {
  const { content, loading } = useSettings();
  const [dataLoaded, setDataLoaded] = useState(false);

  // Trigger reveal observer
  useReveal(dataLoaded);

  useEffect(() => {
    if (!loading) setDataLoaded(true);
  }, [loading]);

  const seo = {
    title: "CreatifyBD — প্রিমিয়াম ব্র্যান্ডিং, সোশ্যাল মিডিয়া, ভিডিও ও ওয়েব সল্যুশন",
    description: "বাংলাদেশের ব্যবসা ও ব্র্যান্ডের জন্য ফুল-সার্ভিস ক্রিয়েটিভ পার্টনার—ব্র্যান্ডিং, সোশ্যাল মিডিয়া ম্যানেজমেন্ট, ভিডিও এডিটিং ও আধুনিক ওয়েবসাইট।",
    keywords: "CreatifyBD, creative agency bangladesh, brand identity, logo design, social media management, video editing, website design, digital marketing",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "CreatifyBD",
        "alternateName": ["Creatify BD", "creatify bd", "Creatify"],
        "url": "https://creatifybd.com",
        "logo": "https://creatifybd.com/logo.png",
        "image": "https://creatifybd.com/og-image.png",
        "description": "CreatifyBD is a strategic creative agency offering social media management, brand design, video production, and performance marketing for growing businesses worldwide.",
        "telephone": "+8801979201999",
        "email": "hello@creatifybd.com",
        "address": { "@type": "PostalAddress", "addressCountry": "BD", "addressRegion": "Dhaka" },
        "areaServed": "Bangladesh",
        "priceRange": "৳৳",
        "sameAs": [
          "https://www.facebook.com/creatifybd",
          "https://www.instagram.com/creatifybd",
          "https://www.linkedin.com/company/creatifybd"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+8801979201999",
          "contactType": "customer service",
          "availableLanguage": ["Bangla", "English"]
        }
      }
    ]
  };

  const pageSeo = usePageSEO('home', seo);

  return (
    <div className="App">
      <SEO 
        title={pageSeo.title} 
        description={pageSeo.description} 
        keywords={seo.keywords}
        schema={seo.schema}
      />

      <Navbar />
      {content?.visibility?.hero !== false && <Hero />}
      {content?.visibility?.hero !== false && <InfiniteMarquee />}

      <Suspense fallback={null}>
        {/* 1 — Services editorial list */}
        {content?.visibility?.services !== false && (
          <Services highlight={true} theme={content?.services?.theme} />
        )}

        {/* 2 — Portfolio showcase */}
        {content?.visibility?.portfolio !== false && (
          <Portfolio highlight={true} theme={content?.portfolio?.theme} />
        )}

        {/* 3 — About & Trust (Founder voice & core standards) */}
        {content?.visibility?.about_trust !== false && <AboutTrust />}

        {/* 4 — Process (5-step delivery roadmap) */}
        {content?.visibility?.process !== false && <Process highlight={true} theme={content?.process?.theme} />}

        {/* 5 — Pricing retainers */}
        {content?.visibility?.pricing !== false && <Pricing highlight={true} theme={content?.pricing?.theme} />}

        {/* 6 — Testimonials & Social Proof */}
        {content?.visibility?.testimonials !== false && <Testimonials theme={content?.testimonials?.theme} />}

        {/* 7 — Contact & Direct WhatsApp */}
        {content?.visibility?.contact !== false && <Contact highlight={true} theme={content?.contact?.theme} />}
        
        <Footer />
      </Suspense>
    </div>
  );
};

export default Home;
