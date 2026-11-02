import React from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../config/siteConfig';
import release from '../data/publishedRelease.json';

export default function Footer() {
  return <footer className="cb-footer"><div className="cb-container">
    <div className="cb-footer-grid">
      <div className="cb-footer-brand"><Link to="/" className="cb-brand" aria-label="CreatifyBD হোমপেজ"><img src={release.site.logo_url} width="44" height="44" alt="" /><span>Creatify<strong>BD</strong></span></Link><p>বাংলাদেশের ব্যবসার জন্য সোশ্যাল মিডিয়ার কনটেন্ট, ব্র্যান্ডিং, ভিডিও ও ওয়েবসাইট। আপনার প্রয়োজন বুঝে, একসঙ্গে গুছিয়ে।</p><div className="cb-social-links"><a href={siteConfig.socialLinks.facebook} target="_blank" rel="noopener noreferrer">Facebook</a><a href={siteConfig.socialLinks.instagram} target="_blank" rel="noopener noreferrer">Instagram</a><a href={siteConfig.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></div></div>
      <div><h3>আমাদের সেবা</h3><ul>{release.services.map(s => <li key={s.id}><Link to={`/services/${s.id}`}>{s.title}</Link></li>)}<li><Link to="/pricing">মাসিক প্যাকেজ</Link></li></ul></div>
      <div><h3>আরও জানুন</h3><ul><li><Link to="/portfolio">কাজের নমুনা</Link></li><li><Link to="/about">আমাদের সম্পর্কে</Link></li><li><Link to="/process">কাজের ধাপ</Link></li><li><Link to="/reviews">গ্রাহকের অভিজ্ঞতা</Link></li><li><Link to="/contact">যোগাযোগ</Link></li><li><Link to="/client/orders">আপনার অর্ডার</Link></li></ul></div>
      <div><h3>আপনার কাজ নিয়ে কথা বলি</h3><p>কাজের ধরন, সময় ও বাজেট জানালে প্রয়োজন অনুযায়ী প্রস্তাব দিতে পারব।</p><Link className="cb-button cb-button-outline" to="/contact">কাজের বিস্তারিত জানান</Link><p><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></p></div>
    </div>
    <div className="cb-footer-bottom"><p>© CreatifyBD · ঢাকা, বাংলাদেশ</p><div><Link to="/privacy">গোপনীয়তা</Link><Link to="/terms">কাজের শর্ত</Link><Link to="/refund-policy">ফেরত নীতি</Link><Link to="/revision-policy">সংশোধনের নিয়ম</Link></div></div>
  </div></footer>;
}
