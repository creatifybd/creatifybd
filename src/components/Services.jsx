import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import release from '../data/publishedRelease.json';
import OptimizedImage from './OptimizedImage';
import { formatBangla } from '../data/offers';

export default function Services({ fullPage = false }) {
  const Heading = fullPage ? 'h1' : 'h2';
  return <section className="cb-section cb-services" id="services"><div className="cb-container">
    <div className="cb-section-heading"><div><p className="cb-eyebrow">আমাদের সেবা</p><Heading>আপনার প্রয়োজন।<br /><span>আমাদের কাজের জায়গা।</span></Heading></div><p>নিয়মিত কনটেন্ট থেকে নতুন ওয়েবসাইট—<br />যে কাজটি প্রয়োজন, সেখান থেকেই শুরু করি।</p></div>
    <div className="cb-service-grid">{release.services.map((service, index) => <article key={service.id} className="cb-service-card">
      <Link to={`/services/${service.id}`} tabIndex={-1} aria-hidden="true"><OptimizedImage src={service.image} alt="" width={960} height={720} aspectRatio="4 / 3" /></Link>
      <div className="cb-service-copy"><span className="cb-service-number">{formatBangla(index + 1).padStart(2, '০')}</span><h3><Link to={`/services/${service.id}`}>{service.title}<ArrowUpRight size={21} /></Link></h3><p>{service.description}</p></div>
    </article>)}</div>
  </div></section>;
}
