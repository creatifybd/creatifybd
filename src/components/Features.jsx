import React from 'react';
import { BarChart3, Clock3, Globe2, ShieldCheck } from 'lucide-react';
import { FadeReveal, StaggerReveal, StaggerChild, ScaleReveal, CountUp, SlideReveal } from './MotionReveal';
import { useSettings } from '../context/SettingsContext';
import { globalizeCopy, renderRichTitle } from '../utils/contentText';

const featureItems = [
  {
    icon: <Globe2 size={22} />,
    title: 'Built for international buyers',
    desc: 'Copy, visuals, formats, and offers are shaped for global audiences.'
  },
  {
    icon: <ShieldCheck size={22} />,
    title: 'Agency process, gig-style clarity',
    desc: 'Clear scope, milestones, revisions, and deliverables before work begins.'
  },
  {
    icon: <Clock3 size={22} />,
    title: 'Timezone-friendly production',
    desc: 'Async updates, organized reviews, and steady weekly progress without meetings overload.'
  },
  {
    icon: <BarChart3 size={22} />,
    title: 'Creative tied to business outcomes',
    desc: 'Content and design decisions are made around leads, trust, reach, and conversion.'
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
        { value: '100+', label: 'Projects delivered' },
        { value: '5.0*', label: 'Client rating target' },
        { value: '24h', label: 'Typical response window' }
      ];
  const badges = Array.isArray(featuresContent.badges) && featuresContent.badges.length
    ? featuresContent.badges
    : ['Social Media Management', 'Graphic Design', 'Video Editing', 'Digital Marketing', 'Website Design'];
  const title = globalizeCopy(featuresContent.title, 'Built for dependable growth.');
  const subtitle = globalizeCopy(
    featuresContent.subtitle,
    'Structured creative operations, international service standards, and dependable output for ambitious brands.'
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
