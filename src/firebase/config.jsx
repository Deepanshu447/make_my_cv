import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFrsf5Kz7x-GFJPF6yBft8PMfrNxQbxE0",
  authDomain: "resume-cv-builder-69362.firebaseapp.com",
  projectId: "resume-cv-builder-69362",
  storageBucket: "resume-cv-builder-69362.firebasestorage.app",
  messagingSenderId: "719167058533",
  appId: "1:719167058533:web:62d172ff4679cc82e14c8c",
  measurementId: "G-0Z752FDWHN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Analytics (only in production)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;