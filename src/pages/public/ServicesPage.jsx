import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import Services from '../../components/Services';
export default function ServicesPage() {
  return <div className="cb-page"><SEO title="সেবা ও কাজের ধরন | CreatifyBD" description="বাংলাদেশের ব্যবসার জন্য সোশ্যাল মিডিয়া, ডিজাইন, ভিডিও ও ওয়েবসাইটের সেবা।" /><Navbar /><main id="main-content"><Services fullPage /></main><Footer /></div>;
}
