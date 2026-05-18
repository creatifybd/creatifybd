import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { db } from '../../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { uploadImage } from '../../utils/imgbb';
import { Layout, Type, Image as ImageIcon, Save, RefreshCw, Upload, Sparkles, Box, MessageSquare, Loader2 } from 'lucide-react';

const defaultContent = {
  visibility: {
    hero: true,
    case_studies: true,
    clients: true,
    services: true,
    features: true,
    portfolio: true,
    process: true,
    pricing: true,
    testimonials: true,
    cta_band: true,
    contact: true
  },
  hero: {
    theme: 'light',
    eyebrow: 'BD BASED IN DHAKA, BANGLADESH',
    title: 'Your Creative Partner for Digital <span class="wavy-text">Growth</span>',
    desc: 'Affordable, high-quality digital marketing for startups & small businesses. Social media, branding, photography, web development — all under one roof.',
    cta1: 'Start a Project',
    cta2: 'See Our Work',
    mockup_primary: '/mockup.png'
  },
  process: {
    theme: 'light',
    title: 'How We <span class="text-red">Work</span>',
    subtitle: 'A streamlined process from concept to completion.',
    steps: [
      { id: 1, num: '01', icon: '🔍', title: 'Discovery', desc: 'We learn about your brand, goals, and audience.' },
      { id: 2, num: '02', icon: '🎨', title: 'Strategy', desc: 'We craft a custom roadmap for your success.' },
      { id: 3, num: '03', icon: '⚙️', title: 'Execution', desc: 'Our experts bring the vision to life.' },
      { id: 4, num: '04', icon: '🚀', title: 'Growth & Support', desc: 'We monitor results post-launch.' }
    ],
    process_image: ''
  },
  contact: {
    theme: 'light',
    heading: 'Ready to <span class="text-red">Grow?</span>',
    sub: "Let's build something amazing together.",
    address: 'Dhaka, Bangladesh',
    working_hours: 'Sat - Thu: 10 AM - 8 PM',
    office_image: ''
  },
  clients: {
    label: 'Trusted by businesses across Bangladesh',
    list: 'Fashion House BD, TechStart Dhaka, Green Eats, Nova Clothing, EduBridge BD, HealthPlus, CraftNest, ShopLocal BD, ByteWave, Riverside Resto'
  },
  cta_band: {
    title: 'Ready to <span class="red">Grow</span> Your Business?',
    subtitle: 'Join 100+ businesses in Bangladesh that trust CreatifyBD with their digital growth.',
    primary_btn: 'Start a Project Today →',
    secondary_btn: '📞 +880 01951 676600',
    secondary_link: 'tel:+8801951676600',
    cta_bg: ''
  },
  features: {
    theme: 'light',
    eyebrow: 'Why CreatifyBD',
    title: 'Built for <span class="red">Bangladesh.</span><br />Built for Growth.',
    subtitle: "We're not just another agency. We understand the local market deeply and we're obsessed with your results.",
    stats: [
      { val: '100+', label: 'Projects Delivered' },
      { val: '6+', label: 'Core Services' },
      { val: '2x', label: 'Avg. Brand Growth' },
      { val: '5★', label: 'Client Rating' }
    ],
    items: [
      { icon: '🎯', title: 'Deep Local Market Knowledge', desc: 'We know what works in Bangladesh — the platforms, the audiences, the trends. No guesswork.' },
      { icon: '💰', title: 'Transparent, Budget-Friendly', desc: 'No hidden fees. No bloated agency overhead. You pay for results, not fancy office rent.' },
      { icon: '⚡', title: 'Fast Turnaround', desc: 'We move fast. Most deliverables are turned around within 2–5 business days.' },
      { icon: '🤝', title: 'Personalized for Your Brand', desc: 'We take time to understand your vision, voice, and goals before we create anything.' }
    ],
    features_visual: ''
  }
};


