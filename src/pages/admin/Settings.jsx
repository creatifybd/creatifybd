import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getSettings, updateSettings } from '../../firebase/services';
import { DEFAULT_CLOUDINARY_CLOUD_NAME, DEFAULT_CLOUDINARY_UPLOAD_PRESET } from '../../utils/cloudinary';
import MediaUploader from '../../components/admin/MediaUploader';
import { Globe, Phone, Mail, Share2, AtSign, Search, Save, RefreshCw, Upload, Palette, Image as ImageIcon, CreditCard, FileCheck } from 'lucide-react';
import { useConfirm } from '../../context/ConfirmContext';

const defaultPaymentSettings = {
  lemonSqueezy: { storeId: '', apiKey: '', checkoutUrl: '', enabled: true },
  payoneer: { accountName: '', currency: 'USD', note: '', paymentLink: '' },
  wise: {
    usd: { accountName: '', bankName: '', routingNumber: '', accountNumber: '', swift: '', address: '' },
    eur: { accountName: '', iban: '', bicSwift: '', bankName: '' },
    gbp: { accountName: '', sortCode: '', accountNumber: '', iban: '' }
  },
  dbbl: { bankName: 'Dutch Bangla Bank Limited', accountName: '', accountNumber: '', branch: '', routingNumber: '', paymentReference: '' },
  tradeLicense: { number: '', issuedDate: '' }
};

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
  cloudinary_cloud_name: DEFAULT_CLOUDINARY_CLOUD_NAME,
  cloudinary_upload_preset: DEFAULT_CLOUDINARY_UPLOAD_PRESET,
  page_seo: {
    home: { title: '', description: '' },
    services: { title: '', description: '' },
    portfolio: { title: '', description: '' },
    pricing: { title: '', description: '' },
    about: { title: '', description: '' },
    contact: { title: '', description: '' },
    reviews: { title: '', description: '' },
    team: { title: '', description: '' },
    process: { title: '', description: '' },
    gigs: { title: '', description: '' },
    privacy: { title: '', description: '' },
    terms: { title: '', description: '' },
    refund_policy: { title: '', description: '' },
    revision_policy: { title: '', description: '' }
  }
};

const PAGE_SEO_LABELS = {
  home: 'Home',
  services: 'Services',
  portfolio: 'Portfolio',
  pricing: 'Pricing',
  about: 'About',
  contact: 'Contact',
  reviews: 'Reviews',
  team: 'Team',
  process: 'Process / How We Work',
  gigs: 'Gigs Catalog',
  privacy: 'Privacy Policy',
  terms: 'Terms of Service',
  refund_policy: 'Refund Policy',
  revision_policy: 'Revision Policy'
};

