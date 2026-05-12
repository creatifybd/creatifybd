import React from 'react';
import Navbar from '../../components/Navbar';
import Pricing from '../../components/Pricing';
import Footer from '../../components/Footer';
import { motion } from 'framer-motion';

const PricingPage = () => {
  return (
    <div className="pricing-page">
      <Navbar />
      <div className="page-header dark-section">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container"
        >
          <h1 className="page-title">Transparent <span className="red">Pricing</span></h1>
          <p className="page-subtitle">Simple, scalable plans designed for businesses of all sizes. No hidden fees.</p>
        </motion.div>
      </div>
      <Pricing fullPage={true} />
      <Footer />
    </div>
  );
};

export default PricingPage;
