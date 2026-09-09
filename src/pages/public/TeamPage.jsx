import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import AboutTrust from '../../components/AboutTrust';
import release from '../../data/publishedRelease.json';
export default function TeamPage() {
  const team = (release.team || []).filter(member => member.published && member.name);
  return <div className="cb-page"><SEO title="আমাদের মানুষ ও কাজ | CreatifyBD" description="CreatifyBD-এর প্রতিষ্ঠাতা ও কাজের ভাবনার সঙ্গে পরিচিত হন।" /><Navbar /><main id="main-content"><section className="cb-section"><div className="cb-container cb-page-intro"><p className="cb-eyebrow">একসঙ্গে কাজের মানুষ</p><h1>আপনার প্রয়োজন বুঝে<br />কাজ গুছিয়ে নেওয়ার সঙ্গী।</h1><p>কাজের ধরন অনুযায়ী ডিজাইন, ভিডিও ও ওয়েবসাইটের দায়িত্ব ঠিক করা হয়। আপনার কাজটি কে দেখবেন এবং কীভাবে যোগাযোগ হবে, শুরুতেই তা জানিয়ে দেওয়া হবে।</p><div className="cb-actions"><Link to="/contact" className="cb-button cb-button-red">আমাদের সঙ্গে কথা বলুন</Link></div></div></section><AboutTrust />{team.length > 0 && <section className="cb-section"><div className="cb-container cb-review-grid">{team.map(member => <article key={member.id}>{member.photo && <img src={member.photo} width={400} height={400} alt={member.name} loading="lazy" />}<h2>{member.name}</h2><p>{member.role}</p></article>)}</div></section>}</main><Footer /></div>;
}
