import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu, X, ArrowUpRight, ChevronDown,
  BarChart2, Palette, Video, Globe2,
  Share2, PenTool, Film, LayoutGrid, Layers,
  MousePointerClick, Monitor, Box,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const EASE_EXPO = [0.16, 1, 0.3, 1];
const RED = '#e8192c';

/* ── Service categories ─────────────────────────────────────── */
const SERVICE_ITEMS = [
  { slug: 'social-media-management', label: 'Social Media Management', icon: <BarChart2 size={16} />, desc: 'Content calendars & strategy' },
  { slug: 'graphic-design',          label: 'Graphic Design',          icon: <Palette  size={16} />, desc: 'Logos, brand identity & print' },
  { slug: 'video-editing',           label: 'Video Editing',           icon: <Video    size={16} />, desc: 'Reels, YouTube & promos' },
  { slug: 'website-design',          label: 'Website Design',          icon: <Globe2   size={16} />, desc: 'Landing pages & business sites' },
];

const SERVICE_SUB_ROWS = [
  { slug: 'social-media-management', label: 'Social Media Posts',   icon: <Share2          size={15} /> },
  { slug: 'social-media-management', label: 'Content Calendars',    icon: <LayoutGrid      size={15} /> },
  { slug: 'graphic-design',          label: 'Logo Design',          icon: <PenTool         size={15} /> },
  { slug: 'graphic-design',          label: 'Brand Identity',       icon: <Layers          size={15} /> },
  { slug: 'video-editing',           label: 'Reels & Short Videos', icon: <Film            size={15} /> },
  { slug: 'video-editing',           label: 'YouTube Editing',      icon: <MousePointerClick size={15} /> },
  { slug: 'website-design',          label: 'Landing Pages',        icon: <Monitor         size={15} /> },
  { slug: 'website-design',          label: 'Business Websites',    icon: <Box             size={15} /> },
];

const navLinks = [
  { to: '/services',  label: 'Services',  hasPanel: true },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/pricing',   label: 'Pricing'   },
  { to: '/contact',   label: 'Contact'   },
];

