import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase/config';
import { collection, doc, onSnapshot, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { uploadImage } from '../../utils/imgbb';
import { Upload, Loader2, CheckCircle2, Plus, Trash2, Edit2, X } from 'lucide-react';
import { detailedCaseStudies } from '../../data/caseStudiesData';

const UploadSlot = ({ label, currentUrl, onUpload, uploading, progress, accentColor = '#E8192C' }) => (
  <div style={{ marginBottom: '1.25rem' }}>
    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem', display: 'flex', justifyContent: 'space-between' }}>
      <span>{label}</span>
      {uploading && <span style={{ color: accentColor }}>{progress}%</span>}
    </div>
    <div style={{
      width: '100%', height: '180px', borderRadius: '16px',
      border: currentUrl ? 'none' : '1.5px dashed rgba(255,255,255,0.15)',
      background: currentUrl ? 'transparent' : 'rgba(255,255,255,0.03)',
      overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'all 0.3s ease'
    }}>
      {currentUrl && !uploading ? (
        <>
          <img src={currentUrl} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: 0, transition: '0.2s'
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = 1}
            onMouseLeave={e => e.currentTarget.style.opacity = 0}
          >
            <label style={{ cursor: 'pointer', background: 'white', color: 'black', padding: '0.6rem 1.4rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 800 }}>
              Replace Image
              <input type="file" hidden accept="image/*" onChange={onUpload} />
            </label>
          </div>
        </>
      ) : (
        <label style={{ cursor: 'pointer', textAlign: 'center', padding: '2rem', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {uploading ? (
            <div style={{ width: '100%', padding: '0 2rem' }}>
              <div style={{ position: 'relative', width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden', marginBottom: '1rem' }}>
                <div style={{ 
                  position: 'absolute', top: 0, left: 0, height: '100%', 
                  background: accentColor, width: `${progress}%`,
                  transition: 'width 0.3s ease'
                }} />
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                Uploading... {progress}%
              </div>
            </div>
          ) : (
            <>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Upload size={20} style={{ color: 'rgba(255,255,255,0.4)' }} />
              </div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
                Click to upload
              </div>
              <input type="file" hidden accept="image/*" onChange={onUpload} />
            </>
          )}
        </label>
      )}
    </div>
  </div>
);

const CaseStudyCard = ({ cs, onEdit, onDelete }) => {
  const [images, setImages] = useState({ heroUrl: '', resultUrl: '' });
  const [uploading, setUploading] = useState({ hero: false, result: false });
  const [progress, setProgress] = useState({ hero: 0, result: 0 });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'case_study_images', cs.id), (snap) => {
      if (snap.exists()) setImages(snap.data());
    });
    return () => unsub();
  }, [cs.id]);

  const handleUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) return alert("File is too large. Max size is 15MB.");

    setUploading(prev => ({ ...prev, [type]: true }));
    setProgress(prev => ({ ...prev, [type]: 0 }));

    try {
      if (!auth.currentUser) throw new Error("Authentication failed. Please re-login.");
      const url = await uploadImage(file, (p) => setProgress(prev => ({ ...prev, [type]: p })));
      
      const updated = { ...images, [`${type}Url`]: url };
      setImages(updated);
      await setDoc(doc(db, 'case_study_images', cs.id), updated, { merge: true });
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert(`Upload failed: ${err.message}`);
    }
    setUploading(prev => ({ ...prev, [type]: false }));
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '24px', padding: '2rem', marginBottom: '2rem', position: 'relative'
    }}>
      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', gap: '0.5rem' }}>
        <button onClick={() => onEdit(cs)} className="admin-btn-secondary" style={{ padding: '0.4rem', minWidth: 'auto' }}><Edit2 size={16} /></button>
        <button onClick={() => onDelete(cs.id)} className="admin-btn-secondary" style={{ padding: '0.4rem', minWidth: 'auto', color: '#ff4444' }}><Trash2 size={16} /></button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${cs.color || '#E8192C'}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: cs.color || '#E8192C', fontSize: '1.2rem', fontWeight: 800 }}>
            {(cs.client || cs.title || 'A').charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: cs.color || '#E8192C', marginBottom: '0.2rem' }}>
              {cs.category} • {cs.client}
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', maxWidth: '400px' }}>{cs.title}</h3>
          </div>
        </div>
        {saved && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#22c55e', fontSize: '0.85rem', fontWeight: 700, background: 'rgba(34, 197, 94, 0.1)', padding: '0.5rem 1rem', borderRadius: '100px' }}>
            <CheckCircle2 size={16} /> Images Saved
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <UploadSlot
          label="Hero / Cover Visual"
          currentUrl={images.heroUrl}
          onUpload={(e) => handleUpload(e, 'hero')}
          uploading={uploading.hero}
          progress={progress.hero}
          accentColor={cs.color}
        />
        <UploadSlot
          label="Results / Outcome Mockup"
          currentUrl={images.resultUrl}
          onUpload={(e) => handleUpload(e, 'result')}
          uploading={uploading.result}
          progress={progress.result}
          accentColor={cs.color}
        />
      </div>
    </div>
  );
};

const CaseStudyFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    title: '', client: '', category: '', color: '#E8192C', tagline: '',
    results: [{ val: '', label: '' }, { val: '', label: '' }]
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
    else setFormData({ title: '', client: '', category: '', color: '#E8192C', tagline: '', results: [{ val: '', label: '' }, { val: '', label: '' }] });
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div style={{ background: '#111', width: '100%', maxWidth: '600px', borderRadius: '20px', padding: '2rem', border: '1px solid #333', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 800 }}>{initialData ? 'Edit' : 'New'} Case Study</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X /></button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', color: 'var(--adm-dim)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Project Title</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="admin-input" required placeholder="e.g. Redefining Urban Visual Identity" />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--adm-dim)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Client Name</label>
              <input type="text" value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} className="admin-input" required />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--adm-dim)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Category</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="admin-input" required>
                <option value="">Select Category</option>
                <option value="Graphic Design">Graphic Design</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="Website Design">Website Design</option>
                <option value="Video Editing">Video Editing</option>
                <option value="Branding Design">Branding Design</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', color: 'var(--adm-dim)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Brand Color (Hex)</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input type="color" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} style={{ width: '50px', height: '40px', padding: 0, border: 'none', borderRadius: '8px' }} />
              <input type="text" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="admin-input" style={{ flex: 1 }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', color: 'var(--adm-dim)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Short Tagline (For Homepage)</label>
            <input type="text" value={formData.tagline || ''} onChange={e => setFormData({...formData, tagline: e.target.value})} className="admin-input" placeholder="e.g. A futuristic approach to SaaS" />
          </div>

          <div style={{ borderTop: '1px solid #333', paddingTop: '1.5rem' }}>
            <h4 style={{ color: 'white', marginBottom: '1rem' }}>Key Results</h4>
            {[0, 1].map(i => (
              <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <input type="text" value={formData.results?.[i]?.val || ''} onChange={e => {
                    const newRes = [...(formData.results || [{val:'',label:''},{val:'',label:''}])];
                    if(!newRes[i]) newRes[i] = {val:'', label:''};
                    newRes[i].val = e.target.value;
                    setFormData({...formData, results: newRes});
                  }} className="admin-input" placeholder="Value (e.g. +120%)" />
                </div>
                <div style={{ flex: 2 }}>
                  <input type="text" value={formData.results?.[i]?.label || ''} onChange={e => {
                    const newRes = [...(formData.results || [{val:'',label:''},{val:'',label:''}])];
                    if(!newRes[i]) newRes[i] = {val:'', label:''};
                    newRes[i].label = e.target.value;
                    setFormData({...formData, results: newRes});
                  }} className="admin-input" placeholder="Label (e.g. Brand Recall)" />
                </div>
              </div>
            ))}
          </div>

          <button type="submit" className="admin-btn-primary" style={{ marginTop: '1rem' }}>
            {initialData ? 'Save Changes' : 'Create Case Study'}
          </button>
        </form>
      </div>
    </div>
  );
};

