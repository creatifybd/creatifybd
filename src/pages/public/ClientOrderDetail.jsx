import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import StatusBadge from '../../components/StatusBadge';
import { db } from '../../firebase/config';
import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { 
  ArrowLeft, 
  Clock, 
  FileText, 
  Download, 
  CornerUpLeft, 
  CheckCircle2, 
  Loader2, 
  AlertCircle, 
  MessageSquare, 
  Star,
  ShieldCheck,
  Send
} from 'lucide-react';
import toast from 'react-hot-toast';

const ClientOrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submittingAction, setSubmittingAction] = useState(false);

  // Modals/UI states
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [revisionNotes, setRevisionNotes] = useState('');
  
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    reviewText: '',
    serviceQuality: 5,
    communication: 5,
    deliveryExperience: 5,
    wouldRecommend: true,
    permissionToShowWork: true
  });

  // Load Order details
  useEffect(() => {
    const fetchOrder = async () => {
      // Security Check: Verify session authorization (set by ClientOrdersPortal on successful lookup)
      // orderId in the URL IS the clientAccessToken (24-char hex)
      const sessionEmail = sessionStorage.getItem(`auth_order_${orderId}`);
      
      if (!sessionEmail) {
        toast.error('Session expired. Please re-enter your credentials.');
        navigate('/client/orders');
        return;
      }

      try {
        // Fetch by exact doc ID = clientAccessToken (Firestore allows get, denies list)
        const docRef = doc(db, 'orders', orderId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const clientEmail = data.clientInfo?.email || '';

          // Double-check email matches session
          if (sessionEmail.toLowerCase() !== clientEmail.toLowerCase()) {
            toast.error('Unauthorized access. Session email mismatch.');
            navigate('/client/orders');
            return;
          }
          setOrder({ id: docSnap.id, ...data });
        } else {
          toast.error('Order not found. Please check your Order ID.');
          navigate('/client/orders');
        }
      } catch (err) {
        console.error('Error fetching order detail:', err);
        toast.error('Failed to load order details.');
        navigate('/client/orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f0f0f', color: '#fff' }}>
        <Loader2 className="animate-spin" size={32} />
        <span style={{ marginLeft: '1rem', fontWeight: 600 }}>Loading Tracking Portal...</span>
      </div>
    );
  }

  if (!order) {
    return <Navigate to="/client/orders" replace />;
  }

  // Stepper state calculator
  const getStepStatus = (stepNumber) => {
    const status = order.status;
    
    // Step 1: Requirements Intake (always checked)
    if (stepNumber === 1) return 'completed';

    // Step 2: Payment verified
    if (stepNumber === 2) {
      if (['payment_verified', 'in_progress', 'draft_shared', 'delivered', 'completed'].includes(status)) return 'completed';
      if (['payment_submitted'].includes(status)) return 'current';
      return 'pending';
    }

    // Step 3: Work in Progress
    if (stepNumber === 3) {
      if (['in_progress', 'draft_shared'].includes(status)) return 'current';
      if (['delivered', 'completed'].includes(status)) return 'completed';
      return 'pending';
    }

    // Step 4: Delivered
    if (stepNumber === 4) {
      if (['draft_shared', 'delivered'].includes(status)) return 'current';
      if (status === 'completed') return 'completed';
      return 'pending';
    }

    // Step 5: Completed
    if (stepNumber === 5) {
      if (status === 'completed') return 'completed';
      return 'pending';
    }

    return 'pending';
  };

  const renderStepIcon = (stepNumber) => {
    const stepState = getStepStatus(stepNumber);
    if (stepState === 'completed') {
      return <CheckCircle2 size={18} style={{ color: '#4caf50' }} />;
    }
    if (stepState === 'current') {
      return (
        <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.65rem', fontWeight: 700 }}>
          {stepNumber}
        </div>
      );
    }
    return (
      <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#333', border: '1px solid #444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#777', fontSize: '0.65rem', fontWeight: 700 }}>
        {stepNumber}
      </div>
    );
  };

  const handleRequestRevision = async (e) => {
    e.preventDefault();
    if (!revisionNotes.trim()) {
      toast.error('Please enter revision instructions.');
      return;
    }

    setSubmittingAction(true);
    const toastId = toast.loading('Submitting revision request...');
    try {
      await updateDoc(doc(db, 'orders', order.id), {
        status: 'revision_requested',
        revisionNotes: revisionNotes,
        updatedAt: serverTimestamp()
      });
      
      setOrder(prev => ({ 
        ...prev, 
        status: 'revision_requested', 
        revisionNotes: revisionNotes 
      }));

      setShowRevisionModal(false);
      setRevisionNotes('');
      toast.success('Revision request sent to production team.', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit revision request.', { id: toastId });
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleAcceptDelivery = async (e) => {
    e.preventDefault();
    setSubmittingAction(true);
    const toastId = toast.loading('Finalizing order completion...');

    try {
      if (!reviewForm.reviewText.trim()) {
        toast.error('Please write a short review before completing the order.', { id: toastId });
        setSubmittingAction(false);
        return;
      }

      // 1. Update order status to completed
      await updateDoc(doc(db, 'orders', order.id), {
        status: 'completed',
        reviewSubmitted: true,
        reviewStatus: 'pending',
        reviewedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // 2. Submit review to reviews collection
      await addDoc(collection(db, 'reviews'), {
        orderId: order.id,
        gigId: order.gigId,
        gigSlug: order.gigSlug,
        clientName: order.clientInfo?.fullName || 'Client',
        country: order.clientInfo?.country || 'USA',
        businessType: order.clientInfo?.companyName || 'Business',
        rating: Number(reviewForm.rating),
        reviewText: reviewForm.reviewText.trim(),
        serviceQuality: Number(reviewForm.serviceQuality),
        communication: Number(reviewForm.communication),
        deliveryExperience: Number(reviewForm.deliveryExperience),
        wouldRecommend: reviewForm.wouldRecommend,
        verifiedOrder: true,
        publicOrderId: order.publicOrderId || '',
        deliveredImageUrl: order.deliveries?.[0]?.fileUrl || '',
        permissionToShowWork: reviewForm.permissionToShowWork,
        status: 'pending', // Requires admin approval for public display
        createdAt: serverTimestamp()
      });

      setOrder(prev => ({ ...prev, status: 'completed', reviewSubmitted: true, reviewStatus: 'pending' }));
      setShowReviewModal(false);
      toast.success('Order completed! Thank you for your feedback.', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error('Failed to complete order.', { id: toastId });
    } finally {
      setSubmittingAction(false);
    }
  };

  return (
    <div className="client-order-detail-page">
      <SEO title={`Order ${order.id} Status | CreatifyBD`} noIndex={true} />
      
      <Navbar />

      <div className="container" style={{ padding: '6rem 1rem 4rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Back button */}
          <Link to="/client/orders" className="back-link-portal">
            <ArrowLeft size={16} />
            <span>Back to Portal Lookup</span>
          </Link>

          {/* Page Header summary */}
          <div className="order-portal-header">
            <div className="header-meta-box">
              <span className="order-id-lbl">Order ID: <code>{order.id}</code></span>
              <h1 className="order-title-lbl">{order.gigTitle}</h1>
              <p className="order-pkg-lbl">Package: <strong style={{ textTransform: 'capitalize' }}>{order.selectedPackage} Plan</strong> • Price: <strong>${order.price} USD</strong></p>
            </div>
            <div className="header-badge-box">
              <StatusBadge status={order.status} />
            </div>
          </div>

          {/* Timeline Stepper */}
          <div className="stepper-card-wrapper">
            <div className="stepper-horizontal">
              <div className="step-item">
                <div className="step-icon-bar">{renderStepIcon(1)}</div>
                <span className="step-label-txt">Requirements Submitted</span>
              </div>
              <div className="step-connector" />
              <div className="step-item">
                <div className="step-icon-bar">{renderStepIcon(2)}</div>
                <span className="step-label-txt">Payment Verified</span>
              </div>
              <div className="step-connector" />
              <div className="step-item">
                <div className="step-icon-bar">{renderStepIcon(3)}</div>
                <span className="step-label-txt">In Production</span>
              </div>
              <div className="step-connector" />
              <div className="step-item">
                <div className="step-icon-bar">{renderStepIcon(4)}</div>
                <span className="step-label-txt">Review Delivery</span>
              </div>
              <div className="step-connector" />
              <div className="step-item">
                <div className="step-icon-bar">{renderStepIcon(5)}</div>
                <span className="step-label-txt">Completed</span>
              </div>
            </div>
          </div>

          <div className="order-detail-flex-row">
            
            {/* Left Box: Requirements & Specs */}
            <div className="flex-left-content">
              
              {/* Deliveries / Draft Downloads */}
              {(order.status === 'delivered' || order.status === 'completed' || order.status === 'draft_shared' || order.deliveries?.length > 0) && (
                <div className="portal-content-box border-red-glow">
                  <h3 className="section-title"><Clock size={18} style={{ color: 'var(--red)' }} /> Production Deliveries & Drafts</h3>
                  
                  {order.deliveries && order.deliveries.length > 0 ? (
                    <div className="deliveries-downloads-list">
                      {order.deliveries.map((delivery, index) => (
                        <div key={index} className="delivery-download-card">
                          <div className="dl-icon"><FileText size={20} /></div>
                          <div className="dl-info">
                            <h5>{delivery.title || `Final Delivery File #${index + 1}`}</h5>
                            <p className="dl-notes">{delivery.notes || 'No notes provided by editor.'}</p>
                            <span className="dl-date">Delivered: {new Date(delivery.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString()}</span>
                          </div>
                          <a 
                            href={delivery.fileUrl || delivery.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="btn-download-action"
                            aria-label="Download asset"
                          >
                            <Download size={16} />
                            Download
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: '#777', fontSize: '0.9rem' }}>The editor has not uploaded files yet. Check back soon.</p>
                  )}

                  {/* Customer action box when status is delivered */}
                  {['draft_shared', 'delivered'].includes(order.status) && !order.reviewSubmitted && (
                    <div className="customer-review-prompt-box">
                      <div className="prompt-meta">
                        <h5>Review Final Delivery</h5>
                        <p>Please review the final delivery files above. You can accept the delivery and leave feedback, or request revision adjustments.</p>
                      </div>
                      <div className="prompt-buttons">
                        <button type="button" className="btn-outline-white" onClick={() => setShowRevisionModal(true)}>
                          <CornerUpLeft size={16} /> Request Revision
                        </button>
                        <button type="button" className="btn-red" onClick={() => setShowReviewModal(true)}>
                          <CheckCircle2 size={16} /> Accept & Complete Order
                        </button>
                      </div>
                    </div>
                  )}

                  {order.reviewSubmitted && (
                    <div className="revision-instructions-status-info">
                      <ShieldCheck size={18} style={{ color: '#4caf50' }} />
                      <div className="info-txt">
                        <strong>Review submitted for approval</strong>
                        <p>Your feedback has been sent to our team and will appear publicly after quality review.</p>
                      </div>
                    </div>
                  )}

                  {/* Revision notes status info */}
                  {order.status === 'revision_requested' && (
                    <div className="revision-instructions-status-info">
                      <AlertCircle size={18} style={{ color: '#e91e63' }} />
                      <div className="info-txt">
                        <strong>Revision Notes Submitted:</strong>
                        <p>"{order.revisionNotes}"</p>
                        <span>Our production team is currently revising the assets. Updates will appear here.</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Submitted Requirements */}
              <div className="portal-content-box">
                <h3 className="section-title"><FileText size={18} /> Intake Requirements Provided</h3>
                <div className="requirements-summary-list">
                  {Object.entries(order.requirements || {}).map(([key, val]) => {
                    if (['attachmentUrl', 'attachmentName'].includes(key) || !val) return null;
                    
                    const cleanKey = key
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, str => str.toUpperCase());
                    
                    return (
                      <div key={key} className="req-summary-row">
                        <span className="lbl">{cleanKey}:</span>
                        <p className="val">{val}</p>
                      </div>
                    );
                  })}

                  {order.requirements?.attachmentUrl && (
                    <div className="req-summary-row">
                      <span className="lbl">Reference File Uploaded:</span>
                      <a href={order.requirements.attachmentUrl} target="_blank" rel="noopener noreferrer" className="attachment-link-btn">
                        <Download size={14} />
                        {order.requirements.attachmentName || 'Download reference attachment'}
                      </a>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Right Box: Timeline & Details */}
            <div className="flex-right-sidebar">
              <div className="portal-content-box p-card-mini">
                <h4>Status Overview</h4>
                <div className="timeline-mini">
                  <div className="t-row done">
                    <span className="t-dot" />
                    <div className="t-meta">
                      <h5>Requirements intake submitted</h5>
                      <span className="t-date">{new Date(order.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className={`t-row ${['payment_verified', 'in_progress', 'draft_shared', 'delivered', 'completed'].includes(order.status) ? 'done' : ''}`}>
                    <span className="t-dot" />
                    <div className="t-meta">
                      <h5>Manual Payment Verification</h5>
                      <span className="t-status">
                        {order.status === 'payment_pending' && 'Pending Verification'}
                        {order.status === 'payment_submitted' && 'Proof Submitted'}
                        {['payment_verified', 'in_progress', 'draft_shared', 'delivered', 'completed'].includes(order.status) && 'Verified successfully'}
                      </span>
                    </div>
                  </div>

                  <div className={`t-row ${['in_progress', 'draft_shared', 'delivered', 'completed'].includes(order.status) ? 'done' : ''}`}>
                    <span className="t-dot" />
                    <div className="t-meta">
                      <h5>Design & Copy production</h5>
                      <span className="t-status">
                        {['payment_verified', 'in_progress', 'revision_requested'].includes(order.status) && 'In Production'}
                        {['delivered', 'completed'].includes(order.status) && 'Production Completed'}
                      </span>
                    </div>
                  </div>

                  <div className={`t-row ${['delivered', 'completed'].includes(order.status) ? 'done' : ''}`}>
                    <span className="t-dot" />
                    <div className="t-meta">
                      <h5>Draft delivery files shared</h5>
                      <span className="t-status">{order.status === 'delivered' ? 'Draft Delivered' : ''}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Revision Modal Overlay */}
          {showRevisionModal && (
            <div className="modal-portal-overlay">
              <div className="modal-portal-card">
                <h3>Request Design Revision</h3>
                <p className="modal-desc">Tell us what adjustments are required (text modifications, color switches, layout scaling, etc.). Work will resume after submission.</p>
                <form onSubmit={handleRequestRevision}>
                  <textarea 
                    className="luxury-input w-full"
                    style={{ height: '140px', background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                    required
                    placeholder="Provide specific guidelines: e.g. Swap typography in post #3, fix date typo on banner design..."
                    value={revisionNotes}
                    onChange={e => setRevisionNotes(e.target.value)}
                  />
                  <div className="modal-action-btns">
                    <button type="button" className="btn-outline-white" onClick={() => setShowRevisionModal(false)}>Cancel</button>
                    <button type="submit" disabled={submittingAction} className="btn-red">
                      {submittingAction ? <Loader2 className="animate-spin" size={16} /> : <Send size={14} />} Submit Revision
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Review / Acceptance Modal Overlay */}
          {showReviewModal && (
            <div className="modal-portal-overlay">
              <div className="modal-portal-card" style={{ maxWidth: '550px' }}>
                <h3>Accept Delivery & Leave Feedback</h3>
                <p className="modal-desc">This wraps up the project order and unlocks final handoff. Please share your delivery feedback:</p>
                
                <form onSubmit={handleAcceptDelivery} className="review-portal-form">
                  <div className="form-group flex-row-stars">
                    <label>Overall Star Rating *</label>
                    <div className="stars-input-row">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button 
                          key={num} 
                          type="button" 
                          onClick={() => setReviewForm({...reviewForm, rating: num})}
                          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                          aria-label={`Rate ${num} stars`}
                        >
                          <Star 
                            size={28} 
                            fill={num <= reviewForm.rating ? 'var(--red)' : 'none'} 
                            stroke={num <= reviewForm.rating ? 'var(--red)' : '#555'} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="review-desc">Public Feedback Text *</label>
                    <textarea 
                      id="review-desc"
                      required
                      className="luxury-input"
                      style={{ height: '90px', background: 'rgba(0,0,0,0.3)' }}
                      placeholder="e.g. CreatifyBD designed gorgeous content templates. Pacing and delivery speeds were exceptional..."
                      value={reviewForm.reviewText}
                      onChange={e => setReviewForm({...reviewForm, reviewText: e.target.value})}
                    />
                  </div>

                  <div className="checkbox-group-lbl">
                    <input 
                      type="checkbox"
                      id="consent-shw"
                      checked={reviewForm.permissionToShowWork}
                      onChange={e => setReviewForm({...reviewForm, permissionToShowWork: e.target.checked})}
                    />
                    <label htmlFor="consent-shw">I allow CreatifyBD to show my delivered project image as portfolio/sample.</label>
                  </div>

                  <div className="checkbox-group-lbl">
                    <input 
                      type="checkbox"
                      id="recommend-chbox"
                      checked={reviewForm.wouldRecommend}
                      onChange={e => setReviewForm({...reviewForm, wouldRecommend: e.target.checked})}
                    />
                    <label htmlFor="recommend-chbox">I would recommend CreatifyBD to other business owners.</label>
                  </div>

                  <div className="modal-action-btns">
                    <button type="button" className="btn-outline-white" onClick={() => setShowReviewModal(false)}>Cancel</button>
                    <button type="submit" disabled={submittingAction} className="btn-red">
                      {submittingAction ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />} Complete Order
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>

      <Footer />

      <style>{`
        .back-link-portal {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #777;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 2rem;
          transition: color 0.2s;
        }

        .back-link-portal:hover {
          color: white;
        }

        .order-portal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 3rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding-bottom: 2rem;
        }

        @media (max-width: 768px) {
          .order-portal-header {
            flex-direction: column;
            gap: 1.5rem;
          }
        }

        .order-id-lbl {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #777;
          font-weight: 700;
          margin-bottom: 0.4rem;
          display: block;
        }

        .order-id-lbl code {
          font-family: monospace;
          color: white;
          font-size: 0.95rem;
          margin-left: 0.25rem;
        }

        .order-title-lbl {
          font-size: 2rem;
          font-weight: 900;
          color: white;
          margin-bottom: 0.5rem;
          line-height: 1.2;
        }

        .order-pkg-lbl {
          color: #888;
          font-size: 0.95rem;
        }

        .stepper-card-wrapper {
          background: #161616;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 2.5rem;
          margin-bottom: 3rem;
        }

        .stepper-horizontal {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          text-align: center;
          width: 140px;
        }

        .step-label-txt {
          font-size: 0.75rem;
          font-weight: 700;
          color: #aaa;
          line-height: 1.3;
        }

        .step-connector {
          height: 2px;
          background: rgba(255,255,255,0.05);
          flex-grow: 1;
          margin-bottom: 1.5rem;
        }

        @media (max-width: 768px) {
          .stepper-horizontal {
            flex-direction: column;
            gap: 1.5rem;
            align-items: flex-start;
          }
          .step-item {
            flex-direction: row;
            width: 100%;
            text-align: left;
          }
          .step-connector {
            display: none;
          }
        }

        .order-detail-flex-row {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 3rem;
        }

        @media (max-width: 968px) {
          .order-detail-flex-row {
            grid-template-columns: 1fr;
          }
        }

        .portal-content-box {
          background: #161616;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 2.5rem;
          margin-bottom: 2rem;
        }

        .portal-content-box.border-red-glow {
          border-color: rgba(232, 25, 44, 0.2);
          box-shadow: 0 10px 30px rgba(232, 25, 44, 0.04);
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: white;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding-bottom: 1rem;
        }

        .requirements-summary-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .req-summary-row {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .req-summary-row .lbl {
          font-size: 0.75rem;
          font-weight: 700;
          color: #777;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .req-summary-row .val {
          color: #b0b0b0;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .attachment-link-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 6px;
          color: white;
          text-decoration: none;
          font-size: 0.85rem;
          width: fit-content;
          transition: all 0.2s;
        }

        .attachment-link-btn:hover {
          background: var(--red);
          border-color: var(--red);
        }

        /* Delivery layouts */
        .deliveries-downloads-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .delivery-download-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 10px;
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .dl-icon {
          width: 44px;
          height: 44px;
          border-radius: 8px;
          background: rgba(255,255,255,0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #888;
        }

        .dl-info {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .dl-info h5 {
          font-size: 0.95rem;
          color: white;
          font-weight: 700;
        }

        .dl-notes {
          font-size: 0.8rem;
          color: #777;
        }

        .dl-date {
          font-size: 0.7rem;
          color: #555;
        }

        .btn-download-action {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.2rem;
          background: var(--red);
          color: white;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 700;
          font-size: 0.85rem;
          box-shadow: 0 5px 15px rgba(232, 25, 44, 0.2);
          transition: all 0.2s;
        }

        .btn-download-action:hover {
          background: #d11224;
          transform: translateY(-2px);
        }

        @media (max-width: 600px) {
          .delivery-download-card {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
          }
          .dl-icon {
            margin: 0 auto;
          }
          .btn-download-action {
            justify-content: center;
          }
        }

        /* Review prompts */
        .customer-review-prompt-box {
          background: rgba(76, 175, 80, 0.05);
          border: 1px solid rgba(76, 175, 80, 0.2);
          border-radius: 10px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .prompt-meta h5 {
          font-size: 1.05rem;
          color: white;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .prompt-meta p {
          font-size: 0.85rem;
          color: #888;
          line-height: 1.4;
        }

        .prompt-buttons {
          display: flex;
          gap: 1rem;
        }

        .prompt-buttons button {
          flex: 1;
          justify-content: center;
          height: 40px;
          font-size: 0.85rem;
          cursor: none;
        }

        .btn-outline-white {
          background: transparent;
          border: 1.5px solid rgba(255,255,255,0.15);
          color: white;
          border-radius: 100px;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          transition: all 0.2s;
        }

        .btn-outline-white:hover {
          background: rgba(255,255,255,0.05);
          border-color: white;
        }

        .revision-instructions-status-info {
          display: flex;
          gap: 1rem;
          background: rgba(233, 30, 99, 0.05);
          border: 1px dashed rgba(233, 30, 99, 0.2);
          border-radius: 10px;
          padding: 1.5rem;
          align-items: flex-start;
        }

        .info-txt strong {
          display: block;
          font-size: 0.95rem;
          color: white;
          margin-bottom: 0.25rem;
        }

        .info-txt p {
          font-style: italic;
          color: #aaa;
          font-size: 0.85rem;
          margin-bottom: 0.5rem;
        }

        .info-txt span {
          font-size: 0.75rem;
          color: #777;
        }

        /* Right Sidebar timeline */
        .p-card-mini h4 {
          font-size: 1rem;
          font-weight: 800;
          color: white;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 1.5rem;
        }

        .timeline-mini {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
          position: relative;
        }

        .timeline-mini::after {
          content: '';
          position: absolute;
          left: 7px;
          top: 10px;
          bottom: 10px;
          width: 2px;
          background: #333;
          z-index: 1;
        }

        .t-row {
          display: flex;
          gap: 1.25rem;
          position: relative;
          z-index: 2;
        }

        .t-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #222;
          border: 2px solid #333;
          flex-shrink: 0;
          margin-top: 0.1rem;
          transition: all 0.3s;
        }

        .t-row.done .t-dot {
          background: var(--red);
          border-color: var(--red);
          box-shadow: 0 0 10px rgba(232, 25, 44, 0.4);
        }

        .t-meta h5 {
          font-size: 0.85rem;
          color: #888;
          font-weight: 600;
        }

        .t-row.done .t-meta h5 {
          color: white;
        }

        .t-date, .t-status {
          font-size: 0.75rem;
          color: #555;
          display: block;
          margin-top: 0.1rem;
        }

        .t-row.done .t-status {
          color: #aaa;
        }

        /* Modals styles */
        .modal-portal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 20000;
          padding: 1.5rem;
          backdrop-filter: blur(8px);
        }

        .modal-portal-card {
          background: #1a1a1a;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 2.5rem;
          max-width: 480px;
          width: 100%;
          box-shadow: 0 30px 60px rgba(0,0,0,0.5);
        }

        .modal-portal-card h3 {
          font-size: 1.4rem;
          font-weight: 800;
          color: white;
          margin-bottom: 0.5rem;
        }

        .modal-desc {
          font-size: 0.85rem;
          color: #888;
          line-height: 1.5;
          margin-bottom: 1.5rem;
        }

        .modal-action-btns {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
        }

        .modal-action-btns button {
          padding: 0.6rem 1.4rem;
          border-radius: 100px;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: none;
        }

        .review-portal-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          text-align: left;
        }

        .review-portal-form label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #777;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.3rem;
          display: block;
        }

        .stars-input-row {
          display: flex;
          gap: 0.4rem;
        }

        .checkbox-group-lbl {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          cursor: none;
        }

        .checkbox-group-lbl input {
          margin-top: 0.15rem;
          cursor: none;
        }

        .checkbox-group-lbl label {
          font-size: 0.85rem;
          color: #aaa;
          cursor: none;
          line-height: 1.3;
          text-transform: none;
          font-weight: 500;
          letter-spacing: 0;
        }
      `}</style>
    </div>
  );
};

export default ClientOrderDetail;
