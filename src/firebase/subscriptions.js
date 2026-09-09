import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

// Create-only collection: subscribers can never query other people's emails.
export async function subscribeToNewsletter(value) {
  const email = value.trim().toLowerCase();
  if (email.length > 180 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Invalid email');
  const key = 'creatifybd-newsletter-requested';
  let requested = false;
  try { requested = sessionStorage.getItem(key) === email; } catch { /* Storage can be disabled. */ }
  if (requested) return;
  await addDoc(collection(db, 'subscribers'), { email, status: 'pending', consent: true, subscribedAt: serverTimestamp() });
  try { sessionStorage.setItem(key, email); } catch { /* Submission already succeeded. */ }
}
