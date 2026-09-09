import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { assertRelease, normalizeLegacyContent } from '../src/data/releaseSchema.js';

const args = process.argv.slice(2);
const command = args[0] || 'validate';
const option = name => args[args.indexOf(name) + 1];
const source = args.includes('--file') ? option('--file') : 'src/data/publishedRelease.json';
const release = assertRelease(JSON.parse(await fs.readFile(source, 'utf8')));
const stable = value => Array.isArray(value) ? value.map(stable) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])])) : value;
const encode = value => JSON.stringify(stable(value));
const checksum = createHash('sha256').update(encode(release)).digest('hex');

async function checkAssets() {
  for (const url of [release.site.logo_url, ...release.services.map(s => s.image), ...release.portfolio.flatMap(p => [p.image, p.thumbnail, ...(p.srcSet || '').split(',').map(candidate => candidate.trim().split(' ')[0])].filter(Boolean))]) {
    if (url.startsWith('/')) await fs.access(path.join('public', url.slice(1)));
  }
}
await checkAssets();
if (command === 'validate') {
  console.log(`Valid release ${release.id}: ${release.services.length} services, ${release.offers.length} offers, ${release.portfolio.length} portfolio items.`);
  process.exit(0);
}

// Never discover credentials from CLI caches or source files. The operator/CI
// supplies an authenticated service account explicitly through protected env.
const emulator = args.includes('--emulator');
if (emulator && process.env.FIRESTORE_EMULATOR_HOST !== '127.0.0.1:8080') throw new Error('Emulator mode only supports the checked-in local demo emulator.');
if (!emulator && process.env.FIRESTORE_EMULATOR_HOST) throw new Error('Unset FIRESTORE_EMULATOR_HOST for production, or explicitly use --emulator for local demo tests.');
if (!emulator && !process.env.FIREBASE_SERVICE_ACCOUNT_JSON && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  throw new Error('Authenticated Firebase access is not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON or GOOGLE_APPLICATION_CREDENTIALS in the protected deployment environment. No database changes were made.');
}
const { initializeApp, applicationDefault, cert } = await import('firebase-admin/app');
const { getFirestore, FieldValue } = await import('firebase-admin/firestore');
const projectId = emulator ? 'demo-creatifybd' : 'creatify-bd';
let credential;
if (emulator) {
  console.log('LOCAL DEMO EMULATOR: no production credential or deployment is used.');
} else if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  const account = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  if (account.project_id !== projectId) throw new Error('Service account belongs to a different Firebase project.');
  credential = cert(account);
} else {
  const account = JSON.parse(await fs.readFile(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'utf8'));
  if (account.project_id && account.project_id !== projectId) throw new Error('Credential belongs to a different Firebase project.');
  credential = applicationDefault();
}
initializeApp({ projectId, ...(credential ? { credential } : {}) });
const db = getFirestore();
const releaseRef = db.doc(`site_releases/${release.id}`);

async function verifyLiveRelease(id) {
  if (emulator) return; // Explicit localhost/demo-only integration tests above.
  const { PUBLIC_ROUTES } = await import('./public-routes.mjs');
  for (let offset = 0; offset < PUBLIC_ROUTES.length; offset += 4) {
    await Promise.all(PUBLIC_ROUTES.slice(offset, offset + 4).map(async route => {
      const response = await fetch(`https://creatifybd.com${route}?content_check=${encodeURIComponent(id)}-${Date.now()}`, { cache: 'no-store', signal: AbortSignal.timeout(20000) });
      if (!response.ok || !(await response.text()).includes(`name="content-release" content="${id}"`)) throw new Error(`Hostinger is not serving release ${id} at ${route}. No activation performed.`);
    }));
  }
}

if (command === 'prepare') {
  await db.runTransaction(async tx => {
    const existing = await tx.get(releaseRef);
    if (existing.exists) {
      if (existing.data().checksum !== checksum) throw new Error('This release ID already has different content. Create a new release ID.');
      return;
    }
    tx.create(releaseRef, { snapshot: release, checksum, preparedAt: FieldValue.serverTimestamp() });
  });
  console.log(`Immutable release ${release.id} prepared. Existing content is unchanged.`);
  process.exit(0);
}

