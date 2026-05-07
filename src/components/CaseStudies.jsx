import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot, query, where, limit } from 'firebase/firestore';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { TextReveal, ImageReveal, FadeReveal } from './MotionReveal';

const CaseStudies = ({ highlight = false }) => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguage();

  useEffect(() => {
    const q = query(collection(db, 'portfolio'), limit(10));
    const unsub = onSnapshot(q, (snap) => {
      const allItems = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCases(allItems.filter(item => item.hidden !== true).slice(0, 3));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading && cases.length === 0) return null;

  return (
    <section className="duck-cs-section" id="case-studies">
      <div className="container">
        <div className="cs-intro">
          <FadeReveal>
            <div className="eyebrow">
              {lang === 'bn' ? 'নির্বাচিত কেস স্টাডিজ' : 'Selected Case Studies'}
            </div>
          </FadeReveal>
          <TextReveal className="duck-h">
            {lang === 'bn' ? 'আমাদের সেরা কাজসমূহ' : 'Strategic Solutions'}
          </TextReveal>
        </div>

        <div className="duck-cs-list">
          {cases.map((project, index) => (
            <div 
              key={project.id}
              className={`duck-cs-item ${index % 2 !== 0 ? 'reverse' : ''}`}
            >
              <div className="duck-cs-info">
                <FadeReveal delay={0.2}>
                  <div className="duck-cs-num">0{index + 1}</div>
                </FadeReveal>
                
                <TextReveal className="duck-cs-title" delay={0.3}>
                  {(lang === 'bn' && project.title_bn) ? project.title_bn : project.title}
                </TextReveal>
                
                <FadeReveal delay={0.5}>
                  <div className="duck-cs-tags">
                    <span className="duck-tag">{project.category}</span>
                  </div>
                  <p className="duck-cs-desc">
                    {(lang === 'bn' && project.desc_bn) ? project.desc_bn : project.desc || 'Premium design solutions delivered with strategic thinking and creative excellence.'}
                  </p>
                  <Link to={`/work`} className="duck-cs-link" data-cursor="View">
                    {lang === 'bn' ? 'বিস্তারিত দেখুন' : 'Explore Case Study'} <ArrowRight size={20} />
                  </Link>
                </FadeReveal>
              </div>
              
              <div className="duck-cs-visual">
                <ImageReveal delay={0.4}>
                  <div className="duck-cs-img-wrap" style={{ overflow: 'hidden' }}>
                    <ParallaxImage src={project.imageUrl || project.image || project.imgUrl} alt={project.title} />
                  </div>
                </ImageReveal>
              </div>
            </div>
          ))}
        </div>

        {highlight && (
          <FadeReveal delay={0.6}>
            <div className="duck-cs-footer">
              <Link to="/work" className="btn-huge-red">
                {lang === 'bn' ? 'সবগুলো প্রজেক্ট দেখুন' : 'View All Projects'}
              </Link>
            </div>
          </FadeReveal>
        )}
      </div>
    </section>
  );
};

// Helper component for parallax effect
const ParallaxImage = ({ src, alt }) => {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  return (
    <motion.img 
      ref={ref}
      src={src || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop'} 
      alt={alt} 
      className="duck-cs-img" 
      style={{ y, scale: 1.2 }} 
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop';
      }}
    />
  );
};

export default CaseStudies;
