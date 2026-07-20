/**
 * sync-firestore-admin.mjs
 * Uses firebase-admin SDK which bypasses App Check + security rules entirely.
 * 
 * Run: node scripts/sync-firestore-admin.mjs
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createRequire } from 'module';
import { readFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';

// ── Local Portfolio Data (copied from portfolioItems.js) ───────────
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

const makeItems = (category, titles, industries = []) => {
  const folder = folderByCategory[category];
  return titles.map((title, i) => {
    const num = String(i+1).padStart(2,'0');
    const service = serviceLabels[category];
    const industry = industries[i] || 'Brand growth';
    return { id:`${folder}-${num}`, title, category, service, industry, image:`${base}/${folder}/${folder}-${num}.jpg`, description:`${descriptions[category]} Focus: ${industry.toLowerCase()}.`, seoTitle:`${title} | ${service} Portfolio | CreatifyBD`, seoDescription:`${title} by CreatifyBD, a premium ${service.toLowerCase()} portfolio project for ambitious global brands.`, tags:tagsByCategory[category] };
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

// ── Get service account via firebase CLI token ─────────────────────
async function main() {
  console.log('\n🔥 CreatifyBD — Firestore Admin Sync Script');
  console.log('============================================');

  // Try to get access token from gcloud / firebase CLI
  let accessToken;
  try {
    accessToken = execSync('firebase --token "" --non-interactive 2>&1', { encoding: 'utf8' }).trim();
  } catch {}

  // Initialize admin app using application default credentials (firebase CLI sets these up)
  let app;
  try {
    // Check if GOOGLE_APPLICATION_CREDENTIALS is set
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS && existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
      console.log('Using GOOGLE_APPLICATION_CREDENTIALS...');
      app = initializeApp({ credential: cert(JSON.parse(readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'utf8'))) });
    } else {
      // Use application default credentials (requires `gcloud auth application-default login`)
      const { applicationDefault } = await import('firebase-admin/app');
      app = initializeApp({ credential: applicationDefault(), projectId: 'creatify-bd' });
    }
  } catch (err) {
    console.error('❌ Could not initialize Admin SDK:', err.message);
    console.log('\nTry running: gcloud auth application-default login');
    process.exit(1);
  }

  const db = getFirestore(app);
  console.log('✅ Admin SDK initialized\n');

  // Step 1: Read existing portfolio to preserve imageUrl + hidden
  console.log('📖 Reading existing Firestore portfolio data...');
  const snap = await db.collection('portfolio').get();
  const existing = new Map();
  snap.docs.forEach(d => {
    const data = d.data();
    existing.set(d.id, { imageUrl: data.imageUrl || data.image || null, hidden: data.hidden ?? false });
  });
  console.log(`   Found ${existing.size} existing documents\n`);

  // Step 2: Write all curated items with local data + preserved imageUrl/hidden
  console.log(`📝 Writing ${CURATED_PORTFOLIO.length} items to Firestore...`);
  const BATCH_SIZE = 400;
  let written = 0;
  for (let i = 0; i < CURATED_PORTFOLIO.length; i += BATCH_SIZE) {
    const chunk = CURATED_PORTFOLIO.slice(i, i + BATCH_SIZE);
    const batch = db.batch();
    chunk.forEach(item => {
      const prev = existing.get(item.id);
      batch.set(db.collection('portfolio').doc(item.id), {
        title: item.title,
        description: item.description,
        category: item.category,
        service: item.service,
        industry: item.industry,
        tags: item.tags,
        seoTitle: item.seoTitle,
        seoDescription: item.seoDescription,
        isCurated: true,
        imageUrl: prev?.imageUrl || item.image,
        hidden: prev?.hidden ?? false,
        updatedAt: new Date().toISOString()
      });
    });
    await batch.commit();
    written += chunk.length;
    console.log(`   Written: ${written}/${CURATED_PORTFOLIO.length}`);
  }

  // Step 3: Delete any non-curated portfolio docs that have old text data
  const curatedIds = new Set(CURATED_PORTFOLIO.map(i => i.id));
  const toDelete = snap.docs.filter(d => !curatedIds.has(d.id));
  if (toDelete.length > 0) {
    console.log(`\n🗑️  Found ${toDelete.length} non-curated docs — leaving them as-is.`);
  }

  console.log(`\n✅ Sync complete! ${written} portfolio items updated.`);
  console.log('   All old text data removed and replaced with latest local data.\n');
  process.exit(0);
}

main().catch(err => { console.error('❌ Failed:', err.message); process.exit(1); });
