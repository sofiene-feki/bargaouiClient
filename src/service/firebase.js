// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA37XJogNB_PokHRUAWBPZINx5wH8K9_24",
  authDomain: "supersiesta-69c7e.firebaseapp.com",
  projectId: "supersiesta-69c7e",
  storageBucket: "supersiesta-69c7e.firebasestorage.app",
  messagingSenderId: "620699181278",
  appId: "1:620699181278:web:92799be8431088d992e24f",
  measurementId: "G-S30ECZRR34",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
