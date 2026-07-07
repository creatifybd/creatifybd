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
    title: "CreatifyBD | Creative Agency for Social Media, Design & Video — USA, Canada, Australia",
    description: "CreatifyBD is a dedicated creative agency offering social media management, graphic design, video editing, and website design for brands in USA, Canada, and Australia. 500+ projects delivered, 4.9★ rating.",
    keywords: "CreatifyBD, creative agency, social media management, graphic design, video editing, website design, digital marketing, branding agency, social media agency USA, graphic design agency Canada, creative services Australia",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "CreatifyBD",
        "alternateName": ["Creatify BD", "creatify bd", "Creatify"],
        "url": "https://creatifybd.com",
        "logo": "https://creatifybd.com/logo.png",
        "image": "https://creatifybd.com/og-image.png",
        "description": "CreatifyBD is the best digital marketing agency and creative agency offering social media management, graphic design service, video editing service, and digital marketing service for USA, Canada, and Australia.",
        "telephone": "+8801951676600",
        "email": "hello@creatifybd.com",
        "address": { "@type": "PostalAddress", "addressCountry": "BD", "addressRegion": "Dhaka" },
        "areaServed": [
          { "@type": "Country", "name": "United States" },
          { "@type": "Country", "name": "Canada" },
          { "@type": "Country", "name": "Australia" }
        ],
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
