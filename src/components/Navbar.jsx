import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Menu, Phone, Search, X } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const navLinks = [
  { to: '/services', label: 'Services' },
  { to: '/gigs', label: 'Gigs' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' }
];

const mobileLinks = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/gigs', label: 'Gigs' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' }
];

const mobileServices = ['Social Media', 'Graphic Design', 'Video Editing', 'Web Design'];

const Navbar = ({ theme = 'dark' }) => {
  const { settings } = useSettings();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeMobile();
    };
    if (isMobileOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen]);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const closeMobile = () => setIsMobileOpen(false);
  const isActive = (path) => pathname === path || (path !== '/' && pathname.startsWith(path));
  const brandName = settings?.site_name || 'CreatifyBD';
  const brandBase = brandName.includes('BD') ? brandName.split('BD')[0] : 'Creatify';

  return (
    <>
      <nav id="navbar" className={`${scrolled ? 'scrolled' : ''} theme-${theme}`}>
        <div className="nav-container-inner">
          <Link to="/" className="nav-logo" data-cursor="Click" aria-label="CreatifyBD home">
            <img src={settings?.logo_url || '/favicon.png'} alt="" className="nav-logo-img" />
            <span className="nav-logo-text">
              {brandBase}<span>BD</span>
            </span>
          </Link>

          <ul className="nav-center">
            {navLinks.map(link => (
              <li key={link.to}>
                <Link to={link.to} className={isActive(link.to) ? 'active' : ''} data-cursor="Click">
                  {link.label}
                  {isActive(link.to) && <motion.div layoutId="activePill" className="nav-active-pill" />}
                </Link>
              </li>
            ))}
          </ul>

          <div className="nav-right">
            <a href="tel:+8801951676600" className="btn-ghost" data-cursor="Call">Call Us</a>
            <Link to="/contact" className="btn-red" data-cursor="Click">
              <span className="desktop-cta-label">Get Started</span>
              <span className="mobile-cta-label">Start</span>
            </Link>
            <button
              className={`hamburger-btn ${isMobileOpen ? 'active' : ''}`}
              onClick={() => setIsMobileOpen(open => !open)}
              aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
              aria-controls="mobile-menu"
              aria-expanded={isMobileOpen}
              type="button"
            >
              {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
              <span className="hamburger-label">Menu</span>
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            id="mobile-menu"
            className="mobile-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button type="button" className="mobile-menu-backdrop" onClick={closeMobile} aria-label="Close menu" />
            <motion.aside
              className="mobile-menu-panel"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mobile-menu-head">
                <Link to="/" className="mobile-menu-brand" onClick={closeMobile} aria-label="CreatifyBD home">
                  <img src={settings?.logo_url || '/favicon.png'} alt="" />
                  <span>{brandBase}<strong>BD</strong></span>
                </Link>
                <button type="button" onClick={closeMobile} aria-label="Close menu">
                  <X size={20} />
                </button>
              </div>

              <nav className="mobile-menu-list" aria-label="Mobile navigation">
                {mobileLinks.map(item => (
                  <Link key={item.to} to={item.to} onClick={closeMobile} className={isActive(item.to) ? 'active' : ''}>
                    <span>{item.label}</span>
                    <ChevronRight size={17} aria-hidden="true" />
                  </Link>
                ))}
              </nav>

              <Link to="/gigs" className="mobile-search-link" onClick={closeMobile}>
                <Search size={18} />
                <span>Browse fixed-scope creative gigs</span>
                <ChevronRight size={17} aria-hidden="true" />
              </Link>

              <div className="mobile-service-strip" aria-label="Popular services">
                {mobileServices.map(service => (
                  <Link key={service} to="/services" onClick={closeMobile}>
                    <span>{service}</span>
                    <ChevronRight size={16} aria-hidden="true" />
                  </Link>
                ))}
              </div>

              <div className="mobile-menu-footer">
                <Link to="/contact" className="btn-red" onClick={closeMobile}>Get a Free Proposal</Link>
                <a href="tel:+8801951676600" className="mobile-call-link"><Phone size={16} /> Call Us</a>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
