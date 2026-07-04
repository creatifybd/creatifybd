import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth } from './config';
import { toast } from 'react-hot-toast';

// Helper for error handling
const handleServiceError = (error, customMsg) => {
  console.error(`Firebase Service Error [${customMsg}]:`, error);
  toast.error(customMsg || 'An error occurred with the database.');
  throw error;
};

// --- Messages / Contact Form ---
export const sendMessage = async (messageData) => {
  // Basic client-side rate limiting: max 1 submission per 60 seconds per session
  const lastSentKey = 'creatifybd_last_msg';
  const lastSent = parseInt(sessionStorage.getItem(lastSentKey) || '0', 10);
  const now = Date.now();
  if (now - lastSent < 60000) {
    const waitSec = Math.ceil((60000 - (now - lastSent)) / 1000);
    throw new Error(`Please wait ${waitSec}s before sending another message.`);
  }

  try {
    const docRef = await addDoc(collection(db, 'messages'), {
      name: messageData.name?.trim().slice(0, 120) || '',
      email: messageData.email?.trim().slice(0, 180) || '',
      phone: messageData.phone?.trim().slice(0, 30) || '',
      company: messageData.company?.trim().slice(0, 150) || '',
      service: messageData.service || '',
      budget: messageData.budget || '',
      message: messageData.message?.trim().slice(0, 3000) || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: 'unread',
      read: false
    });
    sessionStorage.setItem(lastSentKey, String(now));
    return docRef.id;
  } catch (error) {
    handleServiceError(error, 'Failed to send message.');
  }
};

export const getMessages = async () => {
  try {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleServiceError(error, 'Failed to fetch messages.');
  }
};

// --- Settings ---
export const getSettings = async (docName = 'site') => {
  try {
    const docRef = doc(db, 'settings', docName);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    handleServiceError(error, 'Failed to fetch settings.');
  }
};

export const updateSettings = async (settingsData, docName = 'site') => {
  try {
    const docRef = doc(db, 'settings', docName);
    await setDoc(docRef, {
      ...settingsData,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    handleServiceError(error, 'Failed to update settings.');
  }
};

// --- General CRUD (For Portfolio, Services, Testimonials) ---
export const getData = async (collectionName) => {
  try {
    const q = query(collection(db, collectionName));
    const querySnapshot = await getDocs(q);
    const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return docs.sort((a, b) => {
      const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
      const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
      return timeB - timeA;
    });
  } catch (error) {
    handleServiceError(error, `Failed to fetch ${collectionName}.`);
  }
};

export const addData = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp()
    });
    toast.success(`Successfully added to ${collectionName}!`);
    return docRef.id;
  } catch (error) {
    handleServiceError(error, `Failed to add to ${collectionName}.`);
  }
};

export const updateData = async (collectionName, id, data) => {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    toast.success('Updated successfully!');
  } catch (error) {
    handleServiceError(error, 'Update failed.');
  }
};

export const deleteData = async (collectionName, id) => {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
    toast.success('Deleted successfully!');
  } catch (error) {
    handleServiceError(error, 'Deletion failed.');
  }
};

// --- Activity Log ---
// Lightweight audit trail: records who did what, on which resource, and when.
// Never blocks the calling action if writing the log entry fails.
export const logActivity = async ({ action, resource, resourceId, details }) => {
  try {
    const actorEmail = auth.currentUser?.email || 'unknown';
    await addDoc(collection(db, 'activity_log'), {
      action,
      resource,
      resourceId: resourceId ?? null,
      details: details ?? '',
      actorEmail,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Failed to record activity log entry:', error);
  }
};

export const getActivityLog = async (rowLimit = 200) => {
  try {
    const q = query(collection(db, 'activity_log'), orderBy('createdAt', 'desc'), limit(rowLimit));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleServiceError(error, 'Failed to fetch activity log.');
  }
};
