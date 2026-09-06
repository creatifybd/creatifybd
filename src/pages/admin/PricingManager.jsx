import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, doc, onSnapshot, setDoc, deleteDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { Plus, Trash2, Edit2, X, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useConfirm } from '../../context/ConfirmContext';

const categories = [
  { id: 'social', label: 'Social Media' },
  { id: 'branding', label: 'Branding' },
  { id: 'web', label: 'Web Dev' },
  { id: 'video', label: 'Video Production' }
];

const fallbackPricing = {
  social: [
    { id: 's1', category: 'social', tier: 'Package 01', tier_bn: 'প্যাকেজ ০১ (স্পেশাল অফার)', price: '5000', desc: 'Daily 2 posters (60/mo) + Weekly 1 video (4/mo)', desc_bn: 'দৈনিক ২টি পোস্টার ও সাপ্তাহিক ১টি ভিডিও সহ সোশ্যাল গ্রোথ', features: ['Daily 2 Posters (60/mo)', 'Weekly 1 Video (4/mo)', 'Monthly Content Calendar', 'Captions & Hashtags'], features_bn: ['দৈনিক ২টি সোশ্যাল মিডিয়া পোস্টার (মাসে ৬০টি)', 'সপ্তাহে ১টি প্রমোশনাল ভিডিও (মাসে ৪টি)', 'মান্থলি কনটেন্ট প্ল্যানিং ও ক্যালেন্ডার', 'ক্যাপশন ও নিশ হ্যাশট্যাগ'], order: 1 },
    { id: 's2', category: 'social', tier: 'Package 02', tier_bn: 'প্যাকেজ ০২ (স্পেশাল অফার)', price: '7000', desc: 'Daily 3 posters (90/mo) + Weekly 1 video (4/mo)', desc_bn: 'দৈনিক ৩টি পোস্টার ও সাপ্তাহিক ১টি ভিডিও সহ রেগুলার গ্রোথ', features: ['Daily 3 Posters (90/mo)', 'Weekly 1 Video (4/mo)', 'Trending Reels & Motion', '2 Platforms Support'], features_bn: ['দৈনিক ৩টি সোশ্যাল মিডিয়া পোস্টার (মাসে ৯০টি)', 'সপ্তাহে ১টি প্রমোশনাল ভিডিও (মাসে ৪টি)', 'ট্রেন্ডিং রিলস কনসেপ্ট ও মোশন', '২টি সোশ্যাল প্ল্যাটফর্ম ফুল ম্যানেজমেন্ট'], featured: true, order: 2 },
    { id: 's3', category: 'social', tier: 'Package 03', tier_bn: 'প্যাকেজ ০৩ (স্পেশাল অফার)', price: '10000', desc: 'Daily 5 posters (150/mo) + Weekly 2 videos (8/mo)', desc_bn: 'দৈনিক ৫টি পোস্টার ও সপ্তাহে ২টি ভিডিও সহ ফুল-স্কেল ডমিনেশন', features: ['Daily 5 Posters (150/mo)', 'Weekly 2 Videos (8/mo)', 'High-Converting Ads', 'Dedicated Creative Manager'], features_bn: ['দৈনিক ৫টি সোশ্যাল মিডিয়া পোস্টার (মাসে ১৫০টি)', 'সপ্তাহে ২টি প্রমোশনাল ভিডিও (মাসে ৮টি)', 'হাই-কনভার্সন ভিডিও ও সেলস ক্রিয়েটিভস', 'ডেডিকেটেড ক্রিয়েটিভ ম্যানেজার ও প্রায়োরিটি সাপোর্ট'], order: 3 }
  ],
  branding: [
    { id: 'b1', category: 'branding', tier: 'Logo & Starter', tier_bn: 'লোগো ও বেসিক ব্র্যান্ডিং', price: 'কাস্টম বাজেট', desc: 'Custom Logo & Color Palette', desc_bn: 'ইউনিক লোগো, কালার প্যালেট ও সোশ্যাল কিট', features: ['Custom Vector Logo', 'Color Palette & Typography', 'Social Media Kit', 'Source Files'], features_bn: ['কাস্টম ভেক্টর লোগো কনসেপ্ট', 'কালার ও টাইপোগ্রাফি গাইডলাইন', 'সোশ্যাল মিডিয়া প্রোফাইল ও কভার কিট', 'প্রিন্ট ও ওয়েব রেডি সোর্স ফাইল'], order: 1 },
    { id: 'b2', category: 'branding', tier: 'Complete Identity', tier_bn: 'কমপ্লিট ব্র্যান্ড আইডেন্টিটি', price: 'কাস্টম বাজেট', desc: 'Full Visual Identity', desc_bn: 'ফুল ভিজ্যুয়াল আইডেন্টিটি ও বিজনেস মেটেরিয়ালস', features: ['Master Brand Guidebook', 'Stationery & Business Card', 'Packaging / Marketing Assets', 'Custom Project Support'], features_bn: ['মাস্টার ব্র্যান্ড গাইডবুক', 'স্টেশনারি ও ভিজিটিং কার্ড ডিজাইন', 'প্যাকেজিং অথবা মার্কেটিং কোলাটেরাল', '১০০% কাস্টমাইজড প্রজেক্ট সাপোর্ট'], featured: true, order: 2 },
    { id: 'b3', category: 'branding', tier: 'Enterprise Branding', tier_bn: 'এন্টারপ্রাইজ ব্র্যান্ডিং', price: 'কাস্টম বাজেট', desc: 'Large Scale Rebranding', desc_bn: 'লার্জ-স্কেল ব্যবসা ও রি-ব্র্যান্ডিং সলিউশন', features: ['Comprehensive Brand System', 'Marketing Campaign Templates', 'Unlimited Artworks', 'Senior Art Director Support'], features_bn: ['কম্প্রিহেনসিভ ব্র্যান্ড সিস্টেম ও অ্যাসেট লাইব্রেরি', 'মার্কেটিং ক্যাম্পেইন টেমপ্লেট ও ব্যানার প্যাক', 'আনলিমিটেড আর্টওয়ার্ক ভ্যারিয়েশন', 'ডেডিকেটেড সিনিয়র আর্ট ডিরেক্টর'], order: 3 }
  ],
  web: [
    { id: 'w1', category: 'web', tier: 'Landing Page', tier_bn: 'হাই-কনভার্সন ল্যান্ডিং পেজ', price: 'কাস্টম বাজেট', desc: 'Single Promotional Page', desc_bn: 'সিঙ্গেল প্রমোশনাল পেজ ও ক্যাম্পেইন ল্যান্ডার', features: ['High Speed Performance', 'Mobile-First Responsive', 'WhatsApp & Lead Forms', 'Basic SEO Setup'], features_bn: ['সুপার ফাস্ট লোডিং স্পিড', 'মোবাইল-ফার্স্ট রেসপন্সিভ ডিজাইন', 'হোয়াটসঅ্যাপ ও লিড ফর্ম ইন্টিগ্রেশন', 'বেসিক অন-পেজ এসইও সেটআপ'], order: 1 },
    { id: 'w2', category: 'web', tier: 'Business Website', tier_bn: 'কমপ্লিট বিজনেস ওয়েবসাইট', price: 'কাস্টম বাজেট', desc: 'Full Corporate Site', desc_bn: 'প্রফেশনাল কর্পোরেট ও সার্ভিস ওয়েবসাইট', features: ['Custom UI/UX Design', 'Dynamic CMS Panel', 'Full Security & Speed', 'Priority Tech Support'], features_bn: ['কাস্টম UI/UX ডিজাইন', 'সার্ভিস, পোর্টফোলিও ও ব্লগ পেজ', 'ডায়নামিক কনটেন্ট ও ইউজার ফ্রেন্ডলি প্যানেল', 'ফুল সিকিউরিটি ও স্পিড অপ্টিমাইজেশন'], featured: true, order: 2 },
    { id: 'w3', category: 'web', tier: 'E-commerce', tier_bn: 'ই-কমার্স ও কাস্টম ওয়েব', price: 'কাস্টম বাজেট', desc: 'Complete Online Store', desc_bn: 'ফুল স্কেল অনলাইন শপ ও ডায়নামিক পোর্টাল', features: ['Product Catalog & Orders', 'Payment & Courier Integration', 'Advanced Analytics', 'Dedicated Support'], features_bn: ['প্রোডাক্ট ক্যাটালগ ও অর্ডার ম্যানেজমেন্ট', 'পেমেন্ট ও কুরিয়ার গেটওয়ে ইন্টিগ্রেশন', 'অ্যাডভান্সড অ্যানালিটিক্স ও কাস্টমার ট্র্যাকিং', 'ডেডিকেটেড টেকনিক্যাল সাপোর্ট'], order: 3 }
  ],
  video: [
    { id: 'v1', category: 'video', tier: 'Short Form Reels', tier_bn: 'শর্ট-ফর্ম ভিডিও ও রিলস', price: 'কাস্টম বাজেট', desc: 'Reels, TikTok & Shorts', desc_bn: 'ইনস্টাগ্রাম, ফেসবুক ও টিকটক রিলস এডিটিং', features: ['Dynamic Hooks & Captions', 'Trending Audio Sync', 'Color Correction', 'High Quality Export'], features_bn: ['ডায়নামিক হুক ও মোশন ক্যাপশন', 'ট্রেন্ডিং সাউন্ড ও সাউন্ড ইফেক্টস', 'কালার কারেকশন ও হাই-কোয়ালিটি রেন্ডার'], order: 1 },
    { id: 'v2', category: 'video', tier: 'Product & Promo', tier_bn: 'প্রোডাক্ট ও কমার্শিয়াল প্রমো', price: 'কাস্টম বাজেট', desc: 'Promotional Ad Videos', desc_bn: 'সেলস ও প্রমোশনাল ভিডিও বিজ্ঞাপন', features: ['Script & Voiceover Sync', 'Motion Graphics', 'High-Converting Formula', 'Multi-Format Delivery'], features_bn: ['স্ক্রিপ্ট ও ভয়েসওভার সিঙ্কিং', 'মোশন গ্রাফিক্স ও প্রোডাক্ট হাইলাইটস', 'হাই-কনভার্সন ভিডিও অ্যাডস ফরমুলা', 'মাল্টি-ফরম্যাট ডেলিভারি'], featured: true, order: 2 },
    { id: 'v3', category: 'video', tier: 'Full Production', tier_bn: 'ইউটিউব ও ফুল প্রোডাকশন', price: 'কাস্টম বাজেট', desc: 'Long-form Video Editing', desc_bn: 'লং-ফর্ম কন্টেন্ট ও ব্র্যান্ড স্টোরিটেলিং', features: ['Multi-Cam & B-Rolls', 'Cinematic Color Grading', 'Audio Mastering', 'Custom Thumbnails'], features_bn: ['মাল্টি-ক্যামেরা এডিটিং ও B-Roll ইন্টিগ্রেশন', 'সিনেমাটিক কালার গ্রেডিং ও অডিও মাস্টারিং', 'কাস্টম থাম্বনেইল ও সোশ্যাল ভার্সন'], order: 3 }
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
    <div className="adm-modal-overlay" onClick={onClose}>
      <div className="admin-card" style={{ width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{initialData ? 'Edit' : 'New'} Pricing Plan</h2>
          <button onClick={onClose} aria-label="Close dialog" className="admin-icon-btn"><X /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="setting-label">Category</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="admin-input" required>
                {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="setting-label">Price ($)</label>
              <input type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="admin-input" required placeholder="e.g. 150" />
            </div>
            <div>
              <label className="setting-label">Order / Position</label>
              <input type="number" value={formData.order} onChange={e => setFormData({...formData, order: Number(e.target.value)})} className="admin-input" required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'var(--adm-bg)', borderRadius: '12px', border: '1px solid var(--adm-border)' }}>
              <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>English Details</h4>
              <div style={{ marginBottom: '1rem' }}>
                <label className="setting-label">Tier Name</label>
                <input type="text" value={formData.tier} onChange={e => setFormData({...formData, tier: e.target.value})} className="admin-input" required placeholder="e.g. Basic" />
              </div>
              <div>
                <label className="setting-label">Short Description</label>
                <input type="text" value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="admin-input" required placeholder="e.g. Perfect for small businesses" />
              </div>
            </div>
            <div style={{ padding: '1rem', background: 'var(--adm-bg)', borderRadius: '12px', border: '1px solid var(--adm-border)' }}>
              <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>Bengali Details</h4>
              <div style={{ marginBottom: '1rem' }}>
                <label className="setting-label">Tier Name (BN)</label>
                <input type="text" value={formData.tier_bn} onChange={e => setFormData({...formData, tier_bn: e.target.value})} className="admin-input" required placeholder="e.g. বেসিক" />
              </div>
              <div>
                <label className="setting-label">Short Description (BN)</label>
                <input type="text" value={formData.desc_bn} onChange={e => setFormData({...formData, desc_bn: e.target.value})} className="admin-input" required placeholder="e.g. ছোট ব্যবসার জন্য" />
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--adm-border)', paddingTop: '1.5rem' }}>
            <h4 style={{ marginBottom: '1rem' }}>Features Included</h4>
            {formData.features.map((_, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                <input type="text" value={formData.features[i] || ''} onChange={e => updateFeature(i, e.target.value, false)} className="admin-input" placeholder="Feature (EN)" style={{ flex: 1 }} />
                <input type="text" value={formData.features_bn[i] || ''} onChange={e => updateFeature(i, e.target.value, true)} className="admin-input" placeholder="Feature (BN)" style={{ flex: 1 }} />
                <button type="button" onClick={() => removeFeatureRow(i)} aria-label="Remove feature row" className="admin-icon-btn"><Trash2 size={16} color="var(--adm-danger)" /></button>
              </div>
            ))}
            <button type="button" onClick={addFeatureRow} className="admin-btn-secondary">
              <Plus size={14} /> Add Feature Line
            </button>
          </div>

          <div style={{ borderTop: '1px solid var(--adm-border)', paddingTop: '1.5rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} style={{ width: '18px', height: '18px' }} />
              Mark as "Most Popular" (Highlight)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--adm-danger)', cursor: 'pointer' }}>
              <input type="checkbox" checked={formData.hidden} onChange={e => setFormData({...formData, hidden: e.target.checked})} style={{ width: '18px', height: '18px' }} />
              Hide Plan from Public
            </label>
          </div>

          <button type="submit" className="admin-btn-primary" style={{ marginTop: '1rem', justifyContent: 'center', padding: '1rem' }}>
            {initialData ? 'Save Changes' : 'Create Pricing Plan'}
          </button>
        </form>
      </div>
    </div>
  );
};

const PricingManager = () => {
  const confirm = useConfirm();
  const [allPlans, setAllPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [activeTab, setActiveTab] = useState('social');
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkWorking, setBulkWorking] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'pricing'), (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllPlans(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleSeed = async () => {
    const ok = await confirm({
      title: 'Seed initial pricing plans?',
      description: 'This will upload the default 12 plans to the database.',
      confirmLabel: 'Seed Plans'
    });
    if (!ok) return;
    try {
      const allSeedData = [...fallbackPricing.social, ...fallbackPricing.branding, ...fallbackPricing.web, ...fallbackPricing.video];
      for (const item of allSeedData) {
        await setDoc(doc(db, 'pricing', item.id), { ...item, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
      }
      toast.success('Pricing seed complete!');
    } catch(err) {
      toast.error(err.message);
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
      toast.success('Pricing plan saved');
      setIsModalOpen(false);
    } catch(err) {
      toast.error('Error saving plan: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirm({
      title: 'Delete this pricing plan?',
      description: 'This action cannot be undone.',
      confirmLabel: 'Delete',
      tone: 'danger'
    });
    if (!ok) return;
    try {
      await deleteDoc(doc(db, 'pricing', id));
      toast.success('Pricing plan deleted');
    } catch (err) {
      toast.error('Failed to delete plan');
    }
  };

  // ── Bulk select helpers ──────────────────────────────────────────
  const toggleSelect = (id) =>
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const toggleSelectAll = (plans) => {
    const allIds = plans.map(p => p.id);
    setSelectedIds(prev => prev.length === allIds.length ? [] : allIds);
  };

  const bulkHideShow = async (hidden) => {
    if (!selectedIds.length) return;
    setBulkWorking(true);
    try {
      const batch = writeBatch(db);
      selectedIds.forEach(id => batch.update(doc(db, 'pricing', id), { hidden }));
      await batch.commit();
      toast.success(`${selectedIds.length} plans ${hidden ? 'hidden' : 'shown'}`);
      setSelectedIds([]);
    } catch (err) {
      toast.error('Bulk update failed');
    } finally {
      setBulkWorking(false);
    }
  };

  const bulkDelete = async () => {
    if (!selectedIds.length) return;
    const ok = await confirm({
      title: `Delete ${selectedIds.length} plans?`,
      description: 'This cannot be undone.',
      confirmLabel: 'Delete All',
      tone: 'danger'
    });
    if (!ok) return;
    setBulkWorking(true);
    try {
      const batch = writeBatch(db);
      selectedIds.forEach(id => batch.delete(doc(db, 'pricing', id)));
      await batch.commit();
      toast.success(`${selectedIds.length} plans deleted`);
      setSelectedIds([]);
    } catch (err) {
      toast.error('Bulk delete failed');
    } finally {
      setBulkWorking(false);
    }
  };

  if (loading) return <div className="admin-loading">Loading Pricing Plans...</div>;

  const currentPlans = allPlans.filter(p => p.category === activeTab).sort((a,b) => (a.order || 0) - (b.order || 0));
  const allCurrentSelected = currentPlans.length > 0 && currentPlans.every(p => selectedIds.includes(p.id));

  return (
    <div className="admin-section-page">
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Pricing Management</h1>
          <p className="adm-page-desc">
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
            className={activeTab === cat.id ? 'adm-tab-btn active' : 'adm-tab-btn'}
          >
            {cat.label} ({allPlans.filter(p => p.category === cat.id).length})
          </button>
        ))}
      </div>

      {currentPlans.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--adm-bg)', borderRadius: '24px', border: '1px dashed var(--adm-border)' }}>
          <AlertCircle size={32} style={{ color: 'var(--adm-dim)', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--adm-dim)', marginBottom: '1rem' }}>No plans found in this category.</p>
          <button className="admin-btn-secondary" onClick={() => { setEditingData({ category: activeTab }); setIsModalOpen(true); }}>Create your first one</button>
        </div>
      ) : (
        <>
          {/* Bulk action bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--adm-dim)' }}>
              <input
                type="checkbox"
                checked={allCurrentSelected}
                onChange={() => toggleSelectAll(currentPlans)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--adm-red)' }}
              />
              Select All
            </label>
            {selectedIds.length > 0 && (
              <div className="bulk-action-bar" style={{ marginBottom: 0 }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--adm-dim)' }}>{selectedIds.length} selected</span>
                <button onClick={() => bulkHideShow(false)} disabled={bulkWorking}><span>Show</span></button>
                <button onClick={() => bulkHideShow(true)} disabled={bulkWorking}><span>Hide</span></button>
                <button className="danger" onClick={bulkDelete} disabled={bulkWorking}><Trash2 size={14} /> Delete</button>
                <button onClick={() => setSelectedIds([])} style={{ background: 'transparent', border: '1.5px solid rgba(255,255,255,0.2)' }} disabled={bulkWorking}>Clear</button>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {currentPlans.map(plan => {
              const isSelected = selectedIds.includes(plan.id);
              return (
                <div key={plan.id} className="admin-card" style={{
                  border: isSelected ? '2px solid var(--adm-red)' : plan.featured ? '1.5px solid var(--adm-red)' : '1px solid var(--adm-border)',
                  position: 'relative', display: 'flex', flexDirection: 'column',
                  outline: isSelected ? '2px solid rgba(232,25,44,0.15)' : 'none',
                  transition: 'border-color 0.2s, outline 0.2s'
                }}>
                  {/* Checkbox top-left */}
                  <label style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 2, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(plan.id)}
                      style={{ width: '16px', height: '16px', accentColor: 'var(--adm-red)' }}
                    />
                  </label>

                  {plan.featured && <div style={{ position: 'absolute', top: '-10px', left: '3rem', background: 'var(--adm-red)', color: 'white', fontSize: '0.65rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Most Popular</div>}
                  {plan.hidden && <div style={{ position: 'absolute', top: '1rem', left: '3rem', color: 'var(--adm-danger)', fontSize: '0.75rem', fontWeight: 700 }}><AlertCircle size={14} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> Hidden</div>}

                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => { setEditingData(plan); setIsModalOpen(true); }} aria-label="Edit plan" className="admin-icon-btn"><Edit2 size={14} /></button>
                    <button onClick={() => handleDelete(plan.id)} aria-label="Delete plan" className="admin-icon-btn"><Trash2 size={14} color="var(--adm-danger)" /></button>
                  </div>

                  <div style={{ marginTop: '2.5rem' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.2rem' }}>{plan.tier}</h3>
                    <div style={{ color: 'var(--adm-dim)', fontSize: '0.8rem', marginBottom: '1rem' }}>{plan.desc}</div>
                    <div style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1.5rem' }}>${plan.price}</div>

                    <div style={{ borderTop: '1px solid var(--adm-border)', paddingTop: '1rem' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--adm-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.8rem' }}>Features</div>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {plan.features?.map((f, i) => (
                          <li key={i} style={{ color: 'var(--adm-txt)', fontSize: '0.85rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                            <span style={{ color: 'var(--adm-red)' }}>✓</span> {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
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
