import React from 'react';
import { useSettings } from '../context/SettingsContext';
import DOMPurify from 'dompurify';

const Features = ({ theme = 'light' }) => {
  const { content } = useSettings();
  
  const fContent = content?.features || {
    eyebrow: 'Why CreatifyBD',
    title: 'Built for <span class="red">Bangladesh.</span><br />Built for Growth.',
    subtitle: "We're not just another agency. We understand the local market deeply and we're obsessed with your results.",
    stats: [
      { val: '100+', label: 'Projects Delivered' },
      { val: '6+', label: 'Core Services' },
      { val: '2x', label: 'Avg. Brand Growth' },
      { val: '5★', label: 'Client Rating' }
    ]
  };

  const titleHtml = DOMPurify.sanitize(fContent.title, { ALLOWED_TAGS: ['span', 'br'], ALLOWED_ATTR: ['class'] });

  const forcedTheme = 'light';

  return (
    <section className="section features-section" id="why">
      <div className="container">
        <div className="features-grid">
          <div>
            <div className="eyebrow sr">{fContent.eyebrow}</div>
            <h2 className="section-h sr sr-delay-1" dangerouslySetInnerHTML={{ __html: titleHtml }} />
            <p className="section-sub sr sr-delay-1" style={{ color: 'var(--section-subtext)' }}>{fContent.subtitle}</p>

            <div className="feature-list" style={{ marginTop: '2.5rem' }}>
              {fContent.items?.map((item, idx) => (
                <div key={idx} className={`feature-item sr ${idx > 0 ? `sr-delay-${idx}` : ''}`}>
                  <div className="feature-icon-wrap">{item.icon}</div>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="features-visual sr sr-delay-2">
            {fContent.features_visual ? (
              <img src={fContent.features_visual} alt="Features" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '24px' }} />
            ) : (
              <div className="feat-card-big">
                <h3>Trusted by <span>100+</span> businesses across Bangladesh</h3>
                <div className="feat-stats">
                  {fContent.stats?.map((stat, i) => (
                    <div key={i} className="feat-stat">
                      <div className="feat-stat-val">
                        {stat.val.replace(/[^0-9.]/g, '')}
                        <em>{stat.val.replace(/[0-9.]/g, '')}</em>
                      </div>
                      <div className="feat-stat-label">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <div className="badge-row">
                  <span className="badge hot">🔥 Social Media</span>
                  <span className="badge">Branding</span>
                  <span className="badge">Web Design</span>
                  <span className="badge hot">⚡ Fast Delivery</span>
                  <span className="badge">Photography</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
