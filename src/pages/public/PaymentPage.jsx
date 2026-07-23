import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard, Globe, CheckCircle2, AlertCircle, Loader2,
  Copy, Check, ArrowRight, ShieldCheck, Zap, ExternalLink,
  Star, Clock, Lock, Upload, ChevronDown
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import { siteConfig } from '../../config/siteConfig';
import { useSettings } from '../../context/SettingsContext';
import { storage, db } from '../../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

const RED = '#E8192C';

const TRUST_BADGES = [
  { icon: <ShieldCheck size={15} />, label: '256-bit SSL Encryption' },
  { icon: <Star size={15} />, label: '200+ Global Clients' },
  { icon: <Clock size={15} />, label: 'Verified Within 24h' },
  { icon: <Lock size={15} />, label: 'PCI-DSS Secure Checkout' },
];

const CARD_BRANDS = [
  { label: 'Visa', bg: '#1a1f71', color: '#fff', emoji: '💳' },
  { label: 'Mastercard', bg: '#eb001b', color: '#fff', emoji: '💳' },
  { label: 'AMEX', bg: '#007bc1', color: '#fff', emoji: '💳' },
  { label: 'Apple Pay', bg: '#000000', color: '#fff', emoji: '🍎' },
  { label: 'Google Pay', bg: '#4285f4', color: '#fff', emoji: '🌐' },
  { label: 'Discover', bg: '#e65c00', color: '#fff', emoji: '💳' },
];

const WISE_CURRENCIES = [
  { key: 'usd', flag: '🇺🇸', label: 'USD', sublabel: 'US ACH & Wire', color: '#0052B4' },
  { key: 'eur', flag: '🇪🇺', label: 'EUR', sublabel: 'SEPA / IBAN', color: '#003399' },
  { key: 'gbp', flag: '🇬🇧', label: 'GBP', sublabel: 'UK Sort Code', color: '#CF142B' },
];

