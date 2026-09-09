import React from 'react';
import { useSettings } from '../context/SettingsContext';
export default function AboutTrust() {
  const { content } = useSettings();
  const about = content.about_trust;
  return <section className="cb-section cb-about"><div className="cb-container cb-about-grid"><div className="cb-about-copy"><p className="cb-eyebrow">কাজের পেছনের মানুষ ও ভাবনা</p><h2>{about.title}</h2><p>{about.subtitle}</p></div><figure className="cb-founder-note"><blockquote>{about.ceo_quote}</blockquote><figcaption>{about.ceo_name}<span>{about.ceo_title}</span></figcaption></figure></div></section>;
}
