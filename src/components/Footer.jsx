import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { TextReveal, FadeReveal } from './MotionReveal';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { lang } = useLanguage();

  return (
    <footer className="footer-v2">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <FadeReveal>
              <img src="/logo.png" alt="CreatifyBD" style={{ height: '50px', marginBottom: '2rem', filter: 'brightness(1.1)' }} />
              <p>
                {lang === 'bn' 
                  ? 'ঢাকার অন্যতম শীর্ষস্থানীয় ডিজিটাল মার্কেটিং এবং ক্রিয়েটিভ এজেন্সি। আপনার ব্যবসার অনলাইন প্রবৃদ্ধি নিশ্চিত করাই আমাদের লক্ষ্য।' 
                  : 'Leading digital marketing and creative agency based in Dhaka, Bangladesh. Helping businesses grow their online presence since day one.'}
              </p>
              <div className="footer-social">
                <a href="https://facebook.com/creatifybd" className="f-social-btn" target="_blank" rel="noreferrer">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                <a href="https://instagram.com/creatifybd" className="f-social-btn" target="_blank" rel="noreferrer">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
                <a href="mailto:creatifybd@gmail.com" className="f-social-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </a>
              </div>
            </FadeReveal>
          </div>
          
          <div className="footer-col">
            <FadeReveal delay={0.2}>
              <h4>{lang === 'bn' ? 'সার্ভিসসমূহ' : 'Services'}</h4>
              <ul>
                <li><Link to="/services">Social Media Management</Link></li>
                <li><Link to="/services">Branding & Logo Design</Link></li>
                <li><Link to="/services">Product Photography</Link></li>
                <li><Link to="/services">Video Production</Link></li>
                <li><Link to="/services">Website Development</Link></li>
              </ul>
            </FadeReveal>
          </div>
          
          <div className="footer-col">
            <FadeReveal delay={0.4}>
              <h4>{lang === 'bn' ? 'কোম্পানি' : 'Company'}</h4>
              <ul>
                <li><Link to="/work">{lang === 'bn' ? 'আমাদের কাজ' : 'Our Work'}</Link></li>
                <li><Link to="/process">{lang === 'bn' ? 'পদ্ধতি' : 'Process'}</Link></li>
                <li><Link to="/pricing">{lang === 'bn' ? 'প্যাকেজসমূহ' : 'Pricing'}</Link></li>
                <li><Link to="/contact">{lang === 'bn' ? 'যোগাযোগ' : 'Contact'}</Link></li>
              </ul>
            </FadeReveal>
          </div>
          
          <div className="footer-col">
            <FadeReveal delay={0.6}>
              <h4>{lang === 'bn' ? 'যোগাযোগ' : 'Contact'}</h4>
              <div className="footer-contact-info">
                <div className="f-contact-item">
                  <small>{lang === 'bn' ? 'ফোন' : 'Phone'}</small>
                  <a href="tel:+8801951676600">+880 01951 676600</a>
                </div>
                <div className="f-contact-item">
                  <small>{lang === 'bn' ? 'ইমেইল' : 'Email'}</small>
                  <a href="mailto:creatifybd@gmail.com">creatifybd@gmail.com</a>
                </div>
                <div className="f-contact-item">
                  <small>{lang === 'bn' ? 'ঠিকানা' : 'Location'}</small>
                  <span>Dhaka, Bangladesh</span>
                </div>
              </div>
            </FadeReveal>
          </div>
        </div>
        
        <div className="footer-bottom">
          <FadeReveal delay={0.8}>
            <div className="footer-bottom-inner">
              <p>© {new Date().getFullYear()} CreatifyBD. All rights reserved.</p>
              <div className="footer-legal">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
              </div>
            </div>
          </FadeReveal>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
