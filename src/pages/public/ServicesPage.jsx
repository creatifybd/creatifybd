import React from 'react';
import Navbar from '../../components/Navbar';
import Services from '../../components/Services';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import { motion } from 'framer-motion';

const EASE_EXPO = [0.16, 1, 0.3, 1];

const ServicesPage = () => {
  return (
    <div className="services-page">
      <SEO
        title="Creative, Digital Marketing & Web Services | CreatifyBD"
        description="Explore CreatifyBD services including social media marketing, branding, web design, photography, videography, SEO and content production."
        keywords="digital marketing services dhaka, web development bangladesh, SEO services dhaka, branding services, creatifybd services"
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          "serviceType": "Digital Marketing & Web Development",
          "provider": {
            "@type": "LocalBusiness",
            "name": "CreatifyBD"
          }
        }}
      />
      <Navbar />

      <div className="page-header page-header-light">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE_EXPO, delay: 0 }}
            className="eyebrow"
            style={{ marginBottom: '1rem' }}
          >
            What We Offer
          </motion.div>

          <motion.h1
            className="page-title"
            initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.85, ease: EASE_EXPO, delay: 0.08 }}
          >
            Our <span className="red">Services</span>
          </motion.h1>

          <motion.p
            className="page-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE_EXPO, delay: 0.2 }}
          >
            Expert digital solutions tailored to elevate your brand presence and drive real results.
          </motion.p>
        </div>
      </div>

      <Services fullPage={true} />
      <Footer />
    </div>
  );
};

export default ServicesPage;
