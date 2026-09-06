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
    title: 'মাসিক সোশ্যাল মিডিয়া ম্যানেজমেন্ট',
    desc: 'নিয়মিত কনটেন্ট ক্যালেন্ডার, নজরকাড়া পোস্ট ডিজাইন, ট্রেন্ডিং রিলস ও এনগেজিং ক্যাপশন।',
    color: '#E8192C'
  },
  {
    icon: <Palette size={22} />,
    title: 'প্রিমিয়াম ব্র্যান্ডিং ও গ্রাফিক্স',
    desc: 'স্মার্ট লোগো, কমপ্লিট ব্র্যান্ড গাইডলাইন, প্যাকেজিং ডিজাইন এবং কনভার্সন-বান্ধব অ্যাড ব্যানার।',
    color: '#7C3AED'
  },
  {
    icon: <Video size={22} />,
    title: 'ভিডিও এডিটিং ও আধুনিক ওয়েবসাইট',
    desc: 'হাই-ইমপ্যাক্ট প্রমোশনাল ভিডিও, শর্ট-ফর্ম রিলস এবং ফাস্ট-লোডিং সেলস-ফোকাসড ওয়েবসাইট।',
    color: '#0EA5E9'
  }
];

const IntroBand = () => {
  const { content } = useSettings();
  const introContent = content?.intro_band || {};
  const introTitle = stripLegacyMarkup(globalizeCopy(
    introContent.title,
    'ব্যবসা দ্রুত বড় করতে যা যা প্রয়োজন — সবকিছু এক ছাদের নিচে'
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
