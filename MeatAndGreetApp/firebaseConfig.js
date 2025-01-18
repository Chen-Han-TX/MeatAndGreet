import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyD5IlKHh7aQF7mOqwdHjN7mpPP1aeGoB3k',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'meatandgreet-9fa59',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: '1:15482562834:android:46fad70247a9bca7e16bcb',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
