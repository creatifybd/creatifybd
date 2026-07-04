import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, query, orderBy, getDocs, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { Star, Check, X, Trash2, Eye, Loader2, RefreshCcw, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { useConfirm } from '../../context/ConfirmContext';

const StarDisplay = ({ rating }) => (
  <div style={{ display: 'flex', gap: '0.1rem' }}>
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={12} fill={i < rating ? 'var(--adm-red)' : 'none'} stroke={i < rating ? 'var(--adm-red)' : '#444'} />
    ))}
  </div>
);

const AdminReviews = () => {
  const confirm = useConfirm();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQ, setSearchQ] = useState('');
  const [actioning, setActioning] = useState(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setReviews(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleApprove = async (reviewId) => {
    setActioning(reviewId);
    const toastId = toast.loading('Approving review...');
    try {
      await updateDoc(doc(db, 'reviews', reviewId), {
        status: 'approved',
        approvedAt: serverTimestamp()
      });
      setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, status: 'approved' } : r));
      toast.success('Review approved and published', { id: toastId });
    } catch (err) {
      toast.error('Failed to approve review', { id: toastId });
    } finally {
      setActioning(null);
    }
  };

  const handleReject = async (reviewId) => {
    setActioning(reviewId);
    const toastId = toast.loading('Rejecting review...');
    try {
      await updateDoc(doc(db, 'reviews', reviewId), {
        status: 'rejected',
        rejectedAt: serverTimestamp()
      });
      setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, status: 'rejected' } : r));
      toast.success('Review rejected', { id: toastId });
    } catch (err) {
      toast.error('Failed to reject review', { id: toastId });
    } finally {
      setActioning(null);
    }
  };

  const handleDelete = async (reviewId) => {
    const ok = await confirm({
      title: 'Permanently delete this review?',
      description: 'This cannot be undone.',
      confirmLabel: 'Delete',
      tone: 'danger'
    });
    if (!ok) return;
    setActioning(reviewId);
    const toastId = toast.loading('Deleting...');
    try {
      await deleteDoc(doc(db, 'reviews', reviewId));
      setReviews(prev => prev.filter(r => r.id !== reviewId));
      toast.success('Review deleted', { id: toastId });
    } catch (err) {
      toast.error('Failed to delete review', { id: toastId });
    } finally {
      setActioning(null);
    }
  };

  const formatDate = (ts) => {
    if (!ts?.seconds) return '—';
    return new Date(ts.seconds * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filtered = reviews.filter(r => {
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    const matchSearch = !searchQ || 
      r.clientName?.toLowerCase().includes(searchQ.toLowerCase()) ||
      r.gigTitle?.toLowerCase().includes(searchQ.toLowerCase()) ||
      r.reviewText?.toLowerCase().includes(searchQ.toLowerCase());
    return matchStatus && matchSearch;
  });

  const pendingCount = reviews.filter(r => r.status === 'pending').length;

  return (
    <div className="admin-section-page">
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">
            Reviews Manager
            {pendingCount > 0 && (
              <span className="pending-badge-header">{pendingCount} Pending</span>
            )}
          </h1>
          <p className="adm-page-desc">Approve, reject, or delete client reviews before they appear publicly on the reviews page.</p>
        </div>
        <button type="button" className="adm-btn-secondary" onClick={fetchReviews} disabled={loading}>
          <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="order-status-chips" style={{ marginBottom: '1.5rem' }}>
        {[
          { label: 'Total', count: reviews.length },
          { label: 'Pending', count: reviews.filter(r => r.status === 'pending').length, color: '#ff9800' },
          { label: 'Approved', count: reviews.filter(r => r.status === 'approved').length, color: '#4caf50' },
          { label: 'Rejected', count: reviews.filter(r => r.status === 'rejected').length, color: '#f44336' },
        ].map((s, i) => (
          <div key={i} className="status-chip-stat" style={{ borderColor: s.color ? `${s.color}33` : '' }}>
            <span className="chip-count" style={{ color: s.color || 'var(--adm-text)' }}>{s.count}</span>
            <span className="chip-lbl">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filter row */}
      <div className="adm-filter-bar" style={{ marginBottom: '1.5rem' }}>
        <div className="adm-search-box" style={{ flex: 1 }}>
          <MessageSquare size={15} />
          <input 
            type="text"
            placeholder="Search by client name or review text..."
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
          />
        </div>
        <div className="adm-select-wrap">
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="adm-loading-center">
          <Loader2 size={32} className="animate-spin" />
          <span>Loading reviews...</span>
        </div>
      ) : (
        <div className="reviews-admin-list">
          {filtered.length === 0 ? (
            <div className="adm-empty-state">
              <MessageSquare size={40} />
              <p>No reviews found</p>
            </div>
          ) : (
            filtered.map(review => (
              <div key={review.id} className={`review-admin-card ${review.status}`}>
                <div className="review-adm-header">
                  <div className="rev-adm-meta">
                    <div className="rev-adm-name">{review.clientName}</div>
                    <div className="rev-adm-sub">
                      {review.country && <span>🌏 {review.country}</span>}
                      {review.businessType && <span>· {review.businessType}</span>}
                      {review.gigTitle && <span>· <em>{review.gigTitle}</em></span>}
                    </div>
                  </div>
                  <div className="rev-adm-right">
                    <StarDisplay rating={review.rating} />
                    <span className={`rev-status-chip ${review.status}`}>
                      {review.status}
                    </span>
                    <span className="rev-date">{formatDate(review.createdAt)}</span>
                  </div>
                </div>

                <p className="review-adm-text">"{review.reviewText}"</p>

                {review.deliveredImageUrl && (
                  <div className="rev-proof-img">
                    <img src={review.deliveredImageUrl} alt="Sample delivered work" />
                    <span>Delivered Work Sample</span>
                  </div>
                )}

                <div className="review-adm-footer">
                  <div className="rev-perms">
                    {review.permissionToShowWork !== false && (
                      <span className="perm-badge allowed">✓ Portfolio Display Permitted</span>
                    )}
                    {review.wouldRecommend && (
                      <span className="perm-badge recommend">✓ Would Recommend</span>
                    )}
                  </div>

                  <div className="review-adm-actions">
                    {review.status !== 'approved' && (
                      <button
                        type="button"
                        className="rev-action-btn approve"
                        onClick={() => handleApprove(review.id)}
                        disabled={actioning === review.id}
                        title="Approve and publish"
                      >
                        {actioning === review.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                        Approve
                      </button>
                    )}
                    {review.status !== 'rejected' && (
                      <button
                        type="button"
                        className="rev-action-btn reject"
                        onClick={() => handleReject(review.id)}
                        disabled={actioning === review.id}
                        title="Reject review"
                      >
                        <X size={14} />
                        Reject
                      </button>
                    )}
                    <button
                      type="button"
                      className="rev-action-btn delete"
                      onClick={() => handleDelete(review.id)}
                      disabled={actioning === review.id}
                      title="Permanently delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <style>{`
        .pending-badge-header {
          background: rgba(255, 152, 0, 0.15);
          color: #ff9800;
          border: 1px solid rgba(255, 152, 0, 0.3);
          font-size: 0.7rem;
          padding: 0.15rem 0.5rem;
          border-radius: 100px;
          margin-left: 0.75rem;
          font-weight: 700;
          vertical-align: middle;
        }

        .reviews-admin-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .review-admin-card {
          background: var(--adm-surface);
          border: 1px solid var(--adm-border);
          border-radius: 12px;
          padding: 1.5rem;
          transition: border-color 0.2s;
        }

        .review-admin-card.pending {
          border-left: 3px solid #ff9800;
        }

        .review-admin-card.approved {
          border-left: 3px solid #4caf50;
        }

        .review-admin-card.rejected {
          border-left: 3px solid #f44336;
          opacity: 0.6;
        }

        .review-adm-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
          gap: 1rem;
        }

        .rev-adm-name {
          font-size: 1rem;
          font-weight: 700;
          color: var(--adm-text);
          margin-bottom: 0.2rem;
        }

        .rev-adm-sub {
          font-size: 0.78rem;
          color: var(--adm-dim);
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
        }

        .rev-adm-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.4rem;
        }

        .rev-status-chip {
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.15rem 0.5rem;
          border-radius: 100px;
          text-transform: uppercase;
        }

        .rev-status-chip.pending {
          background: rgba(255,152,0,0.1);
          color: #ff9800;
        }

        .rev-status-chip.approved {
          background: rgba(76,175,80,0.1);
          color: #4caf50;
        }

        .rev-status-chip.rejected {
          background: rgba(244,67,54,0.1);
          color: #f44336;
        }

        .rev-date {
          font-size: 0.72rem;
          color: var(--adm-dim);
        }

        .review-adm-text {
          font-size: 0.875rem;
          color: #aaa;
          line-height: 1.6;
          font-style: italic;
          margin-bottom: 1rem;
          border-left: 2px solid rgba(255,255,255,0.06);
          padding-left: 1rem;
        }

        .rev-proof-img {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          margin-bottom: 1rem;
        }

        .rev-proof-img img {
          max-width: 120px;
          border-radius: 6px;
          border: 1px solid var(--adm-border);
        }

        .rev-proof-img span {
          font-size: 0.7rem;
          color: var(--adm-dim);
        }

        .review-adm-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          padding-top: 1rem;
          border-top: 1px solid var(--adm-border);
        }

        .rev-perms {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .perm-badge {
          font-size: 0.68rem;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          font-weight: 600;
        }

        .perm-badge.allowed {
          background: rgba(76,175,80,0.08);
          color: #4caf50;
          border: 1px solid rgba(76,175,80,0.15);
        }

        .perm-badge.recommend {
          background: rgba(33,150,243,0.08);
          color: #2196f3;
          border: 1px solid rgba(33,150,243,0.15);
        }

        .review-adm-actions {
          display: flex;
          gap: 0.5rem;
        }

        .rev-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.4rem 0.9rem;
          border-radius: 6px;
          border: none;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .rev-action-btn.approve {
          background: rgba(76,175,80,0.1);
          color: #4caf50;
          border: 1px solid rgba(76,175,80,0.2);
        }

        .rev-action-btn.approve:hover {
          background: #4caf50;
          color: white;
        }

        .rev-action-btn.reject {
          background: rgba(255,152,0,0.1);
          color: #ff9800;
          border: 1px solid rgba(255,152,0,0.2);
        }

        .rev-action-btn.reject:hover {
          background: #ff9800;
          color: white;
        }

        .rev-action-btn.delete {
          background: rgba(244,67,54,0.08);
          color: #f44336;
          border: 1px solid rgba(244,67,54,0.15);
          padding: 0.4rem 0.65rem;
        }

        .rev-action-btn.delete:hover {
          background: #f44336;
          color: white;
        }

        .adm-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 5rem;
          color: var(--adm-dim);
          text-align: center;
          background: var(--adm-surface);
          border: 1px solid var(--adm-border);
          border-radius: 12px;
        }
      `}</style>
    </div>
  );
};

export default AdminReviews;
