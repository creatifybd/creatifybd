import React from 'react';
import { Link } from 'react-router-dom';
const industries = [
  ['খাবার ও রেস্টুরেন্ট', 'মেনু, প্যাকেজিং ও নতুন অফারের প্রচার।'],
  ['পোশাক ও অনলাইন শপ', 'পণ্যের পরিচিতি, ক্যাম্পেইন ও সোশ্যাল কনটেন্ট।'],
  ['ভোগ্যপণ্য ও উৎপাদন', 'লেবেল, প্যাকেজিং, ক্যাটালগ ও ব্র্যান্ড পরিচিতি।'],
  ['স্থানীয় সেবা ব্যবসা', 'সেবার ব্যাখ্যা, বিশ্বাসযোগ্য পরিচিতি ও ওয়েবসাইট।'],
];
export default function BusinessGuide() {
  return <section className="cb-section cb-business-guide"><div className="cb-container"><div className="cb-section-heading"><div><p className="cb-eyebrow">আপনার ব্যবসার প্রয়োজন থেকে শুরু</p><h2>একই সমাধান<br /><span>সব ব্যবসার জন্য নয়।</span></h2></div><p>আপনার পণ্য, গ্রাহক ও বাজেট বুঝে<br />প্রয়োজনীয় কাজগুলো বেছে নিই।</p></div><div className="cb-industry-grid">{industries.map(([title,description]) => <article key={title}><h3>{title}</h3><p>{description}</p></article>)}</div><Link className="cb-text-link" to="/contact">আপনার ব্যবসার কথা জানান →</Link></div></section>;
}