const ContentManager = () => {
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');
  const [uploadingMockup, setUploadingMockup] = useState(false);
  const [mockupProgress, setMockupProgress] = useState(0);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const ref = doc(db, 'settings', 'content');
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setContent({ ...defaultContent, ...snap.data() });
        }
      } catch (err) {
        toast.error('Failed to load content.');
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleUpdate = (section, field, value) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayUpdate = (section, field, index, key, value) => {
    setContent(prev => {
      const arr = [...(prev[section][field] || [])];
      arr[index] = { ...arr[index], [key]: value };
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: arr
        }
      };
    });
  };

  const handleImageUpload = async (e, section, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingMockup(true);
    setMockupProgress(0);
    try {
      const url = await uploadImage(file, (p) => setMockupProgress(Math.round(p)));
      handleUpdate(section, field, url);
      toast.success('Mockup uploaded! Click Save to publish.');
    } catch (err) {
      console.error(err);
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploadingMockup(false);
      setMockupProgress(0);
    }
  };

  const handleSave = async () => {

    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'content'), content, { merge: true });
      toast.success('Section content updated!');
    } catch (err) {
      toast.error('Failed to save content.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-loading">Loading CMS...</div>;

  return (
    <div style={{ maxWidth: '1000px' }}>
      <div className="admin-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'white' }}>Section Content Manager</h1>
          <p style={{ color: 'var(--adm-dim)', fontSize: '0.85rem' }}>Customize every text and image on your landing page.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="admin-btn-primary">
          <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        <TabButton id="layout" label="Layout & Visibility" active={activeTab} onClick={setActiveTab} icon={<Layout size={16} />} />
        <TabButton id="hero" label="Hero Section" active={activeTab} onClick={setActiveTab} icon={<Sparkles size={16} />} />
        <TabButton id="clients" label="Clients Strip" active={activeTab} onClick={setActiveTab} icon={<Box size={16} />} />
        <TabButton id="features" label="Features Section" active={activeTab} onClick={setActiveTab} icon={<Box size={16} />} />
        <TabButton id="process" label="Process Steps" active={activeTab} onClick={setActiveTab} icon={<Box size={16} />} />
        <TabButton id="cta_band" label="CTA Band" active={activeTab} onClick={setActiveTab} icon={<Box size={16} />} />
        <TabButton id="contact" label="Contact Section" active={activeTab} onClick={setActiveTab} icon={<MessageSquare size={16} />} />
      </div>

      <div className="admin-card">
        {activeTab === 'layout' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ borderBottom: '1px solid #222', paddingBottom: '1rem' }}>
              <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>Section Visibility Settings</h3>
              <p style={{ color: 'var(--adm-dim)', fontSize: '0.85rem' }}>Toggle these switches to immediately show or hide sections on the live website.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
              {[
                { key: 'hero', label: 'Hero Section' },
                { key: 'case_studies', label: 'Case Studies' },
                { key: 'clients', label: 'Trusted Clients Strip' },
                { key: 'services', label: 'Services Grid' },
                { key: 'features', label: 'Why Choose Us / Features' },
                { key: 'portfolio', label: 'Portfolio Gallery' },
                { key: 'process', label: 'Our Process' },
                { key: 'pricing', label: 'Pricing Tables' },
                { key: 'testimonials', label: 'Testimonials' },
                { key: 'cta_band', label: 'Call To Action Band' },
                { key: 'contact', label: 'Contact Details' }
              ].map(sec => (
                <div key={sec.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '10px', border: '1px solid #222' }}>
                  <span style={{ color: 'white', fontSize: '0.9rem', fontWeight: '500' }}>{sec.label}</span>
                  <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                    <input 
                      type="checkbox" 
                      checked={content.visibility?.[sec.key] !== false} 
                      onChange={(e) => handleUpdate('visibility', sec.key, e.target.checked)}
                      style={{ opacity: 0, width: 0, height: 0 }} 
                    />
                    <span className="slider round" style={{ 
                      position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, 
                      backgroundColor: content.visibility?.[sec.key] !== false ? 'var(--adm-red)' : '#333', 
                      transition: '.4s', borderRadius: '24px' 
                    }}>
                      <span style={{
                        position: 'absolute', content: '""', height: '18px', width: '18px', left: '3px', bottom: '3px',
                        backgroundColor: 'white', transition: '.4s', borderRadius: '50%',
                        transform: content.visibility?.[sec.key] !== false ? 'translateX(20px)' : 'translateX(0)'
                      }}></span>
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'hero' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222', paddingBottom: '1rem' }}>
              <h3 style={{ color: 'white', fontSize: '1rem' }}>Hero Customization</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--adm-dim)', fontWeight: '700' }}>THEME MODE:</label>
                <select 
                  value={content.hero.theme || 'light'} 
                  onChange={(e) => handleUpdate('hero', 'theme', e.target.value)}
                  style={{ background: '#222', color: 'white', border: '1px solid #444', borderRadius: '6px', padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                >
                  <option value="light">Light (White Bg)</option>
                  <option value="dark">Dark (Black Bg)</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <CMSField label="Eyebrow Text" value={content.hero.eyebrow} onChange={(v) => handleUpdate('hero', 'eyebrow', v)} />
              <CMSField label="Main Title (HTML Supported)" value={content.hero.title} onChange={(v) => handleUpdate('hero', 'title', v)} />
            </div>
            <CMSField label="Description Subtext" value={content.hero.desc} onChange={(v) => handleUpdate('hero', 'desc', v)} isTextarea />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <CMSField label="Primary CTA Label" value={content.hero.cta1} onChange={(v) => handleUpdate('hero', 'cta1', v)} />
              <CMSField label="Secondary CTA Label" value={content.hero.cta2} onChange={(v) => handleUpdate('hero', 'cta2', v)} />
            </div>
            
            <div style={{ marginTop: '1rem' }}>
              <ImageUploadField 
                label="Hero Image / Mockup" 
                value={content.hero.mockup_primary} 
                section="hero" 
                field="mockup_primary" 
                uploading={uploadingMockup} 
                progress={mockupProgress} 
                onUpload={handleImageUpload} 
              />
            </div>
          </div>

        )}

        {activeTab === 'process' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222', paddingBottom: '1rem' }}>
              <h3 style={{ color: 'white', fontSize: '1rem' }}>Workflow Section</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--adm-dim)', fontWeight: '700' }}>THEME MODE:</label>
                <select 
                  value={content.process?.theme || 'light'} 
                  onChange={(e) => handleUpdate('process', 'theme', e.target.value)}
                  style={{ background: '#222', color: 'white', border: '1px solid #444', borderRadius: '6px', padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                >
                  <option value="light">Light (White Bg)</option>
                  <option value="dark">Dark (Black Bg)</option>
                </select>
              </div>
            </div>
             <CMSField label="Section Title" value={content.process?.title || ''} onChange={(v) => handleUpdate('process', 'title', v)} />
             <CMSField label="Section Subtitle" value={content.process?.subtitle || ''} onChange={(v) => handleUpdate('process', 'subtitle', v)} />
             <div style={{ marginTop: '1.5rem', borderTop: '1px solid #222', paddingTop: '1.5rem' }}>
                <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '0.9rem' }}>Process Steps</h4>
                {content.process?.steps?.map((step, idx) => (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid #333', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '60px 80px 1fr', gap: '1rem' }}>
                      <CMSField label="Num" value={step.num || ''} onChange={(v) => handleArrayUpdate('process', 'steps', idx, 'num', v)} />
                      <CMSField label="Icon" value={step.icon || ''} onChange={(v) => handleArrayUpdate('process', 'steps', idx, 'icon', v)} />
                      <CMSField label="Title" value={step.title || ''} onChange={(v) => handleArrayUpdate('process', 'steps', idx, 'title', v)} />
                    </div>
                    <CMSField label="Description" value={step.desc || ''} onChange={(v) => handleArrayUpdate('process', 'steps', idx, 'desc', v)} isTextarea />
                  </div>
                ))}
             </div>
             <div style={{ marginTop: '1rem' }}>
                <ImageUploadField 
                  label="Process Visual/Background Image" 
                  value={content.process?.process_image || ''} 
                  section="process" 
                  field="process_image" 
                  uploading={uploadingMockup} 
                  progress={mockupProgress} 
                  onUpload={handleImageUpload} 
                />
             </div>
          </div>
        )}

        {activeTab === 'clients' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             <div style={{ borderBottom: '1px solid #222', paddingBottom: '1rem' }}>
              <h3 style={{ color: 'white', fontSize: '1rem' }}>Clients Strip Customization</h3>
            </div>
             <CMSField label="Small Label Above Clients" value={content.clients?.label || ''} onChange={(v) => handleUpdate('clients', 'label', v)} />
             <CMSField label="Client Names (Comma Separated)" value={content.clients?.list || ''} onChange={(v) => handleUpdate('clients', 'list', v)} isTextarea />
          </div>
        )}

        {activeTab === 'features' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             <div style={{ borderBottom: '1px solid #222', paddingBottom: '1rem' }}>
              <h3 style={{ color: 'white', fontSize: '1rem' }}>Features Section Text</h3>
            </div>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
               <CMSField label="Eyebrow Text" value={content.features?.eyebrow || ''} onChange={(v) => handleUpdate('features', 'eyebrow', v)} />
               <CMSField label="Main Title (HTML Supported)" value={content.features?.title || ''} onChange={(v) => handleUpdate('features', 'title', v)} />
             </div>
             <CMSField label="Subtitle Text" value={content.features?.subtitle || ''} onChange={(v) => handleUpdate('features', 'subtitle', v)} isTextarea />
             
             <div style={{ marginTop: '1.5rem', borderTop: '1px solid #222', paddingTop: '1.5rem' }}>
                <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '0.9rem' }}>Feature Items</h4>
                {content.features?.items?.map((item, idx) => (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid #333', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '1rem' }}>
                      <CMSField label="Icon" value={item.icon || ''} onChange={(v) => handleArrayUpdate('features', 'items', idx, 'icon', v)} />
                      <CMSField label="Title" value={item.title || ''} onChange={(v) => handleArrayUpdate('features', 'items', idx, 'title', v)} />
                    </div>
                    <CMSField label="Description" value={item.desc || ''} onChange={(v) => handleArrayUpdate('features', 'items', idx, 'desc', v)} isTextarea />
                  </div>
                ))}
             </div>
             <div style={{ marginTop: '1rem' }}>
                <ImageUploadField 
                  label="Features Visual Image (Optional)" 
                  value={content.features?.features_visual || ''} 
                  section="features" 
                  field="features_visual" 
                  uploading={uploadingMockup} 
                  progress={mockupProgress} 
                  onUpload={handleImageUpload} 
                />
             </div>
          </div>
        )}

        {activeTab === 'cta_band' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             <div style={{ borderBottom: '1px solid #222', paddingBottom: '1rem' }}>
              <h3 style={{ color: 'white', fontSize: '1rem' }}>CTA Band Customization</h3>
            </div>
             <CMSField label="Main Title" value={content.cta_band?.title || ''} onChange={(v) => handleUpdate('cta_band', 'title', v)} />
             <CMSField label="Subtitle Text" value={content.cta_band?.subtitle || ''} onChange={(v) => handleUpdate('cta_band', 'subtitle', v)} />
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
               <CMSField label="Primary Button Text" value={content.cta_band?.primary_btn || ''} onChange={(v) => handleUpdate('cta_band', 'primary_btn', v)} />
               <CMSField label="Secondary Button Text" value={content.cta_band?.secondary_btn || ''} onChange={(v) => handleUpdate('cta_band', 'secondary_btn', v)} />
             </div>
             <CMSField label="Secondary Button Link" value={content.cta_band?.secondary_link || ''} onChange={(v) => handleUpdate('cta_band', 'secondary_link', v)} />
             <div style={{ marginTop: '1rem' }}>
                <ImageUploadField 
                  label="CTA Background Image" 
                  value={content.cta_band?.cta_bg || ''} 
                  section="cta_band" 
                  field="cta_bg" 
                  uploading={uploadingMockup} 
                  progress={mockupProgress} 
                  onUpload={handleImageUpload} 
                />
             </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222', paddingBottom: '1rem' }}>
              <h3 style={{ color: 'white', fontSize: '1rem' }}>Contact & Footer Text</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--adm-dim)', fontWeight: '700' }}>THEME MODE:</label>
                <select 
                  value={content.contact.theme || 'light'} 
                  onChange={(e) => handleUpdate('contact', 'theme', e.target.value)}
                  style={{ background: '#222', color: 'white', border: '1px solid #444', borderRadius: '6px', padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                >
                  <option value="light">Light (White Bg)</option>
                  <option value="dark">Dark (Black Bg)</option>
                </select>
              </div>
            </div>
             <CMSField label="Contact Heading" value={content.contact.heading} onChange={(v) => handleUpdate('contact', 'heading', v)} />
             <CMSField label="Contact Subtext" value={content.contact.sub} onChange={(v) => handleUpdate('contact', 'sub', v)} />
             <CMSField label="Physical Address" value={content.contact.address} onChange={(v) => handleUpdate('contact', 'address', v)} />
             <CMSField label="Working Hours" value={content.contact.working_hours} onChange={(v) => handleUpdate('contact', 'working_hours', v)} />
             <div style={{ marginTop: '1rem' }}>
                <ImageUploadField 
                  label="Office / Contact Image" 
                  value={content.contact?.office_image || ''} 
                  section="contact" 
                  field="office_image" 
                  uploading={uploadingMockup} 
                  progress={mockupProgress} 
                  onUpload={handleImageUpload} 
                />
             </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
        <button onClick={handleSave} disabled={saving} className="admin-btn-primary" style={{ padding: '0.8rem 2.5rem' }}>
          <Save size={18} /> {saving ? 'Saving...' : 'Update Landing Page'}
        </button>
      </div>
    </div>
  );
};

