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
    title: settings?.seo_title || "Best Creative Agency in Dhaka & Digital Marketing Bangladesh",
    description: settings?.seo_description || "CreatifyBD is the premier digital marketing and creative agency in Dhaka.",
    keywords: "digital marketing agency dhaka, best creative agency bangladesh, social media management dhaka, web design bangladesh, branding agency dhaka, creatifybd"
  };

  return (
    <div className="App">
      <SEO 
        title={seo.title} 
        description={seo.description} 
        keywords={seo.keywords}
      />

      <Navbar />
      <Hero />
      <IntroBand />
      
      <CaseStudies highlight={true} theme={content?.hero?.theme} />
      
      <Clients />
      
      <Services highlight={true} theme={content?.services?.theme} />
      <Features theme={content?.features?.theme} />
      <Portfolio highlight={true} theme={content?.portfolio?.theme} />
      <Process highlight={true} theme={content?.process?.theme} />
      <Pricing highlight={true} theme={content?.pricing?.theme} />
      
      <Testimonials theme={content?.testimonials?.theme} />
      <CTABand />
      <Contact highlight={true} theme={content?.contact?.theme} />
      <Footer />
    </div>
  );
};


export default Home;
