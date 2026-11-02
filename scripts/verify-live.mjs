import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { PUBLIC_ROUTES } from './public-routes.mjs';

const origin = 'https://creatifybd.com';
const containmentOnly = process.argv.includes('--containment-only');
const release = JSON.parse(await fs.readFile('src/data/publishedRelease.json', 'utf8'));
const evidence = [];
async function request(route, options = {}) {
  const url = new URL(route, origin);
  url.searchParams.set('release_check', `${release.id}-${Date.now()}`);
  return fetch(url, { redirect: 'manual', cache: 'no-store', signal: AbortSignal.timeout(25000), ...options });
}
// HEAD-only: verify exposure is blocked without retrieving contact records.
for (const route of ['/data/manifest.json', ...Array.from({ length: 5 }, (_, i) => `/data/leads_${i + 1}.json`)]) {
  const response = await request(route, { method: 'HEAD' });
  evidence.push({ route, status: response.status, method: 'HEAD' });
  assert.ok([403, 404, 410].includes(response.status), `Private data path must be denied: ${route} returned ${response.status}`);
}
if (!containmentOnly) {
  const titles = new Set();
  const descriptions = new Set();
  const bodies = new Set();
  for (const route of PUBLIC_ROUTES) {
    if (route === '/privacy-policy') continue; // Canonical redirect checked below.
    const response = await request(route);
    assert.equal(response.status, 200, `${route}: HTTP status`);
    const html = await response.text();
    const doc = new JSDOM(html).window.document;
    assert.equal(doc.querySelector('meta[name="content-release"]')?.content, release.id, `${route}: deployed release`);
    assert.equal(doc.documentElement.lang, 'bn-BD', `${route}: document language`);
    assert.equal(doc.querySelector('link[rel="canonical"]')?.href, `${origin}${route}`, `${route}: canonical`);
    assert.equal(doc.querySelectorAll('h1').length, 1, `${route}: H1`);
    const main = doc.querySelector('main#main-content');
    assert.ok(main && /[\u0980-\u09ff]/.test(main.textContent), `${route}: rendered Bengali content`);
    const description = doc.querySelector('meta[name="description"]')?.content;
    assert.ok(doc.title && description, `${route}: title and description`);
    assert.ok(!titles.has(doc.title), `${route}: duplicate title`);
    assert.ok(!descriptions.has(description), `${route}: duplicate description`);
    assert.ok(!bodies.has(main.textContent), `${route}: duplicate page body`);
    titles.add(doc.title); descriptions.add(description); bodies.add(main.textContent);
    assert.match(response.headers.get('cache-control') || '', /no-cache|no-store|max-age=0/i, `${route}: HTML cache revalidation`);
    evidence.push({ route, status: response.status, release: release.id, title: doc.title });
  }
  const redirects = new Map([['/privacy-policy', '/privacy'], ['/pricing.html', '/pricing'], ['/gigs', '/services'], ['/payment', '/contact'], ['/case-studies', '/portfolio']]);
  for (const [route, target] of redirects) {
    const response = await request(route);
    assert.ok([301, 308].includes(response.status), `${route}: permanent redirect`);
    assert.equal(new URL(response.headers.get('location'), origin).pathname, target, `${route}: redirect target`);
    evidence.push({ route, status: response.status, target });
  }
  const missing = await request('/__release-verification-nonexistent-page');
  assert.equal(missing.status, 404, 'Unknown public URL must return real HTTP 404');
  const sitemap = await request('/sitemap.xml');
  assert.equal(sitemap.status, 200, 'Sitemap status');
  const urls = [...(await sitemap.text()).matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
  assert.deepEqual(urls.sort(), PUBLIC_ROUTES.filter(route => route !== '/privacy-policy').map(route => `${origin}${route}`).sort(), 'Sitemap matches canonical routes');
  const robots = await request('/robots.txt');
  assert.equal(robots.status, 200, 'robots.txt status');
  assert.ok((await robots.text()).includes(`${origin}/sitemap.xml`), 'robots.txt sitemap');
}
await fs.mkdir('.production-verification', { recursive: true });
await fs.writeFile(`.production-verification/${containmentOnly ? 'containment' : 'release'}.json`, JSON.stringify({ checkedAt: new Date().toISOString(), mode: containmentOnly ? 'containment' : 'release', release: release.id, evidence }, null, 2) + '\n');
console.log(containmentOnly ? 'Public data endpoints deny HEAD requests; no contact records retrieved.' : `Verified live release ${release.id}: unique Bengali pages, canonical URLs, sitemap, redirects, HTTP 404, cache and private-data denial.`);
