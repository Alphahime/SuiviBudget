import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js';

// Configuration Firebase
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
const db = getFirestore(app);
const rtdb = getDatabase(app);

export { auth, db, rtdb };
