import React, { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';
import useReveal from '../utils/useReveal';

import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Clients from '../components/Clients';
import IntroBand from '../components/IntroBand';
import CaseStudies from '../components/CaseStudies';
import Services from '../components/Services';
import Portfolio from '../components/Portfolio';
import Process from '../components/Process';
import Features from '../components/Features';
import Pricing from '../components/Pricing';
import Testimonials from '../components/Testimonials';
import CTABand from '../components/CTABand';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

import { useSettings } from '../context/SettingsContext';

const Home = () => {
  const { settings, content, loading } = useSettings();
  const [dataLoaded, setDataLoaded] = useState(false);

  // Trigger reveal observer
  useReveal(dataLoaded);

  useEffect(() => {
    if (!loading) setDataLoaded(true);
  }, [loading]);

  const seo = {
    title: settings?.seo_title || "Creatify BD | Best Digital Marketing & Creative Agency in Dhaka",
    description: settings?.seo_description || "Creatify BD is the premier digital marketing and creative agency in Dhaka, offering top-notch web design, branding, and video production.",
    keywords: "Creatify BD, CreatifyBD, digital marketing agency dhaka, best creative agency bangladesh, social media management dhaka, web design bangladesh, branding agency dhaka",
    schema: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Creatify BD | Best Digital Marketing & Creative Agency in Dhaka",
      "description": "Creatify BD is the premier digital marketing and creative agency in Dhaka.",
      "url": "https://creatify-bd.web.app/"
    }
  };

  return (
    <div className="App">
      <SEO 
        title={seo.title} 
        description={seo.description} 
        keywords={seo.keywords}
        schema={seo.schema}
      />

      <Navbar />
      {content?.visibility?.hero !== false && <Hero />}
      <IntroBand />
      
      {content?.visibility?.case_studies !== false && <CaseStudies highlight={true} theme={content?.hero?.theme} />}
      
      {content?.visibility?.clients !== false && <Clients />}
      
      {content?.visibility?.services !== false && <Services highlight={true} theme={content?.services?.theme} />}
      {content?.visibility?.features !== false && <Features theme={content?.features?.theme} />}
      {content?.visibility?.portfolio !== false && <Portfolio highlight={true} theme={content?.portfolio?.theme} />}
      {content?.visibility?.process !== false && <Process highlight={true} theme={content?.process?.theme} />}
      {content?.visibility?.pricing !== false && <Pricing highlight={true} theme={content?.pricing?.theme} />}
      
      {content?.visibility?.testimonials !== false && <Testimonials theme={content?.testimonials?.theme} />}
      {content?.visibility?.cta_band !== false && <CTABand />}
      {content?.visibility?.contact !== false && <Contact highlight={true} theme={content?.contact?.theme} />}
      <Footer />
    </div>
  );
};


export default Home;
