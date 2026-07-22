import React from 'react';
import { BarChart3, Palette, Video } from 'lucide-react';
import { TextReveal } from './MotionReveal';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';
import { globalizeCopy, stripLegacyMarkup } from '../utils/contentText';

const EASE_EXPO = [0.16, 1, 0.3, 1];

const pillars = [
  {
    icon: <BarChart3 size={22} />,
    title: 'Done-for-you social content',
    desc: 'Full-service monthly management — strategy, design, captions, and scheduling — so your brand stays active and building audiences while you run your business.',
    color: '#E8192C'
  },
  {
    icon: <Palette size={22} />,
    title: 'Brand identity that commands respect',
    desc: 'Visual identity that makes your business look established from day one — whether pitching investors, launching a product, or competing for international clients.',
    color: '#7C3AED'
  },
  {
    icon: <Video size={22} />,
    title: 'Video + web that converts',
    desc: 'High-impact video content and conversion-focused websites that turn first impressions into leads, and leads into loyal customers.',
    color: '#0EA5E9'
  }
];

const IntroBand = () => {
  const { content } = useSettings();
  const introContent = content?.intro_band || {};
  const introTitle = stripLegacyMarkup(globalizeCopy(
    introContent.title,
    'The creative team serious brands keep on retainer.'
  ));
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
