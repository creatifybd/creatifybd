import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../config/siteConfig';
import release from '../data/publishedRelease.json';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const subscribe = async event => {
    event.preventDefault();
    if (status === 'sending') return;
    setStatus('sending'); setMessage('');
    try {
      const { subscribeToNewsletter } = await import('../firebase/subscriptions');
      await subscribeToNewsletter(email);
      setStatus('success'); setEmail(''); setMessage('অনুরোধটি পেয়েছি। ধন্যবাদ!');
    } catch { setStatus('idle'); setMessage('এই মুহূর্তে পাঠানো যায়নি। পরে আবার চেষ্টা করুন।'); }
  };
  return <footer className="cb-footer"><div className="cb-container">
    <div className="cb-footer-grid">
      <div className="cb-footer-brand"><Link to="/" className="cb-brand" aria-label="CreatifyBD হোমপেজ"><img src={release.site.logo_url} width="44" height="44" alt="" /><span>Creatify<strong>BD</strong></span></Link><p>বাংলাদেশের ব্যবসার জন্য সোশ্যাল মিডিয়ার কনটেন্ট, ব্র্যান্ডিং, ভিডিও ও ওয়েবসাইট। আপনার প্রয়োজন বুঝে, একসঙ্গে গুছিয়ে।</p><div className="cb-social-links"><a href={siteConfig.socialLinks.facebook} target="_blank" rel="noopener noreferrer">Facebook</a><a href={siteConfig.socialLinks.instagram} target="_blank" rel="noopener noreferrer">Instagram</a><a href={siteConfig.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></div></div>
      <div><h3>আমাদের সেবা</h3><ul>{release.services.map(s => <li key={s.id}><Link to={`/services/${s.id}`}>{s.title}</Link></li>)}<li><Link to="/pricing">মাসিক প্যাকেজ</Link></li></ul></div>
      <div><h3>আরও জানুন</h3><ul><li><Link to="/portfolio">কাজের নমুনা</Link></li><li><Link to="/about">আমাদের সম্পর্কে</Link></li><li><Link to="/process">কাজের ধাপ</Link></li><li><Link to="/reviews">গ্রাহকের অভিজ্ঞতা</Link></li><li><Link to="/contact">যোগাযোগ</Link></li><li><Link to="/client/orders">আপনার অর্ডার</Link></li></ul></div>
      <form className="cb-newsletter" onSubmit={subscribe}><h3>কনটেন্ট ও ডিজাইনের কথা</h3><label htmlFor="newsletter-email">ইমেইলে আপডেট পেতে চাই</label><input id="newsletter-email" name="email" type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} required maxLength={180} placeholder="আপনার ইমেইল" /><button type="submit" className="cb-button cb-button-outline" disabled={status === 'sending'}>{status === 'sending' ? 'পাঠানো হচ্ছে…' : 'যুক্ত থাকুন'}</button><p aria-live="polite">{message || 'ইমেইল দিয়ে যুক্ত হলে আমাদের আপডেট পেতে সম্মতি দিচ্ছেন।'}</p></form>
    </div>
    <div className="cb-footer-bottom"><p>© CreatifyBD · ঢাকা, বাংলাদেশ</p><div><Link to="/privacy">গোপনীয়তা</Link><Link to="/terms">কাজের শর্ত</Link><Link to="/refund-policy">ফেরত নীতি</Link><Link to="/revision-policy">সংশোধনের নিয়ম</Link></div></div>
  </div></footer>;
}