const TabButton = ({ id, label, active, onClick, icon }) => (
  <button 
    onClick={() => onClick(id)}
    style={{
      display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.7rem 1.2rem',
      background: active === id ? 'rgba(232,25,44,0.1)' : 'transparent',
      border: `1px solid ${active === id ? 'var(--adm-red)' : 'var(--adm-border)'}`,
      borderRadius: '10px', color: active === id ? 'white' : 'var(--adm-dim)',
      cursor: 'pointer', fontSize: '0.85rem', fontWeight: active === id ? '600' : '400',
      transition: 'all 0.2s', whiteSpace: 'nowrap'
    }}
  >
    {icon} {label}
  </button>
);

const CMSField = ({ label, value, onChange, isTextarea = false }) => (
  <div style={{ flex: 1 }}>
    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--adm-dim)', marginBottom: '0.5rem', fontWeight: '600', textTransform: 'uppercase' }}>{label}</label>
    {isTextarea ? (
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4} className="admin-input" />
    ) : (
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="admin-input" />
    )}
  </div>
);

const ImageUploadField = ({ label, value, section, field, uploading, progress, onUpload }) => (
  <div>
    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--adm-dim)', marginBottom: '0.8rem', fontWeight: '600', textTransform: 'uppercase' }}>{label}</label>
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid #222' }}>
      <div style={{ width: '120px', height: '80px', background: '#000', borderRadius: '8px', overflow: 'hidden', border: '1px solid #333', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {uploading ? (
          <div style={{ textAlign: 'center', color: '#E8192C', fontSize: '0.7rem', fontWeight: 700 }}>
            <Loader2 size={20} style={{ animation: 'spin 1s linear infinite', marginBottom: '4px' }} />
            <div>{progress}%</div>
          </div>
        ) : value ? (
          <img src={value} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        ) : (
          <ImageIcon size={24} color="#333" />
        )}
      </div>
      <div style={{ flex: 1 }}>
          <div style={{ position: 'relative' }}>
          <input type="file" onChange={(e) => onUpload(e, section, field)} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: uploading ? 'not-allowed' : 'pointer' }} accept="image/*" disabled={uploading} />
          <button className="admin-btn-secondary" style={{ marginBottom: '0.5rem', opacity: uploading ? 0.5 : 1 }}>
            {uploading ? <><Loader2 size={14} /> Uploading {progress}%</> : <><Upload size={14} /> Upload Image</>}
          </button>
        </div>
        <p style={{ fontSize: '0.65rem', color: 'var(--adm-dim)' }}>Large files are auto-compressed.</p>
      </div>
    </div>
  </div>
);

export default ContentManager;
