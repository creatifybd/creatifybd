import React, { useMemo, useState } from 'react';
import DOMPurify from 'dompurify';
import { useLanguage } from '../context/LanguageContext';
import { sendMessage } from '../firebase/services';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, MessageSquare, Phone, MapPin, Loader2 } from 'lucide-react';
import { TextReveal, FadeReveal, SlideReveal } from './MotionReveal';
import toast from 'react-hot-toast';
import { useSettings } from '../context/SettingsContext';
import { siteConfig } from '../config/siteConfig';

const EASE_EXPO = [0.16, 1, 0.3, 1];

const Contact = () => {
  const { lang } = useLanguage();
  const { content } = useSettings();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    country: '',
    service: '',
    budget: '',
    message: ''
  });

  const cContent = content?.contact || {};
  const safeHeading = useMemo(() => (
    cContent.heading
      ? DOMPurify.sanitize(cContent.heading, {
          ALLOWED_TAGS: ['span', 'br', 'strong', 'em'],
          ALLOWED_ATTR: ['class']
        })
      : ''
  ), [cContent.heading]);
  const safePublicLocation = useMemo(() => {
    const location = cContent.address || siteConfig.address || 'Serving clients globally';
    return /(bangladesh|dhaka)/i.test(location) ? 'Serving clients globally' : location;
  }, [cContent.address]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.country || !formData.service || !formData.budget || !formData.message) {
      toast.error(lang === 'bn' ? 'সব প্রয়োজনীয় ঘর পূরণ করুন' : 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    const toastId = toast.loading(lang === 'bn' ? 'পাঠানো হচ্ছে...' : 'Sending your inquiry...');
    try {
      await sendMessage(formData);
      setSubmitted(true);
      toast.success('Thank you for contacting CreatifyBD. We have received your project inquiry and will contact you shortly.', { id: toastId });
      setFormData({ name: '', email: '', phone: '', company: '', country: '', service: '', budget: '', message: '' });
    } catch (err) {
      console.error(err);
      toast.error(lang === 'bn' ? 'পাঠানো যায়নি। আবার চেষ্টা করুন।' : 'Failed to send. Please try again.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const contactMethods = [
    { icon: <MessageSquare size={24} />, label: 'Email Us',      val: siteConfig.email },
    { icon: <Phone size={24} />,        label: 'Call Us',        val: siteConfig.phone },
    { icon: <MapPin size={24} />,       label: 'Location',       val: safePublicLocation },
    ...(cContent.working_hours
      ? [{ icon: <CheckCircle2 size={24} />, label: 'Working Hours', val: cContent.working_hours }]
      : [])
  ];

  return (
    <section className="contact-premium-section" id="contact">
      <div className="container">
        <div className="contact-grid-wrap">

          {/* ── Info panel ── */}
          <div className="contact-info-panel">
            <FadeReveal>
              <div className="eyebrow" style={{ color: 'var(--red)', marginBottom: '1.5rem' }}>
                {lang === 'bn' ? 'যোগাযোগ করুন' : 'Get In Touch'}
              </div>
            </FadeReveal>

            <TextReveal className="contact-h1">
              {safeHeading ? (
                <span dangerouslySetInnerHTML={{ __html: safeHeading }} />
              ) : (
                lang === 'bn' ? 'আসুন নতুন কিছু তৈরি করি' : "Let's build something great."
              )}
            </TextReveal>

            {cContent.sub && (
              <FadeReveal delay={0.2}>
                <p style={{ color: 'var(--section-subtext)', marginTop: '1rem', marginBottom: '2rem' }}>
                  {cContent.sub}
                </p>
              </FadeReveal>
            )}

            {/* Contact methods — animate each item directly, no wrapper div replacement */}
            <div className="contact-methods">
              {contactMethods.map((method, i) => (
                <motion.div
                  key={method.label}
                  className="contact-method-item"
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.6, ease: EASE_EXPO, delay: 0.2 + i * 0.1 }}
                >
                  <div className="method-icon">{method.icon}</div>
                  <div>
                    <div className="method-label">{method.label}</div>
                    <div className="method-val">{method.val}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {cContent.office_image && (
              <FadeReveal delay={0.55}>
                <div style={{ marginTop: '3rem' }}>
                  <img
                    src={cContent.office_image}
                    alt="CreatifyBD office"
                    style={{ width: '100%', maxWidth: '400px', borderRadius: '16px', objectFit: 'cover' }}
                    loading="lazy"
                  />
                </div>
              </FadeReveal>
            )}
          </div>

          {/* ── Form card ── */}
          <motion.div
            className="contact-form-card"
            initial={{ opacity: 0, y: 36, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.85, ease: EASE_EXPO, delay: 0.1 }}
          >
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: EASE_EXPO }}
                  onSubmit={handleSubmit}
                >
                  <h3 className="form-title">Start a Discovery Session</h3>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="luxury-label" htmlFor="contact-name">Full Name *</label>
                      <input id="contact-name" type="text" required className="luxury-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="John Doe" autoComplete="name" />
                    </div>
                    <div className="form-group">
                      <label className="luxury-label" htmlFor="contact-email">Email Address *</label>
                      <input id="contact-email" type="email" required className="luxury-input" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="john@example.com" autoComplete="email" />
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="luxury-label" htmlFor="contact-phone">Phone Number *</label>
                      <input id="contact-phone" type="tel" required className="luxury-input" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+880 1XXX XXXXXX" autoComplete="tel" />
                      <small style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>WhatsApp preferred for quick communication</small>
                    </div>
                    <div className="form-group">
                      <label className="luxury-label" htmlFor="contact-company">Company Name</label>
                      <input id="contact-company" type="text" className="luxury-input" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} placeholder="Your Company Ltd." autoComplete="organization" />
                    </div>
                    <div className="form-group">
                      <label className="luxury-label" htmlFor="contact-country">Country *</label>
                      <select id="contact-country" className="luxury-input" required value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })}>
                        <option value="">Select your country</option>
                        <option value="USA">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                        <option value="UK">United Kingdom</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="luxury-label" htmlFor="contact-service">Service Needed *</label>
                      <select id="contact-service" className="luxury-input" required value={formData.service} onChange={e => setFormData({ ...formData, service: e.target.value })}>
                        <option value="">Select a service</option>
                        {siteConfig.services.map(service => <option key={service} value={service}>{service}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="luxury-label" htmlFor="contact-budget">Budget Range *</label>
                      <select id="contact-budget" className="luxury-input" required value={formData.budget} onChange={e => setFormData({ ...formData, budget: e.target.value })}>
                        <option value="">Select budget range</option>
                        {siteConfig.budgetRanges.map(range => <option key={range.value} value={range.value}>{range.label}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="form-group-full">
                    <label className="luxury-label" htmlFor="contact-message">Tell us about your project</label>
                    <textarea id="contact-message" required className="luxury-input" style={{ height: '120px', paddingTop: '1rem' }} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} placeholder="Share your vision..." />
                  </div>

                  <div className="form-group-full" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--ink)', cursor: 'pointer' }}>
                      <input type="checkbox" required style={{ marginTop: '0.25rem' }} />
                      <span>I agree to the <a href="/privacy-policy" style={{ color: 'var(--brand-red)', textDecoration: 'underline' }}>Privacy Policy</a> and consent to having my information processed for project inquiries.</span>
                    </label>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="btn-huge-red w-full"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.22, ease: EASE_EXPO }}
                  >
                    {loading ? <>Processing... <Loader2 size={18} className="animate-spin" style={{ marginLeft: '1rem' }} /></> : <>Send Inquiry <Send size={18} style={{ marginLeft: '1rem' }} /></>}
                  </motion.button>

                  {/* Trust badges */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
                    {[
                      { icon: '🔒', text: 'SSL Secured' },
                      { icon: '✅', text: 'No spam, ever' },
                      { icon: '⭐', text: '4.9/5 from 100+ clients' },
                    ].map(b => (
                      <span key={b.text} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600 }}>
                        <span>{b.icon}</span>{b.text}
                      </span>
                    ))}
                  </div>
                </motion.form>
              ) : (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: EASE_EXPO }} className="success-message">
                  <CheckCircle2 size={80} color="var(--red)" style={{ marginBottom: '2rem' }} />
                  <h3 className="success-title">Inquiry Received</h3>
                  <p className="success-desc">Thank you for contacting CreatifyBD. We have received your project inquiry and will contact you shortly.</p>
                  <button onClick={() => setSubmitted(false)} className="btn-red" style={{ marginTop: '2.5rem' }}>Send Another Inquiry</button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
