import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCaCFvFyqfox3LOzTilSRFJ2pXZr75H7Po",
  authDomain: "tripmosaic-2925b.firebaseapp.com",
  projectId: "tripmosaic-2925b",
  storageBucket: "tripmosaic-2925b.firebasestorage.app",
  messagingSenderId: "912611086795",
  appId: "1:912611086795:web:9d62cba8789554e4e8a64e",
  measurementId: "G-SYP4MBXKQC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
