import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { TextReveal, ImageReveal, FadeReveal } from './MotionReveal';
import OptimizedImage from './OptimizedImage';


const ParallaxImage = ({ src, alt }) => {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  return (
    <motion.div 
      ref={ref}
      className="duck-cs-img" 
      style={{ y, scale: 1.15 }} 
    >
      <OptimizedImage 
        src={src} 
        alt={alt} 
        objectFit="cover"
      />
    </motion.div>
  );
};

const CaseStudies = ({ theme = 'light' }) => {
  const [images, setImages] = useState({});
  const [masterpieces, setMasterpieces] = useState([]);
  const { lang } = useLanguage();

  useEffect(() => {
    const unsubCases = onSnapshot(collection(db, 'case_studies'), (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a,b) => (b.createdAt?.toMillis ? b.createdAt.toMillis() : 0) - (a.createdAt?.toMillis ? a.createdAt.toMillis() : 0));
      setMasterpieces(data.slice(0, 3));
    });
    const unsubImages = onSnapshot(collection(db, 'case_study_images'), (snap) => {
      const imgMap = {};
      snap.docs.forEach(doc => { imgMap[doc.id] = doc.data(); });
      setImages(imgMap);
    });
    return () => { unsubCases(); unsubImages(); };
  }, []);

  // Force light theme - dark theme disabled
  const forcedTheme = 'light';

  return (
    <section className="duck-cs-section" id="case-studies">

      <div className="container">
        <div className="cs-intro">
          <FadeReveal>
            <div className="eyebrow">{lang === 'bn' ? 'নির্বাচিত কেস স্টাডিজ' : 'Selected Case Studies'}</div>
          </FadeReveal>
          <TextReveal className="duck-h section-h">
            {lang === 'bn' ? 'কৌশলগত সমাধান' : 'Strategic Narratives.'}
          </TextReveal>
        </div>

        <div className="duck-cs-list">
          {masterpieces.map((project, index) => {
            const csImages = images[project.id] || {};
            const heroImg = csImages.heroUrl || csImages.resultUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop';
            const isReversed = index % 2 !== 0;
            
            return (
              <div 
                key={project.id} 
                className={`duck-cs-item ${isReversed ? 'reverse' : ''}`}
              >
                <div className="duck-cs-info">
                  <FadeReveal delay={0.2}>
                    <div className="duck-cs-num">0{index + 1}</div>
                  </FadeReveal>
                  <TextReveal className="duck-cs-title" delay={0.3}>
                    {project.title}
                  </TextReveal>
                  <FadeReveal delay={0.5}>
                    <div className="duck-cs-tags">
                      {project.sector && <span className="duck-tag">{project.sector}</span>}
                    </div>
                    <p className="duck-cs-desc">
                      {project.tagline}
                    </p>
                    <Link to="/case-studies" className="duck-cs-link">
                      {lang === 'bn' ? 'বিস্তারিত দেখুন' : 'Explore Masterpiece'} <ArrowRight size={18} />
                    </Link>
                  </FadeReveal>
                </div>
                <div className="duck-cs-visual">
                  <ImageReveal delay={0.2}>
                    <div className="duck-cs-img-wrap">
                      <ParallaxImage src={heroImg} alt={project.title} />
                    </div>
                  </ImageReveal>
                </div>
              </div>
            );
          })}
        </div>

        <FadeReveal delay={0.6}>
          <div className="duck-cs-footer">
            <Link to="/case-studies" className="btn-huge-red">
              {lang === 'bn' ? 'সব কেস স্টাডি দেখুন' : 'View All 10 Case Studies →'}
            </Link>
          </div>
        </FadeReveal>
      </div>
    </section>

  );
};

export default CaseStudies;