const SettingsManager = () => {
  const confirm = useConfirm();
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [paymentSettings, setPaymentSettings] = useState(defaultPaymentSettings);
  const [savingPayment, setSavingPayment] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings('site');
        if (data) {
          setSettings({ ...defaultSettings, ...data });
        }
      } catch (err) {
        // Error handled by service
      }
      try {
        const paymentData = await getSettings('payment');
        if (paymentData) {
          setPaymentSettings({
            lemonSqueezy: { ...defaultPaymentSettings.lemonSqueezy, ...(paymentData.lemonSqueezy || {}) },
            payoneer: { ...defaultPaymentSettings.payoneer, ...(paymentData.payoneer || {}) },
            wise: {
              usd: { ...defaultPaymentSettings.wise.usd, ...(paymentData.wise?.usd || {}) },
              eur: { ...defaultPaymentSettings.wise.eur, ...(paymentData.wise?.eur || {}) },
              gbp: { ...defaultPaymentSettings.wise.gbp, ...(paymentData.wise?.gbp || {}) }
            },
            dbbl: { ...defaultPaymentSettings.dbbl, ...(paymentData.dbbl || {}) },
            tradeLicense: { ...defaultPaymentSettings.tradeLicense, ...(paymentData.tradeLicense || {}) }
          });
        }
      } catch (err) {
        // Error handled by service
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const updatePaymentField = (section, field, value) => {
    setPaymentSettings(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const updateWiseField = (subCurrency, field, value) => {
    setPaymentSettings(prev => ({
      ...prev,
      wise: {
        ...prev.wise,
        [subCurrency]: {
          ...(prev.wise?.[subCurrency] || {}),
          [field]: value
        }
      }
    }));
  };

  const handleSavePayment = async () => {
    setSavingPayment(true);
    try {
      await updateSettings(paymentSettings, 'payment');
      toast.success('Payment settings saved \u2014 changes are live on the Payment page now.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save payment settings.');
    } finally {
      setSavingPayment(false);
    }
  };

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handlePageSeoChange = (pageKey, field, value) => {
    setSettings((prev) => ({
      ...prev,
      page_seo: {
        ...prev.page_seo,
        [pageKey]: {
          ...prev.page_seo?.[pageKey],
          [field]: value
        }
      }
    }));
  };

  const handleMediaChange = async (fieldName, url) => {
    try {
      const updatedSettings = { ...settings, [fieldName]: url };
      setSettings(updatedSettings);
      await updateSettings({ [fieldName]: url }, 'site');
      toast.success(`${fieldName.replace('_', ' ')} updated!`);
    } catch (err) {
      console.error(err);
      toast.error('Upload failed. Please try again.');
    } finally { /* state is handled by MediaUploader */ }
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

  const handleReset = async () => {
    const ok = await confirm({
      title: 'Reset all settings?',
      description: 'This will restore all fields to their default values. Click Save afterward to apply the change.',
      confirmLabel: 'Reset',
      tone: 'danger'
    });
    if (!ok) return;
    setSettings(defaultSettings);
    toast('Settings reset. Click Save to apply.', { icon: '⚠️' });
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
            onChange={(url) => handleMediaChange('logo_url', url)}
            sizeNote="Recommended: 250x80px (PNG/SVG)"
          />
          <LogoUploadField 
            label="Favicon / Tab Icon" 
            fieldName="favicon_url" 
            value={settings.favicon_url} 
            onChange={(url) => handleMediaChange('favicon_url', url)}
            sizeNote="Recommended: 64x64px (Square PNG)"
          />
          <LogoUploadField 
            label="Loading Logo" 
            fieldName="loading_logo_url" 
            value={settings.loading_logo_url} 
            onChange={(url) => handleMediaChange('loading_logo_url', url)}
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

      {/* Payment Settings */}
      <div className="admin-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <CreditCard size={18} color="var(--adm-red)" />
            <h2 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--adm-text)' }}>Payment Settings</h2>
          </div>
          <button onClick={handleSavePayment} disabled={savingPayment} className="admin-btn-primary">
            <Save size={15} /> {savingPayment ? 'Saving...' : 'Save Payment Settings'}
          </button>
        </div>
        <p style={{ color: 'var(--adm-dim)', fontSize: '0.82rem', marginBottom: '1.5rem' }}>
          These details appear on the public Payment page so clients can pay you directly. Account numbers here are shown to visitors on purpose \u2014 that's how bank transfer payment works \u2014 only you can edit them.
        </p>

        {/* Lemon Squeezy */}
        <div style={{ background: 'rgba(255,193,7,0.06)', border: '1px solid rgba(255,193,7,0.25)', borderRadius: '12px', padding: '1.2rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--adm-text)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            🍋 Lemon Squeezy (Credit Card, Apple Pay, Google Pay)
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--adm-dim)', marginBottom: '1rem' }}>
            Merchant of Record checkout for international credit/debit card processing. Enter credentials from your Lemon Squeezy Dashboard.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem' }}>
            <SettingField label="Store ID" value={paymentSettings.lemonSqueezy?.storeId || ''} onChange={(e) => updatePaymentField('lemonSqueezy', 'storeId', e.target.value)} placeholder="e.g. 12345" />
            <SettingField label="Default Checkout URL" value={paymentSettings.lemonSqueezy?.checkoutUrl || ''} onChange={(e) => updatePaymentField('lemonSqueezy', 'checkoutUrl', e.target.value)} placeholder="https://creatifybd.lemonsqueezy.com/buy/..." />
            <SettingField label="API Key (optional)" value={paymentSettings.lemonSqueezy?.apiKey || ''} onChange={(e) => updatePaymentField('lemonSqueezy', 'apiKey', e.target.value)} placeholder="ls_api_..." />
          </div>
        </div>

        {/* Wise Bank Transfer */}
        <div style={{ background: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: '12px', padding: '1.2rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--adm-text)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            🌐 Wise International Bank Transfers (USD, EUR, GBP)
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--adm-dim)', marginBottom: '1rem' }}>
            Local receiving bank accounts for US Wire/ACH, Eurozone IBAN, and UK Faster Payments.
          </p>

          {/* USD */}
          <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--adm-text)', margin: '1rem 0 0.5rem' }}>🇺🇸 USD Bank Account (US ACH & Wire)</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.2rem' }}>
            <SettingField label="Account Holder Name" value={paymentSettings.wise?.usd?.accountName || ''} onChange={(e) => updateWiseField('usd', 'accountName', e.target.value)} placeholder="CreatifyBD" />
            <SettingField label="Bank Name" value={paymentSettings.wise?.usd?.bankName || ''} onChange={(e) => updateWiseField('usd', 'bankName', e.target.value)} placeholder="Evolve Bank & Trust" />
            <SettingField label="ACH & Wire Routing Number" value={paymentSettings.wise?.usd?.routingNumber || ''} onChange={(e) => updateWiseField('usd', 'routingNumber', e.target.value)} placeholder="9-digit routing" />
            <SettingField label="Account Number" value={paymentSettings.wise?.usd?.accountNumber || ''} onChange={(e) => updateWiseField('usd', 'accountNumber', e.target.value)} placeholder="Account number" />
            <SettingField label="SWIFT / BIC Code" value={paymentSettings.wise?.usd?.swift || ''} onChange={(e) => updateWiseField('usd', 'swift', e.target.value)} placeholder="SWIFT code" />
          </div>

          {/* EUR */}
          <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--adm-text)', margin: '1rem 0 0.5rem' }}>🇪🇺 EUR Bank Account (Eurozone SEPA IBAN)</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.2rem' }}>
            <SettingField label="Account Holder Name" value={paymentSettings.wise?.eur?.accountName || ''} onChange={(e) => updateWiseField('eur', 'accountName', e.target.value)} placeholder="CreatifyBD" />
            <SettingField label="IBAN Number" value={paymentSettings.wise?.eur?.iban || ''} onChange={(e) => updateWiseField('eur', 'iban', e.target.value)} placeholder="BE12 3456 7890 1234" />
            <SettingField label="BIC / SWIFT" value={paymentSettings.wise?.eur?.bicSwift || ''} onChange={(e) => updateWiseField('eur', 'bicSwift', e.target.value)} placeholder="BIC / SWIFT code" />
          </div>

          {/* GBP */}
          <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--adm-text)', margin: '1rem 0 0.5rem' }}>🇬🇧 GBP Bank Account (UK Faster Payments)</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <SettingField label="Account Holder Name" value={paymentSettings.wise?.gbp?.accountName || ''} onChange={(e) => updateWiseField('gbp', 'accountName', e.target.value)} placeholder="CreatifyBD" />
            <SettingField label="Sort Code" value={paymentSettings.wise?.gbp?.sortCode || ''} onChange={(e) => updateWiseField('gbp', 'sortCode', e.target.value)} placeholder="12-34-56" />
            <SettingField label="Account Number" value={paymentSettings.wise?.gbp?.accountNumber || ''} onChange={(e) => updateWiseField('gbp', 'accountNumber', e.target.value)} placeholder="8-digit account number" />
          </div>
        </div>

        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--adm-text)', marginBottom: '1rem' }}>Payoneer</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem', marginBottom: '2rem' }}>
          <SettingField label="Account Name / Email" value={paymentSettings.payoneer.accountName} onChange={(e) => updatePaymentField('payoneer', 'accountName', e.target.value)} placeholder="the email/name clients send Payoneer payments to" />
          <SettingField label="Currency" value={paymentSettings.payoneer.currency} onChange={(e) => updatePaymentField('payoneer', 'currency', e.target.value)} />
          <SettingField label="Payment Request Link (optional)" value={paymentSettings.payoneer.paymentLink} onChange={(e) => updatePaymentField('payoneer', 'paymentLink', e.target.value)} placeholder="https://" />
          <SettingField label="Note shown to client" value={paymentSettings.payoneer.note} onChange={(e) => updatePaymentField('payoneer', 'note', e.target.value)} isTextarea />
        </div>

        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--adm-text)', marginBottom: '1rem' }}>DBBL Bank Transfer</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem', marginBottom: '1rem' }}>
          <SettingField label="Bank Name" value={paymentSettings.dbbl.bankName} onChange={(e) => updatePaymentField('dbbl', 'bankName', e.target.value)} />
          <SettingField label="Account Name" value={paymentSettings.dbbl.accountName} onChange={(e) => updatePaymentField('dbbl', 'accountName', e.target.value)} />
          <SettingField label="Account Number" value={paymentSettings.dbbl.accountNumber} onChange={(e) => updatePaymentField('dbbl', 'accountNumber', e.target.value)} />
          <SettingField label="Branch" value={paymentSettings.dbbl.branch} onChange={(e) => updatePaymentField('dbbl', 'branch', e.target.value)} />
          <SettingField label="Routing Number (optional)" value={paymentSettings.dbbl.routingNumber} onChange={(e) => updatePaymentField('dbbl', 'routingNumber', e.target.value)} />
          <SettingField label="Payment Reference Format" value={paymentSettings.dbbl.paymentReference} onChange={(e) => updatePaymentField('dbbl', 'paymentReference', e.target.value)} placeholder="e.g. Your Order ID" />
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--adm-dim)', marginBottom: '2rem' }}>
          {paymentSettings.payoneer.accountName || paymentSettings.dbbl.accountNumber
            ? '\u2705 Real payment details detected \u2014 the placeholder warning is now hidden from clients for whichever method is filled in.'
            : '\u26a0\ufe0f Both methods are still empty \u2014 clients currently see a "contact us for payment details" placeholder instead of real account info.'}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--adm-border)' }}>
          <FileCheck size={18} color="var(--adm-red)" />
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--adm-text)' }}>Trade License</h3>
        </div>
        <p style={{ color: 'var(--adm-dim)', fontSize: '0.82rem', marginBottom: '1rem' }}>
          Not shown publicly until filled in. Add it here the moment it's issued \u2014 no code changes needed.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem' }}>
          <SettingField label="License Number" value={paymentSettings.tradeLicense.number} onChange={(e) => updatePaymentField('tradeLicense', 'number', e.target.value)} placeholder="Not yet issued" />
          <SettingField label="Issued Date" value={paymentSettings.tradeLicense.issuedDate} onChange={(e) => updatePaymentField('tradeLicense', 'issuedDate', e.target.value)} placeholder="e.g. 2026-09-01" />
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

      {/* Page-level SEO overrides */}
      <div className="admin-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
          <Search size={18} color="var(--adm-red)" />
          <h2 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--adm-text)' }}>Page SEO Overrides</h2>
        </div>
        <p style={{ color: 'var(--adm-dim)', fontSize: '0.82rem', marginBottom: '1.5rem' }}>
          Leave a field blank to keep that page's default title/description. Fill it in to override it for search engines.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {Object.keys(PAGE_SEO_LABELS).map((pageKey) => (
            <div key={pageKey} style={{ background: 'var(--adm-bg)', border: '1px solid var(--adm-border)', borderRadius: '12px', padding: '1.25rem' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--adm-text)', marginBottom: '1rem' }}>{PAGE_SEO_LABELS[pageKey]} Page</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="setting-label">Meta Title Override</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Leave blank to use default"
                    value={settings.page_seo?.[pageKey]?.title || ''}
                    onChange={(e) => handlePageSeoChange(pageKey, 'title', e.target.value)}
                  />
                </div>
                <div>
                  <label className="setting-label">Meta Description Override</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Leave blank to use default"
                    value={settings.page_seo?.[pageKey]?.description || ''}
                    onChange={(e) => handlePageSeoChange(pageKey, 'description', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
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

const LogoUploadField = ({ label, fieldName, value, onChange, sizeNote }) => (
  <div style={{ background: 'var(--adm-bg)', border: '1px solid var(--adm-border)', borderRadius: '12px', padding: '1.5rem' }}>
    <MediaUploader label={label} value={value} accept="image/*" folder="creatifybd/branding" helperText={`${sizeNote}. Drag and drop or use a direct link.`} onChange={onChange} />
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
