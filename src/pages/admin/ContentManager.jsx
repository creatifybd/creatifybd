import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { db, storage } from '../../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Layout, Type, Image as ImageIcon, Save, RefreshCw, Upload, Sparkles, Box, MessageSquare } from 'lucide-react';

const defaultContent = {
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
      { id: 1, title: 'Discovery', desc: 'We learn about your brand, goals, and audience.' },
      { id: 2, title: 'Strategy', desc: 'We craft a custom roadmap for your success.' },
      { id: 3, title: 'Execution', desc: 'Our experts bring the vision to life.' }
    ]
  },
  contact: {
    theme: 'light',
    heading: 'Ready to <span class="text-red">Grow?</span>',
    sub: "Let's build something amazing together.",
    address: 'Dhaka, Bangladesh',
    working_hours: 'Sat - Thu: 10 AM - 8 PM'
  }
};


const ContentManager = () => {
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');

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
        <TabButton id="hero" label="Hero Section" active={activeTab} onClick={setActiveTab} icon={<Sparkles size={16} />} />
        <TabButton id="process" label="Process Steps" active={activeTab} onClick={setActiveTab} icon={<Box size={16} />} />
        <TabButton id="contact" label="Contact Section" active={activeTab} onClick={setActiveTab} icon={<MessageSquare size={16} />} />
      </div>

      <div className="admin-card">
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
          </div>
        )}

        {activeTab === 'process' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222', paddingBottom: '1rem' }}>
              <h3 style={{ color: 'white', fontSize: '1rem' }}>Workflow Section</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--adm-dim)', fontWeight: '700' }}>THEME MODE:</label>
                <select 
                  value={content.process.theme || 'light'} 
                  onChange={(e) => handleUpdate('process', 'theme', e.target.value)}
                  style={{ background: '#222', color: 'white', border: '1px solid #444', borderRadius: '6px', padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                >
                  <option value="light">Light (White Bg)</option>
                  <option value="dark">Dark (Black Bg)</option>
                </select>
              </div>
            </div>
             <CMSField label="Section Title" value={content.process.title} onChange={(v) => handleUpdate('process', 'title', v)} />
             <CMSField label="Section Subtitle" value={content.process.subtitle} onChange={(v) => handleUpdate('process', 'subtitle', v)} />
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

export default ContentManager;
