/* firebase.js */
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBG_54h3xkGoGwfX_3kFLRUciTdEkmkrvA",
  authDomain: "shakzztv-de597.firebaseapp.com",
  databaseURL: "https://shakzztv-de597-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "shakzztv-de597",
  storageBucket: "shakzztv-de597.firebasestorage.app",
  messagingSenderId: "841207969238",
  appId: "1:841207969238:web:4f173cc794f99494c5e077",
  measurementId: "G-FZQTKE7STD"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

export default app;