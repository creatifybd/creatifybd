// Load environment variables
const dotenv = require('dotenv');
dotenv.config();

const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

// Firebase Admin configuration with credentials
const serviceAccount = {
  "type": "service_account",
  "project_id": process.env.FIREBASE_PROJECT_ID || "creatify-bd",
  "private_key": process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || "",
  "client_email": process.env.FIREBASE_CLIENT_EMAIL || ""
};

// Initialize Firebase Admin SDK
let db;
try {
  if (serviceAccount.private_key && serviceAccount.client_email) {
    admin.initializeApp({
      credential: admin.cert(serviceAccount)
    });
    db = getFirestore();
    console.log('✅ Firebase Admin SDK initialized successfully');
  } else {
    console.log('⚠️  No service account credentials found. Please set FIREBASE_PRIVATE_KEY and FIREBASE_CLIENT_EMAIL environment variables.');
    console.log('Or manually update records through Firebase Console.');
    process.exit(0);
  }
} catch (error) {
  console.error('❌ Error initializing Firebase Admin:', error);
  process.exit(1);
}

async function updatePricingCollection() {
  console.log('=== Updating Pricing Collection ===');
  
  try {
    const querySnapshot = await db.collection('pricing').get();
    const batch = db.batch();
    let updatedCount = 0;

    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      const docRef = db.collection('pricing').doc(docSnapshot.id);
      
      // Convert price to number if it's a string
      let price = data.price;
      if (typeof price === 'string') {
        // Remove any currency symbols and convert to number
        price = parseFloat(price.replace(/[^0-9.-]/g, ''));
      }
      
      // Fix web design price from 58000 to 8000
      if (data.category === 'web' && price === 58000) {
        price = 8000;
        console.log(`  Fixed web design price: ${docSnapshot.id} - 58000 -> 8000`);
      }
      
      // Remove featured flag from non-web categories
      if (data.category !== 'web' && data.featured === true) {
        console.log(`  Removed featured flag: ${docSnapshot.id} (category: ${data.category})`);
        batch.update(docRef, { featured: false });
        updatedCount++;
      }
      
      // Update price as number
      if (!isNaN(price) && price !== data.price) {
        console.log(`  Updated price to number: ${docSnapshot.id} - ${data.price} -> ${price}`);
        batch.update(docRef, { price: price });
        updatedCount++;
      }
    });

    if (updatedCount > 0) {
      await batch.commit();
      console.log(`✅ Updated ${updatedCount} pricing documents`);
    } else {
      console.log('No pricing updates needed');
    }
  } catch (error) {
    console.error('❌ Error updating pricing:', error);
    throw error;
  }
}

async function updateContentCollection() {
  console.log('\n=== Updating Content Collection ===');
  
  try {
    const contentSnap = await db.collection('content').get();
    
    for (const docSnapshot of contentSnap.docs) {
      const data = docSnapshot.data();
      const docRef = db.collection('content').doc(docSnapshot.id);
      const updates = {};
      let hasUpdates = false;

      // Fix typo Srowing to Growing
      const jsonString = JSON.stringify(data);
      if (jsonString.includes('Srowing')) {
        console.log(`  Found 'Srowing' typo in document: ${docSnapshot.id}`);
        
        // Fix in all string fields
        Object.keys(data).forEach(key => {
          if (typeof data[key] === 'string') {
            data[key] = data[key].replace(/Srowing/g, 'Growing');
            if (data[key] !== docSnapshot.data()[key]) {
              updates[key] = data[key];
              hasUpdates = true;
            }
          }
          // Fix in nested objects
          if (typeof data[key] === 'object' && data[key] !== null) {
            const nestedString = JSON.stringify(data[key]);
            if (nestedString.includes('Srowing')) {
              data[key] = JSON.parse(nestedString.replace(/Srowing/g, 'Growing'));
              updates[key] = data[key];
              hasUpdates = true;
            }
          }
        });
        
        if (hasUpdates) {
          await docRef.update(updates);
          console.log(`  Fixed 'Srowing' -> 'Growing' in: ${docSnapshot.id}`);
        }
      }

      // Remove duplicate "Launch and improve" from process steps
      if (data.process && data.process.steps && Array.isArray(data.process.steps)) {
        const steps = data.process.steps;
        const uniqueSteps = [];
        const seen = new Set();
        
        steps.forEach(step => {
          const stepStr = typeof step === 'string' ? step : JSON.stringify(step);
          if (!seen.has(stepStr)) {
            seen.add(stepStr);
            uniqueSteps.push(step);
          } else {
            console.log(`  Removed duplicate step: ${stepStr}`);
          }
        });
        
        if (uniqueSteps.length !== steps.length) {
          await docRef.update({ 'process.steps': uniqueSteps });
          console.log(`  Removed duplicate steps in: ${docSnapshot.id}`);
        }
      }
    }
    
    console.log('✅ Content collection updated');
  } catch (error) {
    console.error('❌ Error updating content:', error);
    throw error;
  }
}

