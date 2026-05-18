import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './config';
import { toast } from 'react-hot-toast';

// Helper for error handling
const handleServiceError = (error, customMsg) => {
  console.error(`Firebase Service Error [${customMsg}]:`, error);
  toast.error(customMsg || 'An error occurred with the database.');
  throw error;
};

// --- Messages / Contact Form ---
export const sendMessage = async (messageData) => {
  try {
    const docRef = await addDoc(collection(db, 'messages'), {
      ...messageData,
      createdAt: serverTimestamp(),
      status: 'unread'
    });
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
    await updateDoc(docRef, {
      ...settingsData,
      updatedAt: serverTimestamp()
    });
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
