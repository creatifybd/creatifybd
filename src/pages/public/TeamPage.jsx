import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import { motion } from 'framer-motion';
import { Mail, Globe, Users, Trophy, Coffee } from 'lucide-react';

const TeamPage = () => {
  const teamMembers = [
    {
      name: 'B. I. N. Shad',
      role: 'Founder & Creative Lead',
      bio: 'Pioneering custom workflow pipelines connecting global small businesses with specialized creative assets.',
      skills: ['Strategy', 'Creative Direction', 'Operations'],
      email: 'binashad7@gmail.com',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&h=300&fit=crop'
    },
    {
      name: 'Sarah Anderson',
      role: 'Lead Social Strategist',
      bio: 'Designing targeted content strategies and hashtag funnels for US/CA/AU audiences.',
      skills: ['SMM Strategy', 'Audience Growth', 'Analytics'],
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&h=300&fit=crop'
    },
    {
      name: 'Rashedul Islam',
      role: 'Lead Graphic Designer',
      bio: 'Crafting clean, memorable vector logo designs and cohesive corporate styles guides.',
      skills: ['Branding', 'Vector Illustration', 'InDesign'],
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&h=300&fit=crop'
    },
    {
      name: 'Tanvir Hossain',
      role: 'Senior Video Editor',
      bio: 'Injecting high-energy visual zoom cuts and sound effects to maximize Reels watch time.',
      skills: ['Premiere Pro', 'DaVinci Resolve', 'Sound FX'],
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&h=300&fit=crop'
    },
    {
      name: 'Fahim Rahman',
      role: 'Lead Full-stack Web Developer',
      bio: 'Engineering lightning-fast React platforms and indexable static fallback structures.',
      skills: ['React/Vite', 'Firebase Node', 'SEO Architect'],
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&h=300&fit=crop'
    }
  ];

  return (
    <div className="team-page">
      <SEO 
        title="Meet Our Creative Team & Workspace | CreatifyBD"
        description="Learn about the creative agency specialists collaborating in our Dhaka production office to build premium social content and React sites."
      />

      <Navbar />

      <div className="page-header page-header-light">
        <div className="container">
          <h1 className="page-title">Meet Our <span className="red">Team</span> & Workspace</h1>
          <p className="page-subtitle">A cohesive group of visual artists, copywriters, and developers driving growth for global brands.</p>
        </div>
      </div>

      {/* Corporate trust intro */}
      <section className="team-intro-section" style={{ padding: '6rem 1rem', background: 'var(--surface-soft)' }}>
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '1.5rem' }}>Our Production Center in Dhaka</h2>
          <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '2rem' }}>
            By establishing our creative execution center in Dhaka, Bangladesh, we secure an exceptional cost-efficiency advantage. We pass these operational savings directly to small businesses in the USA, Canada, and Australia—delivering high-end international agency standards at competitive rates.
          </p>
          <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
            Our collaborative workspace brings together specialized creative talent focused on delivering quality results for your brand.
          </p>
        </div>
      </section>

      {/* Office Image showcase */}
      <section className="office-showcase-section" style={{ padding: '6rem 1rem' }}>
        <div className="container">
          <div className="office-grid">
            <div className="office-image-box">
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&h=500&fit=crop" alt="CreatifyBD collaborative work area" />
              <span className="caption">Our collaborative workspace in Dhaka, Bangladesh</span>
            </div>
            <div className="office-image-box">
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&h=500&fit=crop" alt="Creative meeting area" />
              <span className="caption">Visual design and editing brainstorming room</span>
            </div>
          </div>
        </div>
      </section>

      {/* Team grid */}
      <section className="team-members-grid-section" style={{ padding: '6rem 1rem', background: '#111' }}>
        <div className="container">
          <div className="section-header text-center" style={{ marginBottom: '4rem' }}>
            <h2 className="section-h">Meet Our Specialists</h2>
            <p className="section-sub">Transparent billing structures backed by professional, accountable experts.</p>
          </div>

          <div className="team-grid">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="team-member-card">
                <div className="member-photo-wrap">
                  <img src={member.image} alt={member.name} />
                </div>
                <div className="member-body">
                  <h4 className="member-name">{member.name}</h4>
                  <span className="member-role">{member.role}</span>
                  <p className="member-bio">{member.bio}</p>
                  
                  <div className="member-skills-row">
                    {member.skills.map((skill, sIdx) => (
                      <span key={sIdx} className="skill-tag">{skill}</span>
                    ))}
                  </div>

                  {member.email && (
                    <div className="member-contact-row" style={{ marginTop: '1.25rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                      <a href={`mailto:${member.email}`} className="member-mail-btn" aria-label={`Email ${member.name}`}>
                        <Mail size={14} />
                        <span>{member.email}</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        .office-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .office-grid {
            grid-template-columns: 1fr;
          }
        }

        .office-image-box {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .office-image-box img {
          width: 100%;
          height: auto;
          border-radius: 16px;
          border: 1px solid var(--border);
        }

        .office-image-box .caption {
          font-size: 0.8rem;
          color: var(--muted);
          text-align: center;
          font-style: italic;
        }

        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 3rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .team-member-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.2s;
        }

        .team-member-card:hover {
          border-color: var(--brand-red);
        }

        .member-photo-wrap {
          width: 100%;
          padding-top: 100%; /* square ratio */
          position: relative;
          background: var(--surface-muted);
        }

        .member-photo-wrap img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .member-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
        }

        .member-name {
          font-size: 1.1rem;
          color: var(--ink);
          font-weight: 800;
          margin-bottom: 0.15rem;
        }

        .member-role {
          font-size: 0.8rem;
          color: var(--brand-red);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.75rem;
          display: block;
        }

        .member-bio {
          font-size: 0.825rem;
          color: var(--muted);
          line-height: 1.5;
          margin-bottom: 1.25rem;
        }

        .member-skills-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .skill-tag {
          font-size: 0.65rem;
          background: var(--surface-soft);
          border: 1px solid var(--border);
          color: var(--muted);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-weight: 600;
        }

        .member-mail-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--muted);
          text-decoration: none;
          font-size: 0.75rem;
          transition: color 0.2s;
        }

        .member-mail-btn:hover {
          color: var(--brand-red);
        }
      `}</style>
    </div>
  );
};

export default TeamPage;
