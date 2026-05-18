import React, { useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { TextReveal, FadeReveal, StaggerReveal } from './MotionReveal';
import { useSettings } from '../context/SettingsContext';

const Process = ({ highlight = false, fullPage = false, theme = 'light' }) => {
  const { lang } = useLanguage();
  const { content } = useSettings();
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end end"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  const defaultSteps = [
    { num: '01', icon: '🔍', title: lang === 'bn' ? 'গবেষণা ও পরিকল্পনা' : 'Strategy & Planning', desc: lang === 'bn' ? 'আপনার ব্র্যান্ড এবং লক্ষ্য নিয়ে গভীর আলোচনা করে একটি মাস্টারপ্ল্যান তৈরি করি।' : 'We deep dive into your brand goals and user needs to create a bulletproof roadmap.' },
    { num: '02', icon: '🎨', title: lang === 'bn' ? 'সৃজনশীল ডিজাইন' : 'Creative Design', desc: lang === 'bn' ? 'আপনার আইডিয়াকে প্রিমিয়াম ভিউয়াল কনসেপ্ট এবং ইউআই ডিজাইনে রূপান্তর করি।' : 'We transform your ideas into high-fidelity premium visual concepts and UI designs.' },
    { num: '03', icon: '⚙️', title: lang === 'bn' ? 'নিখুঁত বাস্তবায়ন' : 'Expert Execution', desc: lang === 'bn' ? 'সঠিক পিক্সেল এবং উন্নত প্রযুক্তির মাধ্যমে প্রজেক্টটি জীবন্ত করে তুলি।' : 'We bring designs to life with pixel-perfect execution and high-performance development.' },
    { num: '04', icon: '🚀', title: lang === 'bn' ? 'লঞ্চ ও অপ্টিমাইজেশন' : 'Growth & Support', desc: lang === 'bn' ? 'প্রজেক্ট লঞ্চ করার পর নিয়মিত পারফরম্যান্স ট্র্যাক এবং ধারাবাহিক উন্নতি নিশ্চিত করি।' : 'We monitor results post-launch and continuously refine strategies for maximum ROI.' }
  ];

  const steps = content?.process?.steps?.length > 0 ? content.process.steps : defaultSteps;

  // Force light theme - dark theme disabled
  const forcedTheme = 'light';

  return (
    <section 
      className={`section process-section ${fullPage ? 'full-page-section' : ''}`} 
      id="process" 
      ref={containerRef}
    >
      <div className="container">
        {!fullPage && (
          <div className="process-header">
            <FadeReveal>
              <div className="eyebrow" style={{ color: 'var(--red)', marginBottom: '1.5rem' }}>{lang === 'bn' ? 'আমাদের কাজের পদ্ধতি' : 'Our Workflow'}</div>
            </FadeReveal>
            <TextReveal className="section-h">
              {content?.process?.title ? (
                <span dangerouslySetInnerHTML={{ __html: content.process.title }} />
              ) : (
                lang === 'bn' ? 'নিখুঁত প্রসেস' : 'The Path to Excellence.'
              )}
            </TextReveal>
            <FadeReveal delay={0.4}>
              <p className="section-sub" style={{ color: 'var(--section-subtext)' }}>
                {content?.process?.subtitle || (lang === 'bn' ? 'একটি সুশৃঙ্খল পদ্ধতির মাধ্যমে আমরা আপনার স্বপ্নকে বাস্তবে রূপান্তর করি।' : 'A proven 4-step framework designed to deliver consistent, high-end results with precision.')}
              </p>
            </FadeReveal>
          </div>
        )}


        <div className="timeline-container">
          {/* Animated Progress Line */}
          <div className="timeline-line"></div>
          <motion.div 
            className="timeline-progress" 
            style={{ 
              scaleY, 
              originY: 0,
            }}
          ></motion.div>
          
          <div className="timeline-steps">
            {steps.map((step, idx) => (
              <div key={idx} className={`process-step-v2 ${idx % 2 !== 0 ? 'reverse' : ''}`}>
                <div className="process-content-v2">
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className={`step-num ${idx % 2 !== 0 ? 'left' : 'right'}`}>{step.num}</div>
                    <h3 className="process-step-title">{step.title}</h3>
                    <p className="process-step-desc">{step.desc}</p>
                  </motion.div>
                </div>

                <motion.div 
                  className="process-icon-wrap" 
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                >
                  {step.icon}
                </motion.div>

                <div className="process-spacer"></div>
              </div>
            ))}
          </div>
        </div>

        {content?.process?.process_image && (
          <FadeReveal delay={0.6}>
            <div style={{ marginTop: '4rem', textAlign: 'center' }}>
              <img src={content.process.process_image} alt="Process Visual" style={{ width: '100%', maxWidth: '800px', borderRadius: '24px', objectFit: 'cover' }} />
            </div>
          </FadeReveal>
        )}

        {highlight && (
          <FadeReveal delay={0.8}>
            <div style={{ marginTop: '4rem', textAlign: 'center' }}>
              <Link to="/process" className="btn-huge-red">
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
