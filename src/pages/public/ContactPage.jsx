import React from 'react';
import Navbar from '../../components/Navbar';
import Contact from '../../components/Contact';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import usePageSEO from '../../hooks/usePageSEO';
import { motion } from 'framer-motion';

const EASE_EXPO = [0.16, 1, 0.3, 1];

const ContactPage = () => {
  const seo = usePageSEO('contact', {
    title: "যোগাযোগ — CreatifyBD | প্রজেক্ট নিয়ে সরাসরি আলোচনা করুন",
    description: "WhatsApp, কল বা ফর্মের মাধ্যমে আমাদের সাথে সরাসরি যোগাযোগ করুন। ২৪ ঘণ্টার মধ্যে রেসপন্স পাবেন।"
  });

  return (
    <div className="contact-page">
      <SEO
        title={seo.title}
        description={seo.description}
        keywords="contact digital marketing agency, hire creative agency, contact graphic design service, contact video editing service, contact social media management, hire marketing agency, best marketing agency contact, creative agency consultation, digital marketing consultation, web design agency contact, branding agency contact, social media marketing consultation, video production company contact, contact creatifybd, hire creatifybd"
        schema={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Contact CreatifyBD - Best Digital Marketing Agency",
          "description": "Contact CreatifyBD for professional creative services including social media management, graphic design, video editing, and website design.",
          "url": "https://creatifybd.com/contact",
          "provider": {
            "@type": "Organization",
            "name": "CreatifyBD",
            "telephone": "+8801951676600",
            "email": "hello@creatifybd.com",
            "url": "https://creatifybd.com"
          }
        }}
      />
      <Navbar />

      <div className="page-header page-header-light">
        <div className="container">
          <motion.h1
            className="page-title"
            initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.85, ease: EASE_EXPO, delay: 0.08 }}
          >
            যোগাযোগ <span className="red">করুন</span>
          </motion.h1>

          <motion.p
            className="page-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE_EXPO, delay: 0.2 }}
          >
            আপনার পরবর্তী প্রজেক্ট নিয়ে কথা বলতে সরাসরি মেসেজ পাঠান অথবা WhatsApp-এ নক দিন।
          </motion.p>
        </div>
      </div>

      <Contact fullPage={true} />
      <Footer />
    </div>
  );
};

export default ContactPage;
