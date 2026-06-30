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
        title="Pricing | CreatifyBD Service Packages"
        description="Affordable and transparent pricing for digital marketing, web development, branding, and video production services in Bangladesh by CreatifyBD."
        keywords="creatifybd pricing, digital marketing cost bangladesh, web design price dhaka, SEO packages bangladesh"
      />
      <Navbar theme="light" />
      <div className="page-header page-header-light">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container"
          style={{ textAlign: 'center' }}
        >
          <h1 className="page-title">Transparent <span className="red">Pricing</span></h1>
          <p className="page-subtitle" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
            Clear packages for digital marketing, branding, web development, and video production.
          </p>
        </motion.div>
      </div>
      <Pricing fullPage={false} />
      <Footer />
    </div>
  );
};

export default PricingPage;
