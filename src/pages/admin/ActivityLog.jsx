import React, { useEffect, useState, useMemo } from 'react';
import { getActivityLog } from '../../firebase/services';
import { History, Loader2, RefreshCcw, Search } from 'lucide-react';

const formatDate = (ts) => {
  if (!ts?.toDate) return '—';
  const d = ts.toDate();
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
};

const ACTION_LABELS = {
  'admin.add': 'Granted admin access',
  'admin.remove': 'Revoked admin access',
  'review.approve': 'Approved review',
  'review.reject': 'Rejected review',
  'review.delete': 'Deleted review',
  'portfolio.hide': 'Hid portfolio item',
  'portfolio.delete': 'Deleted portfolio item',
  'testimonial.delete': 'Deleted testimonial',
  'case_study.hide': 'Hid case study',
  'case_study.delete': 'Deleted case study'
};

const ActivityLog = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchLog = async () => {
    setLoading(true);
    const data = await getActivityLog(200);
    setEntries(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchLog(); }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return entries;
    return entries.filter(e =>
      e.actorEmail?.toLowerCase().includes(term) ||
      e.action?.toLowerCase().includes(term) ||
      e.resource?.toLowerCase().includes(term) ||
      e.details?.toLowerCase().includes(term)
    );
  }, [entries, search]);

  return (
    <div className="admin-section-page">
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title"><History size={24} /> Activity Log</h1>
          <p className="adm-page-desc">An audit trail of admin actions — who did what, and when. Visible to owners only.</p>
        </div>
        <button type="button" className="admin-btn-secondary" onClick={fetchLog} aria-label="Refresh activity log">
          <RefreshCcw size={15} /> Refresh
        </button>
      </div>

      <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
        <div style={{ position: 'relative', maxWidth: '360px' }}>
          <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--adm-dim)' }} />
          <input
            type="text"
            className="admin-input"
            style={{ paddingLeft: '2.2rem' }}
            placeholder="Search by admin, action, or resource..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="admin-loading"><Loader2 className="animate-spin" size={24} /></div>
        ) : filtered.length === 0 ? (
          <p style={{ color: 'var(--adm-dim)', fontSize: '0.85rem' }}>No activity recorded yet.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr><th>When</th><th>Admin</th><th>Action</th><th>Resource</th><th>Details</th></tr>
            </thead>
            <tbody>
              {filtered.map(entry => (
                <tr key={entry.id}>
                  <td style={{ color: 'var(--adm-dim)', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>{formatDate(entry.createdAt)}</td>
                  <td style={{ fontWeight: 600 }}>{entry.actorEmail}</td>
                  <td>
                    <span className="badge-status badge-info">{ACTION_LABELS[entry.action] || entry.action}</span>
                  </td>
                  <td style={{ color: 'var(--adm-dim)', fontSize: '0.82rem' }}>{entry.resource}{entry.resourceId ? ` / ${entry.resourceId}` : ''}</td>
                  <td style={{ color: 'var(--adm-dim)', fontSize: '0.82rem' }}>{entry.details || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ActivityLog;
