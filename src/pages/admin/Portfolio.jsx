import React, { useState, useEffect } from 'react';
import { getData, addData, updateData, deleteData } from '../../firebase/services';
import { uploadImage } from '../../utils/cloudinary';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Upload, Loader2, CloudCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const PortfolioManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 20 * 1024 * 1024) {
      alert("File is too large. Max size is 20MB.");
      return;
    }

    setUploading(true);
    setProgress(0);
    try {
      const url = await uploadImage(file, (p) => {
        setProgress(p);
      });
      setFormData({ ...formData, imageUrl: url });
    } catch (err) { 
      alert('Upload failed: ' + (err.message || 'Unknown error')); 
    }
    setUploading(false);
    setProgress(0);
  };

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
    if (uploading || saving) return;
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
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>Portfolio Image</label>
                <div style={{ width: '100%', height: '220px', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', background: 'rgba(255,255,255,0.02)' }}>
                  {formData.imageUrl && !uploading ? (
                    <>
                      <img src={formData.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#111', padding: '0.5rem' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: '0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity=1} onMouseLeave={e => e.currentTarget.style.opacity=0}>
                        <label style={{ cursor: 'pointer', background: '#fff', color: '#000', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700' }}>
                          Change Image
                          <input type="file" hidden onChange={handleFileChange} accept="image/*" />
                        </label>
                      </div>
                    </>
                  ) : (
                    <label style={{ cursor: 'pointer', textAlign: 'center', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      {uploading ? (
                        <div style={{ width: '100%', padding: '0 2rem' }}>
                          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden', marginBottom: '1rem' }}>
                            <div style={{ width: `${progress}%`, height: '100%', background: 'var(--red)', transition: 'width 0.3s ease' }} />
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>Uploading... {progress}%</div>
                        </div>
                      ) : (
                        <>
                          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                            <Upload size={24} style={{ color: 'rgba(255,255,255,0.3)' }} />
                          </div>
                          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', fontWeight: 500 }}>Click to upload high-res image</div>
                          <input type="file" hidden onChange={handleFileChange} accept="image/*" />
                        </>
                      )}
                    </label>
                  )}
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}><label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Project Title</label><input className="admin-input" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. Fashion Brand Identity" required /></div>
              <div style={{ marginBottom: '1.5rem' }}><label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Category</label><input className="admin-input" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} placeholder="e.g. Branding / Photography" required /></div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" className="admin-btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={closeModal} disabled={uploading || saving}>Cancel</button>
                <button type="submit" className="admin-btn" style={{ flex: 2, padding: '1rem', fontWeight: 800 }} disabled={uploading || saving}>{saving ? 'Saving...' : editingId ? 'Update Item' : 'Publish to Portfolio'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioManager;
