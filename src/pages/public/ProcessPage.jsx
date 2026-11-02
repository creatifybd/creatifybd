import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import Process from '../../components/Process';
import { Link } from 'react-router-dom';
export default function ProcessPage() {
  return <div className="cb-page"><SEO title="কাজের ধাপ | CreatifyBD" description="প্রথম আলোচনা থেকে কাজ বুঝিয়ে দেওয়া পর্যন্ত CreatifyBD-এর কাজের পাঁচটি ধাপ।" /><Navbar /><main id="main-content"><Process fullPage /><section className="cb-section cb-service-scope"><div className="cb-container"><h2>কাজ শুরুর আগে এক পাতায় মিলিয়ে নিন</h2><div className="cb-values"><article><h3>কী তৈরি হবে</h3><p>ডিজাইন, পেজ বা ভিডিওর সংখ্যা, প্রয়োজনীয় আকার, ফাইলের ধরন এবং কোন কাজ অন্তর্ভুক্ত নয়—সব লিখিত প্রস্তাবে রাখুন।</p></article><article><h3>কখন সিদ্ধান্ত লাগবে</h3><p>ব্রিফ, প্রথম ড্রাফট, আপনার মতামত ও final delivery-এর ধাপ ঠিক করুন। সময় পরিবর্তন প্রয়োজন হলে আগে আলোচনা হবে।</p></article><article><h3>কীভাবে কাজ বুঝে নেবেন</h3><p>চূড়ান্ত লেখা, মাপ, লিংক ও ফাইল মিলিয়ে অনুমোদন দিন। Source file, licence এবং access হস্তান্তর প্রস্তাব অনুযায়ী যাচাই করুন।</p></article></div><div className="cb-custom-work"><div><h3>একটি পরিষ্কার ব্রিফ দিয়ে শুরু করুন</h3><p>ব্যবসার পরিচয়, লক্ষ্য, প্রয়োজনীয় কাজ, রেফারেন্স ও সম্ভাব্য সময় জানালেই প্রথম আলোচনা অনেক সহজ হয়।</p></div><Link to="/contact" className="cb-button cb-button-red">কাজের প্রয়োজন জানান</Link></div></div></section></main><Footer /></div>;
}
