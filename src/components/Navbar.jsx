import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Menu, Phone, X, BarChart3, Palette, Clapperboard, Megaphone, Code2, ArrowRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const EASE_EXPO = [0.16, 1, 0.3, 1];

const navLinks = [
  { to: '/services', label: 'Services', hasDropdown: true },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/contact', label: 'Contact' }
];

const servicesDropdown = [
  {
    icon: <BarChart3 size={20} />,
    title: 'Social Media Management',
    desc: 'Monthly content calendars, post design, captions, scheduling',
    to: '/services#social-media'
  },
  {
    icon: <Palette size={20} />,
    title: 'Graphic Design',
    desc: 'Brand kits, logo systems, ad creatives, flyers, templates',
    to: '/services#graphic-design'
  },
  {
    icon: <Clapperboard size={20} />,
    title: 'Video Editing',
    desc: 'Short-form reels, promotional videos, YouTube edits',
    to: '/services#video-editing'
  },
  {
    icon: <Megaphone size={20} />,
    title: 'Digital Marketing',
    desc: 'Campaign planning, ad creative, landing-page funnels',
    to: '/services#digital-marketing'
  },
  {
    icon: <Code2 size={20} />,
    title: 'Website Design',
    desc: 'Responsive business websites, landing pages, redesigns',
    to: '/services#website-design'
  }
];

const mobileLinks = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/contact', label: 'Contact' }
];

/* ── Magnetic nav link ────────────────────────────────────────── */
const MagneticLink = ({ to, isActive, children, 'data-cursor': dataCursor }) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const STRENGTH = 0.28;

  const handleMouseMove = (e) => {
    const el = e.currentTarget;
    const { left, top, width, height } = el.getBoundingClientRect();
    setPos({
      x: (e.clientX - (left + width / 2)) * STRENGTH,
      y: (e.clientY - (top + height / 2)) * STRENGTH,
    });
  };
  const handleMouseLeave = () => setPos({ x: 0, y: 0 });

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 18, mass: 0.5 }}
      style={{ display: 'inline-block' }}
    >
      <Link
        to={to}
        className={isActive ? 'active' : ''}
        data-cursor={dataCursor}
      >
        {children}
        {isActive && <motion.div layoutId="activePill" className="nav-active-pill" />}
      </Link>
    </motion.div>
  );
};

