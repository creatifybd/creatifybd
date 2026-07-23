import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight, ChevronDown, BarChart2, Palette, Video, Globe2, Share2, PenTool, Film, LayoutGrid, Layers, MousePointerClick, Monitor, Box } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const EASE_EXPO = [0.16, 1, 0.3, 1];

/* Main category slugs (each links to its own service page) */
const SERVICE_ITEMS = [
  { slug: 'social-media-management', label: 'Social Media Management', icon: <BarChart2 size={16} strokeWidth={2} />, desc: 'Content calendars & strategy' },
  { slug: 'graphic-design',          label: 'Graphic Design',          icon: <Palette  size={16} strokeWidth={2} />, desc: 'Logos, brand identity & print' },
  { slug: 'video-editing',           label: 'Video Editing',           icon: <Video    size={16} strokeWidth={2} />, desc: 'Reels, YouTube & promos' },
  { slug: 'website-design',          label: 'Website Design',          icon: <Globe2   size={16} strokeWidth={2} />, desc: 'Landing pages & business sites' },
];

/* Extended sub-service rows shown in the mega-menu */
const SERVICE_SUB_ROWS = [
  { slug: 'social-media-management', label: 'Social Media Posts',   icon: <Share2          size={15} strokeWidth={2} /> },
  { slug: 'social-media-management', label: 'Content Calendars',    icon: <LayoutGrid      size={15} strokeWidth={2} /> },
  { slug: 'graphic-design',          label: 'Logo Design',          icon: <PenTool         size={15} strokeWidth={2} /> },
  { slug: 'graphic-design',          label: 'Brand Identity',       icon: <Layers          size={15} strokeWidth={2} /> },
  { slug: 'video-editing',           label: 'Reels & Short Videos', icon: <Film            size={15} strokeWidth={2} /> },
  { slug: 'video-editing',           label: 'YouTube Editing',      icon: <MousePointerClick size={15} strokeWidth={2} /> },
  { slug: 'website-design',          label: 'Landing Pages',        icon: <Monitor         size={15} strokeWidth={2} /> },
  { slug: 'website-design',          label: 'Business Websites',    icon: <Box             size={15} strokeWidth={2} /> },
];

/* ── Top-level nav links (Services has special dropdown) ─────── */
const navLinks = [
  { to: '/services',  label: 'Services',  hasPanel: true },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/pricing',   label: 'Pricing'   },
  { to: '/contact',   label: 'Contact'   },
];

const mobileLinks = [
  { to: '/',          label: 'Home'     },
  ...navLinks,
];

