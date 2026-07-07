import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import GigCard from '../../components/GigCard';
import { categories, getGigsByCategory } from '../../data/gigs';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const EASE_EXPO = [0.16, 1, 0.3, 1];

const ServiceCategoryPage = () => {
  const { categorySlug } = useParams();
  const category = categories[categorySlug];

  if (!category) {
    return <Navigate to="/services" replace />;
  }

  const categoryGigs = getGigsByCategory(categorySlug);

  const categoryDetails = {
    'social-media-management': {
      headline: 'Best Social Media Management Agency | Monthly Content Strategy & Management',
      subheadline: 'CreatifyBD is the best social media management agency offering comprehensive social media marketing services including content calendar, post design, copywriting, and hashtag strategy for brands globally.',
      benefits: [
        'Content Calendar: Never guess what to post next; review drafts before publishing.',
        'High-converting designs: Visual grids designed to capture authority in your industry.',
        'Done-for-you copywriting: Engaging captions and target hashtag clusters tailored for global audiences.',
        'Performance Reports: Simple, transparent monthly analytics reviews.'
      ],
      process: [
        { title: 'Onboarding & Strategy', desc: 'We inspect your current social footprint, audit competitors, and build a monthly calendar roadmap.' },
        { title: 'Content Creative Phase', desc: 'Our team designs custom post layouts, writes engaging captions, and drafts Reels concepts.' },
        { title: 'Review & Publish', desc: 'You approve the content calendar, and we schedule posts at optimal times on your platforms.' }
      ],
      faqs: [
        {
          question: 'Which platforms do you manage?',
          answer: 'We primarily manage Facebook, Instagram, LinkedIn, and Pinterest. We can also handle Twitter/X or TikTok depending on your custom needs.'
        },
        {
          question: 'How is the content approved?',
          answer: 'We create a content calendar draft for the entire month. We do not publish anything without your direct review and approval.'
        },
        {
          question: 'Do you run paid ads?',
          answer: 'Yes, we design the ad creatives and copy. Advanced campaign setup is available as an extra add-on.'
        }
      ],
      seo: {
        title: 'Best Social Media Management Agency | Social Media Marketing Services | CreatifyBD',
        description: 'Hire the best social media management agency at CreatifyBD. We offer professional social media marketing services, content strategy, post design, and management for brands globally.',
        keywords: 'social media management agency, social media marketing agency, social media manager, social media marketing services, social media marketing company, social media strategy, content calendar management, social media post design, social media content creation, Instagram management, Facebook page management, LinkedIn management, social media advertising agency'
      }
    },
    'graphic-design': {
      headline: 'Best Graphic Design Service | Professional Logo Design & Brand Identity Agency',
      subheadline: 'CreatifyBD is the best graphic design agency offering professional graphic design services including logo design, brand identity, social media graphics, and print design for businesses worldwide.',
      benefits: [
        'Corporate Brand Style Guides: Ensure 100% color and typographical consistency across media.',
        'memorable vector logos: Unique corporate logos that establish instant client trust.',
        'Scrolling promotional posts: High CTR designs built to stand out on social media feeds.',
        'Print-ready files: Bleed-configured high-resolution flyer layouts and brochures.'
      ],
      process: [
        { title: 'Visual Intake & Moodboard', desc: 'Specify colors, typography styles, and reference visuals in your client form.' },
        { title: 'Draft Concepts Creation', desc: 'Our designers generate multiple custom concepts for your review and layout scaling.' },
        { title: 'Revision & Asset Export', desc: 'Refine your choice and receive editable vector source files (AI/EPS/SVG/PDF).' }
      ],
      faqs: [
        {
          question: 'What file formats do you deliver?',
          answer: 'We deliver AI, EPS, SVG, PDF, high-res PNG, and JPEG formats for all graphic design projects.'
        },
        {
          question: 'Do you use templates?',
          answer: 'No. Every design is custom created from scratch using premium visual layout software to ensure uniqueness.'
        },
        {
          question: 'How many revisions do I get?',
          answer: 'Revision counts vary by package. Basic packages include 2-3 revisions, while premium packages include up to 10 revisions.'
        }
      ],
      seo: {
        title: 'Best Graphic Design Service | Professional Logo Design & Brand Identity | CreatifyBD',
        description: 'CreatifyBD is the best graphic design agency offering professional graphic design services including logo design, brand identity, social media graphics, and print design globally.',
        keywords: 'graphic design service, graphic design agency, best graphic design service, professional logo design, brand identity design, logo design service, creative design agency, graphic design company, brand identity agency, corporate logo design, social media graphic design, print design service, vector logo design, business card design, flyer design service'
      }
    },
    'video-editing': {
      headline: 'Best Video Editing Service | Professional Video Production & Editing Agency',
      subheadline: 'CreatifyBD is the best video editing service provider offering professional video editing services including Reels editing, YouTube editing, promotional videos, and video production for global brands.',
      benefits: [
        'Short-form Reels / TikTok: Captivating text styles, graphics overlays, and sound design.',
        'YouTube Landscape Editing: Dynamic cuts, B-rolls, title animations, and background tracks.',
        'Conversion Promotion Ads: Engage users within 3 seconds and drive clicks to your store.',
        'Audio Noise Cleaning: Clear voice-over levels and cinematic background mixes.'
      ],
      process: [
        { title: 'Clip Intake & Script Sync', desc: 'Upload your raw talking-head files or product clips and specify video directions.' },
        { title: 'Creative Editing Phase', desc: 'We clean background noise, design subtitles, add transition overlays, and mix music tracks.' },
        { title: 'Draft Review & Adjustments', desc: 'Download your draft edit, request subtitle tweaks, and receive the finalized HD copy.' }
      ],
      faqs: [
        {
          question: 'Do you provide the raw footage?',
          answer: 'No, you must provide your raw video clips (talking head footage or screen recordings). We edit and enhance your footage.'
        },
        {
          question: 'What is the format?',
          answer: 'Delivered in standard 1280x720 JPEG or PNG under 2MB, optimized for YouTube upload guidelines or social media platforms.'
        },
        {
          question: 'Can you add captions?',
          answer: 'Yes, we include Alex Hormozi style text captions and subtitles in our video editing packages.'
        }
      ],
      seo: {
        title: 'Best Video Editing Service | Professional Video Production & Editing | CreatifyBD',
        description: 'CreatifyBD is the best video editing service provider offering professional video editing services including Reels editing, YouTube editing, promotional videos, and video production globally.',
        keywords: 'video editing service, video editing agency, best video editing service, professional video editing, video production company, YouTube video editing, Reels editing service, TikTok video editing, promotional video editing, video post production, video editing company, video editing for social media, video editing for YouTube, video editing for business'
      }
    },
    'website-design': {
      headline: 'Best Web Design Agency | Professional Website Design & Development Services',
      subheadline: 'CreatifyBD is the best web design agency offering professional website design services including landing pages, business websites, portfolio sites, and web development for global clients.',
      benefits: [
        'Fully Responsive Layouts: Flawless viewports across desktop, tablet, and mobile breakpoints.',
        'Speed Optimization: Fast page loads (LCP <= 1.5s) to reduce visitor bounce rates.',
        'Intake contact capture: Forms connected to databases to collect leads securely.',
        'Local SEO configurations: Proper semantic structures, meta tags, and schema tags.'
      ],
      process: [
        { title: 'Sitemap & Content Outline', desc: 'Define your required pages list, competitor URLs, and color scheme preferences.' },
        { title: 'Development & UI Preview', desc: 'We build your page templates, integrate forms, and test speeds.' },
        { title: 'SEO Tagging & Domain Launch', desc: 'We configure meta structures, deploy files to hosting, and index canonical URLs.' }
      ],
      faqs: [
        {
          question: 'What technology do you use?',
          answer: 'We build websites using React for modern, fast, and SEO-optimized web applications with excellent performance.'
        },
        {
          question: 'Are websites mobile responsive?',
          answer: 'Yes, all our websites are fully responsive and optimized for desktop, tablet, and mobile devices.'
        },
        {
          question: 'Do you include SEO?',
          answer: 'Yes, we include proper SEO configurations including meta tags, schema markup, and semantic HTML structure.'
        }
      ],
      seo: {
        title: 'Best Web Design Agency | Professional Website Design & Development | CreatifyBD',
        description: 'CreatifyBD is the best web design agency offering professional website design services including landing pages, business websites, portfolio sites, and web development globally.',
        keywords: 'web design agency, website design service, best web design agency, professional website design, web development services, web design company, landing page design, business website design, portfolio website design, website development company, responsive web design, custom website design, website redesign service, React web development, SEO web design'
      }
    }
  };

  const details = categoryDetails[categorySlug] || { headline: category.name, subheadline: category.desc, benefits: [], process: [], seo: {}, faqs: [] };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": category.name,
    "name": details.headline,
    "description": details.subheadline,
    "provider": {
      "@type": "Organization",
      "name": "CreatifyBD",
      "url": "https://creatifybd.com"
    },
    "areaServed": "Global"
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://creatifybd.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Services",
        "item": "https://creatifybd.com/services"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": category.name,
        "item": `https://creatifybd.com/services/${categorySlug}`
      }
    ]
  };

  const faqSchema = details.faqs && details.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": details.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  const combinedSchema = faqSchema ? [serviceSchema, breadcrumbSchema, faqSchema] : [serviceSchema, breadcrumbSchema];

  return (
    <div className="category-landing-page">
      <SEO
        title={details.seo?.title || `${category.name} Services | CreatifyBD`}
        description={details.seo?.description || details.subheadline}
        keywords={details.seo?.keywords || `${categorySlug}, creatifybd services, global creative agency, brand creative services`}
        schema={combinedSchema}
      />

      <Navbar />

      {/* ── Category Hero (dark branded) ── */}
      <section className="category-hero category-hero-light">
        <div className="container hero-container-inner">
          <motion.span
            className="category-icon-large"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: EASE_EXPO, delay: 0 }}
          >
            {category.icon}
          </motion.span>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 36, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.85, ease: EASE_EXPO, delay: 0.1 }}
          >
            {details.headline}
          </motion.h1>

          <motion.p
            className="hero-desc"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE_EXPO, delay: 0.22 }}
          >
            {details.subheadline}
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_EXPO, delay: 0.35 }}
          >
            <a href="#gigs-section" className="premium-btn">Explore Gigs <ArrowRight size={18} /></a>
            <Link to="/contact" className="premium-btn-outline">Custom Consultation</Link>
          </motion.div>
        </div>
      </section>

      {/* ── Gigs List Section ── */}
      <section id="gigs-section" className="category-gigs-section">
        <div className="container">
          <motion.div
            className="section-header text-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: EASE_EXPO }}
          >
            <h2 className="section-h">Browse Our <span className="red">{category.name}</span> Gigs</h2>
            <p className="section-sub">Choose a transparent, fixed-price package below to start your order flow instantly.</p>
          </motion.div>

          {categoryGigs.length > 0 ? (
            <div className="gigs-grid">
              {categoryGigs.map((gig, idx) => (
                <motion.div
                  key={gig.id}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.65, ease: EASE_EXPO, delay: Math.min(idx * 0.1, 0.4) }}
                >
                  <GigCard gig={gig} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="empty-gigs text-center">
              <p>No active gigs in this category at the moment. Contact us for custom quotes.</p>
              <Link to="/contact" className="btn-red">Get in Touch</Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Benefits / Why Us ── */}
      <section className="category-benefits-section">
        <div className="container">
          <motion.div
            className="benefits-grid"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.75, ease: EASE_EXPO }}
          >
            <div className="benefits-text">
              <h2 className="section-h">Why Partner with Us for {category.name}?</h2>
              <p className="benefits-intro">We provide premium creative agency standards at competitive production price rates, delivering Fiverr-like transparency and security.</p>
              <ul className="benefits-list">
                {details.benefits.map((benefit, idx) => {
                  const [title, desc] = benefit.split(': ');
                  return (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-30px' }}
                      transition={{ duration: 0.55, ease: EASE_EXPO, delay: idx * 0.08 }}
                    >
                      <CheckCircle2 size={20} className="check-icon" />
                      <div>
                        <strong>{title}</strong>
                        {desc && <p>{desc}</p>}
                      </div>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
            <div className="benefits-graphic-mock">
              <div className="mock-dash-box">
                <span className="badge">CREATIFY AGENCY STANDARDS</span>
                <h4>Global Production Advantage</h4>
                <p>We run a structured remote production workflow with international quality standards for brands in global markets.</p>
                <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div className="advantage-bar"><span className="label">International Quality</span><span className="percent">100%</span></div>
                  <div className="advantage-bar"><span className="label">Manual verification trust</span><span className="percent">100%</span></div>
                  <div className="advantage-bar"><span className="label">Pricing affordability</span><span className="percent">Save 60%</span></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Process / How it Works ── */}
      <section className="category-process-section">
        <div className="container">
          <motion.div
            className="section-header text-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: EASE_EXPO }}
          >
            <h2 className="section-h">Our Step-by-Step Delivery Process</h2>
            <p className="section-sub">A seamless order execution roadmap built to guarantee revisions satisfaction.</p>
          </motion.div>

          <div className="process-stepper-grid">
            {details.process.map((step, idx) => (
              <motion.div
                key={idx}
                className="process-step-card"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.65, ease: EASE_EXPO, delay: idx * 0.12 }}
              >
                <div className="step-number">0{idx + 1}</div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        .category-hero {
          padding: 8rem 2rem 5rem;
          text-align: center;
          background: #0f0f0f;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .hero-container-inner {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .category-icon-large {
          font-size: 4rem;
          margin-bottom: 0.5rem;
        }

        .hero-title {
          font-size: clamp(2.2rem, 5vw, 3.8rem);
          font-weight: 900;
          line-height: 1.1;
          color: white;
        }

        .hero-desc {
          font-size: clamp(1rem, 2.5vw, 1.2rem);
          color: #888;
          line-height: 1.6;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .category-gigs-section {
          padding: 6rem 2rem;
          background: var(--surface-soft);
        }

        .gigs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2.5rem;
          max-width: 1200px;
          margin: 4rem auto 0;
        }

        .category-benefits-section {
          padding: 6rem 2rem;
          background: #0b0b0b;
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 4rem;
          max-width: 1200px;
          margin: 0 auto;
          align-items: center;
        }

        .benefits-text h2 {
          font-size: 2.2rem;
          margin-bottom: 1rem;
        }

        .benefits-intro {
          color: #888;
          margin-bottom: 2rem;
          font-size: 1.05rem;
          line-height: 1.5;
        }

        .benefits-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .benefits-list li {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .benefits-list li strong {
          color: white;
          font-size: 1.1rem;
          display: block;
          margin-bottom: 0.25rem;
        }

        .benefits-list li p {
          color: #888;
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .check-icon {
          color: var(--red);
          flex-shrink: 0;
          margin-top: 0.15rem;
        }

        .mock-dash-box {
          background: #161616;
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }

        .mock-dash-box .badge {
          background: rgba(232, 25, 44, 0.15);
          color: var(--red);
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
          display: inline-block;
          margin-bottom: 1rem;
        }

        .mock-dash-box h4 {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
          color: white;
        }

        .mock-dash-box p {
          font-size: 0.85rem;
          color: #888;
          line-height: 1.5;
        }

        .advantage-bar {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .advantage-bar .label { color: #aaa; }
        .advantage-bar .percent { color: white; }

        .category-process-section {
          padding: 6rem 2rem;
          background: var(--surface-soft);
        }

        .process-stepper-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2.5rem;
          max-width: 1200px;
          margin: 4rem auto 0;
        }

        .process-step-card {
          background: #161616;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 2.5rem 2rem;
          position: relative;
          transition: border-color 0.2s;
        }

        .process-step-card:hover {
          border-color: rgba(232, 25, 44, 0.2);
        }

        .step-number {
          font-size: 2.5rem;
          font-weight: 900;
          color: rgba(255,255,255,0.05);
          position: absolute;
          top: 1rem;
          right: 1.5rem;
        }

        .process-step-card h4 {
          font-size: 1.15rem;
          color: white;
          margin-bottom: 0.75rem;
        }

        .process-step-card p {
          font-size: 0.875rem;
          color: #888;
          line-height: 1.5;
        }

        @media (max-width: 968px) {
          .benefits-grid { grid-template-columns: 1fr; gap: 3rem; }
          .process-stepper-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default ServiceCategoryPage;
