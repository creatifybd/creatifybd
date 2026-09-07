import React from 'react';
import { BarChart3, Palette, Video, ArrowUpRight, Sparkles } from 'lucide-react';
import { TextReveal } from './MotionReveal';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { globalizeCopy, stripLegacyMarkup } from '../utils/contentText';

const EASE_EXPO = [0.16, 1, 0.3, 1];

const pillars = [
  {
    icon: <BarChart3 size={24} />,
    tag: 'সোশ্যাল গ্রোথ',
    title: 'মাসিক সোশ্যাল মিডিয়া ম্যানেজমেন্ট',
    desc: 'নিয়মিত কনটেন্ট ক্যালেন্ডার, ট্রেন্ডিং পোস্টার ডিজাইন, ভাইরাল রিলস ও ক্যাপশন সহ ফুল পেজ ম্যানেজমেন্ট।',
    color: '#E8192C',
    link: '/services/social-media-management'
  },
  {
    icon: <Palette size={24} />,
    tag: 'ব্র্যান্ড ভিজ্যুয়াল',
    title: 'প্রিমিয়াম ব্র্যান্ডিং ও গ্রাফিক্স',
    desc: 'স্মার্ট লোগো, কমপ্লিট ব্র্যান্ড গাইডলাইন, প্যাকেজিং ডিজাইন এবং কনভার্সন-বান্ধব প্রমোশনাল ব্যানার।',
    color: '#8B5CF6',
    link: '/services/graphic-design'
  },
  {
    icon: <Video size={24} />,
    tag: 'ভিডিও ও ওয়েব',
    title: 'ভিডিও এডিটিং ও আধুনিক ওয়েবসাইট',
    desc: 'হাই-ইমপ্যাক্ট সেলস ভিডিও, শর্ট-ফর্ম রিলস এবং ফাস্ট-লোডিং কনভার্সন-ফোকাসড বিজনেস ওয়েবসাইট।',
    color: '#0EA5E9',
    link: '/services/video-editing'
  }
];

const IntroBand = () => {
  const { content } = useSettings();
  const introContent = content?.intro_band || {};
  const introTitle = stripLegacyMarkup(globalizeCopy(
    introContent.title,
    'ব্যবসা দ্রুত বড় করতে যা যা প্রয়োজন — সবকিছু এক ছাদের নিচে'
  ));

  return (
    <section className="intro-band-luxury" id="value-pillars">
      <div className="container">
        <div className="intro-header-wrap text-center">
          <span className="intro-eyebrow">
            <Sparkles size={14} className="text-red animate-pulse" />
            <span>আমাদের মূল সেবাসমূহ</span>
          </span>
          <TextReveal className="intro-title-luxury">
            {introTitle}
          </TextReveal>
          <p className="intro-subtitle-luxury">
            কোনো জটিলতা ছাড়া আপনার ব্র্যান্ডকে দিন প্রিমিয়াম ভিজ্যুয়াল প্রেজেন্স ও নিশ্চিত অডিয়েন্স গ্রোথ।
          </p>
        </div>

        <div className="intro-pillars-grid">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              className="intro-pillar-card"
              style={{ '--accent-color': pillar.color }}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, ease: EASE_EXPO, delay: index * 0.12 }}
              whileHover={{ y: -8, transition: { duration: 0.3, ease: EASE_EXPO } }}
            >
              <div className="pillar-top-row">
                <div className="pillar-icon-box" style={{ background: `${pillar.color}14`, color: pillar.color }}>
                  {pillar.icon}
                </div>
                <span className="pillar-tag">{pillar.tag}</span>
              </div>

              <h3 className="pillar-title">{pillar.title}</h3>
              <p className="pillar-desc">{pillar.desc}</p>

              <Link to={pillar.link} className="pillar-action-link">
                <span>বিস্তারিত দেখুন</span>
                <ArrowUpRight size={16} />
              </Link>

              <div className="pillar-bottom-glow" />
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        /* ═══════════════════════════════════════════════════════════
           CREATIFYBD — LUXURY INTRO BAND V3
           ═══════════════════════════════════════════════════════════ */
        .intro-band-luxury {
          padding: clamp(4rem, 6vw, 6rem) 0;
          background: #FAFAFC;
          position: relative;
          border-top: 1px solid #ECECF1;
          border-bottom: 1px solid #ECECF1;
        }

        .intro-header-wrap {
          max-width: 720px;
          margin: 0 auto 3.5rem;
        }

        .intro-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0.35rem 1rem;
          background: rgba(232, 25, 44, 0.07);
          border: 1px solid rgba(232, 25, 44, 0.18);
          border-radius: 100px;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--brand-red, #E8192C);
          margin-bottom: 1.25rem;
        }

        .intro-title-luxury {
          font-family: var(--font-display);
          font-size: clamp(2rem, 4.5vw, 3.25rem);
          font-weight: 800;
          line-height: 1.35;
          letter-spacing: 0;
          color: var(--ink, #0F0F12);
          margin-bottom: 1rem;
          overflow: visible;
        }

        .intro-subtitle-luxury {
          font-size: 1rem;
          color: var(--muted, #667085);
          line-height: 1.72;
          letter-spacing: 0;
          margin: 0 auto;
        }

        /* ── Grid ── */
        .intro-pillars-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.75rem;
        }

        .intro-pillar-card {
          position: relative;
          background: #ffffff;
          border: 1.5px solid #EBEBF0;
          border-radius: 24px;
          padding: 2.25rem 2rem;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease;
          overflow: hidden;
        }

        .intro-pillar-card:hover {
          border-color: var(--accent-color);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.08);
        }

        .pillar-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }

        .pillar-icon-box {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease;
        }

        .intro-pillar-card:hover .pillar-icon-box {
          transform: scale(1.08) rotate(-4deg);
        }

        .pillar-tag {
          font-size: 0.74rem;
          font-weight: 700;
          padding: 0.25rem 0.65rem;
          background: #F1F5F9;
          color: #475569;
          border-radius: 100px;
          letter-spacing: 0.02em;
        }

        .pillar-title {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--ink, #0F0F12);
          letter-spacing: 0;
          line-height: 1.38;
          margin: 0 0 0.85rem;
          overflow: visible;
          transition: color 0.2s ease;
        }

        .intro-pillar-card:hover .pillar-title {
          color: var(--accent-color);
        }

        .pillar-desc {
          font-size: 0.9rem;
          color: var(--muted, #667085);
          line-height: 1.7;
          margin: 0 0 1.75rem;
          flex: 1;
        }

        .pillar-action-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--ink, #0F0F12);
          text-decoration: none;
          transition: color 0.2s ease, transform 0.2s ease;
          width: fit-content;
        }

        .pillar-action-link:hover {
          color: var(--accent-color);
          transform: translateX(3px);
        }

        .pillar-bottom-glow {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--accent-color);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .intro-pillar-card:hover .pillar-bottom-glow {
          opacity: 1;
        }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .intro-pillars-grid {
            grid-template-columns: 1fr;
            max-width: 480px;
            margin: 0 auto;
            gap: 1.5rem;
          }
        }

        @media (max-width: 640px) {
          .intro-band-luxury {
            padding: 3.5rem 0;
          }
          .intro-header-wrap {
            margin-bottom: 2.5rem;
          }
          .intro-title-luxury {
            font-size: clamp(1.75rem, 7vw, 2.5rem);
          }
          .intro-pillar-card {
            padding: 1.75rem 1.5rem;
          }
        }
      `}</style>
    </section>
  );
};

export default IntroBand;
