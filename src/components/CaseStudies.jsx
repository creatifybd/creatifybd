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

  // Show teaser section with CTA if no portfolio items in Firestore yet
  const showTeaser = !loading && cases.length === 0;

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

        {showTeaser ? (
          // Teaser cards when no Firestore items exist yet
          <FadeReveal delay={0.3}>
            <div className="cs-teaser-grid">
              {[
                { num: '01', client: 'NestNook', tag: 'Branding + Social Media', industry: 'Home Decor & Lifestyle', color: '#E8572A', bg: 'linear-gradient(135deg, #1a0a05, #2d1208)' },
                { num: '02', client: 'IronEdge Fitness', tag: 'Video Production + Ads', industry: 'Health & Fitness', color: '#0EA5E9', bg: 'linear-gradient(135deg, #020d14, #051a27)' },
                { num: '03', client: 'Zaraa Collections', tag: 'Complete Digital Overhaul', industry: 'Fashion & Apparel', color: '#D946EF', bg: 'linear-gradient(135deg, #0d0010, #1a0020)' },
              ].map((cs, i) => (
                <Link to="/case-studies" key={i} className="cs-teaser-card" style={{ background: cs.bg, borderColor: `${cs.color}30` }} data-cursor="View">
                  <div className="cs-teaser-num" style={{ color: cs.color }}>{cs.num}</div>
                  <div className="cs-teaser-tag" style={{ color: cs.color }}>{cs.tag}</div>
                  <div className="cs-teaser-name">{cs.client}</div>
                  <div className="cs-teaser-industry">{cs.industry}</div>
                  <div className="cs-teaser-cta" style={{ color: cs.color }}>{lang === 'bn' ? 'বিস্তারিত দেখুন →' : 'View Case Study →'}</div>
                </Link>
              ))}
            </div>
          </FadeReveal>
        ) : (
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
                    <Link to={`/case-studies`} className="duck-cs-link" data-cursor="View">
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
        )}

        <FadeReveal delay={0.6}>
          <div className="duck-cs-footer">
            <Link to="/case-studies" className="btn-huge-red">
              {lang === 'bn' ? 'সব কেস স্টাডি দেখুন' : 'View All Case Studies'}
            </Link>
          </div>
        </FadeReveal>
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
