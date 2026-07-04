import React, { useEffect, useState, Suspense, lazy } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';
import useReveal from '../utils/useReveal';

import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Portfolio from '../components/Portfolio';
import SEO from '../components/SEO';

import { useSettings } from '../context/SettingsContext';
import usePageSEO from '../hooks/usePageSEO';

const Clients = lazy(() => import('../components/Clients'));
const IntroBand = lazy(() => import('../components/IntroBand'));
const Services = lazy(() => import('../components/Services'));
const CaseStudies = lazy(() => import('../components/CaseStudies'));
const Process = lazy(() => import('../components/Process'));
const Features = lazy(() => import('../components/Features'));
const Pricing = lazy(() => import('../components/Pricing'));
const Testimonials = lazy(() => import('../components/Testimonials'));
const CTABand = lazy(() => import('../components/CTABand'));
const Contact = lazy(() => import('../components/Contact'));
const Footer = lazy(() => import('../components/Footer'));
const SmmHighlight = lazy(() => import('../components/SmmHighlight'));
const AboutTrust = lazy(() => import('../components/AboutTrust'));
const GigMarquee = lazy(() => import('../components/GigMarquee'));

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
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "BD",
          "addressRegion": "Dhaka"
        },
        "areaServed": [
          { "@type": "Country", "name": "United States" },
          { "@type": "Country", "name": "Canada" },
          { "@type": "Country", "name": "Australia" },
          { "@type": "Country", "name": "Bangladesh" }
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
          "availableLanguage": ["English", "Bengali"]
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "CreatifyBD",
        "description": "Best digital marketing agency and creative agency offering social media management, graphic design, video editing, and website design services.",
        "url": "https://creatifybd.com",
        "telephone": "+8801951676600",
        "email": "hello@creatifybd.com",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "BD",
          "addressRegion": "Dhaka"
        },
        "areaServed": [
          { "@type": "Country", "name": "United States" },
          { "@type": "Country", "name": "Canada" },
          { "@type": "Country", "name": "Australia" }
        ],
        "priceRange": "$$",
        "openingHours": "Mo-Su 00:00-23:59",
        "sameAs": [
          "https://www.facebook.com/creatifybd",
          "https://www.instagram.com/creatifybd",
          "https://www.linkedin.com/company/creatifybd"
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": "CreatifyBD Digital Marketing Services",
        "description": "Comprehensive digital marketing and creative services including social media management, graphic design, video editing, and website design.",
        "provider": {
          "@type": "Organization",
          "name": "CreatifyBD",
          "url": "https://creatifybd.com"
        },
        "serviceType": [
          "Social Media Management",
          "Graphic Design",
          "Video Editing",
          "Website Design",
          "Digital Marketing"
        ],
        "areaServed": [
          { "@type": "Country", "name": "United States" },
          { "@type": "Country", "name": "Canada" },
          { "@type": "Country", "name": "Australia" }
        ]
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
      {content?.visibility?.portfolio !== false && <Portfolio highlight={true} theme={content?.portfolio?.theme} />}

      <Suspense fallback={null}>
        <GigMarquee />
        {content?.visibility?.intro_band !== false && <IntroBand />}

        {content?.visibility?.clients !== false && <Clients />}

        {content?.visibility?.smm_highlight !== false && <SmmHighlight />}
        {content?.visibility?.services !== false && <Services highlight={true} theme={content?.services?.theme} />}
        {content?.visibility?.features !== false && <Features theme={content?.features?.theme} />}
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
