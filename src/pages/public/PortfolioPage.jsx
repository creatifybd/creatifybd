import React from 'react';
import Navbar from '../../components/Navbar';
import Portfolio from '../../components/Portfolio';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import { motion } from 'framer-motion';

const PortfolioPage = () => {
  return (
    <div className="portfolio-page">
      <SEO 
        title="Creatify BD Portfolio | Best Creative Work & Projects"
        description="Explore the portfolio of Creatify BD, featuring premium graphic design, branding, and digital marketing projects delivered with excellence."
        keywords="Creatify BD portfolio, creative agency work dhaka, web design portfolio bangladesh, digital marketing case studies"
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Creatify BD Portfolio",
          "description": "Collection of premium digital marketing and design projects by Creatify BD.",
          "url": "https://creatify-bd.web.app/work"
        }}
      />
      <Navbar />
      <div className="page-header dark-section">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container"
        >
          <h1 className="page-title">Our <span className="red">Work</span></h1>
          <p className="page-subtitle">A collection of 200+ premium graphic design, branding, and AI-driven projects delivered with excellence.</p>
        </motion.div>
      </div>
      <Portfolio fullPage={true} />
      <Footer />
    </div>
  );
};

export default PortfolioPage;
