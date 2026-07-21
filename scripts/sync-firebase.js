/**
 * Firebase Sync Script
 * 
 * This script initializes Firestore with default data from the codebase.
 * It ensures Firebase is the single source of truth for all website content.
 * 
 * Usage: node scripts/sync-firebase.js
 * 
 * This script:
 * 1. Reads default content from ContentManager.jsx
 * 2. Reads default settings from siteConfig.js
 * 3. Syncs these defaults to Firestore (settings/content, settings/site, settings/payment)
 * 4. Preserves existing data in Firestore (only updates missing fields)
 * 
 * Prerequisites:
 * - Install firebase-admin: npm install firebase-admin --save-dev
 * - Download service account key from Firebase Console
 *   - Go to Project Settings > Service Accounts
 *   - Click "Generate new private key"
 *   - Save as firebase-service-account.json in project root
 * 
 * Alternative: Use Firebase CLI to export/import
 * - firebase firestore:export firestore-backup
 * - firebase firestore:import firestore-backup
 */

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');
const path = require('path');

// Check for service account file
const serviceAccountPath = path.join(__dirname, '../firebase-service-account.json');
if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ Error: firebase-service-account.json not found in project root.');
  console.error('\n📋 To fix this:');
  console.error('1. Go to Firebase Console: https://console.firebase.google.com/');
  console.error('2. Select your project');
  console.error('3. Go to Project Settings > Service Accounts');
  console.error('4. Click "Generate new private key"');
  console.error('5. Save the file as firebase-service-account.json in the project root');
  console.error('\n⚠️  Keep this file secure and never commit it to git!');
  process.exit(1);
}

// Initialize Firebase Admin
const serviceAccount = require(serviceAccountPath);

const app = initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore(app);

// Read default content from ContentManager.jsx
function extractDefaultContent() {
  const contentManagerPath = path.join(__dirname, '../src/pages/admin/ContentManager.jsx');
  const contentManagerContent = fs.readFileSync(contentManagerPath, 'utf8');
  
  // Extract the defaultContent object using regex
  const match = contentManagerContent.match(/const defaultContent = ({[\s\S]*?});/);
  if (!match) {
    throw new Error('Could not find defaultContent in ContentManager.jsx');
  }
  
  // Use eval to parse the object (safe since it's our own code)
  const defaultContent = eval(`(${match[1]})`);
  return defaultContent;
}

// Read default settings from siteConfig.js
function extractDefaultSettings() {
  const siteConfigPath = path.join(__dirname, '../src/config/siteConfig.js');
  const siteConfigContent = fs.readFileSync(siteConfigPath, 'utf8');
  
  // Extract siteConfig object
  const match = siteConfigContent.match(/export const siteConfig = ({[\s\S]*?});/);
  if (!match) {
    throw new Error('Could not find siteConfig in siteConfig.js');
  }
  
  const siteConfig = eval(`(${match[1]})`);
  
  // Convert to settings format for Firestore
  return {
    businessName: siteConfig.businessName,
    websiteUrl: siteConfig.websiteUrl,
    tagline: siteConfig.tagline,
    email: siteConfig.email,
    phone: siteConfig.phone,
    whatsappNumber: siteConfig.whatsappNumber,
    address: siteConfig.address,
    socialLinks: siteConfig.socialLinks,
    primary_color: '#E8192C',
    secondary_color: '#C0142A',
    favicon_url: ''
  };
}

// Default payment settings
function getDefaultPaymentSettings() {
  return {
    payoneer: {
      accountName: '',
      currency: 'USD',
      note: 'Enter the exact amount from your order confirmation. Add your Order ID (e.g. CBD-1234567) in the payment note.',
      paymentLink: ''
    },
    dbbl: {
      bankName: 'Dutch Bangla Bank Limited',
      accountName: '',
      accountNumber: '',
      branch: '',
      routingNumber: '',
      paymentReference: ''
    },
    tradeLicense: {
      number: '',
      issuedDate: ''
    }
  };
}

// Merge function that preserves existing data
function mergeData(existing, defaults) {
  if (!existing) return defaults;
  
  const merged = { ...defaults };
  
  for (const key in existing) {
    if (typeof existing[key] === 'object' && !Array.isArray(existing[key]) && existing[key] !== null) {
      merged[key] = mergeData(existing[key], defaults[key] || {});
    } else {
      merged[key] = existing[key];
    }
  }
  
  return merged;
}

// Sync to Firestore
async function syncToFirestore() {
  console.log('🚀 Starting Firebase sync...\n');
  
  try {
    // 1. Sync content
    console.log('📝 Syncing content to settings/content...');
    const contentRef = db.collection('settings').doc('content');
    const contentSnap = await contentRef.get();
    const defaultContent = extractDefaultContent();
    
    if (contentSnap.exists) {
      const mergedContent = mergeData(contentSnap.data(), defaultContent);
      await contentRef.set(mergedContent, { merge: true });
      console.log('   ✅ Content merged with existing data');
    } else {
      await contentRef.set(defaultContent);
      console.log('   ✅ Content initialized with defaults');
    }
    
    // 2. Sync site settings
    console.log('\n⚙️  Syncing site settings to settings/site...');
    const siteRef = db.collection('settings').doc('site');
    const siteSnap = await siteRef.get();
    const defaultSettings = extractDefaultSettings();
    
    if (siteSnap.exists) {
      const mergedSettings = mergeData(siteSnap.data(), defaultSettings);
      await siteRef.set(mergedSettings, { merge: true });
      console.log('   ✅ Site settings merged with existing data');
    } else {
      await siteRef.set(defaultSettings);
      console.log('   ✅ Site settings initialized with defaults');
    }
    
    // 3. Sync payment settings
    console.log('\n💳 Syncing payment settings to settings/payment...');
    const paymentRef = db.collection('settings').doc('payment');
    const paymentSnap = await paymentRef.get();
    const defaultPayment = getDefaultPaymentSettings();
    
    if (paymentSnap.exists) {
      const mergedPayment = mergeData(paymentSnap.data(), defaultPayment);
      await paymentRef.set(mergedPayment, { merge: true });
      console.log('   ✅ Payment settings merged with existing data');
    } else {
      await paymentRef.set(defaultPayment);
      console.log('   ✅ Payment settings initialized with defaults');
    }
    
    console.log('\n✨ Firebase sync completed successfully!\n');
    console.log('📋 Summary:');
    console.log('   - settings/content: synced');
    console.log('   - settings/site: synced');
    console.log('   - settings/payment: synced');
    console.log('\n💡 Note: Existing data in Firestore was preserved.');
    console.log('   Only missing fields were updated with defaults from codebase.\n');
    
  } catch (error) {
    console.error('❌ Error during sync:', error);
    process.exit(1);
  }
}

// Run the sync
syncToFirestore().then(() => {
  process.exit(0);
});