if (command === 'export-draft') {
  if (!args.includes('--id') || !args.includes('--out')) throw new Error('export-draft requires --id and --out; inspect and commit the exported release before deployment.');
  const next = structuredClone(release);
  const siteDraft = await db.doc('settings/site').get();
  if (siteDraft.exists) for (const key of Object.keys(next.site)) {
    if (siteDraft.data()[key] !== undefined) next.site[key] = siteDraft.data()[key];
  }
  const draft = await db.doc('settings/content_draft').get();
  if (draft.exists) {
    if (draft.data().baseReleaseId !== release.id) throw new Error('Draft belongs to a different base release. Resolve the draft before exporting.');
    next.content = normalizeLegacyContent(draft.data().content);
  }
  // These are editable CMS drafts. Only the established service/offer IDs can
  // change; new service categories need an intentional code/schema change.
  for (const service of next.services) {
    const document = await db.doc(`services/${service.id}`).get();
    if (document.exists) {
      const data = document.data();
      if (data.hidden) throw new Error(`Core service ${service.id} is hidden; review navigation before publishing.`);
      Object.assign(service, { title: data.title, description: data.desc || data.description, image: data.imageUrl || data.image, detail: data.detail || service.detail, deliverables: data.deliverables || service.deliverables });
    } else throw new Error(`Required service draft ${service.id} is missing. Restore it or review the service structure before publication.`);
  }
  for (const offer of next.offers) {
    const document = await db.doc(`pricing/${offer.id}`).get();
    if (document.exists) {
      const data = document.data();
      if (data.hidden) throw new Error(`Offer ${offer.id} is hidden; three offers are required.`);
      Object.assign(offer, { name: data.tier || data.name, amountBDT: Number(data.rawPrice ?? data.amountBDT), audience: data.desc || data.audience, features: data.features, posters: Number(data.posters), videos: Number(data.videos), platforms: Number(data.platforms) });
    } else throw new Error(`Required pricing draft ${offer.id} is missing. Restore it before publication.`);
  }
  const portfolio = await db.collection('portfolio').get();
  if (!portfolio.empty) next.portfolio = portfolio.docs.filter(d => d.data().hidden !== true && d.data().published !== false).map(document => {
    const data = document.data();
    const item = { id: document.id, title: data.title, category: data.category, industry: data.industry || '', description: data.description || '', image: data.imageUrl || data.image, workType: data.workType || 'sample', published: true };
    if (data.thumbnail && item.image === data.image) { item.thumbnail = data.thumbnail; if (data.srcSet) item.srcSet = data.srcSet; }
    if (data.featured === true && Number.isInteger(data.featuredOrder)) item.featuredOrder = data.featuredOrder;
    if (data.clientPermission === true) item.clientPermission = true;
    return item;
  });
  next.id = option('--id');
  next.contentVersion = Date.now();
  const reviewDocs = await db.collection('reviews').get();
  next.reviews = reviewDocs.docs.filter(doc => doc.data().status === 'approved' && doc.data().sourceUrl).map(doc => {
    const review = doc.data();
    return { id: doc.id, clientName: review.clientName, reviewText: review.reviewText, sourceUrl: review.sourceUrl, published: true, company: review.company || '' };
  });
  const teamDocs = await db.collection('team_members').get();
  next.team = teamDocs.docs.filter(doc => doc.data().hidden !== true && doc.data().published === true).map(doc => ({ id: doc.id, name: doc.data().name, role: doc.data().role || '', photo: doc.data().photo || doc.data().imageUrl || '', published: true }));
  assertRelease(next);
  await fs.writeFile(option('--out'), JSON.stringify(next, null, 2) + '\n', { flag: 'wx' });
  console.log(`Draft exported to ${option('--out')}. Review the diff, asset files and Bengali copy before replacing the committed snapshot.`);
  process.exit(0);
}

if (!['plan', 'sync'].includes(command)) throw new Error(`Unknown command: ${command}`);
const prepared = await releaseRef.get();
if (!prepared.exists || prepared.data().checksum !== checksum) throw new Error('Run prepare for this exact release before planning or syncing.');
const desired = new Map();
desired.set('settings/site', release.site);
desired.set('settings/content', { ...release.content, version: release.contentVersion, locale: release.locale, schemaVersion: release.schemaVersion, releaseId: release.id });
const draftBefore = await db.doc('settings/content_draft').get();
if (draftBefore.exists && encode(normalizeLegacyContent(draftBefore.data().content)) !== encode(release.content)) {
  throw new Error('An unpublished content draft differs from this release. Export/review that draft or archive it explicitly before deployment; it will not be overwritten.');
}
desired.set('settings/content_draft', { ...(draftBefore.data()?.baseReleaseId === release.id ? draftBefore.data() : {}), content: release.content, baseReleaseId: release.id, revision: draftBefore.data()?.baseReleaseId === release.id ? draftBefore.data().revision || 0 : (draftBefore.data()?.revision || 0) + 1 });
release.services.forEach((service, order) => desired.set(`services/${service.id}`, { ...service, desc: service.description, imageUrl: service.image, order, hidden: false, published: true, releaseId: release.id }));
release.offers.forEach((offer, order) => desired.set(`pricing/${offer.id}`, { ...offer, category: 'social', tier: offer.name, tierSub: offer.audience, rawPrice: offer.amountBDT, price: new Intl.NumberFormat('bn-BD').format(offer.amountBDT), period: '/মাস', desc: offer.audience, order, hidden: false, published: true, featured: order === 1, releaseId: release.id }));
release.portfolio.forEach((item, order) => desired.set(`portfolio/${item.id}`, { ...item, imageUrl: item.image, order, hidden: false, featured: Number.isInteger(item.featuredOrder), releaseId: release.id }));

