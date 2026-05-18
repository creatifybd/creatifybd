import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, doc, onSnapshot, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { Plus, Trash2, Edit2, X, AlertCircle } from 'lucide-react';

const categories = [
  { id: 'social', label: 'Social Media' },
  { id: 'branding', label: 'Branding' },
  { id: 'web', label: 'Web Dev' },
  { id: 'video', label: 'Video Production' }
];

const fallbackPricing = {
  social: [
    { id: 's1', category: 'social', tier: 'Basic', tier_bn: 'বেসিক', price: '15,000', desc: 'Perfect for small businesses', desc_bn: 'ছোট ব্যবসার জন্য', features: ['12 Social Posts/mo', 'Basic Page Moderation', 'Monthly Report', 'Community Management'], features_bn: ['১২টি সোশ্যাল পোস্ট', 'বেসিক পেজ মডারেশন', 'মাসিক রিপোর্ট', 'কমিউনিটি ম্যানেজমেন্ট'], order: 1 },
    { id: 's2', category: 'social', tier: 'Standard', tier_bn: 'স্ট্যান্ডার্ড', price: '25,000', desc: 'For growing brands', desc_bn: 'বর্ধিষ্ণু ব্র্যান্ডের জন্য', features: ['20 Social Posts/mo', 'Ad Campaign Setup', 'Monthly Report', 'Competitor Analysis'], features_bn: ['২০টি সোশ্যাল পোস্ট', 'অ্যাড ক্যাম্পেইন সেটআপ', 'মাসিক রিপোর্ট', 'কম্পিটিটর এনালাইসিস'], featured: true, order: 2 },
    { id: 's3', category: 'social', tier: 'Premium', tier_bn: 'প্রিমিয়াম', price: '40,000', desc: 'Full-scale management', desc_bn: 'ফুল-স্কেল ম্যানেজমেন্ট', features: ['30 Social Posts/mo', 'Advanced Ad Campaigns', 'Weekly Reports', 'Content Strategy'], features_bn: ['৩০টি সোশ্যাল পোস্ট', 'অ্যাডভান্সড অ্যাড ক্যাম্পেইন', 'সাপ্তাহিক রিপোর্ট', 'কন্টেন্ট স্ট্র্যাটেজি'], order: 3 }
  ],
  branding: [
    { id: 'b1', category: 'branding', tier: 'Basic', tier_bn: 'বেসিক', price: '20,000', desc: 'Essential branding', desc_bn: 'প্রাথমিক ব্র্যান্ডিং', features: ['Logo Design (2 Concepts)', 'Color Palette', 'Brand Guidelines'], features_bn: ['লোগো ডিজাইন (২টি কনসেপ্ট)', 'কালার প্যালেট', 'ব্র্যান্ড গাইডলাইন'], order: 1 },
    { id: 'b2', category: 'branding', tier: 'Standard', tier_bn: 'স্ট্যান্ডার্ড', price: '35,000', desc: 'Professional identity', desc_bn: 'প্রফেশনাল আইডেন্টিটি', features: ['Logo Design (4 Concepts)', 'Stationery Design', 'Social Media Kit'], features_bn: ['লোগো ডিজাইন (৪টি কনসেপ্ট)', 'স্টেশনারি ডিজাইন', 'সোশ্যাল মিডিয়া কিট'], featured: true, order: 2 },
    { id: 'b3', category: 'branding', tier: 'Premium', tier_bn: 'প্রিমিয়াম', price: '60,000', desc: 'Complete brand overhaul', desc_bn: 'সম্পূর্ণ ব্র্যান্ডিং সলিউশন', features: ['Unlimited Logo Revisions', 'Full Brand Book', 'Packaging Design', '3D Mockups'], features_bn: ['আনলিমিটেড লোগো রিভিশন', 'ফুল ব্র্যান্ড বুক', 'প্যাকেজিং ডিজাইন', 'থ্রিডি মকআপ'], order: 3 }
  ],
  web: [
    { id: 'w1', category: 'web', tier: 'Basic', tier_bn: 'বেসিক', price: '30,000', desc: 'Single page website', desc_bn: 'সিঙ্গেল পেজ ওয়েবসাইট', features: ['Landing Page Design', 'Mobile Responsive', 'Contact Form', 'Basic SEO'], features_bn: ['ল্যান্ডিং পেজ ডিজাইন', 'মোবাইল রেসপন্সিভ', 'কন্টাক্ট ফর্ম', 'বেসিক এসইও'], order: 1 },
    { id: 'w2', category: 'web', tier: 'Standard', tier_bn: 'স্ট্যান্ডার্ড', price: '60,000', desc: 'Corporate website', desc_bn: 'কর্পোরেট ওয়েবসাইট', features: ['Up to 10 Pages', 'Custom UI/UX', 'CMS Integration', 'Speed Optimization'], features_bn: ['১০টি পেজ পর্যন্ত', 'কাস্টম UI/UX', 'সিএমএস ইন্টিগ্রেশন', 'স্পিড অপ্টিমাইজেশন'], featured: true, order: 2 },
    { id: 'w3', category: 'web', tier: 'Premium', tier_bn: 'প্রিমিয়াম', price: '100,000', desc: 'E-commerce / Web App', desc_bn: 'ই-কমার্স / ওয়েব অ্যাপ', features: ['Full E-commerce Setup', 'Payment Gateway', 'Custom Dashboard', 'Advanced Security'], features_bn: ['ফুল ই-কমার্স সেটআপ', 'পেমেন্ট গেটওয়ে', 'কাস্টম ড্যাশবোর্ড', 'অ্যাডভান্সড সিকিউরিটি'], order: 3 }
  ],
  video: [
    { id: 'v1', category: 'video', tier: 'Basic', tier_bn: 'বেসিক', price: '15,000', desc: 'Up to 30 seconds promo', desc_bn: '৩০ সেকেন্ড পর্যন্ত প্রোমো', features: ['Script Writing', 'Stock Footage', 'Background Music'], features_bn: ['স্ক্রিপ্ট রাইটিং', 'স্টক ফুটেজ', 'ব্যাকগ্রাউন্ড মিউজিক'], order: 1 },
    { id: 'v2', category: 'video', tier: 'Standard', tier_bn: 'স্ট্যান্ডার্ড', price: '30,000', desc: 'Corporate video (1 min)', desc_bn: 'কর্পোরেট ভিডিও (১ মিনিট)', features: ['Professional Voiceover', 'Custom Motion Graphics', 'Color Grading'], features_bn: ['প্রফেশনাল ভয়েসওভার', 'কাস্টম মোশন গ্রাফিক্স', 'কালার গ্রেডিং'], featured: true, order: 2 },
    { id: 'v3', category: 'video', tier: 'Premium', tier_bn: 'প্রিমিয়াম', price: '50,000', desc: 'Full production (2 mins+)', desc_bn: 'ফুল প্রোডাকশন (২ মিনিট+)', features: ['Live Action Shoot', 'VFX Integration', 'Multiple Formats', 'Sound Design'], features_bn: ['লাইভ অ্যাকশন শ্যুট', 'ভিএফএক্স ইন্টিগ্রেশন', 'মাল্টিপল ফরম্যাট', 'সাউন্ড ডিজাইন'], order: 3 }
  ]
};

const PricingFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    tier: '', tier_bn: '', price: '', desc: '', desc_bn: '', category: 'social', featured: false, order: 1, hidden: false,
    features: [''], features_bn: ['']
  });

  useEffect(() => {
    if (initialData) setFormData({ ...initialData, features: initialData.features || [''], features_bn: initialData.features_bn || [''] });
    else setFormData({ tier: '', tier_bn: '', price: '', desc: '', desc_bn: '', category: 'social', featured: false, order: 1, hidden: false, features: [''], features_bn: [''] });
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      features: formData.features.filter(f => f.trim() !== ''),
      features_bn: formData.features_bn.filter(f => f.trim() !== '')
    });
  };

  const updateFeature = (index, val, isBn = false) => {
    const key = isBn ? 'features_bn' : 'features';
    const newArr = [...formData[key]];
    newArr[index] = val;
    setFormData({ ...formData, [key]: newArr });
  };

  const addFeatureRow = () => {
    setFormData({ 
      ...formData, 
      features: [...formData.features, ''], 
      features_bn: [...formData.features_bn, ''] 
    });
  };

  const removeFeatureRow = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
      features_bn: formData.features_bn.filter((_, i) => i !== index)
    });
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div style={{ background: '#111', width: '100%', maxWidth: '700px', borderRadius: '20px', padding: '2rem', border: '1px solid #333', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 800 }}>{initialData ? 'Edit' : 'New'} Pricing Plan</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X /></button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--adm-dim)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Category</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="admin-input" required>
                {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--adm-dim)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Price (৳)</label>
              <input type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="admin-input" required placeholder="e.g. 15,000" />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--adm-dim)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Order / Position</label>
              <input type="number" value={formData.order} onChange={e => setFormData({...formData, order: Number(e.target.value)})} className="admin-input" required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid #222' }}>
              <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '0.9rem' }}>English Details</h4>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', color: 'var(--adm-dim)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Tier Name</label>
                <input type="text" value={formData.tier} onChange={e => setFormData({...formData, tier: e.target.value})} className="admin-input" required placeholder="e.g. Basic" />
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--adm-dim)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Short Description</label>
                <input type="text" value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="admin-input" required placeholder="e.g. Perfect for small businesses" />
              </div>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid #222' }}>
              <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '0.9rem' }}>Bengali Details</h4>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', color: 'var(--adm-dim)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Tier Name (BN)</label>
                <input type="text" value={formData.tier_bn} onChange={e => setFormData({...formData, tier_bn: e.target.value})} className="admin-input" required placeholder="e.g. বেসিক" />
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--adm-dim)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Short Description (BN)</label>
                <input type="text" value={formData.desc_bn} onChange={e => setFormData({...formData, desc_bn: e.target.value})} className="admin-input" required placeholder="e.g. ছোট ব্যবসার জন্য" />
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #333', paddingTop: '1.5rem' }}>
            <h4 style={{ color: 'white', marginBottom: '1rem' }}>Features Included</h4>
            {formData.features.map((_, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                <input type="text" value={formData.features[i] || ''} onChange={e => updateFeature(i, e.target.value, false)} className="admin-input" placeholder="Feature (EN)" style={{ flex: 1 }} />
                <input type="text" value={formData.features_bn[i] || ''} onChange={e => updateFeature(i, e.target.value, true)} className="admin-input" placeholder="Feature (BN)" style={{ flex: 1 }} />
                <button type="button" onClick={() => removeFeatureRow(i)} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', padding: '0.5rem' }}><Trash2 size={16} /></button>
              </div>
            ))}
            <button type="button" onClick={addFeatureRow} style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={14} /> Add Feature Line
            </button>
          </div>

          <div style={{ borderTop: '1px solid #333', paddingTop: '1.5rem', display: 'flex', gap: '2rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', cursor: 'pointer' }}>
              <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} style={{ width: '18px', height: '18px' }} />
              Mark as "Most Popular" (Highlight)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ff4444', cursor: 'pointer' }}>
              <input type="checkbox" checked={formData.hidden} onChange={e => setFormData({...formData, hidden: e.target.checked})} style={{ width: '18px', height: '18px' }} />
              Hide Plan from Public
            </label>
          </div>

          <button type="submit" className="admin-btn-primary" style={{ marginTop: '1rem' }}>
            {initialData ? 'Save Changes' : 'Create Pricing Plan'}
          </button>
        </form>
      </div>
    </div>
  );
};

