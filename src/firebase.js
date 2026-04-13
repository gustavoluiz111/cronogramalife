import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDoAoPp8kSd2juo-jZ0F6_Do_lMQaKQJF4",
  authDomain: "cronogama-life.firebaseapp.com",
  databaseURL: "https://cronogama-life-default-rtdb.firebaseio.com",
  projectId: "cronogama-life",
  storageBucket: "cronogama-life.firebasestorage.app",
  messagingSenderId: "198620344328",
  appId: "1:198620344328:web:22e994fa0332f78e5ce1bd",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
