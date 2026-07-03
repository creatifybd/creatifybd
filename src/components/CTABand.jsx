import React from 'react';
  import { Link } from 'react-router-dom';
  import { PhoneCall } from 'lucide-react';
  import { siteConfig } from '../config/siteConfig';
  import { FadeReveal, MagneticWrap } from './MotionReveal';
  import { useSettings } from '../context/SettingsContext';
  import { globalizeCopy, renderRichTitle } from '../utils/contentText';

  const CTABand = () => {
    const { content } = useSettings();
    const cta = content?.cta_band || {};
    const title = globalizeCopy(cta.title, 'Ready to Grow Your Business?');
    const subtitle = globalizeCopy(
      cta.subtitle,
      'Tell us about your goals and we will recommend the right package, timeline, and first deliverables.'
    );

    return (
      <section className="cta-section">
        <div>
          <FadeReveal>
            <span className="eyebrow">{cta.eyebrow || 'Ready when you are'}</span>
          </FadeReveal>
          <FadeReveal delay={0.12}>
            <h2>{renderRichTitle(title, 'Ready to Grow Your Business?')}</h2>
          </FadeReveal>
          <FadeReveal delay={0.22}>
            <p>{subtitle}</p>
          </FadeReveal>
          <FadeReveal delay={0.32}>
            <div className="cta-actions">
              <MagneticWrap strength={0.28}>
                <Link to={cta.primary_link || '/contact'} className="btn-red">{cta.primary_btn || 'Start a Project'}</Link>
              </MagneticWrap>
              <a href={cta.secondary_link || `tel:${siteConfig.whatsappNumber}`} className="btn-outline-red"><PhoneCall size={16} /> {cta.secondary_btn || siteConfig.phone}</a>
            </div>
          </FadeReveal>
        </div>
      </section>
    );
  };

  export default CTABand;
