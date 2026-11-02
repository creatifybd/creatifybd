import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { Client } from 'basic-ftp';

// Only public website files are backed up. Never download customer datasets,
// uploaded documents, environment files, or arbitrary server-side scripts.
const command = process.argv[2];
if (!['backup', 'contain'].includes(command)) throw new Error('Use hostinger-ops.mjs backup|contain');
for (const key of ['FTP_SERVER', 'FTP_USERNAME', 'FTP_PASSWORD']) {
  if (!process.env[key]) throw new Error(`Missing protected ${key}; no server change made.`);
}
const root = '/public_html'; // Preserve the established Hostinger document root.
const backupDir = path.resolve('.production-backup', command);
await fs.mkdir(backupDir, { recursive: true, mode: 0o700 });
const manifest = { createdAt: new Date().toISOString(), sourceRoot: root, commit: process.env.GITHUB_SHA || null, files: [] };
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const ftp = new Client(180000);
ftp.ftp.verbose = false;
async function backupFile(relative) {
  const target = path.join(backupDir, relative);
  await fs.mkdir(path.dirname(target), { recursive: true, mode: 0o700 });
  await ftp.downloadTo(target, `${root}/${relative}`);
  const bytes = await fs.readFile(target);
  manifest.files.push({ path: relative, bytes: bytes.length, sha256: sha256(bytes) });
}
async function saveManifest() {
  await fs.writeFile(path.join(backupDir, 'backup-manifest.json'), JSON.stringify(manifest, null, 2) + '\n', { mode: 0o600 });
}
try {
  // Validate the TLS certificate. Do not silently downgrade to FTP or accept
  // a self-signed certificate to make a deployment appear successful.
  await ftp.access({ host: process.env.FTP_SERVER, user: process.env.FTP_USERNAME, password: process.env.FTP_PASSWORD, port: 21, secure: true });
  const rootFiles = await ftp.list(root);
  if (!rootFiles.some(file => file.isFile && file.name === 'index.html')) throw new Error('Expected existing /public_html/index.html is missing; verify document root before deployment.');
  if (command === 'backup') {
    const allowedDirs = new Set(['services', 'portfolio', 'pricing', 'about', 'process', 'contact', 'team', 'reviews', 'privacy', 'terms', 'refund-policy', 'revision-policy', 'privacy-policy', 'gigs', 'work', 'case-studies', 'case-study', 'payment', 'login', 'admin', 'client', 'order']);
    async function walk(relative, entries, depth = 0) {
      if (depth > 4) throw new Error('Unexpected public-page directory depth; inspect document root.');
      for (const entry of entries) {
        if (!/^[A-Za-z0-9_.-]+$/.test(entry.name)) continue;
        const name = relative ? `${relative}/${entry.name}` : entry.name;
        if (entry.isDirectory && (relative || allowedDirs.has(entry.name))) await walk(name, await ftp.list(`${root}/${name}`), depth + 1);
        if (entry.isFile && (/\.html$/.test(entry.name) || entry.name === '.htaccess' || (!relative && ['robots.txt', 'sitemap.xml'].includes(entry.name)))) {
          if (entry.size > 8 * 1024 * 1024 || manifest.files.length >= 250) throw new Error('Unexpected backup size/count; inspect before publication.');
          await backupFile(name);
        }
      }
    }
    await walk('', rootFiles);
    await saveManifest();
    console.log(`Backed up ${manifest.files.length} public HTML/configuration files. Existing assets remain on Hostinger; no remote files changed.`);
  } else {
    // Emergency containment is independent of Firebase access. It writes only
    // a directory access rule; it never deletes or reads the lead records.
    const source = await fs.readFile('public/data/.htaccess', 'utf8');
    if (!source.includes('Require all denied')) throw new Error('Expected reviewed data-directory deny rule is missing.');
    const directory = rootFiles.find(file => file.isDirectory && file.name === 'data');
    let existing = '';
    if (directory) {
      const entries = await ftp.list(`${root}/data`);
      if (entries.some(file => file.isFile && file.name === '.htaccess')) {
        await backupFile('data/.htaccess');
        existing = await fs.readFile(path.join(backupDir, 'data/.htaccess'), 'utf8');
      }
    }
    manifest.previousRuleExisted = Boolean(manifest.files.length);
    await saveManifest();
    const marker = '# CreatifyBD private-data containment';
    // Preserve existing directives. Append deny rules only once, keeping the
    // original rule available in the deployment's restricted-access artifact.
    const combined = existing.includes(marker) ? existing : `${existing}\n${marker}\n${source}\n`;
    const staged = path.join(backupDir, 'containment-rule.txt');
    await fs.writeFile(staged, combined, { mode: 0o600 });
    await ftp.ensureDir(`${root}/data`);
    await ftp.uploadFrom(staged, `${root}/data/.htaccess`);
    console.log('Uploaded only /public_html/data/.htaccess. No datasets were read, moved or deleted.');
  }
} finally {
  ftp.close();
}
