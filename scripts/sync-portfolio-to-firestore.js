// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { CURATED_PORTFOLIO } from '../src/data/portfolioItems.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function syncPortfolioToFirestore() {
  console.log('Starting portfolio sync to Firestore...');
  console.log(`Total items to sync: ${CURATED_PORTFOLIO.length}`);

  try {
    // Fetch existing documents from Firestore
    console.log('Fetching existing documents from Firestore...');
    const querySnapshot = await getDocs(collection(db, 'portfolio'));
    const storedById = new Map();
    querySnapshot.forEach(doc => {
      storedById.set(doc.id, doc.data());
    });
    console.log(`Found ${storedById.size} existing documents in Firestore`);

    // Create batch to update all documents
    const batch = writeBatch(db);
    let updatedCount = 0;

    CURATED_PORTFOLIO.forEach(item => {
      const override = storedById.get(item.id);
      
      // Force update with project file data, preserving only specific fields
      const docRef = doc(db, 'portfolio', item.id);
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
        updatedAt: serverTimestamp()
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
