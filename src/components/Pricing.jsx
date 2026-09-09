import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Check, Image, Video, Layers } from 'lucide-react';
import { offers, offerNotes, formatBangla, formatPrice, offerWhatsAppLink } from '../data/offers';

export default function Pricing({ fullPage = false, heading = true }) {
  const Heading = fullPage ? 'h1' : 'h2';
  return (
    <section className="cb-section cb-pricing" id="pricing" aria-label="মাসিক সোশ্যাল মিডিয়া প্যাকেজ">
      <div className="cb-container">
        {heading && <div className="cb-section-heading">
          <div><p className="cb-eyebrow">মাসিক সোশ্যাল মিডিয়া প্যাকেজ</p><Heading>নিয়মিত কনটেন্ট।<br /><span>পরিকল্পিত খরচ।</span></Heading></div>
          <p>আপনার পেজে কতটা কনটেন্ট প্রয়োজন?<br />তিনটি প্যাকেজ পাশাপাশি দেখে সিদ্ধান্ত নিন।</p>
        </div>}
        <div className="cb-pricing-grid">
          {offers.map((offer, index) => (
            <article key={offer.id} id={offer.id} className={`cb-price-card ${index === 1 ? 'is-accent' : ''}`}>
              <div className="cb-price-top"><span>প্যাকেজ {formatBangla(index + 1).padStart(2, '০')}</span><Layers size={22} aria-hidden="true" /></div>
              <h3>{offer.name}</h3>
              <p className="cb-price-audience">{offer.audience}</p>
              <p className="cb-price"><strong>{formatPrice(offer.amountBDT)}</strong><span>/মাস</span></p>
              <div className="cb-deliverables">
                <div><Image size={18} aria-hidden="true" /><strong>{formatBangla(offer.posters)}টি</strong><span>পোস্টার</span></div>
                <div><Video size={18} aria-hidden="true" /><strong>{formatBangla(offer.videos)}টি</strong><span>ভিডিও / রিলস</span></div>
              </div>
              <ul className="cb-feature-list"><li><Check size={16} />{formatBangla(offer.platforms)}টি প্ল্যাটফর্ম</li>{offer.features.map(feature => <li key={feature}><Check size={16} />{feature}</li>)}</ul>
              <a href={offerWhatsAppLink(offer)} target="_blank" rel="noopener noreferrer" className={`cb-button ${index === 1 ? 'cb-button-white' : 'cb-button-outline'}`} aria-label={`${offer.name} প্যাকেজ নিয়ে WhatsApp-এ কথা বলুন`}>এই প্যাকেজ নিয়ে কথা বলুন<ArrowUpRight size={18} /></a>
            </article>
          ))}
        </div>
        <details className="cb-comparison">
          <summary>প্যাকেজের বিস্তারিত তুলনা ও কাজের পরিধি</summary>
          <div className="cb-table-scroll" tabIndex="0" role="region" aria-label="প্যাকেজ তুলনা; প্রয়োজন হলে পাশে স্ক্রল করুন">
            <table><caption className="sr-only">তিনটি মাসিক প্যাকেজের তুলনা</caption><thead><tr><th scope="col">কাজের বিবরণ</th>{offers.map(o => <th scope="col" key={o.id}>{o.name}</th>)}</tr></thead><tbody>
              {[['মাসিক মূল্য', 'amountBDT'], ['পোস্টার', 'posters'], ['ভিডিও / রিলস', 'videos'], ['প্ল্যাটফর্ম', 'platforms']].map(([label, key]) => <tr key={key}><th scope="row">{label}</th>{offers.map(o => <td key={o.id}>{key === 'amountBDT' ? formatPrice(o[key]) : formatBangla(o[key])}</td>)}</tr>)}
            </tbody></table>
          </div>
          <ul className="cb-scope-notes">{offerNotes.map(note => <li key={note}>{note}</li>)}</ul>
        </details>
        <p className="cb-pricing-note">কাজ শুরুর আগে ভিডিওর দৈর্ঘ্য, সংশোধন এবং বিজ্ঞাপন বা ইনবক্স পরিচালনার প্রয়োজন মিলিয়ে লিখিত প্রস্তাব দেওয়া হবে।</p>
        <div className="cb-custom-work"><div><h3>লোগো, ভিডিও বা ওয়েবসাইটের কাজ আছে?</h3><p>কাজের প্রয়োজন ও পরিধি অনুযায়ী আলাদা খরচ জানাব।</p></div><Link to="/contact" className="cb-text-link">আপনার প্রয়োজন জানান<ArrowUpRight size={18} /></Link></div>
      </div>
    </section>
  );
}
