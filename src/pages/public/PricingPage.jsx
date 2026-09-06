import React from 'react';
import Navbar from '../../components/Navbar';
import Pricing from '../../components/Pricing';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import usePageSEO from '../../hooks/usePageSEO';
import { motion } from 'framer-motion';

const PricingPage = () => {
  const seo = usePageSEO('pricing', {
    title: "প্যাকেজ ও মূল্য তালিকা — CreatifyBD",
    description: "সোশ্যাল মিডিয়া ম্যানেজমেন্ট স্পেশাল অফার প্যাকেজ (৳৫,০০০ থেকে শুরু) এবং ব্র্যান্ডিং, ভিডিও ও ওয়েবের কাস্টম বাজেট।"
  });

  return (
    <div className="pricing-page">
      <SEO
        title={seo.title}
        description={seo.description}
        keywords="সোশ্যাল মিডিয়া প্যাকেজ, লোগো ডিজাইন মূল্য, ভিডিও এডিটিং খরচ, ওয়েবসাইট ডেভেলপমেন্ট প্রাইস, creatifybd pricing"
      />
      <Navbar theme="light" />
      <div className="page-header page-header-light">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container"
          style={{ textAlign: 'center' }}
        >
          <h1 className="page-title">স্বচ্ছ <span className="red">প্যাকেজ ও প্রাইসিং</span></h1>
          <p className="page-subtitle" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
            সোশ্যাল মিডিয়া, ব্র্যান্ডিং, ভিডিও এডিটিং ও ওয়েব ডেভেলপমেন্টের জন্য উপযুক্ত প্যাকেজ।
          </p>
        </motion.div>
      </div>
      <Pricing fullPage={false} />
      <Footer />
    </div>
  );
};

export default PricingPage;
