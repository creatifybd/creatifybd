import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { db } from '../../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import MediaUploader from '../../components/admin/MediaUploader';
import {
  Briefcase,
  Eye,
  Image as ImageIcon,
  Layout,
  Loader2,
  Save,
  Settings,
  Upload
} from 'lucide-react';

const defaultContent = {
  visibility: {
    hero: true,
    intro_band: true,
    clients: false,
    smm_highlight: false,
    services: true,
    features: true,
    about_trust: true,
    portfolio: true,
    process: true,
    pricing: true,
    testimonials: true,
    cta_band: true,
    contact: true
  },
  hero: {
    eyebrow: 'One Team. Every Discipline You Need.',
    title: 'Your Brand Shouldn\u2019t Need Five Different Freelancers',
    desc: 'CreatifyBD is a full-service creative team — branding, social media, video, and web — working together instead of scattered across freelancers who\u2019ve never spoken to each other. Real people, real turnaround times, and pricing built around your actual project.',
    cta1: 'See Our Work',
    cta2: 'Get a Custom Quote',
    mockup_primary: ''
  },
  intro_band: {
    title: 'The creative services ambitious brands ask for most, packaged for reliable monthly execution',
    pillars: [
      { title: 'Monthly social media management', desc: 'Consistent calendars, post design, captions, scheduling, and reporting for growing brands.', color: '#E8192C' },
      { title: 'Brand-ready creative assets', desc: 'Graphic design, campaign visuals, ad creatives, and templates that keep your business polished.', color: '#7C3AED' },
      { title: 'Video, marketing, and websites', desc: 'Short-form video edits, digital marketing support, and conversion-focused website design.', color: '#0EA5E9' }
    ]
  },
  clients: {
    label: 'Trusted by brands in global markets',
    list: 'Maple & Co, Northstar Dental, Harbor Cafe, Green Eats, Nova Clothing, EduBridge, HealthPlus, CraftNest, ShopLocal, ByteWave, Riverside Resto, Summit Fitness'
  },
  smm_highlight: {
    eyebrow: 'Managed Social Media',
    title: 'Monthly social media management for international brands',
    lead: 'A dedicated creative workflow for founders who need consistent, polished social media without hiring a full in-house team. We plan, design, write, schedule, and report, so your business stays active and trustworthy every week.',
    cta_label: 'Explore SMM Packages',
    board_title: 'Monthly Growth Board',
    status: 'Ready for Review',
    included: 'content calendar, branded templates, short-form video direction, caption writing, scheduling support, and analytics.',
    metrics: {
      left_label: 'Content pieces',
      left_value: '30',
      left_note: 'Posts, stories, reels',
      right_label: 'Platforms',
      right_value: '3',
      right_note: 'Instagram, Facebook, LinkedIn'
    },
    benefits: [
      { title: 'Done-for-you monthly calendar', desc: 'Post ideas, designs, captions, hashtags, and scheduling prepared before the month starts.' },
      { title: 'Brand voice and community support', desc: 'Professional captions, customer-facing replies guidance, and consistent visual tone.' },
      { title: 'Performance reporting', desc: 'Monthly reach, engagement, content winners, and next-step recommendations.' }
    ]
  },
  features: {
    eyebrow: 'Why CreatifyBD',
    title: 'A reliable creative team without agency overhead',
    subtitle: 'We combine structured creative operations with international service standards, giving brands dependable creative output at practical monthly pricing.',
    visual_title: 'Creative operations built for recurring growth',
    badges: ['Social Media Management', 'Graphic Design', 'Video Editing', 'Digital Marketing', 'Website Design'],
    stats: [
      { value: '100+', label: 'Projects delivered' },
      { value: '5.0*', label: 'Client rating target' },
      { value: '24h', label: 'Typical response window' }
    ],
    items: [
      { title: 'Built for international buyers', desc: 'Copy, visuals, formats, and offers are shaped for global audiences.' },
      { title: 'Agency process, gig-style clarity', desc: 'Clear scope, milestones, revisions, and deliverables before work begins.' },
      { title: 'Timezone-friendly production', desc: 'Async updates, organized reviews, and steady weekly progress without meetings overload.' },
      { title: 'Creative tied to business outcomes', desc: 'Content and design decisions are made around leads, trust, reach, and conversion.' }
    ]
  },
  process: {
    eyebrow: 'Our Workflow',
    title: 'A clear process from first brief to final delivery',
    subtitle: 'Every project follows a visible workflow, so you know what is happening, what needs approval, and when deliverables are due.',
    steps: [
      { num: '01', title: 'Audit and brief', desc: 'We review your current brand, competitors, audience, goals, and existing assets before proposing scope.' },
      { num: '02', title: 'Strategy and calendar', desc: 'We map the service plan, creative direction, content calendar, milestones, and approval process.' },
      { num: '03', title: 'Creative production', desc: 'Designers, editors, writers, and web specialists produce drafts with organized review checkpoints.' },
      { num: '04', title: 'Launch and improve', desc: 'Final assets are delivered, scheduled, or launched with performance notes and next-step recommendations.' }
    ]
  },
  about_trust: {
    eyebrow: 'About CreatifyBD',
    title: 'A Real Team, Built for Businesses Ready to Grow',
    subtitle: 'CreatifyBD gives founders and marketing teams dependable creative execution without the cost or complexity of a full in-house department.',
    ceo_quote: 'Every brand we touch should look like it\u2019s already competing at the level it wants to reach \u2014 that\u2019s the standard we hold every project to.',
    cta_label: 'Read Our Story',
    team_heading: 'Specialist delivery model',
    team_roles: ['Brand Strategy', 'Visual Design', 'Motion & Video', 'Web Development', 'Client Success'],
    stats: [
      { value: '11+', label: 'Countries reached' },
      { value: '4-7', label: 'Person expert team' },
      { value: '39+', label: 'Verified client reviews' }
    ]
  },
  cta_band: {
    eyebrow: 'Ready to start?',
    title: 'Most Projects Start With One Message',
    subtitle: "No lengthy onboarding, no sales calls you don't need \u2014 tell us what you're building and get a real quote back fast.",
    primary_btn: 'Start a Project',
    primary_link: '/contact',
    secondary_btn: 'hello@creatifybd.com',
    secondary_link: 'mailto:hello@creatifybd.com'
  },
  contact: {
    heading: "Let's build something great.",
    sub: 'Tell us about your brand, target market, and the kind of creative support you need.',
    address: 'Serving clients globally',
    working_hours: 'Saturday - Thursday, 10 AM - 8 PM',
    office_image: ''
  }
};

