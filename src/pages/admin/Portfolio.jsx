import React, { useState, useEffect } from 'react';
import { getData, addData, updateData, deleteData } from '../../firebase/services';
import { Plus, Trash2, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import MediaUploader from '../../components/admin/MediaUploader';

const PortfolioManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ title: '', category: '', imageUrl: '', hidden: false });

  const fetchItems = async () => {
    try {
      const data = await getData('portfolio');
      setItems(data || []);
    } catch (err) {
      // Error handled by service
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.imageUrl) return alert('Please upload an image first');
    setSaving(true);
    try {
      const { id, createdAt, updatedAt, ...payload } = formData;
      if (editingId) {
        await updateData('portfolio', editingId, payload);
      } else {
        await addData('portfolio', payload);
      }
      setSaving(false);
      closeModal();
      fetchItems(); // Refresh list
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const closeModal = () => {
    if (saving) return;
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ title: '', category: '', imageUrl: '', hidden: false });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this portfolio item?')) {
      await deleteData('portfolio', id);
      fetchItems(); // Refresh list
    }
  };


  return (
    <div className="admin-content-wrap">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem' }}>Manage Portfolio</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>Showcase your best work with high-res images.</p>
        </div>
        <button className="admin-btn" onClick={() => { setEditingId(null); setFormData({ title: '', category: '', imageUrl: '', hidden: false }); setIsModalOpen(true); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={20} /> Add New Item
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Loader2 className="animate-spin" size={40} /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {items.map((item) => (
            <div key={item.id} className="admin-card" style={{ padding: '0', overflow: 'hidden', position: 'relative' }}>
              <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '200px', objectFit: 'contain', background: '#111', padding: '0.5rem' }} />
              <div style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '0.7rem', color: '#E8192C', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.3rem' }}>{item.category}</div>
                <h4 style={{ fontWeight: '700', marginBottom: '1rem' }}>{item.title}</h4>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={() => { setEditingId(item.id); setFormData({ ...item }); setIsModalOpen(true); }} className="admin-btn" style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: '#fff' }}>Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="admin-btn" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}><Trash2 size={16} /></button>
                </div>
              </div>
              {item.hidden && <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.6rem' }}>HIDDEN</div>}
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="admin-card" style={{ width: '100%', maxWidth: '500px', position: 'relative' }}>
            <button type="button" onClick={closeModal} aria-label="Close dialog" style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', width: '36px', height: '36px', borderRadius: '8px', background: 'var(--adm-bg)', border: '1px solid var(--adm-border)', color: 'var(--adm-text)', cursor: 'pointer', display: 'grid', placeItems: 'center' }}><X size={18} /></button>
            <h2 style={{ marginBottom: '1.5rem' }}>{editingId ? 'Edit Portfolio Item' : 'Add Portfolio Item'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <MediaUploader label="Portfolio Image" value={formData.imageUrl} accept="image/*" folder="creatifybd/portfolio" helperText="Drop an image, browse your device, or switch to Link." onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))} />
              </div>
              <div style={{ marginBottom: '1rem' }}><label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Project Title</label><input className="admin-input" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. Fashion Brand Identity" required /></div>
              <div style={{ marginBottom: '1.5rem' }}><label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Category</label><input className="admin-input" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} placeholder="e.g. Branding / Photography" required /></div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" className="admin-btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={closeModal} disabled={saving}>Cancel</button>
                <button type="submit" className="admin-btn" style={{ flex: 2, padding: '1rem', fontWeight: 800 }} disabled={saving}>{saving ? 'Saving...' : editingId ? 'Update Item' : 'Publish to Portfolio'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioManager;
