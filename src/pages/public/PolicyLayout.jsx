import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';

export default function PolicyLayout({ title, seoDescription, lastUpdated, canonical, children }) {
  return <div className="cb-page"><SEO title={`${title} | CreatifyBD`} description={seoDescription} url={canonical} /><Navbar /><main id="main-content" className="cb-section"><article className="cb-container policy-content" style={{ maxWidth: '800px' }}><header className="cb-page-intro"><p className="cb-eyebrow">কাজের আগে জেনে নিন</p><h1>{title}</h1><p>সর্বশেষ পর্যালোচনা: {lastUpdated}</p></header>{children}<nav aria-label="সম্পর্কিত নীতিমালা" className="cb-actions"><Link className="cb-text-link" to="/privacy">গোপনীয়তা</Link><Link className="cb-text-link" to="/terms">কাজের শর্ত</Link><Link className="cb-text-link" to="/refund-policy">রিফান্ড</Link><Link className="cb-text-link" to="/revision-policy">সংশোধন</Link></nav></article></main><Footer /></div>;
}