const managerLinks = [
  { to: '/admin/settings', label: 'Branding, SEO, logos, contact details' },
  { to: '/admin/gigs', label: 'Gig catalogue and marketplace services' },
  { to: '/admin/services', label: 'Homepage services list' },
  { to: '/admin/portfolio', label: 'Portfolio gallery' },
  { to: '/admin/media', label: 'Cloudinary media and document library' },
  { to: '/admin/pricing', label: 'Pricing plans' },
  { to: '/admin/reviews', label: 'Client reviews' },
  { to: '/admin/payments', label: 'Payment proof verification' },
  { to: '/admin/orders', label: 'Orders and delivery workflow' }
];

const tabs = [
  ['control', 'Control Map'],
  ['layout', 'Visibility'],
  ['hero', 'Hero'],
  ['intro_band', 'Intro'],
  ['clients', 'Clients'],
  ['smm_highlight', 'SMM Feature'],
  ['features', 'Features'],
  ['process', 'Process'],
  ['about_trust', 'About Trust'],
  ['cta_band', 'CTA'],
  ['contact', 'Contact']
];

const mergeContent = (remote) => ({
  ...defaultContent,
  ...(remote || {}),
  visibility: { ...defaultContent.visibility, ...(remote?.visibility || {}) },
  hero: { ...defaultContent.hero, ...(remote?.hero || {}) },
  intro_band: { ...defaultContent.intro_band, ...(remote?.intro_band || {}) },
  clients: { ...defaultContent.clients, ...(remote?.clients || {}) },
  smm_highlight: {
    ...defaultContent.smm_highlight,
    ...(remote?.smm_highlight || {}),
    metrics: { ...defaultContent.smm_highlight.metrics, ...(remote?.smm_highlight?.metrics || {}) }
  },
  features: { ...defaultContent.features, ...(remote?.features || {}) },
  process: { ...defaultContent.process, ...(remote?.process || {}) },
  about_trust: { ...defaultContent.about_trust, ...(remote?.about_trust || {}) },
  cta_band: { ...defaultContent.cta_band, ...(remote?.cta_band || {}) },
  contact: { ...defaultContent.contact, ...(remote?.contact || {}) }
});

