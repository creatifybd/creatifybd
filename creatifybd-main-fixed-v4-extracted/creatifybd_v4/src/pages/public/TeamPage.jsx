import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import usePageSEO from '../../hooks/usePageSEO';
import { motion } from 'framer-motion';
import { Mail, Loader2, Users } from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';

const EASE_EXPO = [0.16, 1, 0.3, 1];

const TeamPage = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchTeam = async () => {
      try {
        const q = query(collection(db, 'team_members'), orderBy('order', 'asc'));
        const snap = await getDocs(q);
        const list = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(m => m.hidden !== true);
        if (active) setTeamMembers(list);
      } catch (err) {
        console.error('Failed to load team members', err);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchTeam();
    return () => { active = false; };
  }, []);

  const seo = usePageSEO('team', {
    title: "Meet the CreatifyBD Team",
    description: "The real people actually working on your project — real names, real roles, no mystery about who's on the other end of the email."
  });

  return (
    <div className="team-page">
      <SEO
        title={seo.title}
        description={seo.description}
      />

      <Navbar />

      {/* ── Hero ── */}
      <div className="page-header page-header-light">
        <div className="container">
          <motion.div
            className="eyebrow"
            style={{ marginBottom: '1rem' }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE_EXPO, delay: 0 }}
          >
            The CreatifyBD Team
          </motion.div>

          <motion.h1
            className="page-title"
            initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.85, ease: EASE_EXPO, delay: 0.08 }}
          >
            The People Behind Your <span className="red">Project</span>
          </motion.h1>

          <motion.p
            className="page-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE_EXPO, delay: 0.2 }}
          >
            Designers, strategists, editors, and developers who actually work together — not five freelancers who've never met.
          </motion.p>
        </div>
      </div>

      {/* Corporate trust intro */}
      <section className="team-intro-section" style={{ padding: '6rem 1rem', background: 'var(--surface-soft)' }}>
        <motion.div
          className="container"
          style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.75, ease: EASE_EXPO }}
        >
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '1.5rem' }}>One Team, Every Discipline</h2>
          <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '2rem' }}>
            We built CreatifyBD around one idea: a growing business shouldn't need to juggle five different freelancers to get branding, social, video, and web done well. One team, one point of contact, consistent quality across everything.
          </p>
          <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
            We work remotely and asynchronously by design — it's how we move fast without sacrificing the back-and-forth that good creative work actually needs.
          </p>
        </motion.div>
      </section>

      {/* Office Image showcase */}
      <section className="office-showcase-section" style={{ padding: '6rem 1rem' }}>
        <div className="container">
          <div className="office-grid">
            {[
              'Remote-ready creative operations workspace',
              'Visual design and editing brainstorming room'
            ].map((caption, idx) => (
              <motion.div
                key={idx}
                className="office-image-box"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, ease: EASE_EXPO, delay: idx * 0.12 }}
              >
                <div className="office-placeholder" style={{ background: 'var(--surface-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', borderRadius: '12px', color: 'var(--muted)' }}>
                  <p>{idx === 0 ? 'Office photo coming soon' : 'Creative meeting area coming soon'}</p>
                </div>
                <span className="caption">{caption}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team grid */}
      <section className="team-members-grid-section" style={{ padding: '6rem 1rem', background: 'var(--surface-soft)' }}>
        <div className="container">
          <motion.div
            className="section-header text-center"
            style={{ marginBottom: '4rem' }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: EASE_EXPO }}
          >
            <h2 className="section-h">Meet the Team</h2>
            <p className="section-sub">The real people working on your project — not job titles standing in for names.</p>
          </motion.div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <Loader2 className="animate-spin" size={32} style={{ opacity: 0.5 }} />
            </div>
          ) : teamMembers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--muted)' }}>
              <Users size={36} style={{ opacity: 0.4, marginBottom: '1rem' }} />
              <p>Team profiles are being added — check back soon.</p>
            </div>
          ) : (
          <div className="team-grid">
            {teamMembers.map((member, idx) => (
              <motion.div
                key={member.id || idx}
                className="team-member-card"
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.65, ease: EASE_EXPO, delay: Math.min(idx * 0.08, 0.36) }}
              >
                <div className="member-photo-wrap">
                  <img src={member.photoUrl || member.image || '/assets/team/placeholder-avatar.svg'} alt={member.name} />
                </div>
                <div className="member-body">
                  <h4 className="member-name">{member.name}</h4>
                  <span className="member-role">{member.role}</span>
                  {member.bio && <p className="member-bio">{member.bio}</p>}
                  {Array.isArray(member.skills) && member.skills.length > 0 && (
                    <div className="member-skills-row">
                      {member.skills.map((skill, sIdx) => (
                        <span key={sIdx} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  )}
                  {member.email && (
                    <div className="member-contact-row" style={{ marginTop: '1.25rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                      <a href={`mailto:${member.email}`} className="member-mail-btn" aria-label={`Email ${member.name}`}>
                        <Mail size={14} />
                        <span>{member.email}</span>
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          )}
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
          .office-grid { grid-template-columns: 1fr; }
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
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .team-member-card:hover {
          border-color: var(--brand-red);
          box-shadow: 0 8px 32px rgba(232,25,44,0.08);
        }

        .member-photo-wrap {
          width: 100%;
          padding-top: 100%;
          position: relative;
          background: var(--surface-muted);
        }

        .member-photo-wrap img {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
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
