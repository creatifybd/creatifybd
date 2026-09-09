import { readFile } from 'node:fs/promises';
import { before, after, test } from 'node:test';
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { doc, collection, getDoc, getDocs, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import { promisify } from 'node:util';
import { execFile } from 'node:child_process';
import assert from 'node:assert/strict';
const runFile = promisify(execFile);

// The test library only talks to emulators. Never initialize the site's real app.
if (!process.env.FIRESTORE_EMULATOR_HOST || !process.env.FIREBASE_STORAGE_EMULATOR_HOST) throw new Error('Run npm run test:rules; both emulators are required.');
let env;
before(async () => {
  env = await initializeTestEnvironment({ projectId: 'demo-creatifybd',
    firestore: { rules: await readFile('firestore.rules', 'utf8') },
    storage: { rules: await readFile('storage.rules', 'utf8') } });
  await env.withSecurityRulesDisabled(async context => {
    for (const role of ['owner', 'editor', 'viewer']) await setDoc(doc(context.firestore(), 'admins', `${role}@example.test`), { role });
    await setDoc(doc(context.firestore(), 'settings', 'payment'), { testOnly: true });
    await setDoc(doc(context.firestore(), 'settings', 'site'), { site_name: 'CreatifyBD', privateLegacyValue: 'test-only' });
    await setDoc(doc(context.firestore(), 'orders', 'private-test-order'), { status: 'payment_pending', testOnly: true });
  });
});
after(async () => env?.cleanup());
const visitor = () => env.unauthenticatedContext().firestore();
const account = role => env.authenticatedContext(`test-${role}`, { email: `${role}@example.test` });
test('visitors may submit a valid inquiry without email, but cannot read messages', async () => {
  const data = { name: 'আলিফ', phone: '01712345678', email: '', message: 'কাজের ব্যাপারে আলোচনা করতে চাই।', status: 'unread', read: false };
  await assertSucceeds(setDoc(doc(visitor(), 'messages', 'valid-inquiry'), data));
  await assertFails(setDoc(doc(visitor(), 'messages', 'bad-phone'), { ...data, phone: 'invalid' }));
  await assertFails(getDocs(collection(visitor(), 'messages')));
});
test('newsletter is create-only and does not expose addresses', async () => {
  await assertSucceeds(setDoc(doc(visitor(), 'subscribers', 'new-subscriber'), { email: 'hello@example.test', status: 'pending', consent: true, subscribedAt: serverTimestamp() }));
  await assertFails(getDocs(collection(visitor(), 'subscribers')));
  await assertFails(updateDoc(doc(visitor(), 'subscribers', 'new-subscriber'), { status: 'active' }));
  await assertFails(setDoc(doc(visitor(), 'subscribers', 'extra-field'), { email: 'hello@example.test', status: 'pending', consent: true, subscribedAt: serverTimestamp(), admin: true }));
});
test('roles protect drafts, CRM and immutable publication records', async () => {
  await assertSucceeds(setDoc(doc(account('editor').firestore(), 'settings', 'content_draft'), { revision: 1 }));
  await assertFails(setDoc(doc(account('viewer').firestore(), 'settings', 'content_draft'), { revision: 2 }));
  await assertSucceeds(setDoc(doc(account('editor').firestore(), 'lead_crm', 'lead-1'), { note: 'test' }));
  await assertFails(getDocs(collection(visitor(), 'lead_crm')));
  await assertFails(setDoc(doc(account('owner').firestore(), 'site_releases', 'test-release'), { snapshot: {} }));
  await assertFails(setDoc(doc(account('owner').firestore(), 'settings', 'publishing'), { activeRelease: 'test' }));
  await assertFails(getDoc(doc(visitor(), 'settings', 'payment')));
  await assertFails(getDoc(doc(visitor(), 'settings', 'site')));
  await assertFails(getDocs(collection(visitor(), 'orders')));
});
test('storage editors can upload; viewers and visitors cannot upload portfolio work', async () => {
  const png = new Uint8Array([137, 80, 78, 71]);
  await assertSucceeds(uploadBytes(ref(account('editor').storage(), 'portfolio/editor.png'), png, { contentType: 'image/png' }));
  await assertFails(uploadBytes(ref(account('viewer').storage(), 'portfolio/viewer.png'), png, { contentType: 'image/png' }));
  await assertFails(uploadBytes(ref(env.unauthenticatedContext().storage(), 'portfolio/visitor.png'), png, { contentType: 'image/png' }));
  await assertFails(uploadBytes(ref(account('editor').storage(), 'portfolio/script.js'), png, { contentType: 'text/javascript' }));
});

test('publication backs up, archives, stays idempotent and preserves unrelated records', async () => {
  await env.withSecurityRulesDisabled(async context => {
    const db = context.firestore();
    await setDoc(doc(db, 'settings', 'content'), { hero: { title: 'Old English title' } });
    await setDoc(doc(db, 'settings', 'content_draft'), { content: JSON.parse(await readFile('src/data/publishedRelease.json', 'utf8')).content, baseReleaseId: 'bn-previous', revision: 2 });
    await setDoc(doc(db, 'portfolio', 'obsolete-item'), { title: 'Old portfolio', hidden: false });
  });
  const run = (...args) => runFile(process.execPath, ['scripts/content-release.mjs', ...args, '--emulator'], { env: process.env, maxBuffer: 2 * 1024 * 1024 });
  await run('prepare');
  await run('sync'); // Must remain a dry-run without --apply.
  await env.withSecurityRulesDisabled(async context => assert.equal((await getDoc(doc(context.firestore(), 'settings', 'content'))).data().hero.title, 'Old English title'));
  await run('sync', '--apply');
  await env.withSecurityRulesDisabled(async context => {
    const db = context.firestore();
    const release = JSON.parse(await readFile('src/data/publishedRelease.json', 'utf8'));
    assert.equal((await getDoc(doc(db, 'settings', 'content'))).data().hero.title, release.content.hero.title);
    assert.equal((await getDoc(doc(db, 'settings', 'content_draft'))).data().baseReleaseId, release.id);
    assert.equal((await getDoc(doc(db, 'portfolio', 'obsolete-item'))).data().hidden, true);
    assert.equal((await getDoc(doc(db, 'portfolio', 'obsolete-item'))).data().title, 'Old portfolio');
    assert.equal((await getDoc(doc(db, 'content_release_backups', release.id, 'documents', 'settings%2Fcontent'))).data().before.hero.title, 'Old English title');
    assert.equal((await getDoc(doc(db, 'settings', 'payment'))).data().testOnly, true);
    assert.equal((await getDoc(doc(db, 'orders', 'private-test-order'))).data().testOnly, true);
  });
  const repeated = await run('sync', '--apply');
  assert.match(repeated.stdout, /Already synced; no writes needed/);
  await env.withSecurityRulesDisabled(async context => {
    const draft = doc(context.firestore(), 'settings', 'content_draft');
    const data = (await getDoc(draft)).data();
    data.content.hero.title = 'প্রকাশের অপেক্ষায় থাকা নতুন লেখা';
    await setDoc(draft, data);
  });
  await assert.rejects(run('sync', '--apply'), /unpublished content draft differs/);
});
