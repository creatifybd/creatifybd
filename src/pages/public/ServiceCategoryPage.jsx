import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import { categories, getGigsByCategory } from '../../data/gigs';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const EASE_EXPO = [0.16, 1, 0.3, 1];

const ServiceCategoryPage = () => {
  const { categorySlug } = useParams();
  const category = categories[categorySlug];

  if (!category) {
    return <Navigate to="/services" replace />;
  }

  const [selectedGig, setSelectedGig] = useState(null);
  const [activePackageTab, setActivePackageTab] = useState('basic');

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
        { question: 'Which platforms do you manage?', answer: 'We primarily manage Facebook, Instagram, LinkedIn, and Pinterest. We can also handle Twitter/X or TikTok depending on your custom needs.' },
        { question: 'How is the content approved?', answer: 'We create a content calendar draft for the entire month. We do not publish anything without your direct review and approval.' },
        { question: 'Do you run paid ads?', answer: 'Yes, we design the ad creatives and copy. Advanced campaign setup is available as an extra add-on.' }
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
        'Memorable vector logos: Unique corporate logos that establish instant client trust.',
        'Scrolling promotional posts: High CTR designs built to stand out on social media feeds.',
        'Print-ready files: Bleed-configured high-resolution flyer layouts and brochures.'
      ],
      process: [
        { title: 'Visual Intake & Moodboard', desc: 'Specify colors, typography styles, and reference visuals in your client form.' },
        { title: 'Draft Concepts Creation', desc: 'Our designers generate multiple custom concepts for your review and layout scaling.' },
        { title: 'Revision & Asset Export', desc: 'Refine your choice and receive editable vector source files (AI/EPS/SVG/PDF).' }
      ],
      faqs: [
        { question: 'What file formats do you deliver?', answer: 'We deliver AI, EPS, SVG, PDF, high-res PNG, and JPEG formats for all graphic design projects.' },
        { question: 'Do you use templates?', answer: 'No. Every design is custom created from scratch using premium visual layout software to ensure uniqueness.' },
        { question: 'How many revisions do I get?', answer: 'Revision counts vary by package. Basic packages include 2-3 revisions, while premium packages include up to 10 revisions.' }
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
        { question: 'Do you provide the raw footage?', answer: 'No, you must provide your raw video clips. We edit and enhance your footage.' },
        { question: 'What is the format?', answer: 'Delivered in standard 1280x720 or HD 1920x1080, optimized for YouTube or social media platforms.' },
        { question: 'Can you add captions?', answer: 'Yes, we include Alex Hormozi style text captions and subtitles in our video editing packages.' }
      ],
      seo: {
        title: 'Best Video Editing Service | Professional Video Production & Editing | CreatifyBD',
        description: 'CreatifyBD is the best video editing service provider offering professional video editing services including Reels editing, YouTube editing, promotional videos, and video production globally.',
        keywords: 'video editing service, video editing agency, best video editing service, professional video editing, video production company, YouTube video editing, Reels editing service, TikTok video editing, promotional video editing, video post production'
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
        { question: 'What technology do you use?', answer: 'We build websites using React for modern, fast, and SEO-optimized web applications with excellent performance.' },
        { question: 'Are websites mobile responsive?', answer: 'Yes, all our websites are fully responsive and optimized for desktop, tablet, and mobile devices.' },
        { question: 'Do you include SEO?', answer: 'Yes, we include proper SEO configurations including meta tags, schema markup, and semantic HTML structure.' }
      ],
      seo: {
        title: 'Best Web Design Agency | Professional Website Design & Development | CreatifyBD',
        description: 'CreatifyBD is the best web design agency offering professional website design services including landing pages, business websites, portfolio sites, and web development globally.',
        keywords: 'web design agency, website design service, best web design agency, professional website design, web development services, web design company, landing page design, business website design, portfolio website design, website development company, responsive web design, custom website design'
      }
    }
  };

  const details = categoryDetails[categorySlug] || {
    headline: category.name,
    subheadline: category.desc,
    benefits: [],
    process: [],
    seo: {},
    faqs: []
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": category.name,
    "name": details.headline,
    "description": details.subheadline,
    "provider": { "@type": "Organization", "name": "CreatifyBD", "url": "https://creatifybd.com" },
    "areaServed": "Global"
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://creatifybd.com" },
      { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://creatifybd.com/services" },
      { "@type": "ListItem", "position": 3, "name": category.name, "item": `https://creatifybd.com/services/${categorySlug}` }
    ]
  };

  const faqSchema = details.faqs && details.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": details.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
    }))
  } : null;

  const combinedSchema = faqSchema ? [serviceSchema, breadcrumbSchema, faqSchema] : [serviceSchema, breadcrumbSchema];

  return (
    <div className="category-landing-page">
      <SEO
        title={details.seo?.title || `${category.name} Services | CreatifyBD`}
        description={details.seo?.description || details.subheadline}
        keywords={details.seo?.keywords || `${categorySlug}, creatifybd services`}
        schema={combinedSchema}
      />

      <Navbar />

      {/* ── Hero ── */}
      <section className="scp-hero">
        <div className="scp-hero-inner">
          <motion.div
            className="scp-hero-icon"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: EASE_EXPO }}
          >
            {category.icon}
          </motion.div>

          <motion.h1
            className="scp-hero-title"
            initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.85, ease: EASE_EXPO, delay: 0.1 }}
          >
            {details.headline}
          </motion.h1>

          <motion.p
            className="scp-hero-desc"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE_EXPO, delay: 0.22 }}
          >
            {details.subheadline}
          </motion.p>

          <motion.div
            className="scp-hero-actions"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_EXPO, delay: 0.35 }}
          >
            <a href="#gigs-section" className="premium-btn">
              Explore Services <ArrowRight size={18} />
            </a>
            <Link to="/contact" className="premium-btn-outline">Free Consultation</Link>
          </motion.div>
        </div>
      </section>

      {/* ── Services / Gigs Grid ── */}
      <section id="gigs-section" className="scp-gigs-section">
        <div className="container">
          <motion.div
            className="section-header text-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: EASE_EXPO }}
          >
            <h2 className="section-h">
              Available <span className="red">{category.name}</span> Plans
            </h2>
            <p className="section-sub">
              Select a service package below to see deliverables, pricing options, and to get started immediately.
            </p>
          </motion.div>

          <div className="scp-gigs-grid">
            {categoryGigs.map((gig, idx) => (
              <motion.div
                key={gig.id}
                className="scp-gig-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, ease: EASE_EXPO, delay: idx * 0.08 }}
                onClick={() => { setSelectedGig(gig); setActivePackageTab('basic'); }}
              >
                <div className="scp-gig-badge">{gig.subcategory || 'Creative Service'}</div>
                <h3 className="scp-gig-title">{gig.shortTitle || gig.title}</h3>
                <p className="scp-gig-desc">{gig.overview}</p>

                <div className="scp-gig-rating">
                  <span style={{ color: '#FFB800' }}>★★★★★</span>
                  <span className="scp-rating-val">{gig.rating.toFixed(1)}</span>
                  <span className="scp-rating-count">({gig.reviewCount} reviews)</span>
                </div>

                <div className="scp-gig-footer">
                  <div className="scp-gig-price">
                    <span className="scp-price-lbl">Starting from</span>
                    <span className="scp-price-val">${gig.startingPrice}</span>
                  </div>
                  <button className="scp-gig-btn">
                    View Packages <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Custom plan CTA */}
          <div className="scp-custom-cta">
            <h3>Need a completely custom enterprise plan?</h3>
            <p>We build custom scale solutions and retainer structures for global client operations.</p>
            <Link to="/contact" className="premium-btn">
              Book a Free Consultation <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Gig Modal ── */}
      <AnimatePresence>
        {selectedGig && (
          <div className="scp-modal-overlay" onClick={() => setSelectedGig(null)}>
            <motion.div
              className="scp-modal"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.28, ease: EASE_EXPO }}
            >
              <button className="scp-modal-close" onClick={() => setSelectedGig(null)} aria-label="Close">
                &times;
              </button>

              <div className="scp-modal-header">
                <span className="scp-gig-badge" style={{ marginBottom: '0.5rem' }}>{selectedGig.subcategory}</span>
                <h2 className="scp-modal-title">{selectedGig.title}</h2>
                <div className="scp-modal-rating">
                  <span style={{ color: '#FFB800' }}>★★★★★</span>
                  <span className="scp-rating-val">{selectedGig.rating.toFixed(1)}</span>
                  <span className="scp-rating-count">({selectedGig.reviewCount} client reviews)</span>
                </div>
              </div>

              <div className="scp-modal-grid">
                {/* Left — details */}
                <div className="scp-modal-left">
                  <div>
                    <p className="scp-sec-label">Overview</p>
                    <p className="scp-sec-text">{selectedGig.description}</p>
                  </div>
                  <div>
                    <p className="scp-sec-label">Who Is This For?</p>
                    <p className="scp-sec-text">{selectedGig.whoIsThisFor}</p>
                  </div>
                  {selectedGig.industries && (
                    <div>
                      <p className="scp-sec-label">Recommended Industries</p>
                      <div className="scp-industries">
                        {selectedGig.industries.map((ind, i) => (
                          <span key={i} className="scp-industry-tag">{ind}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedGig.revisionPolicy && (
                    <div className="scp-revision-note">
                      <p className="scp-sec-label">Revision Policy</p>
                      <p className="scp-sec-text" style={{ fontStyle: 'italic', color: '#777' }}>{selectedGig.revisionPolicy}</p>
                    </div>
                  )}
                </div>

                {/* Right — packages */}
                <div className="scp-pkg-panel">
                  <div className="scp-pkg-tabs">
                    {Object.keys(selectedGig.packages).map((key) => (
                      <button
                        key={key}
                        className={`scp-pkg-tab ${activePackageTab === key ? 'active' : ''}`}
                        onClick={() => setActivePackageTab(key)}
                      >
                        {key.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  {(() => {
                    const pkg = selectedGig.packages[activePackageTab];
                    if (!pkg) return null;
                    return (
                      <>
                        <div className="scp-pkg-price">${pkg.price}</div>
                        <div className="scp-pkg-name">{pkg.name}</div>
                        {pkg.desc && <div className="scp-pkg-desc">{pkg.desc}</div>}
                        <div className="scp-pkg-meta">
                          <span>⏱ {pkg.deliveryTime} Days</span>
                          <span>↺ {pkg.revisions === 10 ? 'Unlimited' : `${pkg.revisions} Revisions`}</span>
                        </div>
                        <ul className="scp-pkg-features">
                          {pkg.deliverables.map((del, i) => (
                            <li key={i}><span className="scp-check">✓</span>{del}</li>
                          ))}
                        </ul>
                        <Link
                          to={`/contact?service=${encodeURIComponent(`${selectedGig.shortTitle || selectedGig.title} - ${pkg.name}`)}&message=${encodeURIComponent(`Hi CreatifyBD team, I want to order the "${pkg.name}" package ($${pkg.price}) for ${selectedGig.title}.`)}`}
                          className="scp-pkg-order-btn"
                          onClick={() => setSelectedGig(null)}
                        >
                          Select Package <ArrowRight size={16} />
                        </Link>
                      </>
                    );
                  })()}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Benefits / Why Us ── */}
      <section className="scp-benefits-section">
        <div className="container">
          <motion.div
            className="scp-benefits-grid"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.75, ease: EASE_EXPO }}
          >
            <div className="scp-benefits-text">
              <h2 className="section-h">Why Partner with Us for {category.name}?</h2>
              <p className="scp-benefits-intro">
                We provide premium creative agency standards at competitive production price rates,
                delivering Fiverr-like transparency and security.
              </p>
              <ul className="scp-benefits-list">
                {details.benefits.map((benefit, idx) => {
                  const [title, desc] = benefit.split(': ');
                  return (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.55, ease: EASE_EXPO, delay: idx * 0.08 }}
                    >
                      <CheckCircle2 size={20} className="scp-check-icon" />
                      <div>
                        <strong>{title}</strong>
                        {desc && <p>{desc}</p>}
                      </div>
                    </motion.li>
                  );
                })}
              </ul>
            </div>

            <div className="scp-advantage-card">
              <span className="scp-advantage-badge">CREATIFY AGENCY STANDARDS</span>
              <h4>Global Production Advantage</h4>
              <p>We run a structured remote production workflow with international quality standards for brands in global markets.</p>
              <div className="scp-advantage-bars">
                <div className="scp-bar"><span>International Quality</span><strong>100%</strong></div>
                <div className="scp-bar"><span>Manual verification trust</span><strong>100%</strong></div>
                <div className="scp-bar"><span>Pricing affordability</span><strong>Save 60%</strong></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Process ── */}
      <section className="scp-process-section">
        <div className="container">
          <motion.div
            className="section-header text-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: EASE_EXPO }}
          >
            <h2 className="section-h">Our Step-by-Step Delivery Process</h2>
            <p className="section-sub">A seamless order execution roadmap built to guarantee revision satisfaction.</p>
          </motion.div>

          <div className="scp-process-grid">
            {details.process.map((step, idx) => (
              <motion.div
                key={idx}
                className="scp-step-card"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.65, ease: EASE_EXPO, delay: idx * 0.12 }}
              >
                <div className="scp-step-num">0{idx + 1}</div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        /* ── Page Wrapper ───────────────────────────────────────── */
        .category-landing-page {
          background: var(--surface, #ffffff);
          color: var(--ink, #0f0f12);
        }

        /* ── Hero ──────────────────────────────────────────────── */
        .scp-hero {
          padding: 8rem 2rem 5rem;
          text-align: center;
          background: #ffffff;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          position: relative;
          overflow: hidden;
        }
        .scp-hero::before {
          content: '';
          position: absolute;
          width: 800px; height: 600px;
          border-radius: 50%;
          top: -250px; left: 50%;
          transform: translateX(-50%);
          background: radial-gradient(circle, rgba(232,25,44,0.05) 0%, transparent 65%);
          pointer-events: none;
        }
        .scp-hero-inner {
          position: relative;
          max-width: 760px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
        }
        .scp-hero-icon {
          width: 64px; height: 64px;
          border-radius: 18px;
          background: rgba(232, 25, 44, 0.06);
          border: 1px solid rgba(232, 25, 44, 0.12);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.75rem;
          color: var(--brand-red);
          margin-bottom: 0.25rem;
        }
        .scp-hero-title {
          font-size: clamp(1.85rem, 4.5vw, 3.2rem);
          font-weight: 900;
          line-height: 1.1;
          color: var(--ink, #0f0f12);
          letter-spacing: -0.03em;
          margin: 0;
        }
        .scp-hero-desc {
          font-size: clamp(0.93rem, 2vw, 1.08rem);
          color: var(--muted, #666);
          line-height: 1.7;
          max-width: 600px;
          margin: 0;
        }
        .scp-hero-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 0.5rem;
        }

        /* ── Gigs Section ─────────────────────────────────────── */
        .scp-gigs-section {
          padding: 5rem 2rem;
          background: #f7f8fa;
        }
        .scp-gigs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
          max-width: 1200px;
          margin: 2.5rem auto 0;
        }

        /* Gig card */
        .scp-gig-card {
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 16px;
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          min-height: 270px;
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s, border-color 0.25s;
        }
        .scp-gig-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(232,25,44,0.14);
          border-color: rgba(232,25,44,0.2);
        }
        .scp-gig-badge {
          background: rgba(232,25,44,0.08);
          color: var(--brand-red);
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 0.25rem 0.65rem;
          border-radius: 100px;
          align-self: flex-start;
          margin-bottom: 1rem;
        }
        .scp-gig-title {
          font-size: 1.08rem;
          font-weight: 800;
          color: var(--ink, #0f0f12);
          line-height: 1.3;
          margin: 0 0 0.5rem;
        }
        .scp-gig-desc {
          font-size: 0.82rem;
          color: var(--muted, #666);
          line-height: 1.55;
          flex: 1;
          margin: 0 0 1rem;
        }
        .scp-gig-rating {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          margin-bottom: 1.1rem;
          font-size: 0.9rem;
        }
        .scp-rating-val {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--ink, #0f0f12);
        }
        .scp-rating-count {
          font-size: 0.74rem;
          color: #999;
        }
        .scp-gig-footer {
          border-top: 1px solid rgba(0,0,0,0.06);
          padding-top: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .scp-gig-price {
          display: flex;
          flex-direction: column;
        }
        .scp-price-lbl {
          font-size: 0.62rem;
          color: #999;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.04em;
        }
        .scp-price-val {
          font-size: 1.2rem;
          font-weight: 900;
          color: var(--ink, #0f0f12);
        }
        .scp-gig-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.48rem 0.9rem;
          background: #f0f1f3;
          border: 1px solid rgba(0,0,0,0.07);
          color: var(--ink, #0f0f12);
          font-size: 0.76rem;
          font-weight: 700;
          border-radius: 100px;
          cursor: pointer;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
        }
        .scp-gig-card:hover .scp-gig-btn {
          background: var(--brand-red);
          border-color: var(--brand-red);
          color: #fff;
        }

        /* Custom CTA block */
        .scp-custom-cta {
          margin-top: 3.5rem;
          text-align: center;
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.06);
          padding: 2.5rem;
          border-radius: 16px;
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
        }
        .scp-custom-cta h3 {
          font-size: 1.2rem;
          color: var(--ink, #0f0f12);
          margin-bottom: 0.4rem;
          font-weight: 800;
        }
        .scp-custom-cta p {
          color: var(--muted, #666);
          font-size: 0.88rem;
          margin-bottom: 1.25rem;
        }
        .scp-custom-cta { margin-top: 3.5rem; }

        /* ── Modal ─────────────────────────────────────────────── */
        .scp-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10,10,15,0.6);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100005;
          padding: 1.5rem;
        }
        .scp-modal {
          background: #ffffff;
          width: 100%;
          max-width: 820px;
          border-radius: 20px;
          box-shadow: 0 30px 80px rgba(0,0,0,0.25);
          border: 1px solid rgba(0,0,0,0.06);
          position: relative;
          max-height: 90vh;
          overflow-y: auto;
        }
        .scp-modal-close {
          position: absolute;
          right: 1.25rem;
          top: 1.25rem;
          background: #f1f2f4;
          border: none;
          width: 34px; height: 34px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: #555;
          font-size: 1.4rem;
          line-height: 1;
          transition: background 0.2s, color 0.2s;
        }
        .scp-modal-close:hover { background: var(--brand-red); color: white; }
        .scp-modal-header {
          padding: 2rem 2rem 1.25rem;
          border-bottom: 1px solid rgba(0,0,0,0.06);
        }
        .scp-modal-title {
          font-size: 1.6rem;
          font-weight: 900;
          color: var(--ink, #0f0f12);
          margin: 0.35rem 2.5rem 0 0;
          letter-spacing: -0.02em;
        }
        .scp-modal-rating {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          margin-top: 0.4rem;
          font-size: 0.9rem;
        }
        .scp-modal-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 2rem;
          padding: 1.75rem 2rem 2rem;
        }
        .scp-modal-left {
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
        }
        .scp-sec-label {
          font-size: 0.68rem;
          font-weight: 800;
          color: var(--brand-red);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin: 0 0 0.3rem;
        }
        .scp-sec-text {
          font-size: 0.875rem;
          color: var(--ink, #333);
          line-height: 1.6;
          margin: 0;
        }
        .scp-industries {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-top: 0.35rem;
        }
        .scp-industry-tag {
          background: #f0f1f3;
          color: #555;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
        }
        .scp-revision-note {
          border-top: 1px solid rgba(0,0,0,0.06);
          padding-top: 1rem;
        }

        /* Package Panel */
        .scp-pkg-panel {
          background: #f7f8fa;
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 16px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          align-self: start;
          position: sticky;
          top: 1rem;
        }
        .scp-pkg-tabs {
          display: flex;
          background: #eef0f2;
          padding: 0.2rem;
          border-radius: 10px;
          margin-bottom: 1.1rem;
        }
        .scp-pkg-tab {
          flex: 1;
          background: transparent;
          border: none;
          padding: 0.52rem 0;
          font-size: 0.76rem;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
          color: #888;
          transition: background 0.2s, color 0.2s, box-shadow 0.2s;
          letter-spacing: 0.03em;
        }
        .scp-pkg-tab.active {
          background: #ffffff;
          color: var(--ink, #0f0f12);
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
        }
        .scp-pkg-price {
          font-size: 2.1rem;
          font-weight: 900;
          color: var(--ink, #0f0f12);
          letter-spacing: -0.04em;
          line-height: 1;
          margin-bottom: 0.2rem;
        }
        .scp-pkg-name {
          font-size: 1rem;
          font-weight: 800;
          color: var(--ink, #0f0f12);
          margin-bottom: 0.3rem;
        }
        .scp-pkg-desc {
          font-size: 0.8rem;
          color: var(--muted, #666);
          line-height: 1.5;
          margin-bottom: 0.9rem;
        }
        .scp-pkg-meta {
          display: flex;
          gap: 0.75rem;
          font-size: 0.74rem;
          color: var(--muted, #555);
          font-weight: 600;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          padding-bottom: 0.85rem;
          margin-bottom: 0.9rem;
          flex-wrap: wrap;
        }
        .scp-pkg-features {
          list-style: none;
          padding: 0;
          margin: 0 0 1.1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .scp-pkg-features li {
          font-size: 0.8rem;
          color: var(--ink, #333);
          display: flex;
          align-items: flex-start;
          gap: 0.45rem;
          line-height: 1.4;
        }
        .scp-check {
          color: var(--brand-red);
          font-weight: bold;
          flex-shrink: 0;
          line-height: 1.5;
        }
        .scp-pkg-order-btn {
          width: 100%;
          padding: 0.8rem;
          background: var(--brand-red);
          color: white;
          border: none;
          font-weight: 800;
          font-size: 0.875rem;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          box-shadow: 0 6px 20px rgba(232,25,44,0.22);
          text-decoration: none;
        }
        .scp-pkg-order-btn:hover {
          background: var(--brand-red-dark, #c01020);
          transform: translateY(-1px);
          box-shadow: 0 10px 24px rgba(232,25,44,0.3);
          color: white;
        }

        /* Modal responsive */
        @media (max-width: 768px) {
          .scp-modal-grid { grid-template-columns: 1fr; gap: 1.25rem; padding: 1.25rem; }
          .scp-modal-header { padding: 1.5rem 1.5rem 1rem; }
        }

        /* ── Benefits Section ─────────────────────────────────── */
        .scp-benefits-section {
          padding: 5rem 2rem;
          background: #ffffff;
          position: relative;
          overflow: hidden;
        }
        .scp-benefits-section::before {
          content: '';
          position: absolute;
          width: 600px; height: 500px;
          border-radius: 50%;
          top: -150px; right: -100px;
          background: radial-gradient(circle, rgba(232,25,44,0.04) 0%, transparent 65%);
          pointer-events: none;
        }
        .scp-benefits-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 4rem;
          max-width: 1200px;
          margin: 0 auto;
          align-items: center;
          position: relative;
        }
        .scp-benefits-text h2 {
          color: var(--ink, #0f0f12);
        }
        .scp-benefits-intro {
          color: var(--muted, #666);
          margin-bottom: 2rem;
          font-size: 1rem;
          line-height: 1.65;
        }
        .scp-benefits-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }
        .scp-benefits-list li {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }
        .scp-benefits-list li strong {
          color: var(--ink, #0f0f12);
          font-size: 0.95rem;
          display: block;
          margin-bottom: 0.15rem;
        }
        .scp-benefits-list li p {
          color: var(--muted, #666);
          font-size: 0.85rem;
          line-height: 1.5;
          margin: 0;
        }
        .scp-check-icon {
          color: var(--brand-red);
          flex-shrink: 0;
          margin-top: 0.1rem;
        }

        /* Advantage card */
        .scp-advantage-card {
          background: #f7f8fa;
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 16px;
          padding: 1.75rem;
          box-shadow: 0 6px 24px rgba(0,0,0,0.05);
          position: relative;
          overflow: hidden;
        }
        .scp-advantage-card::before {
          content: '';
          position: absolute;
          width: 180px; height: 180px;
          border-radius: 50%;
          top: -60px; right: -30px;
          background: radial-gradient(circle, rgba(232,25,44,0.06) 0%, transparent 65%);
          pointer-events: none;
        }
        .scp-advantage-badge {
          background: rgba(232,25,44,0.1);
          color: var(--brand-red);
          font-size: 0.65rem;
          font-weight: 700;
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
          display: inline-block;
          margin-bottom: 0.75rem;
          letter-spacing: 0.05em;
        }
        .scp-advantage-card h4 {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--ink, #0f0f12);
          margin: 0 0 0.4rem;
        }
        .scp-advantage-card > p {
          font-size: 0.83rem;
          color: var(--muted, #666);
          line-height: 1.55;
          margin: 0 0 1.25rem;
        }
        .scp-advantage-bars {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .scp-bar {
          display: flex;
          justify-content: space-between;
          padding: 0.65rem 0.85rem;
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 8px;
          font-size: 0.8rem;
        }
        .scp-bar span { color: var(--muted, #666); }
        .scp-bar strong { color: var(--brand-red); font-weight: 800; }

        /* ── Process Section ──────────────────────────────────── */
        .scp-process-section {
          padding: 5rem 2rem;
          background: #f7f8fa;
        }
        .scp-process-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          max-width: 1200px;
          margin: 3rem auto 0;
        }
        .scp-step-card {
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 14px;
          padding: 2rem 1.75rem;
          position: relative;
          overflow: hidden;
          transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
        }
        .scp-step-card::before {
          content: '';
          position: absolute;
          width: 180px; height: 180px;
          border-radius: 50%;
          top: -70px; right: -30px;
          background: radial-gradient(circle, rgba(232,25,44,0.04) 0%, transparent 65%);
          pointer-events: none;
        }
        .scp-step-card:hover {
          border-color: rgba(232,25,44,0.18);
          box-shadow: 0 8px 24px rgba(0,0,0,0.06);
          transform: translateY(-3px);
        }
        .scp-step-num {
          font-size: 2.5rem;
          font-weight: 900;
          color: rgba(0,0,0,0.04);
          position: absolute;
          top: 1rem;
          right: 1.25rem;
          letter-spacing: -0.04em;
          line-height: 1;
        }
        .scp-step-card h4 {
          font-size: 1.05rem;
          color: var(--ink, #0f0f12);
          font-weight: 800;
          margin: 0 0 0.6rem;
        }
        .scp-step-card p {
          font-size: 0.85rem;
          color: var(--muted, #666);
          line-height: 1.6;
          margin: 0;
        }

        /* ── Responsive ───────────────────────────────────────── */
        @media (max-width: 968px) {
          .scp-benefits-grid { grid-template-columns: 1fr; gap: 2.5rem; }
          .scp-process-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 640px) {
          .scp-hero { padding: 6.5rem 1.25rem 4rem; }
          .scp-gigs-grid { grid-template-columns: 1fr; }
          .scp-hero-actions { flex-direction: column; align-items: center; }
          .scp-process-grid { grid-template-columns: 1fr; }
          .scp-benefits-grid { gap: 2rem; }
        }
      `}</style>
    </div>
  );
};

export default ServiceCategoryPage;
