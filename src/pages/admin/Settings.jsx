import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getSettings, updateSettings } from '../../firebase/services';
import { uploadImage } from '../../utils/cloudinary';
import { Globe, Phone, Mail, Share2, AtSign, Search, Save, RefreshCw, Upload, Palette, Image as ImageIcon } from 'lucide-react';

const defaultSettings = {
  site_name: 'CreatifyBD',
  tagline: 'Creative Agency & Digital Marketing in Dhaka',
  primary_color: '#E8192C',
  secondary_color: '#B11221',
  logo_url: '/logo.png',
  favicon_url: '/favicon.png',
  loading_logo_url: '/favicon.png',
  phone: '+880 01951 676600',
  email: 'creatifybd@gmail.com',
  facebook: 'https://facebook.com/creatifybd',
  instagram: 'https://instagram.com/creatifybd',
  whatsapp: '',
  seo_title: 'CreatifyBD — Creative Agency & Digital Marketing in Dhaka, Bangladesh',
  seo_description: 'CreatifyBD is a leading creative agency in Dhaka providing social media marketing, professional photography, web development, and branding services.',
  seo_keywords: 'creative agency dhaka, digital marketing bangladesh, social media management dhaka',
  lang: 'en',
  cloudinary_cloud_name: '',
  cloudinary_upload_preset: '',
};

const SettingsManager = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings('site');
        if (data) {
          setSettings({ ...defaultSettings, ...data });
        }
      } catch (err) {
        // Error handled by service
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(fieldName);
    try {
      const downloadURL = await uploadImage(file, undefined, {
        cloudName: settings.cloudinary_cloud_name,
        uploadPreset: settings.cloudinary_upload_preset
      });
      
      const updatedSettings = { ...settings, [fieldName]: downloadURL };
      setSettings(updatedSettings);
      
      await updateSettings({ [fieldName]: downloadURL }, 'site');
      toast.success(`${fieldName.replace('_', ' ')} updated!`);
    } catch (err) {
      console.error(err);
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(null);
    }
  };


  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings(settings, 'site');
      toast.success('Settings saved successfully!');
    } catch (err) {
      // Error handled by service
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all settings to default values?')) {
      setSettings(defaultSettings);
      toast('Settings reset. Click Save to apply.', { icon: '⚠️' });
    }
  };

  if (loading) {
    return (
      <div className="admin-card" style={{ textAlign: 'center', padding: '4rem' }}>
        <div style={{ color: 'var(--adm-dim)', fontSize: '0.9rem' }}>Loading settings...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1000px' }}>

      {/* Header */}
      <div className="admin-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--adm-text)', marginBottom: '0.25rem' }}>Global CMS & Settings</h1>
          <p style={{ color: 'var(--adm-dim)', fontSize: '0.85rem' }}>Full control over branding, theme, and site identity.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleReset} className="admin-btn-secondary"><RefreshCw size={15} /> Reset</button>
          <button onClick={handleSave} disabled={saving} className="admin-btn-primary">
            <Save size={15} /> {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>

      {/* Branding & Logos */}
      <div className="admin-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '2rem' }}>
          <ImageIcon size={18} color="var(--adm-red)" />
          <h2 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--adm-text)' }}>Logo & Identity</h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          <LogoUploadField 
            label="Navbar Logo" 
            fieldName="logo_url" 
            value={settings.logo_url} 
            onUpload={handleFileUpload} 
            isUploading={uploading === 'logo_url'}
            sizeNote="Recommended: 250x80px (PNG/SVG)"
          />
          <LogoUploadField 
            label="Favicon / Tab Icon" 
            fieldName="favicon_url" 
            value={settings.favicon_url} 
            onUpload={handleFileUpload} 
            isUploading={uploading === 'favicon_url'}
            sizeNote="Recommended: 64x64px (Square PNG)"
          />
          <LogoUploadField 
            label="Loading Logo" 
            fieldName="loading_logo_url" 
            value={settings.loading_logo_url} 
            onUpload={handleFileUpload} 
            isUploading={uploading === 'loading_logo_url'}
            sizeNote="Recommended: 200x200px (Centered Icon)"
          />
        </div>
      </div>

      {/* Theme & Colors */}
      <div className="admin-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
          <Palette size={18} color="var(--adm-red)" />
          <h2 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--adm-text)' }}>Theme Customization</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <label className="setting-label">Primary Color (Accent)</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input type="color" name="primary_color" value={settings.primary_color} onChange={handleChange} style={{ width: '60px', height: '40px', padding: '0', border: 'none', background: 'none', cursor: 'pointer' }} />
              <input type="text" name="primary_color" value={settings.primary_color} onChange={handleChange} className="admin-input" style={{ width: '120px' }} />
            </div>
          </div>
          <div>
            <label className="setting-label">Primary Dark (Hover/Active)</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input type="color" name="secondary_color" value={settings.secondary_color} onChange={handleChange} style={{ width: '60px', height: '40px', padding: '0', border: 'none', background: 'none', cursor: 'pointer' }} />
              <input type="text" name="secondary_color" value={settings.secondary_color} onChange={handleChange} className="admin-input" style={{ width: '120px' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Basic Settings */}
      <div className="admin-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
          <Globe size={18} color="var(--adm-red)" />
          <h2 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--adm-text)' }}>Site Details</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <SettingField label="Site Name" name="site_name" value={settings.site_name} onChange={handleChange} />
          <SettingField label="Tagline" name="tagline" value={settings.tagline} onChange={handleChange} />
          <SettingField label="Phone" name="phone" value={settings.phone} onChange={handleChange} />
          <SettingField label="Email" name="email" value={settings.email} onChange={handleChange} />
        </div>
      </div>

      {/* SEO */}
      <div className="admin-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
          <Search size={18} color="var(--adm-red)" />
          <h2 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--adm-text)' }}>SEO & Meta</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <SettingField label="SEO Title" name="seo_title" value={settings.seo_title} onChange={handleChange} />
          <SettingField label="SEO Description" name="seo_description" value={settings.seo_description} onChange={handleChange} isTextarea />
        </div>
      </div>

      <div className="admin-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <ImageIcon size={18} color="var(--adm-red)" />
          <h2 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--adm-text)' }}>Cloudinary Media Delivery</h2>
        </div>
        <p style={{ color: 'var(--adm-dim)', fontSize: '0.82rem', marginBottom: '1.25rem' }}>
          Enter an unsigned upload preset. Never enter a Cloudinary API secret in the dashboard.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          <SettingField label="Cloud Name" name="cloudinary_cloud_name" value={settings.cloudinary_cloud_name} onChange={handleChange} placeholder="your-cloud-name" />
          <SettingField label="Unsigned Upload Preset" name="cloudinary_upload_preset" value={settings.cloudinary_upload_preset} onChange={handleChange} placeholder="creatifybd_unsigned" />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: '2rem' }}>
        <button onClick={handleSave} disabled={saving} className="admin-btn-primary" style={{ padding: '1rem 3rem' }}>
          <Save size={18} /> {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

    </div>
  );
};

