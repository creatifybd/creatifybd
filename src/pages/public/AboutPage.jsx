import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import AboutTrust from '../../components/AboutTrust';
import Process from '../../components/Process';
export default function AboutPage() {
  return <div className="cb-page"><SEO title="আমাদের সম্পর্কে | CreatifyBD" description="বাংলাদেশের ব্যবসার জন্য কনটেন্ট, ডিজাইন, ভিডিও ও ওয়েবসাইট নিয়ে কাজ করে CreatifyBD। আমাদের ভাবনা ও কাজের পদ্ধতি জানুন।" /><Navbar /><main id="main-content"><section className="cb-section"><div className="cb-container"><div className="cb-page-intro"><p className="cb-eyebrow">CreatifyBD সম্পর্কে</p><h1>সুন্দর কাজের সঙ্গে<br />দরকার ভালো বোঝাপড়া।</h1><p>একটি ব্যবসা দাঁড় করাতে কতটা সময় আর মনোযোগ লাগে, আমরা তা বুঝি। তাই ডিজাইনের কাজ শুধু সুন্দর দেখানোয় শেষ হয় না। আপনার পণ্য ও সেবার কথা গ্রাহক সহজে বুঝতে পারছেন কি না, সেটিও আমাদের ভাবনার অংশ।</p><div className="cb-actions"><Link to="/portfolio" className="cb-button cb-button-red">কাজের নমুনা দেখুন</Link><Link to="/contact" className="cb-text-link">আপনার ব্যবসা নিয়ে কথা বলুন</Link></div></div><div className="cb-values"><article><h3>পরিচিত ভাষায় কথা</h3><p>বাংলাদেশের গ্রাহকের কাছে স্বাভাবিক শোনায় এমন লেখা ও প্রাসঙ্গিক ডিজাইন।</p></article><article><h3>একসঙ্গে গুছিয়ে কাজ</h3><p>পোস্ট, ভিডিও, ব্র্যান্ডিং ও ওয়েবসাইটে একই ব্যবসার পরিচিতি বজায় রাখার চেষ্টা।</p></article><article><h3>পরিষ্কার দায়িত্ব</h3><p>শুরুতেই কাজের তালিকা, সময়, খরচ ও মতামত দেওয়ার ধাপ মিলিয়ে নেওয়া।</p></article></div></div></section><AboutTrust /><Process /></main><Footer /></div>;
}
