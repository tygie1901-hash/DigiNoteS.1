// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";    
// TODO: Add SDKs for Firebase products that you want to use
//https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDkBfzyZinzQVmvnJyOyDZ5LvFdcEDCbIM",
  authDomain: "diginotes-627c4.firebaseapp.com",
  projectId: "diginotes-627c4",
  storageBucket: "diginotes-627c4.firebasestorage.app",
  messagingSenderId: "603479128753",
  appId: "1:603479128753:web:3d4d0b5c587ca9d8548090",
  measurementId: "G-RPDRXZY6JH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);