import React, { useMemo, useState } from 'react';
import DOMPurify from 'dompurify';
import { useLanguage } from '../context/LanguageContext';
import { sendMessage } from '../firebase/services';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, MessageSquare, Phone, MapPin, Loader2, Building2 } from 'lucide-react';
import { TextReveal, FadeReveal } from './MotionReveal';
import toast from 'react-hot-toast';
import { useSettings } from '../context/SettingsContext';
import { siteConfig } from '../config/siteConfig';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.service || !formData.budget || !formData.message) {
      toast.error(lang === 'bn' ? 'সব প্রয়োজনীয় ঘর পূরণ করুন' : 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    const toastId = toast.loading(lang === 'bn' ? 'পাঠানো হচ্ছে...' : 'Sending your inquiry...');
    try {
      await sendMessage(formData);
      setSubmitted(true);
      toast.success('Thank you for contacting CreatifyBD. We have received your project inquiry and will contact you shortly.', { id: toastId });
      setFormData({ name: '', email: '', phone: '', company: '', service: '', budget: '', message: '' });
    } catch (err) {
      console.error(err);
      toast.error(lang === 'bn' ? 'পাঠানো যায়নি। আবার চেষ্টা করুন।' : 'Failed to send. Please try again.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-premium-section" id="contact">
      <div className="container">
        <div className="contact-grid-wrap">
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

            <FadeReveal delay={0.4}>
              <div className="contact-methods">
                <div className="contact-method-item">
                  <div className="method-icon"><MessageSquare size={24} /></div>
                  <div>
                    <div className="method-label">Email Us</div>
                    <div className="method-val">{siteConfig.email}</div>
                  </div>
                </div>
                <div className="contact-method-item">
                  <div className="method-icon"><Phone size={24} /></div>
                  <div>
                    <div className="method-label">Call Us</div>
                    <div className="method-val">{siteConfig.phone}</div>
                  </div>
                </div>
                <div className="contact-method-item">
                  <div className="method-icon"><MapPin size={24} /></div>
                  <div>
                    <div className="method-label">Location</div>
                    <div className="method-val">{cContent.address || siteConfig.address}</div>
                  </div>
                </div>
                {cContent.working_hours && (
                  <div className="contact-method-item">
                    <div className="method-icon"><CheckCircle2 size={24} /></div>
                    <div>
                      <div className="method-label">Working Hours</div>
                      <div className="method-val">{cContent.working_hours}</div>
                    </div>
                  </div>
                )}
              </div>
            </FadeReveal>

            {cContent.office_image && (
              <FadeReveal delay={0.6}>
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

          <div className="contact-form-card">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onSubmit={handleSubmit}
                >
                  <h3 className="form-title">Start a Discovery Session</h3>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="luxury-label" htmlFor="contact-name">Full Name *</label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        className="luxury-input"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        autoComplete="name"
                      />
                    </div>
                    <div className="form-group">
                      <label className="luxury-label" htmlFor="contact-email">Email Address *</label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        className="luxury-input"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="luxury-label" htmlFor="contact-phone">WhatsApp / Phone *</label>
                      <input
                        id="contact-phone"
                        type="tel"
                        required
                        className="luxury-input"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+880 1XXX XXXXXX"
                        autoComplete="tel"
                      />
                    </div>
                    <div className="form-group">
                      <label className="luxury-label" htmlFor="contact-company">Company Name</label>
                      <input
                        id="contact-company"
                        type="text"
                        className="luxury-input"
                        value={formData.company}
                        onChange={e => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Your Company Ltd."
                        autoComplete="organization"
                      />
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="luxury-label" htmlFor="contact-service">Service Needed *</label>
                      <select
                        id="contact-service"
                        className="luxury-input"
                        required
                        value={formData.service}
                        onChange={e => setFormData({ ...formData, service: e.target.value })}
                      >
                        <option value="">Select a service</option>
                        {siteConfig.services.map(service => (
                          <option key={service} value={service}>{service}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="luxury-label" htmlFor="contact-budget">Budget Range *</label>
                      <select
                        id="contact-budget"
                        className="luxury-input"
                        required
                        value={formData.budget}
                        onChange={e => setFormData({ ...formData, budget: e.target.value })}
                      >
                        <option value="">Select budget range</option>
                        {siteConfig.budgetRanges.map(range => (
                          <option key={range.value} value={range.value}>{range.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group-full">
                    <label className="luxury-label" htmlFor="contact-message">Tell us about your project</label>
                    <textarea
                      id="contact-message"
                      required
                      className="luxury-input"
                      style={{ height: '120px', paddingTop: '1rem' }}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Share your vision..."
                    />
                  </div>

                  <button type="submit" disabled={loading} className="btn-huge-red w-full">
                    {loading ? (
                      <>Processing... <Loader2 size={18} className="animate-spin" style={{ marginLeft: '1rem' }} /></>
                    ) : (
                      <>Send Inquiry <Send size={18} style={{ marginLeft: '1rem' }} /></>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="success-message"
                >
                  <CheckCircle2 size={80} color="var(--red)" style={{ marginBottom: '2rem' }} />
                  <h3 className="success-title">Inquiry Received</h3>
                  <p className="success-desc">Thank you for contacting CreatifyBD. We have received your project inquiry and will contact you shortly.</p>
                  <button onClick={() => setSubmitted(false)} className="btn-red" style={{ marginTop: '2.5rem' }}>
                    Send Another Inquiry
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
