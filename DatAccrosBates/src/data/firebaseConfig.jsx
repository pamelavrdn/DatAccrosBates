// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDAMd3FHL6CiURS553R2oeH2i7-b8IUuvk",
  authDomain: "dataccrobates.firebaseapp.com",
  projectId: "dataccrobates",
  storageBucket: "dataccrobates.appspot.com",
  messagingSenderId: "882118669890",
  appId: "1:882118669890:web:fe8803a44dbb1f513d9fdb",
  measurementId: "G-JHPF1GKHJ2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, firestore, auth, storage }; 
