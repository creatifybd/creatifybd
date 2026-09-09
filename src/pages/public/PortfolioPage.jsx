import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import Portfolio from '../../components/Portfolio';
export default function PortfolioPage() {
  return <div className="cb-page"><SEO title="কাজের নমুনা | CreatifyBD" description="বাংলাদেশের ব্যবসার উপযোগী সোশ্যাল পোস্ট, ব্র্যান্ডিং, প্যাকেজিং, ভিডিও ও ওয়েবসাইটের নির্বাচিত ডিজাইন।" /><Navbar /><main id="main-content"><Portfolio fullPage /></main><Footer /></div>;
}