const existing = new Map();
for (const collection of ['services', 'pricing', 'portfolio']) {
  const snapshot = await db.collection(collection).get();
  snapshot.docs.forEach(document => existing.set(document.ref.path, document));
}
for (const docPath of ['settings/site', 'settings/content']) existing.set(docPath, await db.doc(docPath).get());
existing.set('settings/content_draft', draftBefore);
const operations = [];
for (const [docPath, data] of desired) {
  const current = existing.get(docPath) || await db.doc(docPath).get();
  // Preserve unrelated site configuration, including payment/private fields;
  // the public snapshot itself is strictly validated and allowlisted.
  const target = docPath === 'settings/site' ? { ...(current.data() || {}), ...data } : data;
  if (encode(current.data() || null) !== encode(target)) operations.push({ path: docPath, current, target });
}
for (const [docPath, current] of existing) {
  if (docPath.startsWith('settings/') || desired.has(docPath)) continue;
  const target = { ...current.data(), hidden: true, published: false, archivedInRelease: release.id };
  if (encode(current.data()) !== encode(target)) operations.push({ path: docPath, current, target });
}
const plan = { releaseId: release.id, checksum, updates: operations.map(operation => ({ path: operation.path, action: operation.target.archivedInRelease ? 'archive' : operation.current.exists ? 'update' : 'create', previousUpdateTime: operation.current.updateTime?.toDate().toISOString() || null })) };
console.log(JSON.stringify(plan, null, 2));
if (command === 'plan' || !args.includes('--apply')) process.exit(0);

// Hostinger and Firestore cannot share a transaction. Only sync after the
// deployed HTML proves which immutable release is serving public visitors.
await verifyLiveRelease(release.id);
const pointerRef = db.doc('settings/publishing');
const pointerBefore = await pointerRef.get();
if (operations.length === 0 && pointerBefore.data()?.activeRelease === release.id && pointerBefore.data()?.checksum === checksum) {
  console.log('Already synced; no writes needed.');
  process.exit(0);
}
for (let offset = 0; offset < operations.length; offset += 100) {
  const chunk = operations.slice(offset, offset + 100);
  await db.runTransaction(async tx => {
    const snapshots = await tx.getAll(...chunk.map(operation => db.doc(operation.path)));
    snapshots.forEach((snapshot, index) => {
      const expected = chunk[index].current;
      if (snapshot.exists !== expected.exists || (snapshot.exists && !snapshot.updateTime.isEqual(expected.updateTime))) throw new Error(`Concurrent change at ${snapshot.ref.path}. Sync stopped; resolve this edit before retrying.`);
    });
    chunk.forEach(operation => {
      const backup = db.doc(`content_release_backups/${release.id}/documents/${encodeURIComponent(operation.path)}`);
      // Create-only backups preserve the original state across retries.
      tx.create(backup, { path: operation.path, existed: operation.current.exists, before: operation.current.data() || null, expectedAfter: operation.target, backedUpAt: FieldValue.serverTimestamp() });
      tx.set(db.doc(operation.path), operation.target);
    });
  });
}
await db.runTransaction(async tx => {
  const pointer = await tx.get(pointerRef);
  if (pointer.exists !== pointerBefore.exists || (pointer.exists && !pointer.updateTime.isEqual(pointerBefore.updateTime))) throw new Error('Another publication changed the active release. Verify both deployments before activation.');
  // Recheck the entire plan in the activation transaction, including earlier
  // batches. An editor change during the migration prevents activation.
  if (operations.length) {
    const written = await tx.getAll(...operations.map(operation => db.doc(operation.path)));
    written.forEach((snapshot, index) => {
      if (encode(snapshot.data()) !== encode(operations[index].target)) throw new Error(`Read-back verification failed at ${snapshot.ref.path}. Resolve concurrent edits before activation.`);
    });
  }
  tx.create(db.doc(`content_release_backups/${release.id}/documents/settings%2Fpublishing`), { path: pointerRef.path, existed: pointerBefore.exists, before: pointerBefore.data() || null, backedUpAt: FieldValue.serverTimestamp() });
  tx.set(pointerRef, { activeRelease: release.id, checksum, activatedAt: FieldValue.serverTimestamp() });
});
console.log(`Release ${release.id} synced. Orders, payments, messages, team, reviews and CRM records were not modified.`);
