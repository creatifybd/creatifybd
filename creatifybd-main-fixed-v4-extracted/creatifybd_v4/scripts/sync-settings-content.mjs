/**
 * sync-settings-content.mjs
 * 
 * Script to clean and update the settings/content document in Firestore.
 * - Reads current settings/content
 * - Preserves all image URLs and CEO name (MD ALAMIN ALI)
 * - Updates all other text fields to match local defaults
 * - Uses the access token from Firebase CLI.
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import os from 'os';

const PROJECT_ID = 'creatify-bd';

// Dynamically extract the token from firebase-tools.json config store
let ACCESS_TOKEN = '';
try {
  const configPath = path.join(os.homedir(), '.config/configstore/firebase-tools.json');
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    ACCESS_TOKEN = config.tokens?.access_token || '';
  }
} catch (err) {
  console.error('Warning: Could not read local firebase-tools config:', err.message);
}


// ── Default Content Structure from ContentManager.jsx ─────────────
const defaultContent = {
  visibility: {
    hero: true,
    intro_band: true,
    clients: true,
    smm_highlight: true,
    services: true,
    features: true,
    about_trust: true,
    portfolio: true,
    case_studies: true,
    process: true,
    pricing: true,
    testimonials: true,
    cta_band: true,
    contact: true
  },
  hero: {
    eyebrow: 'Trusted Global Creative Partner',
    title: 'Elite Creative Operations For Global Brands',
    desc: 'Get dedicated senior-level social media management, brand design, video editing, and website creation. Premium agency-grade execution delivered at up to 50% lower cost than traditional market markup.',
    cta1: 'View Our Work',
    cta2: 'Get a Free Proposal',
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
    lead: 'A dedicated creative workflow for brands that need consistent, polished social media without hiring a full in-house team.',
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
    title: 'A specialist creative team serving global brands',
    subtitle: 'CreatifyBD is built for founders and lean marketing teams who need dependable creative execution without the cost or complexity of a full in-house department.',
    ceo_name: 'MD ALAMIN ALI',
    ceo_role: 'Founder & CEO',
    ceo_quote: 'Our responsibility is simple: make every brand look credible, consistent, and ready for international customers.',
    ceo_image: '',
    cta_label: 'Read Our Story',
    office_image: '',
    office_caption: 'Remote-ready creative operations for international clients',
    team_image: '',
    team_caption: 'Team production sprint',
    meeting_image: '',
    meeting_caption: 'Online client review',
    team_heading: 'Specialist delivery model',
    team_roles: ['Social strategist', 'Graphic designer', 'Video editor', 'Web designer', 'Client success'],
    stats: [
      { value: 'No', label: 'Long-term lock-in' },
      { value: '24h', label: 'Typical response' },
      { value: '100%', label: 'Scope clarity' }
    ]
  },
  cta_band: {
    eyebrow: 'Ready when you are',
    title: 'Need a reliable creative team for your next month of content?',
    subtitle: 'Tell us about your business and we will recommend the right package, timeline, and first deliverables.',
    primary_btn: 'Start a Project',
    primary_link: '/contact',
    secondary_btn: '+880 1951 676600',
    secondary_link: 'tel:+8801951676600'
  },
  contact: {
    heading: "Let's build something great.",
    sub: 'Tell us about your brand, target market, and the kind of creative support you need.'
  }
};

// ── HTTP helpers ───────────────────────────────────────────────────
function httpRequest(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data || '{}') }));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

// Convert Firestore value format to JS value
function fsToJs(val) {
  if (!val) return null;
  if (val.stringValue !== undefined) return val.stringValue;
  if (val.booleanValue !== undefined) return val.booleanValue;
  if (val.integerValue !== undefined) return parseInt(val.integerValue);
  if (val.arrayValue) return (val.arrayValue.values || []).map(fsToJs);
  if (val.mapValue) { const o = {}; Object.entries(val.mapValue.fields || {}).forEach(([k,v]) => o[k] = fsToJs(v)); return o; }
  return null;
}

// Convert JS value to Firestore value format
function jsToFs(val) {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === 'string') return { stringValue: val };
  if (typeof val === 'boolean') return { booleanValue: val };
  if (typeof val === 'number') return { integerValue: String(val) };
  if (Array.isArray(val)) return { arrayValue: { values: val.map(jsToFs) } };
  if (typeof val === 'object') { const fields = {}; Object.entries(val).forEach(([k,v]) => fields[k] = jsToFs(v)); return { mapValue: { fields } }; }
  return { stringValue: String(val) };
}

async function main() {
  console.log('\n🔥 CreatifyBD — Firestore settings/content Sync');
  console.log('==============================================');

  console.log('📖 Fetching current settings/content from Firestore...');
  const res = await httpRequest({
    hostname: 'firestore.googleapis.com',
    path: `/v1/projects/${PROJECT_ID}/databases/(default)/documents/settings/content`,
    method: 'GET',
    headers: { Authorization: `Bearer ${ACCESS_TOKEN}` }
  });

  if (res.status >= 400) {
    console.error('❌ Failed to fetch current document:', JSON.stringify(res.body));
    process.exit(1);
  }

  const existingFields = res.body.fields || {};
  const existing = {};
  Object.entries(existingFields).forEach(([k, v]) => { existing[k] = fsToJs(v); });

  console.log('✅ Fetched existing content');

  // Merging and preserving image URLs & CEO name from Firestore:
  const payload = { ...defaultContent };

  // 1. Preserve hero mockup
  payload.hero.mockup_primary = existing.hero?.mockup_primary || '';

  // 2. Preserve about_trust images & CEO info
  payload.about_trust.ceo_image = existing.about_trust?.ceo_image || '';
  payload.about_trust.office_image = existing.about_trust?.office_image || '';
  payload.about_trust.team_image = existing.about_trust?.team_image || '';
  payload.about_trust.meeting_image = existing.about_trust?.meeting_image || '';
  payload.about_trust.ceo_name = existing.about_trust?.ceo_name || 'MD ALAMIN ALI';
  payload.about_trust.ceo_role = existing.about_trust?.ceo_role || 'Founder & CEO';
  payload.about_trust.ceo_quote = existing.about_trust?.ceo_quote || 'Our responsibility is simple: make every brand look credible, consistent, and ready for international customers.';

  // 3. Preserve CTA bg
  payload.cta_band.cta_bg = existing.cta_band?.cta_bg || '';

  console.log('📝 Writing merged data back to settings/content in Firestore...');

  const fields = {};
  Object.entries(payload).forEach(([k, v]) => { fields[k] = jsToFs(v); });
  const body = JSON.stringify({ fields });

  const writeRes = await httpRequest({
    hostname: 'firestore.googleapis.com',
    path: `/v1/projects/${PROJECT_ID}/databases/(default)/documents/settings/content`,
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body)
    }
  }, body);

  if (writeRes.status >= 400) {
    console.error('❌ Write failed:', JSON.stringify(writeRes.body));
    process.exit(1);
  }

  console.log('✅ settings/content successfully updated in Firestore!');
  console.log('   All old text configurations removed, images preserved.');
  console.log('   Now the hero section text matches local defaults precisely.\n');
  process.exit(0);
}

main().catch(err => { console.error('❌ Failed:', err.message); process.exit(1); });
