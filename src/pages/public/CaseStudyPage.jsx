import React, { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { db } from '../../firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import { detailedCaseStudies } from '../../data/caseStudiesData';

const CaseStudyPage = () => {
  const { slug } = useParams();
  const [override, setOverride] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'case_studies', slug), (snap) => {
      setOverride(snap.exists() ? snap.data() : null);
      setChecked(true);
    }, () => setChecked(true));
    return () => unsub();
  }, [slug]);

  const base = detailedCaseStudies[slug];
  const study = override ? { ...base, ...override, id: slug } : base;

  if (!study || study.hidden) {
    return <Navigate to="/case-studies" replace />;
  }

  return (
    <div className="case-study-page">
      <SEO
        title={`${study.title} | CreatifyBD Case Study`}
        description={`${study.client} case study by CreatifyBD: ${study.challenge}`}
        keywords={`${study.client}, ${study.category}, CreatifyBD case study, global creative agency`}
        type="article"
        schema={{
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": study.title,
          "author": {
            "@type": "Organization",
            "name": "CreatifyBD"
          },
          "publisher": {
            "@type": "Organization",
            "name": "CreatifyBD"
          },
          "mainEntityOfPage": `https://creatifybd.com/case-studies/${slug}`
        }}
      />
      <Navbar />
      <main>
        <section style={{ background: study.color || 'var(--surface-soft)', color: '#fff', padding: '9rem 0 5rem' }}>
          <div className="container">
            <Link to="/case-studies" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontWeight: 700 }}>
              Back to case studies
            </Link>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '3rem', alignItems: 'end', marginTop: '3rem' }}>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '1rem' }}>
                  {study.category} / {study.industry}
                </div>
                <h1 style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', lineHeight: 0.95, letterSpacing: '-0.04em', marginBottom: '1.5rem' }}>
                  {study.title}
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: '1.15rem', lineHeight: 1.7, maxWidth: '760px' }}>{study.about}</p>
              </div>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <Meta label="Client" value={study.client} />
                <Meta label="Year" value={study.year} />
                <Meta label="Duration" value={study.duration} />
              </div>
            </div>
          </div>
        </section>

        <section className="container" style={{ padding: '5rem 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
            {study.results.map((result) => (
              <div key={result.label} style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: '16px', padding: '2rem', background: '#fff' }}>
                <div style={{ color: 'var(--red)', fontSize: '2.6rem', fontWeight: 900, lineHeight: 1 }}>{result.val}</div>
                <div style={{ marginTop: '0.6rem', fontWeight: 700 }}>{result.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <ContentBlock title="Challenge" text={study.challenge} />
            <ContentBlock title="Solution" text={study.solution} />
          </div>

          <blockquote style={{ margin: '5rem 0 0', padding: '2rem', borderLeft: '4px solid var(--red)', background: 'rgba(232,25,44,0.06)', fontSize: '1.35rem', lineHeight: 1.6 }}>
            "{study.testimonial.text}"
            <footer style={{ marginTop: '1rem', fontSize: '0.95rem', fontWeight: 800 }}>
              {study.testimonial.author}, {study.testimonial.position}
            </footer>
          </blockquote>
        </section>
      </main>
      <Footer />
    </div>
  );
};

const Meta = ({ label, value }) => (
  <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '1rem' }}>
    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 800 }}>{label}</div>
    <div style={{ marginTop: '0.25rem', fontWeight: 800 }}>{value}</div>
  </div>
);

const ContentBlock = ({ title, text }) => (
  <article>
    <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{title}</h2>
    <p style={{ color: 'rgba(0,0,0,0.68)', lineHeight: 1.8, fontSize: '1rem' }}>{text}</p>
  </article>
);

export default CaseStudyPage;
