import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, getDoc, getDocs, where, writeBatch } from 'firebase/firestore';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Eye, 
  Download, 
  Filter,
  Search,
  Calendar,
  DollarSign,
  CreditCard,
  User,
  Mail,
  Phone,
  FileText,
  MessageSquare,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const PaymentVerification = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, verified, rejected
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, 'manualPayments'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const paymentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPayments(paymentsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching payments:', error);
      toast.error('Failed to load payments');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredPayments = payments.filter(payment => {
    const matchesFilter = filter === 'all' || payment.status === filter;
    const matchesSearch = 
      payment.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.transactionId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.publicOrderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.selectedService?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Check for duplicate transaction IDs to alert admin
  const duplicateTxIds = payments.reduce((acc, p) => {
    if (p.transactionId) {
      acc[p.transactionId] = (acc[p.transactionId] || 0) + 1;
    }
    return acc;
  }, {});
  const isDuplicateTx = (txId) => txId && duplicateTxIds[txId] > 1;

  const handleStatusChange = async (paymentId, newStatus) => {
    setUpdating(true);
    const payment = payments.find(p => p.id === paymentId);
    try {
      // Update the manualPayments record and its linked order atomically —
      // a batch either commits both writes or neither, so the payment and
      // order status can never desync if one write were to fail.
      const batch = writeBatch(db);

      batch.update(doc(db, 'manualPayments', paymentId), {
        status: newStatus,
        adminNote: adminNote,
        updatedAt: new Date()
      });

      if (payment?.linkedOrderId) {
        const orderDocRef = doc(db, 'orders', payment.linkedOrderId);
        const orderSnap = await getDoc(orderDocRef);
        if (orderSnap.exists()) {
          const orderUpdate = {
            updatedAt: new Date()
          };
          if (newStatus === 'verified') {
            orderUpdate.status = 'in_progress';
            orderUpdate.paymentStatus = 'verified';
            orderUpdate.paymentVerifiedAt = new Date();
            orderUpdate.paymentProofUrl = payment.proofFileUrl || '';
            orderUpdate.transactionId = payment.transactionId || '';
            // verifiedBy is set server-side in admin context; store email from auth if available
          } else if (newStatus === 'rejected') {
            orderUpdate.status = 'payment_rejected';
            orderUpdate.paymentStatus = 'rejected';
            orderUpdate.paymentRejectedAt = new Date();
            orderUpdate.paymentRejectionNote = adminNote || 'Payment rejected by admin';
          }
          batch.update(orderDocRef, orderUpdate);
        }
      }

      await batch.commit();

      toast.success(`Payment marked as ${newStatus}`);
      setSelectedPayment(null);
      setAdminNote('');
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error('Failed to update payment status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: '#ffc107', icon: Clock, label: 'Pending Verification' },
      verified: { color: '#22c55e', icon: CheckCircle2, label: 'Payment Verified' },
      rejected: { color: '#ef4444', icon: XCircle, label: 'Payment Rejected' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <div 
        style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          padding: '0.4rem 0.8rem',
          borderRadius: '20px',
          background: `${config.color}15`,
          color: config.color,
          fontSize: '0.85rem',
          fontWeight: 600
        }}
      >
        <Icon size={14} />
        {config.label}
      </div>
    );
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="payment-verification-page">
      <div className="admin-page-header">
        <h1>Manual Payment Verification</h1>
        <p className="admin-page-subtitle">
          Review and verify manual payment submissions from clients
        </p>
      </div>

      {/* Filters and Search */}
      <div className="payment-filters">
        <div className="filter-group">
          <Filter size={18} style={{ marginRight: '0.5rem', color: 'var(--adm-dim)' }} />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Payments</option>
            <option value="pending">Pending Verification</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="search-group">
          <Search size={18} style={{ marginRight: '0.5rem', color: 'var(--adm-dim)' }} />
          <input
            type="text"
            placeholder="Search by name, email, transaction ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-value">{payments.length}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-card pending">
            <div className="stat-value">{payments.filter(p => p.status === 'pending').length}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card verified">
            <div className="stat-value">{payments.filter(p => p.status === 'verified').length}</div>
            <div className="stat-label">Verified</div>
          </div>
          <div className="stat-card rejected">
            <div className="stat-value">{payments.filter(p => p.status === 'rejected').length}</div>
            <div className="stat-label">Rejected</div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      {loading ? (
        <div className="loading-state">
          <Loader2 size={32} className="animate-spin" />
          <p>Loading payments...</p>
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="empty-state">
          <CreditCard size={48} style={{ color: 'var(--adm-dim)', marginBottom: '1rem' }} />
          <p>No payments found</p>
        </div>
      ) : (
        <div className="payments-table-wrapper">
          <table className="payments-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Service</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Transaction ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id}>
                  <td>
                    <div className="client-cell">
                      <div className="client-name">{payment.fullName}</div>
                      <div className="client-email">{payment.email}</div>
                    </div>
                  </td>
                  <td>{payment.selectedService}</td>
                  <td>
                    <div className="amount-cell">
                      <DollarSign size={14} style={{ marginRight: '0.25rem' }} />
                      {payment.paidAmount} {payment.currency}
                    </div>
                  </td>
                  <td>
                    <span style={{ 
                      textTransform: 'capitalize',
                      padding: '0.25rem 0.5rem',
                      background: 'var(--adm-soft)',
                      borderRadius: '4px',
                      fontSize: '0.85rem'
                    }}>
                      {payment.paymentMethod}
                    </span>
                  </td>
                  <td>
                    <code style={{ 
                      background: 'var(--adm-soft)',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                      fontFamily: 'monospace'
                    }}>
                      {payment.transactionId}
                    </code>
                  </td>
                  <td>{formatDate(payment.createdAt)}</td>
                  <td>{getStatusBadge(payment.status)}</td>
                  <td>
                    <button
                      onClick={() => setSelectedPayment(payment)}
                      className="action-btn"
                      aria-label="View payment details"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Payment Detail Modal */}
      <AnimatePresence>
        {selectedPayment && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPayment(null)}
          >
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Payment Details</h2>
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="close-btn"
                  aria-label="Close modal"
                >
                  <XCircle size={24} />
                </button>
              </div>

              <div className="modal-body">
                <div className="detail-section">
                  <h3>Client Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <User size={16} />
                      <span className="detail-label">Name:</span>
                      <span className="detail-value">{selectedPayment.fullName}</span>
                    </div>
                    <div className="detail-item">
                      <Mail size={16} />
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{selectedPayment.email}</span>
                    </div>
                    <div className="detail-item">
                      <Phone size={16} />
                      <span className="detail-label">Phone:</span>
                      <span className="detail-value">{selectedPayment.phone}</span>
                    </div>
                    {selectedPayment.companyName && (
                      <div className="detail-item">
                        <FileText size={16} />
                        <span className="detail-label">Company:</span>
                        <span className="detail-value">{selectedPayment.companyName}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Payment Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <CreditCard size={16} />
                      <span className="detail-label">Service:</span>
                      <span className="detail-value">{selectedPayment.selectedService}</span>
                    </div>
                    <div className="detail-item">
                      <DollarSign size={16} />
                      <span className="detail-label">Amount:</span>
                      <span className="detail-value">{selectedPayment.paidAmount} {selectedPayment.currency}</span>
                    </div>
                    <div className="detail-item">
                      <CreditCard size={16} />
                      <span className="detail-label">Method:</span>
                      <span className="detail-value" style={{ textTransform: 'capitalize' }}>
                        {selectedPayment.paymentMethod}
                      </span>
                    </div>
                    <div className="detail-item">
                      <FileText size={16} />
                      <span className="detail-label">Transaction ID:</span>
                      <span className="detail-value" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {selectedPayment.transactionId}
                        {isDuplicateTx(selectedPayment.transactionId) && (
                          <span style={{ background: '#ef444420', color: '#ef4444', padding: '2px 8px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>
                            ⚠ DUPLICATE TX ID
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="detail-item">
                      <Calendar size={16} />
                      <span className="detail-label">Payment Date:</span>
                      <span className="detail-value">{selectedPayment.paymentDate}</span>
                    </div>
                    {selectedPayment.publicOrderId && (
                      <div className="detail-item">
                        <FileText size={16} />
                        <span className="detail-label">Order ID:</span>
                        <span className="detail-value" style={{ color: '#e8192c', fontWeight: 700 }}>{selectedPayment.publicOrderId}</span>
                      </div>
                    )}
                    {selectedPayment.linkedOrderId && (
                      <div className="detail-item">
                        <FileText size={16} />
                        <span className="detail-label">Token (Doc ID):</span>
                        <span className="detail-value" style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#888' }}>{selectedPayment.linkedOrderId}</span>
                      </div>
                    )}
                    {selectedPayment.invoiceNumber && (
                      <div className="detail-item">
                        <FileText size={16} />
                        <span className="detail-label">Invoice:</span>
                        <span className="detail-value">{selectedPayment.invoiceNumber}</span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedPayment.message && (
                  <div className="detail-section">
                    <h3>Message</h3>
                    <p className="message-text">{selectedPayment.message}</p>
                  </div>
                )}

                <div className="detail-section">
                  <h3>Payment Proof</h3>
                  {selectedPayment.proofFileUrl ? (
                    <div className="proof-preview">
                      <a
                        href={selectedPayment.proofFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="proof-link"
                      >
                        <Eye size={18} />
                        View Payment Proof
                      </a>
                      <a
                        href={selectedPayment.proofFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="proof-link"
                        download
                      >
                        <Download size={18} />
                        Download Proof
                      </a>
                    </div>
                  ) : (
                    <p style={{ color: 'var(--adm-dim)' }}>No proof file available</p>
                  )}
                </div>

                <div className="detail-section">
                  <h3>Admin Note</h3>
                  <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Add a note about this payment verification..."
                    className="admin-note-input"
                    rows={3}
                  />
                </div>

                {selectedPayment.adminNote && (
                  <div className="detail-section">
                    <h3>Previous Admin Note</h3>
                    <p className="message-text">{selectedPayment.adminNote}</p>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <div className="status-display">
                  {getStatusBadge(selectedPayment.status)}
                </div>
                <div className="action-buttons">
                  {selectedPayment.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(selectedPayment.id, 'rejected')}
                        disabled={updating}
                        className="btn-reject"
                      >
                        {updating ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
                        Reject Payment
                      </button>
                      <button
                        onClick={() => handleStatusChange(selectedPayment.id, 'verified')}
                        disabled={updating}
                        className="btn-verify"
                      >
                        {updating ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                        Verify Payment
                      </button>
                    </>
                  )}
                  {selectedPayment.status === 'verified' && (
                    <button
                      onClick={() => handleStatusChange(selectedPayment.id, 'pending')}
                      disabled={updating}
                      className="btn-pending"
                    >
                      Mark as Pending
                    </button>
                  )}
                  {selectedPayment.status === 'rejected' && (
                    <button
                      onClick={() => handleStatusChange(selectedPayment.id, 'pending')}
                      disabled={updating}
                      className="btn-pending"
                    >
                      Mark as Pending
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .payment-verification-page {
          padding: 2rem;
        }

        .admin-page-header {
          margin-bottom: 2rem;
        }

        .admin-page-header h1 {
          font-size: 2rem;
          font-weight: 700;
          color: var(--adm-text);
          margin-bottom: 0.5rem;
        }

        .admin-page-subtitle {
          color: var(--adm-dim);
          font-size: 0.95rem;
        }

        .payment-filters {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          align-items: center;
        }

        .filter-group,
        .search-group {
          display: flex;
          align-items: center;
          background: var(--adm-surface);
          border: 1px solid var(--adm-border);
          border-radius: 8px;
          padding: 0.5rem 1rem;
        }

        .filter-select,
        .search-input {
          background: transparent;
          border: none;
          color: var(--adm-text);
          font-size: 0.9rem;
          outline: none;
        }

        .search-input {
          width: 300px;
        }

        .search-input::placeholder {
          color: var(--adm-dim);
        }

        .stats-cards {
          display: flex;
          gap: 1rem;
          margin-left: auto;
        }

        .stat-card {
          background: var(--adm-surface);
          border: 1px solid var(--adm-border);
          border-radius: 8px;
          padding: 0.75rem 1.25rem;
          text-align: center;
          min-width: 100px;
        }

        .stat-card.pending {
          border-color: #ffc107;
        }

        .stat-card.verified {
          border-color: #22c55e;
        }

        .stat-card.rejected {
          border-color: #ef4444;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--adm-text);
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--adm-dim);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .loading-state,
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          color: var(--adm-dim);
        }

        .loading-state p,
        .empty-state p {
          margin-top: 1rem;
        }

        .payments-table-wrapper {
          background: var(--adm-surface);
          border: 1px solid var(--adm-border);
          border-radius: 12px;
          overflow-x: auto;
        }

        .payments-table {
          width: 100%;
          border-collapse: collapse;
        }

        .payments-table thead {
          background: var(--adm-bg);
        }

        .payments-table th {
          padding: 1rem;
          text-align: left;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--adm-dim);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .payments-table td {
          padding: 1rem;
          border-bottom: 1px solid var(--adm-border);
          color: var(--adm-text);
          font-size: 0.9rem;
        }

        .payments-table tr:hover {
          background: var(--adm-bg);
        }

        .client-cell {
          display: flex;
          flex-direction: column;
        }

        .client-name {
          font-weight: 600;
        }

        .client-email {
          font-size: 0.8rem;
          color: var(--adm-dim);
        }

        .amount-cell {
          display: flex;
          align-items: center;
          font-weight: 600;
        }

        .action-btn {
          background: var(--adm-bg);
          border: 1px solid var(--adm-border);
          color: var(--adm-text);
          padding: 0.5rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn:hover {
          background: var(--adm-soft);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
        }

        .modal-content {
          background: var(--adm-surface);
          border: 1px solid var(--adm-border);
          border-radius: 16px;
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid var(--adm-border);
        }

        .modal-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--adm-text);
          margin: 0;
        }

        .close-btn {
          background: transparent;
          border: none;
          color: var(--adm-dim);
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: var(--adm-bg);
          color: var(--adm-text);
        }

        .modal-body {
          padding: 2rem;
        }

        .detail-section {
          margin-bottom: 2rem;
        }

        .detail-section h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--adm-text);
          margin-bottom: 1rem;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        @media (max-width: 600px) {
          .detail-grid {
            grid-template-columns: 1fr;
          }
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: var(--adm-bg);
          border-radius: 8px;
        }

        .detail-label {
          color: var(--adm-dim);
          font-size: 0.85rem;
        }

        .detail-value {
          color: var(--adm-text);
          font-weight: 500;
        }

        .message-text {
          color: var(--adm-dim);
          line-height: 1.6;
          padding: 1rem;
          background: var(--adm-bg);
          border-radius: 8px;
        }

        .proof-preview {
          display: flex;
          gap: 1rem;
        }

        .proof-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: rgba(232, 25, 44, 0.1);
          border: 1px solid rgba(232, 25, 44, 0.3);
          color: var(--red);
          border-radius: 8px;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s;
        }

        .proof-link:hover {
          background: rgba(232, 25, 44, 0.2);
        }

        .admin-note-input {
          width: 100%;
          background: var(--adm-bg);
          border: 1px solid var(--adm-border);
          border-radius: 8px;
          padding: 0.875rem;
          color: var(--adm-text);
          font-size: 0.9rem;
          resize: vertical;
          outline: none;
        }

        .admin-note-input:focus {
          border-color: var(--red);
        }

        .modal-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          border-top: 1px solid var(--adm-border);
        }

        .action-buttons {
          display: flex;
          gap: 0.75rem;
        }

        .btn-verify,
        .btn-reject,
        .btn-pending {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }

        .btn-verify {
          background: #22c55e;
          color: white;
        }

        .btn-verify:hover:not(:disabled) {
          background: #16a34a;
        }

        .btn-reject {
          background: #ef4444;
          color: white;
        }

        .btn-reject:hover:not(:disabled) {
          background: #dc2626;
        }

        .btn-pending {
          background: var(--adm-bg);
          color: var(--adm-text);
          border: 1px solid var(--adm-border);
        }

        .btn-pending:hover:not(:disabled) {
          background: var(--adm-border);
        }

        .btn-verify:disabled,
        .btn-reject:disabled,
        .btn-pending:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default PaymentVerification;
