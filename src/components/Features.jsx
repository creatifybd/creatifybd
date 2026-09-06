import React from 'react';
import { BarChart3, Clock3, Globe2, ShieldCheck } from 'lucide-react';
import { FadeReveal, StaggerReveal, StaggerChild, ScaleReveal, CountUp, SlideReveal } from './MotionReveal';
import { useSettings } from '../context/SettingsContext';
import { globalizeCopy, renderRichTitle } from '../utils/contentText';

const featureItems = [
  {
    icon: <Globe2 size={22} />,
    title: 'দেশীয় মার্কেট ও কাস্টমারের গভীর বোঝাপড়া',
    desc: 'বাংলাদেশের অডিয়েন্সের পছন্দ ও মনস্তত্ত্বের সাথে সামঞ্জস্য রেখে আধুনিক ক্রিয়েটিভ তৈরি করা।'
  },
  {
    icon: <ShieldCheck size={22} />,
    title: 'সুনির্দিষ্ট স্কোপ ও কাজের স্বচ্ছতা',
    desc: 'কাজ শুরুর আগেই ডেলিভারি টাইম, রিভিশন এবং ডেলিভারেবল সম্পর্কে স্পষ্ট গাইডলাইন।'
  },
  {
    icon: <Clock3 size={22} />,
    title: 'অন-টাইম ডেলিভারি ও দ্রুত রেসপন্স',
    desc: 'WhatsApp ও ইমেইলে নিয়মিত আপডেট—অযথা মিটিং ছাড়াই কাজের সর্বোচ্চ গতি নিশ্চিত।'
  },
  {
    icon: <BarChart3 size={22} />,
    title: 'রেজাল্ট ও কনভার্সন-ফোকাসড ডিজাইন',
    desc: 'শুধু সুন্দর ডিজাইন নয়, প্রতিটি ক্রিয়েটিভ তৈরি হয় আপনার সেলস ও রিচ বাড়ানোর লক্ষ্যে।'
  }
];

const Features = () => {
  const { content } = useSettings();
  const featuresContent = content?.features || {};
  const editableItems = Array.isArray(featuresContent.items) && featuresContent.items.length
    ? featuresContent.items.map((item, index) => {
        const fallback = featureItems[index % featureItems.length];
        return {
          ...fallback,
          ...item,
          title: globalizeCopy(item.title, fallback.title),
          desc: globalizeCopy(item.desc || item.description, fallback.desc)
        };
      })
    : featureItems;
  const visualStats = Array.isArray(featuresContent.stats) && featuresContent.stats.length
    ? featuresContent.stats
    : [
        { value: '২০০+', label: 'সফল প্রজেক্ট' },
        { value: '৪.৯★', label: 'ক্লায়েন্ট রেটিং' },
        { value: '২৪ঘণ্টা', label: 'দ্রুত রেসপন্স' }
      ];
  const badges = Array.isArray(featuresContent.badges) && featuresContent.badges.length
    ? featuresContent.badges
    : ['সোশ্যাল মিডিয়া ম্যানেজমেন্ট', 'ব্র্যান্ডিং ও গ্রাফিক্স', 'ভিডিও এডিটিং', 'ডিজিটাল মার্কেটিং', 'ওয়েবসাইট ডিজাইন'];
  const title = globalizeCopy(featuresContent.title, 'কেন গতানুগতিক এজেন্সির চেয়ে CreatifyBD আলাদা?');
  const subtitle = globalizeCopy(
    featuresContent.subtitle,
    'অভিজ্ঞ ডিজাইনার ও মার্কেটার, সুনির্দিষ্ট কাজের প্রসেস এবং সম্পূর্ণ স্বচ্ছ প্রাইসিং—সাশ্রয়ী বাজেটে প্রিমিয়াম আউটপুট।'
  );

  return (
    <section className="section features-section" id="why">
      <div className="container">
        <div className="features-grid">
          <SlideReveal from="left">
            <div>
              <FadeReveal delay={0.1}>
                <h2 className="section-h">{renderRichTitle(title)}</h2>
              </FadeReveal>
              <FadeReveal delay={0.2}>
                <p className="section-sub">{subtitle}</p>
              </FadeReveal>

              <StaggerReveal delay={0.3} stagger={0.1} className="feature-list">
                {editableItems.map((item) => (
                  <StaggerChild key={item.title}>
                    <div className="feature-item">
                      <div className="feature-icon-wrap">{item.icon}</div>
                      <div>
                        <h4>{item.title}</h4>
                        <p>{item.desc}</p>
                      </div>
                    </div>
                  </StaggerChild>
                ))}
              </StaggerReveal>
            </div>
          </SlideReveal>

          <SlideReveal from="right" delay={0.15}>
            <div className="features-visual">
              <ScaleReveal delay={0.25}>
                <div className="feat-card-big">
                  <h3>{featuresContent.visual_title || 'Creative operations built for recurring growth'}</h3>
                  <div className="feat-stats">
                    {visualStats.slice(0, 3).map((stat, index) => {
                      const statValue = stat.value || stat.val || '';
                      return (
                      <div className="feat-stat" key={`${statValue}-${stat.label}`}>
                        <div className="feat-stat-val">
                          {index === 0 && /^\d+\+$/.test(statValue)
                            ? <CountUp to={Number(statValue.replace('+', ''))} suffix="+" duration={2} />
                            : statValue
                          }
                        </div>
                        <div className="feat-stat-label">{stat.label}</div>
                      </div>
                      );
                    })}
                  </div>
                  <div className="badge-row">
                    {badges.map((badge, index) => (
                      <span className={`badge ${index === 0 ? 'hot' : ''}`} key={badge}>{badge}</span>
                    ))}
                  </div>
                </div>
              </ScaleReveal>
            </div>
          </SlideReveal>
        </div>
      </div>
    </section>
  );
};

export default Features;
