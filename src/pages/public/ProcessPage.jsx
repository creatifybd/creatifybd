import React from 'react';
import Navbar from '../../components/Navbar';
import Process from '../../components/Process';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import { motion } from 'framer-motion';

const ProcessPage = () => {
  return (
    <div className="process-page">
      <SEO 
        title="About Creatify BD | Our Process & Agency Culture"
        description="Learn about Creatify BD's systematic, 4-step approach to turning your vision into a digital masterpiece. Best creative agency in Dhaka."
        keywords="About Creatify BD, creative agency process, web design workflow, digital marketing strategy dhaka"
      />
      <Navbar />
      <div className="page-header dark-section">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container"
        >
          <h1 className="page-title">How We <span className="red">Work</span></h1>
          <p className="page-subtitle">A systematic, 4-step approach to turning your vision into a digital masterpiece.</p>
        </motion.div>
      </div>
      <Process fullPage={true} />
      <Footer />
    </div>
  );
};

export default ProcessPage;
