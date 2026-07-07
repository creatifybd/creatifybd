import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { siteConfig } from '../config/siteConfig';
import { FadeReveal, SlideReveal, StaggerReveal, StaggerChild } from './MotionReveal';
import toast from 'react-hot-toast';
import { db } from '../firebase/config';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const Footer = () => {
  const { settings } = useSettings();
  const [email, setEmail] = useState('');
  const [subLoading, setSubLoading] = useState(false);

  const handleNewsletter = async (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setSubLoading(true);
    try {
      // Check if email already exists
      const q = query(collection(db, 'subscribers'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        toast.error('This email is already subscribed.');
        setSubLoading(false);
        return;
      }
      
      // Add new subscriber to Firestore
      await addDoc(collection(db, 'subscribers'), {
        email,
        subscribedAt: new Date(),
        status: 'active'
      });
      
      toast.success('You\'re subscribed! We\'ll send updates to ' + email);
      setEmail('');
    } catch (err) {
      console.error('Newsletter subscription error:', err);
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setSubLoading(false);
    }
  };

  return (
    <footer className="footer-v2">
      <div className="container">
        {/* Trust strip */}
        <FadeReveal>
          <div className="footer-trust-strip">
            <span>🌍 Trusted by brands worldwide</span>
            <span className="footer-trust-div" aria-hidden="true" />
            <span>⭐ 5.0/5 from 100+ verified clients</span>
            <span className="footer-trust-div" aria-hidden="true" />
            <span>🔒 Secure payments · 7-day money-back</span>
          </div>
        </FadeReveal>

        <div className="footer-top">
          <SlideReveal from="left" delay={0.05}>
            <div className="footer-brand">
              <div className="footer-brand-mark">
                <img src={settings?.logo_url || '/favicon.png'} alt="" loading="lazy" />
                <span>{settings?.site_name?.split('BD')[0] || 'Creatify'}<strong>BD</strong></span>
              </div>
              <p>
                Social media management, graphic design, video editing, digital marketing, and website design for international brands.
              </p>
              <FadeReveal delay={0.2}>
                <div className="footer-social">
                  <a href={siteConfig.socialLinks.facebook} aria-label="CreatifyBD on Facebook" className="f-social-btn" target="_blank" rel="noreferrer">
                    <FacebookIcon />
                  </a>
                  <a href={siteConfig.socialLinks.instagram} aria-label="CreatifyBD on Instagram" className="f-social-btn" target="_blank" rel="noreferrer">
                    <InstagramIcon />
                  </a>
                  {siteConfig.socialLinks.linkedin && (
                    <a href={siteConfig.socialLinks.linkedin} aria-label="CreatifyBD on LinkedIn" className="f-social-btn" target="_blank" rel="noreferrer">
                      <LinkedInIcon />
                    </a>
                  )}
                  <a href={`mailto:${siteConfig.email}`} aria-label="Email CreatifyBD" className="f-social-btn">
                    <MailIcon />
                  </a>
                </div>
              </FadeReveal>

              {/* Newsletter */}
              <div className="footer-newsletter">
                <span className="footer-newsletter-label">Get creative tips & updates</span>
                <form className="footer-newsletter-form" onSubmit={handleNewsletter}>
                  <input
                    type="email"
                    className="footer-newsletter-input"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    aria-label="Email for newsletter"
                    required
                  />
                  <button type="submit" className="footer-newsletter-btn" disabled={subLoading}>
                    {subLoading ? '...' : 'Subscribe'}
                  </button>
                </form>
              </div>
            </div>
          </SlideReveal>

          <FadeReveal delay={0.1}>
            <div className="footer-col">
              <h4>Services</h4>
              <StaggerReveal stagger={0.06} delay={0.15}>
                <ul>
                  <StaggerChild><li><Link to="/services/social-media-management">Social Media Management</Link></li></StaggerChild>
                  <StaggerChild><li><Link to="/services/graphic-design">Graphic Design</Link></li></StaggerChild>
                  <StaggerChild><li><Link to="/services/video-editing">Video Editing</Link></li></StaggerChild>
                  <StaggerChild><li><Link to="/gigs">Digital Marketing</Link></li></StaggerChild>
                  <StaggerChild><li><Link to="/services/website-design">Website Design</Link></li></StaggerChild>
                </ul>
              </StaggerReveal>
            </div>
          </FadeReveal>

          <FadeReveal delay={0.15}>
            <div className="footer-col">
              <h4>Company</h4>
              <StaggerReveal stagger={0.06} delay={0.2}>
                <ul>
                  <StaggerChild><li><Link to="/about">About Us</Link></li></StaggerChild>
                  <StaggerChild><li><Link to="/portfolio">Portfolio</Link></li></StaggerChild>
                  <StaggerChild><li><Link to="/case-studies">Case Studies</Link></li></StaggerChild>
                  <StaggerChild><li><Link to="/reviews">Reviews</Link></li></StaggerChild>
                  <StaggerChild><li><Link to="/pricing">Pricing</Link></li></StaggerChild>
                </ul>
              </StaggerReveal>
            </div>
          </FadeReveal>

          <SlideReveal from="right" delay={0.2}>
            <div className="footer-col">
              <h4>Contact</h4>
              <div className="footer-contact-info">
                <div className="f-contact-item">
                  <small>Email</small>
                  <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
                </div>
                <div className="f-contact-item">
                  <small>WhatsApp</small>
                  <a href={`https://wa.me/${siteConfig.whatsappNumber.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">Chat with us →</a>
                </div>
                <div className="f-contact-item">
                  <small>Response time</small>
                  <span>Within 24 hours</span>
                </div>
              </div>
            </div>
          </SlideReveal>
        </div>

        <FadeReveal delay={0.3}>
          <div className="footer-bottom">
            <div className="footer-bottom-inner">
              <p>Copyright {new Date().getFullYear()} CreatifyBD. All rights reserved.</p>
              <div className="footer-legal">
                <Link to="/privacy">Privacy Policy</Link>
                <Link to="/terms">Terms of Service</Link>
                <Link to="/refund-policy">Refund Policy</Link>
              </div>
            </div>
          </div>
        </FadeReveal>
      </div>

      <style>{`
        .footer-trust-strip {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          flex-wrap: wrap;
          padding: 1.25rem 0 3rem;
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--muted);
          position: relative;
        }
        .footer-trust-strip::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--brand-red), transparent);
        }
        .footer-trust-strip span {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .footer-trust-div {
          width: 1px;
          height: 16px;
          background: var(--border-card);
          flex-shrink: 0;
        }
        @media (max-width: 640px) {
          .footer-trust-strip { 
            gap: 1rem; 
            padding: 1rem 0 2.5rem;
            font-size: 0.76rem;
          }
          .footer-trust-div { display: none; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
