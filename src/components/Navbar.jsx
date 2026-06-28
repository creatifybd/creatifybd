import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../utils/translations';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

const MagneticLink = ({ children, to, className, onClick }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const x = useSpring(mouseX, { damping: 15, stiffness: 150 });
  const y = useSpring(mouseY, { damping: 15, stiffness: 150 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - (rect.left + rect.width / 2)) * 0.4);
    mouseY.set((e.clientY - (rect.top + rect.height / 2)) * 0.4);
  };

  return (
    <motion.div
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
      className="magnetic-wrap"
    >
      <Link to={to} className={className} onClick={onClick} data-cursor="Click">
        {children}
      </Link>
    </motion.div>
  );
};

const Navbar = ({ theme = 'dark' }) => {
  const { settings } = useSettings();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { lang } = useLanguage();
  const { pathname } = useLocation();
  const t = translations[lang].nav;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobile = () => setIsMobileOpen(false);
  const isActive = (path) => pathname === path || (path !== '/' && pathname.startsWith(path));
  const gigsLabel = lang === 'bn' ? 'গিগস' : 'Gigs';
  const portfolioLabel = lang === 'bn' ? 'পোর্টফোলিও' : 'Portfolio';
  const reviewsLabel = lang === 'bn' ? 'রিভিউ' : 'Reviews';
  const aboutLabel = lang === 'bn' ? 'আমাদের সম্পর্কে' : 'About';

  return (
    <>
      <nav id="navbar" className={`${scrolled ? 'scrolled' : ''} theme-${theme}`}>
        <div className="nav-container-inner">
          <Link to="/" className="nav-logo" data-cursor="Click" style={{ display: 'flex', alignItems: 'center', gap: '12px' }} aria-label="CreatifyBD home">
            <img src={settings?.logo_url || '/favicon.png'} alt="" className="nav-logo-img" style={{ height: '52px', width: 'auto' }} />
            <span className="nav-logo-text">
              {settings?.site_name?.split('BD')[0] || 'Creatify'}<span style={{ color: 'var(--red)' }}>BD</span>
            </span>
          </Link>

          <ul className="nav-center">
            <li><MagneticLink to="/services" className={isActive('/services') ? 'active' : ''}>{t.services}{isActive('/services') && <motion.div layoutId="activePill" className="nav-active-pill" />}</MagneticLink></li>
            <li><MagneticLink to="/gigs" className={isActive('/gigs') ? 'active' : ''}>{gigsLabel}{isActive('/gigs') && <motion.div layoutId="activePill" className="nav-active-pill" />}</MagneticLink></li>
            <li><MagneticLink to="/portfolio" className={isActive('/portfolio') ? 'active' : ''}>{portfolioLabel}{isActive('/portfolio') && <motion.div layoutId="activePill" className="nav-active-pill" />}</MagneticLink></li>
            <li><MagneticLink to="/reviews" className={isActive('/reviews') ? 'active' : ''}>{reviewsLabel}{isActive('/reviews') && <motion.div layoutId="activePill" className="nav-active-pill" />}</MagneticLink></li>
            <li><MagneticLink to="/about" className={isActive('/about') ? 'active' : ''}>{aboutLabel}{isActive('/about') && <motion.div layoutId="activePill" className="nav-active-pill" />}</MagneticLink></li>
            <li><MagneticLink to="/contact" className={isActive('/contact') ? 'active' : ''}>{t.contact}{isActive('/contact') && <motion.div layoutId="activePill" className="nav-active-pill" />}</MagneticLink></li>
          </ul>

          <div className="nav-right">
            <a href="tel:+8801951676600" className="btn-ghost" data-cursor="Call">{t.callUs}</a>
            <Link to="/contact" className="btn-red" data-cursor="Click">{t.cta} →</Link>
            <button
              className={`hamburger-btn ${isMobileOpen ? 'active' : ''}`}
              onClick={() => setIsMobileOpen(open => !open)}
              aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
              aria-controls="mobile-menu"
              aria-expanded={isMobileOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ pointerEvents: 'auto' }}
            className="mobile-menu-overlay"
          >
            <div className="mobile-menu-inner">
              <Link to="/" onClick={closeMobile}>Home</Link>
              <Link to="/services" onClick={closeMobile}>{t.services}</Link>
              <Link to="/gigs" onClick={closeMobile}>{gigsLabel}</Link>
              <Link to="/portfolio" onClick={closeMobile}>{portfolioLabel}</Link>
              <Link to="/reviews" onClick={closeMobile}>{reviewsLabel}</Link>
              <Link to="/about" onClick={closeMobile}>{aboutLabel}</Link>
              <Link to="/pricing" onClick={closeMobile}>{t.pricing}</Link>
              <Link to="/contact" onClick={closeMobile}>{t.contact}</Link>
              <div className="mobile-menu-footer">
                <a href="tel:+8801951676600" className="btn-red" style={{ width: '100%', justifyContent: 'center' }}>{t.callUs}</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
