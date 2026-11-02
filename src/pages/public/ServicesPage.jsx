import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import Services from '../../components/Services';
import { Link } from 'react-router-dom';
export default function ServicesPage() {
  return <div className="cb-page"><SEO title="সেবা ও কাজের ধরন | CreatifyBD" description="বাংলাদেশের ব্যবসার জন্য সোশ্যাল মিডিয়া, ডিজাইন, ভিডিও ও ওয়েবসাইটের সেবা।" /><Navbar /><main id="main-content"><Services fullPage /><section className="cb-section cb-service-scope"><div className="cb-container"><h2>একটি কাজ, নাকি পুরো ব্র্যান্ড গুছিয়ে নেওয়া?</h2><div className="cb-values"><article><h3>পণ্য বাজারে আনছেন</h3><p>লোগো, প্যাকেজিং, লেবেল এবং প্রচারের ডিজাইন—কোনটি আগে দরকার, তা মিলিয়ে কাজের তালিকা তৈরি করুন।</p></article><article><h3>নিয়মিত প্রচার দরকার</h3><p>পণ্যের ছবি, অফার ও গ্রাহকের প্রশ্ন থেকে পোস্ট ও ভিডিওর পরিকল্পনা করুন। প্রকাশের দায়িত্ব আগেই ঠিক করে নিন।</p></article><article><h3>অনলাইনে পরিচিতি চান</h3><p>ব্যবসার তথ্য, কাজের নমুনা ও যোগাযোগের পথ নিয়ে ওয়েবসাইটের কাঠামো গুছিয়ে নিন।</p></article></div><div className="cb-custom-work"><p>কোন সেবা প্রয়োজন নিশ্চিত না হলেও আপনার লক্ষ্যটি জানাতে পারেন।</p><Link to="/contact" className="cb-button cb-button-red">প্রয়োজন নিয়ে কথা বলুন</Link></div></div></section></main><Footer /></div>;
}
