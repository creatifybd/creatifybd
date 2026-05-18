import React from 'react';
import Navbar from '../../components/Navbar';
import Contact from '../../components/Contact';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import { motion } from 'framer-motion';

const ContactPage = () => {
  return (
    <div className="contact-page">
      <SEO 
        title="Contact Creatify BD | Best Digital Marketing Agency in Dhaka"
        description="Ready to start your next project? Get in touch with Creatify BD today and let's build something great. Best digital agency in Bangladesh."
        keywords="Contact Creatify BD, hire creative agency dhaka, digital marketing consultation bangladesh, web design agency contact"
        schema={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Contact Creatify BD",
          "description": "Contact page for Creatify BD, a premier digital marketing agency in Dhaka.",
          "url": "https://creatify-bd.web.app/contact"
        }}
      />
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
