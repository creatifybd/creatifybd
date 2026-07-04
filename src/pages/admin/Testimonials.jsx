import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, writeBatch } from 'firebase/firestore';
import { Plus, Edit2, Trash2, X, Star, Search, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useConfirm } from '../../context/ConfirmContext';

const emptyForm = { name: '', role: '', text: '', stars: 5, hidden: false };

const TestimonialsManager = () => {
  const confirm = useConfirm();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'testimonials'), orderBy('name'));
      const snap = await getDocs(q);
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error('Failed to fetch testimonials:', err);
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;
    return items.filter(t =>
      t.name?.toLowerCase().includes(term) ||
      t.role?.toLowerCase().includes(term) ||
      t.text?.toLowerCase().includes(term)
    );
  }, [items, search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'testimonials', editingId), formData);
      } else {
        await addDoc(collection(db, 'testimonials'), formData);
      }
      toast.success(editingId ? 'Review updated' : 'Review added');
      setIsModalOpen(false);
      setEditingId(null);
      setFormData(emptyForm);
      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save testimonial. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirm({
      title: 'Delete this review?',
      description: 'This testimonial will be permanently removed from the site.',
      confirmLabel: 'Delete',
      tone: 'danger'
    });
    if (!ok) return;
    try {
      await deleteDoc(doc(db, 'testimonials', id));
      toast.success('Review deleted');
      setSelectedIds(prev => prev.filter(i => i !== id));
      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete review');
    }
  };

  const toggleHidden = async (t) => {
    try {
      await updateDoc(doc(db, 'testimonials', t.id), { hidden: !t.hidden });
      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update visibility');
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    setSelectedIds(prev => prev.length === filteredItems.length ? [] : filteredItems.map(t => t.id));
  };

  const handleBulkDelete = async () => {
    const ok = await confirm({
      title: `Delete ${selectedIds.length} review(s)?`,
      description: 'This action cannot be undone.',
      confirmLabel: 'Delete All',
      tone: 'danger'
    });
    if (!ok) return;
    try {
      const batch = writeBatch(db);
      selectedIds.forEach(id => batch.delete(doc(db, 'testimonials', id)));
      await batch.commit();
      toast.success(`${selectedIds.length} review(s) deleted`);
      setSelectedIds([]);
      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error('Bulk delete failed');
    }
  };

  const handleBulkHide = async (hidden) => {
    try {
      const batch = writeBatch(db);
      selectedIds.forEach(id => batch.update(doc(db, 'testimonials', id), { hidden }));
      await batch.commit();
      toast.success(`${selectedIds.length} review(s) updated`);
      setSelectedIds([]);
      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error('Bulk update failed');
    }
  };

  return (
    <div className="admin-section-page">
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Client Reviews</h1>
          <p className="adm-page-desc">Manage client feedback shown on the homepage.</p>
        </div>
        <button className="admin-btn-primary" onClick={() => { setEditingId(null); setFormData(emptyForm); setIsModalOpen(true); }}>
          <Plus size={18} /> Add New Review
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div className="adm-search-box">
          <Search size={16} />
          <input placeholder="Search reviews..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {filteredItems.length > 0 && (
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--adm-dim)', cursor: 'pointer' }}>
            <input type="checkbox" checked={selectedIds.length === filteredItems.length} onChange={toggleSelectAll} />
            Select all
          </label>
        )}
      </div>

      {selectedIds.length > 0 && (
        <div className="bulk-action-bar">
          <span>{selectedIds.length} selected</span>
          <button className="admin-btn-secondary" onClick={() => handleBulkHide(true)}><EyeOff size={14} /> Hide</button>
          <button className="admin-btn-secondary" onClick={() => handleBulkHide(false)}><Eye size={14} /> Show</button>
          <button className="admin-btn-danger" onClick={handleBulkDelete}><Trash2 size={14} /> Delete</button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {filteredItems.map((t) => (
          <div key={t.id} className="admin-card" style={{ opacity: t.hidden ? 0.55 : 1, position: 'relative' }}>
            <input
              type="checkbox"
              checked={selectedIds.includes(t.id)}
              onChange={() => toggleSelect(t.id)}
              style={{ position: 'absolute', top: '1.25rem', left: '1.25rem' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem', gap: '0.4rem' }}>
              <div style={{ color: '#f59e0b', display: 'flex', gap: '2px', marginRight: 'auto', marginLeft: '1.75rem' }}>
                {[...Array(parseInt(t.stars))].map((_, i) => <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />)}
              </div>
              <button className="admin-icon-btn" onClick={() => toggleHidden(t)} title={t.hidden ? 'Show' : 'Hide'}>
                {t.hidden ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
              <button className="admin-icon-btn" onClick={() => { setEditingId(t.id); setFormData({ ...emptyForm, ...t }); setIsModalOpen(true); }}><Edit2 size={15} /></button>
              <button className="admin-icon-btn" onClick={() => handleDelete(t.id)}><Trash2 size={15} color="var(--adm-danger)" /></button>
            </div>
            <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--adm-txt)', marginBottom: '1.5rem', lineHeight: '1.6' }}>"{t.text}"</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--adm-red-soft)', color: 'var(--adm-red)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>{t.name?.charAt(0)}</div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{t.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--adm-dim)' }}>{t.role}</div>
              </div>
            </div>
          </div>
        ))}
        {filteredItems.length === 0 && !loading && (
          <p style={{ color: 'var(--adm-dim)' }}>No reviews found.</p>
        )}
      </div>

      {isModalOpen && (
        <div className="adm-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="admin-card" style={{ width: '100%', maxWidth: '500px', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setIsModalOpen(false)} className="admin-icon-btn" style={{ position: 'absolute', right: '1.5rem', top: '1.5rem' }}><X /></button>
            <h2 style={{ marginBottom: '1.5rem' }}>{editingId ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div><label className="setting-label">Client Name</label><input className="admin-input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required /></div>
                <div><label className="setting-label">Stars</label><select className="admin-input" value={formData.stars} onChange={(e) => setFormData({...formData, stars: e.target.value})}><option value="5">5 Stars</option><option value="4">4 Stars</option></select></div>
              </div>
              <div style={{ marginBottom: '1rem' }}><label className="setting-label">Client Role/Company</label><input className="admin-input" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} required /></div>
              <div style={{ marginBottom: '1.5rem' }}><label className="setting-label">Testimonial Text</label><textarea className="admin-input" style={{ height: '100px' }} value={formData.text} onChange={(e) => setFormData({...formData, text: e.target.value})} required /></div>
              <button type="submit" className="admin-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>{editingId ? 'Update Review' : 'Add Review'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsManager;
