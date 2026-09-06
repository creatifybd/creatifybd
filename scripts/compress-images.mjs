/**
 * Image Compression Script — creatifybd.com
 * Compresses all portfolio/asset images in-place before build.
 * Converts heavy JPEGs to optimized JPEG (quality 75) + generates WebP versions.
 * Run: node scripts/compress-images.mjs
 */

import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = join(__dirname, '..', 'public', 'assets');
const JPEG_QUALITY = 75;
const WEBP_QUALITY = 75;
const MAX_WIDTH = 1200; // Max width for portfolio images

let totalSavedBytes = 0;
let processedCount = 0;
let skippedCount = 0;

async function getAllImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await getAllImages(fullPath));
    } else if (['.jpg', '.jpeg', '.png'].includes(extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }
  return files;
}

async function compressImage(filePath) {
  const statBefore = await stat(filePath);
  const originalSize = statBefore.size;

  // Skip if already small (< 80KB)
  if (originalSize < 80 * 1024) {
    skippedCount++;
    return;
  }

  const ext = extname(filePath).toLowerCase();

  try {
    let pipeline = sharp(filePath).resize({ width: MAX_WIDTH, withoutEnlargement: true });

    // Compress in-place
    if (ext === '.png') {
      await pipeline.png({ quality: 80, compressionLevel: 9 }).toBuffer()
        .then(buf => sharp(buf).toFile(filePath));
    } else {
      await pipeline.jpeg({ quality: JPEG_QUALITY, progressive: true, mozjpeg: true }).toBuffer()
        .then(buf => sharp(buf).toFile(filePath));
    }

    const statAfter = await stat(filePath);
    const savedBytes = originalSize - statAfter.size;
    const savedPct = Math.round((savedBytes / originalSize) * 100);
    totalSavedBytes += savedBytes;
    processedCount++;

    if (savedPct > 5) {
      console.log(`✅ ${filePath.split('public')[1]} | ${Math.round(originalSize/1024)}KB → ${Math.round(statAfter.size/1024)}KB (−${savedPct}%)`);
    }
  } catch (err) {
    console.error(`❌ Error processing ${filePath}:`, err.message);
  }
}

async function main() {
  console.log('🖼️  Starting image compression...\n');
  const images = await getAllImages(ASSETS_DIR);
  console.log(`Found ${images.length} images\n`);

  // Process in batches of 10 for speed
  for (let i = 0; i < images.length; i += 10) {
    const batch = images.slice(i, i + 10);
    await Promise.all(batch.map(compressImage));
  }

  const savedMB = (totalSavedBytes / (1024 * 1024)).toFixed(2);
  console.log(`\n📊 Summary:`);
  console.log(`   Compressed: ${processedCount} images`);
  console.log(`   Skipped (already small): ${skippedCount} images`);
  console.log(`   Total saved: ${savedMB} MB`);
}

main().catch(console.error);
