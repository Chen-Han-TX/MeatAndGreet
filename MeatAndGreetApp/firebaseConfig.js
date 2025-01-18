import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';



const firebaseConfig = {
  apiKey: "AIzaSyCyIL9TnCgSwLJQXw_mhuGSO9_jiza7jdg",
  authDomain: "meatandgreet-9fa59.firebaseapp.com",
  projectId: "meatandgreet-9fa59",
  storageBucket: "meatandgreet-9fa59.firebasestorage.app",
  messagingSenderId: "15482562834",
  appId: "1:15482562834:web:fdd6b66aaded0849e16bcb",
  measurementId: "G-V0KMDHXKKL"
};



const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

