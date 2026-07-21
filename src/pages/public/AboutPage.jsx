import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import usePageSEO from '../../hooks/usePageSEO';
import { ArrowRight, Award, Globe, Quote, ShieldCheck, Users } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const AboutPage = () => {
  const { content } = useSettings();
  const aboutContent = content?.about_trust || {};

  const seo = usePageSEO('about', {
    title: "About CreatifyBD \u2014 Who We Are and How We Work",
    description: "A small team that got tired of watching good businesses get stuck with generic branding. Here's what we build instead."
  });

  return (
    <div className="about-page">
      <SEO
        title={seo.title}
        description={seo.description}
        keywords="about creative agency, about digital marketing agency, about social media management company, about graphic design agency, about video editing company, about web design agency, creatifybd about, creative agency team, creative agency story, marketing agency about us, creative agency mission"
      />
      <Navbar />

      <div className="page-header page-header-light">
        <div className="container">
          <h1 className="page-title">A dependable creative partner for <span className="red">international</span> brands</h1>
          <p className="page-subtitle">
            CreatifyBD combines full-service creative production with clear, custom-quoted pricing for growing businesses that need consistent execution without long contracts.
          </p>
        </div>
      </div>

      <main>
        <section className="about-detail-section">
          <div className="container about-detail-grid">
            <div>
              <h2 className="section-h">Why CreatifyBD exists</h2>
              <p className="section-sub">
                Growing businesses usually end up choosing between an expensive agency with layers of account managers, or a handful of freelancers who've never spoken to each other. We built CreatifyBD as the option in between: one real team handling branding, social, video, and web together, with clear scope and pricing set before we start \u2014 not decided halfway through.
              </p>
              <div className="ceo-quote about-ceo-feature">
                <div>
                  <Quote size={22} />
                  <p>
                    "{aboutContent.ceo_quote || 'Every brand we touch should look like it\u2019s already competing at the level it wants to reach \u2014 that\u2019s the standard we hold every project to.'}"
                  </p>
                  <strong>CreatifyBD Team</strong>
                </div>
              </div>
            </div>

            <div className="about-values-grid">
              <div><Globe size={22} /><strong>International standards</strong><span>Creative built for global buyers.</span></div>
              <div><ShieldCheck size={22} /><strong>Clear scope</strong><span>Custom quote, milestones, and revisions agreed upfront.</span></div>
              <div><Award size={22} /><strong>Quality review</strong><span>Every deliverable checked before handoff.</span></div>
              <div><Users size={22} /><strong>4-7 person team</strong><span>Strategy, design, video, and web, working together.</span></div>
            </div>
          </div>
        </section>

        <section className="about-team-section">
          <div className="container" style={{ textAlign: 'center' }}>
            <div className="section-header text-center">
              <h2 className="section-h">Meet the people behind the work</h2>
              <p className="section-sub" style={{ maxWidth: '560px', margin: '0 auto 2rem' }}>
                Real names, real roles \u2014 see who's actually working on projects like yours.
              </p>
            </div>
            <Link to="/team" className="admin-btn-primary" style={{ display: 'inline-flex', textDecoration: 'none' }}>
              Meet the Team <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
