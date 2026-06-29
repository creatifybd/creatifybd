import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../utils/translations';
import { FadeReveal, ImageReveal, TextReveal } from './MotionReveal';
import { useSettings } from '../context/SettingsContext';
import { siteConfig } from '../config/siteConfig';

const Hero = () => {
  const { lang } = useLanguage();
  const { content } = useSettings();
  const t = translations[lang].hero;
  const heroContent = content?.hero || {};

  const sanitizedTitle = useMemo(() => {
    const rawHtml = t.title;
    return DOMPurify.sanitize(rawHtml, {
      ALLOWED_TAGS: ['span', 'br', 'strong', 'em'],
      ALLOWED_ATTR: ['class']
    });
  }, [t.title]);

  return (
    <section className="hero">
      <div className="hero-glow hero-glow-1" />
      <div className="hero-glow hero-glow-2" />

      <div className="hero-container">
        <div className="hero-content">
          <FadeReveal>
            <div className="hero-eyebrow">
              <span className="pulse-dot" />
              {t.eyebrow}
            </div>
          </FadeReveal>

          <TextReveal as="h1" className="hero-main-title" delay={0.1}>
            <span dangerouslySetInnerHTML={{ __html: sanitizedTitle }} />
          </TextReveal>

          <FadeReveal delay={0.2}>
            <p className="hero-sub">{t.desc}</p>
          </FadeReveal>

          <FadeReveal delay={0.3}>
            <div className="hero-actions">
              <a href="#contact" className="btn-red premium-btn">
                {siteConfig.cta.getProposal}
                <ArrowRight size={18} />
              </a>
              <a href="#portfolio" className="btn-outline-dark premium-btn-outline">
                {siteConfig.cta.viewPortfolio}
              </a>
            </div>
          </FadeReveal>

          <FadeReveal delay={0.4}>
            <div className="hero-trust">
              <div className="hero-avatars" aria-hidden="true">
                <span className="avatar-initial">US</span>
                <span className="avatar-initial">CA</span>
                <span className="avatar-initial">AU</span>
              </div>
              <div className="hero-trust-text">
                <strong>5.0 client experience</strong> for small-business creative support
              </div>
            </div>
          </FadeReveal>
        </div>

        <div className="hero-visual">
          <ImageReveal delay={0.2}>
            <div className="hero-mockup-wrapper">
              {heroContent.mockup_primary ? (
                <img
                  src={heroContent.mockup_primary}
                  alt="CreatifyBD creative growth showcase"
                  className="hero-mockup-img"
                  loading="eager"
                  fetchpriority="high"
                />
              ) : (
                <div className="hero-mockup-wrap">
                  <div className="dashboard-mockup-grid">
                    <div className="mock-sidebar">
                      <div className="mock-sb-item active" style={{ color: '#fff', fontSize: '0.75rem', padding: '0.35rem 0.65rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        📊 Campaigns
                      </div>
                      <div className="mock-sb-item" style={{ color: '#888', fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}>
                        🚚 Deliveries
                      </div>
                      <div className="mock-sb-item" style={{ color: '#888', fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}>
                        📋 Intake Brief
                      </div>
                      <div className="mock-sb-item" style={{ color: '#888', fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}>
                        💬 Revisions
                      </div>
                    </div>
                    <div className="mock-content-panel">
                      <div className="mock-card" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>Campaign Performance</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.5rem', borderRadius: '6px' }}>
                            <small style={{ display: 'block', fontSize: '0.65rem', color: '#666' }}>Reach</small>
                            <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--red)', marginTop: '2px' }}>+142.8%</strong>
                          </div>
                          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.5rem', borderRadius: '6px' }}>
                            <small style={{ display: 'block', fontSize: '0.65rem', color: '#666' }}>Engagement</small>
                            <strong style={{ display: 'block', fontSize: '0.85rem', color: '#fff', marginTop: '2px' }}>+28.4%</strong>
                          </div>
                          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.5rem', borderRadius: '6px' }}>
                            <small style={{ display: 'block', fontSize: '0.65rem', color: '#666' }}>CTR Avg</small>
                            <strong style={{ display: 'block', fontSize: '0.85rem', color: '#fff', marginTop: '2px' }}>18.3%</strong>
                          </div>
                        </div>
                        <div>
                          <small style={{ display: 'block', fontSize: '0.65rem', color: '#666', marginBottom: '0.35rem' }}>Weekly Schedule</small>
                          <div className="calendar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                            <div className="calendar-day active" style={{ padding: '4px', textAlign: 'center', background: 'rgba(232, 25, 44, 0.05)', border: '1px solid rgba(232, 25, 44, 0.15)', borderRadius: '4px' }}><span style={{ display: 'block', fontSize: '0.6rem' }}>Mon</span><div className="active-bar-content" style={{ height: '3px', background: 'var(--red)', marginTop: '2px', borderRadius: '2px' }} /></div>
                            <div className="calendar-day active" style={{ padding: '4px', textAlign: 'center', background: 'rgba(232, 25, 44, 0.05)', border: '1px solid rgba(232, 25, 44, 0.15)', borderRadius: '4px' }}><span style={{ display: 'block', fontSize: '0.6rem' }}>Tue</span><div className="active-bar-content" style={{ height: '3px', background: 'var(--red)', marginTop: '2px', borderRadius: '2px' }} /></div>
                            <div className="calendar-day active" style={{ padding: '4px', textAlign: 'center', background: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.15)', borderRadius: '4px' }}><span style={{ display: 'block', fontSize: '0.6rem' }}>Wed</span><div className="active-bar-content" style={{ height: '3px', background: '#22c55e', marginTop: '2px', borderRadius: '2px' }} /></div>
                            <div className="calendar-day" style={{ padding: '4px', textAlign: 'center', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '4px', opacity: 0.4 }}><span style={{ display: 'block', fontSize: '0.6rem', color: '#888' }}>Thu</span></div>
                          </div>
                        </div>
                      </div>
                      <div className="mock-card" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>Recent Deliveries</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '0.4rem 0.6rem', borderRadius: '6px' }}>
                            <span style={{ fontSize: '0.7rem', color: '#ccc' }}>SMM_Post_v2.png</span>
                            <span style={{ color: 'var(--red)', fontSize: '0.65rem', fontWeight: 700 }}>⬇ Download</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '0.4rem 0.6rem', borderRadius: '6px' }}>
                            <span style={{ fontSize: '0.7rem', color: '#ccc' }}>Campaign_Teaser.mp4</span>
                            <span style={{ color: 'var(--red)', fontSize: '0.65rem', fontWeight: 700 }}>⬇ Download</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ImageReveal>
        </div>
      </div>
    </section>
  );
};

export default Hero;
