import React, { useState, useEffect } from 'react';
import { getData, addData, deleteData } from '../../firebase/services';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Plus, Trash2, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import MediaUploader from '../../components/admin/MediaUploader';
import { CURATED_PORTFOLIO } from '../../data/portfolioItems';

const curatedIds = new Set(CURATED_PORTFOLIO.map(item => item.id));
const emptyForm = {
  title: '',
  category: '',
  imageUrl: '',
  description: '',
  service: '',
  industry: '',
  hidden: false
};

const PortfolioManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  const fetchItems = async () => {
    try {
      const data = await getData('portfolio');
      const storedItems = data || [];
      const storedById = new Map(storedItems.map(item => [item.id, item]));
      const syncedCurated = CURATED_PORTFOLIO.map(item => {
        const override = storedById.get(item.id);
        return {
          ...item,
          ...override,
          imageUrl: override?.imageUrl || override?.image || item.image,
          isCurated: true
        };
      });
      const customItems = storedItems
        .filter(item => !curatedIds.has(item.id))
        .map(item => ({ ...item, imageUrl: item.imageUrl || item.image }));
      setItems([...syncedCurated, ...customItems]);
    } catch (err) {
      setItems(CURATED_PORTFOLIO.map(item => ({ ...item, imageUrl: item.image, isCurated: true })));
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
        await setDoc(doc(db, 'portfolio', editingId), {
          ...payload,
          updatedAt: serverTimestamp()
        }, { merge: true });
        toast.success('Portfolio item updated.');
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
    setFormData(emptyForm);
  };

  const handleDelete = async (item) => {
    const action = item.isCurated ? 'hide this built-in portfolio item' : 'delete this portfolio item';
    if (window.confirm(`Are you sure you want to ${action}?`)) {
      if (item.isCurated) {
        await setDoc(doc(db, 'portfolio', item.id), {
          hidden: true,
          updatedAt: serverTimestamp()
        }, { merge: true });
        toast.success('Portfolio item hidden from the website.');
      } else {
        await deleteData('portfolio', item.id);
      }
      fetchItems(); // Refresh list
    }
  };


  return (
    <div className="admin-content-wrap">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem' }}>Manage Portfolio</h1>
          <p style={{ color: 'var(--adm-dim)' }}>Manage every portfolio item shown on the public website.</p>
        </div>
        <button className="admin-btn" onClick={() => { setEditingId(null); setFormData(emptyForm); setIsModalOpen(true); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={20} /> Add New Item
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Loader2 className="animate-spin" size={40} /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {items.map((item) => (
            <div key={item.id} className="admin-card" style={{ padding: '0', overflow: 'hidden', position: 'relative' }}>
              <img src={item.imageUrl || item.image} alt={item.title} style={{ width: '100%', height: '200px', objectFit: 'contain', background: '#f8f9fb', padding: '0.5rem' }} />
              <div style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '0.7rem', color: '#E8192C', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.3rem' }}>{item.category}</div>
                <h4 style={{ fontWeight: '700', marginBottom: '1rem' }}>{item.title}</h4>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={() => { setEditingId(item.id); setFormData({ ...emptyForm, ...item, imageUrl: item.imageUrl || item.image }); setIsModalOpen(true); }} className="admin-btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Edit</button>
                  <button onClick={() => handleDelete(item)} className="admin-btn-secondary" style={{ color: '#ef4444' }}><Trash2 size={16} /></button>
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
              <div style={{ marginBottom: '1rem' }}><label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Service</label><input className="admin-input" value={formData.service || ''} onChange={(e) => setFormData({...formData, service: e.target.value})} placeholder="e.g. Social Media Management" /></div>
              <div style={{ marginBottom: '1rem' }}><label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Industry</label><input className="admin-input" value={formData.industry || ''} onChange={(e) => setFormData({...formData, industry: e.target.value})} placeholder="e.g. SaaS, Retail, Hospitality" /></div>
              <div style={{ marginBottom: '1.5rem' }}><label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Description</label><textarea className="admin-input" rows="4" value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Explain the project scope, deliverables, and outcome." /></div>
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