const ContentManager = () => {
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('control');
  const [uploading, setUploading] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'content'));
        setContent(mergeContent(snap.exists() ? snap.data() : null));
      } catch (err) {
        console.error(err);
        toast.error('Failed to load site content.');
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const visibleCount = useMemo(
    () => Object.values(content.visibility || {}).filter(Boolean).length,
    [content.visibility]
  );

  const updateSection = (section, field, value) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateNested = (section, group, field, value) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [group]: {
          ...(prev[section]?.[group] || {}),
          [field]: value
        }
      }
    }));
  };

  const updateArrayItem = (section, field, index, key, value) => {
    setContent(prev => {
      const arr = [...(prev[section]?.[field] || [])];
      arr[index] = { ...(arr[index] || {}), [key]: value };
      return { ...prev, [section]: { ...prev[section], [field]: arr } };
    });
  };

  const addArrayItem = (section, field, fields) => {
    setContent(prev => {
      const arr = [...(prev[section]?.[field] || [])];
      const nextItem = Object.fromEntries(fields.map(key => [key, '']));
      arr.push(nextItem);
      return { ...prev, [section]: { ...prev[section], [field]: arr } };
    });
  };

  const removeArrayItem = (section, field, index) => {
    setContent(prev => {
      const arr = [...(prev[section]?.[field] || [])];
      arr.splice(index, 1);
      return { ...prev, [section]: { ...prev[section], [field]: arr } };
    });
  };

  const updateCsvArray = (section, field, value) => {
    updateSection(section, field, value.split(',').map(item => item.trim()).filter(Boolean));
  };

  const handleImageUpload = (url, section, field) => updateSection(section, field, url);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'content'), content, { merge: true });
      toast.success('Website content updated.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save website content.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-loading">Loading Site Control...</div>;

  return (
    <div className="admin-content-wrap site-control-page">
      <div className="admin-page-toolbar">
        <div>
          <p className="admin-kicker">Full Website Control</p>
          <h1>Site Control Center</h1>
          <p>Manage homepage copy, visibility, trust visuals, global modules, and route managers from one dashboard.</p>
        </div>
        <div className="admin-toolbar-actions">
          <Link to="/" target="_blank" className="admin-btn-secondary"><Eye size={16} /> Preview Site</Link>
          <button type="button" onClick={handleSave} disabled={saving} className="admin-btn-primary">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="admin-control-summary">
        <SummaryCard icon={<Layout size={18} />} label="Visible sections" value={`${visibleCount}/${Object.keys(content.visibility).length}`} />
        <SummaryCard icon={<Briefcase size={18} />} label="Managed modules" value={String(managerLinks.length)} />
        <SummaryCard icon={<Settings size={18} />} label="Theme" value="Light admin" />
      </div>

      <div className="admin-scroll-tabs" role="tablist" aria-label="Site control tabs">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={activeTab === id}
            className={`admin-tab-btn ${activeTab === id ? 'active' : ''}`}
            onClick={() => setActiveTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="admin-card site-control-card">
        {activeTab === 'control' && (
          <div className="admin-manager-grid">
            {managerLinks.map(link => (
              <Link key={link.to} to={link.to} className="admin-manager-link">
                <span>{link.label}</span>
                <strong>Open</strong>
              </Link>
            ))}
          </div>
        )}

        {activeTab === 'layout' && (
          <div className="admin-toggle-grid">
            {Object.entries(content.visibility).map(([key, value]) => (
              <label key={key} className="admin-toggle-row">
                <span>{key.replaceAll('_', ' ')}</span>
                <input
                  type="checkbox"
                  checked={value !== false}
                  onChange={(e) => updateSection('visibility', key, e.target.checked)}
                />
              </label>
            ))}
          </div>
        )}

        {activeTab === 'hero' && (
          <FieldGroup>
            <CMSField label="Eyebrow" value={content.hero.eyebrow} onChange={(v) => updateSection('hero', 'eyebrow', v)} />
            <CMSField label="Headline HTML" value={content.hero.title} onChange={(v) => updateSection('hero', 'title', v)} textarea />
            <CMSField label="Description" value={content.hero.desc} onChange={(v) => updateSection('hero', 'desc', v)} textarea />
            <TwoCols>
              <CMSField label="Primary Button" value={content.hero.cta1} onChange={(v) => updateSection('hero', 'cta1', v)} />
              <CMSField label="Secondary Button" value={content.hero.cta2} onChange={(v) => updateSection('hero', 'cta2', v)} />
            </TwoCols>
            <ImageUploadField label="Hero Image" value={content.hero.mockup_primary} section="hero" field="mockup_primary" uploading={uploading} onUpload={handleImageUpload} />
          </FieldGroup>
        )}

        {activeTab === 'intro_band' && (
          <FieldGroup>
            <CMSField label="Section Heading" value={content.intro_band.title} onChange={(v) => updateSection('intro_band', 'title', v)} textarea />
            <ArrayEditor section="intro_band" field="pillars" items={content.intro_band.pillars} updateArrayItem={updateArrayItem} addArrayItem={addArrayItem} removeArrayItem={removeArrayItem} fields={['title', 'desc', 'color']} />
          </FieldGroup>
        )}

        {activeTab === 'clients' && (
          <FieldGroup>
            <CMSField label="Trust Label" value={content.clients.label} onChange={(v) => updateSection('clients', 'label', v)} />
            <CMSField label="Client Names (comma separated)" value={content.clients.list} onChange={(v) => updateSection('clients', 'list', v)} textarea />
          </FieldGroup>
        )}

        {activeTab === 'smm_highlight' && (
          <FieldGroup>
            <TwoCols>
              <CMSField label="Eyebrow" value={content.smm_highlight.eyebrow} onChange={(v) => updateSection('smm_highlight', 'eyebrow', v)} />
              <CMSField label="CTA Label" value={content.smm_highlight.cta_label} onChange={(v) => updateSection('smm_highlight', 'cta_label', v)} />
            </TwoCols>
            <CMSField label="Title" value={content.smm_highlight.title} onChange={(v) => updateSection('smm_highlight', 'title', v)} />
            <CMSField label="Lead Copy" value={content.smm_highlight.lead} onChange={(v) => updateSection('smm_highlight', 'lead', v)} textarea />
            <TwoCols>
              <CMSField label="Board Title" value={content.smm_highlight.board_title} onChange={(v) => updateSection('smm_highlight', 'board_title', v)} />
              <CMSField label="Status Badge" value={content.smm_highlight.status} onChange={(v) => updateSection('smm_highlight', 'status', v)} />
            </TwoCols>
            <TwoCols>
              <CMSField label="Metric 1 Value" value={content.smm_highlight.metrics.left_value} onChange={(v) => updateNested('smm_highlight', 'metrics', 'left_value', v)} />
              <CMSField label="Metric 2 Value" value={content.smm_highlight.metrics.right_value} onChange={(v) => updateNested('smm_highlight', 'metrics', 'right_value', v)} />
            </TwoCols>
            <CMSField label="Included Line" value={content.smm_highlight.included} onChange={(v) => updateSection('smm_highlight', 'included', v)} textarea />
            <ArrayEditor section="smm_highlight" field="benefits" items={content.smm_highlight.benefits} updateArrayItem={updateArrayItem} addArrayItem={addArrayItem} removeArrayItem={removeArrayItem} fields={['title', 'desc']} />
          </FieldGroup>
        )}

        {activeTab === 'features' && (
          <FieldGroup>
            <TwoCols>
              <CMSField label="Eyebrow" value={content.features.eyebrow} onChange={(v) => updateSection('features', 'eyebrow', v)} />
              <CMSField label="Visual Title" value={content.features.visual_title} onChange={(v) => updateSection('features', 'visual_title', v)} />
            </TwoCols>
            <CMSField label="Title" value={content.features.title} onChange={(v) => updateSection('features', 'title', v)} />
            <CMSField label="Subtitle" value={content.features.subtitle} onChange={(v) => updateSection('features', 'subtitle', v)} textarea />
            <CMSField label="Badges (comma separated)" value={content.features.badges.join(', ')} onChange={(v) => updateCsvArray('features', 'badges', v)} />
            <ArrayEditor section="features" field="stats" items={content.features.stats} updateArrayItem={updateArrayItem} addArrayItem={addArrayItem} removeArrayItem={removeArrayItem} fields={['value', 'label']} />
            <ArrayEditor section="features" field="items" items={content.features.items} updateArrayItem={updateArrayItem} addArrayItem={addArrayItem} removeArrayItem={removeArrayItem} fields={['title', 'desc']} />
          </FieldGroup>
        )}

        {activeTab === 'process' && (
          <FieldGroup>
            <CMSField label="Eyebrow" value={content.process.eyebrow} onChange={(v) => updateSection('process', 'eyebrow', v)} />
            <CMSField label="Title" value={content.process.title} onChange={(v) => updateSection('process', 'title', v)} />
            <CMSField label="Subtitle" value={content.process.subtitle} onChange={(v) => updateSection('process', 'subtitle', v)} textarea />
            <ArrayEditor section="process" field="steps" items={content.process.steps} updateArrayItem={updateArrayItem} addArrayItem={addArrayItem} removeArrayItem={removeArrayItem} fields={['num', 'title', 'desc']} />
          </FieldGroup>
        )}

        {activeTab === 'about_trust' && (
          <FieldGroup>
            <TwoCols>
              <CMSField label="Eyebrow" value={content.about_trust.eyebrow} onChange={(v) => updateSection('about_trust', 'eyebrow', v)} />
              <CMSField label="CTA Label" value={content.about_trust.cta_label} onChange={(v) => updateSection('about_trust', 'cta_label', v)} />
            </TwoCols>
            <CMSField label="Title" value={content.about_trust.title} onChange={(v) => updateSection('about_trust', 'title', v)} />
            <CMSField label="Subtitle" value={content.about_trust.subtitle} onChange={(v) => updateSection('about_trust', 'subtitle', v)} textarea />
            <CMSField label="Our Approach Quote" value={content.about_trust.ceo_quote} onChange={(v) => updateSection('about_trust', 'ceo_quote', v)} textarea />
            <CMSField label="Team Roles (comma separated)" value={content.about_trust.team_roles.join(', ')} onChange={(v) => updateCsvArray('about_trust', 'team_roles', v)} />
            <ArrayEditor section="about_trust" field="stats" items={content.about_trust.stats} updateArrayItem={updateArrayItem} addArrayItem={addArrayItem} removeArrayItem={removeArrayItem} fields={['value', 'label']} />
          </FieldGroup>
        )}

        {activeTab === 'cta_band' && (
          <FieldGroup>
            <CMSField label="Eyebrow" value={content.cta_band.eyebrow} onChange={(v) => updateSection('cta_band', 'eyebrow', v)} />
            <CMSField label="Title" value={content.cta_band.title} onChange={(v) => updateSection('cta_band', 'title', v)} />
            <CMSField label="Subtitle" value={content.cta_band.subtitle} onChange={(v) => updateSection('cta_band', 'subtitle', v)} textarea />
            <TwoCols>
              <CMSField label="Primary Button" value={content.cta_band.primary_btn} onChange={(v) => updateSection('cta_band', 'primary_btn', v)} />
              <CMSField label="Primary Link" value={content.cta_band.primary_link} onChange={(v) => updateSection('cta_band', 'primary_link', v)} />
            </TwoCols>
            <TwoCols>
              <CMSField label="Secondary Button" value={content.cta_band.secondary_btn} onChange={(v) => updateSection('cta_band', 'secondary_btn', v)} />
              <CMSField label="Secondary Link" value={content.cta_band.secondary_link} onChange={(v) => updateSection('cta_band', 'secondary_link', v)} />
            </TwoCols>
          </FieldGroup>
        )}

        {activeTab === 'contact' && (
          <FieldGroup>
            <CMSField label="Heading" value={content.contact.heading} onChange={(v) => updateSection('contact', 'heading', v)} />
            <CMSField label="Subtext" value={content.contact.sub} onChange={(v) => updateSection('contact', 'sub', v)} textarea />
            <TwoCols>
              <CMSField label="Public Location" value={content.contact.address} onChange={(v) => updateSection('contact', 'address', v)} />
              <CMSField label="Working Hours" value={content.contact.working_hours} onChange={(v) => updateSection('contact', 'working_hours', v)} />
            </TwoCols>
            <ImageUploadField label="Contact/Office Image" value={content.contact.office_image} section="contact" field="office_image" uploading={uploading} onUpload={handleImageUpload} />
          </FieldGroup>
        )}
      </div>

      <div className="admin-sticky-save">
        <button type="button" onClick={handleSave} disabled={saving} className="admin-btn-primary">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'Saving...' : 'Publish Site Content'}
        </button>
      </div>
    </div>
  );
};

