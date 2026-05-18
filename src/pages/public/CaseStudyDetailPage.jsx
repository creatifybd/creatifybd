import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../../firebase/config';
import { doc, getDoc, collection, onSnapshot } from 'firebase/firestore';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import { useLanguage } from '../../context/LanguageContext';
import OptimizedImage from '../../components/OptimizedImage';
import '../../styles/CaseStudies.css';

const CaseStudyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [study, setStudy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudy = async () => {
      try {
        const docRef = doc(db, 'case_studies', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setStudy({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        console.error("Error fetching study:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudy();
  }, [id]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'case_study_images'), (snap) => {
      const imgMap = {};
      snap.docs.forEach(doc => { imgMap[doc.id] = doc.data(); });
      setImages(imgMap);
    });
    return () => unsub();
  }, []);

  if (loading) {
    return <div className="cs-error-page"><h2>Loading...</h2></div>;
  }

  if (!study) {
    return (
      <div className="cs-error-page">
        <h2>Project Not Found</h2>
        <Link to="/case-studies" className="btn-huge-dark">Back to Portfolio</Link>
      </div>
    );
  }

  const projectImages = images[id] || {};

  return (
    <div className="premium-cs-detail-page">
      <SEO 
        title={`${study.client} Case Study | Creatify BD`}
        description={study.about}
        keywords={`Creatify BD ${study.category}, digital marketing case study, ${study.client} project`}
        schema={{
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": `${study.client} - ${study.title}`,
          "description": study.about,
          "author": {
            "@type": "Organization",
            "name": "Creatify BD"
          }
        }}
      />
      <Navbar />

      <header className="cs-detail-hero">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="cs-detail-meta"
          >
            <span className="cs-meta-pill">{study.category}</span>
            <span className="cs-meta-pill">{study.year}</span>
            <span className="cs-meta-pill">{study.industry}</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="cs-detail-h1"
          >
            {study.client} — <br />
            <span style={{ color: study.color }}>{study.title}</span>
          </motion.h1>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="cs-detail-hero-visual"
        >
          {projectImages.heroUrl ? (
            <OptimizedImage 
              src={projectImages.heroUrl} 
              alt={study.client} 
              priority={true}
            />
          ) : (
            <div className="cs-placeholder-luxury">Strategic Vision</div>
          )}
        </motion.div>
      </header>

      <section className="cs-detail-narrative">
        <div className="container">
          <div className="cs-narrative-grid">
            <div className="cs-narrative-content">
              {study.about && (
                <div className="cs-narrative-block">
                  <span className="cs-label">About the Project</span>
                  <p className="cs-text-large">{study.about}</p>
                </div>
              )}
              {study.challenge && (
                <div className="cs-narrative-block">
                  <span className="cs-label">The Challenge</span>
                  <p>{study.challenge}</p>
                </div>
              )}
              {study.solution && (
                <div className="cs-narrative-block">
                  <span className="cs-label">Our Solution</span>
                  <p>{study.solution}</p>
                </div>
              )}
            </div>
            
            <div className="cs-detail-kpis">
              {study.results.map((res, i) => (
                <div key={i} className="cs-kpi-card" style={{ borderColor: `${study.color}20` }}>
                  <span className="cs-kpi-val" style={{ color: study.color }}>{res.val}</span>
                  <span className="cs-kpi-lab">{res.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="cs-detail-gallery">
        <div className="cs-gallery-masonry">
          {projectImages.mobileUrl && (
            <div className="cs-gallery-item mobile">
              <OptimizedImage src={projectImages.mobileUrl} alt="Mobile View" />
            </div>
          )}
          {projectImages.desktopUrl && (
            <div className="cs-gallery-item desktop">
              <OptimizedImage src={projectImages.desktopUrl} alt="Desktop View" />
            </div>
          )}
          {projectImages.brandingUrl && (
            <div className="cs-gallery-item branding">
              <OptimizedImage src={projectImages.brandingUrl} alt="Branding View" />
            </div>
          )}
        </div>
      </section>

      {study.testimonial && (
        <section className="cs-detail-testimonial">
          <div className="container">
            <blockquote className="cs-big-quote">
              "{study.testimonial.text}"
            </blockquote>
            <cite className="cs-quote-cite">
              <strong>{study.testimonial.author}</strong> — {study.testimonial.position}
            </cite>
          </div>
        </section>
      )}

      <footer className="cs-detail-footer">
        <div className="container">
          <span className="cs-label">Next Project</span>
          <h2 className="cs-footer-next">
            Ready to see more impact?
          </h2>
          <Link to="/case-studies" className="btn-huge-dark">View All Projects</Link>
        </div>
      </footer>

      <Footer />
    </div>
  );
};

export default CaseStudyDetailPage;

