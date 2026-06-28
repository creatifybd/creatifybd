import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import { motion } from 'framer-motion';
import { Users, Award, ShieldCheck, Globe, Star } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="about-page">
      <SEO
        title="About Us | CreatifyBD Creative Agency & Service Marketplace"
        description="Learn how CreatifyBD combines the trust of an international creative agency with the streamlined ordering of a gig marketplace to serve USA, Canada, and Australia businesses."
        keywords="about us, creative agency bangladesh, logo design dhaka, social media management agency, design team"
      />
      <Navbar />
      
      <div className="page-header dark-section" style={{ paddingTop: '160px', paddingBottom: '80px', textAlign: 'center' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container"
        >
          <span className="eyebrow red" style={{ textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold', fontSize: '0.85rem' }}>Our Agency Story</span>
          <h1 className="page-title" style={{ marginTop: '0.5rem' }}>Who Is <span className="red">CreatifyBD</span>?</h1>
          <p className="page-subtitle" style={{ margin: '0 auto' }}>
            We are an international-standard creative production team serving small businesses, creators, and consultants in the USA, Canada, and Australia.
          </p>
        </motion.div>
      </div>

      <div className="container" style={{ padding: '6rem 1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'center', marginBottom: '6rem' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1.5rem', lineHeight: '1.2' }}>
              The Agency Trust meets <br />
              <span className="red">Gig Marketplace</span> Convenience
            </h2>
            <p style={{ color: '#aaa', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              Traditional agencies are slow, expensive, and require long-term contract lock-ins. Freelance platforms, on the other hand, are highly unpredictable, filled with communication barriers, and lack consistent quality control.
            </p>
            <p style={{ color: '#aaa', fontSize: '1.05rem', lineHeight: 1.7 }}>
              CreatifyBD was built to bridge this gap. We package premium design, social media strategy, video editing, and website development into fixed-price, gig-style deliverables. No contracts. No hidden fees. Just elite execution verified manually before you release payment.
            </p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '3rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ color: 'var(--red)', marginTop: '0.2rem' }}><Globe size={24} /></div>
              <div>
                <h4 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.25rem' }}>Global Standards</h4>
                <p style={{ color: '#777', fontSize: '0.875rem' }}>Tailored design assets optimized for viewers in the USA, Canada, and Australia.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ color: 'var(--red)', marginTop: '0.2rem' }}><ShieldCheck size={24} /></div>
              <div>
                <h4 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.25rem' }}>Escrow-Style Verification</h4>
                <p style={{ color: '#777', fontSize: '0.875rem' }}>Review draft content files and verify deliverables before accepting work.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ color: 'var(--red)', marginTop: '0.2rem' }}><Award size={24} /></div>
              <div>
                <h4 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.25rem' }}> Dhaka Production Advantage</h4>
                <p style={{ color: '#777', fontSize: '0.875rem' }}>Cost-efficiency of a centralized production office without compromising on quality.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cost advantage section */}
        <div style={{ background: 'rgba(232, 25, 44, 0.03)', border: '1px solid rgba(232, 25, 44, 0.1)', borderRadius: '24px', padding: '4rem 3rem', textalign: 'center', marginBottom: '6rem' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h3 style={{ fontSize: '2rem', fontWeight: 900, color: 'white', marginBottom: '1rem' }}>Our Bangladesh Creative Production Advantage</h3>
            <p style={{ color: '#ccc', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>
              By centralizing our production studio in Dhaka, Bangladesh, we harness a deep pool of skilled digital artists, editors, and developers. This strategic placement allows us to cut administrative margins and pass 100% of those cost efficiencies directly to our international client base.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--red)' }}>100%</div>
                <div style={{ color: '#888', fontSize: '0.85rem', marginTop: '0.25rem' }}>Fixed-Price Transparency</div>
              </div>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--red)' }}>24 hr</div>
                <div style={{ color: '#888', fontSize: '0.85rem', marginTop: '0.25rem' }}>Support response time</div>
              </div>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--red)' }}>0 contract</div>
                <div style={{ color: '#888', fontSize: '0.85rem', marginTop: '0.25rem' }}>Pay as you go packages</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutPage;
