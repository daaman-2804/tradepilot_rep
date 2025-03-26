// Import the functions you need from the SDKs you need

import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"; // Import createUserWithEmailAndPassword
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBde4tMiHzsNzy-vf9uF1qwCc7k5mOHK64",
  authDomain: "tradepilot-f904e.firebaseapp.com",
  projectId: "tradepilot-f904e",
  storageBucket: "tradepilot-f904e.firebasestorage.app",
  messagingSenderId: "589175465952",
  appId: "1:589175465952:web:0558d1df033c022fb2ad85",
  measurementId: "G-MST1DLT0RB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, signInWithEmailAndPassword, createUserWithEmailAndPassword }; // Export createUserWithEmailAndPassword