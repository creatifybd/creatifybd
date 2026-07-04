import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import { detailedCaseStudies } from '../../data/caseStudiesData';

const EASE_EXPO = [0.16, 1, 0.3, 1];
const curatedIds = new Set(Object.keys(detailedCaseStudies));

const CaseStudiesPage = () => {
  const [overrides, setOverrides] = useState({});

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'case_studies'), (snap) => {
      const map = {};
      snap.docs.forEach(d => { map[d.id] = { id: d.id, ...d.data() }; });
      setOverrides(map);
    }, () => setOverrides({}));
    return () => unsub();
  }, []);

  const studies = [
    ...Object.keys(detailedCaseStudies).map(id => ({ ...detailedCaseStudies[id], ...overrides[id], id })),
    ...Object.values(overrides).filter(o => !curatedIds.has(o.id))
  ].filter(s => !s.hidden);

  return (
    <div className="case-studies-page">
      <SEO
        title="Case Studies | CreatifyBD Creative Work"
        description="Explore CreatifyBD case studies across branding, digital marketing, and website design with challenges, strategy, and measurable results."
        keywords="creatifybd case studies, global creative case studies, digital marketing case study, creative agency results"
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "CreatifyBD Case Studies",
          "url": "https://creatifybd.com/case-studies"
        }}
      />
      <Navbar />
      <main>
        {/* ── Hero ── */}
        <section className="page-header page-header-light">
          <div className="container">
            <motion.div
              className="eyebrow"
              style={{ marginBottom: '1rem' }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE_EXPO, delay: 0 }}
            >
              Real Work, Real Results
            </motion.div>

            <motion.h1
              className="page-title"
              initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.85, ease: EASE_EXPO, delay: 0.08 }}
            >
              Case <span className="red">Studies</span>
            </motion.h1>

            <motion.p
              className="page-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: EASE_EXPO, delay: 0.2 }}
            >
              Strategic creative work explained through challenge, solution, and measurable outcomes.
            </motion.p>
          </div>
        </section>

        {/* ── Case Study Cards ── */}
        <section className="container" style={{ padding: '5rem 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {studies.map((study, idx) => (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, ease: EASE_EXPO, delay: Math.min(idx * 0.1, 0.4) }}
                whileHover={{ y: -6, transition: { duration: 0.3, ease: EASE_EXPO } }}
              >
                <Link
                  to={`/case-study/${study.id}`}
                  style={{
                    display: 'flex',
                    minHeight: '360px',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '2rem',
                    borderRadius: '20px',
                    background: `linear-gradient(145deg, ${study.color || '#111111'} 0%, rgba(10,10,10,0.88) 100%)`,
                    color: '#fff',
                    textDecoration: 'none',
                    overflow: 'hidden'
                  }}
                >
                  <div>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem' }}>
                      {study.category} / {study.year}
                    </div>
                    <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', lineHeight: 1.05, marginBottom: '1rem' }}>{study.title}</h2>
                    <p style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>{study.about}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }}>
                    {study.results.slice(0, 3).map((result) => (
                      <span key={result.label} style={{ border: '1px solid rgba(255,255,255,0.2)', borderRadius: '999px', padding: '0.5rem 0.8rem', fontSize: '0.8rem', fontWeight: 700 }}>
                        {result.val} {result.label}
                      </span>
                    ))}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CaseStudiesPage;
