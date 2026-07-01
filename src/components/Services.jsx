import React, { useEffect, useMemo, useState } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';
import { ArrowUpRight, BarChart3, Clapperboard, Code2, Megaphone, Palette } from 'lucide-react';
import { TextReveal, FadeReveal } from './MotionReveal';

const defaultServices = [
  {
    id: 'signature-social-media-manager',
    icon: <BarChart3 size={28} />,
    title: 'Managed Social Media Growth',
    desc: 'Monthly content calendars, post design, captions, scheduling, community support, and analytics for busy small businesses.',
    price: 'From $299/mo',
    badge: 'Most requested'
  },
  {
    id: 'graphic-design',
    icon: <Palette size={28} />,
    title: 'Graphic Design',
    desc: 'Brand kits, logo systems, ad creatives, flyers, carousels, and social templates built for clear conversion.',
    price: 'From $45'
  },
  {
    id: 'video-editing',
    icon: <Clapperboard size={28} />,
    title: 'Video Editing',
    desc: 'Short-form reels, promotional videos, YouTube edits, captions, hooks, pacing, and platform-ready exports.',
    price: 'From $60'
  },
  {
    id: 'digital-marketing',
    icon: <Megaphone size={28} />,
    title: 'Digital Marketing',
    desc: 'Campaign planning, ad creative direction, landing-page funnels, lead magnets, and monthly performance insight.',
    price: 'Custom quote'
  },
  {
    id: 'website-design',
    icon: <Code2 size={28} />,
    title: 'Website Design',
    desc: 'Fast, responsive business websites, landing pages, redesigns, SEO foundations, and inquiry-focused UX.',
    price: 'From $249'
  }
];

const serviceVisuals = [
  'https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop'
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
              {fullPage
                ? 'Creative support without the hiring headache.'
                : 'Everything your brand needs to show up better.'}
            </TextReveal>
            <FadeReveal delay={0.2}>
              <p className="section-sub">
                One reliable team for ongoing social media, design, video, marketing, and web work. Start with one project or build a monthly workflow.
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
                <article className={`duck-service-row ${idx === 0 ? 'is-featured' : ''}`}>
                  <div className="duck-service-row-main">
                    <span className="duck-service-number">{String(idx + 1).padStart(2, '0')}</span>
                    <div className="duck-service-copy">
                      <div className="duck-service-title-line">
                        <h3>{service.title}</h3>
                        {idx === 0 && <span>Most requested</span>}
                      </div>
                      <p>{service.desc || service.description}</p>
                    </div>
                    <div className="duck-service-action">
                      <span>{service.price || 'Custom quote'}</span>
                      <a
                        href={service.price && service.price !== 'Custom quote' ? `/payment?service=${encodeURIComponent(service.title)}` : '#contact'}
                        aria-label={`Start ${service.title}`}
                      >
                        <ArrowUpRight size={24} />
                      </a>
                    </div>
                  </div>
                  <div className="duck-service-preview" aria-hidden="true">
                    <img src={serviceVisuals[idx % serviceVisuals.length]} alt="" loading="lazy" />
                    <div className="duck-service-icon">{service.icon}</div>
                  </div>
                </article>
              </FadeReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
