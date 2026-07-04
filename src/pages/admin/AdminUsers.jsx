import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { Plus, ShieldCheck, Trash2, UserCog, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useConfirm } from '../../context/ConfirmContext';
import { logActivity } from '../../firebase/services';

const ROLES = [
  { value: 'owner', label: 'Owner', desc: 'Full control, including managing other admins.' },
  { value: 'editor', label: 'Editor', desc: 'Can manage content, orders, and site settings.' },
  { value: 'viewer', label: 'Viewer', desc: 'Read-only access to the dashboard.' }
];

const AdminUsers = () => {
  const { user } = useAuth();
  const confirm = useConfirm();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ email: '', role: 'editor' });

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'admins'), orderBy('addedAt', 'desc'));
      const snap = await getDocs(q);
      setAdmins(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
      toast.error('Failed to load admin users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAdmins(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const email = form.email.trim().toLowerCase();
    if (!email || !email.includes('@')) {
      toast.error('Enter a valid email address');
      return;
    }
    setSaving(true);
    try {
      await setDoc(doc(db, 'admins', email), {
        email,
        role: form.role,
        addedBy: user?.email || 'unknown',
        addedAt: serverTimestamp()
      });
      toast.success(`${email} added as ${form.role}`);
      logActivity({ action: 'admin.add', resource: 'admins', resourceId: email, details: `Granted ${form.role} access` });
      setForm({ email: '', role: 'editor' });
      fetchAdmins();
    } catch (err) {
      console.error(err);
      toast.error('Failed to add admin. Note: this only grants dashboard access — the person still needs a Firebase Auth account created for that email.');
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (email) => {
    if (email === user?.email?.toLowerCase()) {
      toast.error("You can't remove your own access.");
      return;
    }
    const ok = await confirm({
      title: 'Remove admin access?',
      description: `${email} will immediately lose access to the admin dashboard.`,
      confirmLabel: 'Remove Access',
      tone: 'danger'
    });
    if (!ok) return;
    try {
      await deleteDoc(doc(db, 'admins', email));
      toast.success('Admin access removed');
      logActivity({ action: 'admin.remove', resource: 'admins', resourceId: email, details: 'Revoked admin access' });
      fetchAdmins();
    } catch (err) {
      console.error(err);
      toast.error('Failed to remove admin');
    }
  };

  return (
    <div className="admin-section-page">
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title"><UserCog size={24} /> Admin Users</h1>
          <p className="adm-page-desc">Control who can access the dashboard and what they can do (role-based access control).</p>
        </div>
      </div>

      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1rem', marginBottom: '1.25rem' }}>Grant Access</h2>
        <p style={{ color: 'var(--adm-dim)', fontSize: '0.82rem', marginBottom: '1.25rem' }}>
          The person must already have a Firebase Authentication account with this email (create one from the Firebase Console) — this form only grants them a role inside the dashboard.
        </p>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '2 1 240px' }}>
            <label className="setting-label">Email Address</label>
            <input
              type="email"
              className="admin-input"
              placeholder="teammate@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div style={{ flex: '1 1 160px' }}>
            <label className="setting-label">Role</label>
            <select className="admin-input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
          <button type="submit" className="admin-btn-primary" disabled={saving}>
            <Plus size={16} /> {saving ? 'Adding...' : 'Add Admin'}
          </button>
        </form>
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          {ROLES.map(r => (
            <div key={r.value} style={{ fontSize: '0.78rem', color: 'var(--adm-dim)' }}>
              <strong style={{ color: 'var(--adm-txt)' }}>{r.label}:</strong> {r.desc}
            </div>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <h2 style={{ fontSize: '1rem', marginBottom: '1.25rem' }}>Current Admins</h2>
        {loading ? (
          <div className="admin-loading"><Loader2 className="animate-spin" size={24} /></div>
        ) : admins.length === 0 ? (
          <p style={{ color: 'var(--adm-dim)', fontSize: '0.85rem' }}>No registered admins yet. The original site owner accounts still have access automatically.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr><th>Email</th><th>Role</th><th>Added By</th><th></th></tr>
            </thead>
            <tbody>
              {admins.map(a => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 600 }}>{a.email}</td>
                  <td>
                    <span className={`badge-status ${a.role === 'owner' ? 'badge-active' : 'badge-info'}`}>
                      <ShieldCheck size={11} style={{ marginRight: '4px', verticalAlign: '-1px' }} />{a.role}
                    </span>
                  </td>
                  <td style={{ color: 'var(--adm-dim)', fontSize: '0.85rem' }}>{a.addedBy || '—'}</td>
                  <td>
                    <button className="admin-icon-btn" onClick={() => handleRemove(a.id)} title="Remove access">
                      <Trash2 size={15} color="var(--adm-danger)" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
