import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { FadeReveal } from './MotionReveal';

const Clients = () => {
  const { content } = useSettings();
  const clientsContent = content?.clients || {
    label: 'Trusted by brands in global markets',
    list: 'Maple & Co, Northstar Dental, Harbor Cafe, Green Eats, Nova Clothing, EduBridge, HealthPlus, CraftNest, ShopLocal, ByteWave, Riverside Resto, Summit Fitness'
  };
  const rawLabel = clientsContent.label || '';
  const safeLabel = /(bangladesh|dhaka|\bbd\b|small business|small businesses)/i.test(rawLabel)
    ? 'Trusted by brands in global markets'
    : rawLabel;

  const logos = clientsContent.list
    .split(',')
    .map(s => s.trim())
    .filter(s => s && !/(bangladesh|dhaka|\bbd\b)/i.test(s));
  const marqueeItems = logos.length ? logos : clientsContent.list.split(',').map(s => s.trim()).filter(Boolean);
  const seamlessItems = marqueeItems.length < 16
    ? Array.from({ length: Math.ceil(16 / Math.max(marqueeItems.length, 1)) }, () => marqueeItems).flat()
    : marqueeItems;

  return (
    <FadeReveal>
      <section className="clients-section" aria-label="Client trust">
        <FadeReveal delay={0.05}>
          <div className="clients-label">
            {safeLabel}
          </div>
        </FadeReveal>
        <div className="marquee-wrap">
          <div className="marquee-row">
            {[0, 1].map(group => (
              <div className="marquee-group" key={group} aria-hidden={group === 1}>
                {seamlessItems.map((logo, index) => (
                  <div key={`${group}-${logo}-${index}`} className="client-logo">{logo}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </FadeReveal>
  );
};

export default Clients;