const PaymentPage = () => {
  const { paymentSettings } = useSettings();
  const lemonSqueezy = paymentSettings?.lemonSqueezy || {};
  const payoneer = {
    ...siteConfig.payoneer,
    ...(paymentSettings?.payoneer || {}),
    placeholder: paymentSettings?.payoneer?.accountName ? false : siteConfig.payoneer.placeholder
  };
  const wise = paymentSettings?.wise || {
    usd: { accountName: 'CreatifyBD Agency', bankName: 'Evolve Bank & Trust (Wise)', routingNumber: '026073150', accountNumber: '2981048123', swift: 'EVOLUS33' },
    eur: { accountName: 'CreatifyBD Agency', iban: 'BE98 3630 1823 4910', bicSwift: 'TRWIBE21XXX', bankName: 'Wise Europe SA' },
    gbp: { accountName: 'CreatifyBD Agency', sortCode: '23-14-70', accountNumber: '84910283', iban: 'GB12 TRWI 2314 7084 9102 83' }
  };

  const [searchParams] = useSearchParams();
  const selectedService = searchParams.get('service') || '';
  const linkedOrderId = searchParams.get('orderId') || '';
  const publicOrderId = searchParams.get('publicOrderId') || '';
  const prefillEmail = searchParams.get('email') || '';
  const prefillAmount = searchParams.get('amount') || '';
  const prefillCurrency = searchParams.get('currency') || 'USD';
  const expectedAmount = prefillAmount ? parseFloat(prefillAmount) : null;

  const [activeTab, setActiveTab] = useState('card');
  const [wiseCurrency, setWiseCurrency] = useState('usd');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [amountMismatch, setAmountMismatch] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '', email: prefillEmail, phone: '', companyName: '',
    selectedService: selectedService, paymentMethod: 'credit_card',
    paidAmount: prefillAmount, currency: prefillCurrency,
    transactionId: '', paymentDate: new Date().toISOString().split('T')[0],
    proofFile: null, message: '', invoiceNumber: publicOrderId || ''
  });

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(key);
    toast.success('Copied!', { duration: 1500 });
    setTimeout(() => setCopied(null), 2000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) { toast.error('Upload JPEG, PNG, WEBP or PDF'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Max 5MB allowed'); return; }
    setFormData({ ...formData, proofFile: file });
    if (file.type.startsWith('image/')) setFilePreview(URL.createObjectURL(file));
  };

  const handleAmountChange = (val) => {
    setFormData(prev => ({ ...prev, paidAmount: val }));
    setAmountMismatch(expectedAmount !== null && val && parseFloat(val) !== expectedAmount);
  };

  const handleLemonSqueezyCheckout = async () => {
    if (!lemonSqueezy.apiKey || !lemonSqueezy.storeId) {
      toast.error('Lemon Squeezy not configured properly');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Creating secure checkout...');

    try {
      // Create custom checkout with dynamic amount
      const checkoutData = {
        data: {
          type: 'checkouts',
          attributes: {
            custom_price: {
              enabled: true,
              price: parseFloat(formData.paidAmount) * 100, // Convert to cents
            },
            product_options: {
              description: `${formData.selectedService} - Order: ${publicOrderId || 'Custom'}`,
              receipt_button_url: window.location.origin,
              redirect_url: `${window.location.origin}/payment/success?order=${publicOrderId || 'custom'}`,
            },
            checkout_options: {
              button_color: '#E8192C',
            },
          },
          relationships: {
            store: {
              data: {
                type: 'stores',
                id: lemonSqueezy.storeId,
              },
            },
          },
        },
      };

      const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
          'Authorization': `Bearer ${lemonSqueezy.apiKey}`,
        },
        body: JSON.stringify(checkoutData),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].detail || 'Failed to create checkout');
      }

      const checkoutUrl = result.data.attributes.url;
      window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
      toast.success('Checkout opened!', { id: toastId });
    } catch (error) {
      console.error('Lemon Squeezy checkout error:', error);
      toast.error('Failed to create checkout. Please try again.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If Lemon Squeezy is selected, handle checkout differently
    if (formData.paymentMethod === 'lemonsqueezy') {
      await handleLemonSqueezyCheckout();
      return;
    }

    const required = ['fullName', 'email', 'selectedService', 'paymentMethod', 'paidAmount', 'transactionId'];
    for (const f of required) {
      if (!formData[f]) { toast.error('Please fill in all required fields'); return; }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email'); return;
    }
    setLoading(true);
    const toastId = toast.loading('Submitting payment details...');
    try {
      let proofFileUrl = '', storagePath = '';
      if (formData.proofFile) {
        const safeName = formData.proofFile.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80);
        storagePath = `payment-proofs/${Date.now()}_${safeName}`;
        const storageRef = ref(storage, storagePath);
        await uploadBytes(storageRef, formData.proofFile);
        proofFileUrl = await getDownloadURL(storageRef);
      }
      await addDoc(collection(db, 'manualPayments'), {
        ...formData, proofFile: undefined,
        proofFileUrl, storagePath,
        paidAmount: Number(formData.paidAmount) || formData.paidAmount,
        linkedOrderId, publicOrderId,
        expectedAmount, status: 'pending',
        createdAt: serverTimestamp(), updatedAt: serverTimestamp(), adminNote: ''
      });
      setSubmitted(true);
      toast.success('Payment details submitted!', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error('Submission failed. Please try again.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fb', fontFamily: 'var(--font-body, Inter, sans-serif)' }}>
      <SEO
        title="International Payment Portal | CreatifyBD"
        description="Secure international payment for CreatifyBD creative services. Credit Card, Apple Pay, Google Pay & Wise Bank Transfer."
        keywords="payment, credit card, wise transfer, apple pay, creatifybd checkout"
      />
      <Navbar />

      {/* ── DARK HERO HEADER ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0a0a0f 0%, #111118 50%, #0f0f15 100%)',
        padding: '6rem 1.5rem 4rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Ambient glow orbs */}
        <div style={{ position: 'absolute', top: '-80px', left: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(232,25,44,0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', right: '5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(100,100,255,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        {/* Grid pattern */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'relative', textAlign: 'center', maxWidth: '680px', margin: '0 auto' }}
        >
          {/* Secure badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            padding: '0.4rem 1rem', marginBottom: '1.6rem',
            background: 'rgba(232,25,44,0.12)', border: '1px solid rgba(232,25,44,0.28)',
            borderRadius: '100px', fontSize: '0.78rem', fontWeight: 700, color: '#ff6b7a',
            letterSpacing: '0.02em'
          }}>
            <ShieldCheck size={14} />
            256-Bit SSL Encrypted · Secure Agency Checkout
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 900, color: '#ffffff',
            margin: '0 0 1rem', lineHeight: 1.1, letterSpacing: '-0.04em',
            fontFamily: 'var(--font-display, Bricolage Grotesque, sans-serif)'
          }}>
            International <span style={{ color: RED, WebkitTextFillColor: RED }}>Payment</span> Portal
          </h1>

          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, margin: '0 0 2.5rem', fontWeight: 400 }}>
            Pay for your creative services in USD, EUR, or GBP via Visa, Mastercard, Apple Pay, or direct Wise Bank Transfer.
          </p>

          {/* Trust badges row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.6rem' }}>
            {TRUST_BADGES.map(b => (
              <div key={b.label} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '0.4rem 0.8rem', borderRadius: '8px',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                fontSize: '0.76rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600
              }}>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>{b.icon}</span>
                {b.label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── ORDER SUMMARY CARD (floats over hero) ── */}
      {(selectedService || prefillAmount || publicOrderId) && (
        <div style={{ maxWidth: '1080px', margin: '-2.5rem auto 0', padding: '0 1.5rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              background: 'linear-gradient(135deg, #1a1a24 0%, #111118 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '20px',
              padding: '1.5rem 2rem',
              boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '44px', height: '44px', background: 'rgba(232,25,44,0.15)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CreditCard size={20} color={RED} />
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800 }}>
                  Invoice {publicOrderId && `#${publicOrderId}`}
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
                  {selectedService || 'Creative Services Package'}
                </div>
                {prefillEmail && <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '2px' }}>Client: {prefillEmail}</div>}
              </div>
            </div>
            {prefillAmount && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Amount Due</div>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#fff', lineHeight: 1, letterSpacing: '-0.04em' }}>
                  ${prefillAmount}<span style={{ fontSize: '1rem', color: RED, fontWeight: 700, marginLeft: '4px' }}>{prefillCurrency}</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth: '1080px', margin: '0 auto', padding: (selectedService || prefillAmount) ? '2.5rem 1.5rem 6rem' : '4rem 1.5rem 6rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '2rem', alignItems: 'start' }}>

          {/* ────── LEFT COLUMN: PAYMENT OPTIONS ────── */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15, duration: 0.55 }}>
            
            {/* Step label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '1.2rem' }}>
              <div style={{ width: '28px', height: '28px', background: RED, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.82rem', fontWeight: 900, color: '#fff', flexShrink: 0 }}>1</div>
              <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111', letterSpacing: '-0.02em' }}>Select Payment Method</span>
            </div>

            {/* Tab Switcher */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {[
                { key: 'card', icon: <CreditCard size={20} />, label: 'Card & Wallets', sub: 'Visa · Mastercard · Apple Pay', method: 'lemonsqueezy' },
                { key: 'wise', icon: <Globe size={20} />, label: 'Wise Wire Transfer', sub: 'USD · EUR · GBP', method: 'wise_bank' },
              ].map(tab => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => { setActiveTab(tab.key); setFormData(p => ({ ...p, paymentMethod: tab.method })); }}
                  style={{
                    padding: '1rem 0.85rem',
                    borderRadius: '16px',
                    border: activeTab === tab.key ? `2px solid ${RED}` : '2px solid #e8e8e8',
                    background: activeTab === tab.key ? 'rgba(232,25,44,0.05)' : '#ffffff',
                    color: activeTab === tab.key ? RED : '#555',
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.3rem',
                    cursor: 'pointer', textAlign: 'left', width: '100%',
                    transition: 'all 0.22s ease', boxShadow: activeTab === tab.key ? `0 0 0 4px rgba(232,25,44,0.08)` : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '0.88rem' }}>
                    {tab.icon}{tab.label}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#999', fontWeight: 500 }}>{tab.sub}</div>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">

              {/* ── CARD TAB ── */}
              {activeTab === 'card' && (
                <motion.div
                  key="card"
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28 }}
                  style={{ background: '#ffffff', borderRadius: '20px', border: '1.5px solid #eaeaea', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.07)' }}
                >
                  {/* Card header gradient strip */}
                  <div style={{ height: '4px', background: `linear-gradient(90deg, ${RED}, #ff6b7a, #ff9a56)` }} />
                  
                  <div style={{ padding: '1.75rem' }}>
                    {/* Title row */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.2rem', gap: '1rem' }}>
                      <div>
                        <div style={{ fontSize: '1rem', fontWeight: 800, color: '#111', marginBottom: '2px' }}>Credit Card & Digital Wallets</div>
                        <div style={{ fontSize: '0.78rem', color: '#888' }}>Instant processing · Secure Merchant checkout</div>
                      </div>
                      <div style={{ padding: '0.28rem 0.7rem', background: 'rgba(46,125,50,0.1)', color: '#2e7d32', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 800, whiteSpace: 'nowrap', flexShrink: 0 }}>
                        ✓ Instant
                      </div>
                    </div>

                    {/* Card brand pills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                      {CARD_BRANDS.map(b => (
                        <div key={b.label} style={{
                          padding: '0.3rem 0.65rem', borderRadius: '7px', fontSize: '0.72rem', fontWeight: 700,
                          background: b.bg, color: b.color, display: 'flex', alignItems: 'center', gap: '0.3rem'
                        }}>
                          {b.emoji} {b.label}
                        </div>
                      ))}
                    </div>

                    {/* Primary CTA */}
                    <button
                      type="button"
                      onClick={handleLemonSqueezyCheckout}
                      style={{
                        width: '100%', padding: '1rem 1.5rem',
                        background: `linear-gradient(135deg, ${RED} 0%, #c51225 100%)`,
                        color: '#ffffff', fontSize: '0.95rem', fontWeight: 800,
                        borderRadius: '14px', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                        boxShadow: `0 10px 30px rgba(232,25,44,0.35)`,
                        transition: 'all 0.22s ease', letterSpacing: '-0.01em'
                      }}
                    >
                      <Zap size={17} />
                      Pay Securely with Card / Apple Pay
                      <ArrowRight size={17} />
                    </button>

                    {/* Payoneer alternative */}
                    {payoneer.paymentLink && (
                      <a
                        href={payoneer.paymentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                          marginTop: '0.8rem', padding: '0.75rem',
                          background: '#f7f8fa', color: '#444', borderRadius: '12px',
                          textDecoration: 'none', fontSize: '0.82rem', fontWeight: 700,
                          border: '1.5px solid #eee', transition: 'background 0.2s'
                        }}
                      >
                        Pay via Payoneer Invoice <ExternalLink size={13} />
                      </a>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginTop: '1rem', fontSize: '0.73rem', color: '#bbb', fontWeight: 600 }}>
                      <Lock size={12} />
                      Secured by Lemon Squeezy Merchant Platform
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── WISE TAB ── */}
              {activeTab === 'wise' && (
                <motion.div
                  key="wise"
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28 }}
                  style={{ background: '#ffffff', borderRadius: '20px', border: '1.5px solid #eaeaea', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.07)' }}
                >
                  <div style={{ height: '4px', background: 'linear-gradient(90deg, #2563eb, #7c3aed, #0891b2)' }} />

                  <div style={{ padding: '1.75rem' }}>
                    <div style={{ marginBottom: '1.2rem' }}>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#111', marginBottom: '2px' }}>Wise International Bank Transfer</div>
                      <div style={{ fontSize: '0.78rem', color: '#888' }}>Zero international fees · Local bank accounts worldwide</div>
                    </div>

                    {/* Currency selector */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1.2rem' }}>
                      {WISE_CURRENCIES.map(c => (
                        <button
                          key={c.key}
                          type="button"
                          onClick={() => setWiseCurrency(c.key)}
                          style={{
                            padding: '0.75rem 0.5rem', borderRadius: '12px', border: '1.5px solid',
                            borderColor: wiseCurrency === c.key ? c.color : '#e5e7eb',
                            background: wiseCurrency === c.key ? `${c.color}12` : '#f9fafb',
                            cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s'
                          }}
                        >
                          <div style={{ fontSize: '1.4rem', lineHeight: 1 }}>{c.flag}</div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: wiseCurrency === c.key ? c.color : '#333', marginTop: '4px' }}>{c.label}</div>
                          <div style={{ fontSize: '0.65rem', color: '#999', marginTop: '2px' }}>{c.sublabel}</div>
                        </button>
                      ))}
                    </div>

                    {/* Account details */}
                    <div style={{ background: '#f8faff', borderRadius: '14px', padding: '1.1rem', border: '1px solid #e8edf8' }}>
                      {wiseCurrency === 'usd' && (
                        <>
                          <BankDetailRow k="usd-name" label="Account Holder" value={wise.usd?.accountName} copied={copied} onCopy={handleCopy} />
                          <BankDetailRow k="usd-bank" label="Bank Name" value={wise.usd?.bankName} copied={copied} onCopy={handleCopy} />
                          <BankDetailRow k="usd-rt" label="ACH & Wire Routing" value={wise.usd?.routingNumber} copied={copied} onCopy={handleCopy} highlight />
                          <BankDetailRow k="usd-acc" label="Account Number" value={wise.usd?.accountNumber} copied={copied} onCopy={handleCopy} highlight />
                          <BankDetailRow k="usd-swift" label="SWIFT / BIC" value={wise.usd?.swift} copied={copied} onCopy={handleCopy} />
                        </>
                      )}
                      {wiseCurrency === 'eur' && (
                        <>
                          <BankDetailRow k="eur-name" label="Account Holder" value={wise.eur?.accountName} copied={copied} onCopy={handleCopy} />
                          <BankDetailRow k="eur-bank" label="Bank Name" value={wise.eur?.bankName} copied={copied} onCopy={handleCopy} />
                          <BankDetailRow k="eur-iban" label="IBAN Number" value={wise.eur?.iban} copied={copied} onCopy={handleCopy} highlight />
                          <BankDetailRow k="eur-swift" label="BIC / SWIFT" value={wise.eur?.bicSwift} copied={copied} onCopy={handleCopy} highlight />
                        </>
                      )}
                      {wiseCurrency === 'gbp' && (
                        <>
                          <BankDetailRow k="gbp-name" label="Account Holder" value={wise.gbp?.accountName} copied={copied} onCopy={handleCopy} />
                          <BankDetailRow k="gbp-sort" label="Sort Code" value={wise.gbp?.sortCode} copied={copied} onCopy={handleCopy} highlight />
                          <BankDetailRow k="gbp-acc" label="Account Number" value={wise.gbp?.accountNumber} copied={copied} onCopy={handleCopy} highlight />
                          <BankDetailRow k="gbp-iban" label="IBAN (International)" value={wise.gbp?.iban} copied={copied} onCopy={handleCopy} />
                        </>
                      )}
                    </div>

                    <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(37,99,235,0.06)', borderRadius: '10px', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.76rem', color: '#4b5563', lineHeight: 1.55 }}>
                      <AlertCircle size={14} color="#2563eb" style={{ flexShrink: 0, marginTop: '1px' }} />
                      <span>Add your <strong>Order ID or Email</strong> in the transfer reference note so we can verify your payment instantly.</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* FAQ */}
            <div style={{ marginTop: '2rem', background: '#ffffff', borderRadius: '20px', border: '1.5px solid #eaeaea', padding: '1.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                ❓ Frequently Asked Questions
              </div>
              {[
                { q: 'Are all international cards accepted?', a: 'Yes — Visa, Mastercard, AMEX, Discover, Apple Pay, and Google Pay are all accepted globally.' },
                { q: 'Will I receive an official invoice?', a: 'Yes! A branded PDF receipt is generated instantly and emailed to your billing address upon payment confirmation.' },
                { q: 'How long does verification take?', a: 'Card payments are instant. Wise wire transfers are typically verified within 24 business hours.' },
              ].map((item, i) => (
                <details key={i} style={{ borderTop: '1px solid #f0f0f0', paddingTop: '0.8rem', marginTop: '0.8rem' }}>
                  <summary style={{ cursor: 'pointer', fontSize: '0.83rem', fontWeight: 700, color: '#222', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {item.q}
                    <ChevronDown size={14} color="#999" />
                  </summary>
                  <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem', lineHeight: 1.6, marginBottom: 0 }}>{item.a}</p>
                </details>
              ))}
            </div>
          </motion.div>

          {/* ────── RIGHT COLUMN: FORM ────── */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25, duration: 0.55 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '1.2rem' }}>
              <div style={{ width: '28px', height: '28px', background: '#111', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.82rem', fontWeight: 900, color: '#fff', flexShrink: 0 }}>2</div>
              <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111', letterSpacing: '-0.02em' }}>Confirm Payment Details</span>
            </div>

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.97 }}
                  onSubmit={handleSubmit}
                  style={{ background: '#ffffff', borderRadius: '20px', border: '1.5px solid #eaeaea', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.07)' }}
                >
                  <div style={{ height: '4px', background: 'linear-gradient(90deg, #111, #333, #555)' }} />
                  <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

                    <p style={{ fontSize: '0.8rem', color: '#888', margin: 0, lineHeight: 1.6 }}>
                      Enter your transaction details for instant confirmation & receipt generation.
                    </p>

                    {/* Two column fields */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                      <FormField label="Full Name *" id="fullName" placeholder="John Smith"
                        value={formData.fullName} onChange={v => setFormData(p => ({ ...p, fullName: v }))} />
                      <FormField label="Email *" id="email" type="email" placeholder="john@company.com"
                        value={formData.email} onChange={v => setFormData(p => ({ ...p, email: v }))} />
                    </div>

                    <FormField label="Service / Package *" id="service" placeholder="e.g. Brand Identity Design"
                      value={formData.selectedService} onChange={v => setFormData(p => ({ ...p, selectedService: v }))} />

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.8rem' }}>
                      <FormField label={`Amount (${formData.currency}) *`} id="amount" type="number" placeholder="e.g. 499"
                        value={formData.paidAmount} onChange={handleAmountChange}
                        error={amountMismatch ? `Expected: $${expectedAmount}` : ''} />
                      {/* Currency select */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#555', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          Currency
                        </label>
                        <select
                          value={formData.currency}
                          onChange={e => setFormData(p => ({ ...p, currency: e.target.value }))}
                          style={{
                            width: '100%', padding: '0.75rem 0.9rem', borderRadius: '12px',
                            border: '1.5px solid #e5e7eb', background: '#fafafa',
                            fontSize: '0.88rem', fontWeight: 700, color: '#111',
                            cursor: 'pointer', outline: 'none'
                          }}
                        >
                          <option value="USD">🇺🇸 USD</option>
                          <option value="EUR">🇪🇺 EUR</option>
                          <option value="GBP">🇬🇧 GBP</option>
                          <option value="CAD">🇨🇦 CAD</option>
                          <option value="AUD">🇦🇺 AUD</option>
                        </select>
                      </div>
                    </div>

                    <FormField label="Transaction ID / Wire Reference *" id="txn" placeholder="e.g. LS-98124 or Wise Ref #CBD891"
                      value={formData.transactionId} onChange={v => setFormData(p => ({ ...p, transactionId: v }))} />

                    {/* File upload zone */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#555', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Upload Receipt / Screenshot (Optional)
                      </label>
                      <label htmlFor="proofFile" style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        gap: '0.5rem', padding: '1.5rem', borderRadius: '14px',
                        border: `2px dashed ${filePreview ? '#4caf50' : '#ddd'}`,
                        background: filePreview ? 'rgba(76,175,80,0.05)' : '#fafafa',
                        cursor: 'pointer', transition: 'all 0.2s ease'
                      }}>
                        {filePreview ? (
                          <img src={filePreview} alt="Preview" style={{ maxHeight: '80px', maxWidth: '100%', objectFit: 'contain', borderRadius: '8px' }} />
                        ) : (
                          <>
                            <Upload size={22} color="#bbb" />
                            <div style={{ fontSize: '0.78rem', color: '#888', textAlign: 'center' }}>
                              <strong style={{ color: '#555' }}>Click to upload</strong> or drag & drop<br />
                              PNG, JPG, WEBP, PDF · Max 5MB
                            </div>
                          </>
                        )}
                        <input id="proofFile" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={handleFileChange} style={{ display: 'none' }} />
                      </label>
                    </div>

                    {/* Optional note */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#555', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Message / Note (Optional)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Any additional notes for the team..."
                        value={formData.message}
                        onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                        style={{
                          width: '100%', padding: '0.75rem 0.9rem', borderRadius: '12px',
                          border: '1.5px solid #e5e7eb', background: '#fafafa',
                          fontSize: '0.88rem', color: '#111', resize: 'none',
                          fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    {/* Submit CTA */}
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        width: '100%', padding: '1rem 1.5rem',
                        background: loading ? '#ccc' : 'linear-gradient(135deg, #111 0%, #333 100%)',
                        color: '#ffffff', fontSize: '0.95rem', fontWeight: 800,
                        borderRadius: '14px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                        boxShadow: loading ? 'none' : '0 8px 24px rgba(0,0,0,0.2)',
                        transition: 'all 0.22s ease', letterSpacing: '-0.01em',
                        marginTop: '0.25rem'
                      }}
                    >
                      {loading ? (
                        <><Loader2 size={17} style={{ animation: 'spin 1s linear infinite' }} /> Processing...</>
                      ) : (
                        <><span>Submit Payment Details</span><ArrowRight size={17} /></>
                      )}
                    </button>

                    <p style={{ textAlign: 'center', fontSize: '0.71rem', color: '#c0c0c0', margin: 0, lineHeight: 1.5 }}>
                      🔒 Your payment details are protected. By submitting you agree to CreatifyBD's&nbsp;
                      <Link to="/terms" style={{ color: '#999' }}>Terms of Service</Link>.
                    </p>
                  </div>
                </motion.form>
              ) : (
                /* ── SUCCESS STATE ── */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
                  style={{ background: '#ffffff', borderRadius: '24px', border: '2px solid #4caf50', overflow: 'hidden', boxShadow: '0 20px 60px rgba(76,175,80,0.15)' }}
                >
                  <div style={{ height: '5px', background: 'linear-gradient(90deg, #4caf50, #66bb6a, #81c784)' }} />
                  <div style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                      style={{ width: '72px', height: '72px', background: 'rgba(76,175,80,0.12)', color: '#4caf50', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}
                    >
                      <CheckCircle2 size={40} />
                    </motion.div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#111', margin: '0 0 0.5rem', letterSpacing: '-0.03em' }}>
                      Payment Submitted!
                    </h2>
                    <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.75rem' }}>
                      Thank you, {formData.fullName}! Your payment details are confirmed. Our team will verify and send your official receipt within 24 hours.
                    </p>

                    <div style={{ background: '#f9fafb', borderRadius: '16px', padding: '1.2rem', textAlign: 'left', marginBottom: '2rem', border: '1px solid #eee' }}>
                      <SummaryRow label="Service" value={formData.selectedService} />
                      <SummaryRow label="Amount" value={`$${formData.paidAmount} ${formData.currency}`} highlight />
                      <SummaryRow label="Transaction Ref" value={formData.transactionId} />
                      <SummaryRow label="Billing Email" value={formData.email} />
                    </div>

                    <Link
                      to="/"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.9rem 2rem', background: `linear-gradient(135deg, ${RED}, #c51225)`,
                        color: '#fff', borderRadius: '12px', textDecoration: 'none', fontWeight: 800, fontSize: '0.9rem',
                        boxShadow: `0 8px 24px rgba(232,25,44,0.3)`
                      }}
                    >
                      Return to Homepage <ArrowRight size={16} />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .payment-two-col { grid-template-columns: 1fr !important; }
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        details summary::-webkit-details-marker { display: none; }
      `}</style>

      <Footer />
    </div>
  );
};

/* ── Reusable sub-components ── */

const FormField = ({ label, id, type = 'text', placeholder, value, onChange, error }) => (
  <div>
    <label htmlFor={id} style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#555', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
      {label}
    </label>
    <input
      id={id}
      type={type}
      required={label.includes('*')}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        width: '100%', padding: '0.75rem 0.9rem', borderRadius: '12px',
        border: `1.5px solid ${error ? '#ef4444' : '#e5e7eb'}`,
        background: '#fafafa', fontSize: '0.88rem', color: '#111', outline: 'none',
        fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.2s'
      }}
    />
    {error && <p style={{ margin: '0.25rem 0 0', fontSize: '0.72rem', color: '#ef4444', fontWeight: 600 }}>{error}</p>}
  </div>
);

const BankDetailRow = ({ k, label, value, copied, onCopy, highlight }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0.55rem 0', borderBottom: '1px solid #edf0f5', gap: '1rem'
  }}>
    <span style={{ fontSize: '0.77rem', color: '#888', fontWeight: 600, flexShrink: 0 }}>{label}</span>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', minWidth: 0 }}>
      <span style={{
        fontSize: '0.82rem', color: '#111', fontWeight: highlight ? 800 : 600,
        fontFamily: highlight ? 'monospace' : 'inherit', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
      }}>
        {value || '—'}
      </span>
      {value && (
        <button
          type="button"
          onClick={() => onCopy(value, k)}
          style={{
            background: copied === k ? 'rgba(76,175,80,0.12)' : 'rgba(0,0,0,0.05)',
            border: 'none', borderRadius: '6px', padding: '3px 6px',
            cursor: 'pointer', color: copied === k ? '#2e7d32' : '#888',
            display: 'flex', alignItems: 'center', flexShrink: 0, transition: 'all 0.2s'
          }}
        >
          {copied === k ? <Check size={12} /> : <Copy size={12} />}
        </button>
      )}
    </div>
  </div>
);

const SummaryRow = ({ label, value, highlight }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #f0f0f0' }}>
    <span style={{ fontSize: '0.8rem', color: '#888', fontWeight: 600 }}>{label}</span>
    <span style={{ fontSize: '0.88rem', fontWeight: highlight ? 900 : 700, color: highlight ? RED : '#111' }}>{value}</span>
  </div>
);

export default PaymentPage;
