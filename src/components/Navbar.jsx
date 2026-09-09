import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight, ChevronDown } from 'lucide-react';
import release from '../data/publishedRelease.json';

const links = [
  ['/portfolio', 'কাজের নমুনা'], ['/pricing', 'প্যাকেজ ও মূল্য'],
  ['/about', 'আমাদের সম্পর্কে'], ['/contact', 'যোগাযোগ'],
];
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const dialog = useRef(null);
  const menuButton = useRef(null);
  const { pathname } = useLocation();
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    const node = dialog.current;
    if (open && !node.open) node.showModal();
    if (!open && node.open) node.close();
    const previous = document.body.style.overflow;
    if (open) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [open]);
  return <>
    <a href="#main-content" className="cb-skip-link">মূল বিষয়ে যান</a>
    <header className="cb-nav"><div className="cb-container cb-nav-inner">
      <Link to="/" className="cb-brand" aria-label="CreatifyBD হোমপেজ"><img src={release.site.logo_url} alt="" width="44" height="44" /><span>Creatify<strong>BD</strong></span></Link>
      <nav className="cb-desktop-nav" aria-label="প্রধান মেনু">
        <details className="cb-nav-services"><summary>আমাদের সেবা<ChevronDown size={15} /></summary><div>{release.services.map(s => <Link key={s.id} to={`/services/${s.id}`} onClick={e => { e.currentTarget.closest('details').open = false; }}>{s.title}</Link>)}<Link to="/services" onClick={e => { e.currentTarget.closest('details').open = false; }}>সব সেবা দেখুন</Link></div></details>
        {links.map(([to, label]) => <NavLink key={to} to={to}>{label}</NavLink>)}
      </nav>
      <Link to="/contact" className="cb-nav-cta">কাজ নিয়ে কথা বলি<ArrowUpRight size={17} /></Link>
      <button ref={menuButton} type="button" className="cb-menu-toggle" aria-label="মেনু খুলুন" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(true)}><Menu size={25} /></button>
    </div></header>
    <dialog ref={dialog} id="mobile-navigation" className="cb-mobile-dialog" onCancel={() => setOpen(false)} onClose={() => { setOpen(false); menuButton.current?.focus(); }} onClick={event => { if (event.target === dialog.current) setOpen(false); }} aria-labelledby="mobile-menu-title">
      <div className="cb-mobile-top"><strong id="mobile-menu-title">CreatifyBD</strong><button type="button" aria-label="মেনু বন্ধ করুন" onClick={() => setOpen(false)}><X size={25} /></button></div>
      <nav aria-label="মোবাইল মেনু"><Link to="/" onClick={() => setOpen(false)}>হোমপেজ</Link><details><summary>আমাদের সেবা</summary>{release.services.map(s => <Link key={s.id} to={`/services/${s.id}`} onClick={() => setOpen(false)}>{s.title}</Link>)}<Link to="/services" onClick={() => setOpen(false)}>সব সেবা</Link></details>{links.map(([to, label]) => <NavLink key={to} to={to} onClick={() => setOpen(false)}>{label}</NavLink>)}<Link to="/reviews" onClick={() => setOpen(false)}>গ্রাহকের অভিজ্ঞতা</Link></nav>
      <Link to="/contact" className="cb-button cb-button-red" onClick={() => setOpen(false)}>আপনার প্রয়োজন জানান<ArrowUpRight size={18} /></Link>
    </dialog>
  </>;
}
