import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Copy,
  Check,
  Globe,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Zap
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
  const dbbl = {
    ...siteConfig.dbbl,
    ...(paymentSettings?.dbbl || {}),
    placeholder: paymentSettings?.dbbl?.accountNumber ? false : siteConfig.dbbl.placeholder
  };

  const [searchParams] = useSearchParams();
  const selectedService = searchParams.get('service') || '';
  const linkedOrderId = searchParams.get('orderId') || '';
  const publicOrderId = searchParams.get('publicOrderId') || '';
  const prefillEmail = searchParams.get('email') || '';
  const prefillAmount = searchParams.get('amount') || '';
  const prefillCurrency = searchParams.get('currency') || 'USD';
  const expectedAmount = prefillAmount ? parseFloat(prefillAmount) : null;

  const [activeTab, setActiveTab] = useState('card'); // 'card' | 'wise' | 'dbbl'
  const [wiseCurrency, setWiseCurrency] = useState('usd'); // 'usd' | 'eur' | 'gbp'
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(null);
  const [amountMismatch, setAmountMismatch] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: prefillEmail,
    phone: '',
    companyName: '',
    selectedService: selectedService,
    paymentMethod: 'credit_card',
    paidAmount: prefillAmount,
    currency: prefillCurrency,
    transactionId: '',
    paymentDate: new Date().toISOString().split('T')[0],
    proofFile: null,
    message: '',
    invoiceNumber: publicOrderId || ''
  });

  const handleCopy = (text, field) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(field);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(null), 2000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid file (JPEG, PNG, WEBP, or PDF)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setFormData({ ...formData, proofFile: file });
    }
  };

  const handleAmountChange = (val) => {
    setFormData(prev => ({ ...prev, paidAmount: val }));
    if (expectedAmount !== null && val && parseFloat(val) !== expectedAmount) {
      setAmountMismatch(true);
    } else {
      setAmountMismatch(false);
    }
  };

  const handleLemonSqueezyCheckout = () => {
    const checkoutUrl = lemonSqueezy.checkoutUrl || 'https://lemonsqueezy.com';
    if (window.LemonSqueezy && window.LemonSqueezy.Url) {
      window.LemonSqueezy.Url.Open(checkoutUrl);
    } else {
      window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const requiredFields = ['fullName', 'email', 'selectedService', 'paymentMethod', 'paidAmount', 'transactionId', 'paymentDate'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error('Please fill in all required fields');
        return;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Submitting payment details...');

    try {
      let proofFileUrl = '';
      let proofFileName = '';
      let proofFileSize = 0;
      let proofFileType = '';
      let storagePath = '';

      if (formData.proofFile) {
        const safeName = formData.proofFile.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80);
        storagePath = `payment-proofs/${Date.now()}_${safeName}`;
        const storageRef = ref(storage, storagePath);
        await uploadBytes(storageRef, formData.proofFile);
        proofFileUrl = await getDownloadURL(storageRef);
        proofFileName = safeName;
        proofFileSize = formData.proofFile.size;
        proofFileType = formData.proofFile.type;
      }

      await addDoc(collection(db, 'manualPayments'), {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || '',
        companyName: formData.companyName || '',
        selectedService: formData.selectedService,
        paymentMethod: formData.paymentMethod,
        paidAmount: Number(formData.paidAmount) || formData.paidAmount,
        currency: formData.currency,
        transactionId: formData.transactionId,
        paymentDate: formData.paymentDate,
        proofFileUrl: proofFileUrl,
        proofFileName: proofFileName,
        proofFileSize: proofFileSize,
        proofFileType: proofFileType,
        storagePath: storagePath,
        message: formData.message || '',
        invoiceNumber: formData.invoiceNumber || publicOrderId || '',
        linkedOrderId: linkedOrderId || '',
        publicOrderId: publicOrderId || '',
        expectedAmount: expectedAmount,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        adminNote: ''
      });

      setSubmitted(true);
      toast.success('Payment submitted successfully! Instant order confirmation generated.', { id: toastId });
    } catch (error) {
      console.error('Error submitting payment:', error);
      toast.error('Failed to submit payment. Please try again.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page">
      <SEO
        title="International Checkout & Payment | CreatifyBD"
        description="Secure international payment portal for CreatifyBD creative services. Credit Card, Apple Pay, Payoneer, and Wise Bank Transfer."
        keywords="international payment, credit card payment, wise transfer, payoneer payment, creatifybd checkout"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "International Payment | CreatifyBD",
          "description": "Secure international checkout for CreatifyBD global agency clients",
          "url": `${siteConfig.websiteUrl}/payment`
        }}
      />
      
      <Navbar />
      
      {/* ── Page Header ── */}
      <div className="page-header page-header-light" style={{ padding: '3.5rem 0 2rem' }}>
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="container"
          style={{ textAlign: 'center', maxWidth: '720px' }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '0.35rem 0.9rem',
            background: 'rgba(238,27,46,0.08)',
            border: '1px solid rgba(238,27,46,0.2)',
            borderRadius: '100px',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'var(--red)',
            marginBottom: '1.2rem'
          }}>
            <ShieldCheck size={14} />
            <span>Secure 256-Bit SSL Encrypted Agency Checkout</span>
          </div>

          <h1 className="page-title" style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 0.75rem' }}>
            International <span className="red">Payment Portal</span>
          </h1>
          <p className="page-subtitle" style={{ fontSize: '1rem', color: '#666', lineHeight: 1.6, margin: 0 }}>
            Pay securely for your creative services in USD, EUR, or GBP using Visa, Mastercard, Apple Pay, or Wise Bank Transfer.
          </p>
        </motion.div>
      </div>

      <div className="container" style={{ padding: '2rem 1rem 5rem', maxWidth: '1100px' }}>

        {/* ── Order Summary Card (If Prefilled) ── */}
        {(selectedService || prefillAmount || publicOrderId) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'linear-gradient(135deg, #111111 0%, #1a1a1a 100%)',
              color: '#ffffff',
              borderRadius: '20px',
              padding: '1.5rem 2rem',
              marginBottom: '2.5rem',
              boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.2rem'
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#e8192c', fontWeight: 800, marginBottom: '0.2rem' }}>
                Invoice Details {publicOrderId && `• #${publicOrderId}`}
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                {selectedService || 'Creative Services Package'}
              </div>
              {prefillEmail && <div style={{ fontSize: '0.85rem', color: '#aaa', marginTop: '0.2rem' }}>Billed to: {prefillEmail}</div>}
            </div>

            {prefillAmount && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Amount Due</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff', lineHeight: 1 }}>
                  ${prefillAmount} <span style={{ fontSize: '0.9rem', color: '#e8192c', fontWeight: 700 }}>{prefillCurrency}</span>
                </div>
              </div>
            )}
          </motion.div>
        )}

        <div className="payment-grid">
          {/* Left Column: Payment Options */}
          <div className="payment-instructions">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
              
              <h2 style={{ marginBottom: '1.2rem', fontSize: '1.4rem', fontWeight: 800 }}>
                1. Select Payment Method
              </h2>

              {/* Payment Method Tabs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => { setActiveTab('card'); setFormData(p => ({ ...p, paymentMethod: 'credit_card' })); }}
                  style={{
                    padding: '1rem',
                    borderRadius: '14px',
                    border: activeTab === 'card' ? '2px solid var(--red)' : '1.5px solid var(--border)',
                    background: activeTab === 'card' ? 'rgba(232,25,44,0.06)' : '#fff',
                    color: activeTab === 'card' ? 'var(--red)' : 'var(--ink)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <CreditCard size={22} />
                  <span>Credit Card / Apple Pay</span>
                  <span style={{ fontSize: '0.68rem', opacity: 0.7, fontWeight: 500 }}>Lemon Squeezy & Payoneer</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('wise'); setFormData(p => ({ ...p, paymentMethod: 'wise_bank' })); }}
                  style={{
                    padding: '1rem',
                    borderRadius: '14px',
                    border: activeTab === 'wise' ? '2px solid var(--red)' : '1.5px solid var(--border)',
                    background: activeTab === 'wise' ? 'rgba(232,25,44,0.06)' : '#fff',
                    color: activeTab === 'wise' ? 'var(--red)' : 'var(--ink)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Globe size={22} />
                  <span>Wise Bank Wire</span>
                  <span style={{ fontSize: '0.68rem', opacity: 0.7, fontWeight: 500 }}>USD, EUR, GBP Transfers</span>
                </button>
              </div>

              {/* ── CARD / APPLE PAY SECTION ── */}
              {activeTab === 'card' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="payment-method-card" style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '18px', padding: '1.5rem' }}>
                  <div className="payment-method-header" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.2rem' }}>
                    <CreditCard size={24} style={{ color: 'var(--red)' }} />
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Credit Card & Digital Wallets</h3>
                      <p style={{ margin: 0, fontSize: '0.78rem', color: '#777' }}>Instant processing with 256-bit encryption</p>
                    </div>
                    <span style={{ marginLeft: 'auto', fontSize: '0.72rem', background: 'rgba(76,175,80,0.15)', color: '#2e7d32', padding: '0.25rem 0.65rem', borderRadius: '100px', fontWeight: 800 }}>
                      Instant Confirmation
                    </span>
                  </div>

                  {/* Supported Cards Icons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.8rem', background: '#fafafa', borderRadius: '12px', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#888', textTransform: 'uppercase' }}>Accepted:</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, background: '#fff', padding: '0.2rem 0.6rem', borderRadius: '6px', border: '1px solid #eee' }}>💳 Visa</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, background: '#fff', padding: '0.2rem 0.6rem', borderRadius: '6px', border: '1px solid #eee' }}>💳 Mastercard</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, background: '#fff', padding: '0.2rem 0.6rem', borderRadius: '6px', border: '1px solid #eee' }}>💳 AMEX</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, background: '#fff', padding: '0.2rem 0.6rem', borderRadius: '6px', border: '1px solid #eee' }}>🍎 Apple Pay</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, background: '#fff', padding: '0.2rem 0.6rem', borderRadius: '6px', border: '1px solid #eee' }}>🌐 Google Pay</span>
                  </div>

                  {/* Main Action Button */}
                  <button
                    type="button"
                    onClick={handleLemonSqueezyCheckout}
                    style={{
                      width: '100%',
                      padding: '1.1rem',
                      background: 'var(--red)',
                      color: '#ffffff',
                      fontSize: '1rem',
                      fontWeight: 800,
                      borderRadius: '14px',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.6rem',
                      boxShadow: '0 8px 24px rgba(232,25,44,0.3)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Zap size={18} />
                    <span>Pay with Credit Card / Apple Pay →</span>
                  </button>
                  <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#999', marginTop: '0.75rem' }}>
                    Opens secure Merchant checkout overlay. Instant receipt issued upon payment.
                  </p>

                  {/* Payoneer Option */}
                  {payoneer.paymentLink && (
                    <div style={{ marginTop: '1.5rem', paddingTop: '1.2rem', borderTop: '1px solid #eee' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#444', marginBottom: '0.5rem' }}>Alternative: Payoneer Card Invoice</div>
                      <a
                        href={payoneer.paymentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          padding: '0.85rem',
                          background: '#f5f5f7',
                          color: '#111',
                          borderRadius: '12px',
                          textDecoration: 'none',
                          fontWeight: 700,
                          fontSize: '0.88rem'
                        }}
                      >
                        Pay via Payoneer Invoice <ExternalLink size={14} />
                      </a>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── WISE BANK TRANSFER SECTION ── */}
              {activeTab === 'wise' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="payment-method-card" style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '18px', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.2rem' }}>
                    <Globe size={24} style={{ color: '#2563eb' }} />
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Wise International Bank Transfer</h3>
                      <p style={{ margin: 0, fontSize: '0.78rem', color: '#777' }}>Direct wire to local USD, EUR, or GBP accounts</p>
                    </div>
                  </div>

                  {/* Currency Selector Sub-tabs */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.2rem' }}>
                    <button
                      type="button"
                      onClick={() => setWiseCurrency('usd')}
                      style={{
                        flex: 1, padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd',
                        background: wiseCurrency === 'usd' ? '#111' : '#f8f8f8',
                        color: wiseCurrency === 'usd' ? '#fff' : '#444',
                        fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer'
                      }}
                    >
                      🇺🇸 USD (US Wire/ACH)
                    </button>
                    <button
                      type="button"
                      onClick={() => setWiseCurrency('eur')}
                      style={{
                        flex: 1, padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd',
                        background: wiseCurrency === 'eur' ? '#111' : '#f8f8f8',
                        color: wiseCurrency === 'eur' ? '#fff' : '#444',
                        fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer'
                      }}
                    >
                      🇪🇺 EUR (SEPA IBAN)
                    </button>
                    <button
                      type="button"
                      onClick={() => setWiseCurrency('gbp')}
                      style={{
                        flex: 1, padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd',
                        background: wiseCurrency === 'gbp' ? '#111' : '#f8f8f8',
                        color: wiseCurrency === 'gbp' ? '#fff' : '#444',
                        fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer'
                      }}
                    >
                      🇬🇧 GBP (UK Sort Code)
                    </button>
                  </div>

                  {/* Account Details Box */}
                  <div style={{ background: '#f9fafb', borderRadius: '14px', padding: '1.2rem', border: '1px solid #f0f0f0' }}>
                    {wiseCurrency === 'usd' && (
                      <div className="payment-details">
                        <DetailRow label="Account Holder" value={wise.usd?.accountName || 'CreatifyBD Agency'} onCopy={() => handleCopy(wise.usd?.accountName, 'usd-name')} copied={copied === 'usd-name'} />
                        <DetailRow label="Bank Name" value={wise.usd?.bankName || 'Evolve Bank & Trust (Wise)'} />
                        <DetailRow label="ACH & Wire Routing" value={wise.usd?.routingNumber || '026073150'} onCopy={() => handleCopy(wise.usd?.routingNumber, 'usd-rt')} copied={copied === 'usd-rt'} />
                        <DetailRow label="Account Number" value={wise.usd?.accountNumber || '2981048123'} onCopy={() => handleCopy(wise.usd?.accountNumber, 'usd-acc')} copied={copied === 'usd-acc'} />
                        <DetailRow label="SWIFT / BIC" value={wise.usd?.swift || 'EVOLUS33'} onCopy={() => handleCopy(wise.usd?.swift, 'usd-swift')} copied={copied === 'usd-swift'} />
                      </div>
                    )}

                    {wiseCurrency === 'eur' && (
                      <div className="payment-details">
                        <DetailRow label="Account Holder" value={wise.eur?.accountName || 'CreatifyBD Agency'} onCopy={() => handleCopy(wise.eur?.accountName, 'eur-name')} copied={copied === 'eur-name'} />
                        <DetailRow label="Bank Name" value={wise.eur?.bankName || 'Wise Europe SA'} />
                        <DetailRow label="IBAN Number" value={wise.eur?.iban || 'BE98 3630 1823 4910'} onCopy={() => handleCopy(wise.eur?.iban, 'eur-iban')} copied={copied === 'eur-iban'} />
                        <DetailRow label="BIC / SWIFT" value={wise.eur?.bicSwift || 'TRWIBE21XXX'} onCopy={() => handleCopy(wise.eur?.bicSwift, 'eur-swift')} copied={copied === 'eur-swift'} />
                      </div>
                    )}

                    {wiseCurrency === 'gbp' && (
                      <div className="payment-details">
                        <DetailRow label="Account Holder" value={wise.gbp?.accountName || 'CreatifyBD Agency'} onCopy={() => handleCopy(wise.gbp?.accountName, 'gbp-name')} copied={copied === 'gbp-name'} />
                        <DetailRow label="Sort Code" value={wise.gbp?.sortCode || '23-14-70'} onCopy={() => handleCopy(wise.gbp?.sortCode, 'gbp-sort')} copied={copied === 'gbp-sort'} />
                        <DetailRow label="Account Number" value={wise.gbp?.accountNumber || '84910283'} onCopy={() => handleCopy(wise.gbp?.accountNumber, 'gbp-acc')} copied={copied === 'gbp-acc'} />
                        <DetailRow label="IBAN (International)" value={wise.gbp?.iban || 'GB12 TRWI 2314 7084 9102 83'} onCopy={() => handleCopy(wise.gbp?.iban, 'gbp-iban')} copied={copied === 'gbp-iban'} />
                      </div>
                    )}
                  </div>

                  <div style={{ fontSize: '0.78rem', color: '#777', marginTop: '1rem', background: 'rgba(37,99,235,0.06)', padding: '0.75rem 1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertCircle size={15} style={{ color: '#2563eb', flexShrink: 0 }} />
                    <span>Include your Order ID or Email in the transfer reference note so we can verify instantly.</span>
                  </div>
                </motion.div>
              )}

              {/* FAQ */}
              <div className="payment-faq" style={{ marginTop: '2rem' }}>
                <h3 style={{ marginBottom: '1.2rem', fontSize: '1.2rem', fontWeight: 700 }}>
                  Frequently Asked Questions
                </h3>
                <div className="faq-item">
                  <p className="faq-question">Are international credit cards accepted?</p>
                  <p className="faq-answer">
                    Yes! We accept all major international Visa, Mastercard, AMEX, Apple Pay, and Google Pay cards via secure Merchant checkout.
                  </p>
                </div>
                <div className="faq-item">
                  <p className="faq-question">Will I get an official invoice & receipt?</p>
                  <p className="faq-answer">
                    Yes! Once payment details are submitted, an instant digital receipt is generated and emailed to your billing address.
                  </p>
                </div>
              </div>

            </motion.div>
          </div>

          {/* Right Column: Payment Proof & Confirmation Form */}
          <div className="payment-form-wrapper">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onSubmit={handleSubmit}
                  className="payment-form"
                  style={{ background: '#ffffff', border: '1.5px solid var(--border)', borderRadius: '20px', padding: '2rem', boxShadow: '0 12px 36px rgba(0,0,0,0.06)' }}
                >
                  <h2 style={{ marginBottom: '0.4rem', fontSize: '1.5rem', fontWeight: 800 }}>
                    2. Confirm & Submit Details
                  </h2>
                  <p style={{ fontSize: '0.83rem', color: '#777', marginBottom: '1.5rem' }}>
                    Enter your transaction details below for instant confirmation & invoice generation.
                  </p>

                  <div className="form-group" style={{ marginBottom: '1.1rem' }}>
                    <label className="luxury-label" htmlFor="fullName">Full Name *</label>
                    <input
                      id="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. John Smith"
                      className="admin-input"
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '1.1rem' }}>
                    <label className="luxury-label" htmlFor="email">Email Address *</label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. john@company.com"
                      className="admin-input"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.1rem' }}>
                    <div className="form-group">
                      <label className="luxury-label" htmlFor="selectedService">Service / Package *</label>
                      <input
                        id="selectedService"
                        type="text"
                        required
                        value={formData.selectedService}
                        onChange={(e) => setFormData({ ...formData, selectedService: e.target.value })}
                        placeholder="e.g. Website Design"
                        className="admin-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="luxury-label" htmlFor="paidAmount">Amount ({formData.currency}) *</label>
                      <input
                        id="paidAmount"
                        type="number"
                        step="any"
                        required
                        value={formData.paidAmount}
                        onChange={(e) => handleAmountChange(e.target.value)}
                        placeholder="e.g. 500"
                        className="admin-input"
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '1.1rem' }}>
                    <label className="luxury-label" htmlFor="transactionId">Transaction ID / Wire Reference *</label>
                    <input
                      id="transactionId"
                      type="text"
                      required
                      value={formData.transactionId}
                      onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                      placeholder="e.g. LS-98124 or Wise Ref #CBD891"
                      className="admin-input"
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label className="luxury-label" htmlFor="proofFile">Upload Receipt / Screenshot (Optional)</label>
                    <input
                      id="proofFile"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      onChange={handleFileChange}
                      className="admin-input"
                      style={{ padding: '0.6rem' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-red"
                    style={{
                      width: '100%',
                      padding: '1.1rem',
                      borderRadius: '14px',
                      fontSize: '1rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer'
                    }}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="spin" />
                        <span>Processing Confirmation...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Payment Details</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>

                  <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#999', marginTop: '1rem' }}>
                    🔒 Guaranteed secure processing. Your payment details are protected under CreatifyBD Client Agreement.
                  </p>
                </motion.form>
              ) : (
                /* Success Confirmation State */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    background: '#ffffff',
                    border: '2px solid #4caf50',
                    borderRadius: '24px',
                    padding: '2.5rem 2rem',
                    textAlign: 'center',
                    boxShadow: '0 16px 40px rgba(76,175,80,0.12)'
                  }}
                >
                  <div style={{ width: '64px', height: '64px', background: 'rgba(76,175,80,0.12)', color: '#4caf50', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <CheckCircle2 size={36} />
                  </div>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#111' }}>
                    Payment Submitted!
                  </h2>
                  <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                    Thank you! Your payment details have been received. An order confirmation & receipt has been logged.
                  </p>

                  <div style={{ background: '#fafafa', borderRadius: '16px', padding: '1.2rem', textAlign: 'left', marginBottom: '2rem', border: '1px solid #eee' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                      <span style={{ color: '#888' }}>Service:</span>
                      <strong style={{ color: '#111' }}>{formData.selectedService}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                      <span style={{ color: '#888' }}>Amount:</span>
                      <strong style={{ color: 'var(--red)' }}>${formData.paidAmount} {formData.currency}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ color: '#888' }}>Transaction Ref:</span>
                      <strong style={{ color: '#111' }}>{formData.transactionId}</strong>
                    </div>
                  </div>

                  <Link to="/" className="btn-red" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', borderRadius: '12px', textDecoration: 'none', fontWeight: 700 }}>
                    Return to Homepage →
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

const DetailRow = ({ label, value, onCopy, copied }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #eeeeee' }}>
    <span style={{ fontSize: '0.82rem', color: '#666', fontWeight: 600 }}>{label}</span>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <span style={{ fontSize: '0.88rem', color: '#111', fontWeight: 700, fontFamily: 'monospace' }}>{value}</span>
      {onCopy && (
        <button
          type="button"
          onClick={onCopy}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied ? '#2e7d32' : '#888', padding: '4px' }}
          aria-label={`Copy ${label}`}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      )}
    </div>
  </div>
);

export default PaymentPage;
