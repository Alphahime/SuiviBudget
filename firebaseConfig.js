// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Votre configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAJU9Fc6D5tmEB_8i-53eSggXiPOyUv1Cs",
    authDomain: "authentification-2a14e.firebaseapp.com",
    databaseURL: "https://authentification-2a14e-default-rtdb.firebaseio.com",
    projectId: "authentification-2a14e",
    storageBucket: "authentification-2a14e.appspot.com",
    messagingSenderId: "748859471064",
    appId: "1:748859471064:web:ae8fe46bec4401c34f53ad"
  };

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged };
