import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { TextReveal, FadeReveal, StaggerReveal } from './MotionReveal';

const Services = ({ highlight = false, fullPage = false }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguage();

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'services'), (snap) => {
      const all = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const sorted = all.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      setServices(sorted.filter(s => !s.hidden));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const displayServices = highlight ? services.slice(0, 6) : services;

  if (loading && services.length === 0) return null;

  return (
    <section className={`section services-section ${fullPage ? 'full-page-section' : ''}`} id="services" style={{ background: '#fff' }}>
      <div className="container">
        {!fullPage && (
          <div className="services-header text-center" style={{ marginBottom: '6rem' }}>
            <FadeReveal>
              <div className="eyebrow" style={{ color: 'var(--red)', marginBottom: '1.5rem' }}>{lang === 'bn' ? 'আমরা যা অফার করি' : 'Our Expertise'}</div>
            </FadeReveal>
            <TextReveal className="section-h" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, color: '#000' }}>
              {lang === 'bn' ? 'সৃজনশীল পরিষেবা' : 'Design. Strategy. Growth.'}
            </TextReveal>
            <FadeReveal delay={0.4}>
              <p className="section-sub" style={{ color: 'rgba(0,0,0,0.6)', maxWidth: '600px', margin: '2rem auto' }}>
                {lang === 'bn' ? 'আপনার ব্র্যান্ডের প্রসারে আমরা দিচ্ছি আধুনিক ও কার্যকর ডিজিটাল সমাধান।' : 'We blend absolute creativity with strategic precision to scale your brand in the digital age.'}
              </p>
            </FadeReveal>
          </div>
        )}

        <StaggerReveal delay={0.5}>
          <div className="services-grid">
            {displayServices.map((s, idx) => (
              <FadeReveal key={s.id || idx}>
                <motion.div 
                  className="service-card-premium" 
                  whileHover={{ y: -12 }}
                >
                  <div className="service-icon">{s.icon}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                  
                  <div className="service-card-footer">
                    <span className="service-price">{s.price}</span>
                    <motion.div className="service-arrow">
                      <ArrowUpRight size={20} />
                    </motion.div>
                  </div>
                </motion.div>
              </FadeReveal>
            ))}
          </div>
        </StaggerReveal>


        {highlight && (
          <FadeReveal delay={0.8}>
            <div style={{ marginTop: '5rem', textAlign: 'center' }}>
              <a href="/services" className="btn-huge-red">
                {lang === 'bn' ? 'সব সার্ভিস দেখুন' : 'Explore All Services →'}
              </a>
            </div>
          </FadeReveal>
        )}
      </div>
    </section>
  );
};

export default Services;
