import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import Process from '../../components/Process';
export default function ProcessPage() {
  return <div className="cb-page"><SEO title="কাজের ধাপ | CreatifyBD" description="প্রথম আলোচনা থেকে কাজ বুঝিয়ে দেওয়া পর্যন্ত CreatifyBD-এর কাজের পাঁচটি ধাপ।" /><Navbar /><main id="main-content"><Process fullPage /></main><Footer /></div>;
}
