import React, { useEffect, useState, Suspense, lazy } from 'react';
import useReveal from '../utils/useReveal';

import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import SEO from '../components/SEO';

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
    title: "CreatifyBD | Best Digital Marketing Agency | Social Media Management, Graphic Design, Video Editing",
    description: "CreatifyBD is the best digital marketing agency and creative agency offering social media management, graphic design service, video editing service, and digital marketing service for USA, Canada, and Australia. Hire the best marketing agency for your brand.",
    keywords: "CreatifyBD, Creatify BD, creatify bd, creative agency, digital marketing agency, marketing agency, best marketing agency, social media management, social media manager, graphic design service, video editing service, digital marketing service, social media marketing agency, creative design agency, best graphic design service, professional video editing, social media management USA, digital marketing Canada, creative agency Australia, social media marketing company, graphic design agency, video production company, web design agency, content marketing agency, branding agency, online marketing agency",
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
        {/* 1 — Client trust strip */}
        {content?.visibility?.clients !== false && <Clients />}

        {/* 2 — Portfolio — show real work early */}
        {content?.visibility?.portfolio !== false && (
          <Portfolio highlight={true} theme={content?.portfolio?.theme} />
        )}

        {/* 3 — Services editorial list */}
        {content?.visibility?.services !== false && (
          <Services highlight={true} theme={content?.services?.theme} />
        )}

        {/* 4 — Why Us — expandable cards */}
        <WhyUsSection />
        {content?.visibility?.about_trust !== false && <AboutTrust />}
        {content?.visibility?.case_studies !== false && <CaseStudies />}
        {content?.visibility?.process !== false && <Process highlight={true} theme={content?.process?.theme} />}
        {content?.visibility?.pricing !== false && <Pricing highlight={true} theme={content?.pricing?.theme} />}

        {content?.visibility?.testimonials !== false && <Testimonials theme={content?.testimonials?.theme} />}
        {content?.visibility?.cta_band !== false && <CTABand />}
        {content?.visibility?.contact !== false && <Contact highlight={true} theme={content?.contact?.theme} />}
        <Footer />
      </Suspense>
    </div>
  );
};


export default Home;
