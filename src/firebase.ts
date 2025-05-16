import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCtwBywTDMQxd7dxT1IgfdtsxLHXxGM7TI",
  authDomain: "crm-system-7149a.firebaseapp.com",
  projectId: "crm-system-7149a",
  storageBucket: "crm-system-7149a.firebasestorage.app",
  messagingSenderId: "372258901095",
  appId: "1:372258901095:web:cf045191636994cd73d8c2"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
