import React, { useEffect, useMemo, useState } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { detailedCaseStudies } from '../data/caseStudiesData';
import OptimizedImage from './OptimizedImage';
import { FadeReveal, SlideReveal, ImageReveal, StaggerReveal, StaggerChild, MagneticWrap } from './MotionReveal';

/* Premium creative/design images from Unsplash */
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1400&auto=format&fit=crop',   // Colorful brand design
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1400&auto=format&fit=crop',   // Design tools
  'https://images.unsplash.com/photo-1558655146-9f40138edfeb?q=80&w=1400&auto=format&fit=crop',   // Social media / device mockup
  'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1400&auto=format&fit=crop', // Video/motion
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1400&auto=format&fit=crop',  // Analytics
];

/* Proper readable fallback cases */
const FALLBACK_CASES = [
  {
    id: 'cs-1',
    title: 'Aurevia Skincare — Brand Identity',
    sector: 'E-commerce · Beauty',
    tagline: 'Designed a complete brand identity — logo, palette, packaging mockups, and social templates — that helped Aurevia secure shelf placement in 3 retail chains within 90 days.',
    results: ['+280%', 'Instagram reach'],
    image: FALLBACK_IMAGES[0],
  },
  {
    id: 'cs-2',
    title: 'NexoPay — SaaS Landing Page & Pitch Deck',
    sector: 'Fintech · SaaS',
    tagline: 'Built a high-converting landing page and investor pitch deck that helped NexoPay close their seed round and onboard their first 200 enterprise users.',
    results: ['$1.2M', 'Seed raise'],
    image: FALLBACK_IMAGES[1],
  },
  {
    id: 'cs-3',
    title: 'Harbor & Pine — Monthly Social Media',
    sector: 'Hospitality · Lifestyle',
    tagline: 'Managed 6 months of content calendars, post design, captions, and community management — growing their Instagram from 1.2k to 9.8k followers with no paid ads.',
    results: ['8.2×', 'Organic follower growth'],
    image: FALLBACK_IMAGES[2],
  },
];

