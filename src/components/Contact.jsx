import React, { useMemo, useState } from 'react';
import DOMPurify from 'dompurify';
import { useLanguage } from '../context/LanguageContext';
import { sendMessage } from '../firebase/services';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, MessageSquare, Phone, MapPin, Loader2 } from 'lucide-react';
import { TextReveal, FadeReveal } from './MotionReveal';
import toast from 'react-hot-toast';
import { useSettings } from '../context/SettingsContext';
import { siteConfig } from '../config/siteConfig';

const EASE_EXPO = [0.16, 1, 0.3, 1];

const COUNTRIES = [
  'United States', 'Canada', 'Australia', 'United Kingdom', 'Germany',
  'France', 'Netherlands', 'United Arab Emirates', 'Singapore', 'India',
  'New Zealand', 'Ireland', 'Sweden', 'Norway', 'Denmark', 'Switzerland',
  'South Africa', 'Malaysia', 'Philippines', 'Other',
];

const Contact = () => {
  const { lang } = useLanguage();
  const { content } = useSettings();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formData, setFormData] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      name: '', email: '', phone: '', company: '',
      country: '', service: params.get('service') || '', budget: '', message: params.get('message') || ''
    };
  });

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const svc = params.get('service');
    const msg = params.get('message');
    if (svc || msg) {
      setFormData(prev => ({
        ...prev,
        service: svc || prev.service,
        message: msg || prev.message
      }));
    }
  }, []);

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

  const set = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBlur = (field) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field) => {
    let error = '';
    const value = formData[field];

    switch (field) {
      case 'name':
        if (!value.trim()) error = 'Name is required';
        else if (value.trim().length < 2) error = 'Name must be at least 2 characters';
        break;
      case 'email':
        if (!value.trim()) error = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email address';
        break;
      case 'phone':
        if (!value.trim()) error = 'Phone is required';
        else if (!/^[\d\s\+\-\(\)]{10,}$/.test(value)) error = 'Invalid phone number';
        break;
      case 'country':
        if (!value) error = 'Country is required';
        break;
      case 'service':
        if (!value) error = 'Service is required';
        break;
      case 'budget':
        if (!value) error = 'Budget is required';
        break;
      case 'message':
        if (!value.trim()) error = 'Message is required';
        else if (value.trim().length < 10) error = 'Message must be at least 10 characters';
        break;
      default:
        break;
    }

    setErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  };

  const validateForm = () => {
    const requiredFields = ['name', 'email', 'phone', 'country', 'service', 'budget', 'message'];
    let isValid = true;
    requiredFields.forEach(field => {
      if (!validateField(field)) isValid = false;
    });
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const requiredFields = ['name', 'email', 'phone', 'country', 'service', 'budget', 'message'];
    setTouched(requiredFields.reduce((acc, field) => ({ ...acc, [field]: true }), {}));
    
    // Validate all fields
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }
    
    setLoading(true);
    const toastId = toast.loading('Sending your inquiry...');
    try {
      await sendMessage(formData);
      setSubmitted(true);
      toast.success('Inquiry received! We\'ll contact you within 24 hours.', { id: toastId });
      setFormData({ name: '', email: '', phone: '', company: '', country: '', service: '', budget: '', message: '' });
      setErrors({});
      setTouched({});
    } catch (err) {
      console.error(err);
      toast.error('Failed to send. Please try again.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const contactMethods = [
    { icon: <MessageSquare size={22} />, label: 'Email Us',  val: siteConfig.email },
    { icon: <Phone size={22} />,         label: 'Call / WhatsApp', val: siteConfig.phone },
    { icon: <MapPin size={22} />,        label: 'Location',  val: safePublicLocation },
    ...(cContent.working_hours
      ? [{ icon: <CheckCircle2 size={22} />, label: 'Working Hours', val: cContent.working_hours }]
      : []),
  ];

  return (
    <section className="contact-premium-section" id="contact">
      <div className="container">
        <div className="contact-grid-wrap">

          {/* ── Info panel ── */}
          <div className="contact-info-panel">
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

            {/* WhatsApp direct CTA */}
            <FadeReveal delay={0.5}>
              <a
                href={`https://wa.me/${siteConfig.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent('Hi CreatifyBD, I want to discuss a project.')}`}
                target="_blank"
                rel="noreferrer"
                className="btn-outline-red"
                style={{ marginTop: '2rem', display: 'inline-flex' }}
              >
                💬 Chat on WhatsApp
              </a>
            </FadeReveal>
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
                      <input 
                        id="contact-name" 
                        type="text" 
                        required 
                        className={`luxury-input ${touched.name && errors.name ? 'input-error' : ''}`} 
                        value={formData.name} 
                        onChange={set('name')} 
                        onBlur={handleBlur('name')}
                        placeholder="John Doe" 
                        autoComplete="name" 
                        aria-invalid={touched.name && errors.name ? 'true' : 'false'}
                        aria-describedby={touched.name && errors.name ? 'contact-name-error' : undefined}
                      />
                      {touched.name && errors.name && (
                        <span id="contact-name-error" className="field-error">{errors.name}</span>
                      )}
                    </div>
                    <div className="form-group">
                      <label className="luxury-label" htmlFor="contact-email">Email Address *</label>
                      <input 
                        id="contact-email" 
                        type="email" 
                        required 
                        className={`luxury-input ${touched.email && errors.email ? 'input-error' : ''}`} 
                        value={formData.email} 
                        onChange={set('email')} 
                        onBlur={handleBlur('email')}
                        placeholder="john@example.com" 
                        autoComplete="email" 
                        aria-invalid={touched.email && errors.email ? 'true' : 'false'}
                        aria-describedby={touched.email && errors.email ? 'contact-email-error' : undefined}
                      />
                      {touched.email && errors.email && (
                        <span id="contact-email-error" className="field-error">{errors.email}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="luxury-label" htmlFor="contact-phone">Phone / WhatsApp *</label>
                      <input 
                        id="contact-phone" 
                        type="tel" 
                        required 
                        className={`luxury-input ${touched.phone && errors.phone ? 'input-error' : ''}`} 
                        value={formData.phone} 
                        onChange={set('phone')} 
                        onBlur={handleBlur('phone')}
                        placeholder="+1 555 000 0000" 
                        autoComplete="tel" 
                        aria-invalid={touched.phone && errors.phone ? 'true' : 'false'}
                        aria-describedby={touched.phone && errors.phone ? 'contact-phone-error' : undefined}
                      />
                      {touched.phone && errors.phone && (
                        <span id="contact-phone-error" className="field-error">{errors.phone}</span>
                      )}
                    </div>
                    <div className="form-group">
                      <label className="luxury-label" htmlFor="contact-company">Company Name</label>
                      <input id="contact-company" type="text" className="luxury-input" value={formData.company} onChange={set('company')} placeholder="Your Company Ltd." autoComplete="organization" />
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="luxury-label" htmlFor="contact-country">Country *</label>
                      <select 
                        id="contact-country" 
                        className={`luxury-input ${touched.country && errors.country ? 'input-error' : ''}`} 
                        required 
                        value={formData.country} 
                        onChange={set('country')}
                        onBlur={handleBlur('country')}
                        aria-invalid={touched.country && errors.country ? 'true' : 'false'}
                        aria-describedby={touched.country && errors.country ? 'contact-country-error' : undefined}
                      >
                        <option value="">Select your country</option>
                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      {touched.country && errors.country && (
                        <span id="contact-country-error" className="field-error">{errors.country}</span>
                      )}
                    </div>
                    <div className="form-group">
                      <label className="luxury-label" htmlFor="contact-service">Service Needed *</label>
                      <select 
                        id="contact-service" 
                        className={`luxury-input ${touched.service && errors.service ? 'input-error' : ''}`} 
                        required 
                        value={formData.service} 
                        onChange={set('service')}
                        onBlur={handleBlur('service')}
                        aria-invalid={touched.service && errors.service ? 'true' : 'false'}
                        aria-describedby={touched.service && errors.service ? 'contact-service-error' : undefined}
                      >
                        <option value="">Select a service</option>
                        {siteConfig.services.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {touched.service && errors.service && (
                        <span id="contact-service-error" className="field-error">{errors.service}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="luxury-label" htmlFor="contact-budget">Budget Range *</label>
                    <select 
                      id="contact-budget" 
                      className={`luxury-input ${touched.budget && errors.budget ? 'input-error' : ''}`} 
                      required 
                      value={formData.budget} 
                      onChange={set('budget')}
                      onBlur={handleBlur('budget')}
                      aria-invalid={touched.budget && errors.budget ? 'true' : 'false'}
                      aria-describedby={touched.budget && errors.budget ? 'contact-budget-error' : undefined}
                    >
                      <option value="">Select budget range</option>
                      {siteConfig.budgetRanges.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                    {touched.budget && errors.budget && (
                      <span id="contact-budget-error" className="field-error">{errors.budget}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="luxury-label" htmlFor="contact-message">Tell us about your project *</label>
                    <textarea 
                      id="contact-message" 
                      required 
                      className={`luxury-input ${touched.message && errors.message ? 'input-error' : ''}`} 
                      style={{ height: '120px', paddingTop: '1rem' }} 
                      value={formData.message} 
                      onChange={set('message')} 
                      onBlur={handleBlur('message')}
                      placeholder="Share your vision, goals, and timeline..."
                      aria-invalid={touched.message && errors.message ? 'true' : 'false'}
                      aria-describedby={touched.message && errors.message ? 'contact-message-error' : undefined}
                    />
                    {touched.message && errors.message && (
                      <span id="contact-message-error" className="field-error">{errors.message}</span>
                    )}
                  </div>

                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--ink)', cursor: 'pointer' }}>
                      <input type="checkbox" required style={{ marginTop: '0.25rem', flexShrink: 0 }} />
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
                    {loading
                      ? <><span>Processing...</span><Loader2 size={18} className="animate-spin" style={{ marginLeft: '0.75rem' }} /></>
                      : <><span>Send Inquiry</span><Send size={18} style={{ marginLeft: '0.75rem' }} /></>
                    }
                  </motion.button>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
                    {[
                      { icon: '🔒', text: 'SSL Secured' },
                      { icon: '✅', text: 'No spam, ever' },
                      { icon: '🌍', text: 'Global team' },
                    ].map(b => (
                      <span key={b.text} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.74rem', color: 'var(--muted)', fontWeight: 600 }}>
                        <span>{b.icon}</span>{b.text}
                      </span>
                    ))}
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: EASE_EXPO }}
                  className="success-message"
                >
                  <CheckCircle2 size={72} color="var(--red)" style={{ marginBottom: '1.5rem' }} />
                  <h3 className="success-title">Inquiry Received!</h3>
                  <p className="success-desc">
                    Thank you for contacting CreatifyBD. We have received your project inquiry and will contact you within 24 hours via email or WhatsApp.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '2rem', width: '100%' }}>
                    <a
                      href={`https://wa.me/${siteConfig.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent('Hi CreatifyBD, I just submitted a project inquiry. Looking forward to hearing from you!')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-red"
                      style={{ justifyContent: 'center' }}
                    >
                      💬 Chat on WhatsApp Now
                    </a>
                    <button onClick={() => setSubmitted(false)} className="btn-ghost" style={{ justifyContent: 'center' }}>
                      Send Another Inquiry
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>

      <style>{`
        .field-error {
          display: block;
          margin-top: 0.4rem;
          font-size: 0.75rem;
          color: #dc2626;
          font-weight: 500;
        }
        .input-error {
          border-color: #dc2626 !important;
          background-color: #fef2f2 !important;
        }
        .input-error:focus {
          outline-color: #dc2626 !important;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1) !important;
        }
      `}</style>
    </section>
  );
};

export default Contact;
