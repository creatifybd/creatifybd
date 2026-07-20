import React, { useState, useEffect, useMemo } from 'react';
import { addData, updateData, deleteData, logActivity } from '../../firebase/services';
import { doc, serverTimestamp, setDoc, writeBatch, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Plus, Trash2, X, Loader2, Search, Eye, EyeOff, ArrowUp, ArrowDown, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import MediaUploader from '../../components/admin/MediaUploader';
import { useConfirm } from '../../context/ConfirmContext';

const emptyForm = {
  name: '',
  role: '',
  bio: '',
  photoUrl: '',
  order: 0,
  hidden: false
};

const TeamManager = () => {
  const confirm = useConfirm();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [search, setSearch] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'team_members'), orderBy('order', 'asc'));
      const snap = await getDocs(q);
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
      // Firestore composite-index-free fallback: fetch unordered, sort client-side
      try {
        const snap = await getDocs(collection(db, 'team_members'));
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setItems(list);
      } catch (fallbackErr) {
        console.error(fallbackErr);
      }
    }
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;
    return items.filter(i =>
      i.name?.toLowerCase().includes(term) ||
      i.role?.toLowerCase().includes(term)
    );
  }, [items, search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.role.trim()) {
      toast.error('Name and role are required.');
      return;
    }
    setSaving(true);
    try {
      const { id, createdAt, updatedAt, ...payload } = formData;
      if (editingId) {
        await updateData('team_members', editingId, payload);
      } else {
        payload.order = items.length; // new members go to the end by default
        await addData('team_members', payload);
      }
      logActivity({ action: editingId ? 'team.update' : 'team.add', resource: 'team_members', resourceId: editingId || '', details: formData.name });
      closeModal();
      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save team member.');
    } finally {
      setSaving(false);
    }
  };

  const closeModal = () => {
    if (saving) return;
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleDelete = async (item) => {
    const ok = await confirm({
      title: `Remove ${item.name} from the team page?`,
      description: 'This will be permanently removed from the public team page.',
      confirmLabel: 'Remove',
      tone: 'danger'
    });
    if (!ok) return;
    try {
      await deleteData('team_members', item.id);
      logActivity({ action: 'team.delete', resource: 'team_members', resourceId: item.id, details: item.name });
      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error('Action failed.');
    }
  };

  const toggleHidden = async (item) => {
    try {
      await setDoc(doc(db, 'team_members', item.id), { hidden: !item.hidden, updatedAt: serverTimestamp() }, { merge: true });
      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update visibility');
    }
  };

  const moveItem = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const reordered = [...items];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    setItems(reordered); // optimistic UI update
    try {
      const batch = writeBatch(db);
      reordered.forEach((it, idx) => {
        batch.set(doc(db, 'team_members', it.id), { order: idx, updatedAt: serverTimestamp() }, { merge: true });
      });
      await batch.commit();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save new order.');
      fetchItems(); // revert to server state on failure
    }
  };

  return (
    <div className="admin-section-page">
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Manage Team</h1>
          <p className="adm-page-desc">The real people shown on the public Team page and About page. Add, edit, reorder, or hide team members here — changes go live immediately, no code changes needed.</p>
        </div>
        <button className="admin-btn-primary" onClick={() => { setEditingId(null); setFormData({ ...emptyForm, order: items.length }); setIsModalOpen(true); }}>
          <Plus size={18} /> Add Team Member
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div className="adm-search-box">
          <Search size={16} />
          <input placeholder="Search team members..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Loader2 className="animate-spin" size={40} /></div>
      ) : filteredItems.length === 0 ? (
        <div className="admin-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--adm-dim)' }}>
          <Users size={40} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <p style={{ marginBottom: '0.5rem', fontWeight: 600 }}>No team members added yet</p>
          <p style={{ fontSize: '0.85rem' }}>The public Team page will show a "coming soon" placeholder until at least one real team member is added here.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {filteredItems.map((item, index) => (
            <div key={item.id} className="admin-card" style={{ padding: '0', overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', zIndex: 2, display: 'flex', gap: '0.25rem' }}>
                <button className="admin-icon-btn" style={{ background: 'rgba(255,255,255,0.9)' }} onClick={() => moveItem(index, -1)} disabled={index === 0} title="Move up"><ArrowUp size={14} /></button>
                <button className="admin-icon-btn" style={{ background: 'rgba(255,255,255,0.9)' }} onClick={() => moveItem(index, 1)} disabled={index === filteredItems.length - 1} title="Move down"><ArrowDown size={14} /></button>
              </div>
              <img
                src={item.photoUrl || '/assets/team/placeholder-avatar.svg'}
                alt={item.name}
                style={{ width: '100%', height: '220px', objectFit: 'cover', background: '#f8f9fb' }}
              />
              <div style={{ padding: '1.25rem' }}>
                <h4 style={{ fontWeight: '700', marginBottom: '0.2rem' }}>{item.name}</h4>
                <div style={{ fontSize: '0.78rem', color: '#E8192C', fontWeight: '600', marginBottom: '0.75rem' }}>{item.role}</div>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button onClick={() => { setEditingId(item.id); setFormData({ ...emptyForm, ...item }); setIsModalOpen(true); }} className="admin-btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Edit</button>
                  <button className="admin-icon-btn" onClick={() => toggleHidden(item)} title={item.hidden ? 'Show on site' : 'Hide from site'}>
                    {item.hidden ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                  <button onClick={() => handleDelete(item)} aria-label="Remove team member" className="admin-icon-btn"><Trash2 size={16} color="var(--adm-danger)" /></button>
                </div>
              </div>
              {item.hidden && <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.6rem' }}>HIDDEN</div>}
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="adm-modal-overlay" onClick={closeModal}>
          <div className="admin-card" style={{ width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button type="button" onClick={closeModal} aria-label="Close dialog" className="admin-icon-btn" style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', zIndex: 2 }}><X size={18} /></button>
            <h2 style={{ marginBottom: '1.5rem', paddingRight: '2rem' }}>{editingId ? 'Edit Team Member' : 'Add Team Member'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <MediaUploader label="Photo" value={formData.photoUrl} accept="image/*" folder="creatifybd/team" helperText="A real photo works best — square-ish images crop most cleanly." onChange={(url) => setFormData(prev => ({ ...prev, photoUrl: url }))} />
              </div>
              <div style={{ marginBottom: '1rem' }}><label className="setting-label">Full Name</label><input className="admin-input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Rahim Ahmed" required /></div>
              <div style={{ marginBottom: '1rem' }}><label className="setting-label">Role</label><input className="admin-input" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} placeholder="e.g. Lead Graphic Designer" required /></div>
              <div style={{ marginBottom: '1.5rem' }}><label className="setting-label">Short Bio (optional)</label><textarea className="admin-input" rows="3" value={formData.bio || ''} onChange={(e) => setFormData({...formData, bio: e.target.value})} placeholder="One or two sentences about what they do." /></div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" className="admin-btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={closeModal} disabled={saving}>Cancel</button>
                <button type="submit" className="admin-btn-primary" style={{ flex: 2, padding: '1rem', justifyContent: 'center' }} disabled={saving}>{saving ? 'Saving...' : editingId ? 'Update' : 'Add to Team Page'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManager;
