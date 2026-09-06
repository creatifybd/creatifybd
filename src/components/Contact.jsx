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
      country: 'Bangladesh', service: params.get('service') || '', budget: '', message: params.get('message') || ''
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
    return cContent.address || siteConfig.address || 'Dhaka, Bangladesh';
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
        if (!value.trim()) error = 'আপনার নাম লিখুন';
        else if (value.trim().length < 2) error = 'নাম অন্তত ২ অক্ষরের হতে হবে';
        break;
      case 'email':
        if (!value.trim()) error = 'ইমেইল এড্রেস আবশ্যক';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'সঠিক ইমেইল এড্রেস দিন';
        break;
      case 'phone':
        if (!value.trim()) error = 'ফোন বা WhatsApp নম্বর আবশ্যক';
        else if (!/^[\d\s\+\-\(\)]{10,}$/.test(value)) error = 'সঠিক ফোন নম্বর দিন';
        break;
      case 'service':
        if (!value) error = 'একটি সার্ভিস নির্বাচন করুন';
        break;
      case 'budget':
        if (!value) error = 'আপনার বাজেট রেঞ্জ সিলেক্ট করুন';
        break;
      case 'message':
        if (!value.trim()) error = 'প্রজেক্ট সম্পর্কে কিছু লিখুন';
        else if (value.trim().length < 10) error = 'কমপক্ষে ১০ অক্ষরে বিস্তারিত লিখুন';
        break;
      default:
        break;
    }

    setErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  };

  const validateForm = () => {
    const requiredFields = ['name', 'email', 'phone', 'service', 'budget', 'message'];
    let isValid = true;
    requiredFields.forEach(field => {
      if (!validateField(field)) isValid = false;
    });
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const requiredFields = ['name', 'email', 'phone', 'service', 'budget', 'message'];
    setTouched(requiredFields.reduce((acc, field) => ({ ...acc, [field]: true }), {}));
    
    // Validate all fields
    if (!validateForm()) {
      toast.error('ফর্মের লাল চিহ্নিত ভুলগুলো সংশোধন করুন');
      return;
    }
    
    setLoading(true);
    const toastId = toast.loading('ইনকোয়ারি পাঠানো হচ্ছে...');
    try {
      await sendMessage(formData);
      setSubmitted(true);
      toast.success('ইনকোয়ারি সফলভাবে পাঠানো হয়েছে! আমরা ২৪ ঘণ্টার মধ্যে যোগাযোগ করব।', { id: toastId });
      setFormData({ name: '', email: '', phone: '', company: '', country: 'Bangladesh', service: '', budget: '', message: '' });
      setErrors({});
      setTouched({});
    } catch (err) {
      console.error(err);
      toast.error('মেসেজ পাঠানো সম্ভব হয়নি। অনুগ্রহ করে আবার চেষ্টা করুন।', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const contactMethods = [
    { icon: <MessageSquare size={22} />, label: 'ইমেইল করুন',       val: siteConfig.email },
    { icon: <Phone size={22} />,         label: 'ফোন / WhatsApp',  val: siteConfig.phone },
    { icon: <MapPin size={22} />,        label: 'অফিস / লোকেশন',    val: safePublicLocation },
    ...(cContent.working_hours
      ? [{ icon: <CheckCircle2 size={22} />, label: 'কাজের সময়', val: cContent.working_hours }]
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
                'আসুন, একসাথে দারুণ কিছু তৈরি করি'
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
                href={`https://wa.me/${siteConfig.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent('Hi CreatifyBD, আমি একটি প্রজেক্ট নিয়ে আলোচনা করতে চাই।')}`}
                target="_blank"
                rel="noreferrer"
                className="btn-outline-red"
                style={{ marginTop: '2rem', display: 'inline-flex' }}
              >
                💬 সরাসরি WhatsApp-এ কথা বলুন
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
                  <h3 className="form-title">প্রজেক্ট শুরু করুন</h3>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="luxury-label" htmlFor="contact-name">আপনার পূর্ণ নাম *</label>
                      <input 
                        id="contact-name" 
                        type="text" 
                        required 
                        className={`luxury-input ${touched.name && errors.name ? 'input-error' : ''}`} 
                        value={formData.name} 
                        onChange={set('name')} 
                        onBlur={handleBlur('name')}
                        placeholder="যেমন: তাহমিদ হাসান" 
                        autoComplete="name" 
                        aria-invalid={touched.name && errors.name ? 'true' : 'false'}
                        aria-describedby={touched.name && errors.name ? 'contact-name-error' : undefined}
                      />
                      {touched.name && errors.name && (
                        <span id="contact-name-error" className="field-error">{errors.name}</span>
                      )}
                    </div>
                    <div className="form-group">
                      <label className="luxury-label" htmlFor="contact-email">ইমেইল এড্রেস *</label>
                      <input 
                        id="contact-email" 
                        type="email" 
                        required 
                        className={`luxury-input ${touched.email && errors.email ? 'input-error' : ''}`} 
                        value={formData.email} 
                        onChange={set('email')} 
                        onBlur={handleBlur('email')}
                        placeholder="tahmid@example.com" 
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
                      <label className="luxury-label" htmlFor="contact-phone">ফোন / WhatsApp *</label>
                      <input 
                        id="contact-phone" 
                        type="tel" 
                        required 
                        className={`luxury-input ${touched.phone && errors.phone ? 'input-error' : ''}`} 
                        value={formData.phone} 
                        onChange={set('phone')} 
                        onBlur={handleBlur('phone')}
                        placeholder="+880 1X XX-XXXXXX" 
                        autoComplete="tel" 
                        aria-invalid={touched.phone && errors.phone ? 'true' : 'false'}
                        aria-describedby={touched.phone && errors.phone ? 'contact-phone-error' : undefined}
                      />
                      {touched.phone && errors.phone && (
                        <span id="contact-phone-error" className="field-error">{errors.phone}</span>
                      )}
                    </div>
                    <div className="form-group">
                      <label className="luxury-label" htmlFor="contact-company">কোম্পানি / ব্র্যান্ডের নাম</label>
                      <input id="contact-company" type="text" className="luxury-input" value={formData.company} onChange={set('company')} placeholder="আপনার প্রতিষ্ঠান বা ব্র্যান্ড" autoComplete="organization" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="luxury-label" htmlFor="contact-service">প্রয়োজনীয় সার্ভিস *</label>
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
                      <option value="">সার্ভিস নির্বাচন করুন</option>
                      {siteConfig.services.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {touched.service && errors.service && (
                      <span id="contact-service-error" className="field-error">{errors.service}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="luxury-label" htmlFor="contact-budget">বাজেট রেঞ্জ *</label>
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
                      <option value="">বাজেট রেঞ্জ নির্বাচন করুন</option>
                      {siteConfig.budgetRanges.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                    {touched.budget && errors.budget && (
                      <span id="contact-budget-error" className="field-error">{errors.budget}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="luxury-label" htmlFor="contact-message">প্রজেক্টের বিবরণ ও লক্ষ্য *</label>
                    <textarea 
                      id="contact-message" 
                      required 
                      className={`luxury-input ${touched.message && errors.message ? 'input-error' : ''}`} 
                      style={{ height: '120px', paddingTop: '1rem' }} 
                      value={formData.message} 
                      onChange={set('message')} 
                      onBlur={handleBlur('message')}
                      placeholder="আপনার প্রজেক্টের লক্ষ্য, কী ধরনের ডিজাইন বা ভিডিও প্রয়োজন এবং সম্ভাব্য সময়সীমা লিখুন..."
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
                      <span>আমি <a href="/privacy-policy" style={{ color: 'var(--brand-red)', textDecoration: 'underline' }}>গোপনীয়তা নীতি</a> পড়েছি এবং প্রজেক্ট আলোচনার জন্য তথ্যের ব্যবহারে সম্মতি জানাচ্ছি।</span>
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
                      ? <><span>পাঠানো হচ্ছে...</span><Loader2 size={18} className="animate-spin" style={{ marginLeft: '0.75rem' }} /></>
                      : <><span>ইনকোয়ারি পাঠান</span><Send size={18} style={{ marginLeft: '0.75rem' }} /></>
                    }
                  </motion.button>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
                    {[
                      { icon: '🔒', text: 'নিরাপদ ও সুরক্ষিত' },
                      { icon: '✅', text: 'নো স্প্যাম নিশ্চয়তা' },
                      { icon: '🇧🇩', text: 'ঢাকায় অবস্থিত' },
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
                  <h3 className="success-title">ইনকোয়ারি পাঠানো হয়েছে! 🎉</h3>
                  <p className="success-desc">
                    ধন্যবাদ CreatifyBD-তে যোগাযোগ করার জন্য! আমরা আপনার মেসেজ পেয়েছি। আগামী ২৪ ঘণ্টার মধ্যে WhatsApp বা Email-এ আপনার সাথে যোগাযোগ করব।
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '2rem', width: '100%' }}>
                    <a
                      href={`https://wa.me/${siteConfig.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent('Hi CreatifyBD, আমি একটি প্রজেক্ট ইনকোয়ারি সাবমিট করেছি। বিস্তারিত আলোচনা করতে চাই!')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-red"
                      style={{ justifyContent: 'center' }}
                    >
                      💬 এখনই WhatsApp-এ কথা বলুন
                    </a>
                    <button onClick={() => setSubmitted(false)} className="btn-ghost" style={{ justifyContent: 'center' }}>
                      আরেকটি ইনকোয়ারি পাঠান
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
