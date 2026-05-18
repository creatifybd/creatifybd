import React from 'react';
import { useSettings } from '../context/SettingsContext';
import DOMPurify from 'dompurify';

const CTABand = () => {
  const { content } = useSettings();
  const ctaContent = content?.cta_band || {
    title: 'Ready to <span class="red">Grow</span> Your Business?',
    subtitle: 'Join 100+ businesses in Bangladesh that trust CreatifyBD with their digital growth.',
    primary_btn: 'Start a Project Today →',
    secondary_btn: '📞 +880 01951 676600',
    secondary_link: 'tel:+8801951676600'
  };

  const titleHtml = DOMPurify.sanitize(ctaContent.title, { ALLOWED_TAGS: ['span'], ALLOWED_ATTR: ['class'] });

  return (
    <section 
      className="cta-section"
      style={{
        position: 'relative',
        backgroundImage: ctaContent.cta_bg ? `url(${ctaContent.cta_bg})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {ctaContent.cta_bg && <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1 }}></div>}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <h2 dangerouslySetInnerHTML={{ __html: titleHtml }} />
        <p>{ctaContent.subtitle}</p>
        <div className="cta-actions">
          <a href="#contact" className="btn-white">{ctaContent.primary_btn}</a>
          <a href={ctaContent.secondary_link} className="btn-red-outline">{ctaContent.secondary_btn}</a>
        </div>
      </div>
    </section>
  );
};

export default CTABand;
