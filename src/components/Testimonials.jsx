import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { SlideReveal, StaggerReveal, StaggerChild } from './MotionReveal';

const FALLBACK = [
  {
    id: 'f1',
    name: 'Sarah Jenkins',
    role: 'CEO, Bloom Fashion',
    role_bn: 'সিইও, ব্লুম ফ্যাশন',
    text: 'CreatifyBD transformed our digital presence. Their attention to detail and creative vision helped us reach a global audience we never thought possible.',
    text_bn: 'ক্রিয়েটিফাইবিডি আমাদের ডিজিটাল উপস্থিতি পুরোপুরি বদলে দিয়েছে। তাদের সৃজনশীলতা এবং বিশদ মনোযোগ আমাদের আন্তর্জাতিক মঞ্চে নিয়ে গেছে।',
    stars: 5,
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop',
    tag: 'Branding & Web',
  },
  {
    id: 'f2',
    name: 'Rahat Ahmed',
    role: 'Founder, TechPulse BD',
    role_bn: 'ফাউন্ডার, টেকপালস বিডি',
    text: 'Working with them was a unique experience. The combination of professionalism and creativity in their work is truly outstanding.',
    text_bn: 'তাদের সাথে কাজ করাটা ছিল এক অনন্য অভিজ্ঞতা। প্রফেশনালিজম এবং ক্রিয়েটিভিটির এক অসাধারণ সমন্বয় তাদের কাজে ফুটে ওঠে।',
    stars: 5,
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop',
    tag: 'Social Media',
  },
  {
    id: 'f3',
    name: 'Nusrat Jahan',
    role: 'Director, Aroma Café',
    role_bn: 'ডিরেক্টর, অ্যারোমা ক্যাফে',
    text: 'Our brand identity went from zero to stunning in just 2 weeks. The portfolio they built for us gets compliments every single day.',
    text_bn: 'মাত্র ২ সপ্তাহে আমাদের ব্র্যান্ড আইডেন্টিটি শূন্য থেকে অসাধারণ হয়ে উঠেছে। প্রতিদিনই আমাদের পোর্টফোলিও নিয়ে প্রশংসা পাই।',
    stars: 5,
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop',
    tag: 'Branding',
  },
  {
    id: 'f4',
    name: 'Karim Hossain',
    role: 'CEO, GreenLeaf Ventures',
    role_bn: 'সিইও, গ্রিনলিফ ভেঞ্চারস',
    text: 'The video production quality blew us away. Our product launch video generated 50,000 views in the first week alone.',
    text_bn: 'ভিডিও প্রোডাকশনের মান আমাদের চমকে দিয়েছে। আমাদের পণ্য লঞ্চ ভিডিও প্রথম সপ্তাহেই ৫০,০০০ ভিউ পেয়েছে।',
    stars: 5,
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop',
    tag: 'Video Production',
  },
];

const StarRating = ({ count = 5 }) => (
  <div className="tm-stars">
    {Array.from({ length: count }).map((_, i) => (
      <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="var(--red)" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ))}
  </div>
);

const EASE_EXPO = [0.16, 1, 0.3, 1];

const TestimonialCard = ({ item, isActive, onClick, lang }) => (
  <motion.div
    layout
    className={`tm-card ${isActive ? 'tm-card--active' : ''}`}
    onClick={onClick}
    initial={{ opacity: 0, y: 32 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.7, ease: EASE_EXPO }}
    whileHover={{ y: -8, scale: 1.015, transition: { duration: 0.35, ease: EASE_EXPO } }}
  >
    <div className="tm-card-inner">
      <div className="tm-card-top">
        <div className="tm-avatar-wrap">
          <img
            src={item.imageUrl || `https://ui-avatars.com/api/?name=${item.name}&background=E8192C&color=fff`}
            alt={item.name}
            className="tm-avatar"
            loading="lazy"
          />
        </div>
        <div className="tm-card-meta">
          <div className="tm-name">{item.name}</div>
          <div className="tm-role">{lang === 'bn' && item.role_bn ? item.role_bn : item.role}</div>
        </div>
        {item.tag && <div className="tm-tag">{item.tag}</div>}
      </div>

      <StarRating count={item.stars || 5} />

      <blockquote className="tm-quote">
        "{lang === 'bn' && item.text_bn ? item.text_bn : item.text}"
      </blockquote>
    </div>
  </motion.div>
);