/* ══════════════════════════════════════════════════════════════ */
const Navbar = () => {
  const { settings } = useSettings();
  const [scrolled, setScrolled]       = useState(false);
  const [isMobileOpen, setMobileOpen] = useState(false);
  const [panelOpen, setPanelOpen]     = useState(false);
  const [svcOpen, setSvcOpen]         = useState(false);
  const { pathname }                  = useLocation();
  const closeTimer                    = useRef(null);

  /* scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* lock body scroll */
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  /* Escape */
  useEffect(() => {
    const h = (e) => {
      if (e.key === 'Escape') { setMobileOpen(false); setPanelOpen(false); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  /* close on route change */
  useEffect(() => {
    setMobileOpen(false);
    setPanelOpen(false);
    setSvcOpen(false);
  }, [pathname]);

  const isActive   = (p) => pathname === p || (p !== '/' && pathname.startsWith(p));
  const brandName  = settings?.site_name || 'CreatifyBD';
  const brandBase  = brandName.includes('BD') ? brandName.split('BD')[0] : 'Creatify';
  const openPanel  = () => { clearTimeout(closeTimer.current); setPanelOpen(true); };
  const closePanel = () => { closeTimer.current = setTimeout(() => setPanelOpen(false), 150); };

  /* animations */
  const panelVariants = {
    hidden:  { opacity: 0, y: -8, scale: 0.97, x: '-50%' },
    visible: { opacity: 1, y: 0,  scale: 1,    x: '-50%', transition: { duration: 0.22, ease: EASE_EXPO } },
    exit:    { opacity: 0, y: -6, scale: 0.97, x: '-50%', transition: { duration: 0.16, ease: EASE_EXPO } },
  };
  const cardVariants = {
    hidden:  { opacity: 0, y: 6 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.2, ease: EASE_EXPO } }),
  };

  return (
    <>
      {/* ══ DESKTOP NAVBAR ══ */}
      <nav id="navbar" className={`agency-nav${scrolled ? ' scrolled' : ''}`}>
        <div className="agency-nav-inner">

          {/* Logo */}
          <Link to="/" className="agency-nav-logo" aria-label="CreatifyBD home">
            <img
              src={settings?.logo_url || '/favicon.png'}
              alt=""
              className="agency-nav-logo-img"
            />
            <span className="agency-nav-logo-text">
              {brandBase}<em>BD</em>
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="agency-nav-links" role="list">
            {navLinks.map((link) =>
              link.hasPanel ? (
                <li
                  key={link.to}
                  className="nav-services-trigger"
                  onMouseEnter={openPanel}
                  onMouseLeave={closePanel}
                >
                  <Link
                    to={link.to}
                    className={`agency-nav-link nav-services-btn${isActive(link.to) ? ' active' : ''}`}
                    aria-haspopup="true"
                    aria-expanded={panelOpen}
                    onFocus={openPanel}
                    onBlur={closePanel}
                  >
                    {link.label}
                    <ChevronDown
                      size={14}
                      className={`nav-chevron${panelOpen ? ' open' : ''}`}
                    />
                  </Link>

                  <AnimatePresence>
                    {panelOpen && (
                      <motion.div
                        className="nav-mega-panel"
                        role="menu"
                        variants={panelVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onMouseEnter={openPanel}
                        onMouseLeave={closePanel}
                      >
                        <div className="nav-mega-body">
                          <div className="nav-mega-list">
                            <p className="nav-mega-section-label">Our Services</p>
                            <div className="nav-mega-list-grid">
                              {SERVICE_ITEMS.map((svc, i) => (
                                <motion.div key={svc.slug + i} custom={i} variants={cardVariants} initial="hidden" animate="visible">
                                  <Link
                                    to={`/services/${svc.slug}`}
                                    className={`nav-mega-row${pathname.startsWith(`/services/${svc.slug}`) ? ' active' : ''}`}
                                    role="menuitem"
                                    onClick={() => setPanelOpen(false)}
                                  >
                                    <span className="nav-mega-row-icon">{svc.icon}</span>
                                    <div className="nav-mega-row-body">
                                      <span className="nav-mega-row-name">{svc.label}</span>
                                      <span className="nav-mega-row-desc">{svc.desc}</span>
                                    </div>
                                    <ArrowUpRight size={13} className="nav-mega-row-arrow" />
                                  </Link>
                                </motion.div>
                              ))}
                            </div>
                            <div className="nav-mega-divider" />
                            <div className="nav-mega-list-grid">
                              {SERVICE_SUB_ROWS.map((s, i) => (
                                <motion.div key={s.label + i} custom={i} variants={cardVariants} initial="hidden" animate="visible">
                                  <Link
                                    to={`/services/${s.slug}`}
                                    className="nav-mega-sub-row"
                                    role="menuitem"
                                    onClick={() => setPanelOpen(false)}
                                  >
                                    <span className="nav-mega-sub-icon">{s.icon}</span>
                                    <span className="nav-mega-sub-label">{s.label}</span>
                                  </Link>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          <div className="nav-mega-cta-card">
                            <div className="nav-mega-cta-icon">
                              <ArrowUpRight size={22} />
                            </div>
                            <p className="nav-mega-cta-title">Ready to grow?</p>
                            <p className="nav-mega-cta-text">Get agency-quality creative work at a fraction of the cost.</p>
                            <div className="nav-mega-cta-badges">
                              <span>SMM</span><span>Design</span><span>Video</span><span>Web</span>
                            </div>
                            <Link
                              to="/contact"
                              className="nav-mega-cta-btn"
                              onClick={() => setPanelOpen(false)}
                            >
                              Get a Free Quote
                            </Link>
                          </div>
                        </div>

                        <div className="nav-mega-footer">
                          <Link
                            to="/services"
                            className="nav-mega-footer-link"
                            onClick={() => setPanelOpen(false)}
                          >
                            VIEW ALL SERVICES
                            <ArrowUpRight size={13} />
                          </Link>
                          <span className="nav-mega-footer-tag">Up to 50% lower cost · Agency-grade quality</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              ) : (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`agency-nav-link${isActive(link.to) ? ' active' : ''}`}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            )}
          </ul>

          {/* Right actions */}
          <div className="agency-nav-right">
            <motion.div whileHover={{ scale: 1.04 }} transition={{ duration: 0.22, ease: EASE_EXPO }}>
              <Link to="/contact" className="agency-nav-cta">
                Get Started
                <ArrowUpRight size={15} />
              </Link>
            </motion.div>

            <button
              className={`agency-hamburger${isMobileOpen ? ' open' : ''}`}
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileOpen}
              type="button"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isMobileOpen
                  ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}><X size={20} /></motion.span>
                  : <motion.span key="m" initial={{ rotate: 90, opacity: 0 }}  animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}><Menu size={20} /></motion.span>
                }
              </AnimatePresence>
            </button>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════════════
          MOBILE DRAWER — 100% inline styles, zero external CSS deps
      ══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              zIndex: 2147483640,
              background: 'rgba(0,0,0,0.58)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
            }}
          >
            {/* Drawer panel — stopPropagation so clicks inside don't close */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.36, ease: EASE_EXPO }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'absolute',
                top: 0, left: 0,
                width: '82vw',
                maxWidth: '340px',
                height: '100%',
                background: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                overflowX: 'hidden',
                boxShadow: '6px 0 48px rgba(0,0,0,0.22)',
                zIndex: 2147483641,
              }}
            >

              {/* ─── HEADER ─────────────────────────────────── */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '15px 16px',
                borderBottom: '1px solid #efefef',
                flexShrink: 0,
              }}>
                <Link
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: '9px', textDecoration: 'none' }}
                >
                  <img
                    src={settings?.logo_url || '/favicon.png'}
                    alt="CreatifyBD"
                    style={{ height: '34px', width: 'auto', maxWidth: '88px', objectFit: 'contain', display: 'block', flexShrink: 0 }}
                  />
                  <span style={{ fontSize: '1.18rem', fontWeight: 800, letterSpacing: '-0.04em', color: '#111', lineHeight: 1, whiteSpace: 'nowrap' }}>
                    {brandBase}<em style={{ fontStyle: 'normal', color: RED }}>BD</em>
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  style={{
                    width: '38px', height: '38px', borderRadius: '10px',
                    border: '1.5px solid #e5e5e5', background: 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: '#222', flexShrink: 0,
                  }}
                >
                  <X size={19} />
                </button>
              </div>

              {/* ─── NAV LINKS ──────────────────────────────── */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '10px 12px', gap: '2px', overflowY: 'auto' }}>

                {/* HOME */}
                <Link to="/" onClick={() => setMobileOpen(false)} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 14px', borderRadius: '12px', textDecoration: 'none',
                  color: pathname === '/' ? RED : '#111',
                  background: pathname === '/' ? 'rgba(232,25,44,0.07)' : 'transparent',
                  fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.02em',
                }}>
                  <span>Home</span>
                  <ArrowUpRight size={15} style={{ opacity: 0.4 }} />
                </Link>

                {/* SERVICES accordion */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <button
                    type="button"
                    onClick={() => setSvcOpen(o => !o)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 14px', borderRadius: '12px',
                      background: svcOpen || isActive('/services') ? 'rgba(232,25,44,0.07)' : 'transparent',
                      border: 'none', cursor: 'pointer',
                      color: isActive('/services') ? RED : '#111',
                      fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.02em',
                      width: '100%', textAlign: 'left',
                    }}
                  >
                    <span>Services</span>
                    <ChevronDown size={17} style={{
                      transform: svcOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.28s ease',
                      color: svcOpen ? RED : '#999',
                    }} />
                  </button>

                  <AnimatePresence>
                    {svcOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: EASE_EXPO }}
                        style={{ overflow: 'hidden' }}
                      >
                        {/* Sub-menu container */}
                        <div style={{
                          margin: '4px 0 8px',
                          borderRadius: '14px',
                          border: '1px solid #efefef',
                          background: '#f9f9f9',
                          overflow: 'hidden',
                        }}>
                          {/* "All Services" header row */}
                          <Link to="/services" onClick={() => setMobileOpen(false)} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '9px 14px',
                            background: 'rgba(232,25,44,0.07)',
                            borderBottom: '1px solid #efefef',
                            textDecoration: 'none',
                            color: RED,
                            fontSize: '0.68rem', fontWeight: 800,
                            textTransform: 'uppercase', letterSpacing: '0.08em',
                          }}>
                            All Services <ArrowUpRight size={12} />
                          </Link>

                          {/* Service items */}
                          {SERVICE_ITEMS.map((svc, idx) => (
                            <Link
                              key={svc.slug}
                              to={`/services/${svc.slug}`}
                              onClick={() => setMobileOpen(false)}
                              style={{
                                display: 'flex', alignItems: 'center', gap: '11px',
                                padding: '11px 14px',
                                textDecoration: 'none',
                                background: 'transparent',
                                borderBottom: idx < SERVICE_ITEMS.length - 1 ? '1px solid #f0f0f0' : 'none',
                              }}
                            >
                              <span style={{
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                width: '34px', height: '34px',
                                borderRadius: '9px',
                                background: 'rgba(232,25,44,0.09)',
                                color: RED, flexShrink: 0,
                              }}>
                                {svc.icon}
                              </span>
                              <div>
                                <div style={{ fontSize: '0.865rem', fontWeight: 700, color: '#111', lineHeight: 1.2 }}>
                                  {svc.label}
                                </div>
                                <div style={{ fontSize: '0.71rem', color: '#888', marginTop: '2px' }}>
                                  {svc.desc}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* PORTFOLIO / PRICING / ABOUT / CONTACT */}
                {[
                  { to: '/portfolio', label: 'Portfolio' },
                  { to: '/pricing',   label: 'Pricing'   },
                  { to: '/about',     label: 'About'     },
                  { to: '/contact',   label: 'Contact'   },
                ].map(link => (
                  <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 14px', borderRadius: '12px', textDecoration: 'none',
                    color: isActive(link.to) ? RED : '#111',
                    background: isActive(link.to) ? 'rgba(232,25,44,0.07)' : 'transparent',
                    fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.02em',
                  }}>
                    <span>{link.label}</span>
                    <ArrowUpRight size={15} style={{ opacity: 0.4 }} />
                  </Link>
                ))}

              </div>

              {/* ─── FOOTER CTA ─────────────────────────────── */}
              <div style={{
                padding: '14px 16px',
                borderTop: '1px solid #efefef',
                flexShrink: 0,
              }}>
                <Link
                  to="/contact"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    width: '100%', padding: '14px 20px',
                    background: RED, color: '#fff',
                    fontSize: '0.95rem', fontWeight: 700,
                    borderRadius: '14px', textDecoration: 'none',
                    letterSpacing: '-0.01em', boxSizing: 'border-box',
                  }}
                >
                  Start a Project
                  <ArrowUpRight size={16} />
                </Link>
                <p style={{ textAlign: 'center', fontSize: '0.67rem', color: '#bbb', margin: '8px 0 0' }}>
                  Agency-grade quality · Competitive pricing
                </p>
              </div>

            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        /* ══ DESKTOP NAVBAR ══════════════════════════════════════ */
        .agency-nav {
          position: fixed;
          top: 0; left: 0;
          width: 100%;
          height: var(--nav-height, 90px);
          z-index: 10001;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.55s cubic-bezier(0.16,1,0.3,1);
          padding: 0 2.5rem;
        }
        .agency-nav.scrolled {
          height: 66px;
          top: 16px;
          width: 88%;
          max-width: 1100px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-radius: 100px;
          border: 1px solid var(--border);
          box-shadow: 0 8px 40px rgba(0,0,0,0.08);
          padding: 0 1.75rem;
        }
        .agency-nav-inner {
          width: 100%;
          max-width: 1440px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
        }

        /* Logo */
        .agency-nav-logo {
          display: flex; align-items: center; gap: 8px;
          text-decoration: none; flex-shrink: 0;
        }
        .agency-nav-logo-img {
          height: 32px; width: auto; max-width: 110px;
          object-fit: contain; display: block; flex-shrink: 0;
        }
        .agency-nav-logo-text {
          font-family: var(--font-display);
          font-size: 1.35rem; font-weight: 800;
          letter-spacing: -0.04em; color: var(--ink); line-height: 1;
        }
        .agency-nav-logo-text em { font-style: normal; color: var(--brand-red); }

        /* Links */
        .agency-nav-links {
          display: flex; align-items: center; gap: 0.25rem;
          list-style: none; margin: 0; padding: 0;
        }
        .agency-nav-link {
          position: relative;
          display: inline-flex; align-items: center; gap: 4px;
          padding: 0.5rem 0.9rem;
          font-family: var(--font-body); font-size: 0.875rem; font-weight: 500;
          color: var(--ink); text-decoration: none; border-radius: 8px;
          transition: color 0.18s, background 0.18s;
        }
        .agency-nav-link::after {
          content: ''; position: absolute;
          bottom: 2px; left: 0.9rem; right: 0.9rem; height: 1.5px;
          background: var(--brand-red); transform: scaleX(0);
          transform-origin: left; transition: transform 0.28s cubic-bezier(0.16,1,0.3,1);
          border-radius: 2px;
        }
        .agency-nav-link:hover { color: var(--ink); background: rgba(0,0,0,0.03); }
        .agency-nav-link:hover::after, .agency-nav-link.active::after { transform: scaleX(1); }
        .agency-nav-link.active { color: var(--brand-red); font-weight: 600; }
        .nav-chevron { transition: transform 0.25s cubic-bezier(0.16,1,0.3,1); opacity: 0.6; flex-shrink: 0; }
        .nav-chevron.open { transform: rotate(180deg); opacity: 1; }
        .nav-services-trigger { position: relative; }
        .nav-services-btn { cursor: default; }

        /* Mega panel */
        .nav-mega-panel {
          position: absolute; top: calc(100% + 16px); left: 50%;
          transform: translateX(-50%);
          width: 780px !important; min-width: 780px !important; max-width: 780px !important;
          background: #ffffff; border-radius: 18px;
          box-shadow: 0 24px 60px rgba(0,0,0,0.13), 0 4px 12px rgba(0,0,0,0.05);
          border: 1px solid rgba(0,0,0,0.07); overflow: hidden; z-index: 10010;
          transform-origin: top center;
        }
        .nav-mega-panel::before {
          content: ''; position: absolute; top: -7px; left: 50%;
          transform: translateX(-50%) rotate(45deg); width: 12px; height: 12px;
          background: #fff; border-top: 1px solid rgba(0,0,0,0.07);
          border-left: 1px solid rgba(0,0,0,0.07); border-radius: 2px 0 0 0;
        }
        .nav-mega-body { display: grid; grid-template-columns: 1fr 220px; min-height: 280px; }
        .nav-mega-list { padding: 1.25rem 1.25rem 1rem; border-right: 1px solid rgba(0,0,0,0.06); }
        .nav-mega-section-label {
          font-size: 0.62rem; font-weight: 800; text-transform: uppercase;
          letter-spacing: 0.07em; color: #aaa; margin: 0 0 0.55rem 0.25rem;
        }
        .nav-mega-divider { height: 1px; background: rgba(0,0,0,0.05); margin: 0.85rem 0; }
        .nav-mega-list-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.2rem; }
        .nav-mega-row {
          display: flex; align-items: center; gap: 0.6rem;
          padding: 0.55rem 0.65rem; border-radius: 10px; text-decoration: none; transition: background 0.18s;
        }
        .nav-mega-row:hover { background: rgba(232,25,44,0.04); }
        .nav-mega-row.active { background: rgba(232,25,44,0.06); }
        .nav-mega-row-icon {
          width: 30px; height: 30px; border-radius: 8px;
          background: rgba(232,25,44,0.07); color: var(--brand-red);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          transition: background 0.18s, color 0.18s;
        }
        .nav-mega-row:hover .nav-mega-row-icon { background: var(--brand-red); color: #fff; }
        .nav-mega-row-body { flex: 1; min-width: 0; }
        .nav-mega-row-name {
          display: block; font-size: 0.78rem; font-weight: 700; color: var(--ink);
          letter-spacing: -0.01em; transition: color 0.18s;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .nav-mega-row:hover .nav-mega-row-name { color: var(--brand-red); }
        .nav-mega-row-desc {
          display: block; font-size: 0.67rem; color: #999;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .nav-mega-row-arrow {
          color: #ccc; flex-shrink: 0; opacity: 0;
          transform: translateX(-4px); transition: opacity 0.18s, transform 0.18s, color 0.18s;
        }
        .nav-mega-row:hover .nav-mega-row-arrow { opacity: 1; transform: translateX(0); color: var(--brand-red); }
        .nav-mega-sub-row {
          display: flex; align-items: center; gap: 0.5rem;
          padding: 0.42rem 0.65rem; border-radius: 8px; text-decoration: none; transition: background 0.15s;
        }
        .nav-mega-sub-row:hover { background: rgba(232,25,44,0.04); }
        .nav-mega-sub-icon { color: #bbb; flex-shrink: 0; display: flex; align-items: center; transition: color 0.15s; }
        .nav-mega-sub-row:hover .nav-mega-sub-icon { color: var(--brand-red); }
        .nav-mega-sub-label { font-size: 0.74rem; color: #555; font-weight: 500; transition: color 0.15s; white-space: nowrap; }
        .nav-mega-sub-row:hover .nav-mega-sub-label { color: var(--ink); }
        .nav-mega-cta-card {
          background: linear-gradient(145deg,#fff9f9 0%,#fff 60%);
          padding: 1.5rem 1.25rem; display: flex; flex-direction: column; gap: 0.6rem;
          position: relative; overflow: hidden;
        }
        .nav-mega-cta-card::before {
          content: ''; position: absolute; width: 160px; height: 160px; border-radius: 50%;
          top: -60px; right: -40px;
          background: radial-gradient(circle, rgba(232,25,44,0.08) 0%, transparent 65%); pointer-events: none;
        }
        .nav-mega-cta-icon {
          width: 44px; height: 44px; border-radius: 12px;
          background: var(--brand-red); color: #fff;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .nav-mega-cta-title { font-size: 0.95rem; font-weight: 800; color: var(--ink); margin: 0; letter-spacing: -0.02em; }
        .nav-mega-cta-text { font-size: 0.73rem; color: #777; line-height: 1.55; margin: 0; }
        .nav-mega-cta-btn {
          display: block; padding: 0.6rem 0; background: var(--brand-red); color: #fff;
          font-size: 0.76rem; font-weight: 800; text-align: center; border-radius: 10px;
          text-decoration: none; transition: background 0.18s, transform 0.18s; letter-spacing: 0.01em; margin-top: 0.15rem;
        }
        .nav-mega-cta-btn:hover { background: var(--brand-red-dark, #c01020); transform: translateY(-1px); }
        .nav-mega-cta-badges { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-top: 0.1rem; }
        .nav-mega-cta-badges span {
          font-size: 0.62rem; font-weight: 700; color: var(--brand-red);
          background: rgba(232,25,44,0.07); padding: 0.18rem 0.45rem; border-radius: 100px;
        }
        .nav-mega-footer {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0.7rem 1.25rem; background: #fafafa; border-top: 1px solid rgba(0,0,0,0.055);
        }
        .nav-mega-footer-link {
          display: inline-flex; align-items: center; gap: 5px; font-size: 0.72rem; font-weight: 800;
          color: var(--brand-red); text-decoration: none; letter-spacing: 0.04em; transition: gap 0.18s;
        }
        .nav-mega-footer-link:hover { gap: 8px; }
        .nav-mega-footer-tag { font-size: 0.68rem; color: #bbb; font-weight: 500; }

        /* Right actions */
        .agency-nav-right { display: flex; align-items: center; gap: 0.75rem; flex-shrink: 0; }
        .agency-nav-cta {
          display: inline-flex; align-items: center; gap: 0.4rem;
          padding: 0.6rem 1.4rem; background: var(--brand-red); color: #fff;
          font-family: var(--font-body); font-size: 0.85rem; font-weight: 700;
          border-radius: 100px; text-decoration: none;
          transition: background 0.22s, transform 0.22s, box-shadow 0.22s;
          box-shadow: 0 4px 16px rgba(232,25,44,0.24);
          letter-spacing: -0.01em; white-space: nowrap;
        }
        .agency-nav-cta:hover { background: var(--brand-red-dark); transform: translateY(-2px); box-shadow: 0 10px 28px rgba(232,25,44,0.32); color: #fff; }
        .agency-nav-cta.wide { width: 100%; justify-content: center; }

        /* Hamburger */
        .agency-hamburger {
          display: none; align-items: center; justify-content: center;
          width: 40px; height: 40px; background: transparent;
          border: 1.5px solid var(--border); border-radius: 10px;
          color: var(--ink); cursor: pointer; transition: background 0.18s, border-color 0.18s; flex-shrink: 0;
        }
        .agency-hamburger:hover { background: var(--surface-soft); }
        .agency-hamburger.open { border-color: var(--brand-red); color: var(--brand-red); }

        /* Mobile breakpoints */
        @media (max-width: 900px) {
          .agency-nav { padding: 0 1.25rem; height: 66px; }
          .agency-nav.scrolled {
            top: 0 !important; left: 0 !important; width: 100% !important;
            max-width: none !important; height: 66px !important; transform: none !important;
            border-radius: 0 !important; padding: 0 1.25rem !important; border: none !important;
            border-bottom: 1px solid var(--border-soft) !important;
            background: rgba(255,255,255,0.96) !important; backdrop-filter: blur(20px) !important;
          }
          .agency-nav-links { display: none; }
          .agency-hamburger { display: inline-flex; }
        }
        @media (max-width: 480px) {
          .agency-nav-cta { padding: 0.55rem 0.85rem; font-size: 0.78rem; }
        }
        @media (max-width: 360px) {
          .agency-nav-cta { display: none; }
        }
        @media (max-width: 1024px) {
          .agency-nav { padding: 0 1.5rem; height: 76px; }
        }
        @media (min-width: 901px) {
          .agency-nav.scrolled .nav-services-panel { top: calc(100% + 10px); }
        }
      `}</style>
    </>
  );
};

export default Navbar;
