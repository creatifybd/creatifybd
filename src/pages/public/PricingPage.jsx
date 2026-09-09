import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import Pricing from '../../components/Pricing';

export default function PricingPage() {
  return <div className="cb-page"><SEO title="মাসিক সোশ্যাল মিডিয়া প্যাকেজ ও মূল্য | CreatifyBD" description="মাসিক ৫,০০০, ৭,০০০ ও ১০,০০০ টাকার সোশ্যাল মিডিয়া প্যাকেজ। পোস্টার, ভিডিও ও প্ল্যাটফর্মের সংখ্যা তুলনা করে আপনার প্রয়োজন জানান।" /><Navbar /><main id="main-content"><Pricing fullPage /></main><Footer /></div>;
}
