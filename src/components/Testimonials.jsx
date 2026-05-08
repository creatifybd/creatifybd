import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote } from 'lucide-react';
import { TextReveal, FadeReveal, ImageReveal } from './MotionReveal';
import OptimizedImage from './OptimizedImage';

const fallbackItems = [
  {
    id: 'f1',
    name: 'Sarah Jenkins',
    role: 'CEO, Bloom Fashion',
    text: 'CreatifyBD transformed our digital presence. Their attention to detail and creative vision helped us reach a global audience we never thought possible.',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'f2',
    name: 'Rahat Ahmed',
    role: 'Founder, TechPulse BD',
    text: 'তাদের সাথে কাজ করাটা ছিল এক অনন্য অভিজ্ঞতা। প্রফেশনালিজম এবং ক্রিয়েটিভিটির এক অসাধারণ সমন্বয় তাদের কাজে ফুটে ওঠে।',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop'
  }
];

const Testimonials = () => {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(0);
  const { lang } = useLanguage();

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'testimonials'), (snap) => {
      if (!snap.empty) {
        setItems(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    });
    return () => unsub();
  }, []);

  const displayItems = items.length > 0 ? items : fallbackItems;

  return (
    <section className="section testimonials-editorial" id="testimonials">
      <div className="container">

        <div className="editorial-header">
          <FadeReveal>
            <div className="eyebrow" style={{ color: 'var(--red)', marginBottom: '1.5rem' }}>{lang === 'bn' ? 'আমাদের ক্লায়েন্টদের কথা' : 'Voices of Success'}</div>
          </FadeReveal>
          <TextReveal className="section-h">
            {lang === 'bn' ? 'বিশ্বাস ও ফলাফল' : 'Trusted by the Visionaries.'}
          </TextReveal>
        </div>

        <div className="editorial-content">
          <AnimatePresence mode="wait">
            <motion.div 
              key={active}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="editorial-slide"
            >
              <div className="editorial-quote-box">
                <Quote size={60} className="editorial-quote-icon" />
                <h2 className="editorial-quote-text">
                  "{displayItems[active]?.text}"
                </h2>
                
                <div className="editorial-author">
                  <div className="author-line"></div>
                  <div>
                    <div className="author-name">{displayItems[active]?.name}</div>
                    <div className="author-role">
                      {displayItems[active]?.role}
                    </div>
                  </div>
                </div>
              </div>

              <div className="editorial-visual">
                <div className="editorial-img-wrap">
                  <OptimizedImage 
                    src={displayItems[active]?.imageUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop'} 
                    alt={displayItems[active]?.name} 
                    className="editorial-img"
                  />
                  <div className="editorial-img-overlay"></div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="editorial-nav">
            {displayItems.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setActive(i)}
                className={`editorial-nav-dot ${active === i ? 'active' : ''}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>

  );
};

export default Testimonials;
