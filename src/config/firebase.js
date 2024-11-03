 // src/configuration/firebase.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Import Firestore

const firebaseConfig = {
  apiKey: "AIzaSyCdyCN5o0gS7NcEUKYFPji2KkkWRLWan4s",
  authDomain: "hackathonmid-b24c3.firebaseapp.com",
  projectId: "hackathonmid-b24c3",
  storageBucket: "hackathonmid-b24c3.firebasestorage.app",
  messagingSenderId: "864908403666",
  appId: "1:864908403666:web:13f15d7d668c279c4b5e0b",
  measurementId: "G-BEWSV90T6V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
const db = getFirestore(app); // Initialize Firestore

export { app, analytics, db }; // Export Firestore for use in other parts of your app
