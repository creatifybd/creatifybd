import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import { CheckCircle2, Copy, Check, ArrowRight, Clock, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const OrderSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || '';           // clientAccessToken = doc ID
  const publicOrderId = searchParams.get('publicOrderId') || 'CBD-UNKNOWN';
  const amount = searchParams.get('amount') || '';
  const service = searchParams.get('service') || '';
  const email = searchParams.get('email') || '';

  const [copiedToken, setCopiedToken] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState(false);

  const handleCopyToken = () => {
    navigator.clipboard.writeText(orderId);
    setCopiedToken(true);
    toast.success('Tracking Token copied!');
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(publicOrderId);
    setCopiedId(true);
    toast.success('অর্ডার আইডি কপি হয়েছে!');
    setTimeout(() => setCopiedId(false), 2000);
  };

  const whatsappUrl = `https://wa.me/8801979201999?text=${encodeURIComponent(`আসসালামু আলাইকুম, আমি অর্ডার করেছি। আমার অর্ডার আইডি: ${publicOrderId} (${service || 'সার্ভিস'})`)}`;

  return (
    <div className="order-success-page">
      <SEO 
        title="অর্ডার সম্পন্ন হয়েছে | CreatifyBD"
        noIndex={true}
      />

      <Navbar />

      <div className="container" style={{ padding: '6rem 1rem', display: 'flex', justifyContent: 'center' }}>
        <div className="success-content-card">
          <div className="success-icon-wrap">
            <CheckCircle2 size={72} />
          </div>

          <h1 className="success-title">অর্ডার সফলভাবে জমা হয়েছে!</h1>
          <p className="success-desc-copy">
            আপনার প্রজেক্টের রিকোয়ারমেন্ট আমাদের কাছে পৌঁছেছে। আমাদের ক্রিয়েটিভ টিম খুব দ্রুত আপনার সাথে সরাসরি যোগাযোগ করবে।
          </p>

          {/* Public Order ID */}
          <div className="order-id-display-box">
            <span className="lbl">আপনার অর্ডার আইডি</span>
            <div className="id-row">
              <code style={{ color: '#e8192c', fontSize: '1.2rem', fontWeight: 800 }}>{publicOrderId}</code>
              <button type="button" onClick={handleCopyId} className="copy-btn-id" aria-label="Copy order ID">
                {copiedId ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          <div className="next-steps-timeline">
            <h3>পরবর্তী ধাপসমূহ</h3>
            
            <div className="step-timeline-row">
              <div className="step-badge num active">০১</div>
              <div className="step-text">
                <h5>রিকোয়ারমেন্ট রিভিউ</h5>
                <p>আমাদের টিম আপনার দেওয়া ব্রিফ ও রিকোয়ারমেন্ট বিস্তারিত পর্যবেক্ষণ করবে।</p>
              </div>
            </div>

            <div className="step-timeline-row">
              <div className="step-badge num active">০২</div>
              <div className="step-text">
                <h5>টিমের সাথে যোগাযোগ</h5>
                <p>আমরা আপনার সাথে হোয়াটসঅ্যাপ বা ইমেইলে দ্রুত কথা বলে প্রজেক্টের সময়সীমা নিশ্চিত করব।</p>
              </div>
            </div>

            <div className="step-timeline-row">
              <div className="step-badge num">০৩</div>
              <div className="step-text">
                <h5>ক্রিয়েটিভ প্রোডাকশন শুরু</h5>
                <p>সবকিছু চূড়ান্ত হওয়ার সাথে সাথে ডিজাইনার ও ভিডিও এডিটররা আপনার কাজ শুরু করবে।</p>
              </div>
            </div>
          </div>

          <div className="success-action-btns">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-red">
              হোয়াটসঅ্যাপে দ্রুত মেসেজ দিন <ArrowRight size={16} />
            </a>
            <Link to="/" className="btn-ghost" style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'white' }}>
              হোমপেজে ফিরে যান
            </Link>
          </div>

          <div className="secure-badge-footer">
            <ShieldCheck size={16} />
            <span>CreatifyBD — নির্ভরযোগ্য ক্রিয়েটিভ পার্টনার</span>
          </div>
        </div>
      </div>

      <Footer />

      <style>{`
        .success-content-card {
          background: #060608;
          border: 1px solid rgba(232,25,44,0.18);
          border-radius: 20px;
          padding: 4rem 3rem;
          max-width: 600px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 60px rgba(232,25,44,0.06);
          position: relative;
          overflow: hidden;
        }
        .success-content-card::before {
          content: '';
          position: absolute;
          width: 500px; height: 500px;
          border-radius: 50%;
          top: -200px; left: 50%;
          transform: translateX(-50%);
          background: radial-gradient(circle, rgba(232,25,44,0.18) 0%, transparent 65%);
          pointer-events: none;
          z-index: 0;
        }
        .success-content-card > * { position: relative; z-index: 1; }

        @media (max-width: 600px) {
          .success-content-card {
            padding: 2.5rem 1.5rem;
          }
        }

        .success-icon-wrap {
          color: #4caf50;
          background: rgba(76, 175, 80, 0.1);
          padding: 1.25rem;
          border-radius: 50%;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .success-title {
          font-size: 2.2rem;
          font-weight: 900;
          color: white;
          margin-bottom: 1rem;
        }

        .success-desc-copy {
          color: #888;
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 2.5rem;
        }

        .order-id-display-box {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 10px;
          padding: 1rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          margin-bottom: 3rem;
          width: 100%;
          align-items: center;
        }

        .order-id-display-box .lbl {
          font-size: 0.75rem;
          color: #777;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 700;
        }

        .id-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .id-row code {
          font-family: monospace;
          font-size: 1.3rem;
          font-weight: 700;
          color: white;
          letter-spacing: 0.5px;
        }

        .copy-btn-id {
          background: rgba(255,255,255,0.05);
          border: none;
          color: #aaa;
          padding: 0.4rem;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .copy-btn-id:hover {
          color: white;
          background: rgba(255,255,255,0.1);
        }

        .next-steps-timeline {
          width: 100%;
          text-align: left;
          background: rgba(255,255,255,0.01);
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 3rem;
        }

        .next-steps-timeline h3 {
          font-size: 1.1rem;
          color: white;
          font-weight: 800;
          margin-bottom: 1.5rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .step-timeline-row {
          display: flex;
          gap: 1.25rem;
          margin-bottom: 1.5rem;
          align-items: flex-start;
        }

        .step-timeline-row:last-child {
          margin-bottom: 0;
        }

        .step-badge {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
          color: #777;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
          flex-shrink: 0;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .step-badge.active {
          background: rgba(232, 25, 44, 0.15);
          color: var(--red);
          border-color: rgba(232, 25, 44, 0.3);
        }

        .step-text h5 {
          font-size: 0.95rem;
          color: white;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .step-text p {
          font-size: 0.8rem;
          color: #888;
          line-height: 1.4;
        }

        .success-action-btns {
          display: flex;
          gap: 1rem;
          width: 100%;
          margin-bottom: 2rem;
        }

        .success-action-btns a {
          flex: 1;
          justify-content: center;
          height: 48px;
        }

        @media (max-width: 480px) {
          .success-action-btns {
            flex-direction: column;
          }
        }

        .secure-badge-footer {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default OrderSuccessPage;
