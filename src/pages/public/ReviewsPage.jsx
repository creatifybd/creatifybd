import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import Testimonials from '../../components/Testimonials';
export default function ReviewsPage() {
  return <div className="cb-page"><SEO title="গ্রাহকের অভিজ্ঞতা | CreatifyBD" description="CreatifyBD-এর কাজ সম্পর্কে জানুন এবং আপনার নিজের কাজের অভিজ্ঞতা জানান।" /><Navbar /><main id="main-content"><section className="cb-section"><div className="cb-container cb-page-intro"><p className="cb-eyebrow">কাজের সম্পর্ক</p><h1>আপনার অভিজ্ঞতা<br />আমাদের কাছে গুরুত্বপূর্ণ।</h1><p>আমাদের সঙ্গে কাজ করে থাকলে কোন বিষয়টি ভালো লেগেছে এবং কোথায় আরও ভালো করা যায়, জানাতে পারেন। নতুন কাজের আগে আমাদের নমুনা দেখুন এবং আপনার প্রশ্নগুলো নিয়ে কথা বলুন।</p><div className="cb-actions"><Link to="/contact?message=CreatifyBD-এর%20সঙ্গে%20কাজের%20অভিজ্ঞতা%20জানাতে%20চাই।" className="cb-button cb-button-red">আপনার অভিজ্ঞতা জানান</Link><Link to="/portfolio" className="cb-text-link">কাজের নমুনা দেখুন</Link></div></div></section><Testimonials fullPage /></main><Footer /></div>;
}
