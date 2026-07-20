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
  Check
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

  // Real admin-entered values (Firestore settings/payment) take priority;
  // siteConfig stays as the safe placeholder shown before that loads or if
  // the admin hasn't filled it in yet.
  const payoneer = {
    ...siteConfig.payoneer,
    ...(paymentSettings?.payoneer || {}),
    placeholder: paymentSettings?.payoneer?.accountName ? false : siteConfig.payoneer.placeholder
  };
  const dbbl = {
    ...siteConfig.dbbl,
    ...(paymentSettings?.dbbl || {}),
    placeholder: paymentSettings?.dbbl?.accountNumber ? false : siteConfig.dbbl.placeholder
  };

  const [searchParams] = useSearchParams();
  const selectedService = searchParams.get('service') || '';
  const linkedOrderId = searchParams.get('orderId') || '';          // clientAccessToken = doc ID
  const publicOrderId = searchParams.get('publicOrderId') || '';
  const prefillEmail = searchParams.get('email') || '';
  const prefillAmount = searchParams.get('amount') || '';
  const expectedAmount = prefillAmount ? parseFloat(prefillAmount) : null;

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
    paymentMethod: 'payoneer',
    paidAmount: prefillAmount,
    currency: 'USD',
    transactionId: '',
    paymentDate: '',
    proofFile: null,
    message: '',
    invoiceNumber: publicOrderId || ''
  });

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(null), 2000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type — JPG, PNG, WEBP, PDF accepted
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid file (JPEG, PNG, WEBP, or PDF)');
        return;
      }
      // Validate file size (max 5MB)
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['fullName', 'email', 'phone', 'selectedService', 'paymentMethod', 'paidAmount', 'transactionId', 'paymentDate', 'proofFile'];
    for (const field of requiredFields) {
      if (!formData[field] || (field === 'proofFile' && !formData.proofFile)) {
        toast.error('Please fill in all required fields');
        return;
      }
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Submitting payment proof...');

    try {
      // Upload proof file to Firebase Storage
      // Sanitize file name: strip special chars, keep extension
      const safeName = formData.proofFile.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80);
      const proofFileName = `payment-proofs/${Date.now()}_${safeName}`;
      const storageRef = ref(storage, proofFileName);
      await uploadBytes(storageRef, formData.proofFile);
      const proofFileUrl = await getDownloadURL(storageRef);

      // Save payment proof to manualPayments only — admin will verify before updating order
      await addDoc(collection(db, 'manualPayments'), {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        companyName: formData.companyName || '',
        selectedService: formData.selectedService,
        paymentMethod: formData.paymentMethod,
        paidAmount: Number(formData.paidAmount) || formData.paidAmount,
        currency: formData.currency,
        transactionId: formData.transactionId,
        paymentDate: formData.paymentDate,
        proofFileUrl: proofFileUrl,
        proofFileName: safeName,
        proofFileSize: formData.proofFile.size,
        proofFileType: formData.proofFile.type,
        storagePath: proofFileName,
        message: formData.message || '',
        invoiceNumber: formData.invoiceNumber || '',
        linkedOrderId: linkedOrderId || '',       // clientAccessToken = order doc ID
        publicOrderId: publicOrderId || '',       // human-readable CBD-XXXXXXX
        expectedAmount: expectedAmount,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        adminNote: ''
      });

      // NOTE: Order status will ONLY be updated by admin via /admin/payments manual verification
      // Do NOT update order document here — this prevents spoofing payment status from the frontend

      setSubmitted(true);
      toast.success('Payment proof submitted. Pending manual verification.', { id: toastId });
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        companyName: '',
        selectedService: '',
        paymentMethod: 'payoneer',
        paidAmount: '',
        currency: 'BDT',
        transactionId: '',
        paymentDate: '',
        proofFile: null,
        message: '',
        invoiceNumber: ''
      });
    } catch (error) {
      console.error('Error submitting payment proof:', error);
      toast.error('Failed to submit payment proof. Please try again.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page">
      <SEO
        title="Manual Payment | CreatifyBD"
        description="Submit manual payment proof for CreatifyBD services through Payoneer or DBBL bank transfer. Payments are verified manually."
        keywords="manual payment, payoneer payment, bank transfer, creatifybd payment"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Manual Payment | CreatifyBD",
          "description": "Submit your manual payment proof for CreatifyBD services",
          "url": `${siteConfig.websiteUrl}/payment`
        }}
      />
      
      <Navbar />
      
      <div className="page-header page-header-light">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container"
        >
          <h1 className="page-title">Manual <span className="red">Payment</span></h1>
          <p className="page-subtitle">
            Complete your payment manually using Payoneer or DBBL Bank Transfer. 
            After payment, submit your transaction details and payment proof for verification.
          </p>
        </motion.div>
      </div>

      <div className="container" style={{ padding: '4rem 1rem' }}>
        <div className="payment-grid">
          {/* Payment Instructions */}
          <div className="payment-instructions">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 style={{ marginBottom: '2rem', fontSize: '1.8rem', fontWeight: 700 }}>
                Choose Payment Method
              </h2>

              {/* Payoneer */}
              <div className="payment-method-card">
                <div className="payment-method-header">
                  <CreditCard size={24} style={{ color: 'var(--red)' }} />
                  <h3>Payoneer</h3>
                  <span style={{ marginLeft: 'auto', fontSize: '0.75rem', background: 'rgba(76,175,80,0.15)', color: '#4caf50', padding: '0.2rem 0.6rem', borderRadius: '20px', fontWeight: 700 }}>Recommended</span>
                </div>

                {payoneer.placeholder ? (
                  <div className="payment-placeholder-warning">
                    <AlertCircle size={20} style={{ marginRight: '0.5rem' }} />
                    <p>Payment details will be shared after order confirmation. Please contact us for payment information.</p>
                    <Link to="/contact" className="btn-red" style={{ marginTop: '1rem', display: 'inline-block' }}>Contact for Payment Details</Link>
                  </div>
                ) : (
                  <>
                    <div className="payment-details">
                      <div className="payment-detail-row">
                        <span className="payment-label">Recipient</span>
                        <span className="payment-value">{payoneer.accountName || 'Contact for details'}</span>
                      </div>
                      <div className="payment-detail-row">
                        <span className="payment-label">Currency</span>
                        <span className="payment-value">{payoneer.currency}</span>
                      </div>
                    </div>

                    <div className="payment-note" style={{ marginTop: '1rem' }}>
                      <AlertCircle size={16} style={{ marginRight: '0.5rem', flexShrink: 0 }} />
                      <span>{payoneer.note}</span>
                    </div>

                    {payoneer.paymentLink && (
                      <>
                        <a
                          href={payoneer.paymentLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-red"
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem', width: '100%', padding: '0.9rem', borderRadius: '10px', fontSize: '1rem', fontWeight: 700, textDecoration: 'none' }}
                        >
                          Pay with Payoneer →
                        </a>
                        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--section-subtext, #888)', marginTop: '0.75rem' }}>
                          Opens Payoneer secure checkout. Enter your exact order amount.
                        </p>
                      </>
                    )}
                  </>
                )}
              </div>

              {/* DBBL Bank Transfer */}
              <div className="payment-method-card">
                <div className="payment-method-header">
                  <CreditCard size={24} style={{ color: 'var(--red)' }} />
                  <h3>DBBL Bank Transfer</h3>
                </div>
                {dbbl.placeholder ? (
                  <div className="payment-placeholder-warning">
                    <AlertCircle size={20} style={{ marginRight: '0.5rem' }} />
                    <p>Payment details will be shared after order confirmation. Please contact us for payment information.</p>
                    <Link to="/contact" className="btn-red" style={{ marginTop: '1rem', display: 'inline-block' }}>Contact for Payment Details</Link>
                  </div>
                ) : (
                  <div className="payment-details">
                    <div className="payment-detail-row">
                      <span className="payment-label">Bank Name</span>
                      <span className="payment-value">{dbbl.bankName}</span>
                    </div>
                    <div className="payment-detail-row">
                      <span className="payment-label">Account Name</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="payment-value">{dbbl.accountName}</span>
                        <button 
                          type="button"
                          onClick={() => handleCopy(dbbl.accountName, 'dbbl-name')}
                          className="copy-btn"
                          aria-label="Copy account name"
                        >
                          {copied === 'dbbl-name' ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>
                    <div className="payment-detail-row">
                      <span className="payment-label">Account Number</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="payment-value">{dbbl.accountNumber}</span>
                        <button 
                          type="button"
                          onClick={() => handleCopy(dbbl.accountNumber, 'dbbl-account')}
                          className="copy-btn"
                          aria-label="Copy account number"
                        >
                          {copied === 'dbbl-account' ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>
                    <div className="payment-detail-row">
                      <span className="payment-label">Branch</span>
                      <span className="payment-value">{dbbl.branch}</span>
                    </div>
                    {dbbl.routingNumber && (
                      <div className="payment-detail-row">
                        <span className="payment-label">Routing Number</span>
                        <span className="payment-value">{dbbl.routingNumber}</span>
                      </div>
                    )}
                    <div className="payment-note">
                      <AlertCircle size={16} style={{ marginRight: '0.5rem' }} />
                      Payment Reference: {dbbl.paymentReference}
                    </div>
                  </div>
                )}
              </div>

              {/* FAQ */}
              <div className="payment-faq">
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.3rem', fontWeight: 600 }}>
                  Payment FAQ
                </h3>
                <div className="faq-item">
                  <p className="faq-question">Is payment automatic?</p>
                  <p className="faq-answer">
                    No. Payments are verified manually after you submit your transaction details and payment proof.
                  </p>
                </div>
                <div className="faq-item">
                  <p className="faq-question">Can I pay through SSL Commerz?</p>
                  <p className="faq-answer">
                    Not at the moment. We currently accept manual payment through Payoneer and DBBL Bank Transfer.
                  </p>
                </div>
                <div className="faq-item">
                  <p className="faq-question">How long does verification take?</p>
                  <p className="faq-answer">{siteConfig.paymentInstructions.verificationTime}</p>
                </div>
                <div className="faq-item">
                  <p className="faq-question">What should I do after sending payment?</p>
                  <p className="faq-answer">
                    Submit the payment proof form with transaction ID, amount, payment date and screenshot or receipt.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Payment Proof Form */}
          <div className="payment-form-wrapper">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: 0.2 }}
                  onSubmit={handleSubmit}
                  className="payment-form"
                >
                  <h2 style={{ marginBottom: '2rem', fontSize: '1.8rem', fontWeight: 700 }}>
                    Submit Payment Proof
                  </h2>

                  <div className="form-group">
                    <label className="luxury-label" htmlFor="fullName">Full Name *</label>
                    <input
                      id="fullName"
                      type="text"
                      required
                      className="luxury-input"
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="luxury-label" htmlFor="email">Email Address *</label>
                      <input
                        id="email"
                        type="email"
                        required
                        className="luxury-input"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="form-group">
                      <label className="luxury-label" htmlFor="phone">WhatsApp / Phone *</label>
                      <input
                        id="phone"
                        type="tel"
                        required
                        className="luxury-input"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+880 1XXX XXXXXX"
                      />
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="luxury-label" htmlFor="companyName">Company Name</label>
                      <input
                        id="companyName"
                        type="text"
                        className="luxury-input"
                        value={formData.companyName}
                        onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                        placeholder="Your Company Ltd."
                      />
                    </div>
                    <div className="form-group">
                      <label className="luxury-label" htmlFor="invoiceNumber">Invoice / Order ID</label>
                      <input
                        id="invoiceNumber"
                        type="text"
                        className="luxury-input"
                        value={formData.invoiceNumber}
                        onChange={e => setFormData({ ...formData, invoiceNumber: e.target.value })}
                        placeholder="INV-001"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="luxury-label" htmlFor="selectedService">Selected Service / Package *</label>
                    <select
                      id="selectedService"
                      required
                      className="luxury-input"
                      value={formData.selectedService}
                      onChange={e => setFormData({ ...formData, selectedService: e.target.value })}
                    >
                      <option value="">Select a service</option>
                      {formData.selectedService && !siteConfig.services.includes(formData.selectedService) && (
                        <option value={formData.selectedService}>{formData.selectedService}</option>
                      )}
                      {siteConfig.services.map(service => (
                        <option key={service} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="luxury-label" htmlFor="paymentMethod">Payment Method *</label>
                    <select
                      id="paymentMethod"
                      required
                      className="luxury-input"
                      value={formData.paymentMethod}
                      onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                    >
                      <option value="payoneer">Payoneer</option>
                      <option value="dbbl">DBBL Bank Transfer</option>
                    </select>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="luxury-label" htmlFor="paidAmount">Paid Amount *</label>
                      {expectedAmount && (
                        <div style={{ fontSize: '0.8rem', color: '#22c55e', marginBottom: '0.25rem', fontWeight: 600 }}>
                          Expected amount: ${expectedAmount} USD
                        </div>
                      )}
                      <input
                        id="paidAmount"
                        type="number"
                        required
                        className="luxury-input"
                        value={formData.paidAmount}
                        onChange={e => handleAmountChange(e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                      />
                      {amountMismatch && (
                        <div style={{ fontSize: '0.8rem', color: '#ffc107', marginTop: '0.25rem' }}>
                          ⚠ Amount does not match expected ${expectedAmount} USD. Proceed only if intentional.
                        </div>
                      )}
                    </div>
                    <div className="form-group">
                      <label className="luxury-label" htmlFor="currency">Currency *</label>
                      <select
                        id="currency"
                        required
                        className="luxury-input"
                        value={formData.currency}
                        onChange={e => setFormData({ ...formData, currency: e.target.value })}
                      >
                        <option value="BDT">BDT</option>
                        <option value="USD">USD</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="luxury-label" htmlFor="transactionId">Transaction ID / Reference *</label>
                      <input
                        type="text"
                        id="transactionId"
                        required
                        className="luxury-input"
                        value={formData.transactionId}
                        onChange={e => setFormData({ ...formData, transactionId: e.target.value })}
                        placeholder="TXN123456789"
                      />
                    </div>
                    <div className="form-group">
                      <label className="luxury-label" htmlFor="paymentDate">Payment Date *</label>
                      <input
                        type="date"
                        id="paymentDate"
                        required
                        className="luxury-input"
                        value={formData.paymentDate}
                        onChange={e => setFormData({ ...formData, paymentDate: e.target.value })}
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="luxury-label" htmlFor="proofFile">Payment Proof Upload *</label>
                    <div className="file-upload-wrapper">
                      <input
                        type="file"
                        id="proofFile"
                        required
                        accept="image/jpeg,image/png,image/jpg,image/webp,application/pdf"
                        onChange={handleFileChange}
                        className="file-input"
                      />
                      <label htmlFor="proofFile" className="file-upload-label">
                        <Upload size={20} />
                        <span>{formData.proofFile ? formData.proofFile.name : 'Choose file (JPEG, PNG, WEBP, PDF — Max 5MB)'}</span>
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="luxury-label" htmlFor="message">Message / Project Details</label>
                    <textarea
                      id="message"
                      className="luxury-input"
                      style={{ height: '120px', paddingTop: '1rem' }}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Any additional details about your payment or project..."
                    />
                  </div>

                  <button type="submit" disabled={loading} className="btn-huge-red w-full">
                    {loading ? (
                      <>Submitting... <Loader2 size={18} className="animate-spin" style={{ marginLeft: '1rem' }} /></>
                    ) : (
                      <>Submit Payment Proof <Upload size={18} style={{ marginLeft: '1rem' }} /></>
                    )}
                  </button>

                  <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--section-subtext)', textAlign: 'center' }}>
                    Your payment will be marked as "Pending Verification" until our team reviews it.
                  </p>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="payment-success"
                >
                  <CheckCircle2 size={80} color="var(--red)" style={{ marginBottom: '2rem' }} />
                  <h2 className="success-title">Payment Proof Submitted</h2>
                  <p className="success-desc">
                    Thank you. Your payment proof has been submitted successfully. 
                    Your payment is now <strong>pending manual verification</strong>. 
                    Our team will contact you shortly.
                  </p>
                  <div className="success-status">
                    <AlertCircle size={20} style={{ marginRight: '0.5rem' }} />
                    <span>Status: Pending Verification</span>
                  </div>
                  <button 
                    onClick={() => setSubmitted(false)} 
                    className="btn-red" 
                    style={{ marginTop: '2.5rem' }}
                  >
                    Submit Another Payment
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Footer />

      <style>{`
        .payment-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        @media (max-width: 968px) {
          .payment-grid {
            grid-template-columns: 1fr;
          }
        }

        .payment-method-card {
          background: var(--card-bg, #1a1a1a);
          border: 1px solid var(--border, #333);
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .payment-method-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border, #333);
        }

        .payment-method-header h3 {
          font-size: 1.3rem;
          font-weight: 700;
          margin: 0;
        }

        .payment-detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .payment-label {
          color: var(--section-subtext, #888);
          font-size: 0.9rem;
        }

        .payment-value {
          font-weight: 600;
          color: var(--section-text, #fff);
        }

        .copy-btn {
          background: rgba(232, 25, 44, 0.1);
          border: none;
          color: var(--red, #E8192C);
          padding: 0.4rem;
          border-radius: 6px;
          cursor: none;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .copy-btn:hover {
          background: rgba(232, 25, 44, 0.2);
        }

        .payment-note {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          padding: 1rem;
          background: rgba(232, 25, 44, 0.05);
          border-radius: 8px;
          margin-top: 1rem;
          font-size: 0.85rem;
          color: var(--section-subtext, #888);
        }

        .payment-placeholder-warning {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 2rem;
          background: rgba(255, 193, 7, 0.05);
          border: 1px solid rgba(255, 193, 7, 0.2);
          border-radius: 8px;
          text-align: center;
          color: var(--section-subtext, #888);
        }

        .payment-placeholder-warning p {
          margin: 0;
          font-size: 0.9rem;
        }

        .payment-faq {
          background: var(--card-bg, #1a1a1a);
          border: 1px solid var(--border, #333);
          border-radius: 16px;
          padding: 2rem;
        }

        .faq-item {
          padding: 1rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .faq-item:last-child {
          border-bottom: none;
        }

        .faq-question {
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--section-text, #fff);
        }

        .faq-answer {
          color: var(--section-subtext, #888);
          font-size: 0.9rem;
          line-height: 1.6;
        }

        .payment-form-wrapper {
          background: var(--card-bg, #1a1a1a);
          border: 1px solid var(--border, #333);
          border-radius: 16px;
          padding: 2.5rem;
        }

        .payment-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        @media (max-width: 600px) {
          .form-row-2 {
            grid-template-columns: 1fr;
          }
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .luxury-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--section-subtext, #888);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .luxury-input {
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border, #333);
          border-radius: 8px;
          padding: 0.875rem 1rem;
          color: var(--section-text, #fff);
          font-size: 0.95rem;
          transition: all 0.2s;
        }

        .luxury-input:focus {
          outline: none;
          border-color: var(--red, #E8192C);
          background: rgba(255,255,255,0.08);
        }

        .file-upload-wrapper {
          position: relative;
        }

        .file-input {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: none;
        }

        .file-upload-label {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 2rem;
          border: 2px dashed var(--border, #333);
          border-radius: 8px;
          color: var(--section-subtext, #888);
          cursor: none;
          transition: all 0.2s;
        }

        .file-upload-label:hover {
          border-color: var(--red, #E8192C);
          color: var(--red, #E8192C);
        }

        .payment-success {
          text-align: center;
          padding: 3rem 2rem;
        }

        .success-title {
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--section-text, #fff);
        }

        .success-desc {
          color: var(--section-subtext, #888);
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .success-status {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: rgba(255, 193, 7, 0.1);
          border: 1px solid rgba(255, 193, 7, 0.3);
          border-radius: 8px;
          color: #ffc107;
          font-weight: 600;
        }

        .btn-huge-red {
          background: var(--red, #E8192C);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: none;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .btn-huge-red:hover:not(:disabled) {
          background: #ff3344;
          transform: translateY(-2px);
        }

        .btn-huge-red:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .w-full {
          width: 100%;
        }

        .btn-red {
          background: var(--red, #E8192C);
          color: white;
          border: none;
          padding: 0.875rem 2rem;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: none;
          transition: all 0.2s;
        }

        .btn-red:hover {
          background: #ff3344;
        }
      `}</style>
    </div>
  );
};

export default PaymentPage;
