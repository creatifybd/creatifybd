import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowUpRight, CheckCircle2, Mail, Phone, MapPin } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { siteConfig } from '../config/siteConfig';
import { whatsappLink } from '../data/offers';
import { normalizePhone, validateInquiry } from '../utils/inquiry';

const initialForm = { name: '', phone: '', email: '', service: '', budget: '', message: '', website: '' };
export default function Contact({ fullPage = false }) {
  const { content, release } = useSettings();
  const [params] = useSearchParams();
  const [data, setData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [failure, setFailure] = useState('');
  const form = useRef(null);
  const success = useRef(null);
  // Query parameters are applied after hydration, preserving identical initial HTML.
  useEffect(() => { setData(previous => ({ ...previous, service: params.get('service') || '', message: params.get('message') || '' })); }, [params]);
  useEffect(() => { if (status === 'success') success.current?.focus(); }, [status]);
  const set = key => event => { setData(previous => ({ ...previous, [key]: event.target.value })); setErrors(previous => ({ ...previous, [key]: '' })); };
  const submit = async event => {
    event.preventDefault();
    if (status === 'sending' || data.website) return;
    const nextErrors = validateInquiry(data);
    setErrors(nextErrors); setFailure('');
    if (Object.keys(nextErrors).length) { form.current?.elements.namedItem(Object.keys(nextErrors)[0])?.focus(); return; }
    setStatus('sending');
    try {
      const { sendMessage } = await import('../firebase/services');
      await sendMessage({ ...data, phone: normalizePhone(data.phone) });
      setStatus('success'); setData(initialForm);
    } catch {
      setStatus('idle');
      setFailure('বার্তাটি পাঠানো যায়নি। আপনার লেখা রাখা আছে—আবার চেষ্টা করুন অথবা WhatsApp-এ যোগাযোগ করুন।');
    }
  };
  const Heading = fullPage ? 'h1' : 'h2';
  const field = (name, label, options = {}) => <div className="cb-field"><label htmlFor={`inquiry-${name}`}>{label}{!options.required && <span> (ঐচ্ছিক)</span>}</label><input id={`inquiry-${name}`} name={name} value={data[name]} onChange={set(name)} {...options} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `inquiry-${name}-error` : undefined} />{errors[name] && <p className="cb-field-error" id={`inquiry-${name}-error`}>{errors[name]}</p>}</div>;
  return <section className="cb-section cb-contact" id="contact"><div className="cb-container cb-contact-grid">
    <div className="cb-contact-intro"><p className="cb-eyebrow">কথা থেকেই শুরু হোক</p><Heading>{content.contact.heading}</Heading><p>{content.contact.subheading}</p><div className="cb-contact-details">
      <a href={whatsappLink()} target="_blank" rel="noopener noreferrer"><Phone size={20} />WhatsApp-এ সরাসরি কথা বলুন<ArrowUpRight size={16} /></a>
      <a href={`mailto:${siteConfig.email}`}><Mail size={20} />{siteConfig.email}</a>
      <p><MapPin size={17} aria-hidden="true" /> {release.site.address}<br />{release.site.working_hours}</p>
    </div></div>
    {status === 'success' ? <div ref={success} tabIndex={-1} className="cb-form-success" role="status"><CheckCircle2 size={34} color="#187143" /><h3>আপনার বার্তা পেয়েছি।</h3><p>দেওয়া নম্বরে বা ইমেইলে যোগাযোগ করে কাজের প্রয়োজন নিয়ে আলোচনা করব।</p><button type="button" onClick={() => setStatus('idle')} className="cb-button cb-button-outline">আরেকটি বার্তা লিখুন</button></div> : <form ref={form} className="cb-contact-form" onSubmit={submit} noValidate>
      <div className="cb-honeypot" aria-hidden="true"><label htmlFor="inquiry-website">ওয়েবসাইট<input id="inquiry-website" name="website" tabIndex={-1} autoComplete="off" value={data.website} onChange={set('website')} /></label></div>
      <div className="cb-form-grid">
        {field('name', 'আপনার নাম', { required: true, autoComplete: 'name', maxLength: 120 })}
        {field('phone', 'ফোন / WhatsApp নম্বর', { required: true, type: 'tel', autoComplete: 'tel', maxLength: 30, placeholder: '০১XXXXXXXXX' })}
        {field('email', 'ইমেইল', { type: 'email', autoComplete: 'email', maxLength: 180 })}
        <div className="cb-field"><label htmlFor="inquiry-service">কোন কাজটি প্রয়োজন? <span>(ঐচ্ছিক)</span></label><select id="inquiry-service" name="service" value={data.service} onChange={set('service')}><option value="">আলোচনা করে ঠিক করব</option>{release.services.map(s => <option value={s.id} key={s.id}>{s.title}</option>)}<option value="other">অন্য কোনো কাজ</option></select></div>
        <div className="cb-field cb-field-wide"><label htmlFor="inquiry-message">আপনার প্রয়োজন</label><textarea id="inquiry-message" name="message" required maxLength={3000} rows={4} value={data.message} onChange={set('message')} placeholder="কাজের ধরন, পেজের লিংক বা আপনার ভাবনাটি লিখুন…" aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'inquiry-message-error' : undefined} />{errors.message && <p className="cb-field-error" id="inquiry-message-error">{errors.message}</p>}</div>
      </div>
      <p className="cb-form-footnote">এই তথ্য আপনার কাজ নিয়ে যোগাযোগের জন্য ব্যবহার করা হবে।</p>
      {failure && <p className="cb-form-error" role="alert">{failure}</p>}
      <button type="submit" disabled={status === 'sending'} className="cb-button cb-button-red">{status === 'sending' ? 'পাঠানো হচ্ছে…' : 'আপনার প্রয়োজন জানান'}<ArrowUpRight size={18} /></button>
    </form>}
  </div></section>;
}
