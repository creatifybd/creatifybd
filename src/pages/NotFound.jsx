import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

export default function NotFound() {
  return <div className="cb-page"><SEO title="পেজটি পাওয়া যায়নি | CreatifyBD" description="সঠিক সেবা বা কাজের নমুনা খুঁজতে CreatifyBD-এর হোমপেজে ফিরে যান।" noIndex /><Navbar /><main id="main-content"><section className="cb-section"><div className="cb-container cb-page-intro"><p className="cb-eyebrow">৪০৪</p><h1>পেজটি পাওয়া যায়নি।</h1><p>লিংকটি ভুল হতে পারে অথবা পেজটি সরিয়ে নেওয়া হয়েছে। আমাদের সেবা ও কাজের নমুনা হোমপেজ থেকে দেখতে পারেন।</p><div className="cb-actions"><Link to="/" className="cb-button cb-button-red">হোমপেজে ফিরে যান</Link><Link to="/contact" className="cb-button cb-button-outline">যোগাযোগ করুন</Link></div></div></section></main><Footer /></div>;
}