const PricingManager = () => {
  const [plans, setPlans] = [useState([]), useState(true)]; // Destructuring fix
  const [allPlans, setAllPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [activeTab, setActiveTab] = useState('social');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'pricing'), (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllPlans(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleSeed = async () => {
    if(!window.confirm("Seed initial pricing plans? This will upload the default 12 plans to the database.")) return;
    try {
      const allSeedData = [...fallbackPricing.social, ...fallbackPricing.branding, ...fallbackPricing.web, ...fallbackPricing.video];
      for (const item of allSeedData) {
        await setDoc(doc(db, 'pricing', item.id), { ...item, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
      }
      alert("Pricing seed complete!");
    } catch(err) {
      alert(err.message);
    }
  };

  const handleSave = async (data) => {
    try {
      const id = data.id || `p-${Date.now()}`;
      await setDoc(doc(db, 'pricing', id), {
        ...data,
        updatedAt: serverTimestamp(),
        createdAt: data.createdAt || serverTimestamp()
      }, { merge: true });
      setIsModalOpen(false);
    } catch(err) {
      alert("Error saving plan: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this pricing plan?")) {
      await deleteDoc(doc(db, 'pricing', id));
    }
  };

  if (loading) return <div className="admin-loading">Loading Pricing Plans...</div>;

  const currentPlans = allPlans.filter(p => p.category === activeTab).sort((a,b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="admin-content-wrap">
      <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.75rem', letterSpacing: '-0.03em' }}>Pricing Management</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem', maxWidth: '600px', lineHeight: 1.6 }}>
            Create and edit pricing tiers across all service categories. Adjust features, prices, and highlight the most popular plans.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {allPlans.length === 0 && (
            <button className="admin-btn-secondary" onClick={handleSeed}>Seed Data</button>
          )}
          <button className="admin-btn-primary" onClick={() => { setEditingData({ category: activeTab }); setIsModalOpen(true); }}>
            <Plus size={18} /> New Plan
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {categories.map(cat => (
          <button 
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            style={{
              padding: '0.6rem 1.25rem', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 600, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              background: activeTab === cat.id ? 'white' : 'rgba(255,255,255,0.05)',
              color: activeTab === cat.id ? 'black' : 'rgba(255,255,255,0.6)',
              transition: 'all 0.2s'
            }}
          >
            {cat.label} ({allPlans.filter(p => p.category === cat.id).length})
          </button>
        ))}
      </div>

      {currentPlans.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px dashed #333' }}>
          <AlertCircle size={32} style={{ color: 'var(--adm-dim)', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--adm-dim)', marginBottom: '1rem' }}>No plans found in this category.</p>
          <button className="admin-btn-secondary" onClick={() => { setEditingData({ category: activeTab }); setIsModalOpen(true); }}>Create your first one</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {currentPlans.map(plan => (
            <div key={plan.id} style={{
              background: 'rgba(255,255,255,0.02)', border: plan.featured ? '1px solid var(--adm-red)' : '1px solid rgba(255,255,255,0.06)',
              borderRadius: '20px', padding: '1.5rem', position: 'relative', display: 'flex', flexDirection: 'column'
            }}>
              {plan.featured && <div style={{ position: 'absolute', top: '-10px', left: '1.5rem', background: 'var(--adm-red)', color: 'white', fontSize: '0.65rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Most Popular</div>}
              {plan.hidden && <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', color: '#ff4444', fontSize: '0.75rem', fontWeight: 700 }}><AlertCircle size={14} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> Hidden</div>}
              
              <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => { setEditingData(plan); setIsModalOpen(true); }} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', padding: '0.4rem', borderRadius: '8px', cursor: 'pointer' }}><Edit2 size={14} /></button>
                <button onClick={() => handleDelete(plan.id)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#ff4444', padding: '0.4rem', borderRadius: '8px', cursor: 'pointer' }}><Trash2 size={14} /></button>
              </div>

              <div style={{ marginTop: plan.featured || plan.hidden ? '1rem' : '0' }}>
                <h3 style={{ fontSize: '1.5rem', color: 'white', fontWeight: 800, marginBottom: '0.2rem' }}>{plan.tier}</h3>
                <div style={{ color: 'var(--adm-dim)', fontSize: '0.8rem', marginBottom: '1rem' }}>{plan.desc}</div>
                <div style={{ fontSize: '2rem', color: 'white', fontWeight: 900, marginBottom: '1.5rem' }}>৳{plan.price}</div>
                
                <div style={{ borderTop: '1px solid #333', paddingTop: '1rem' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--adm-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.8rem' }}>Features</div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {plan.features?.map((f, i) => (
                      <li key={i} style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <span style={{ color: 'var(--adm-red)' }}>✓</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <PricingFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={editingData}
        onSubmit={handleSave}
      />
    </div>
  );
};

export default PricingManager;
