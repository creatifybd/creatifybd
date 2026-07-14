import React, { useEffect, useMemo, useState } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';
import { ArrowUpRight, BarChart3, Clapperboard, Code2, Megaphone, Palette } from 'lucide-react';
import { TextReveal, FadeReveal } from './MotionReveal';
import { motion } from 'framer-motion';

const defaultServices = [
  {
    id: 'signature-social-media-manager',
    icon: <BarChart3 size={28} />,
    title: 'Strategic Social Media Management',
    desc: 'Data-driven content strategies that increase engagement and drive conversions. Full-service management from strategy to execution.',
    price: '$299/mo',
    badge: 'Most requested',
    featured: true
  },
  {
    id: 'graphic-design',
    icon: <Palette size={28} />,
    title: 'Brand Design Systems',
    desc: 'Comprehensive visual identity that communicates your unique value proposition. From brand strategy to execution-ready assets.',
    price: '$45'
  },
  {
    id: 'video-editing',
    icon: <Clapperboard size={28} />,
    title: 'Professional Video Production',
    desc: 'Strategic video content that tells your brand story and drives action. From concept to final delivery with platform optimization.',
    price: '$60'
  },
  {
    id: 'website-design',
    icon: <Code2 size={28} />,
    title: 'Conversion-Focused Web Design',
    desc: 'Strategic websites that turn visitors into customers. User experience design with business goals at the center.',
    price: '$249'
  }
];

const serviceVisuals = [
  '/assets/portfolio/social-media-management/social-media-management-01.jpg',  // Social media content
  '/assets/portfolio/logo-design-branding/logo-design-branding-01.jpg',  // Graphic design
  '/assets/portfolio/video-editing/video-editing-01.jpg',  // Video editing
  '/assets/portfolio/digital-marketing/digital-marketing-01.jpg',  // Marketing analytics
  '/assets/portfolio/website-design/website-design-01.jpg'   // Web / brand design
];

const Services = ({ highlight = false, fullPage = false }) => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'services'),
      (snap) => {
        const all = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const sorted = all.sort((a, b) => (a.order || 0) - (b.order || 0) || (a.title || '').localeCompare(b.title || ''));
        setServices(sorted.filter(s => !s.hidden));
      },
      () => setServices([])
    );
    return () => unsub();
  }, []);

  const displayServices = useMemo(() => {
    const source = services.length > 0 ? services : defaultServices;
    const signature = source.find(item => /social media manager|social media management/i.test(item.title || ''));
    const ordered = signature ? [signature, ...source.filter(item => item.id !== signature.id)] : source;
    return highlight ? ordered.slice(0, 5) : ordered;
  }, [highlight, services]);

  return (
    <section className={`section services-section agency-services ${fullPage ? 'full-page-section' : ''}`} id="services">
      <div className="container">
        <div className="duck-services-layout">
          <header className="duck-services-intro">
            <FadeReveal>
              <div className="eyebrow">Our services</div>
            </FadeReveal>
            <TextReveal className="section-h">
              {fullPage ? (
                <>Strategic creative services that <span className="text-red">drive business results.</span></>
              ) : (
                <>Professional creative support for <span className="text-red">growing businesses.</span></>
              )}
            </TextReveal>
            <FadeReveal delay={0.2}>
              <p className="section-sub">
                A dedicated creative partner that understands your business goals. From strategy to execution, we deliver measurable results without the agency overhead.
              </p>
            </FadeReveal>
            <FadeReveal delay={0.3}>
              <a href={fullPage ? '#contact' : '/services'} className="duck-services-link">
                {fullPage ? 'Discuss your project' : 'Explore all services'}
                <ArrowUpRight size={18} />
              </a>
            </FadeReveal>
          </header>

          <div className="duck-service-index">
            {displayServices.map((service, idx) => (
              <FadeReveal key={service.id || idx} delay={idx * 0.04}>
                <motion.article 
                  className={`duck-service-row ${idx === 0 ? 'is-featured' : ''}`}
                  initial={{ height: 'auto' }}
                  whileHover={{ height: 'auto' }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="duck-service-row-main">
                    <span className="duck-service-number">{String(idx + 1).padStart(2, '0')}</span>
                    <div className="duck-service-copy">
                      <div className="duck-service-title-line">
                        <h3>{service.title}</h3>
                        {idx === 0 && <span className="duck-service-badge">Most requested</span>}
                      </div>
                      <p>{service.desc || service.description}</p>
                    </div>
                    <div className="duck-service-action">
                      <span className="duck-service-price">{service.price || 'Custom quote'}</span>
                      <a
                        href="#contact"
                        aria-label={`Discuss ${service.title}`}
                      >
                        <ArrowUpRight size={24} />
                      </a>
                    </div>
                  </div>
                  <motion.div 
                    className="duck-service-preview" 
                    aria-hidden="true"
                    initial={{ x: 20, opacity: 0 }}
                    whileHover={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <img src={service.imageUrl || serviceVisuals[idx % serviceVisuals.length]} alt="" loading="lazy" />
                    <div className="duck-service-icon">{service.icon}</div>
                  </motion.div>
                </motion.article>
              </FadeReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
