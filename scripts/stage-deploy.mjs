import fs from 'node:fs/promises';
import path from 'node:path';

// Separate page publication from asset upload. FTP is not atomic: retaining
// old hashed assets lets already-open/older pages continue to work.
for (const directory of ['deploy-assets', 'deploy-pages']) {
  await fs.rm(directory, { recursive: true, force: true });
  await fs.mkdir(directory);
}
async function stage(directory = '') {
  for (const item of await fs.readdir(path.join('dist', directory), { withFileTypes: true })) {
    if (item.name === '.vite') continue;
    const relative = path.join(directory, item.name);
    if (item.isDirectory()) { await stage(relative); continue; }
    const isPage = /\.html$/.test(relative) || ['.htaccess', 'robots.txt', 'sitemap.xml'].includes(relative);
    const target = path.join(isPage ? 'deploy-pages' : 'deploy-assets', relative);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.copyFile(path.join('dist', relative), target);
  }
}
await stage();
console.log('Assets and page files staged separately. No remote files have been changed.');
