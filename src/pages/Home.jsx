import React, { useEffect, useState, Suspense, lazy } from 'react';
import useReveal from '../utils/useReveal';

import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import SEO from '../components/SEO';
import StatsCounter from '../components/StatsCounter';
import FeaturedIn from '../components/FeaturedIn';

import { useSettings } from '../context/SettingsContext';
import usePageSEO from '../hooks/usePageSEO';

const Clients    = lazy(() => import('../components/Clients'));
const Portfolio  = lazy(() => import('../components/Portfolio'));
const Services   = lazy(() => import('../components/Services'));
const WhyUsSection = lazy(() => import('../components/WhyUsSection'));
const AboutTrust = lazy(() => import('../components/AboutTrust'));
const CaseStudies = lazy(() => import('../components/CaseStudies'));
const Process    = lazy(() => import('../components/Process'));
const Pricing    = lazy(() => import('../components/Pricing'));
const Testimonials = lazy(() => import('../components/Testimonials'));
const CTABand    = lazy(() => import('../components/CTABand'));
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
    title: "CreatifyBD | Strategic Creative Services for Growing Businesses Worldwide",
    description: "Professional creative agency offering strategic social media management, brand design, video production, and performance marketing. Helping small businesses compete globally with transparent pricing and dedicated support.",
    keywords: "CreatifyBD, creative agency, social media management, brand design, video production, performance marketing, website design, digital strategy, business growth, creative services",
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
        "telephone": "+8801951676600",
        "email": "hello@creatifybd.com",
        "address": { "@type": "PostalAddress", "addressCountry": "BD", "addressRegion": "Dhaka" },
        "areaServed": "Global",
        "priceRange": "$$",
        "sameAs": [
          "https://www.facebook.com/creatifybd",
          "https://www.instagram.com/creatifybd",
          "https://www.linkedin.com/company/creatifybd"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+8801951676600",
          "contactType": "customer service",
          "availableLanguage": ["English"]
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

      <Suspense fallback={null}>
        {/* 1 — Stats counter strip */}
        <StatsCounter />

        {/* 3 — Services editorial list — what we do first */}
        {content?.visibility?.services !== false && (
          <Services highlight={true} theme={content?.services?.theme} />
        )}

        {/* 4 — Portfolio — show real work after services */}
        {content?.visibility?.portfolio !== false && (
          <Portfolio highlight={true} theme={content?.portfolio?.theme} />
        )}

        {/* 5 — Why Us */}
        <WhyUsSection />

        {/* 6 — About trust */}
        {content?.visibility?.about_trust !== false && <AboutTrust />}

        {/* 7 — Case studies */}
        {content?.visibility?.case_studies !== false && <CaseStudies />}

        {/* 8 — Process */}
        {content?.visibility?.process !== false && <Process highlight={true} theme={content?.process?.theme} />}

        {/* 9 — Pricing */}
        {content?.visibility?.pricing !== false && <Pricing highlight={true} theme={content?.pricing?.theme} />}

        {/* 10 — Testimonials */}
        {content?.visibility?.testimonials !== false && <Testimonials theme={content?.testimonials?.theme} />}

        {/* 11 — CTA */}
        {content?.visibility?.cta_band !== false && <CTABand />}

        {/* 12 — Contact */}
        {content?.visibility?.contact !== false && <Contact highlight={true} theme={content?.contact?.theme} />}
        <Footer />
      </Suspense>
    </div>
  );
};


export default Home;