const CaseStudiesManager = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'case_studies'), (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCases(data.sort((a,b) => (b.createdAt?.toMillis ? b.createdAt.toMillis() : 0) - (a.createdAt?.toMillis ? a.createdAt.toMillis() : 0)));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleSeed = async () => {
    if(!window.confirm("Seed initial case studies?")) return;
    const seedData = [
      { ...(detailedCaseStudies["graphic-design-apex"] || {}), id: "graphic-design-apex", category: "Graphic Design", client: "Apex Streetwear", title: "Redefining Urban Visual Identity", tagline: "A modern identity for streetwear", results: [{ val: "+120%", label: "Brand Recall" }, { val: "Top 10", label: "Global Trends" }], color: "#000000" },
      { ...(detailedCaseStudies["marketing-luxe"] || {}), id: "marketing-luxe", category: "Digital Marketing", client: "Luxe Real Estate", title: "400% Lead Growth via Targeted Funnels", tagline: "Scaling high-end real estate leads", results: [{ val: "400%", label: "Lead Growth" }, { val: "3.5x", label: "ROAS" }], color: "#D4AF37" },
      { ...(detailedCaseStudies["web-design-finflow"] || {}), id: "web-design-finflow", category: "Website Design", client: "FinFlow SaaS", title: "Crafting a High-Conversion SaaS Experience", tagline: "A futuristic approach to SaaS", results: [{ val: "65%", label: "Conversion Lift" }, { val: "0.8s", label: "Load Time" }], color: "#6366F1" },
      { id: "video-editing-velocity", category: "Video Editing", client: "Velocity Sports", title: "Cinematic Content: 2M+ Organic Views", tagline: "Viral sports edits", results: [{ val: "2.2M", label: "Organic Views" }, { val: "85%", label: "Watch Time" }], color: "#E8192C" },
      { id: "branding-ecosphere", category: "Branding Design", client: "EcoSphere Tech", title: "Building a Sustainable Global Legacy", tagline: "Eco-friendly tech branding", results: [{ val: "Series B", label: "Funding Secured" }, { val: "Global", label: "Impact Award" }], color: "#10B981" },
      { id: "marketing-nexus", category: "Digital Marketing", client: "Nexus E-commerce", title: "Scaling a Fashion Startup to $1M ARR", tagline: "E-commerce growth hacking", results: [{ val: "$1M+", label: "Annual Revenue" }, { val: "250k", label: "Active Users" }], color: "#EC4899" },
      { id: "web-design-quantum", category: "Website Design", client: "Quantum Robotics", title: "Futuristic Portal for Deep Tech Innovation", tagline: "Immersive deep tech web", results: [{ val: "92%", label: "Trust Index" }, { val: "14", label: "Industry Awards" }], color: "#8B5CF6" },
      { id: "graphic-design-vibe", category: "Graphic Design", client: "Vibe Beverage Co.", title: "Minimalist Packaging for a Gen-Z Audience", tagline: "Gen-Z focused packaging", results: [{ val: "100%", label: "Retail Uptake" }, { val: "50k", label: "Social Shares" }], color: "#F59E0B" }
    ];

    try {
      for (const item of seedData) {
        await setDoc(doc(db, 'case_studies', item.id), { ...item, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
      }
      alert("Seed complete!");
    } catch(err) {
      alert(err.message);
    }
  };

  const handleSave = async (data) => {
    try {
      const id = data.id || `cs-${Date.now()}`;
      await setDoc(doc(db, 'case_studies', id), {
        ...data,
        updatedAt: serverTimestamp(),
        createdAt: data.createdAt || serverTimestamp()
      }, { merge: true });
      setIsModalOpen(false);
    } catch(err) {
      alert("Error saving case study: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this case study?")) {
      await deleteDoc(doc(db, 'case_studies', id));
    }
  };

  if (loading) return <div className="admin-loading">Loading Case Studies...</div>;

  return (
    <div className="admin-content-wrap">
      <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.75rem', letterSpacing: '-0.03em' }}>Premium Case Studies</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem', maxWidth: '600px', lineHeight: 1.6 }}>
            Manage your success stories. Create projects, define key results, and upload cinematic visuals.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {cases.length === 0 && (
            <button className="admin-btn-secondary" onClick={handleSeed}>Seed Data</button>
          )}
          <button className="admin-btn-primary" onClick={() => { setEditingData(null); setIsModalOpen(true); }}>
            <Plus size={18} /> New Case Study
          </button>
        </div>
      </div>

      {cases.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px dashed #333' }}>
          <p style={{ color: 'var(--adm-dim)', marginBottom: '1rem' }}>No case studies found.</p>
          <button className="admin-btn-secondary" onClick={() => { setEditingData(null); setIsModalOpen(true); }}>Create your first one</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
          {cases.map(cs => (
            <CaseStudyCard 
              key={cs.id} 
              cs={cs} 
              onEdit={(data) => { setEditingData(data); setIsModalOpen(true); }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <CaseStudyFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={editingData}
        onSubmit={handleSave}
      />
    </div>
  );
};

export default CaseStudiesManager;
