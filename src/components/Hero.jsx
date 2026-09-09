import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Check } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { offers, formatBangla, formatPrice, whatsappLink } from '../data/offers';

export default function Hero() {
  const { content } = useSettings();
  const hero = content.hero;
  return (
    <section className="cb-hero" aria-labelledby="hero-title">
      <div className="cb-container cb-hero-grid">
        <div className="cb-hero-copy">
          <p className="cb-eyebrow">{hero.eyebrow}</p>
          <h1 id="hero-title">{hero.title}<span>{hero.accent}</span></h1>
          <p className="cb-lead">{hero.desc}</p>
          <div className="cb-actions">
            <Link to="/pricing" className="cb-button cb-button-red">{hero.cta1}<ArrowUpRight size={19} /></Link>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="cb-text-link">{hero.cta2}<ArrowUpRight size={18} /></a>
          </div>
          <ul className="cb-hero-notes" aria-label="কাজের ধরন">
            <li><Check size={16} />পরিষ্কার কাজের পরিধি</li>
            <li><Check size={16} />বাংলা কনটেন্ট</li>
            <li><Check size={16} />সরাসরি যোগাযোগ</li>
          </ul>
        </div>
        <div className="cb-offer-board" aria-label="তিনটি মাসিক সোশ্যাল মিডিয়া প্যাকেজ">
          <div className="cb-board-heading"><span>আপনার পেজের মাসিক পরিকল্পনা</span><span className="cb-board-mark" aria-hidden="true">c.</span></div>
          <div className="cb-board-posters" aria-label="স্থানীয় ব্যবসার জন্য ধারণাভিত্তিক ডিজাইন">
            <img src="/assets/portfolio/bd-social/01-restaurant-bhoj-640.webp" width="640" height="640" alt="রেস্টুরেন্টের জন্য বাংলা সোশ্যাল পোস্টের নমুনা" fetchPriority="high" />
            <img src="/assets/portfolio/bd-social/02-boutique-bunon-640.webp" width="640" height="640" alt="পোশাকের ব্যবসার জন্য বাংলা পোস্টের নমুনা" />
            <img src="/assets/portfolio/bd-social/04-bakery-mishtimukh-640.webp" width="640" height="640" alt="বেকারির জন্য বাংলা পোস্টের নমুনা" />
          </div>
          <div className="cb-board-plans">
            {offers.map((offer, index) => (
              <Link key={offer.id} to={`/pricing#${offer.id}`} className={`cb-board-plan ${index === 1 ? 'is-accent' : ''}`}>
                <span className="cb-board-plan-name">{offer.name}</span>
                <strong>{formatPrice(offer.amountBDT)}<small>/মাস</small></strong>
                <span>{formatBangla(offer.posters)} পোস্টার · {formatBangla(offer.videos)} ভিডিও</span>
              </Link>
            ))}
          </div>
          <p className="cb-board-footnote">আপনার প্রয়োজন অনুযায়ী প্যাকেজ বেছে নিন <ArrowUpRight size={16} /></p>
        </div>
      </div>
    </section>
  );
}