const CaseStudies = () => {
  const [images, setImages]           = useState({});
  const [remoteCases, setRemoteCases] = useState([]);

  useEffect(() => {
    const unsubCases = onSnapshot(
      collection(db, 'case_studies'),
      (snap) => {
        try {
          const docs = Array.isArray(snap?.docs) ? snap.docs : [];
          const data = docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) =>
              (typeof b?.createdAt?.toMillis === 'function' ? b.createdAt.toMillis() : 0) -
              (typeof a?.createdAt?.toMillis === 'function' ? a.createdAt.toMillis() : 0)
            );
          setRemoteCases(data.slice(0, 3));
        } catch (err) {
          console.error('CaseStudies: failed to process case_studies snapshot, using fallback', err);
          setRemoteCases([]);
        }
      },
      () => setRemoteCases([])
    );

    const unsubImages = onSnapshot(
      collection(db, 'case_study_images'),
      (snap) => {
        try {
          const imgMap = {};
          const docs = Array.isArray(snap?.docs) ? snap.docs : [];
          docs.forEach(doc => { imgMap[doc.id] = doc.data(); });
          setImages(imgMap);
        } catch (err) {
          console.error('CaseStudies: failed to process case_study_images snapshot', err);
          setImages({});
        }
      },
      () => setImages({})
    );

    return () => { unsubCases(); unsubImages(); };
  }, []);

  const cases = useMemo(() => {
    if (remoteCases.length > 0) return remoteCases;
    return FALLBACK_CASES;
  }, [remoteCases]);

  return (
    <section className="cs-section" id="case-studies">
      <div className="container">
        {/* Header */}
        <div className="cs-header">
          <FadeReveal>
            <div className="eyebrow">Selected Work</div>
          </FadeReveal>
          <FadeReveal delay={0.1}>
            <h2 className="section-h cs-title">
              Creative work tied to<br />
              <span className="cs-title-red">measurable outcomes</span>
            </h2>
          </FadeReveal>
          <FadeReveal delay={0.2}>
            <p className="section-sub cs-sub">
              Every project starts with a business goal. Here's what we shipped and what it achieved.
            </p>
          </FadeReveal>
        </div>

        {/* Case study rows — alternating layout */}
        <div className="cs-list">
          {cases.map((project, index) => {
            const csImages  = images[project.id] || {};
            const heroImg   = csImages.heroUrl || csImages.resultUrl
              || project.image
              || project.fallbackImage
              || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
            const isReverse = index % 2 !== 0;
            // `results` can come in two shapes depending on where the data was written:
            //  - legacy/fallback: a flat 2-item array like ['+280%', 'Instagram reach']
            //  - admin panel (CaseStudiesManager.jsx): an array of { val, label } objects
            // Normalize both into a single { value, label } pair here so we never accidentally
            // render a raw object as a React child.
            const rawResults = project.results;
            let resultValue = null;
            let resultLabel = null;
            if (Array.isArray(rawResults) && rawResults.length > 0) {
              const first = rawResults[0];
              if (first && typeof first === 'object') {
                resultValue = first.val ?? null;
                resultLabel = first.label ?? null;
              } else if (typeof first === 'string' || typeof first === 'number') {
                resultValue = rawResults[0];
                resultLabel = typeof rawResults[1] === 'string' || typeof rawResults[1] === 'number' ? rawResults[1] : '';
              }
            }

            return (
              <article
                key={project.id}
                className={`cs-item ${isReverse ? 'cs-item--reverse' : ''}`}
              >
                {/* Copy side */}
                <SlideReveal from={isReverse ? 'right' : 'left'} delay={0.05} className="cs-copy">
                  <div className="cs-index">0{index + 1}</div>
                  <div className="cs-tags">
                    {project.sector && <span className="cs-tag">{project.sector}</span>}
                  </div>
                  <h3 className="cs-item-title">{project.title}</h3>
                  <p className="cs-item-desc">{project.tagline}</p>

                  {/* Result metric */}
                  {resultValue != null && resultValue !== '' && (
                    <div className="cs-result">
                      <TrendingUp size={14} />
                      <strong>{resultValue}</strong>
                      <span>{resultLabel}</span>
                    </div>
                  )}

                  <MagneticWrap strength={0.18}>
                    <Link to="/case-studies" className="cs-link">
                      Read Case Study <ArrowRight size={16} />
                    </Link>
                  </MagneticWrap>
                </SlideReveal>

                {/* Image side */}
                <SlideReveal from={isReverse ? 'left' : 'right'} delay={0.1} className="cs-media">
                  <div className="cs-img-frame">
                    <ImageReveal direction="up" delay={0.15}>
                      <OptimizedImage src={heroImg} alt={project.title} objectFit="cover" />
                    </ImageReveal>
                    {/* Floating stat badge */}
                    {resultValue != null && resultValue !== '' && (
                      <div className="cs-float-stat">
                        <strong>{resultValue}</strong>
                        <span>{resultLabel}</span>
                      </div>
                    )}
                  </div>
                </SlideReveal>
              </article>
            );
          })}
        </div>

        {/* Footer CTA */}
        <FadeReveal delay={0.3}>
          <div className="cs-footer">
            <MagneticWrap strength={0.15}>
              <Link to="/case-studies" className="btn-huge-red">
                View All Case Studies →
              </Link>
            </MagneticWrap>
          </div>
        </FadeReveal>
      </div>

      <style>{`
        .cs-section {
          padding: 7rem 0;
          background: var(--surface, #fafafa);
        }
        .cs-header {
          text-align: center;
          max-width: 680px;
          margin: 0 auto 5rem;
        }
        .cs-title { line-height: 1.1; }
        .cs-title-red { color: var(--brand-red, #e8192c); }
        .cs-sub { margin-top: 1rem; }

        /* Case study rows */
        .cs-list {
          display: flex;
          flex-direction: column;
          gap: 5rem;
        }
        .cs-item {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }
        .cs-item--reverse { direction: rtl; }
        .cs-item--reverse > * { direction: ltr; }

        /* Copy side */
        .cs-copy {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .cs-index {
          font-size: 4rem;
          font-weight: 900;
          color: #f0f0f4;
          letter-spacing: -0.04em;
          line-height: 1;
        }
        .cs-tags { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .cs-tag {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--brand-red, #e8192c);
          background: rgba(232,25,44,0.07);
          border: 1px solid rgba(232,25,44,0.15);
          border-radius: 100px;
          padding: 0.25rem 0.8rem;
        }
        .cs-item-title {
          font-size: clamp(1.35rem, 2.5vw, 1.75rem);
          font-weight: 800;
          color: var(--ink, #0f0f12);
          line-height: 1.2;
          letter-spacing: -0.025em;
          margin: 0;
        }
        .cs-item-desc {
          font-size: 0.95rem;
          color: var(--muted, #6b7280);
          line-height: 1.75;
          margin: 0;
        }
        .cs-result {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 100px;
          padding: 0.4rem 1rem;
          font-size: 0.82rem;
          color: #166534;
          width: fit-content;
        }
        .cs-result svg { color: #22c55e; flex-shrink: 0; }
        .cs-result strong { font-weight: 800; }
        .cs-link {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--brand-red, #e8192c);
          text-decoration: none;
          border-bottom: 1.5px solid rgba(232,25,44,0.25);
          padding-bottom: 2px;
          transition: border-color 0.2s ease, gap 0.2s ease;
          width: fit-content;
        }
        .cs-link:hover {
          border-color: var(--brand-red, #e8192c);
          gap: 0.7rem;
        }

        /* Image side */
        .cs-media { position: relative; }
        .cs-img-frame {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          aspect-ratio: 4/3;
          box-shadow:
            0 4px 6px rgba(0,0,0,0.04),
            0 24px 60px rgba(0,0,0,0.10);
          border: 1px solid #e5e7eb;
        }
        .cs-img-frame img,
        .cs-img-frame .opt-img { width: 100%; height: 100%; object-fit: cover; }
        .cs-float-stat {
          position: absolute;
          bottom: 16px; left: 16px;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.6);
          border-radius: 12px;
          padding: 0.65rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.12);
        }
        .cs-float-stat strong {
          font-size: 1.4rem;
          font-weight: 900;
          color: var(--brand-red, #e8192c);
          line-height: 1;
          letter-spacing: -0.03em;
        }
        .cs-float-stat span {
          font-size: 0.7rem;
          font-weight: 600;
          color: #6b7280;
        }

        /* Footer */
        .cs-footer {
          margin-top: 4rem;
          text-align: center;
        }

        @media (max-width: 900px) {
          .cs-item { grid-template-columns: 1fr; gap: 2.5rem; }
          .cs-item--reverse { direction: ltr; }
          .cs-index { font-size: 2.5rem; }
          .cs-section { padding: 5rem 0; }
          .cs-list { gap: 4rem; }
        }
      `}</style>
    </section>
  );
};

export default CaseStudies;
