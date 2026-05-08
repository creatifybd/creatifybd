import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../utils/translations';
import { TextReveal, FadeReveal, ImageReveal } from './MotionReveal';

const Hero = () => {
  const { lang } = useLanguage();
  const t = translations[lang].hero;

      <TextReveal className="hero-main-title" delay={0.4}>
        <span dangerouslySetInnerHTML={{ __html: t.title }} />
      </TextReveal>
      
      <FadeReveal delay={0.8}>
        <p className="hero-sub">{t.desc}</p>
      </FadeReveal>
      
      <FadeReveal delay={1}>
        <div className="hero-actions">
          <a href="#contact" className="btn-red">{t.cta1}</a>
          <a href="#portfolio" className="btn-outline-dark">{t.cta2}</a>
        </div>
      </FadeReveal>

      <div className="hero-mockup">
        <ImageReveal delay={0.4}>
          <div className="hero-mockup-inner">
            <div className="mock-bar">
              <div className="mock-dot" style={{ background: '#ff5f57' }}></div>
              <div className="mock-dot" style={{ background: '#febc2e' }}></div>
              <div className="mock-dot" style={{ background: '#28c840' }}></div>
              <div style={{ flex: 1, marginLeft: '1rem', background: 'rgba(255,255,255,0.06)', height: '22px', borderRadius: '6px', maxWidth: '280px' }}></div>
            </div>
            <div className="mock-body">
              <div className="mock-sidebar">
                <div className="mock-sidebar-item active"></div>
                <div className="mock-sidebar-item" style={{ width: '70%' }}></div>
                <div className="mock-sidebar-item" style={{ width: '85%' }}></div>
                <div className="mock-sidebar-item" style={{ width: '60%' }}></div>
                <div className="mock-sidebar-item" style={{ width: '75%' }}></div>
                <div className="mock-sidebar-item" style={{ width: '50%' }}></div>
              </div>
              <div className="mock-content">
                <div className="mock-card">
                  <div className="mock-card-label">Reach</div>
                  <div className="mock-card-val">48K <span>+12%</span></div>
                  <div className="mock-bar-chart">
                    <div className="bar-col" style={{ height: '40%' }}></div>
                    <div className="bar-col" style={{ height: '60%', background: 'rgba(232,25,44,0.7)' }}></div>
                    <div className="bar-col" style={{ height: '50%' }}></div>
                    <div className="bar-col" style={{ height: '80%', background: 'rgba(232,25,44,0.85)' }}></div>
                    <div className="bar-col" style={{ height: '65%' }}></div>
                    <div className="bar-col" style={{ height: '90%', background: 'var(--red)' }}></div>
                  </div>
                </div>
                <div className="mock-card">
                  <div className="mock-card-label">Conversions</div>
                  <div className="mock-card-val">3.2K <span>+28%</span></div>
                  <div className="mock-bar-chart">
                    <div className="bar-col" style={{ height: '30%' }}></div>
                    <div className="bar-col" style={{ height: '55%', background: 'rgba(232,25,44,0.7)' }}></div>
                    <div className="bar-col" style={{ height: '70%', background: 'rgba(232,25,44,0.85)' }}></div>
                    <div className="bar-col" style={{ height: '85%', background: 'var(--red)' }}></div>
                    <div className="bar-col" style={{ height: '60%' }}></div>
                    <div className="bar-col" style={{ height: '95%', background: 'var(--red)' }}></div>
                  </div>
                </div>
                <div className="mock-card">
                  <div className="mock-card-label">ROI</div>
                  <div className="mock-card-val">2.4x</div>
                  <div style={{ marginTop: '0.75rem', height: '50px', background: 'conic-gradient(from 0deg, #E8192C 0% 68%, rgba(255,255,255,0.1) 68% 100%)', borderRadius: '50%', width: '50px' }}></div>
                </div>
                <div className="mock-card span2">
                  <div className="mock-card-label">Active Campaigns</div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                    <div style={{ padding: '0.3rem 0.7rem', background: 'rgba(232,25,44,0.25)', borderRadius: '6px', fontSize: '0.7rem', color: '#ff8891' }}>Facebook Ads</div>
                    <div style={{ padding: '0.3rem 0.7rem', background: 'rgba(255,255,255,0.07)', borderRadius: '6px', fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>Instagram</div>
                    <div style={{ padding: '0.3rem 0.7rem', background: 'rgba(255,255,255,0.07)', borderRadius: '6px', fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>Google Ads</div>
                  </div>
                </div>
                <div className="mock-card span3" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Brand Visibility Growth</div>
                  <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.07)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: '74%', height: '100%', background: 'var(--red)', borderRadius: '2px' }}></div>
                  </div>
                  <div style={{ color: 'white', fontSize: '0.8rem', fontWeight: 700 }}>74%</div>
                </div>
              </div>
            </div>
          </div>
        </ImageReveal>
      </div>
    </section>
  );
};

export default Hero;
