import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';
import { useLanguage } from '../../context/LanguageContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CustomCursor from '../../components/CustomCursor';
import OptimizedImage from '../../components/OptimizedImage';
import '../../styles/CaseStudies.css';
import SEO from '../../components/SEO';

const caseStudies = [
  {
    id: "graphic-design-apex",
    category: "Graphic Design",
    client: "Apex Streetwear",
    title: "Redefining Urban Visual Identity",
    results: [
      { val: "+120%", label: "Brand Recall" },
      { val: "Top 10", label: "Global Trends" }
    ],
    imageKey: "apex_hero",
    color: "#000000"
  },
  {
    id: "marketing-luxe",
    category: "Digital Marketing",
    client: "Luxe Real Estate",
    title: "400% Lead Growth via Targeted Funnels",
    results: [
      { val: "400%", label: "Lead Growth" },
      { val: "3.5x", label: "ROAS" }
    ],
    imageKey: "luxe_hero",
    color: "#D4AF37"
  },
  {
    id: "web-design-finflow",
    category: "Website Design",
    client: "FinFlow SaaS",
    title: "Crafting a High-Conversion SaaS Experience",
    results: [
      { val: "65%", label: "Conversion Lift" },
      { val: "0.8s", label: "Load Time" }
    ],
    imageKey: "finflow_hero",
    color: "#6366F1"
  },
  {
    id: "video-editing-velocity",
    category: "Video Editing",
    client: "Velocity Sports",
    title: "Cinematic Content: 2M+ Organic Views",
    results: [
      { val: "2.2M", label: "Organic Views" },
      { val: "85%", label: "Watch Time" }
    ],
    imageKey: "velocity_hero",
    color: "#E8192C"
  },
  {
    id: "branding-ecosphere",
    category: "Branding Design",
    client: "EcoSphere Tech",
    title: "Building a Sustainable Global Legacy",
    results: [
      { val: "Series B", label: "Funding Secured" },
      { val: "Global", label: "Impact Award" }
    ],
    imageKey: "ecosphere_hero",
    color: "#10B981"
  },
  {
    id: "marketing-nexus",
    category: "Digital Marketing",
    client: "Nexus E-commerce",
    title: "Scaling a Fashion Startup to $1M ARR",
    results: [
      { val: "$1M+", label: "Annual Revenue" },
      { val: "250k", label: "Active Users" }
    ],
    imageKey: "nexus_hero",
    color: "#EC4899"
  },
  {
    id: "web-design-quantum",
    category: "Website Design",
    client: "Quantum Robotics",
    title: "Futuristic Portal for Deep Tech Innovation",
    results: [
      { val: "92%", label: "Trust Index" },
      { val: "14", label: "Industry Awards" }
    ],
    imageKey: "quantum_hero",
    color: "#8B5CF6"
  },
  {
    id: "graphic-design-vibe",
    category: "Graphic Design",
    client: "Vibe Beverage Co.",
    title: "Minimalist Packaging for a Gen-Z Audience",
    results: [
      { val: "100%", label: "Retail Uptake" },
      { val: "50k", label: "Social Shares" }
    ],
    imageKey: "vibe_hero",
    color: "#F59E0B"
  }
];

const categories = ["All", "Graphic Design", "Digital Marketing", "Website Design", "Video Editing", "Branding Design"];

const CaseStudyCard = ({ study, image }) => {
  return (
    <Link to={`/case-study/${study.id}`} className="cs-card-wrapper">
      <motion.div 
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="cs-card-visual">
          <div className="cs-card-tag">{study.category}</div>
          <OptimizedImage 
            src={image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop'} 
            alt={study.title} 
            className="cs-card-img" 
          />
          <div className="cs-results-overlay">
            {study.results.map((res, i) => (
              <div key={i} className="cs-overlay-item">
                <span className="cs-overlay-val">{res.val}</span>
                <span className="cs-overlay-lab">{res.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="cs-card-info">
          <span className="cs-card-client">{study.client}</span>
          <h3 className="cs-card-title">{study.title}</h3>
        </div>
      </motion.div>
    </Link>
  );
};

const CaseStudiesPage = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [images, setImages] = useState({});
  const { lang } = useLanguage();

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'case_study_images'), (snap) => {
      const imgMap = {};
      snap.docs.forEach(doc => { imgMap[doc.id] = doc.data(); });
      setImages(imgMap);
    });
    return () => unsub();
  }, []);

  const filteredStudies = useMemo(() => {
    if (activeFilter === "All") return caseStudies;
    return caseStudies.filter(s => s.category === activeFilter);
  }, [activeFilter]);

  return (
    <div className="premium-cs-page">
      <CustomCursor />
      <SEO 
        title={lang === 'bn' ? 'সাফল্যের আখ্যান — কেস স্টাডিজ' : 'Our Case Studies | Strategic Impact & Creative Excellence'} 
        description="Discover how CreatifyBD delivers measurable growth for global brands through strategic design, performance marketing, and cutting-edge web experiences."
        keywords="case studies, web design portfolio, digital marketing results, branding success stories"
        url="https://creatify-bd.web.app/case-studies"
      />
      <Navbar />

      <header className="premium-cs-header">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="eyebrow" 
          style={{ color: 'var(--cs-accent)' }}
        >
          {lang === 'bn' ? 'নির্বাচিত কাজ' : 'Selected Impact'}
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="premium-cs-h1"
        >
          {lang === 'bn' ? 'সাফল্যের আখ্যান' : 'Real Results. Real Impact.'}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="premium-cs-sub"
        >
          {lang === 'bn' 
            ? 'আমরা কেবল ডিজাইন করি না, আমরা এমন ডিজিটাল অভিজ্ঞতা তৈরি করি যা ব্যবসার প্রবৃদ্ধি নিশ্চিত করে।' 
            : "We don't just create visuals; we engineer digital experiences that drive measurable growth and redefine industry standards."}
        </motion.p>

        <div className="cs-filter-scroll">
          <div className="cs-filter-bar">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-chip ${activeFilter === cat ? 'active' : ''}`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="premium-cs-grid">
        <AnimatePresence mode="popLayout">
          {filteredStudies.map((study) => (
            <CaseStudyCard 
              key={study.id} 
              study={study} 
              image={images[study.id]?.heroUrl} 
            />
          ))}
        </AnimatePresence>
      </div>

      <section className="premium-cs-cta">
        <h2 className="cs-cta-big">
          Ready to Scale <br />
          <span style={{ color: 'var(--cs-accent)' }}>Your Brand?</span>
        </h2>
        <a href="/contact" className="btn-huge-dark">
          {lang === 'bn' ? 'পরামর্শ শুরু করুন →' : 'Start Your Project →'}
        </a>
      </section>

      <Footer />
    </div>
  );
};

export default CaseStudiesPage;