const Navbar = () => {
  const { settings } = useSettings();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
    if (isMobileOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen]);

  // Keyboard navigation for dropdown
  const handleDropdownKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setDropdownOpen(true);
      // Focus first dropdown item after opening
      setTimeout(() => {
        const firstItem = document.querySelector('.nav-dropdown-item');
        if (firstItem) firstItem.focus();
      }, 100);
    }
    if (e.key === 'Escape') {
      setDropdownOpen(false);
    }
  };

  const handleDropdownItemKeyDown = (e, index) => {
    const items = servicesDropdown;
    const dropdownItems = document.querySelectorAll('.nav-dropdown-item');
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (index + 1) % items.length;
      if (dropdownItems[nextIndex]) dropdownItems[nextIndex].focus();
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (index - 1 + items.length) % items.length;
      if (dropdownItems[prevIndex]) dropdownItems[prevIndex].focus();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      setDropdownOpen(false);
      // Return focus to trigger button
      const triggerButton = document.querySelector('[aria-haspopup="true"]');
      if (triggerButton) triggerButton.focus();
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      // Navigate to the link
      const link = dropdownItems[index];
      if (link) link.click();
    }
  };

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    document.body.classList.toggle('mobile-menu-open', isMobileOpen);
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('mobile-menu-open');
    };
  }, [isMobileOpen]);

  const closeMobile = () => setIsMobileOpen(false);
  const isActive = (path) => pathname === path || (path !== '/' && pathname.startsWith(path));
  const brandName = settings?.site_name || 'CreatifyBD';
  const brandBase = brandName.includes('BD') ? brandName.split('BD')[0] : 'Creatify';

  /* Mobile menu link stagger variants */
  const menuContainerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.055, delayChildren: 0.12 } },
    exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
  };
  const menuItemVariants = {
    hidden: { opacity: 0, x: -28 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE_EXPO } },
    exit:    { opacity: 0, x: -18, transition: { duration: 0.25, ease: EASE_EXPO } },
  };

  return (
    <>
      <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
        <div className="nav-container-inner">
          {/* Logo */}
          <motion.div
            className="nav-logo-wrap"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.3, ease: EASE_EXPO }}
            style={{ display: 'inline-block' }}
          >
            <Link to="/" className="nav-logo" data-cursor="Click" aria-label="CreatifyBD home">
              <img src={settings?.logo_url || '/favicon.png'} alt="" className="nav-logo-img" />
              <span className="nav-logo-text">
                {brandBase}<span>BD</span>
              </span>
            </Link>
          </motion.div>

          {/* Desktop nav links */}
          <ul className="nav-center">
            {navLinks.map(link => (
              <li key={link.to}>
                {link.hasDropdown ? (
                  <div 
                    className="nav-dropdown-trigger"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <MagneticLink
                      to={link.to}
                      isActive={isActive(link.to)}
                      data-cursor="Click"
                      onKeyDown={handleDropdownKeyDown}
                      aria-haspopup="true"
                      aria-expanded={dropdownOpen}
                    >
                      {link.label}
                    </MagneticLink>
                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          className="nav-mega-dropdown"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2, ease: EASE_EXPO }}
                          role="menu"
                        >
                          {servicesDropdown.map((service, i) => (
                            <Link 
                              key={i} 
                              to={service.to} 
                              className="nav-dropdown-item"
                              role="menuitem"
                              tabIndex={dropdownOpen ? 0 : -1}
                              onKeyDown={(e) => handleDropdownItemKeyDown(e, i)}
                            >
                              <div className="nav-dropdown-icon">{service.icon}</div>
                              <div className="nav-dropdown-content">
                                <div className="nav-dropdown-title">{service.title}</div>
                                <div className="nav-dropdown-desc">{service.desc}</div>
                              </div>
                              <ArrowRight size={16} className="nav-dropdown-arrow" />
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <MagneticLink
                    to={link.to}
                    isActive={isActive(link.to)}
                    data-cursor="Click"
                  >
                    {link.label}
                  </MagneticLink>
                )}
              </li>
            ))}
          </ul>

          {/* Right actions */}
          <div className="nav-right">
            <motion.div
              className="nav-call-wrap"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.28, ease: EASE_EXPO }}
              style={{ display: 'inline-block' }}
            >
              <a href="tel:+8801951676600" className="btn-ghost" data-cursor="Call">Call Us</a>
            </motion.div>

            <motion.div
              className="nav-cta-wrap"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.28, ease: EASE_EXPO }}
              style={{ display: 'inline-block' }}
            >
              <Link to="/contact" className="btn-red" data-cursor="Click">
                <span className="desktop-cta-label">Get Started</span>
                <span className="mobile-cta-label">Start</span>
              </Link>
            </motion.div>

            <button
              className={`hamburger-btn ${isMobileOpen ? 'active' : ''}`}
              onClick={() => setIsMobileOpen(open => !open)}
              aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
              aria-controls="mobile-menu"
              aria-expanded={isMobileOpen}
              type="button"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isMobileOpen
                  ? <motion.span className="hamburger-icon" key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.22 }}><X /></motion.span>
                  : <motion.span className="hamburger-icon" key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.22 }}><Menu /></motion.span>
                }
              </AnimatePresence>
              <span className="hamburger-label">Menu</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            id="mobile-menu"
            className="mobile-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <button type="button" className="mobile-menu-backdrop" onClick={closeMobile} aria-label="Close menu" />
            <motion.aside
              className="mobile-menu-panel"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.32, ease: EASE_EXPO }}
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

              <motion.nav
                className="mobile-menu-list"
                aria-label="Mobile navigation"
                variants={menuContainerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {mobileLinks.map(item => (
                  <motion.div key={item.to} variants={menuItemVariants}>
                    <Link to={item.to} onClick={closeMobile} className={isActive(item.to) ? 'active' : ''}>
                      <span>{item.label}</span>
                      <ChevronRight size={17} aria-hidden="true" />
                    </Link>
                  </motion.div>
                ))}
              </motion.nav>

              <motion.div
                className="mobile-menu-footer"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.46, duration: 0.4, ease: EASE_EXPO }}
              >
                <Link to="/contact" className="btn-red" onClick={closeMobile}>Get a Free Proposal</Link>
                <a href="tel:+8801951676600" className="mobile-call-link"><Phone size={16} /> Call Us</a>
              </motion.div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