/* ────────────────────────────────────────────────────────────────── */
const Navbar = () => {
  const { settings } = useSettings();
  const [scrolled, setScrolled]         = useState(false);
  const [isMobileOpen, setMobileOpen]   = useState(false);
  const [panelOpen, setPanelOpen]       = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const { pathname }                    = useLocation();
  const closeTimer                      = useRef(null);

  /* scroll ─────────────────────────────────────────────────── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* lock body scroll when mobile panel open ────────────────── */
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  /* Escape key ─────────────────────────────────────────────── */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { setMobileOpen(false); setPanelOpen(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* close on route change ─────────────────────────────────── */
  useEffect(() => {
    setMobileOpen(false);
    setPanelOpen(false);
    setMobileServicesOpen(false);
  }, [pathname]);

  /* helpers ───────────────────────────────────────────────── */
  const isActive  = (p) => pathname === p || (p !== '/' && pathname.startsWith(p));
  const brandName = settings?.site_name || 'CreatifyBD';
  const brandBase = brandName.includes('BD') ? brandName.split('BD')[0] : 'Creatify';

  /* Services hover panel — enter/leave with 150ms anti-flicker */
  const openPanel  = () => { clearTimeout(closeTimer.current); setPanelOpen(true); };
  const closePanel = () => { closeTimer.current = setTimeout(() => setPanelOpen(false), 150); };

  /* animations ────────────────────────────────────────────── */
  const panelVariants = {
    hidden:  { opacity: 0, y: -8, scale: 0.97, x: '-50%' },
    visible: { opacity: 1, y: 0,  scale: 1,    x: '-50%', transition: { duration: 0.22, ease: EASE_EXPO } },
    exit:    { opacity: 0, y: -6, scale: 0.97, x: '-50%', transition: { duration: 0.16, ease: EASE_EXPO } },
  };
  const cardVariants = {
    hidden:  { opacity: 0, y: 6 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.2, ease: EASE_EXPO } }),
  };
  const menuListVariants = {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
    exit:    { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
  };
  const menuItemVariants = {
    hidden:  { opacity: 0, x: -24 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE_EXPO } },
    exit:    { opacity: 0, x: -16, transition: { duration: 0.25, ease: EASE_EXPO } },
  };

  return (
    <>
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
                /* ── Service categories shown in the hover panel ───────────────── */
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

                  {/* ── Mega Drop Panel ── */}
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
                        {/* Panel body: left list + right card */}
                        <div className="nav-mega-body">

                          {/* Left — two-column service list */}
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

                            <p className="nav-mega-section-label">Popular Gigs</p>
                            <div className="nav-mega-list-grid">
                              {SERVICE_SUB_ROWS.map((sub, i) => (
                                <motion.div key={sub.label + i} custom={i + 4} variants={cardVariants} initial="hidden" animate="visible">
                                  <Link
                                    to={`/services/${sub.slug}`}
                                    className="nav-mega-sub-row"
                                    role="menuitem"
                                    onClick={() => setPanelOpen(false)}
                                  >
                                    <span className="nav-mega-sub-icon">{sub.icon}</span>
                                    <span className="nav-mega-sub-label">{sub.label}</span>
                                  </Link>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          {/* Right — Contact CTA card */}
                          <div className="nav-mega-cta-card">
                            <div className="nav-mega-cta-icon">
                              <ArrowUpRight size={28} strokeWidth={2.5} />
                            </div>
                            <h4 className="nav-mega-cta-title">Ready to Start?</h4>
                            <p className="nav-mega-cta-text">
                              Tell us what you need. We'll get back within 24h with a custom plan.
                            </p>
                            <Link
                              to="/contact"
                              className="nav-mega-cta-btn"
                              onClick={() => setPanelOpen(false)}
                            >
                              Get a Free Quote
                            </Link>
                            <div className="nav-mega-cta-badges">
                              <span>⚡ Fast Delivery</span>
                              <span>✓ 100% Quality</span>
                            </div>
                          </div>
                        </div>

                        {/* Bottom CTA bar */}
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

      {/* ── Mobile Full-Screen Drawer ── */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="mob-drawer-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setMobileOpen(false)}
          >
            <motion.aside
              className="mob-drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.38, ease: EASE_EXPO }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="mob-drawer-head">
                <Link to="/" className="mob-logo" onClick={() => setMobileOpen(false)}>
                  <img src={settings?.logo_url || '/favicon.png'} alt="CreatifyBD" className="mob-logo-img" />
                  <span className="mob-logo-text">{brandBase}<em>BD</em></span>
                </Link>
                <button type="button" className="mob-close-btn" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                  <X size={22} />
                </button>
              </div>

              {/* Nav Links */}
              <nav className="mob-nav">

                {/* Home */}
                <Link to="/" className={`mob-nav-item${pathname === '/' ? ' mob-active' : ''}`} onClick={() => setMobileOpen(false)}>
                  <span>Home</span>
                  <ArrowUpRight size={16} className="mob-arrow" />
                </Link>

                {/* Services Accordion */}
                <div className="mob-accordion">
                  <button
                    type="button"
                    className={`mob-nav-item mob-accordion-btn${isActive('/services') ? ' mob-active' : ''}`}
                    onClick={() => setMobileServicesOpen((o) => !o)}
                  >
                    <span>Services</span>
                    <ChevronDown size={18} className={`mob-chevron${mobileServicesOpen ? ' mob-chevron-open' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {mobileServicesOpen && (
                      <motion.div
                        className="mob-sub"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: EASE_EXPO }}
                        style={{ overflow: 'hidden' }}
                      >
                        <Link to="/services" className="mob-sub-all" onClick={() => setMobileOpen(false)}>
                          All Services <ArrowUpRight size={13} />
                        </Link>
                        {SERVICE_ITEMS.map((svc) => (
                          <Link
                            key={svc.slug}
                            to={`/services/${svc.slug}`}
                            className="mob-sub-item"
                            onClick={() => setMobileOpen(false)}
                          >
                            <span className="mob-sub-icon">{svc.icon}</span>
                            <div>
                              <div className="mob-sub-name">{svc.label}</div>
                              <div className="mob-sub-desc">{svc.desc}</div>
                            </div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Portfolio */}
                <Link to="/portfolio" className={`mob-nav-item${isActive('/portfolio') ? ' mob-active' : ''}`} onClick={() => setMobileOpen(false)}>
                  <span>Portfolio</span>
                  <ArrowUpRight size={16} className="mob-arrow" />
                </Link>

                {/* Pricing */}
                <Link to="/pricing" className={`mob-nav-item${isActive('/pricing') ? ' mob-active' : ''}`} onClick={() => setMobileOpen(false)}>
                  <span>Pricing</span>
                  <ArrowUpRight size={16} className="mob-arrow" />
                </Link>

                {/* About */}
                <Link to="/about" className={`mob-nav-item${isActive('/about') ? ' mob-active' : ''}`} onClick={() => setMobileOpen(false)}>
                  <span>About</span>
                  <ArrowUpRight size={16} className="mob-arrow" />
                </Link>

                {/* Contact */}
                <Link to="/contact" className={`mob-nav-item${isActive('/contact') ? ' mob-active' : ''}`} onClick={() => setMobileOpen(false)}>
                  <span>Contact</span>
                  <ArrowUpRight size={16} className="mob-arrow" />
                </Link>

              </nav>

              {/* CTA */}
              <div className="mob-drawer-footer">
                <Link to="/contact" className="mob-cta" onClick={() => setMobileOpen(false)}>
                  Start a Project
                  <ArrowUpRight size={16} />
                </Link>
                <p className="mob-tagline">Agency-grade quality · Competitive pricing</p>
              </div>

            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        /* ══ AGENCY NAVBAR ═══════════════════════════════════════ */
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

        /* Scrolled pill */
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
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .agency-nav-logo img,
        .agency-nav-logo-img {
          width: auto !important;
          max-width: 120px !important;
          height: 30px !important;
          max-height: 30px !important;
          object-fit: contain !important;
          border-radius: 6px;
          flex-shrink: 0;
          display: block;
        }
        .agency-nav-logo-text {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: var(--ink);
          line-height: 1;
        }
        .agency-nav-logo-text em {
          font-style: normal;
          color: var(--brand-red);
        }

        /* Links */
        .agency-nav-links {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .agency-nav-link {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 0.5rem 0.9rem;
          font-family: var(--font-body);
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--ink);
          text-decoration: none;
          border-radius: 8px;
          transition: color 0.18s, background 0.18s;
        }
        .agency-nav-link::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 0.9rem; right: 0.9rem;
          height: 1.5px;
          background: var(--brand-red);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.28s cubic-bezier(0.16,1,0.3,1);
          border-radius: 2px;
        }
        .agency-nav-link:hover { color: var(--ink); background: rgba(0,0,0,0.03); }
        .agency-nav-link:hover::after,
        .agency-nav-link.active::after { transform: scaleX(1); }
        .agency-nav-link.active { color: var(--brand-red); font-weight: 600; }

        /* Chevron icon next to Services */
        .nav-chevron {
          transition: transform 0.25s cubic-bezier(0.16,1,0.3,1);
          opacity: 0.6;
          flex-shrink: 0;
        }
        .nav-chevron.open { transform: rotate(180deg); opacity: 1; }

        /* ── Services hover panel trigger ── */
        .nav-services-trigger {
          position: relative;
        }
        .nav-services-btn {
          cursor: default;
        }

        /* ── Mega drop panel ────────────────────── */
        .nav-mega-panel {
          position: absolute;
          top: calc(100% + 16px);
          left: 50%;
          transform: translateX(-50%);
          width: 780px !important;
          min-width: 780px !important;
          max-width: 780px !important;
          background: #ffffff;
          border-radius: 18px;
          box-shadow: 0 24px 60px rgba(0,0,0,0.13), 0 4px 12px rgba(0,0,0,0.05);
          border: 1px solid rgba(0,0,0,0.07);
          overflow: hidden;
          z-index: 10010;
          transform-origin: top center;
        }
        /* Arrow caret */
        .nav-mega-panel::before {
          content: '';
          position: absolute;
          top: -7px;
          left: 50%;
          transform: translateX(-50%) rotate(45deg);
          width: 12px; height: 12px;
          background: #fff;
          border-top: 1px solid rgba(0,0,0,0.07);
          border-left: 1px solid rgba(0,0,0,0.07);
          border-radius: 2px 0 0 0;
        }

        /* Body: list + card side-by-side */
        .nav-mega-body {
          display: grid;
          grid-template-columns: 1fr 220px;
          min-height: 280px;
        }

        /* ── Left list ── */
        .nav-mega-list {
          padding: 1.25rem 1.25rem 1rem;
          border-right: 1px solid rgba(0,0,0,0.06);
        }
        .nav-mega-section-label {
          font-size: 0.62rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: #aaa;
          margin: 0 0 0.55rem 0.25rem;
        }
        .nav-mega-divider {
          height: 1px;
          background: rgba(0,0,0,0.05);
          margin: 0.85rem 0;
        }

        /* Two-column grid for both service rows */
        .nav-mega-list-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.2rem;
        }

        /* Main service rows */
        .nav-mega-row {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.55rem 0.65rem;
          border-radius: 10px;
          text-decoration: none;
          transition: background 0.18s;
        }
        .nav-mega-row:hover { background: rgba(232,25,44,0.04); }
        .nav-mega-row.active { background: rgba(232,25,44,0.06); }
        .nav-mega-row-icon {
          width: 30px; height: 30px;
          border-radius: 8px;
          background: rgba(232,25,44,0.07);
          color: var(--brand-red);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: background 0.18s, color 0.18s;
        }
        .nav-mega-row:hover .nav-mega-row-icon {
          background: var(--brand-red);
          color: #fff;
        }
        .nav-mega-row-body { flex: 1; min-width: 0; }
        .nav-mega-row-name {
          display: block;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--ink);
          letter-spacing: -0.01em;
          transition: color 0.18s;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .nav-mega-row:hover .nav-mega-row-name { color: var(--brand-red); }
        .nav-mega-row-desc {
          display: block;
          font-size: 0.67rem;
          color: #999;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .nav-mega-row-arrow {
          color: #ccc;
          flex-shrink: 0;
          opacity: 0;
          transform: translateX(-4px);
          transition: opacity 0.18s, transform 0.18s, color 0.18s;
        }
        .nav-mega-row:hover .nav-mega-row-arrow {
          opacity: 1;
          transform: translateX(0);
          color: var(--brand-red);
        }

        /* Sub-service rows (popular gigs) */
        .nav-mega-sub-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.42rem 0.65rem;
          border-radius: 8px;
          text-decoration: none;
          transition: background 0.15s;
        }
        .nav-mega-sub-row:hover { background: rgba(232,25,44,0.04); }
        .nav-mega-sub-icon {
          color: #bbb;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          transition: color 0.15s;
        }
        .nav-mega-sub-row:hover .nav-mega-sub-icon { color: var(--brand-red); }
        .nav-mega-sub-label {
          font-size: 0.74rem;
          color: #555;
          font-weight: 500;
          transition: color 0.15s;
          white-space: nowrap;
        }
        .nav-mega-sub-row:hover .nav-mega-sub-label { color: var(--ink); }

        /* ── Right CTA card ── */
        .nav-mega-cta-card {
          background: linear-gradient(145deg, #fff9f9 0%, #fff 60%);
          padding: 1.5rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          position: relative;
          overflow: hidden;
        }
        .nav-mega-cta-card::before {
          content: '';
          position: absolute;
          width: 160px; height: 160px;
          border-radius: 50%;
          top: -60px; right: -40px;
          background: radial-gradient(circle, rgba(232,25,44,0.08) 0%, transparent 65%);
          pointer-events: none;
        }
        .nav-mega-cta-icon {
          width: 44px; height: 44px;
          border-radius: 12px;
          background: var(--brand-red);
          color: #fff;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .nav-mega-cta-title {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--ink);
          margin: 0;
          letter-spacing: -0.02em;
        }
        .nav-mega-cta-text {
          font-size: 0.73rem;
          color: #777;
          line-height: 1.55;
          margin: 0;
        }
        .nav-mega-cta-btn {
          display: block;
          padding: 0.6rem 0;
          background: var(--brand-red);
          color: #fff;
          font-size: 0.76rem;
          font-weight: 800;
          text-align: center;
          border-radius: 10px;
          text-decoration: none;
          transition: background 0.18s, transform 0.18s;
          letter-spacing: 0.01em;
          margin-top: 0.15rem;
        }
        .nav-mega-cta-btn:hover {
          background: var(--brand-red-dark, #c01020);
          transform: translateY(-1px);
        }
        .nav-mega-cta-badges {
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
          margin-top: 0.1rem;
        }
        .nav-mega-cta-badges span {
          font-size: 0.62rem;
          font-weight: 700;
          color: var(--brand-red);
          background: rgba(232,25,44,0.07);
          padding: 0.18rem 0.45rem;
          border-radius: 100px;
        }

        /* ── Bottom footer bar ── */
        .nav-mega-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.7rem 1.25rem;
          background: #fafafa;
          border-top: 1px solid rgba(0,0,0,0.055);
        }
        .nav-mega-footer-link {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--brand-red);
          text-decoration: none;
          letter-spacing: 0.04em;
          transition: gap 0.18s;
        }
        .nav-mega-footer-link:hover { gap: 8px; }
        .nav-mega-footer-tag {
          font-size: 0.68rem;
          color: #bbb;
          font-weight: 500;
        }

        /* Right */
        .agency-nav-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
        }

        /* CTA button */
        .agency-nav-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.6rem 1.4rem;
          background: var(--brand-red);
          color: #fff;
          font-family: var(--font-body);
          font-size: 0.85rem;
          font-weight: 700;
          border-radius: 100px;
          text-decoration: none;
          transition: background 0.22s, transform 0.22s, box-shadow 0.22s;
          box-shadow: 0 4px 16px rgba(232,25,44,0.24);
          letter-spacing: -0.01em;
          white-space: nowrap;
        }
        .agency-nav-cta:hover {
          background: var(--brand-red-dark);
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(232,25,44,0.32);
          color: #fff;
        }
        .agency-nav-cta.wide { width: 100%; justify-content: center; }

        /* Hamburger */
        .agency-hamburger {
          display: none;
          align-items: center;
          justify-content: center;
          width: 40px; height: 40px;
          background: transparent;
          border: 1.5px solid var(--border);
          border-radius: 10px;
          color: var(--ink);
          cursor: pointer;
          transition: background 0.18s, border-color 0.18s;
          flex-shrink: 0;
        }
        .agency-hamburger:hover { background: var(--surface-soft); }
        .agency-hamburger.open { border-color: var(--brand-red); color: var(--brand-red); }

        /* ── Mobile Navbar & Drawer ── */
        @media (max-width: 900px) {
          .agency-nav { padding: 0 1.25rem; height: 66px; }
          .agency-nav.scrolled {
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            max-width: none !important;
            height: 66px !important;
            transform: none !important;
            border-radius: 0 !important;
            padding: 0 1.25rem !important;
            border: none !important;
            border-bottom: 1px solid var(--border-soft) !important;
            background: rgba(255,255,255,0.96) !important;
            backdrop-filter: blur(20px) !important;
          }
          .agency-nav-links  { display: none; }
          .agency-hamburger  { display: inline-flex; }
        }
        @media (max-width: 480px) {
          .agency-nav-cta {
            padding: 0.55rem 0.85rem;
            font-size: 0.78rem;
          }
        }
        @media (max-width: 360px) {
          .agency-nav-cta { display: none; }
        }

        /* ═══════════════════════════════════════════════════════
           MOBILE DRAWER — complete redesign
        ═══════════════════════════════════════════════════════ */
        .mob-drawer-wrap {
          position: fixed;
          inset: 0;
          z-index: 999999;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .mob-drawer {
          position: fixed;
          top: 0;
          left: 0;
          width: min(88vw, 340px);
          height: 100%;
          height: 100svh;
          background: #fff;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          overflow-x: hidden;
          z-index: 1000000;
          box-shadow: 4px 0 48px rgba(0,0,0,0.22);
        }

        /* ── Drawer header ── */
        .mob-drawer-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.1rem 1.25rem;
          border-bottom: 1px solid #f0f0f0;
          flex-shrink: 0;
        }
        .mob-logo {
          display: flex;
          align-items: center;
          gap: 9px;
          text-decoration: none;
          flex-shrink: 0;
          min-width: 0;
        }
        .mob-logo-img {
          height: 32px;
          width: auto;
          max-width: 100px;
          object-fit: contain;
          flex-shrink: 0;
          display: block;
        }
        .mob-logo-text {
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: #111;
          line-height: 1;
          white-space: nowrap;
        }
        .mob-logo-text em {
          font-style: normal;
          color: #e8192c;
        }
        .mob-close-btn {
          flex-shrink: 0;
          background: transparent;
          border: 1.5px solid #e5e5e5;
          border-radius: 10px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #111;
          transition: all 0.18s;
        }
        .mob-close-btn:hover {
          border-color: #e8192c;
          color: #e8192c;
          background: rgba(232,25,44,0.06);
        }

        /* ── Nav links ── */
        .mob-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 0.75rem 1rem;
          gap: 2px;
          overflow-y: auto;
        }
        .mob-nav-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.9rem 1rem;
          font-size: 1.05rem;
          font-weight: 700;
          color: #111;
          text-decoration: none;
          border-radius: 12px;
          letter-spacing: -0.02em;
          transition: background 0.18s, color 0.18s;
          background: transparent;
          border: none;
          cursor: pointer;
          width: 100%;
          text-align: left;
        }
        .mob-nav-item:hover {
          background: #f7f7f7;
          color: #111;
        }
        .mob-nav-item.mob-active {
          color: #e8192c;
          background: rgba(232,25,44,0.06);
        }
        .mob-arrow {
          opacity: 0.4;
          flex-shrink: 0;
        }

        /* ── Accordion ── */
        .mob-accordion {
          display: flex;
          flex-direction: column;
        }
        .mob-accordion-btn {
          font-family: inherit;
        }
        .mob-chevron {
          transition: transform 0.28s ease;
          opacity: 0.6;
          flex-shrink: 0;
        }
        .mob-chevron-open {
          transform: rotate(180deg);
          opacity: 1;
          color: #e8192c;
        }

        /* ── Services sub-menu ── */
        .mob-sub {
          margin: 0 0 0.5rem;
          border-radius: 14px;
          border: 1px solid #f0f0f0;
          background: #fafafa;
          overflow: hidden;
        }
        .mob-sub-all {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.65rem 1rem;
          font-size: 0.72rem;
          font-weight: 800;
          color: #e8192c;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          text-decoration: none;
          background: rgba(232,25,44,0.05);
          border-bottom: 1px solid #f0f0f0;
          transition: background 0.18s;
        }
        .mob-sub-all:hover {
          background: rgba(232,25,44,0.1);
        }
        .mob-sub-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          text-decoration: none;
          border-bottom: 1px solid #f5f5f5;
          transition: background 0.18s;
        }
        .mob-sub-item:last-child {
          border-bottom: none;
        }
        .mob-sub-item:hover {
          background: #f0f0f0;
        }
        .mob-sub-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(232,25,44,0.08);
          color: #e8192c;
          flex-shrink: 0;
        }
        .mob-sub-name {
          font-size: 0.875rem;
          font-weight: 700;
          color: #111;
          line-height: 1.2;
        }
        .mob-sub-desc {
          font-size: 0.73rem;
          color: #888;
          margin-top: 1px;
          line-height: 1.3;
        }

        /* ── Footer CTA ── */
        .mob-drawer-footer {
          padding: 1.25rem;
          border-top: 1px solid #f0f0f0;
          flex-shrink: 0;
        }
        .mob-cta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.9rem 1.5rem;
          background: #e8192c;
          color: #fff;
          font-size: 0.95rem;
          font-weight: 700;
          border-radius: 14px;
          text-decoration: none;
          letter-spacing: -0.01em;
          transition: opacity 0.18s, transform 0.18s;
        }
        .mob-cta:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        .mob-tagline {
          text-align: center;
          font-size: 0.7rem;
          color: #aaa;
          margin-top: 0.6rem;
          margin-bottom: 0;
        }

        @media (max-width: 1024px) {
          .agency-nav { padding: 0 1.5rem; height: 76px; }
        }
        @media (min-width: 901px) {
          .agency-nav.scrolled .nav-services-panel {
            top: calc(100% + 10px);
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
