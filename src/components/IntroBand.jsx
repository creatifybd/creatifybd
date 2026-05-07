import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { TextReveal, FadeReveal, StaggerReveal } from './MotionReveal';

const IntroBand = () => {
  const { lang } = useLanguage();

  return (
    <div className="intro-band-v2">
      <div className="container">
        <div className="intro-main">
          <TextReveal className="intro-title-v2">
            {lang === 'bn' 
              ? "সাধারণ মার্কেটিং বাদ দিন, শুরু করুন অসাধারণ কিছু" 
              : "Stop struggling with low visibility and start growing faster"}
          </TextReveal>
          
          <div className="intro-pillars-v2">
            <StaggerReveal>
              <div className="pillar-v2">
                <div className="pillar-icon-v2">💸</div>
                <FadeReveal delay={0.2}>
                  <h4>{lang === 'bn' ? 'সাশ্রয়ী বাজেট' : 'Affordable Pricing'}</h4>
                  <p>{lang === 'bn' ? 'পেশাদার মার্কেটিং আপনার বাজেটের মধ্যে। সঠিক রিটার্ন নিশ্চিত করুন।' : 'Professional marketing that fits within your budget. High ROI without burning your funds.'}</p>
                </FadeReveal>
              </div>
              <div className="pillar-v2">
                <div className="pillar-icon-v2">🎯</div>
                <FadeReveal delay={0.4}>
                  <h4>{lang === 'bn' ? 'কার্যকর ফলাফল' : 'Proven Local Results'}</h4>
                  <p>{lang === 'bn' ? 'বাংলাদেশি মার্কেটের গভীর জ্ঞান। এমন কৌশল যা বাস্তবে কাজ করে।' : 'Deep understanding of the Bangladeshi market. Strategies that actually work here.'}</p>
                </FadeReveal>
              </div>
              <div className="pillar-v2">
                <div className="pillar-icon-v2">🏠</div>
                <FadeReveal delay={0.6}>
                  <h4>{lang === 'bn' ? 'সব সমাধান এক জায়গায়' : 'One-Stop Agency'}</h4>
                  <p>{lang === 'bn' ? 'ব্র্যান্ডিং থেকে ওয়েব — আপনার সব ডিজিটাল প্রয়োজন এক বিশ্বস্ত পার্টনারের কাছে।' : 'Branding, social media, video, photography, web — all from one trusted partner.'}</p>
                </FadeReveal>
              </div>
            </StaggerReveal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroBand;
