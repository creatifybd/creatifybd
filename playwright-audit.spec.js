import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

// Configuration
const BASE_URL = 'http://localhost:5173';
const SCREENSHOT_DIR = path.join(process.cwd(), 'qa-screenshots', 'before');
const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 }
];

// Public routes to audit
const PUBLIC_ROUTES = [
  '/',
  '/services',
  '/gigs',
  '/portfolio',
  '/about',
  '/process',
  '/pricing',
  '/contact',
  '/case-studies',
  '/team',
  '/reviews',
  '/privacy',
  '/terms',
  '/refund-policy',
  '/revision-policy',
  '/login'
];

// Admin routes to audit (will skip if not authenticated)
const ADMIN_ROUTES = [
  '/admin',
  '/admin/orders',
  '/admin/gigs',
  '/admin/reviews',
  '/admin/content',
  '/admin/case-studies',
  '/admin/services',
  '/admin/portfolio',
  '/admin/media',
  '/admin/pricing',
  '/admin/testimonials',
  '/admin/messages',
  '/admin/settings'
];

// Ensure screenshot directory exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// Sanitize route name for filename
function sanitizeRouteName(route) {
  return route.replace(/[^a-z0-9-]/gi, '-').replace(/^-+|-+$/g, '') || 'home';
}

// Wait for page to be fully loaded
async function waitForPageLoad(page) {
  // Wait for network to be mostly idle
  await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
  // Wait for animations to settle
  await page.waitForTimeout(500);
  // Hide scrollbars for cleaner screenshots
  await page.addStyleTag({
    content: `
      * { scrollbar-width: none !important; }
      *::-webkit-scrollbar { display: none !important; }
    `
  });
}

// Capture screenshot for a specific route and viewport
async function captureScreenshot(page, route, viewport) {
  const routeName = sanitizeRouteName(route);
  const filename = `${routeName}-${viewport.name}.png`;
  const filepath = path.join(SCREENSHOT_DIR, filename);

  try {
    console.log(`  Capturing: ${filename} (${viewport.name}: ${viewport.width}x${viewport.height})`);
    
    // Set viewport
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    
    // Navigate to route
    await page.goto(`${BASE_URL}${route}`, { waitUntil: 'domcontentloaded' });
    
    // Wait for page to stabilize
    await waitForPageLoad(page);
    
    // Capture full page screenshot
    await page.screenshot({
      path: filepath,
      fullPage: true,
      animations: 'disabled'
    });
    
    console.log(`    ✓ Saved: ${filename}`);
    return true;
  } catch (error) {
    console.error(`    ✗ Failed: ${filename} - ${error.message}`);
    return false;
  }
}

// Main audit function
async function runAudit() {
  console.log('🎬 Starting Visual Baseline Audit with Playwright...\n');
  console.log(`📁 Screenshot directory: ${SCREENSHOT_DIR}`);
  console.log(`🌐 Base URL: ${BASE_URL}\n`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: null, // We'll set viewport per page
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });
  const page = await context.newPage();

  let totalScreenshots = 0;
  let successfulScreenshots = 0;
  let failedScreenshots = 0;

  // Audit public routes
  console.log('📸 Auditing Public Routes...\n');
  for (const route of PUBLIC_ROUTES) {
    console.log(`Route: ${route}`);
    for (const viewport of VIEWPORTS) {
      totalScreenshots++;
      const success = await captureScreenshot(page, route, viewport);
      if (success) successfulScreenshots++;
      else failedScreenshots++;
    }
    console.log('');
  }

  // Check if we can access admin routes
  console.log('🔐 Checking Admin Access...\n');
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded' });
  await waitForPageLoad(page);
  
  // Check if we're redirected (already logged in) or on login page
  const currentUrl = page.url();
  
  if (currentUrl.includes('/admin')) {
    console.log('✓ Already authenticated - auditing adminRoutes...\n');
    
    for (const route of ADMIN_ROUTES) {
      console.log(`Route: ${route}`);
      for (const viewport of VIEWPORTS) {
        totalScreenshots++;
        const success = await captureScreenshot(page, route, viewport);
        if (success) successfulScreenshots++;
        else failedScreenshots++;
      }
      console.log('');
    }
  } else {
    console.log('⚠ Not authenticated - skipping admin routes');
    console.log('  To audit admin routes, log in first or update script with credentials\n');
  }

  await browser.close();

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 AUDIT SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total screenshots attempted: ${totalScreenshots}`);
  console.log(`✓ Successful: ${successfulScreenshots}`);
  console.log(`✗ Failed: ${failedScreenshots}`);
  console.log(`📁 Screenshots saved to: ${SCREENSHOT_DIR}`);
  console.log('='.repeat(60));
  console.log('\n✨ Visual baseline audit complete!');
  console.log('👀 Review screenshots to identify visual issues before fixing.\n');
}

// Run the audit
runAudit().catch(error => {
  console.error('❌ Audit failed:', error);
  process.exit(1);
});
