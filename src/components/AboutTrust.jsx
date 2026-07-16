import React from 'react';
import { Building2, MonitorCheck, Quote, UsersRound, Video, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { globalizeCopy, renderRichTitle } from '../utils/contentText';

const defaultRoles = [
  'Brand Strategy',
  'Visual Design',
  'Motion & Video',
  'Web Development',
  'Client Success'
];

const defaultStats = [
  { value: 'No', label: 'Long-term lock-in' },
  { value: '24h', label: 'Typical response' },
  { value: '100%', label: 'Scope clarity' }
];

const fallbackOfficeImage = '/assets/portfolio/logo-design-branding/logo-design-branding-01.jpg';
const fallbackTeamImage = '/assets/portfolio/logo-design-branding/logo-design-branding-02.jpg';
const fallbackMeetingImage = '/assets/portfolio/digital-marketing/digital-marketing-01.jpg';

const AboutTrust = () => {
  const { content } = useSettings();
  const aboutContent = content?.about_trust || {};
  const roles = Array.isArray(aboutContent.team_roles) && aboutContent.team_roles.length
    ? aboutContent.team_roles
    : defaultRoles;
  const stats = Array.isArray(aboutContent.stats) && aboutContent.stats.length
    ? aboutContent.stats
    : defaultStats;
  const title = globalizeCopy(aboutContent.title, 'A specialist creative team serving <span class="text-red">global brands</span>');
  const subtitle = globalizeCopy(
    aboutContent.subtitle,
    'CreatifyBD gives founders and marketing teams dependable creative execution without the cost or complexity of a full in-house department.'
  );

  return (
    <section className="about-trust-section-v3" id="about">
      <div className="container">
        <div className="ab-grid">
          {/* Left Column: Content */}
          <div className="ab-content-col">
            <span className="ab-eyebrow">{aboutContent.eyebrow || 'About CreatifyBD'}</span>
            <h2 className="ab-title">{renderRichTitle(title)}</h2>
            <p className="ab-subtitle">{subtitle}</p>

            {/* Our Approach Statement */}
            <div className="ab-ceo-card">
              <div className="ab-ceo-quote-body">
                <Quote size={20} className="ab-quote-icon" />
                <p className="ab-quote-text">
                  "{aboutContent.ceo_quote || 'Our responsibility is simple: make every brand look credible, consistent, and ready for international customers.'}"
                </p>
                <div className="ab-ceo-meta">
                  <span className="ab-ceo-name">CreatifyBD Team</span>
                </div>
              </div>
            </div>

            <Link to="/about" className="ab-cta-link">
              <span>{aboutContent.cta_label || 'Read Our Story'}</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Right Column: Delivery Model & Stats */}
          <div className="ab-visual-col">
            {/* Delivery model tags */}
            <div className="ab-model-card">
              <div className="ab-model-header">
                <MonitorCheck size={18} className="text-red" />
                <strong>{aboutContent.team_heading || 'Specialist delivery model'}</strong>
              </div>
              <div className="ab-model-tags">
                {roles.map((role) => (
                  <span key={role} className="ab-model-tag">{role}</span>
                ))}
              </div>
            </div>

            {/* Quick stats strip */}
            <div className="ab-stats-grid">
              {stats.slice(0, 3).map((stat, idx) => (
                <div className="ab-stat-box" key={idx}>
                  <strong className="ab-stat-val">{stat.value || stat.val}</strong>
                  <span className="ab-stat-lbl">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .about-trust-section-v3 {
          padding: 8rem 0;
          background: #fff;
          position: relative;
          overflow: hidden;
        }
        .ab-grid {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 5rem;
          align-items: center;
        }
        
        /* Left Col */
        .ab-eyebrow {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--brand-red, #E8192C);
          margin-bottom: 1.25rem;
        }
        .ab-title {
          font-size: clamp(2.25rem, 4vw, 3.25rem);
          font-weight: 900;
          color: var(--ink, #0F0F12);
          line-height: 1.1;
          letter-spacing: -0.04em;
          margin-bottom: 1.5rem;
        }
        .ab-subtitle {
          font-size: 1.05rem;
          color: var(--muted, #6B7280);
          line-height: 1.7;
          margin-bottom: 2.5rem;
        }

        /* CEO Quote Card */
        .ab-ceo-card {
          display: flex;
          gap: 1.5rem;
          background: var(--surface-soft, #FCFCFD);
          border: 1.5px solid #EBEBF0;
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2.5rem;
          position: relative;
        }
        .ab-ceo-portrait {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          overflow: hidden;
          flex-shrink: 0;
          border: 2px solid #fff;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        .ab-ceo-portrait img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .ab-ceo-avatar-placeholder {
          width: 100%;
          height: 100%;
          background: var(--brand-red, #E8192C);
          color: #fff;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
        }
        .ab-ceo-quote-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .ab-quote-icon {
          color: #D0D5DD;
        }
        .ab-quote-text {
          font-size: 0.95rem;
          color: var(--ink, #0F0F12);
          line-height: 1.6;
          font-weight: 500;
          margin: 0;
        }
        .ab-ceo-meta {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          font-weight: 700;
        }
        .ab-ceo-name {
          color: var(--ink, #0F0F12);
        }
        .ab-ceo-sep {
          color: #D0D5DD;
        }
        .ab-ceo-role {
          color: var(--muted, #6B7280);
        }

        .ab-cta-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.92rem;
          font-weight: 800;
          color: var(--brand-red, #E8192C);
          transition: transform 0.22s ease;
          text-decoration: none;
        }
        .ab-cta-link:hover {
          transform: translateX(4px);
        }

                /* Right Col (Visual Proof Grid) */
        .ab-visual-col {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .ab-media-frame {
          position: relative;
          overflow: hidden;
          border: 1.5px solid var(--border-soft, #EBEBF0);
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .main-frame {
          border-radius: 48px 16px 48px 16px;
        }
        .ab-split-gallery .ab-media-frame:first-child {
          border-radius: 16px 40px 16px 40px;
        }
        .ab-split-gallery .ab-media-frame:last-child {
          border-radius: 40px 16px 40px 16px;
        }
        
        .ab-media-frame img {
          width: 100%;
          display: block;
          object-fit: cover;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .ab-media-frame:hover {
          border-color: rgba(232, 25, 44, 0.35) !important;
          box-shadow: 0 20px 45px rgba(232, 25, 44, 0.08), var(--shadow-md);
          transform: translateY(-4px);
        }
        .ab-media-frame:hover img {
          transform: scale(1.08) rotate(1.2deg);
        }
        .main-frame img {
          height: 310px;
        }
        
        /* Modern Text Reveal Overlay */
        .ab-media-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(6, 6, 8, 0.92) 0%,
            rgba(6, 6, 8, 0.6) 60%,
            rgba(6, 6, 8, 0.3) 100%
          );
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.25rem;
          opacity: 0;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 2;
        }
        .ab-media-frame:hover .ab-media-overlay {
          opacity: 1;
        }
        
        .ab-media-info {
          text-align: center;
          transform: translateY(24px);
          transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          color: white;
          max-width: 320px;
        }
        .ab-media-frame:hover .ab-media-info {
          transform: translateY(0);
        }
        
        .ab-overlay-icon {
          color: var(--brand-red, #E8192C);
          margin-bottom: 0.5rem;
          filter: drop-shadow(0 4px 8px rgba(232,25,44,0.3));
        }
        .ab-overlay-kicker {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.15em;
          color: var(--brand-red, #E8192C);
          text-transform: uppercase;
        }
        .ab-overlay-title {
          font-size: clamp(1.4rem, 2.5vw, 1.85rem) !important;
          font-weight: 900 !important;
          line-height: 1.18 !important;
          letter-spacing: -0.02em !important;
          color: white !important;
          margin: 0 !important;
        }
        .ab-overlay-title.sm {
          font-size: clamp(1rem, 1.8vw, 1.25rem) !important;
          line-height: 1.25 !important;
          letter-spacing: -0.01em !important;
        }

        .ab-split-gallery {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        .ab-split-gallery img {
          height: 190px;
        }

        /* Delivery Model Card */
        .ab-model-card {
          background: #fff;
          border: 1.5px solid #EBEBF0;
          border-radius: 20px;
          padding: 1.25rem 1.5rem;
        }
        .ab-model-header {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.88rem;
          margin-bottom: 0.85rem;
          color: var(--ink, #0F0F12);
        }
        .ab-model-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
        }
        .ab-model-tag {
          font-size: 0.76rem;
          font-weight: 700;
          color: var(--muted, #6B7280);
          background: var(--surface-soft, #FCFCFD);
          padding: 0.35rem 0.75rem;
          border-radius: 8px;
          border: 1px solid #EBEBF0;
        }

        /* Stats Grid */
        .ab-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }
        .ab-stat-box {
          background: #fff;
          border: 1.5px solid #EBEBF0;
          border-radius: 16px;
          padding: 1.25rem;
          text-align: center;
          transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .ab-stat-box:hover {
          border-color: var(--brand-red, #E8192C);
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(232, 25, 44, 0.08);
        }
        .ab-stat-val {
          display: block;
          font-size: 1.4rem;
          font-weight: 900;
          color: var(--brand-red, #E8192C);
          letter-spacing: -0.03em;
          margin-bottom: 0.2rem;
          line-height: 1;
        }
        .ab-stat-lbl {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--muted, #9CA3AF);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        @media (max-width: 900px) {
          .ab-grid {
            grid-template-columns: 1fr;
            gap: 4rem;
          }
        }
        @media (max-width: 600px) {
          .about-trust-section-v3 {
            padding: 5rem 0;
          }
          .ab-ceo-card {
            flex-direction: column;
            padding: 1.5rem;
            gap: 1.25rem;
          }
          .ab-ceo-portrait {
            width: 48px;
            height: 48px;
          }
          .ab-split-gallery {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          .ab-stats-grid {
            grid-template-columns: 1fr;
          }
          .ab-stat-box {
            padding: 1rem;
          }
        }
      `}</style>
    </section>
  );
};

export default AboutTrust;