const LogoUploadField = ({ label, fieldName, value, onUpload, isUploading, sizeNote }) => (
  <div style={{ background: 'var(--adm-bg)', border: '1px solid var(--adm-border)', borderRadius: '12px', padding: '1.5rem' }}>
    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: 'var(--adm-dim)', marginBottom: '1rem', textTransform: 'uppercase' }}>{label}</label>
    <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', borderRadius: '8px', marginBottom: '1rem', border: '1px dashed #333', overflow: 'hidden' }}>
      {value ? <img src={value} alt={label} style={{ maxHeight: '80%', maxWidth: '80%', objectFit: 'contain' }} /> : <span style={{ color: '#333' }}>No Image</span>}
    </div>
    <div style={{ position: 'relative' }}>
      <input type="file" onChange={(e) => onUpload(e, fieldName)} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} accept="image/*" />
      <button className="admin-btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
        <Upload size={14} /> {isUploading ? 'Uploading...' : 'Upload New'}
      </button>
    </div>
    <p style={{ fontSize: '0.65rem', color: 'var(--adm-dim)', marginTop: '0.75rem', textAlign: 'center' }}>{sizeNote}</p>
  </div>
);

const SettingField = ({ label, name, value, onChange, placeholder = '', isTextarea = false }) => (
  <div>
    <label className="setting-label">{label}</label>
    {isTextarea ? (
      <textarea name={name} value={value} onChange={onChange} rows={3} className="admin-input" />
    ) : (
      <input type="text" name={name} value={value} onChange={onChange} placeholder={placeholder} className="admin-input" />
    )}
  </div>
);

export default SettingsManager;
