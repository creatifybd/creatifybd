import React from 'react';
import Navbar from '../../components/Navbar';
import Process from '../../components/Process';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import usePageSEO from '../../hooks/usePageSEO';
import { motion } from 'framer-motion';

const EASE_EXPO = [0.16, 1, 0.3, 1];

const ProcessPage = () => {
  const seo = usePageSEO('process', {
    title: "কাজের প্রক্রিয়া — CreatifyBD",
    description: "প্রথম আলোচনা থেকে চূড়ান্ত ডেলিভারি—আমাদের ৫টি সহজ ও সুশৃঙ্খল কাজের ধাপ।"
  });

  return (
    <div className="process-page">
      <SEO
        title={seo.title}
        description={seo.description}
        keywords="about creatifybd, creative agency process, web design workflow, digital marketing strategy"
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
            আমাদের <span className="red">কাজের প্রক্রিয়া</span>
          </motion.h1>

          <motion.p
            className="page-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE_EXPO, delay: 0.2 }}
          >
            প্রথম আলোচনা থেকে চূড়ান্ত ডেলিভারি—একটি সুশৃঙ্খল ও স্বচ্ছ পদ্ধতিতে আপনার ব্র্যান্ডকে এগিয়ে নিয়ে যাওয়া।
          </motion.p>
        </div>
      </div>

      <Process fullPage={true} />
      <Footer />
    </div>
  );
};

export default ProcessPage;
