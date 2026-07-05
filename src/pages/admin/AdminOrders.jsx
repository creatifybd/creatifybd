import React, { useState, useEffect, useRef, useMemo } from 'react';
import { db } from '../../firebase/config';
import { storage } from '../../firebase/config';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, query, orderBy, getDocs, doc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import StatusBadge from '../../components/StatusBadge';
import { 
  Search, ChevronDown, ExternalLink, Eye, CheckCircle2, Clock, 
  Loader2, RefreshCcw, AlertTriangle, Package, Upload, Download, FolderOpen
} from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = [
  'all', 'payment_pending', 'payment_submitted', 'payment_verified',
  'in_progress', 'draft_shared', 'revision_requested', 'delivered', 'completed'
];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [uploadingDelivery, setUploadingDelivery] = useState(false);
  const deliveryFileRef = useRef(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setOrders(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingStatus(orderId);
    const toastId = toast.loading('Updating order status...');
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
      toast.success('Order status updated', { id: toastId });
    } catch (err) {
      toast.error('Failed to update status', { id: toastId });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDeliveryUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !selectedOrder) return;

    if (file.size > 100 * 1024 * 1024) {
      toast.error('File must be under 100 MB');
      return;
    }

    setUploadingDelivery(true);
    const toastId = toast.loading(`Uploading "${file.name}"...`);
    try {
      const fileRef = storageRef(storage, `deliveries/${selectedOrder.id}/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);

      const deliveryEntry = {
        fileName: file.name,
        fileSize: file.size,
        fileUrl: downloadURL,   // standardized field — ClientOrderDetail reads this
        url: downloadURL,       // keep for backward compat
        title: file.name,
        notes: '',
        uploadedAt: new Date().toISOString(),
        createdAt: { seconds: Math.floor(Date.now() / 1000) }
      };

      await updateDoc(doc(db, 'orders', selectedOrder.id), {
        deliveries: arrayUnion(deliveryEntry),
        status: 'delivered',
        updatedAt: serverTimestamp()
      });

      // Update local state
      setOrders(prev => prev.map(o =>
        o.id === selectedOrder.id
          ? { ...o, status: 'delivered', deliveries: [...(o.deliveries || []), deliveryEntry] }
          : o
      ));
      setSelectedOrder(prev => ({
        ...prev,
        status: 'delivered',
        deliveries: [...(prev.deliveries || []), deliveryEntry]
      }));

      toast.success(`"${file.name}" delivered to client!`, { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error('Upload failed: ' + err.message, { id: toastId });
    } finally {
      setUploadingDelivery(false);
      if (deliveryFileRef.current) deliveryFileRef.current.value = '';
    }
  };

  const filtered = useMemo(() => orders.filter(o => {
    const matchesSearch = 
      o.id.toLowerCase().includes(searchQ.toLowerCase()) ||
      o.clientInfo?.fullName?.toLowerCase().includes(searchQ.toLowerCase()) ||
      o.clientInfo?.email?.toLowerCase().includes(searchQ.toLowerCase()) ||
      o.gigTitle?.toLowerCase().includes(searchQ.toLowerCase());
    const matchesStatus = filterStatus === 'all' || o.status === filterStatus;
    return matchesSearch && matchesStatus;
  }), [orders, searchQ, filterStatus]);

  const formatDate = (ts) => {
    if (!ts?.seconds) return '—';
    return new Date(ts.seconds * 1000).toLocaleDateString('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric' 
    });
  };

  return (
    <div className="admin-section-page">
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Orders Manager</h1>
          <p className="adm-page-desc">View all client orders, update production status, and manage delivery workflows.</p>
        </div>
        <button type="button" className="adm-btn-secondary" onClick={fetchOrders} disabled={loading}>
          <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Summary stat chips */}
      <div className="order-status-chips">
        {[
          { label: 'Total', count: orders.length, color: '' },
          { label: 'Pending Payment', count: orders.filter(o => o.status === 'payment_pending').length, color: '#ff9800' },
          { label: 'In Progress', count: orders.filter(o => o.status === 'in_progress').length, color: '#2196f3' },
          { label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length, color: '#4caf50' },
          { label: 'Completed', count: orders.filter(o => o.status === 'completed').length, color: '#9c27b0' },
        ].map((s, idx) => (
          <div key={idx} className="status-chip-stat" style={{ borderColor: s.color ? `${s.color}33` : '' }}>
            <span className="chip-count" style={{ color: s.color || 'var(--adm-text)' }}>{s.count}</span>
            <span className="chip-lbl">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filter Row */}
      <div className="adm-filter-bar">
        <div className="adm-search-box" style={{ flex: 1 }}>
          <Search size={16} />
          <input 
            type="text"
            placeholder="Search by client name, email, or Order ID..."
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
          />
        </div>
        <div className="adm-select-wrap">
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="adm-loading-center">
          <Loader2 size={32} className="animate-spin" />
          <span>Loading orders...</span>
        </div>
      ) : (
        <div className="orders-layout-grid">
          {/* Orders Table */}
          <div className="adm-table-card" style={{ flex: 1, minWidth: 0 }}>
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Service</th>
                  <th>Package</th>
                  <th>Price</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--adm-dim)' }}>
                      No orders found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filtered.map(order => (
                    <tr 
                      key={order.id} 
                      className={selectedOrder?.id === order.id ? 'selected-row' : ''}
                      onClick={() => setSelectedOrder(order)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>
                        <div className="client-cell-info">
                          <div className="client-name-tbl">{order.clientInfo?.fullName || 'Unknown'}</div>
                          <div className="client-email-tbl">{order.clientInfo?.email}</div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--adm-text)', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {order.gigTitle}
                        </div>
                      </td>
                      <td>
                        <span className="cat-chip" style={{ textTransform: 'capitalize' }}>{order.selectedPackage}</span>
                      </td>
                      <td className="price-cell-adm">${order.price}</td>
                      <td className="dim-cell">{formatDate(order.createdAt)}</td>
                      <td>
                        <StatusBadge status={order.status} size="sm" />
                      </td>
                      <td>
                        <div className="table-actions-row" onClick={e => e.stopPropagation()}>
                          <div className="adm-select-wrap" style={{ padding: '0.25rem 0.5rem' }}>
                            <select 
                              value={order.status}
                              onChange={e => handleStatusChange(order.id, e.target.value)}
                              disabled={updatingStatus === order.id}
                              style={{ fontSize: '0.75rem' }}
                            >
                              {STATUS_OPTIONS.filter(s => s !== 'all').map(s => (
                                <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Order Detail Sidebar */}
          {selectedOrder && (
            <div className="order-detail-adm-sidebar">
              <div className="sidebar-header-row">
                <h4>Order Details</h4>
                <button type="button" className="adm-icon-btn" onClick={() => setSelectedOrder(null)} title="Close">×</button>
              </div>

              <div className="order-id-display">
                <span className="lbl">Order ID</span>
                <code>{selectedOrder.id}</code>
              </div>

              <div className="detail-group">
                <h5>Client Information</h5>
                <div className="detail-row"><span>Name:</span><strong>{selectedOrder.clientInfo?.fullName}</strong></div>
                <div className="detail-row"><span>Email:</span><strong>{selectedOrder.clientInfo?.email}</strong></div>
                <div className="detail-row"><span>Phone:</span><strong>{selectedOrder.clientInfo?.phone || '—'}</strong></div>
                <div className="detail-row"><span>Country:</span><strong>{selectedOrder.clientInfo?.country || '—'}</strong></div>
                <div className="detail-row"><span>Company:</span><strong>{selectedOrder.clientInfo?.companyName || '—'}</strong></div>
              </div>

              <div className="detail-group">
                <h5>Project Summary</h5>
                <div className="detail-row"><span>Service:</span><strong>{selectedOrder.gigTitle}</strong></div>
                <div className="detail-row"><span>Package:</span><strong style={{ textTransform: 'capitalize' }}>{selectedOrder.selectedPackage}</strong></div>
                <div className="detail-row"><span>Price:</span><strong style={{ color: 'var(--adm-red)' }}>${selectedOrder.price} USD</strong></div>
                <div className="detail-row"><span>Delivery:</span><strong>{selectedOrder.deliveryTime} days</strong></div>
                <div className="detail-row"><span>Status:</span><StatusBadge status={selectedOrder.status} size="sm" /></div>
                <div className="detail-row"><span>Created:</span><strong>{formatDate(selectedOrder.createdAt)}</strong></div>
              </div>

              {selectedOrder.requirements?.projectGoal && (
                <div className="detail-group">
                  <h5>Project Goal</h5>
                  <p className="req-text-display">{selectedOrder.requirements.projectGoal}</p>
                </div>
              )}

              {selectedOrder.requirements?.targetAudience && (
                <div className="detail-group">
                  <h5>Target Audience</h5>
                  <p className="req-text-display">{selectedOrder.requirements.targetAudience}</p>
                </div>
              )}

              {selectedOrder.requirements?.attachmentUrl && (
                <div className="detail-group">
                  <h5>Reference File</h5>
                  <a 
                    href={selectedOrder.requirements.attachmentUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="adm-btn-secondary"
                    style={{ fontSize: '0.8rem' }}
                  >
                    <ExternalLink size={14} /> Download Reference
                  </a>
                </div>
              )}

              <div className="detail-group">
                <h5>Update Status</h5>
                <select 
                  value={selectedOrder.status}
                  onChange={e => handleStatusChange(selectedOrder.id, e.target.value)}
                  className="adm-full-select"
                  disabled={updatingStatus === selectedOrder.id}
                >
                  {STATUS_OPTIONS.filter(s => s !== 'all').map(s => (
                    <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>

              {/* Delivery Upload Section */}
              <div className="detail-group">
                <h5>Upload Delivery File</h5>
                <p style={{ fontSize: '0.75rem', color: 'var(--adm-dim)', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                  Upload completed files for the client. Status will auto-update to <strong style={{ color: '#4caf50' }}>delivered</strong>.
                </p>
                <input
                  ref={deliveryFileRef}
                  type="file"
                  id="delivery-upload-input"
                  style={{ display: 'none' }}
                  onChange={handleDeliveryUpload}
                  accept="image/*,video/*,application/pdf,application/zip,.psd,.ai,.eps,.doc,.docx"
                />
                <button
                  type="button"
                  className="delivery-upload-btn"
                  onClick={() => deliveryFileRef.current?.click()}
                  disabled={uploadingDelivery}
                >
                  {uploadingDelivery
                    ? <><Loader2 size={15} className="animate-spin" /> Uploading...</>
                    : <><Upload size={15} /> Upload Delivery File</>
                  }
                </button>

                {/* Existing deliveries list */}
                {selectedOrder.deliveries?.length > 0 && (
                  <div className="deliveries-list-admin">
                    <div className="del-list-header">Uploaded Deliveries ({selectedOrder.deliveries.length})</div>
                    {selectedOrder.deliveries.map((d, idx) => (
                      <div key={idx} className="del-item-row">
                        <FolderOpen size={13} style={{ flexShrink: 0, color: 'var(--adm-dim)' }} />
                        <span className="del-item-name" title={d.fileName}>{d.fileName}</span>
                        <a href={d.url} target="_blank" rel="noopener noreferrer" className="del-item-dl" title="Download">
                          <Download size={12} />
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        .orders-layout-grid {
          display: flex;
          gap: 2rem;
          align-items: flex-start;
        }

        .order-status-chips {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .status-chip-stat {
          background: var(--adm-surface);
          border: 1px solid var(--adm-border);
          border-radius: 8px;
          padding: 0.75rem 1.25rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 90px;
        }

        .chip-count {
          font-size: 1.3rem;
          font-weight: 800;
        }

        .chip-lbl {
          font-size: 0.7rem;
          color: var(--adm-dim);
          text-align: center;
          margin-top: 0.1rem;
        }

        .selected-row td {
          background: rgba(232, 25, 44, 0.04) !important;
        }

        .client-cell-info {
          min-width: 150px;
        }

        .client-name-tbl {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--adm-text);
          margin-bottom: 0.15rem;
        }

        .client-email-tbl {
          font-size: 0.72rem;
          color: var(--adm-dim);
          font-family: monospace;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 160px;
        }

        .order-detail-adm-sidebar {
          width: 320px;
          flex-shrink: 0;
          background: var(--adm-surface);
          border: 1px solid var(--adm-border);
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          position: sticky;
          top: 90px;
          max-height: calc(100vh - 150px);
          overflow-y: auto;
        }

        @media (max-width: 1100px) {
          .orders-layout-grid { flex-direction: column; }
          .order-detail-adm-sidebar { width: 100%; position: static; }
        }

        .sidebar-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .sidebar-header-row h4 {
          font-size: 1rem;
          font-weight: 800;
          color: var(--adm-text);
        }

        .order-id-display {
          background: var(--adm-bg);
          border: 1px solid var(--adm-border);
          border-radius: 6px;
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .order-id-display .lbl {
          font-size: 0.65rem;
          color: var(--adm-dim);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .order-id-display code {
          font-size: 0.8rem;
          color: var(--adm-text);
          word-break: break-all;
          font-family: monospace;
        }

        .detail-group {
          border-top: 1px solid var(--adm-border);
          padding-top: 1rem;
        }

        .detail-group h5 {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--adm-dim);
          margin-bottom: 0.75rem;
          font-weight: 700;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.82rem;
          margin-bottom: 0.4rem;
          gap: 0.5rem;
        }

        .detail-row span {
          color: var(--adm-dim);
          flex-shrink: 0;
        }

        .detail-row strong {
          color: var(--adm-text);
          text-align: right;
          font-size: 0.82rem;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .req-text-display {
          font-size: 0.82rem;
          color: var(--adm-dim);
          line-height: 1.5;
        }

        .adm-full-select {
          width: 100%;
          background: var(--adm-bg);
          border: 1px solid var(--adm-border);
          border-radius: 6px;
          padding: 0.6rem 0.75rem;
          color: var(--adm-text);
          font-size: 0.85rem;
          outline: none;
          cursor: pointer;
        }

        .adm-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.55rem 1rem;
          background: var(--adm-soft);
          border: 1px solid var(--adm-border);
          border-radius: 8px;
          color: var(--adm-text);
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .adm-btn-secondary:hover {
          background: var(--adm-bg);
        }

        .adm-loading-center {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 5rem;
          color: var(--adm-dim);
          font-size: 0.9rem;
        }

        .delivery-upload-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.65rem 1rem;
          background: rgba(232, 25, 44, 0.08);
          border: 1.5px dashed rgba(232, 25, 44, 0.3);
          border-radius: 8px;
          color: var(--adm-red);
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          justify-content: center;
          transition: all 0.2s;
          margin-bottom: 0.75rem;
        }

        .delivery-upload-btn:hover:not(:disabled) {
          background: rgba(232, 25, 44, 0.15);
          border-color: var(--adm-red);
        }

        .delivery-upload-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .deliveries-list-admin {
          background: var(--adm-bg);
          border: 1px solid var(--adm-border);
          border-radius: 6px;
          overflow: hidden;
        }

        .del-list-header {
          padding: 0.5rem 0.75rem;
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--adm-dim);
          font-weight: 700;
          background: var(--adm-bg);
          border-bottom: 1px solid var(--adm-border);
        }

        .del-item-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          border-bottom: 1px solid var(--adm-border);
        }

        .del-item-row:last-child {
          border-bottom: none;
        }

        .del-item-name {
          flex: 1;
          font-size: 0.75rem;
          color: var(--adm-text);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .del-item-dl {
          color: var(--adm-dim);
          display: flex;
          padding: 0.2rem;
          border-radius: 4px;
          transition: color 0.15s;
          text-decoration: none;
        }

        .del-item-dl:hover {
          color: white;
        }
      `}</style>
    </div>
  );
};

export default AdminOrders;
