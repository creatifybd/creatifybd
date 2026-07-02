import React from 'react';
import { Building2, MonitorCheck, Quote, UsersRound, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

const defaultRoles = [
  'Social strategist',
  'Graphic designer',
  'Video editor',
  'Web designer',
  'Client success'
];

const defaultStats = [
  { value: 'No', label: 'Long-term lock-in' },
  { value: '24h', label: 'Typical response' },
  { value: '100%', label: 'Scope clarity' }
];

const fallbackOfficeImage = 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop';
const fallbackTeamImage = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=900&auto=format&fit=crop';
const fallbackMeetingImage = 'https://images.unsplash.com/photo-1616587894289-86480e533129?q=80&w=900&auto=format&fit=crop';

const AboutTrust = () => {
  const { content } = useSettings();
  const aboutContent = content?.about_trust || {};
  const roles = Array.isArray(aboutContent.team_roles) && aboutContent.team_roles.length
    ? aboutContent.team_roles
    : defaultRoles;
  const stats = Array.isArray(aboutContent.stats) && aboutContent.stats.length
    ? aboutContent.stats
    : defaultStats;

  return (
    <section className="about-trust-section" id="about">
      <div className="container">
        <div className="about-trust-grid">
          <div>
            <span className="eyebrow">{aboutContent.eyebrow || 'About CreatifyBD'}</span>
            <h2 className="section-h">{aboutContent.title || 'A specialist creative team serving global brands'}</h2>
            <p className="section-sub">
              {aboutContent.subtitle || 'CreatifyBD is built for founders and lean marketing teams who need dependable creative execution without the cost or complexity of a full in-house department.'}
            </p>

            <div className="ceo-quote ceo-quote-with-image">
              <div className="ceo-portrait-card">
                {aboutContent.ceo_image ? (
                  <img src={aboutContent.ceo_image} alt={aboutContent.ceo_name || 'Founder and CEO'} loading="lazy" />
                ) : (
                  <div className="ceo-portrait-mark">BS</div>
                )}
                <span>{aboutContent.ceo_role || 'Founder & CEO'}</span>
              </div>
              <blockquote>
                <Quote size={18} />
                <p>
                  "{aboutContent.ceo_quote || 'Our responsibility is simple: make every brand look credible, consistent, and ready for international customers.'}"
                </p>
                <cite>- {aboutContent.ceo_name || 'B. I. N. Shad'}</cite>
              </blockquote>
            </div>

            <Link to="/about" className="btn-outline-red">{aboutContent.cta_label || 'Read Our Story'}</Link>
          </div>

          <div className="trust-proof-panel">
            <div className="office-card office-card-main">
              <img
                src={aboutContent.office_image || fallbackOfficeImage}
                alt="CreatifyBD collaborative production office"
                loading="lazy"
              />
              <div className="office-card-caption">
                <Building2 size={18} />
                <span>{aboutContent.office_caption || 'Remote-ready creative operations for international clients'}</span>
              </div>
            </div>

            <div className="agency-moment-grid">
              <figure>
                <img
                  src={aboutContent.team_image || fallbackTeamImage}
                  alt="CreatifyBD team planning creative deliverables"
                  loading="lazy"
                />
                <figcaption><UsersRound size={16} /> {aboutContent.team_caption || 'Team production sprint'}</figcaption>
              </figure>
              <figure>
                <img
                  src={aboutContent.meeting_image || fallbackMeetingImage}
                  alt="Online client review meeting"
                  loading="lazy"
                />
                <figcaption><Video size={16} /> {aboutContent.meeting_caption || 'Online client review'}</figcaption>
              </figure>
            </div>

            <div className="team-role-card">
              <div className="team-role-heading">
                <MonitorCheck size={20} />
                <strong>{aboutContent.team_heading || 'Specialist delivery model'}</strong>
              </div>
              <div className="team-role-list">
                {roles.map((role, i) => (
                  <React.Fragment key={role}>
                    <span className="team-role-item">{role}</span>
                    {i < roles.length - 1 && <span className="role-sep" aria-hidden="true">-</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="trust-mini-stats">
              {stats.slice(0, 3).map((stat) => (
                <div className="trust-stat" key={`${stat.value || stat.val}-${stat.label}`}>
                  <strong>{stat.value || stat.val}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutTrust;
