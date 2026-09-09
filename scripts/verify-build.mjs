import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { gzipSync } from 'node:zlib';
import { JSDOM } from 'jsdom';
import { PUBLIC_ROUTES } from './public-routes.mjs';

const release = JSON.parse(await fs.readFile('src/data/publishedRelease.json', 'utf8'));
for (const route of PUBLIC_ROUTES) {
  const filename = route === '/' ? 'dist/index.html' : `dist${route}/index.html`;
  const html = await fs.readFile(filename, 'utf8');
  const document = new JSDOM(html).window.document;
  assert.equal(document.documentElement.lang, 'bn-BD', `${route}: document language`);
  assert.equal(document.querySelector('#root').dataset.route, route, `${route}: hydration route`);
  assert.equal(document.querySelector('meta[name="content-release"]').content, release.id, `${route}: release`);
  assert.equal(document.querySelectorAll('h1').length, 1, `${route}: one primary heading`);
  assert.ok(document.querySelector('main#main-content'), `${route}: main landmark`);
  assert.match(document.querySelector('h1').textContent, /[\u0980-\u09ff]/, `${route}: Bengali from HTML`);
  assert.equal(document.querySelectorAll('[style*="opacity:0"]').length, 0, `${route}: text must not wait for JS animation`);
  assert.ok(document.title && document.querySelector('meta[name="description"]')?.content, `${route}: metadata`);
  for (const image of document.querySelectorAll('img')) {
    assert.ok(image.hasAttribute('alt') && image.hasAttribute('width') && image.hasAttribute('height'), `${route}: image dimensions and alternative text`);
    if (image.getAttribute('src').startsWith('/')) await fs.access(`public${image.getAttribute('src')}`);
  }
  if (route === '/') {
    assert.equal(document.querySelectorAll('.cb-work-card').length, 12);
    assert.equal(document.querySelectorAll('.cb-board-plan').length, 3);
    assert.equal(document.querySelectorAll('.cb-price-card').length, 3);
  }
}
const manifest = JSON.parse(await fs.readFile('dist/.vite/manifest.json', 'utf8'));
const initial = new Set();
function follow(key) {
  if (initial.has(key)) return;
  assert.ok(manifest[key], `Manifest entry ${key}`);
  initial.add(key);
  for (const dependency of manifest[key].imports || []) follow(dependency);
}
follow('index.html'); follow('src/pages/Home.jsx');
for (const key of initial) assert.ok(!/firebase|AccountArea|AdminDashboard|config-/.test(`${key} ${manifest[key].file}`), `Private/admin dependency loaded on homepage: ${key}`);
const files = [...new Set([...initial].flatMap(key => [manifest[key].file, ...(manifest[key].css || [])]))];
let rawJS = 0, rawCSS = 0, gzip = 0;
for (const filename of files) {
  const bytes = await fs.readFile(`dist/${filename}`);
  if (filename.endsWith('.js')) rawJS += bytes.length;
  if (filename.endsWith('.css')) rawCSS += bytes.length;
  gzip += gzipSync(bytes).length;
}
assert.ok(rawCSS < 40000, `Public CSS budget exceeded: ${rawCSS}`);
assert.ok(rawJS < 380000, `Homepage JavaScript budget exceeded: ${rawJS}`);
console.log(`Verified ${PUBLIC_ROUTES.length} Bengali HTML routes, visible initial content and local image references.`);
console.log(`Homepage dependency graph: ${rawJS} JS bytes, ${rawCSS} CSS bytes, ${gzip} gzip bytes (excludes images/fonts/HTML).`);
