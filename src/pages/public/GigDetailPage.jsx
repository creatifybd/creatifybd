import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate, Navigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import GigGallery from '../../components/GigGallery';
import PackageTabs from '../../components/PackageTabs';
import PackageComparison from '../../components/PackageComparison';
import GigCard from '../../components/GigCard';
import { getGigBySlug, gigs, categories } from '../../data/gigs';
import { db } from '../../firebase/config';
import { collection, query, where, getDocs, limit, doc, getDoc } from 'firebase/firestore';
import { 
  Star, 
  ChevronRight, 
  HelpCircle, 
  CheckCircle2, 
  MessageSquare, 
  ChevronDown, 
  User, 
  Globe, 
  AlertCircle 
} from 'lucide-react';

const GigDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const baseGig = getGigBySlug(slug);

  const [openFaq, setOpenFaq] = useState(null);
  const [deliveredWorks, setDeliveredWorks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loadingMedia, setLoadingMedia] = useState(true);
  const [gigOverrideLoading, setGigOverrideLoading] = useState(true);
  const [gigIsActive, setGigIsActive] = useState(true);
  const [gigOverride, setGigOverride] = useState({});
  const gig = useMemo(() => baseGig ? { ...baseGig, ...gigOverride } : null, [baseGig, gigOverride]);

  useEffect(() => {
    if (!baseGig) return;

    const fetchGigOverride = async () => {
      setGigOverrideLoading(true);
      try {
        const snap = await getDoc(doc(db, 'gig_overrides', baseGig.id));
        const override = snap.exists() ? snap.data() : {};
        setGigOverride(override);
        const active = snap.exists() && typeof snap.data().active === 'boolean'
          ? snap.data().active
          : baseGig.status === 'active';
        setGigIsActive(active);
      } catch (err) {
        console.error('Error fetching gig override:', err);
        setGigIsActive(baseGig.status === 'active');
      } finally {
        setGigOverrideLoading(false);
      }
    };

    fetchGigOverride();

    const fetchRelatedMedia = async () => {
      try {
        // Fetch delivered projects matching this gig slug
        const qProjects = query(
          collection(db, 'portfolio'),
          where('gigSlug', '==', baseGig.slug),
          limit(6)
        );
        const snapProjects = await getDocs(qProjects);
        const projects = snapProjects.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDeliveredWorks(projects);

        // Fetch approved reviews matching this gig ID
        const qReviews = query(
          collection(db, 'reviews'),
          where('gigId', '==', baseGig.id),
          where('status', '==', 'approved'),
          limit(10)
        );
        const snapReviews = await getDocs(qReviews);
        const revs = snapReviews.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setReviews(revs);
      } catch (err) {
        console.error('Error fetching gig content:', err);
      } finally {
        setLoadingMedia(false);
      }
    };

    fetchRelatedMedia();
  }, [baseGig]);

  if (!gig) {
    return <Navigate to="/gigs" replace />;
  }

  if (!gigOverrideLoading && !gigIsActive) {
    return <Navigate to="/gigs" replace />;
  }

  const handlePackageSelect = (tier) => {
    navigate(`/order/start/${gig.slug}?package=${tier}`);
  };

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  // Find 4 related services (exclude current gig, match category)
  const relatedGigs = gigs
    .filter(g => g.category === gig.category && g.id !== gig.id)
    .slice(0, 4);

  const categoryName = categories[gig.category]?.name || gig.category;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": gig.title,
    "alternateName": gig.shortTitle,
    "image": gig.galleryImages || [
      "https://images.unsplash.com/photo-1547658719-da2b81169b7a?q=80&w=1280"
    ],
    "description": gig.description,
    "category": categoryName,
    "brand": {
      "@type": "Organization",
      "name": "CreatifyBD",
      "url": "https://creatifybd.com"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://creatifybd.com/gigs/${gig.slug}`,
      "priceCurrency": "USD",
      "price": gig.startingPrice,
      "priceValidUntil": "2027-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "CreatifyBD",
        "url": "https://creatifybd.com"
      },
      "areaServed": [
        { "@type": "Country", "name": "United States" },
        { "@type": "Country", "name": "Canada" },
        { "@type": "Country", "name": "Australia" }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": gig.rating.toFixed(1),
      "bestRating": "5",
      "worstRating": "1",
      "reviewCount": gig.reviewCount
    }
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
        "name": "Gigs",
        "item": "https://creatifybd.com/gigs"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": categoryName,
        "item": `https://creatifybd.com/services/${gig.category}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": gig.shortTitle || gig.title,
        "item": `https://creatifybd.com/gigs/${gig.slug}`
      }
    ]
  };

  const combinedSchema = [productSchema, breadcrumbSchema];

  return (
    <div className="gig-detail-page">
      <SEO
        title={`${gig.shortTitle || gig.title} | Best ${categoryName} Service | CreatifyBD`}
        description={`${gig.overview} Hire the best ${categoryName.toLowerCase()} service at CreatifyBD. Premium ${gig.category} package starting at $${gig.startingPrice} USD for USA, Canada, and Australia brands.`}
        keywords={`${gig.tags.join(', ')}, ${categoryName.toLowerCase()} service, best ${categoryName.toLowerCase()} service, ${gig.category.toLowerCase()} agency, hire ${categoryName.toLowerCase()} expert, ${gig.category.toLowerCase()} USA, ${gig.category.toLowerCase()} Canada, ${gig.category.toLowerCase()} Australia, creative agency services, digital marketing services, professional ${categoryName.toLowerCase()}, affordable ${categoryName.toLowerCase()}, ${gig.category.toLowerCase()} packages, ${gig.category.toLowerCase()} for business, ${gig.category.toLowerCase()} for startups`}
        schema={combinedSchema}
      />

      <Navbar />

      {/* Breadcrumb Header */}
      <div className="breadcrumb-bar">
        <div className="container">
          <div className="breadcrumb-inner">
            <Link to="/">Home</Link>
            <ChevronRight size={14} />
            <Link to="/services">Services</Link>
            <ChevronRight size={14} />
            <Link to={`/services/${gig.category}`}>{categoryName}</Link>
            <ChevronRight size={14} />
            <span className="current-crumb">{gig.shortTitle}</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '3rem 1rem 6rem' }}>
        <div className="gig-detail-grid">
          
          {/* Left Column: Details */}
          <div className="gig-detail-main">
            <h1 className="gig-title-main">{gig.title}</h1>
            
            <div className="gig-rating-row-header">
              <div className="gig-badge-lbl">{gig.subcategory}</div>
              <div className="rating-wrap-lbl">
                <Star size={16} fill="var(--red)" stroke="var(--red)" />
                <strong>{gig.rating.toFixed(1)}</strong>
                <span>({gig.reviewCount} Reviews)</span>
              </div>
            </div>

            {/* Gallery */}
            <div style={{ margin: '2rem 0' }}>
              <GigGallery images={gig.galleryImages} />
            </div>

            {/* Overview & Description */}
            <div className="detail-card-text">
              <h3>Service Description</h3>
              <p className="description-p">{gig.description}</p>
            </div>

            <div className="detail-card-text">
              <h3>Who Is This Service For?</h3>
              <p className="who-p">{gig.whoIsThisFor}</p>
            </div>

            {/* Package Comparison Table */}
            <div style={{ margin: '3rem 0' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>Compare Packages</h3>
              <PackageComparison packages={gig.packages} />
            </div>

            {/* Requirements */}
            <div className="detail-card-text bg-dark-box">
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
                <AlertCircle size={22} className="red" />
                <h3 style={{ margin: 0 }}>Intake Requirements</h3>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                To start your project, you will be required to provide the following details in the onboarding screen:
              </p>
              <ul className="reqs-checklist">
                {gig.requirements.map((req, idx) => (
                  <li key={idx}>
                    <CheckCircle2 size={16} className="req-check-icon" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Delivered Project Showcase (Live Portfolio) */}
            {deliveredWorks.length > 0 && (
              <div className="detail-card-text">
                <h3>Delivered Works Showcase</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '2rem' }}>Check out sample works completed for clients under this service package:</p>
                <div className="delivered-grid">
                  {deliveredWorks.map((work) => (
                    <div key={work.id} className="delivered-work-card">
                      <div className="work-img-wrap">
                        <img src={work.imageUrl || work.image} alt={work.title} />
                      </div>
                      <div className="work-card-meta">
                        <h5>{work.title}</h5>
                        <span>{work.clientIndustry} • {work.clientCountry}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ Accordion */}
            <div className="detail-card-text">
              <h3>Frequently Asked Questions</h3>
              <div className="faq-accordion-wrapper">
                {gig.faqs.map((faq, idx) => (
                  <div key={idx} className={`faq-acc-item ${openFaq === idx ? 'open' : ''}`}>
                    <button 
                      type="button" 
                      className="faq-acc-header"
                      onClick={() => toggleFaq(idx)}
                      aria-expanded={openFaq === idx}
                    >
                      <HelpCircle size={18} className="faq-icon-acc" />
                      <span>{faq.question}</span>
                      <ChevronDown size={16} className="chevron-icon-acc" />
                    </button>
                    <div className="faq-acc-body">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews list */}
            <div className="detail-card-text">
              <h3>Client Feedback ({reviews.length > 0 ? reviews.length : gig.reviewCount})</h3>
              {reviews.length > 0 ? (
                <div className="reviews-list-block">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="review-item-card">
                      <div className="rev-header">
                        <div className="rev-avatar">
                          <User size={18} />
                        </div>
                        <div className="rev-meta">
                          <h5 className="rev-name">{rev.clientName}</h5>
                          <div className="rev-sub-meta">
                            <span className="rev-country"><Globe size={12} style={{ marginRight: '0.25rem' }} />{rev.country}</span>
                            <span className="bullet-sep">•</span>
                            <span className="rev-industry">{rev.businessType}</span>
                          </div>
                        </div>
                        <div className="rev-stars-box">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} size={14} fill="var(--red)" stroke="var(--red)" />
                          ))}
                        </div>
                      </div>
                      <p className="rev-content">{rev.reviewText}</p>
                      {rev.deliveredImageUrl && (
                        <div className="rev-delivered-sample-preview">
                          <img src={rev.deliveredImageUrl} alt="Delivered sample work preview" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-reviews-box">
                  <MessageSquare size={32} className="no-reviews-icon" />
                  <p>Reviews will appear here as orders are completed. All ratings are fully verified.</p>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Pricing Sidebar */}
          <div className="gig-detail-sidebar-col">
            <div className="sticky-sidebar-element">
              <PackageTabs packages={gig.packages} onSelect={handlePackageSelect} />
              
              <div className="order-trust-points">
                <CheckCircle2 size={16} className="check-icon-trust" />
                <span>Escrow Secured Manual Payments</span>
              </div>
              <div className="order-trust-points">
                <CheckCircle2 size={16} className="check-icon-trust" />
                <span>USA / Canada / Australia Compliant Delivery</span>
              </div>
              <div className="order-trust-points">
                <CheckCircle2 size={16} className="check-icon-trust" />
                <span>Full revision policy guidelines support</span>
              </div>
            </div>
          </div>

        </div>

        {/* Related Gigs */}
        {relatedGigs.length > 0 && (
          <div className="related-gigs-outer" style={{ marginTop: '6rem', paddingTop: '4rem', borderTop: '1px solid var(--border-soft)' }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '2.5rem' }}>Related Services</h3>
            <div className="gigs-grid-related">
              {relatedGigs.map(g => (
                <GigCard key={g.id} gig={g} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />

      <style>{`
        .breadcrumb-bar {
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          padding: 1rem 0;
          font-size: 0.85rem;
          margin-top: 90px;
        }

        @media (max-width: 1024px) {
          .breadcrumb-bar { margin-top: 80px; }
        }

        @media (max-width: 900px) {
          .breadcrumb-bar { margin-top: 64px; }
        }

        .breadcrumb-inner {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--muted);
        }

        .breadcrumb-inner a {
          color: var(--muted);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }

        .breadcrumb-inner a:hover {
          color: var(--brand-red);
        }

        .current-crumb {
          color: var(--ink);
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .gig-detail-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 4rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        @media (max-width: 968px) {
          .gig-detail-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
          .gig-detail-sidebar-col {
            order: -1;
          }
        }

        .gig-title-main {
          font-size: clamp(1.8rem, 4vw, 2.5rem);
          font-weight: 900;
          color: var(--ink);
          line-height: 1.2;
          margin-bottom: 1rem;
        }

        .gig-rating-row-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .gig-badge-lbl {
          background: var(--brand-red-soft);
          color: var(--brand-red);
          border: 1px solid var(--brand-red);
          padding: 0.3rem 0.8rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .rating-wrap-lbl {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.9rem;
        }

        .rating-wrap-lbl strong {
          color: var(--ink);
        }

        .rating-wrap-lbl span {
          color: var(--muted);
        }

        .detail-card-text {
          margin: 3rem 0;
        }

        .detail-card-text h3 {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 1.25rem;
        }

        .description-p, .who-p {
          color: var(--muted);
          font-size: 1rem;
          line-height: 1.6;
        }

        .bg-dark-box {
          background: var(--surface-soft);
          border: 1px solid var(--border);
          padding: 2rem;
          border-radius: 16px;
        }

        .reqs-checklist {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .reqs-checklist li {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          color: var(--muted);
          font-size: 0.95rem;
          line-height: 1.4;
        }

        .req-check-icon {
          color: var(--brand-red);
          flex-shrink: 0;
          margin-top: 0.1rem;
        }

        .faq-accordion-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .faq-acc-item {
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--surface);
          overflow: hidden;
          transition: all 0.2s;
        }

        .faq-acc-item.open {
          border-color: var(--brand-red);
          background: var(--surface);
        }

        .faq-acc-header {
          width: 100%;
          background: transparent;
          border: none;
          color: var(--ink);
          padding: 1.25rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          text-align: left;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: none;
        }

        .faq-icon-acc {
          color: var(--brand-red);
          flex-shrink: 0;
        }

        .chevron-icon-acc {
          margin-left: auto;
          color: var(--muted);
          transition: transform 0.2s;
        }

        .faq-acc-item.open .chevron-icon-acc {
          transform: rotate(180deg);
          color: var(--brand-red);
        }

        .faq-acc-body {
          padding: 0 1.5rem 1.5rem 3.25rem;
          display: none;
        }

        .faq-acc-item.open .faq-acc-body {
          display: block;
        }

        .faq-acc-body p {
          color: var(--muted);
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .sticky-sidebar-element {
          position: sticky;
          top: 110px;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .order-trust-points {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          color: var(--muted);
          font-size: 0.85rem;
          padding: 0.5rem 1rem;
          background: var(--surface-soft);
          border-radius: 8px;
          border: 1px solid var(--border);
        }

        .check-icon-trust {
          color: var(--success);
          flex-shrink: 0;
        }

        .gigs-grid-related {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 2rem;
        }

        .no-reviews-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          text-align: center;
          border: 1px dashed var(--border);
          border-radius: 12px;
          color: var(--muted);
        }

        .no-reviews-icon {
          margin-bottom: 1rem;
          color: var(--muted);
        }

        .no-reviews-box p {
          font-size: 0.85rem;
          max-width: 320px;
        }

        .delivered-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        @media (max-width: 600px) {
          .delivered-grid {
            grid-template-columns: 1fr;
          }
        }

        .delivered-work-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
        }

        .work-img-wrap {
          position: relative;
          padding-top: 60%;
          width: 100%;
          background: var(--surface-muted);
        }

        .work-img-wrap img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .work-card-meta {
          padding: 1rem;
        }

        .work-card-meta h5 {
          font-size: 0.95rem;
          color: var(--ink);
          margin-bottom: 0.25rem;
        }

        .work-card-meta span {
          font-size: 0.75rem;
          color: var(--muted);
        }

        /* Review Item Card Styles */
        .reviews-list-block {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .review-item-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.5rem;
        }

        .rev-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .rev-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--surface-soft);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--muted);
          border: 1px solid var(--border);
        }

        .rev-meta {
          display: flex;
          flex-direction: column;
        }

        .rev-name {
          font-size: 0.95rem;
          color: var(--ink);
          font-weight: 700;
        }

        .rev-sub-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: var(--muted);
        }

        .rev-country {
          display: flex;
          align-items: center;
        }

        .rev-stars-box {
          margin-left: auto;
          display: flex;
          gap: 0.1rem;
        }

        .rev-content {
          font-size: 0.9rem;
          color: var(--muted);
          line-height: 1.5;
        }

        .rev-delivered-sample-preview {
          margin-top: 1rem;
          max-width: 200px;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid var(--border);
        }

        .rev-delivered-sample-preview img {
          width: 100%;
          height: auto;
          display: block;
        }
      `}</style>
    </div>
  );
};

export default GigDetailPage;
