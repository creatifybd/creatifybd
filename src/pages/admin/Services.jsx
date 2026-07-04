import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { Edit2, Eye, EyeOff, Plus, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import MediaUploader from '../../components/admin/MediaUploader';
import { useConfirm } from '../../context/ConfirmContext';

const emptyService = { title: '', desc: '', price: '', icon: '📱', imageUrl: '', bg: 's1', hidden: false };

const ServicesManager = () => {
  const confirm = useConfirm();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyService);
  const [saving, setSaving] = useState(false);

  useEffect(() => onSnapshot(collection(db, 'services'), (snapshot) => {
    setServices(snapshot.docs.map(item => ({ id: item.id, ...item.data() }))
      .sort((a, b) => (a.title || '').localeCompare(b.title || '')));
    setLoading(false);
  }, (error) => {
    console.error(error);
    setLoading(false);
    toast.error('Services could not be loaded. Check admin access.');
  }), []);

  const closeModal = () => {
    if (saving) return;
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(emptyService);
  };

  const openCreate = () => {
    setEditingId(null);
    setFormData(emptyService);
    setIsModalOpen(true);
  };

  const openEdit = (service) => {
    const { id, createdAt, updatedAt, ...data } = service;
    setEditingId(id);
    setFormData({ ...emptyService, ...data });
    setIsModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (editingId) await updateDoc(doc(db, 'services', editingId), formData);
      else await addDoc(collection(db, 'services'), formData);
      toast.success(editingId ? 'Service updated' : 'Service created');
      setSaving(false);
      closeModal();
    } catch (error) {
      console.error(error);
      toast.error('Service could not be saved.');
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirm({
      title: 'Delete this service?',
      description: 'This will remove it from the public services list.',
      confirmLabel: 'Delete',
      tone: 'danger'
    });
    if (!ok) return;
    try { await deleteDoc(doc(db, 'services', id)); toast.success('Service deleted'); }
    catch (error) { console.error(error); toast.error('Service could not be deleted.'); }
  };

  const toggleHide = async (id, hidden) => {
    try { await updateDoc(doc(db, 'services', id), { hidden: !hidden }); }
    catch (error) { console.error(error); toast.error('Visibility could not be updated.'); }
  };

  return (
    <div>
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Manage Services</h1>
          <p className="adm-page-desc">Add, edit, publish, or hide services offered by CreatifyBD.</p>
        </div>
        <button type="button" className="admin-btn" onClick={openCreate}><Plus size={18} /> Add New Service</button>
      </div>

      <div className="admin-card">
        {loading ? <p style={{ color: 'var(--adm-dim)' }}>Loading services...</p> : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead><tr><th>Visual</th><th>Service Title</th><th>Price Tag</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>{services.map(service => (
                <tr key={service.id} style={{ opacity: service.hidden ? 0.55 : 1 }}>
                  <td><div className="service-admin-visual">{service.imageUrl ? <img src={service.imageUrl} alt="" /> : <span>{service.icon}</span>}</div></td>
                  <td style={{ fontWeight: 700 }}>{service.title}</td>
                  <td style={{ color: 'var(--adm-red)', fontWeight: 700 }}>{service.price}</td>
                  <td><span className={`badge-status ${service.hidden ? 'badge-hidden' : 'badge-active'}`}>{service.hidden ? 'Hidden' : 'Visible'}</span></td>
                  <td><div className="table-actions-row">
                    <button type="button" className="adm-icon-btn" onClick={() => toggleHide(service.id, service.hidden)} aria-label="Toggle visibility">{service.hidden ? <Eye size={17} /> : <EyeOff size={17} />}</button>
                    <button type="button" className="adm-icon-btn" onClick={() => openEdit(service)} aria-label="Edit service"><Edit2 size={17} /></button>
                    <button type="button" className="adm-icon-btn" onClick={() => handleDelete(service.id)} aria-label="Delete service"><Trash2 size={17} /></button>
                  </div></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="admin-modal-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && closeModal()}>
          <div className="admin-card admin-modal-panel" role="dialog" aria-modal="true" aria-labelledby="service-dialog-title">
            <button type="button" className="admin-modal-close" onClick={closeModal} aria-label="Close dialog"><X size={18} /></button>
            <h2 id="service-dialog-title">{editingId ? 'Edit Service' : 'Add New Service'}</h2>
            <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
              <div className="settings-grid-2">
                <div><label>Icon (Emoji)</label><input className="admin-input" value={formData.icon} onChange={event => setFormData({ ...formData, icon: event.target.value })} required /></div>
                <div><label>Price Tag</label><input className="admin-input" value={formData.price} onChange={event => setFormData({ ...formData, price: event.target.value })} placeholder="e.g. From $150" required /></div>
              </div>
              <div style={{ marginTop: '1rem' }}><label>Title</label><input className="admin-input" value={formData.title} onChange={event => setFormData({ ...formData, title: event.target.value })} required /></div>
              <div style={{ marginTop: '1rem' }}><label>Description</label><textarea className="admin-input" rows="4" value={formData.desc} onChange={event => setFormData({ ...formData, desc: event.target.value })} required /></div>
              <div style={{ marginTop: '1rem' }}><MediaUploader label="Service Image" value={formData.imageUrl} accept="image/*" folder="creatifybd/services" helperText="Drop a service visual, browse, or use a direct link." onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))} /></div>
              <div className="admin-modal-actions">
                <button type="button" className="admin-btn-secondary" onClick={closeModal} disabled={saving}>Cancel</button>
                <button type="submit" className="admin-btn" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Update Service' : 'Create Service'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <style>{`
        .admin-modal-overlay{position:fixed;inset:0;background:rgba(15,18,24,.62);display:flex;justify-content:center;align-items:flex-start;z-index:30000;padding:clamp(.75rem,2vh,1.5rem);overflow-y:auto;overscroll-behavior:contain}
        .admin-modal-panel{width:min(620px,calc(100vw - 2rem));position:relative;max-height:calc(100dvh - 2rem);overflow-y:auto;margin:0 auto;border-radius:14px}
        .admin-modal-close{position:sticky;top:0;margin-left:auto;transform:translate(.35rem,-.35rem);width:38px;height:38px;border-radius:8px;background:var(--adm-bg);border:1px solid var(--adm-border);color:var(--adm-text);display:grid;place-items:center;cursor:pointer;z-index:2}
        .admin-modal-actions{position:sticky;bottom:0;background:linear-gradient(180deg,rgba(255,255,255,.78),#fff 28%);display:flex;justify-content:flex-end;gap:.75rem;margin:1rem -0.25rem 0;padding:1rem .25rem 0}
        .admin-modal-actions button{min-width:128px;justify-content:center}
        .admin-modal-panel .media-dropzone{min-height:118px;padding:1rem}
        .admin-modal-panel .media-uploader-head{align-items:flex-start}
        .service-admin-visual{width:72px;height:52px;border-radius:8px;background:var(--adm-bg);display:grid;place-items:center;overflow:hidden;font-size:1.4rem}.service-admin-visual img{width:100%;height:100%;object-fit:cover}
        @media(max-width:680px){.admin-modal-actions{flex-direction:column}.admin-modal-actions button{width:100%}.admin-modal-panel{width:calc(100vw - 1rem);max-height:calc(100dvh - 1rem)}}
      `}</style>
    </div>
  );
};

export default ServicesManager;
