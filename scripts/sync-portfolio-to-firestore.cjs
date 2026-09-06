// Load environment variables
const dotenv = require('dotenv');
dotenv.config();

const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const { CURATED_PORTFOLIO } = require('../src/data/portfolioItems.js');
const path = require('path');

// Initialize Firebase Admin SDK with service account file
let db;
try {
  const serviceAccountPath = path.join(__dirname, '../service-account.json');
  admin.initializeApp({
    credential: admin.cert(serviceAccountPath)
  });
  db = getFirestore();
  console.log('✅ Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('❌ Error initializing Firebase Admin:', error);
  process.exit(1);
}

async function syncPortfolioToFirestore() {
  console.log('Starting portfolio sync to Firestore...');
  console.log(`Total items to sync: ${CURATED_PORTFOLIO.length}`);

  try {
    // Fetch existing documents from Firestore
    console.log('Fetching existing documents from Firestore...');
    const querySnapshot = await db.collection('portfolio').get();
    const storedById = new Map();
    querySnapshot.forEach(doc => {
      storedById.set(doc.id, doc.data());
    });
    console.log(`Found ${storedById.size} existing documents in Firestore`);

    // Create batch to update all documents
    const batch = db.batch();
    let updatedCount = 0;

    CURATED_PORTFOLIO.forEach(item => {
      const override = storedById.get(item.id);
      
      // Force update with project file data, preserving only specific fields
      const docRef = db.collection('portfolio').doc(item.id);
      batch.set(docRef, {
        // Always use project file data for text fields
        title: item.title,
        description: item.description,
        category: item.category,
        service: item.service,
        industry: item.industry,
        tags: item.tags,
        seoTitle: item.seoTitle,
        seoDescription: item.seoDescription,
        // Preserve custom uploads and visibility settings from Firestore
        imageUrl: override?.imageUrl || override?.image || item.image,
        hidden: override?.hidden !== undefined ? override.hidden : false,
        featured: override?.featured !== undefined ? override.featured : false,
        featuredOrder: override?.featuredOrder !== undefined ? override.featuredOrder : 0,
        isCurated: true,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }); // Default is merge: false, which replaces the document
      
      updatedCount++;
      console.log(`Queueing update for: ${item.title}`);
    });

    // Commit the batch
    console.log('Committing batch update...');
    await batch.commit();
    console.log(`✅ Successfully updated ${updatedCount} portfolio items in Firestore`);
    console.log('All portfolio data has been synced with project file data');

  } catch (error) {
    console.error('❌ Error syncing portfolio to Firestore:', error);
    process.exit(1);
  }
}

// Run the sync
syncPortfolioToFirestore().then(() => {
  console.log('Sync completed successfully');
  process.exit(0);
}).catch((error) => {
  console.error('Sync failed:', error);
  process.exit(1);
});
