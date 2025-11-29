import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase project configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Validate Firebase configuration
const isConfigValid = Object.values(firebaseConfig).every(value => value && value !== 'undefined');

if (!isConfigValid) {
  console.error('❌ Firebase configuration is missing or incomplete!');
  console.error('Please set the following environment variables in your .env file:');
  console.error('- VITE_FIREBASE_API_KEY');
  console.error('- VITE_FIREBASE_AUTH_DOMAIN');
  console.error('- VITE_FIREBASE_PROJECT_ID');
  console.error('- VITE_FIREBASE_STORAGE_BUCKET');
  console.error('- VITE_FIREBASE_MESSAGING_SENDER_ID');
  console.error('- VITE_FIREBASE_APP_ID');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with better offline handling
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Export flag for checking if Firebase is configured
export const isFirebaseConfigured = isConfigValid;
