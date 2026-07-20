import React, { useEffect, useState, Suspense, lazy } from 'react';
import useReveal from '../utils/useReveal';

import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import InfiniteMarquee from '../components/InfiniteMarquee';
import SEO from '../components/SEO';

import { useSettings } from '../context/SettingsContext';
import usePageSEO from '../hooks/usePageSEO';

const IntroBand  = lazy(() => import('../components/IntroBand'));
const Clients    = lazy(() => import('../components/Clients'));
const SmmHighlight = lazy(() => import('../components/SmmHighlight'));
const Portfolio  = lazy(() => import('../components/Portfolio'));
const Services   = lazy(() => import('../components/Services'));
const WhyUsSection = lazy(() => import('../components/WhyUsSection'));
const AboutTrust = lazy(() => import('../components/AboutTrust'));
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
    title: "CreatifyBD \u2014 Branding, Social, Video & Web for Growing Businesses",
    description: "A full-service creative team \u2014 branding, social media, video, and web \u2014 built by 4-7 specialists who work directly with you. No account managers, no five-layer handoffs. Get a custom quote.",
    keywords: "CreatifyBD, creative agency, brand identity, logo design, social media management, video editing, website design, digital marketing, business growth, creative services",
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
      {content?.visibility?.hero !== false && <InfiniteMarquee />}

      <Suspense fallback={null}>
        {/* 2 — Intro band — quick full-service summary (branding, social, video/web) */}
        {content?.visibility?.intro_band !== false && <IntroBand />}

        {/* 3 — Services editorial list — what we do first */}
        {content?.visibility?.services !== false && (
          <Services highlight={true} theme={content?.services?.theme} />
        )}

        {/* 4 — Portfolio — show real work after services */}
        {content?.visibility?.portfolio !== false && (
          <Portfolio highlight={true} theme={content?.portfolio?.theme} />
        )}

        {/* 4b — Clients — real client names/logos, off until populated via admin */}
        {content?.visibility?.clients === true && <Clients />}

        {/* 4c — SMM spotlight — optional deep-dive on one service, off by default
             to keep the four service lines equally weighted; admin can enable
             for a campaign-specific push */}
        {content?.visibility?.smm_highlight === true && <SmmHighlight />}

        {/* 5 — Why Us */}
        <WhyUsSection />

        {/* 6 — About trust */}
        {content?.visibility?.about_trust !== false && <AboutTrust />}

        {/* 7 — Process */}
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
