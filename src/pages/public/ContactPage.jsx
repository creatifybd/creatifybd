import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import Contact from '../../components/Contact';
export default function ContactPage() {
  return <div className="cb-page"><SEO title="যোগাযোগ | CreatifyBD" description="আপনার পেজ, ডিজাইন বা ওয়েবসাইটের প্রয়োজন নিয়ে CreatifyBD-এর সঙ্গে কথা বলুন।" /><Navbar /><main id="main-content"><Contact fullPage /></main><Footer /></div>;
}
