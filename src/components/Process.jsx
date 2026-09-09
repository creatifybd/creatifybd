import React from 'react';
import { useSettings } from '../context/SettingsContext';
export default function Process({ fullPage = false }) {
  const { content } = useSettings();
  const Heading = fullPage ? 'h1' : 'h2';
  return <section className="cb-section" id="process"><div className="cb-container"><div className="cb-section-heading"><div><p className="cb-eyebrow">কাজের পদ্ধতি</p><Heading>{content.process.title}</Heading></div><p>{content.process.subtitle}</p></div><ol className="cb-process-list">{content.process.steps.map(step => <li key={step.num}><span aria-hidden="true">{step.num}</span><h3>{step.title}</h3><p>{step.desc}</p></li>)}</ol></div></section>;
}
