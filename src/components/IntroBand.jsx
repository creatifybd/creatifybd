import React from 'react';
import { BarChart3, Palette, Video } from 'lucide-react';
import { TextReveal } from './MotionReveal';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';

const EASE_EXPO = [0.16, 1, 0.3, 1];

const pillars = [
  {
    icon: <BarChart3 size={22} />,
    title: 'Monthly social media management',
    desc: 'Consistent calendars, post design, captions, scheduling, and reporting for growing brands.',
    color: '#E8192C'
  },
  {
    icon: <Palette size={22} />,
    title: 'Brand-ready creative assets',
    desc: 'Graphic design, campaign visuals, ad creatives, and templates that keep your business polished.',
    color: '#7C3AED'
  },
  {
    icon: <Video size={22} />,
    title: 'Video, marketing, and websites',
    desc: 'Short-form video edits, digital marketing support, and conversion-focused website design.',
    color: '#0EA5E9'
  }
];

const IntroBand = () => {
  const { content } = useSettings();
  const introContent = content?.intro_band || {};
  const introTitle = introContent.title || 'The creative services ambitious brands ask for most, packaged for reliable monthly execution';
  const editablePillars = Array.isArray(introContent.pillars) && introContent.pillars.length
    ? introContent.pillars.map((item, index) => ({
        ...pillars[index % pillars.length],
        ...item
      }))
    : pillars;

  return (
    <section className="intro-band-v2">
      <div className="container">
        <div className="intro-main">
          <TextReveal className="intro-title-v2">
            {introTitle}
          </TextReveal>

          {/* Keep the native grid div — animate each article directly */}
          <div className="intro-pillars-v2">
            {editablePillars.map((pillar, index) => (
              <motion.article
                key={pillar.title}
                className="pillar-v2"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.75, ease: EASE_EXPO, delay: index * 0.13 }}
                whileHover={{ y: -10, transition: { duration: 0.3, ease: EASE_EXPO } }}
              >
                <div className="pillar-icon-v2" style={{ '--pillar-color': pillar.color }}>
                  {pillar.icon}
                </div>
                <h4>{pillar.title}</h4>
                <p>{pillar.desc}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroBand;
