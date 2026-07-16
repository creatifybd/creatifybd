import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import usePageSEO from '../../hooks/usePageSEO';
import { Award, Building2, Globe, MonitorPlay, Quote, ShieldCheck, Sparkles, Users, Video } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const teamMembers = [
  {
    name: 'Social Media Strategy Team',
    role: 'Content Planning',
    bio: 'Builds monthly calendars, captions, content pillars, and performance reports.',
    image: ''
  },
  {
    name: 'Design Studio',
    role: 'Graphic Design',
    bio: 'Creates brand assets, post designs, ad creatives, logos, and campaign visuals.',
    image: ''
  },
  {
    name: 'Video & Web Team',
    role: 'Production',
    bio: 'Edits short-form videos and builds conversion-focused websites and landing pages.',
    image: ''
  }
];

const agencyMoments = [
  {
    icon: <Building2 size={17} />,
    title: 'Creative operations hub',
    image: ''
  },
  {
    icon: <Users size={17} />,
    title: 'Team production sprint',
    image: ''
  },
  {
    icon: <Video size={17} />,
    title: 'Online client review',
    image: ''
  },
  {
    icon: <MonitorPlay size={17} />,
    title: 'Delivery quality review',
    image: ''
  }
];

const AboutPage = () => {
  const { content } = useSettings();
  const aboutContent = content?.about_trust || {};
  const ceoName = aboutContent.ceo_name || 'CreatifyBD Team';
  const ceoRole = aboutContent.ceo_role || 'Creative Team';
  const ceoInitials = ceoName.split(' ').map(part => part[0]).join('').slice(0, 2) || 'BS';
  const displayTeamMembers = teamMembers.map((member, index) => (
    index === 0
      ? {
          ...member,
          name: ceoName,
          role: ceoRole,
          image: aboutContent.ceo_image || member.image
        }
      : member
  ));
  const displayAgencyMoments = agencyMoments.map((moment, index) => {
    const cmsImage = [
      aboutContent.office_image,
      aboutContent.team_image,
      aboutContent.meeting_image,
      aboutContent.office_image
    ][index];
    const cmsTitle = [
      aboutContent.office_caption,
      aboutContent.team_caption,
      aboutContent.meeting_caption,
      'Delivery quality review'
    ][index];
    return {
      ...moment,
      title: cmsTitle || moment.title,
      image: cmsImage || moment.image
    };
  });

  const seo = usePageSEO('about', {
    title: "About Best Creative Agency | Social Media Management & Digital Marketing Team | CreatifyBD",
    description: "Learn about CreatifyBD, the best creative agency and digital marketing team offering social media management, graphic design, video editing, and website design services globally."
  });

  return (
    <div className="about-page">
      <SEO
        title={seo.title}
        description={seo.description}
        keywords="about creative agency, about digital marketing agency, about social media management company, about graphic design agency, about video editing company, about web design agency, creatifybd about, best creative agency team, digital marketing agency team, social media management team, graphic design team, video editing team, web development team, creative agency story, marketing agency about us, creative agency mission"
      />
      <Navbar />

      <div className="page-header page-header-light">
        <div className="container">
          <span className="eyebrow">Our Agency Story</span>
          <h1 className="page-title">A dependable creative partner for <span className="red">international</span> brands</h1>
          <p className="page-subtitle">
            CreatifyBD combines agency-level creative production with clear, gig-style packages for founders who need consistent execution without long contracts.
          </p>
        </div>
      </div>

      <main>
        <section className="about-detail-section">
          <div className="container about-detail-grid">
            <div>
              <h2 className="section-h">Why CreatifyBD exists</h2>
              <p className="section-sub">
                Growing brands often get stuck between expensive agencies and inconsistent freelancers. We built CreatifyBD to offer a third option: a structured remote creative team with fixed scope, accountable delivery, and practical pricing.
              </p>
              <div className="ceo-quote about-ceo-feature">
                <div className="about-ceo-portrait" aria-label="Founder profile visual">
                  {aboutContent.ceo_image ? (
                    <img src={aboutContent.ceo_image} alt={`${ceoName}, ${ceoRole}`} loading="lazy" />
                  ) : (
                    <>
                      <span>{ceoInitials}</span>
                      <Sparkles size={18} />
                    </>
                  )}
                </div>
                <div>
                  <Quote size={22} />
                  <p>
                    "{aboutContent.ceo_quote || 'Our goal is to make high-quality creative support accessible for brands that want to look trustworthy in front of customers globally.'}"
                  </p>
                  <strong>{ceoName}, {ceoRole}</strong>
                </div>
              </div>
            </div>

            <div className="about-values-grid">
              <div><Globe size={22} /><strong>International standards</strong><span>Creative built for global buyers.</span></div>
              <div><ShieldCheck size={22} /><strong>Clear scope</strong><span>Packages, milestones, and revisions upfront.</span></div>
              <div><Award size={22} /><strong>Quality review</strong><span>Deliverables checked before handoff.</span></div>
              <div><Users size={22} /><strong>Specialist team</strong><span>Strategy, design, video, web, and support.</span></div>
            </div>
          </div>
        </section>

        <section className="about-office-section">
          <div className="container">
            <div className="section-header text-center">
              <span className="eyebrow">Our Office</span>
              <h2 className="section-h">Structured production for global clients</h2>
              <p className="section-sub">
                Our remote-ready production workflow keeps projects organized, quality controlled, and cost-efficient for international clients.
              </p>
            </div>
            <div className="office-gallery-grid agency-moments-grid">
              {displayAgencyMoments.map((moment, index) => (
                <figure key={moment.title} className={index === 0 ? 'moment-large' : ''}>
                  <img src={moment.image} alt={`CreatifyBD ${moment.title.toLowerCase()}`} />
                  <figcaption>{moment.icon} {moment.title}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="about-team-section">
          <div className="container">
            <div className="section-header text-center">
              <span className="eyebrow">Team Members</span>
              <h2 className="section-h">The specialists behind each delivery</h2>
            </div>
            <div className="about-team-grid">
              {displayTeamMembers.map(member => (
                <article key={member.name} className="about-team-card">
                  <div className="member-avatar member-photo">
                    {member.image ? (
                      <img src={member.image} alt={`${member.name} working at CreatifyBD`} loading="lazy" />
                    ) : (
                      <span>{member.name.split(' ').map(part => part[0]).join('').slice(0, 2)}</span>
                    )}
                  </div>
                  <h3>{member.name}</h3>
                  <span>{member.role}</span>
                  <p>{member.bio}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