async function updateServicesCollection() {
  console.log('\n=== Updating Services Collection ===');
  
  try {
    const querySnapshot = await db.collection('services').get();
    const batch = db.batch();
    let updatedCount = 0;

    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      const docRef = db.collection('services').doc(docSnapshot.id);
      
      // Add deliverables and hoverDetails fields if missing
      const updates = {};
      
      if (!data.deliverables) {
        // Add default deliverables based on service type
        const defaultDeliverables = {
          'social-media': ['Content calendar', 'Post design', 'Caption writing', 'Scheduling support', 'Monthly analytics'],
          'graphic-design': ['Logo concepts', 'Color palette', 'Typography system', 'Brand guidelines', 'Social media kit'],
          'video-editing': ['Video editing', 'Color grading', 'Sound design', 'Motion graphics', 'Platform optimization'],
          'digital-marketing': ['Campaign strategy', 'Ad creative', 'Landing page design', 'Performance tracking', 'A/B testing'],
          'website-design': ['Responsive design', 'UI/UX design', 'Development', 'SEO optimization', 'Analytics setup']
        };
        
        const serviceKey = Object.keys(defaultDeliverables).find(key => 
          data.id?.includes(key) || data.title?.toLowerCase().includes(key.replace('-', ' '))
        );
        
        if (serviceKey) {
          updates.deliverables = defaultDeliverables[serviceKey];
          console.log(`  Added deliverables to: ${docSnapshot.id}`);
        }
      }
      
      if (!data.hoverDetails) {
        // Add default hover details
        const defaultHoverDetails = {
          'social-media': 'Includes: 30 Posts/Stories/Reels, Branded Templates, Caption Writing, Scheduling, and Analytics Reporting.',
          'graphic-design': 'Includes: Logo Concepts, Color System, Typography, Brand Guidelines, and Social Media Assets.',
          'video-editing': 'Includes: Professional Editing, Color Grading, Sound Design, Motion Graphics, and Platform Optimization.',
          'digital-marketing': 'Includes: Campaign Strategy, Ad Creative, Landing Page Design, Performance Tracking, and A/B Testing.',
          'website-design': 'Includes: Responsive Design, UI/UX, Development, SEO Optimization, and Analytics Setup.'
        };
        
        const serviceKey = Object.keys(defaultHoverDetails).find(key => 
          data.id?.includes(key) || data.title?.toLowerCase().includes(key.replace('-', ' '))
        );
        
        if (serviceKey) {
          updates.hoverDetails = defaultHoverDetails[serviceKey];
          console.log(`  Added hoverDetails to: ${docSnapshot.id}`);
        }
      }
      
      // Remove badge from non-website-design services
      if (data.badge && !data.id?.includes('website') && !data.title?.toLowerCase().includes('website')) {
        updates.badge = null;
        console.log(`  Removed badge from: ${docSnapshot.id}`);
      }
      
      if (Object.keys(updates).length > 0) {
        batch.update(docRef, updates);
        updatedCount++;
      }
    });

    if (updatedCount > 0) {
      await batch.commit();
      console.log(`✅ Updated ${updatedCount} service documents`);
    } else {
      console.log('No service updates needed');
    }
  } catch (error) {
    console.error('❌ Error updating services:', error);
    throw error;
  }
}

async function verifyPortfolioFields() {
  console.log('\n=== Verifying Portfolio Fields ===');
  
  try {
    const querySnapshot = await db.collection('portfolio').get();
    const batch = db.batch();
    let updatedCount = 0;

    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      const docRef = db.collection('portfolio').doc(docSnapshot.id);
      
      const updates = {};
      
      // Ensure title field exists
      if (!data.title) {
        updates.title = data.name || docSnapshot.id;
        console.log(`  Added title to: ${docSnapshot.id}`);
      }
      
      // Ensure service field exists
      if (!data.service) {
        updates.service = data.category || 'General';
        console.log(`  Added service to: ${docSnapshot.id}`);
      }
      
      // Ensure industry field exists
      if (!data.industry) {
        updates.industry = 'Various';
        console.log(`  Added industry to: ${docSnapshot.id}`);
      }
      
      if (Object.keys(updates).length > 0) {
        batch.update(docRef, updates);
        updatedCount++;
      }
    });

    if (updatedCount > 0) {
      await batch.commit();
      console.log(`✅ Verified and updated ${updatedCount} portfolio documents`);
    } else {
      console.log('All portfolio documents have required fields');
    }
  } catch (error) {
    console.error('❌ Error verifying portfolio:', error);
    throw error;
  }
}

async function runAllUpdates() {
  console.log('Starting Firestore data updates...\n');
  
  try {
    await updatePricingCollection();
    await updateContentCollection();
    await updateServicesCollection();
    await verifyPortfolioFields();
    
    console.log('\n✅ All Firestore updates completed successfully');
  } catch (error) {
    console.error('\n❌ Updates failed:', error);
    process.exit(1);
  }
}

runAllUpdates().then(() => {
  console.log('\nScript completed successfully');
  process.exit(0);
}).catch((error) => {
  console.error('Script failed:', error);
  process.exit(1);
});
