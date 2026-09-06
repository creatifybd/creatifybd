/**
 * sync-with-token.mjs
 * Uses the Firebase CLI's OAuth refresh token to get a fresh access token,
 * then uses the Firestore REST API directly to update documents.
 * This bypasses App Check entirely since it uses Google OAuth (not client SDK).
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import os from 'os';

// ── Config ─────────────────────────────────────────────────────────
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

// ── Local Portfolio Data ───────────────────────────────────────────
const base = '/assets/portfolio';
const descriptions = {
  social: 'A complete social media management concept with content pillars, branded post systems, visual direction, and performance-ready presentation for international audiences.',
  branding: 'A polished brand identity system covering logo direction, typography, color palette, collateral, product mockups, and launch-ready visual assets.',
  marketing: 'A digital marketing campaign board showing channel strategy, funnel planning, performance metrics, landing visuals, and conversion-focused creative direction.',
  video: 'A video production and editing concept with campaign frames, thumbnail direction, motion storyboards, platform formats, and polished launch presentation.',
  web: 'A responsive website design concept with desktop and mobile layouts, conversion sections, content hierarchy, and premium visual design.',
  packaging: 'A production-ready packaging concept combining shelf impact, clear hierarchy, premium mockups, and a cohesive visual system across every product touchpoint.',
  apparel: 'A complete apparel graphic concept with original artwork, garment mockups, print placement, supporting brand details, and retail-ready presentation.'
};
const serviceLabels = { social:'Social Media Management', branding:'Branding & Logo Design', marketing:'Digital Marketing', video:'Video Editing', web:'Website Design', packaging:'Product Packaging Design', apparel:'T-Shirt Design' };
const folderByCategory = { social:'social-media-management', branding:'logo-design-branding', marketing:'digital-marketing', video:'video-editing', web:'website-design', packaging:'product-packaging-design', apparel:'t-shirt-design' };
const tagsByCategory = { social:['social media manager','content calendar','brand content','instagram marketing'], branding:['logo design','brand identity','visual identity','brand guidelines'], marketing:['digital marketing','performance marketing','lead generation','campaign strategy'], video:['video editing','promo video','short-form video','motion creative'], web:['website design','landing page','responsive UI','conversion design'], packaging:['packaging design','product branding','label design','retail packaging'], apparel:['t-shirt design','apparel graphics','merchandise design','print design'] };

const makeItems = (cat, titles, industries = []) => {
  const folder = folderByCategory[cat];
  return titles.map((title, i) => {
    const num = String(i+1).padStart(2,'0');
    const service = serviceLabels[cat];
    const industry = industries[i] || 'Brand growth';
    return { id:`${folder}-${num}`, title, category:cat, service, industry,
      image:`${base}/${folder}/${folder}-${num}.jpg`,
      description:`${descriptions[cat]} Focus: ${industry.toLowerCase()}.`,
      seoTitle:`${title} | ${service} Portfolio | CreatifyBD`,
      seoDescription:`${title} by CreatifyBD, a premium ${service.toLowerCase()} portfolio project for ambitious global brands.`,
      tags:tagsByCategory[cat] };
  });
};

const CURATED_PORTFOLIO = [
  ...makeItems('marketing',['Beauty Brand Digital Growth Campaign','Demand Generation System for SaaS','Property Sales Digital Marketing Campaign','Restaurant Local Growth Campaign','Education Enrollment Marketing Funnel','Fitness Performance Marketing Dashboard','Travel Booking Digital Campaign','Healthcare Lead Generation System','Fintech Product Growth Campaign','Fashion Brand Digital Growth Plan'],['Beauty and skincare','SaaS demand generation','Real estate sales','Restaurant marketing','Education enrollment','Fitness performance','Travel bookings','Healthcare leads','Fintech growth','Fashion ecommerce']),
  ...makeItems('branding',['Aurevia Skincare Brand Identity','NexoPay Fintech Brand System','Brasa Fire Restaurant Identity','Harbor & Pine Hospitality Branding','Petello Pet Care Brand Identity','Arbora Sustainable Home Brand','Vetro Atelier Interior Studio Identity','PulsePeak Performance Brand Kit','Bloom Floral Boutique Identity','NovaGrid SaaS Identity System','Solenne Luxury Fashion Identity','Verdura Natural Goods Branding','SentriCore Cybersecurity Brand System','Crumb & Hearth Bakery Branding','BrightNest Education Brand Kit','NorthVale Real Estate Identity','Lunora Wellness Brand System','Atlas Ascent Travel Brand Identity','Roast Harbor Coffee Identity','Avenlo Lifestyle Retail Branding','Veloura Spa Brand Identity','Fluxora Tech Product Identity','MaxCrest Property Brand System','Veridra Luxury Retreat Branding','Lisselle Beauty Brand Identity','NextBloom Education Platform Branding','Stonecrest Architecture Identity','PureNest Dental Wellness Brand','HelioGrid Solar Energy Brand','Hartwell Hospitality Identity','Savora Restaurant Brand System','Finexa Finance App Brand Kit','PureSet Dental Brand System','Monvero Real Estate Brand Identity','Aurelix Beauty Packaging System','Stonecove Property Brand Identity','Hartwell Hotel Experience Branding','TalentBridge Hiring Platform Branding','HelioCore Energy Brand System','Verdora Estate Retreat Branding','Premium Logo Identity Collection'],['Skincare','Fintech','Restaurant','Hospitality','Pet care','Sustainable retail','Interior design','Fitness','Floral retail','SaaS','Fashion','Natural products','Cybersecurity','Bakery','Education','Real estate','Wellness','Travel','Coffee','Lifestyle retail','Spa','Technology','Property','Luxury retreat','Beauty','Education technology','Architecture','Dental care','Solar energy','Hotel','Restaurant','Finance','Dental wellness','Real estate','Beauty packaging','Property','Hospitality','Recruitment','Energy','Luxury estate','Multi-industry brand identity']),
  ...makeItems('packaging',['Monterra Premium Coffee Packaging','Lumiere Skincare Packaging System','Avelena Herbal Tea Packaging','Voltix Energy Drink Packaging','Nourish Granola Packaging System','Pureva Laundry Care Packaging','Velora Luxury Chocolate Packaging','Aromica Artisan Spice Collection','Northpaw Premium Pet Food Packaging','Vitalis Omega-3 Supplement Packaging','Elan Botanique Skincare Packaging','Roast Vale Coffee Packaging System','Verdelune Tea House Packaging','Golden Hive Honey Packaging','PureNest Laundry Care Packaging','VoltRush Energy Drink Packaging','Little Bloom Baby Care Packaging','Pawshire Select Pet Food Packaging','Spice Atelier Culinary Packaging','Noir Solace Home Fragrance Packaging','Golden Vale Artisan Honey Packaging','Noir Reserve Grooming Packaging','SoftNest Baby Care Packaging','Casa Verde Artisan Pasta Packaging','Elan Noir Luxury Fragrance Packaging','BioSip Probiotic Drink Packaging','EcoDrop Sustainable Home Care Packaging','CraveCraft Gourmet Snack Packaging','Frostella Artisan Ice Cream Packaging','HerbaCore Botanical Supplement Packaging'],['Coffee','Skincare','Herbal tea','Energy drinks','Healthy food','Laundry care','Confectionery','Spices','Pet care','Supplements','Botanical skincare','Coffee','Tea','Honey','Laundry care','Energy drinks','Baby care','Pet care','Culinary spices','Home fragrance','Honey','Men grooming','Baby care','Pasta','Fragrance','Functional beverages','Home care','Snacks','Ice cream','Supplements']),
  ...makeItems('apparel',['Urban Echo Streetwear T-Shirt Design','Iron Pulse Performance Apparel Design','Azure Coast Resort T-Shirt Design','Bright Cub Kids T-Shirt Design','Terra Thread Sustainable Apparel Design','Roast Ritual Cafe Merchandise Design','Neon Valley Festival T-Shirt Design','Mono Line Minimal Apparel Design','Summit Trail Adventure T-Shirt Design','Northbridge Club Collegiate Apparel','Chase the Night Streetwear Design','Infinite Vision Minimal T-Shirt Design','Open Road Adventure Apparel Design','Push Beyond Athletic T-Shirt Design','Bloom Botanical T-Shirt Design','Iron Ashes Band Merchandise Design','Rooted in Nature Outdoor Apparel','Altura Coffee Club Merchandise Design','Relentless Esports T-Shirt Design','Build Next Corporate T-Shirt Design'],['Streetwear','Fitness','Resort merchandise','Kids apparel','Sustainable fashion','Cafe merchandise','Festival merchandise','Minimal fashion','Outdoor lifestyle','Collegiate apparel','Streetwear','Minimal fashion','Travel lifestyle','Athletic wear','Lifestyle fashion','Music merchandise','Outdoor lifestyle','Cafe merchandise','Esports','Corporate apparel']),
  ...makeItems('social',['Atlas Ascent Travel Social Media System','Lunora Wellness Content Calendar','Roast Harbor Coffee Community Campaign','Avenlo Fashion Social Media Management','BrightNest Education Social Growth Kit','NorthVale Real Estate Social Campaign','SentriCore Cybersecurity Content Plan','Crumb & Hearth Bakery Content Calendar','Solenne Luxury Fashion Social Presence','Verdura Natural Product Social Kit'],['Travel','Wellness','Coffee','Fashion','Education','Real estate','Cybersecurity','Bakery','Luxury fashion','Natural products']),
  ...makeItems('video',['SaaS Product Launch Motion Campaign','Cinematic Real Estate Walkthrough Series','Ember Table Restaurant Storytelling Video','Veloura Skin Beauty Video Campaign','Atlas Drift Journey Video Series','Iron Pulse Fitness Promo Edits','Noir Avenue Fashion Editorial Video','SparkBloom Kids Explainer Campaign','Signal Room Podcast Video System','Vanta Velocity Automotive Promo'],['SaaS','Real estate','Restaurant','Beauty','Travel','Fitness','Fashion','Children education','Podcast','Automotive']),
  ...makeItems('web',['NovaNest Interior Design Website','Finexa Finance Growth Dashboard','Solara Skin Ecommerce Website','Eduvora Learning Platform UI','Tripora Travel Booking Website','Lexford & Co Legal Website','Savora Restaurant Website','UrbanAxis Real Estate Website','GreenGrid Solar Landing Page','Mediora Dental Clinic Website'],['Interior design','Finance','Skincare ecommerce','Education','Travel booking','Legal services','Restaurant','Real estate','Solar energy','Dental care'])
];

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

// Get fresh access token from refresh token
async function getAccessToken() {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    refresh_token: REFRESH_TOKEN
  }).toString();

  const res = await httpRequest({
    hostname: 'oauth2.googleapis.com',
    path: '/token',
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(body) }
  }, body);

  if (!res.body.access_token) throw new Error('Failed to get access token: ' + JSON.stringify(res.body));
  return res.body.access_token;
}

// Read all portfolio documents from Firestore REST API
async function readPortfolio(token) {
  const res = await httpRequest({
    hostname: 'firestore.googleapis.com',
    path: `/v1/projects/${PROJECT_ID}/databases/(default)/documents/portfolio?pageSize=500`,
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.body.documents || [];
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

// Write a single document via REST API (PATCH = set/overwrite)
async function writeDocument(token, docId, data) {
  const fields = {};
  Object.entries(data).forEach(([k, v]) => { fields[k] = jsToFs(v); });

  const body = JSON.stringify({ fields });
  const fieldMask = Object.keys(data).join(',');

  const res = await httpRequest({
    hostname: 'firestore.googleapis.com',
    path: `/v1/projects/${PROJECT_ID}/databases/(default)/documents/portfolio/${docId}?updateMask.fieldPaths=${Object.keys(data).join('&updateMask.fieldPaths=')}`,
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body)
    }
  }, body);

  if (res.status >= 400) throw new Error(`Write failed for ${docId}: ${JSON.stringify(res.body)}`);
  return res.body;
}

// ── Main ───────────────────────────────────────────────────────────
async function main() {
  console.log('\n🔥 CreatifyBD — Firestore REST API Sync');
  console.log('=========================================');

  const token = ACCESS_TOKEN;
  console.log('✅ Using existing Firebase CLI access token\n');


  console.log('📖 Reading existing portfolio from Firestore...');
  const docs = await readPortfolio(token);
  console.log(`   Found ${docs.length} existing documents\n`);

  // Build map of existing imageUrl + hidden per doc ID
  const existing = new Map();
  docs.forEach(doc => {
    const id = doc.name.split('/').pop();
    const fields = doc.fields || {};
    existing.set(id, {
      imageUrl: fsToJs(fields.imageUrl) || fsToJs(fields.image) || null,
      hidden: fsToJs(fields.hidden) ?? false
    });
  });

  console.log(`📝 Writing ${CURATED_PORTFOLIO.length} portfolio items to Firestore...`);
  let success = 0, failed = 0;

  for (const item of CURATED_PORTFOLIO) {
    const prev = existing.get(item.id);
    const data = {
      title: item.title,
      description: item.description,
      category: item.category,
      service: item.service,
      industry: item.industry,
      seoTitle: item.seoTitle,
      seoDescription: item.seoDescription,
      isCurated: true,
      imageUrl: prev?.imageUrl || item.image,
      hidden: prev?.hidden ?? false,
      updatedAt: new Date().toISOString()
    };

    try {
      await writeDocument(token, item.id, data);
      success++;
      if (success % 10 === 0) console.log(`   Progress: ${success}/${CURATED_PORTFOLIO.length}`);
    } catch (err) {
      console.error(`   ❌ Failed ${item.id}: ${err.message}`);
      failed++;
    }

    // Small delay to avoid rate limits
    await new Promise(r => setTimeout(r, 50));
  }

  console.log(`\n✅ Sync complete!`);
  console.log(`   Success: ${success} | Failed: ${failed}`);
  console.log('   Old Firestore text data replaced with latest local data.');
  console.log('   ImageUrls and hidden status preserved.\n');
}

main().catch(err => { console.error('❌ Failed:', err.message); process.exit(1); });
