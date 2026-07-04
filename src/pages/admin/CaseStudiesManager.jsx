import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, deleteDoc, doc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore';
import { Plus, Trash2, X, Loader2, BookOpen, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import MediaUploader from '../../components/admin/MediaUploader';
import { detailedCaseStudies } from '../../data/caseStudiesData';
import { useConfirm } from '../../context/ConfirmContext';

const curatedIds = new Set(Object.keys(detailedCaseStudies));

const emptyForm = {
  id: '',
  category: '',
  client: '',
  title: '',
  year: '',
  industry: '',
  duration: '',
  about: '',
  challenge: '',
  solution: '',
  color: '#E8192C',
  heroImage: '',
  results: [{ val: '', label: '' }],
  testimonialText: '',
  testimonialAuthor: '',
  testimonialPosition: '',
  hidden: false
};

const toFormShape = (item) => ({
  ...emptyForm,
  ...item,
  heroImage: item.heroImage || item.gallery?.find(g => g.type === 'hero')?.url || '',
  results: item.results?.length ? item.results : emptyForm.results,
  testimonialText: item.testimonialText ?? item.testimonial?.text ?? '',
  testimonialAuthor: item.testimonialAuthor ?? item.testimonial?.author ?? '',
  testimonialPosition: item.testimonialPosition ?? item.testimonial?.position ?? ''
});

const CaseStudiesManager = () => {
  const confirm = useConfirm();
  const [overrides, setOverrides] = useState({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'case_studies'));
      const map = {};
      snap.docs.forEach(d => { map[d.id] = { id: d.id, ...d.data() }; });
      setOverrides(map);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load case studies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const items = [
    ...Object.keys(detailedCaseStudies).map(id => ({
      ...detailedCaseStudies[id],
      ...overrides[id],
      id,
      isCurated: true
    })),
    ...Object.values(overrides).filter(o => !curatedIds.has(o.id))
  ];

  const openNew = () => {
    setEditingId(null);
    setFormData({ ...emptyForm, id: `case-${Date.now()}` });
    setIsModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setFormData(toFormShape(item));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setIsModalOpen(false);
  };

  const updateResult = (idx, key, value) => {
    const next = [...formData.results];
    next[idx] = { ...next[idx], [key]: value };
    setFormData({ ...formData, results: next });
  };

  const addResultRow = () => setFormData({ ...formData, results: [...formData.results, { val: '', label: '' }] });
  const removeResultRow = (idx) => setFormData({ ...formData, results: formData.results.filter((_, i) => i !== idx) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.id.trim()) {
      toast.error('Title and ID are required');
      return;
    }
    setSaving(true);
    try {
      const { id, ...payload } = formData;
      await setDoc(doc(db, 'case_studies', id), {
        ...payload,
        testimonial: {
          text: formData.testimonialText,
          author: formData.testimonialAuthor,
          position: formData.testimonialPosition
        },
        gallery: [{ type: 'hero', url: formData.heroImage, caption: formData.title }],
        updatedAt: serverTimestamp()
      }, { merge: true });
      toast.success('Case study saved');
      setIsModalOpen(false);
      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save case study');
    } finally {
      setSaving(false);
    }
  };

  const toggleHidden = async (item) => {
    try {
      await setDoc(doc(db, 'case_studies', item.id), { hidden: !item.hidden, updatedAt: serverTimestamp() }, { merge: true });
      toast.success(item.hidden ? 'Case study shown' : 'Case study hidden');
      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update visibility');
    }
  };

  const handleDelete = async (item) => {
    const ok = await confirm({
      title: item.isCurated ? 'Hide this case study?' : 'Delete this case study?',
      description: item.isCurated
        ? 'Built-in case studies can be hidden from the site, but not permanently deleted.'
        : 'This custom case study will be permanently removed.',
      confirmLabel: item.isCurated ? 'Hide' : 'Delete',
      tone: 'danger'
    });
    if (!ok) return;
    try {
      if (item.isCurated) {
        await setDoc(doc(db, 'case_studies', item.id), { hidden: true, updatedAt: serverTimestamp() }, { merge: true });
      } else {
        await deleteDoc(doc(db, 'case_studies', item.id));
      }
      toast.success('Updated');
      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error('Action failed');
    }
  };

  return (
    <div className="admin-section-page">
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title"><BookOpen size={24} /> Case Studies</h1>
          <p className="adm-page-desc">Full editorial control over challenge, solution, results, testimonial, and visuals for each case study.</p>
        </div>
        <button className="admin-btn-primary" onClick={openNew}><Plus size={18} /> New Case Study</button>
      </div>

      {loading ? (
        <div className="admin-loading"><Loader2 className="animate-spin" size={28} /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {items.map(item => (
            <div key={item.id} className="admin-card" style={{ padding: '1.5rem', opacity: item.hidden ? 0.55 : 1 }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--adm-red)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem' }}>{item.category || 'Case Study'}</div>
              <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{item.title}</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--adm-dim)', marginBottom: '1.25rem', lineHeight: 1.5 }}>{item.client} &middot; {item.industry}</p>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button className="admin-btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => openEdit(item)}>Edit</button>
                <button className="admin-icon-btn" onClick={() => toggleHidden(item)} title={item.hidden ? 'Show' : 'Hide'}>
                  {item.hidden ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                <button className="admin-icon-btn" onClick={() => handleDelete(item)} title="Remove">
                  <Trash2 size={15} color="var(--adm-danger)" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="adm-modal-overlay" onClick={closeModal}>
          <div className="admin-card" style={{ width: '100%', maxWidth: '760px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button type="button" onClick={closeModal} className="admin-icon-btn" style={{ position: 'absolute', right: '1.25rem', top: '1.25rem' }}><X size={18} /></button>
            <h2 style={{ marginBottom: '1.5rem' }}>{editingId ? 'Edit Case Study' : 'New Case Study'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div><label className="setting-label">Title</label><input className="admin-input" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required /></div>
                <div><label className="setting-label">Category</label><input className="admin-input" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} placeholder="e.g. Graphic Design" /></div>
                <div><label className="setting-label">Client</label><input className="admin-input" value={formData.client} onChange={e => setFormData({ ...formData, client: e.target.value })} /></div>
                <div><label className="setting-label">Industry</label><input className="admin-input" value={formData.industry} onChange={e => setFormData({ ...formData, industry: e.target.value })} /></div>
                <div><label className="setting-label">Year</label><input className="admin-input" value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} /></div>
                <div><label className="setting-label">Duration</label><input className="admin-input" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} /></div>
              </div>

              <div><label className="setting-label">About</label><textarea className="admin-input" rows={3} value={formData.about} onChange={e => setFormData({ ...formData, about: e.target.value })} /></div>
              <div><label className="setting-label">Challenge</label><textarea className="admin-input" rows={3} value={formData.challenge} onChange={e => setFormData({ ...formData, challenge: e.target.value })} /></div>
              <div><label className="setting-label">Solution</label><textarea className="admin-input" rows={3} value={formData.solution} onChange={e => setFormData({ ...formData, solution: e.target.value })} /></div>

              <div>
                <label className="setting-label">Hero Image</label>
                <MediaUploader label="Hero Image" value={formData.heroImage} accept="image/*" folder="creatifybd/case-studies" onChange={(url) => setFormData({ ...formData, heroImage: url })} />
              </div>

              <div>
                <label className="setting-label">Accent Color</label>
                <input type="color" value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} style={{ width: '60px', height: '36px', border: 'none', background: 'none', cursor: 'pointer' }} />
              </div>

              <div>
                <label className="setting-label">Results</label>
                {formData.results.map((r, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.6rem' }}>
                    <input className="admin-input" placeholder="Value e.g. 3x" value={r.val} onChange={e => updateResult(idx, 'val', e.target.value)} />
                    <input className="admin-input" placeholder="Label e.g. Engagement" value={r.label} onChange={e => updateResult(idx, 'label', e.target.value)} />
                    <button type="button" className="admin-icon-btn" onClick={() => removeResultRow(idx)}><X size={15} /></button>
                  </div>
                ))}
                <button type="button" className="admin-btn-secondary" onClick={addResultRow}><Plus size={14} /> Add Result</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
                <div><label className="setting-label">Testimonial</label><input className="admin-input" value={formData.testimonialText} onChange={e => setFormData({ ...formData, testimonialText: e.target.value })} /></div>
                <div><label className="setting-label">Author</label><input className="admin-input" value={formData.testimonialAuthor} onChange={e => setFormData({ ...formData, testimonialAuthor: e.target.value })} /></div>
                <div><label className="setting-label">Position</label><input className="admin-input" value={formData.testimonialPosition} onChange={e => setFormData({ ...formData, testimonialPosition: e.target.value })} /></div>
              </div>

              <button type="submit" className="admin-btn-primary" disabled={saving} style={{ justifyContent: 'center', padding: '1rem' }}>
                {saving ? 'Saving...' : editingId ? 'Update Case Study' : 'Publish Case Study'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseStudiesManager;
