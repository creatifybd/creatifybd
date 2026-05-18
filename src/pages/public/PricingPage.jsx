import React from 'react';
import Navbar from '../../components/Navbar';
import Pricing from '../../components/Pricing';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import { motion } from 'framer-motion';

const PricingPage = () => {
  return (
    <div className="pricing-page">
      <SEO 
        title="Creatify BD Pricing | Affordable Digital Marketing & Web Design"
        description="Affordable and transparent pricing for digital marketing, web development, branding, and video production services in Bangladesh by Creatify BD."
        keywords="Creatify BD pricing, digital marketing cost bangladesh, web design price dhaka, SEO packages bangladesh"
      />
      <Navbar theme="light" />
      <div style={{ paddingTop: '80px' }}>
        <Pricing fullPage={false} />
      </div>
      <Footer />
    </div>
  );
};

export default PricingPage;
