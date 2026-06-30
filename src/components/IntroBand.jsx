import React from 'react';
import { BarChart3, Palette, Video } from 'lucide-react';
import { TextReveal, StaggerReveal, StaggerChild, HoverTilt } from './MotionReveal';

const pillars = [
  {
    icon: <BarChart3 size={22} />,
    title: 'Monthly social media management',
    desc: 'Consistent calendars, post design, captions, scheduling, and reporting for small businesses.',
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
  return (
    <section className="intro-band-v2">
      <div className="container">
        <div className="intro-main">
          <TextReveal className="intro-title-v2">
            The creative services small businesses ask for most, packaged for reliable monthly execution
          </TextReveal>

          <StaggerReveal className="intro-pillars-v2" staggerDelay={0.13} delay={0.1}>
            {pillars.map((pillar) => (
              <StaggerChild key={pillar.title}>
                <HoverTilt>
                  <article className="pillar-v2">
                    <div className="pillar-icon-v2" style={{ '--pillar-color': pillar.color }}>
                      {pillar.icon}
                    </div>
                    <h4>{pillar.title}</h4>
                    <p>{pillar.desc}</p>
                  </article>
                </HoverTilt>
              </StaggerChild>
            ))}
          </StaggerReveal>
        </div>
      </div>
    </section>
  );
};

export default IntroBand;
