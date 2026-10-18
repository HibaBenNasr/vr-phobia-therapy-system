// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAx7hIP7WiNi9to57X8aK8D1ShdOROWtvc",
  authDomain: "phobia-management-2ef56.firebaseapp.com",
  databaseURL:
    "https://phobia-management-2ef56-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "phobia-management-2ef56",
  storageBucket: "phobia-management-2ef56.firebasestorage.app",
  messagingSenderId: "336164362243",
  appId: "1:336164362243:web:c6fe6bc571f4cc31bad636",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);
export const RTdatabase = getDatabase(app); // ✅ modular way
export default app;
