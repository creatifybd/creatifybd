import React, { useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { TextReveal, FadeReveal } from './MotionReveal';

const Process = ({ highlight = false, fullPage = false }) => {
  const { lang } = useLanguage();
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);
  
  const steps = [
    { num: '01', icon: '🔍', title: lang === 'bn' ? 'গবেষণা ও পরিকল্পনা' : 'Strategy & Planning', desc: lang === 'bn' ? 'আপনার ব্র্যান্ড এবং লক্ষ্য নিয়ে গভীর আলোচনা করে একটি মাস্টারপ্ল্যান তৈরি করি।' : 'We deep dive into your brand goals and user needs to create a bulletproof roadmap.' },
    { num: '02', icon: '🎨', title: lang === 'bn' ? 'সৃজনশীল ডিজাইন' : 'Creative Design', desc: lang === 'bn' ? 'আপনার আইডিয়াকে প্রিমিয়াম ভিউয়াল কনসেপ্ট এবং ইউআই ডিজাইনে রূপান্তর করি।' : 'We transform your ideas into high-fidelity premium visual concepts and UI designs.' },
    { num: '03', icon: '⚙️', title: lang === 'bn' ? 'নিখুঁত বাস্তবায়ন' : 'Expert Execution', desc: lang === 'bn' ? 'সঠিক পিক্সেল এবং উন্নত প্রযুক্তির মাধ্যমে প্রজেক্টটি জীবন্ত করে তুলি।' : 'We bring designs to life with pixel-perfect execution and high-performance development.' },
    { num: '04', icon: '🚀', title: lang === 'bn' ? 'লঞ্চ ও অপ্টিমাইজেশন' : 'Growth & Support', desc: lang === 'bn' ? 'প্রজেক্ট লঞ্চ করার পর নিয়মিত পারফরম্যান্স ট্র্যাক এবং ধারাবাহিক উন্নতি নিশ্চিত করি।' : 'We monitor results post-launch and continuously refine strategies for maximum ROI.' }
  ];

  return (
    <section className={`section process-section ${fullPage ? 'full-page-section' : ''}`} id="process" ref={containerRef}>
      <div className="container">
        {!fullPage && (
          <div className="process-header">
            <FadeReveal>
              <div className="eyebrow">{lang === 'bn' ? 'আমাদের কাজের পদ্ধতি' : 'Our Workflow'}</div>
            </FadeReveal>
            <TextReveal className="section-h">
              {lang === 'bn' ? 'আমাদের প্রসেস' : 'Our Simple Process'}
            </TextReveal>
            <FadeReveal delay={0.4}>
              <p className="section-sub">{lang === 'bn' ? 'একটি সুশৃঙ্খল পদ্ধতির মাধ্যমে আমরা আপনার স্বপ্নকে বাস্তবে রূপান্তর করি।' : 'A proven 4-step framework designed to deliver consistent, high-quality results.'}</p>
            </FadeReveal>
          </div>
        )}

        <div className="timeline-container">
          <div className="timeline-line"></div>
          <motion.div className="timeline-progress" style={{ scaleY }}></motion.div>
          
          <div className="timeline-steps">
            {steps.map((step, idx) => (
              <div key={idx} className="process-step-v2">
                <div className="process-content-v2">
                  <div className="step-num">{step.num}</div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
                <div className="process-icon-wrap">
                  {step.icon}
                </div>
                <div style={{ width: '45%' }}></div>
              </div>
            ))}
          </div>
        </div>

        {highlight && (
          <FadeReveal delay={0.8}>
            <div style={{ marginTop: '3rem', textAlign: 'center' }}>
              <Link to="/process" className="btn-red">
                {lang === 'bn' ? 'বিস্তারিত প্রসেস দেখুন →' : 'Explore Our Full Workflow →'}
              </Link>
            </div>
          </FadeReveal>
        )}
      </div>
    </section>
  );
};

export default Process;
