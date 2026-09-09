import React, { useState, useEffect, useMemo } from 'react';
import { addData, deleteData, logActivity } from '../../firebase/services';
import { doc, serverTimestamp, setDoc, writeBatch, collection, getDocs, runTransaction, increment } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Plus, Trash2, X, Loader2, Search, Eye, EyeOff, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import MediaUploader from '../../components/admin/MediaUploader';
import publishedRelease from '../../data/publishedRelease.json';
const CURATED_PORTFOLIO = publishedRelease.portfolio.map(item => ({ ...item, service: item.category, tags: [], seoTitle: item.title, seoDescription: item.description, featured: Number.isInteger(item.featuredOrder) }));
import { useConfirm } from '../../context/ConfirmContext';

const curatedIds = new Set(CURATED_PORTFOLIO.map(item => item.id));
const emptyForm = {
  title: '',
  category: 'social',
  workType: 'sample',
  clientPermission: false,
  revision: 0,
  imageUrl: '',
  description: '',
  service: '',
  industry: '',
  hidden: false,
  featured: false,
  featuredOrder: 0
};

const PortfolioManager = () => {
  const confirm = useConfirm();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchItems = async () => {
    let storedItems = [];
    let storedById = new Map();

    // Step 1: Fetch from Firestore directly (no toast on failure)
    try {
      const querySnapshot = await getDocs(collection(db, 'portfolio'));
      storedItems = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      storedById = new Map(storedItems.map(item => [item.id, item]));
    } catch (_err) {
      // Firestore read failed — UI will use local CURATED_PORTFOLIO data only
    }

    // Step 2: Always build the UI list using local CURATED_PORTFOLIO + Firestore images/hidden/featured
    const syncedCurated = CURATED_PORTFOLIO.map(item => {
      const override = storedById.get(item.id);
      return {
        ...item,
        ...override,
        imageUrl: override?.imageUrl || override?.image || item.image,
        hidden: override?.hidden !== undefined ? override.hidden : false,
        revision: override?.revision || 0,
        featured: override?.featured !== undefined ? override.featured : item.featured || false,
        featuredOrder: override?.featuredOrder !== undefined ? override.featuredOrder : item.featuredOrder || 0,
        isCurated: true
      };
    });

    const customItems = storedItems
      .filter(item => !curatedIds.has(item.id))
      .map(item => ({ ...item, imageUrl: item.imageUrl || item.image }));

    setItems([...syncedCurated, ...customItems]);
    setLoading(false);

    // Reading this screen never writes or re-seeds the database.

  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;
    return items.filter(i =>
      i.title?.toLowerCase().includes(term) ||
      i.category?.toLowerCase().includes(term) ||
      i.service?.toLowerCase().includes(term) ||
      i.industry?.toLowerCase().includes(term)
    );
  }, [items, search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.imageUrl) { toast.error('Please upload an image first'); return; }
    if (!/[\u0980-\u09ff]/.test(formData.title)) { toast.error('প্রকল্পের নাম বাংলায় লিখুন।'); return; }
    if (formData.workType === 'client' && !formData.clientPermission) { toast.error('গ্রাহকের কাজ প্রকাশের অনুমতি নিশ্চিত করুন।'); return; }
    setSaving(true);
    try {
      const { id, createdAt, updatedAt, ...payload } = formData;
      if (editingId) {
        await runTransaction(db, async transaction => {
          const ref = doc(db, 'portfolio', editingId);
          const current = await transaction.get(ref);
          if ((current.data()?.revision || 0) !== (formData.revision || 0)) throw new Error('এই কাজের তথ্যে অন্য পরিবর্তন এসেছে। তালিকা নতুন করে খুলে মিলিয়ে নিন।');
          transaction.set(ref, { ...payload, revision: (formData.revision || 0) + 1, updatedAt: serverTimestamp() }, { merge: true });
        });
        toast.success('Portfolio item updated.');
      } else {
        await addData('portfolio', payload);
        toast.success('Portfolio draft saved. Publish a new release to show it on the website.');
      }
      closeModal(true);
      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to save portfolio item.');
    } finally {
      setSaving(false);
    }
  };

  const closeModal = (force = false) => {
    if (saving && force !== true) return;
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleDelete = async (item) => {
    const ok = await confirm({
      title: 'Archive this portfolio item?',
      description: 'It will be excluded from the next published release. Its draft remains recoverable.',
      confirmLabel: 'Delete',
      tone: 'danger'
    });
    if (!ok) return;
    try {
      await setDoc(doc(db, 'portfolio', item.id), { hidden: true, published: false, revision: increment(1), updatedAt: serverTimestamp() }, { merge: true });
      toast.success('Portfolio item archived in the draft.');
      logActivity({ action: 'portfolio.delete', resource: 'portfolio', resourceId: item.id, details: item.title || '' });
      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error('Action failed.');
    }
  };

  const toggleHidden = async (item) => {
    try {
      await setDoc(doc(db, 'portfolio', item.id), { hidden: !item.hidden, published: item.hidden, revision: increment(1), updatedAt: serverTimestamp() }, { merge: true });
      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update visibility');
    }
  };

  const toggleFeatured = async (item) => {
    try {
      await setDoc(doc(db, 'portfolio', item.id), { featured: !item.featured, featuredOrder: !item.featured ? Date.now() : 0, revision: increment(1), updatedAt: serverTimestamp() }, { merge: true });
      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update featured status');
    }
  };

  const updateFeaturedOrder = async (item, newOrder) => {
    try {
      await setDoc(doc(db, 'portfolio', item.id), { featuredOrder: newOrder, revision: increment(1), updatedAt: serverTimestamp() }, { merge: true });
      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update featured order');
    }
  };

  const toggleSelect = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  const toggleSelectAll = () => setSelectedIds(prev => prev.length === filteredItems.length ? [] : filteredItems.map(i => i.id));

  const handleBulkHide = async (hidden) => {
    try {
      const batch = writeBatch(db);
      selectedIds.forEach(id => batch.set(doc(db, 'portfolio', id), { hidden, published: !hidden, revision: increment(1), updatedAt: serverTimestamp() }, { merge: true }));
      await batch.commit();
      toast.success(`${selectedIds.length} item(s) updated`);
      setSelectedIds([]);
      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error('Bulk update failed');
    }
  };

  const handleSyncToFirestore = async () => {
    await fetchItems();
    toast.success('Portfolio drafts refreshed. Publication uses the protected release workflow.');
  };

  const handleBulkDelete = async () => {
    const customSelected = selectedIds.filter(id => !curatedIds.has(id));
    if (customSelected.length === 0) {
      toast.error('Built-in items can only be hidden, not deleted. Use "Hide" instead.');
      return;
    }
    const ok = await confirm({
      title: `Delete ${customSelected.length} item(s)?`,
      description: 'This action cannot be undone. Built-in items in your selection will be skipped.',
      confirmLabel: 'Delete',
      tone: 'danger'
    });
    if (!ok) return;
    try {
      for (const id of customSelected) {
        await deleteData('portfolio', id);
      }
      toast.success(`${customSelected.length} item(s) deleted`);
      setSelectedIds([]);
      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error('Bulk delete failed');
    }
  };

  return (
    <div className="admin-section-page">
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Manage Portfolio</h1>
          <p className="adm-page-desc">Manage every portfolio item shown on the public website.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="admin-btn-secondary" onClick={handleSyncToFirestore}>
            <RefreshCw size={18} /> Refresh drafts
          </button>
          <button className="admin-btn-primary" onClick={() => { setEditingId(null); setFormData(emptyForm); setIsModalOpen(true); }}>
            <Plus size={18} /> Add New Item
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div className="adm-search-box">
          <Search size={16} />
          <input placeholder="Search portfolio..." value={search} onChange={e => setSearch(e.target.value)} />
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
          <button className="admin-btn-danger" onClick={handleBulkDelete}><Trash2 size={14} /> Delete Custom</button>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Loader2 className="animate-spin" size={40} /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {filteredItems.map((item) => (
            <div key={item.id} className="admin-card" style={{ padding: '0', overflow: 'hidden', position: 'relative' }}>
              <input
                type="checkbox"
                checked={selectedIds.includes(item.id)}
                onChange={() => toggleSelect(item.id)}
                style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', zIndex: 2 }}
              />
              <img src={item.imageUrl || item.image} alt={item.title} style={{ width: '100%', height: '200px', objectFit: 'contain', background: '#f8f9fb', padding: '0.5rem' }} />
              <div style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '0.7rem', color: '#E8192C', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.3rem' }}>{item.category}</div>
                <h4 style={{ fontWeight: '700', marginBottom: '1rem' }}>{item.title}</h4>
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--adm-dim)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <input type="checkbox" checked={item.featured || false} onChange={() => toggleFeatured(item)} />
                    Featured
                  </label>
                  {item.featured && (
                    <input
                      type="number"
                      value={item.featuredOrder || 0}
                      onChange={(e) => updateFeaturedOrder(item, parseInt(e.target.value) || 0)}
                      style={{ width: '60px', padding: '0.25rem', fontSize: '0.75rem', border: '1px solid var(--border)', borderRadius: '4px' }}
                      title="Featured order (lower number = higher priority)"
                    />
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button onClick={() => { setEditingId(item.id); setFormData({ ...emptyForm, ...item, imageUrl: item.imageUrl || item.image }); setIsModalOpen(true); }} className="admin-btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Edit</button>
                  <button className="admin-icon-btn" onClick={() => toggleHidden(item)} title={item.hidden ? 'Show' : 'Hide'}>
                    {item.hidden ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                  <button onClick={() => handleDelete(item)} aria-label="Delete portfolio item" className="admin-icon-btn"><Trash2 size={16} color="var(--adm-danger)" /></button>
                </div>
              </div>
              {item.hidden && <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.6rem' }}>HIDDEN</div>}
              {item.featured && <div style={{ position: 'absolute', top: '10px', right: item.hidden ? '70px' : '10px', background: '#E8192C', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.6rem', fontWeight: '700' }}>★ FEATURED</div>}
            </div>
          ))}
          {filteredItems.length === 0 && <p style={{ color: 'var(--adm-dim)' }}>No portfolio items found.</p>}
        </div>
      )}

      {isModalOpen && (
        <div className="adm-modal-overlay" onClick={closeModal}>
          <div className="admin-card" style={{ width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button type="button" onClick={closeModal} aria-label="Close dialog" className="admin-icon-btn" style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', zIndex: 2 }}><X size={18} /></button>
            <h2 style={{ marginBottom: '1.5rem', paddingRight: '2rem' }}>{editingId ? 'Edit Portfolio Item' : 'Add Portfolio Item'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <MediaUploader label="Portfolio Image" value={formData.imageUrl} accept="image/*" folder="creatifybd/portfolio" helperText="Drop an image, browse your device, or switch to Link." onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))} />
              </div>
              <div style={{ marginBottom: '1rem' }}><label className="setting-label">Project Title</label><input className="admin-input" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. Fashion Brand Identity" required /></div>
              <div style={{ marginBottom: '1.5rem' }}><label className="setting-label">Category</label><select className="admin-input" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>{[['social','সোশ্যাল পোস্ট'],['branding','লোগো ও ব্র্যান্ডিং'],['packaging','প্যাকেজিং'],['web','ওয়েবসাইট'],['video','ভিডিও'],['apparel','মার্চেন্ডাইজ']].map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></div>
              <div style={{ marginBottom: 16 }}><label className="setting-label">কাজের পরিচয়</label><select className="admin-input" value={formData.workType || 'sample'} onChange={e => setFormData({ ...formData, workType: e.target.value })}><option value="sample">নির্বাচিত নমুনা</option><option value="concept">ধারণাভিত্তিক ডিজাইন</option><option value="client">গ্রাহকের প্রকল্প</option></select>{formData.workType === 'client' && <label><input type="checkbox" checked={Boolean(formData.clientPermission)} onChange={e => setFormData({ ...formData, clientPermission: e.target.checked })} /> গ্রাহক প্রকাশের অনুমতি দিয়েছেন</label>}</div>
              <div style={{ marginBottom: '1rem' }}><label className="setting-label">Service</label><input className="admin-input" value={formData.service || ''} onChange={(e) => setFormData({...formData, service: e.target.value})} placeholder="e.g. Social Media Management" /></div>
              <div style={{ marginBottom: '1rem' }}><label className="setting-label">Industry</label><input className="admin-input" value={formData.industry || ''} onChange={(e) => setFormData({...formData, industry: e.target.value})} placeholder="e.g. SaaS, Retail, Hospitality" /></div>
              <div style={{ marginBottom: '1.5rem' }}><label className="setting-label">Description</label><textarea className="admin-input" rows="4" value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Explain the project scope, deliverables, and outcome." /></div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" className="admin-btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={closeModal} disabled={saving}>Cancel</button>
                <button type="submit" className="admin-btn-primary" style={{ flex: 2, padding: '1rem', justifyContent: 'center' }} disabled={saving}>{saving ? 'Saving...' : editingId ? 'Update Item' : 'Publish to Portfolio'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioManager;
