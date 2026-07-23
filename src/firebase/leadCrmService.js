import { doc, getDoc, setDoc, getDocs, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

const COLLECTION_NAME = 'lead_crm';

/**
 * Sanitize lead ID to ensure it's a valid Firestore doc ID string
 */
export const getCleanDocId = (lead) => {
  if (!lead) return null;
  if (lead.id) return String(lead.id).replace(/[/\\#?]/g, '_');
  if (lead.website) return String(lead.website).toLowerCase().replace(/https?:\/\//, '').replace(/[/\\#?]/g, '_');
  if (lead.name) return String(lead.name).toLowerCase().replace(/[^a-z0-9]/g, '_');
  return null;
};

/**
 * Save complete lead record (audit, status, remarks, saved images) to Firestore
 */
export const saveLeadRecordToFirestore = async (lead, auditResult, status = 'Audited', remarks = '', savedImages = {}) => {
  const docId = getCleanDocId(lead);
  if (!docId) return;

  try {
    const docRef = doc(db, COLLECTION_NAME, docId);
    const dataToSave = {
      leadId: lead.id || docId,
      name: lead.name || '',
      website: lead.website || '',
      country: lead.country || '',
      type: lead.type || '',
      status: status || 'Audited',
      audit: auditResult || null,
      remarks: remarks || '',
      savedImages: savedImages || {},
      updatedAt: serverTimestamp(),
      auditedAt: auditResult ? serverTimestamp() : null
    };

    await setDoc(docRef, dataToSave, { merge: true });
    return docId;
  } catch (err) {
    console.error('Failed to save lead record to Firestore:', err);
  }
};

/**
 * Fetch all saved lead records (audits, statuses, remarks, images) from Firestore
 */
export const fetchAllLeadRecordsFromFirestore = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const recordsMap = {};
    querySnapshot.forEach((docSnap) => {
      recordsMap[docSnap.id] = { id: docSnap.id, ...docSnap.data() };
    });
    return recordsMap;
  } catch (err) {
    console.error('Failed to fetch lead records from Firestore:', err);
    return {};
  }
};

/**
 * Update lead status, remarks, or saved images in Firestore
 */
export const updateLeadStatusAndRemarksInFirestore = async (lead, updates) => {
  const docId = getCleanDocId(lead);
  if (!docId) return;

  try {
    const docRef = doc(db, COLLECTION_NAME, docId);
    await setDoc(docRef, {
      ...updates,
      leadId: lead.id || docId,
      name: lead.name || '',
      website: lead.website || '',
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    console.error('Failed to update lead in Firestore:', err);
  }
};
