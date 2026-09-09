import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowUpRight, X, ChevronLeft, ChevronRight } from 'lucide-react';
import release from '../data/publishedRelease.json';
import OptimizedImage from './OptimizedImage';
import { formatBangla } from '../data/offers';

const categories = [['all', 'সব কাজ'], ['social', 'সোশ্যাল পোস্ট'], ['branding', 'লোগো ও ব্র্যান্ডিং'], ['packaging', 'প্যাকেজিং'], ['web', 'ওয়েবসাইট'], ['video', 'ভিডিও'], ['apparel', 'মার্চেন্ডাইজ']];
export default function Portfolio({ highlight = false, fullPage = false }) {
  const [params] = useSearchParams();
  const [category, setCategory] = useState('all');
  const [count, setCount] = useState(12);
  const [selected, setSelected] = useState(null);
  const dialog = useRef(null);
  const closeButton = useRef(null);
  useEffect(() => { const requested = params.get('category'); if (categories.some(([key]) => key === requested)) { setCategory(requested); setCount(12); } }, [params]);
  const items = useMemo(() => highlight
    ? release.portfolio.filter(item => Number.isInteger(item.featuredOrder)).sort((a, b) => a.featuredOrder - b.featuredOrder).slice(0, 12)
    : release.portfolio.filter(item => category === 'all' || item.category === category), [highlight, category]);
  const visible = highlight ? items : items.slice(0, count);
  useEffect(() => {
    const node = dialog.current;
    if (selected && !node.open) node.showModal();
    if (!selected && node.open) node.close();
    const previous = document.body.style.overflow;
    if (selected) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [selected]);
  const move = direction => {
    const index = items.findIndex(item => item.id === selected.id);
    setSelected(items[(index + direction + items.length) % items.length]);
  };
  const Heading = fullPage ? 'h1' : 'h2';
  return <section className="cb-section cb-portfolio" id="portfolio"><div className="cb-container">
    <div className="cb-section-heading"><div><p className="cb-eyebrow">কাজের নমুনা</p><Heading>আপনার মতো ব্যবসার জন্য।<br /><span>নানা ধরনের ভাবনা ও ডিজাইন।</span></Heading></div><p>খাবার, পোশাক, পণ্য কিংবা সেবা—<br />প্রতিটি ব্যবসার কথা বলার ধরন আলাদা।</p></div>
    {!highlight && <div className="cb-filter-list" role="group" aria-label="কাজের ধরন বেছে নিন">{categories.map(([key, label]) => <button type="button" key={key} aria-pressed={category === key} onClick={() => { setCategory(key); setCount(12); }}>{label}</button>)}</div>}
    <div className="cb-portfolio-grid">{visible.map(item => <article className="cb-work-card" key={item.id}>
      <button className="cb-work-open" type="button" onClick={() => setSelected(item)} aria-label={`${item.title} বড় করে দেখুন`}><OptimizedImage src={item.thumbnail || item.image} srcSet={item.srcSet} sizes="(max-width: 350px) 94vw, (max-width: 900px) 46vw, 30vw" alt={item.title} width={640} height={640} aspectRatio="1 / 1" /></button>
      <div className="cb-work-meta"><h3>{item.title}</h3><p>{item.industry}</p>{item.workType === 'concept' && <small>ধারণাভিত্তিক ডিজাইন</small>}</div>
    </article>)}</div>
    <div className="cb-portfolio-more">{highlight ? <Link className="cb-button cb-button-outline" to="/portfolio">সব কাজের নমুনা দেখুন<ArrowUpRight size={18} /></Link> : <><p aria-live="polite">{formatBangla(items.length)}টি কাজের মধ্যে {formatBangla(visible.length)}টি দেখছেন</p>{visible.length < items.length && <button type="button" className="cb-button cb-button-outline" onClick={() => setCount(previous => previous + 12)}>আরও কাজ দেখুন</button>}</>}</div>
  </div>
  <dialog ref={dialog} className="cb-lightbox" onCancel={() => setSelected(null)} onClose={() => setSelected(null)} aria-labelledby="portfolio-dialog-title">
    <button ref={closeButton} type="button" className="cb-lightbox-close" aria-label="ছবি বন্ধ করুন" onClick={() => setSelected(null)}><X size={22} /></button>
    {selected && <><figure><img src={selected.image} width={1080} height={1080} alt={selected.title} /><figcaption><h3 id="portfolio-dialog-title">{selected.title}</h3><p>{selected.description}</p>{selected.workType === 'concept' && <p>এটি একটি ধারণাভিত্তিক ডিজাইন; বাস্তব গ্রাহকের প্রকল্প হিসেবে উপস্থাপিত নয়।</p>}</figcaption></figure><div className="cb-actions" style={{ padding: '0 28px 24px', justifyContent: 'space-between' }}><button type="button" onClick={() => move(-1)} className="cb-button cb-button-outline"><ChevronLeft size={18} />আগের কাজ</button><button type="button" onClick={() => move(1)} className="cb-button cb-button-outline">পরের কাজ<ChevronRight size={18} /></button></div></>}
  </dialog></section>;
}
