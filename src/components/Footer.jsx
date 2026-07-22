import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { siteConfig } from '../config/siteConfig';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { db } from '../firebase/config';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { ArrowUpRight } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1];

const SocialIcon = ({ href, label, children }) => (
  <a href={href} aria-label={label} className="footer-social-btn" target="_blank" rel="noreferrer">
    {children}
  </a>
);

const Footer = () => {
  const { settings } = useSettings();
  const [email, setEmail]           = useState('');
  const [subLoading, setSubLoading] = useState(false);

  const brandName = settings?.site_name || 'CreatifyBD';
  const brandBase = brandName.includes('BD') ? brandName.split('BD')[0] : 'Creatify';

  const handleNewsletter = async (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setSubLoading(true);
    try {
      const q = query(collection(db, 'subscribers'), where('email', '==', email));
      const snap = await getDocs(q);
      if (!snap.empty) { toast.error('This email is already subscribed.'); return; }
      await addDoc(collection(db, 'subscribers'), { email, subscribedAt: new Date(), status: 'active' });
      toast.success('Subscribed! Updates coming to ' + email);
      setEmail('');
    } catch {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setSubLoading(false);
    }
  };

  return (
    <footer className="footer-new">
      <div className="container">
        {/* Top grid */}
        <div className="footer-top">
          {/* Brand column */}
          <motion.div
            className="footer-brand-col"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <Link to="/" className="footer-logo">
              <img src={settings?.logo_url || '/favicon.png'} alt="" />
              <span>{brandBase}<em>BD</em></span>
            </Link>
            <p className="footer-brand-desc">
              Full-service creative partner — social media, branding, video editing, and website design for growing businesses worldwide.
            </p>
            {/* Social links */}
            <div className="footer-socials">
              <SocialIcon href={siteConfig.socialLinks.facebook}  label="Facebook">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </SocialIcon>
              <SocialIcon href={siteConfig.socialLinks.instagram} label="Instagram">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </SocialIcon>
              {siteConfig.socialLinks.linkedin && (
                <SocialIcon href={siteConfig.socialLinks.linkedin} label="LinkedIn">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                </SocialIcon>
              )}
              <SocialIcon href={`mailto:${siteConfig.email}`} label="Email us">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </SocialIcon>
            </div>
            {/* Newsletter */}
            <div className="footer-newsletter">
              <p className="footer-newsletter-label">Get design tips & updates</p>
              <form className="footer-newsletter-form" onSubmit={handleNewsletter}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  aria-label="Newsletter email"
                  className="footer-newsletter-input"
                  required
                />
                <button type="submit" disabled={subLoading} className="footer-newsletter-btn">
                  {subLoading ? '...' : 'Subscribe'}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Services column */}
          <motion.div
            className="footer-col"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.08 }}
          >
            <h4>Services</h4>
            <ul>
              <li><Link to="/services/social-media-management">Social Media Management</Link></li>
              <li><Link to="/services/graphic-design">Graphic Design</Link></li>
              <li><Link to="/services/video-editing">Video Editing</Link></li>
              <li><Link to="/contact?service=Digital%20Marketing">Digital Marketing</Link></li>
              <li><Link to="/services/website-design">Website Design</Link></li>
            </ul>
          </motion.div>

          {/* Company column */}
          <motion.div
            className="footer-col"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.13 }}
          >
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/portfolio">Portfolio</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </motion.div>

          {/* Contact column */}
          <motion.div
            className="footer-col"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.18 }}
          >
            <h4>Contact</h4>
            <div className="footer-contact-list">
              <div className="footer-contact-item">
                <small>Email</small>
                <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
              </div>
              <div className="footer-contact-item">
                <small>WhatsApp</small>
                <a href={`https://wa.me/${siteConfig.whatsappNumber?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">
                  Chat with us <ArrowUpRight size={12} />
                </a>
              </div>
              <div className="footer-contact-item">
                <small>Response time</small>
                <span>Within 24 hours</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom strip */}
        <div className="footer-bottom">
          <p className="footer-copy">
            © {new Date().getFullYear()} CreatifyBD. All rights reserved.
          </p>
          <div className="footer-legal">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/refund-policy">Refund Policy</Link>
          </div>
        </div>
      </div>

      <style>{`
        /* ══ FOOTER ════════════════════════════════════════════ */
        .footer-new {
          background: var(--surface, #ffffff) !important;
          border-top: 1px solid var(--border, rgba(15,15,18,0.08)) !important;
          padding-top: 5rem;
          color: var(--ink, #0f0f12) !important;
        }

        /* Override any global footer rules */
        footer.footer-new { background: var(--surface, #ffffff) !important; }

        .footer-new .footer-top {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 3rem;
          padding-bottom: 4rem;
          border-bottom: 1px solid var(--border, rgba(15,15,18,0.08));
        }

        /* Brand column */
        .footer-new .footer-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          margin-bottom: 1.25rem;
        }
        .footer-new .footer-logo img {
          width: 28px; height: 28px;
          border-radius: 7px;
          object-fit: contain;
        }
        .footer-new .footer-logo span {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: var(--ink, #0f0f12) !important;
        }
        .footer-new .footer-logo em { font-style: normal; color: var(--brand-red, #E8192C) !important; }

        .footer-new .footer-brand-desc {
          font-size: 0.875rem;
          color: var(--muted, #667085) !important;
          line-height: 1.7;
          max-width: 300px;
          margin-bottom: 1.5rem;
        }

        /* Socials */
        .footer-new .footer-socials {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.75rem;
        }
        .footer-new .footer-social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px; height: 36px;
          border-radius: 10px;
          border: 1.5px solid var(--border, rgba(15,15,18,0.08));
          color: var(--muted, #667085) !important;
          text-decoration: none;
          transition: color 0.2s, border-color 0.2s, background 0.2s;
        }
        .footer-new .footer-social-btn:hover {
          color: var(--brand-red, #E8192C) !important;
          border-color: rgba(232,25,44,0.3);
          background: rgba(232,25,44,0.05);
        }

        /* Newsletter */
        .footer-new .footer-newsletter-label {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--ink, #0f0f12) !important;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          margin-bottom: 0.75rem;
        }
        .footer-new .footer-newsletter-form {
          display: flex;
          gap: 0;
          border: 1.5px solid var(--border, rgba(15,15,18,0.08));
          border-radius: 10px;
          overflow: hidden;
          max-width: 300px;
          transition: border-color 0.2s;
        }
        .footer-new .footer-newsletter-form:focus-within { border-color: var(--brand-red, #E8192C); }
        .footer-new .footer-newsletter-input {
          flex: 1;
          padding: 0.6rem 0.85rem;
          background: transparent;
          border: none;
          outline: none;
          font-size: 0.85rem;
          color: var(--ink, #0f0f12) !important;
          font-family: var(--font-body);
        }
        .footer-new .footer-newsletter-input::placeholder { color: var(--muted, #667085); }
        .footer-new .footer-newsletter-btn {
          padding: 0.6rem 1rem;
          background: var(--brand-red, #E8192C);
          color: #fff !important;
          border: none;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
          font-family: var(--font-body);
          white-space: nowrap;
        }
        .footer-new .footer-newsletter-btn:hover { background: var(--brand-red-dark, #C0142A); }
        .footer-new .footer-newsletter-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        /* Footer columns — with !important to win cascade */
        .footer-new .footer-col h4 {
          font-family: var(--font-display);
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: var(--ink, #0f0f12) !important;
          margin-bottom: 1.25rem;
        }
        .footer-new .footer-col ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          padding: 0;
          margin: 0;
        }
        .footer-new .footer-col ul li a {
          font-size: 0.875rem;
          color: var(--muted, #667085) !important;
          text-decoration: none;
          transition: color 0.18s;
          display: block;
        }
        .footer-new .footer-col ul li a:hover { color: var(--ink, #0f0f12) !important; }

        /* Contact column */
        .footer-new .footer-contact-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .footer-new .footer-contact-item {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .footer-new .footer-contact-item small {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--muted, #667085) !important;
          opacity: 0.7;
        }
        .footer-new .footer-contact-item a,
        .footer-new .footer-contact-item span {
          font-size: 0.875rem;
          color: var(--ink, #0f0f12) !important;
          text-decoration: none;
          transition: color 0.18s;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }
        .footer-new .footer-contact-item a:hover { color: var(--brand-red, #E8192C) !important; }

        /* Bottom */
        .footer-new .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          padding: 1.75rem 0;
        }
        .footer-new .footer-copy {
          font-size: 0.8rem;
          color: var(--muted, #667085) !important;
          margin: 0;
        }
        .footer-new .footer-legal {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .footer-new .footer-legal a {
          font-size: 0.8rem;
          color: var(--muted, #667085) !important;
          text-decoration: none;
          transition: color 0.18s;
        }
        .footer-new .footer-legal a:hover { color: var(--ink, #0f0f12) !important; }

        /* Responsive */
        @media (max-width: 1024px) {
          .footer-new .footer-top { grid-template-columns: 1fr 1fr; gap: 2rem; }
          .footer-new .footer-brand-col { grid-column: 1 / -1; }
        }
        @media (max-width: 600px) {
          .footer-new .footer-top { grid-template-columns: 1fr; gap: 2rem; }
          .footer-new .footer-brand-col { grid-column: auto; }
          .footer-new .footer-bottom { flex-direction: column; align-items: flex-start; }
          .footer-new .footer-legal { gap: 1rem; flex-wrap: wrap; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
