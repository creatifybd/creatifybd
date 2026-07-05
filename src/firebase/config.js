import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore, initializeFirestore, persistentLocalCache, persistentSingleTabManager } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Firebase web config is public client configuration; env vars can still override it per deployment.
const hostedFirebaseConfig = {
  apiKey: "AIzaSyDvwzLMJ-TQGJX4pnCpl1RlRo5aDSQU6l4",
  authDomain: "creatify-bd.firebaseapp.com",
  projectId: "creatify-bd",
  storageBucket: "creatify-bd.firebasestorage.app",
  messagingSenderId: "365570308132",
  appId: "1:365570308132:web:47c328634ce4e2d148c0b1",
  measurementId: "G-C9RJV5QFZM"
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || hostedFirebaseConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || hostedFirebaseConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || hostedFirebaseConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || hostedFirebaseConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || hostedFirebaseConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || hostedFirebaseConfig.appId,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || hostedFirebaseConfig.measurementId
};

// Initialize Firebase (Singleton pattern)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// App Check: proves requests come from our real web app, blocking scripted/
// automated abuse of Firestore & Storage before it ever reaches security
// rules. The site key below is a PUBLIC reCAPTCHA v3 key (safe to ship in
// client code) — it only works after the matching provider + secret key are
// registered in Firebase Console > App Check, and enforcement is turned on
// there for Firestore and Storage.
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6Lfc3EUtAAAAALbafWS5uNIrwh56ihRkm1M_MEgn";

if (import.meta.env.DEV) {
  // Lets local/dev builds pass App Check without a real reCAPTCHA challenge.
  // Register the auto-generated debug token in Firebase Console > App Check
  // > Apps > (this app) > Manage debug tokens, using the token printed in
  // the browser console on first run.
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

try {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(RECAPTCHA_SITE_KEY),
    isTokenAutoRefreshEnabled: true
  });
} catch (error) {
  if (import.meta.env.DEV) console.warn('App Check failed to initialize:', error);
}

// Initialize Services
let db;
try {
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentSingleTabManager()
    })
  });
} catch (error) {
  db = getFirestore(app);
}
const auth = getAuth(app);
const storage = getStorage(app);

// Analytics (with support check)
let analytics = null;
isSupported().then(yes => {
  if (yes) analytics = getAnalytics(app);
});

export { db, auth, storage, analytics };
export default app;


