// src/firebase.js

// Import the necessary functions from Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyD9jHfwe6bp7JKgbcyCAqHIVG4iFlEdrFg",
    authDomain: "inclusive-job-portal-d91bb.firebaseapp.com",
    projectId: "inclusive-job-portal-d91bb",
    storageBucket: "inclusive-job-portal-d91bb.appspot.com",
    messagingSenderId: "760284128672",
    appId: "1:760284128672:web:02ee561ecc525b853fb0c5",
    measurementId: "G-711X5FRCNK"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
