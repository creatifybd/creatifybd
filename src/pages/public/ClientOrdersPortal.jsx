import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import { db } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { ShieldAlert, KeyRound, Search, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ClientOrdersPortal = () => {
  const [email, setEmail] = useState('');
  const [publicOrderId, setPublicOrderId] = useState('');
  const [trackingToken, setTrackingToken] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLookup = async (e) => {
    e.preventDefault();
    
    if (!email.trim() || !publicOrderId.trim() || !trackingToken.trim()) {
      toast.error('Please fill in all three fields');
      return;
    }

    const token = trackingToken.trim();
    const pid = publicOrderId.trim().toUpperCase();

    setLoading(true);
    try {
      // Fetch by exact token (= doc ID). Firestore rules: allow get, deny list
      const docRef = doc(db, 'orders', token);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        toast.error('Order not found. Please check your Tracking Token.');
        return;
      }

      const orderData = docSnap.data();
      const storedEmail = orderData.clientInfo?.email?.toLowerCase().trim() || '';
      const storedPublicId = (orderData.publicOrderId || '').toUpperCase();

      // Triple-verify: email + publicOrderId + token (already confirmed by getDoc)
      if (storedEmail !== email.toLowerCase().trim()) {
        toast.error('Email does not match this order. Please verify your details.');
        return;
      }

      if (storedPublicId !== pid) {
        toast.error('Order ID does not match. Please verify your Order ID (e.g. CBD-1234567).');
        return;
      }

      // All checks passed — store verified session keyed to token
      sessionStorage.setItem(`auth_order_${token}`, email.toLowerCase().trim());
      toast.success('Order found! Access granted.');
      navigate(`/client/orders/${token}`);

    } catch (err) {
      console.error('Error fetching order:', err);
      toast.error('An error occurred. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="client-portal-gate">
      <SEO 
        title="Client Order Portal | CreatifyBD"
        description="Access and track your order progress, download drafts, request revisions, and verify manual payments."
        noIndex={true}
      />

      <Navbar />

      <div className="container" style={{ padding: '8rem 1rem 6rem', display: 'flex', justifyContent: 'center' }}>
        <div className="lookup-card">
          <div className="lookup-icon-wrap">
            <KeyRound size={32} />
          </div>

          <h2>Track Your <span className="red">Order</span></h2>
          <p className="lookup-intro">
            Enter your Order ID, email, and Tracking Token from your order confirmation to access your delivery portal.
          </p>

          <form onSubmit={handleLookup} className="lookup-form">
            <div className="form-group">
              <label htmlFor="lookup-public-id">Order ID</label>
              <input 
                id="lookup-public-id"
                type="text"
                required
                placeholder="e.g. CBD-1234567"
                className="luxury-input"
                value={publicOrderId}
                onChange={e => setPublicOrderId(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="lookup-email">Email Address</label>
              <input 
                id="lookup-email"
                type="email"
                required
                placeholder="john@example.com"
                className="luxury-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="lookup-token">Tracking Token</label>
              <input 
                id="lookup-token"
                type="text"
                required
                placeholder="Your 24-character access token"
                className="luxury-input"
                value={trackingToken}
                onChange={e => setTrackingToken(e.target.value)}
                style={{ fontFamily: 'monospace', fontSize: '0.85rem', letterSpacing: '0.05em' }}
              />
              <span style={{ fontSize: '0.72rem', color: '#555', marginTop: '0.3rem', display: 'block' }}>
                Found in your order confirmation email sent by CreatifyBD
              </span>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-red w-full justify-center"
              style={{ height: '48px', marginTop: '1.5rem', fontWeight: '800' }}
            >
              {loading ? (
                <>Searching... <Loader2 size={18} className="animate-spin" style={{ marginLeft: '1rem' }} /></>
              ) : (
                <>Track Order <Search size={16} style={{ marginLeft: '1rem' }} /></>
              )}
            </button>
          </form>

          <div className="lookup-support-bar">
            <ShieldAlert size={14} />
            <span>Need help? Contact <a href="mailto:hello@creatifybd.com">hello@creatifybd.com</a></span>
          </div>
        </div>
      </div>

      <Footer />

      <style>{`
        .lookup-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 3rem;
          max-width: 450px;
          width: 100%;
          text-align: center;
          box-shadow: var(--shadow-lg);
        }

        @media (max-width: 480px) {
          .lookup-card {
            padding: 2rem 1.5rem;
          }
        }

        .lookup-icon-wrap {
          color: var(--red);
          background: rgba(232, 25, 44, 0.1);
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          border: 1px solid rgba(232,25,44,0.2);
        }

        .lookup-card h2 {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 0.5rem;
        }

        .lookup-intro {
          font-size: 0.85rem;
          color: var(--muted);
          line-height: 1.5;
          margin-bottom: 2rem;
        }

        .lookup-form {
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .lookup-form label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .lookup-support-bar {
          margin-top: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          color: var(--muted);
        }

        .lookup-support-bar a {
          color: var(--brand-red);
          text-decoration: none;
          font-weight: 600;
        }

        .lookup-support-bar a:hover {
          color: var(--brand-red-dark);
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default ClientOrdersPortal;
