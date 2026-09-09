import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Portfolio from '../components/Portfolio';
import Pricing from '../components/Pricing';
import Services from '../components/Services';
import Process from '../components/Process';
import AboutTrust from '../components/AboutTrust';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { useSettings } from '../context/SettingsContext';
import { siteConfig } from '../config/siteConfig';

export default function Home() {
  const { content } = useSettings();
  const show = key => content.visibility[key] !== false;
  const schema = { '@context': 'https://schema.org', '@type': 'Organization', name: 'CreatifyBD', url: siteConfig.websiteUrl, logo: `${siteConfig.websiteUrl}/logo.png`, description: siteConfig.seo.defaultDescription, telephone: siteConfig.phone, email: siteConfig.email, areaServed: 'Bangladesh', sameAs: Object.values(siteConfig.socialLinks).filter(Boolean) };
  return <div className="cb-page"><SEO title={siteConfig.seo.defaultTitle} description={siteConfig.seo.defaultDescription} schema={schema} /><Navbar /><main id="main-content">
    {show('hero') && <Hero />}
    {show('portfolio') && <Portfolio highlight />}
    {show('pricing') && <Pricing />}
    {show('process') && <Process />}
    {show('services') && <Services />}
    {show('about_trust') && <AboutTrust />}
    {show('testimonials') && <Testimonials />}
    {show('contact') && <Contact />}
  </main><Footer /></div>;
}
