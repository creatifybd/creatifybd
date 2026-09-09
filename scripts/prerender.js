import { build } from 'vite';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PUBLIC_ROUTES as routes } from './public-routes.mjs';
import { assertRelease } from '../src/data/releaseSchema.js';

const release = assertRelease(JSON.parse(await fs.readFile('src/data/publishedRelease.json', 'utf8')));
const template = await fs.readFile('dist/index.html', 'utf8');
if (!template.includes('<!--app-html-->') || !template.includes('<!--page-head-->')) throw new Error('Pre-render template markers are missing.');
await build({ logLevel: 'error', build: { ssr: 'src/entry-server.jsx', outDir: 'dist-ssr', minify: false }, ssr: { noExternal: ['react-router', 'react-router-dom', 'react-helmet-async'] } });
try {
  const { render } = await import(pathToFileURL(path.resolve('dist-ssr/entry-server.js')).href);
  for (const route of routes) {
    const { html, head } = await render(route);
    if (!html.includes('id="main-content"') || !/<h1[\s>]/.test(html) || !/[\u0980-\u09ff]/.test(html) || !head.includes('<title')) throw new Error(`Incomplete Bengali render: ${route}`);
    const page = template.replace('<!--page-head-->', `${head}\n<meta name="content-release" content="${release.id}">`)
      .replace('<div id="root">', `<div id="root" data-route="${route}">`).replace('<!--app-html-->', html);
    const target = route === '/' ? 'dist/index.html' : path.join('dist', route.slice(1), 'index.html');
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, page);
  }
  // Account routes intentionally render only a Bengali shell; no private data
  // or Firebase credentials are needed by the public pre-renderer.
  const shell = template.replace('<!--page-head-->', '<title>CreatifyBD</title><meta name="robots" content="noindex,nofollow">')
    .replace('<!--app-html-->', '<div class="cb-route-loading" role="status">পাতাটি প্রস্তুত হচ্ছে…</div>');
  for (const route of ['login', 'admin', 'client/orders', 'order/success']) {
    await fs.mkdir(`dist/${route}`, { recursive: true });
    await fs.writeFile(`dist/${route}/index.html`, shell);
  }
  await fs.writeFile('dist/app-shell.html', shell);
  const missing = await render('/__not-found');
  await fs.writeFile('dist/404.html', template.replace('<!--page-head-->', missing.head).replace('<!--app-html-->', missing.html));
  const urls = routes.filter(route => route !== '/privacy-policy');
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(route => `<url><loc>https://creatifybd.com${route === '/' ? '/' : route}</loc></url>`).join('')}</urlset>\n`;
  await fs.writeFile('dist/sitemap.xml', sitemap);
  console.log(`Rendered ${routes.length} complete Bengali routes from release ${release.id}.`);
} finally {
  // Keep the server bundle out of the deployment directory.
  await fs.rm('dist-ssr', { recursive: true, force: true });
}
