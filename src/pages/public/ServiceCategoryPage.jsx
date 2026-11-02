import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowUpRight, Check } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import Pricing from '../../components/Pricing';
import Process from '../../components/Process';
import OptimizedImage from '../../components/OptimizedImage';
import NotFound from '../NotFound';
import release from '../../data/publishedRelease.json';
import { serviceDetails } from '../../data/serviceDetails';

export default function ServiceCategoryPage() {
  const { categorySlug } = useParams();
  const service = release.services.find(item => item.id === categorySlug);
  const details = serviceDetails[categorySlug];
  if (!service || !details) return <NotFound />;
  const examples = release.portfolio.filter(item => item.published !== false && details.categories.includes(item.category)).slice(0, 3);
  const schema = { '@context': 'https://schema.org', '@type': 'Service', name: service.title, description: service.description, serviceType: service.title, areaServed: { '@type': 'Country', name: 'Bangladesh' }, provider: { '@type': 'Organization', name: 'CreatifyBD', url: 'https://creatifybd.com' }, url: `https://creatifybd.com/services/${service.id}` };
  return <div className="cb-page"><SEO title={`${service.title} | CreatifyBD`} description={service.description} schema={schema} /><Navbar /><main id="main-content">
    <section className="cb-section"><div className="cb-container cb-service-detail"><div><p className="cb-eyebrow">আমাদের সেবা</p><h1>{service.title}</h1><p>{service.detail}</p><div className="cb-actions"><Link to={`/contact?service=${service.id}`} className="cb-button cb-button-red">এই কাজ নিয়ে কথা বলুন<ArrowUpRight size={18} /></Link><Link to={`/portfolio?category=${service.category}`} className="cb-text-link">কাজের নমুনা দেখুন</Link></div></div><OptimizedImage src={service.image} alt={`${service.title} কাজের ধারণামূলক উপস্থাপনা`} width={960} height={720} aspectRatio="4 / 3" priority /></div></section>
    <section className="cb-section cb-service-scope"><div className="cb-container"><div className="cb-section-heading"><h2>কাদের জন্য এই সেবা</h2><p>{details.audience}</p></div><ul className="cb-feature-list">{details.outcomes.map(item => <li key={item}><Check size={19} />{item}</li>)}</ul><h2>যেসব কাজ অন্তর্ভুক্ত করা যায়</h2><ul className="cb-feature-list">{service.deliverables.map(item => <li key={item}><Check size={19} />{item}</li>)}</ul><p>সব কাজ প্রতিটি প্রস্তাবে অন্তর্ভুক্ত নয়। আপনার প্রয়োজন অনুযায়ী চূড়ান্ত deliverable ও ফাইলের তালিকা লিখিতভাবে মিলিয়ে নেওয়া হবে।</p></div></section>
    <section className="cb-section"><div className="cb-container"><h2>শুরু করার আগে যা জানা দরকার</h2><div className="cb-values"><article><h3>আপনার কাছ থেকে প্রয়োজন</h3><p>{details.inputs}</p></article><article><h3>কাজের সীমা</h3><p>{details.limits}</p></article><article><h3>সময় ও অনুমোদন</h3><p>{details.timeline}</p></article></div><div className="cb-custom-work"><div><h3>মূল্য ও সংশোধন</h3><p>{details.pricing}</p><p>সংশোধনের পরিমাণ, নতুন কাজের মূল্য এবং payment schedule প্রস্তাবে লিখে নিন। <Link className="cb-text-link" to="/revision-policy">সংশোধনের নীতিমালা পড়ুন</Link></p></div></div></div></section>
    {examples.length > 0 && <section className="cb-section cb-service-scope"><div className="cb-container"><div className="cb-section-heading"><h2>এই ধরনের কাজের নমুনা</h2><Link to={`/portfolio?category=${service.category}`} className="cb-text-link">সম্পূর্ণ পোর্টফোলিও<ArrowUpRight size={18} /></Link></div><div className="cb-portfolio-grid">{examples.map(item => <article key={item.id} className="cb-work-card"><Link to={`/portfolio?category=${item.category}`}><OptimizedImage src={item.thumbnail || item.image} srcSet={item.srcSet} sizes="(max-width: 640px) 45vw, 30vw" alt={item.title} width={640} height={640} aspectRatio="1 / 1" /><div className="cb-work-meta"><h3>{item.title}</h3><p>{item.description}</p><small>{item.workType === 'concept' ? 'কনসেপ্ট ডিজাইন' : item.workType === 'client' ? 'ক্লায়েন্টের কাজ' : 'ডিজাইনের নমুনা'}</small></div></Link></article>)}</div></div></section>}
    {service.category === 'social' && <Pricing />}<Process />
    <section className="cb-section"><div className="cb-container"><div className="cb-section-heading"><h2>সাধারণ প্রশ্নের উত্তর</h2></div>{details.faqs.map(([question, answer]) => <details className="cb-comparison" key={question}><summary>{question}</summary><p>{answer}</p></details>)}<div className="cb-custom-work"><div><h3>আপনার কাজের কথা বলুন</h3><p>ব্যবসার ধরন, প্রয়োজনীয় কাজ ও সম্ভাব্য সময় জানালে আলোচনা শুরু করা সহজ হয়।</p></div><Link to={`/contact?service=${service.id}`} className="cb-button cb-button-red">প্রয়োজন জানান<ArrowUpRight size={18} /></Link></div></div></section>
  </main><Footer /></div>;
}
