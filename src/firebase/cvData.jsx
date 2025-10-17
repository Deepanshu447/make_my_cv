import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from './config';

// Save CV data to Firestore
export const saveCVData = async (userId, cvData) => {
  try {
    await setDoc(doc(db, 'cvData', userId), {
      ...cvData,
      userId,
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    // Handle offline mode gracefully
    if (error.message.includes('offline') || error.message.includes('network')) {
      console.warn('Firestore offline - data will sync when connection is restored');
      return { success: false, error: 'offline', offline: true };
    }
    return { success: false, error: error.message };
  }
};

// Get CV data from Firestore
export const getCVData = async (userId) => {
  try {
    const docRef = doc(db, 'cvData', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() };
    } else {
      return { success: true, data: null };
    }
  } catch (error) {
    // Handle offline mode gracefully
    if (error.message.includes('offline') || error.message.includes('network')) {
      console.warn('Firestore offline - data will sync when connection is restored');
      return { success: false, error: 'offline', offline: true };
    }
    return { success: false, error: error.message };
  }
};

// Save CV request for admin review
export const saveCVRequest = async (requestData) => {
  try {
    const docRef = await addDoc(collection(db, 'cvRequests'), {
      ...requestData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get CV requests for admin
export const getCVRequests = async () => {
  try {
    const q = query(
      collection(db, 'cvRequests'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const requests = [];
    querySnapshot.forEach((doc) => {
      requests.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data: requests };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update CV request status
export const updateCVRequestStatus = async (requestId, status) => {
  try {
    await setDoc(doc(db, 'cvRequests', requestId), {
      status,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get user's CV requests
export const getUserCVRequests = async (userId) => {
  try {
    const q = query(
      collection(db, 'cvRequests'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const requests = [];
    querySnapshot.forEach((doc) => {
      requests.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data: requests };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
