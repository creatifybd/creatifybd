import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowUpRight, Check } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import Pricing from '../../components/Pricing';
import Process from '../../components/Process';
import OptimizedImage from '../../components/OptimizedImage';
import release from '../../data/publishedRelease.json';

export default function ServiceCategoryPage() {
  const { categorySlug } = useParams();
  const service = release.services.find(item => item.id === categorySlug);
  if (!service) return <Navigate to="/services" replace />;
  return <div className="cb-page"><SEO title={`${service.title} | CreatifyBD`} description={service.description} /><Navbar /><main id="main-content">
    <section className="cb-section"><div className="cb-container cb-service-detail"><div><p className="cb-eyebrow">আমাদের সেবা</p><h1>{service.title}</h1><p>{service.detail}</p><div className="cb-actions"><Link to={service.category === 'social' ? '/pricing' : `/contact?service=${service.id}`} className="cb-button cb-button-red">{service.category === 'social' ? 'মাসিক প্যাকেজ দেখুন' : 'এই কাজ নিয়ে কথা বলুন'}<ArrowUpRight size={18} /></Link><Link to={`/portfolio?category=${service.category}`} className="cb-text-link">কাজের নমুনা দেখুন</Link></div></div><OptimizedImage src={service.image} alt={`${service.title} কাজের ধারণামূলক উপস্থাপনা`} width={960} height={720} aspectRatio="4 / 3" priority /></div></section>
    <section className="cb-section cb-service-scope"><div className="cb-container"><h2>যেসব কাজে সাহায্য করি</h2><ul className="cb-feature-list">{service.deliverables.map(item => <li key={item}><Check size={19} />{item}</li>)}</ul><p>কাজের পরিমাণ, সময়সীমা, সংশোধন ও চূড়ান্ত ফাইলের তালিকা আপনার প্রয়োজন অনুযায়ী প্রস্তাবে উল্লেখ থাকবে।</p></div></section>
    {service.category === 'social' && <Pricing />}<Process />
  </main><Footer /></div>;
}