const SummaryCard = ({ icon, label, value }) => (
  <div className="admin-summary-card">
    <span>{icon}</span>
    <div>
      <strong>{value}</strong>
      <small>{label}</small>
    </div>
  </div>
);

const FieldGroup = ({ children }) => <div className="admin-field-stack">{children}</div>;
const TwoCols = ({ children }) => <div className="admin-two-cols">{children}</div>;
const ImageGrid = ({ children }) => <div className="admin-image-grid">{children}</div>;

const CMSField = ({ label, value, onChange, textarea = false }) => (
  <label className="admin-field">
    <span>{label}</span>
    {textarea ? (
      <textarea className="admin-input" rows={4} value={value || ''} onChange={(e) => onChange(e.target.value)} />
    ) : (
      <input className="admin-input" type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} />
    )}
  </label>
);

const ArrayEditor = ({ section, field, items = [], fields, updateArrayItem, addArrayItem, removeArrayItem }) => (
  <div className="admin-array-editor">
    <div className="admin-array-head">
      <div className="admin-array-title">{field.replaceAll('_', ' ')}</div>
      <button type="button" className="admin-mini-btn" onClick={() => addArrayItem(section, field, fields)}>Add</button>
    </div>
    {items.map((item, index) => (
      <div className="admin-array-card" key={`${section}-${field}-${index}`}>
        <div className="admin-array-index">
          <strong>{String(index + 1).padStart(2, '0')}</strong>
          <button type="button" onClick={() => removeArrayItem(section, field, index)} aria-label={`Remove ${field} ${index + 1}`}>Delete</button>
        </div>
        <div className="admin-two-cols">
          {fields.map(key => (
            <CMSField
              key={key}
              label={key}
              value={item?.[key] || ''}
              onChange={(value) => updateArrayItem(section, field, index, key, value)}
              textarea={key === 'desc'}
            />
          ))}
        </div>
      </div>
    ))}
  </div>
);

const ImageUploadField = ({ label, value, section, field, onUpload }) => (
  <MediaUploader label={label} value={value} accept="image/*" folder={`creatifybd/content/${section}`} helperText="Drag and drop, browse, or paste an image link." onChange={(url) => onUpload(url, section, field)} />
);

export default ContentManager;