const Testimonials = () => {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(0);
  const { lang } = useLanguage();
  const intervalRef = useRef(null);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'testimonials'),
      (snap) => {
        if (!snap.empty) {
          setItems(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
      },
      () => {}
    );
    return () => unsub();
  }, []);

  const display = items.length > 0 ? items : FALLBACK;

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActive(prev => (prev + 1) % display.length);
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, [display.length]);

  const handleSelect = (idx) => {
    clearInterval(intervalRef.current);
    setActive(idx);
    intervalRef.current = setInterval(() => {
      setActive(prev => (prev + 1) % display.length);
    }, 5000);
  };

  const activeItem = display[active];

  return (
    <section className="tm-section" id="testimonials">
      <div className="tm-bg-glow" aria-hidden="true" />

      <div className="tm-inner">
        {/* ─── Left: Header + Featured Quote ─── */}
        <SlideReveal from="left">
          <div className="tm-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE_EXPO }}
            >
              <div className="tm-eyebrow">
                <span className="tm-eyebrow-dot" />
                {lang === 'bn' ? 'ক্লায়েন্ট রিভিউ' : 'Client Testimonials'}
              </div>

              <h2 className="tm-heading">
                {lang === 'bn'
                  ? <>বিশ্বাস ও<br /><span className="tm-heading-accent">সাফল্য।</span></>
                  : <>Trusted by<br /><span className="tm-heading-accent">Visionaries.</span></>
                }
              </h2>

              <p className="tm-subtext">
                {lang === 'bn'
                  ? 'আমাদের ক্লায়েন্টরাই আমাদের সেরা পরিচয়। তাদের সাফল্যের গল্প আমাদের অনুপ্রেরণা।'
                  : "Our clients' success stories are our greatest achievement. Real results, real impact."
                }
              </p>
            </motion.div>

            {/* Featured Active Quote */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem?.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.6, ease: EASE_EXPO }}
                className="tm-featured"
              >
                <div className="tm-featured-quote-icon">
                  <svg width="48" height="36" viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 36V22.5C0 9 8.1 2.1 24.3 0l1.8 3.6C17.1 5.7 12.6 10.2 11.7 18H21V36H0ZM27 36V22.5C27 9 35.1 2.1 51.3 0l1.8 3.6C44.1 5.7 39.6 10.2 38.7 18H48V36H27Z" fill="var(--red)" opacity="0.15"/>
                  </svg>
                </div>

                <blockquote className="tm-featured-quote">
                  {lang === 'bn' && activeItem?.text_bn ? activeItem.text_bn : activeItem?.text}
                </blockquote>

                <div className="tm-featured-author">
                  <img
                    src={activeItem?.imageUrl || `https://ui-avatars.com/api/?name=${activeItem?.name}&background=E8192C&color=fff`}
                    alt={activeItem?.name}
                    className="tm-featured-avatar"
                  />
                  <div>
                    <div className="tm-featured-name">{activeItem?.name}</div>
                    <div className="tm-featured-role">
                      {lang === 'bn' && activeItem?.role_bn ? activeItem.role_bn : activeItem?.role}
                    </div>
                    <StarRating count={activeItem?.stars || 5} />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Progress Dots */}
            <div className="tm-progress-dots">
              {display.map((_, i) => (
                <button
                  key={i}
                  className={`tm-dot ${active === i ? 'tm-dot--active' : ''}`}
                  onClick={() => handleSelect(i)}
                  aria-label={`View testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </SlideReveal>

        {/* ─── Right: Card Grid ─── */}
        <SlideReveal from="right" delay={0.15}>
          <div className="tm-right">
            <div className="tm-cards-grid">
              {display.map((item, i) => (
                <TestimonialCard
                  key={item.id}
                  item={item}
                  isActive={active === i}
                  onClick={() => handleSelect(i)}
                  lang={lang}
                />
              ))}
            </div>
          </div>
        </SlideReveal>
      </div>
    </section>
  );
};

export default Testimonials;
