import React from 'react';
import Navbar from '../../components/Navbar';
import Contact from '../../components/Contact';
import Footer from '../../components/Footer';
import { motion } from 'framer-motion';

const ContactPage = () => {
  return (
    <div className="contact-page">
      <Navbar />
      <div className="page-header dark-section">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container"
        >
          <h1 className="page-title">Let's <span className="red">Connect</span></h1>
          <p className="page-subtitle">Ready to start your next project? Get in touch with our team today.</p>
        </motion.div>
      </div>
      <Contact fullPage={true} />
      <Footer />
    </div>
  );
};

export default ContactPage;
