import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js';
import { getFirestore, setDoc, doc } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js';

// Importation de la configuration Firebase
import { auth, db } from './firebaseConfig.js';

// Initialiser l'UI
function initializeUI() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            document.getElementById('authSection').style.display = 'none';
            document.getElementById('mainSection').style.display = 'block';
            loadUserProducts(); // Fonction non définie ici, mais probablement définie ailleurs
        } else {
            document.getElementById('authSection').style.display = 'block';
            document.getElementById('mainSection').style.display = 'none';
        }
    });
}

// Appeler l'initialisation de l'UI lorsque la page est chargée
window.onload = () => {
    initializeUI();
};

// Soumission du formulaire d'inscription
document.getElementById('signupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            setDoc(doc(db, 'users', user.uid), {
                firstName,
                lastName,
                phone,
                email
            }).then(() => {
                displayMessage('success', 'Inscription réussie !');
                document.getElementById('signupForm').reset();
            }).catch((error) => {
                displayMessage('error', `Erreur lors de l'enregistrement des informations: ${error.message}`);
            });
        })
        .catch((error) => {
            displayMessage('error', `Erreur d'inscription: ${error.message}`);
        });
});

// Soumission du formulaire de connexion
document.getElementById('signInForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('signInEmail').value.trim();
    const password = document.getElementById('signInPassword').value.trim();
    
    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            displayMessage('success', 'Connexion réussie !');
        })
        .catch((error) => {
            displayMessage('error', `Erreur de connexion: ${error.message}`);
        });
});

// Déconnexion de l'utilisateur
document.getElementById('signOutButton').addEventListener('click', () => {
    signOut(auth).then(() => {
        displayMessage('success', 'Déconnexion réussie !');
    }).catch((error) => {
        displayMessage('error', `Erreur de déconnexion: ${error.message}`);
    });
});

// Fonction pour afficher les messages
function displayMessage(type, message) {
    const messageBox = document.getElementById('messageBox');
    messageBox.classList.remove('hidden', 'bg-red-100', 'bg-green-100', 'text-red-700', 'text-green-700');
    messageBox.classList.add(type === 'error' ? 'bg-red-100' : 'bg-green-100', type === 'error' ? 'text-red-700' : 'text-green-700');
    messageBox.textContent = message;

    setTimeout(() => {
        messageBox.classList.add('hidden');
    }, 2000);
}

// Fonction de validation des champs
function validateFields(fields) {
    for (const [field, value] of Object.entries(fields)) {
        const errorMessage = validateField(field, value);
        if (errorMessage) {
            return errorMessage;
        }
    }
    return '';
}

// Fonction pour valider un champ spécifique
function validateField(field, value) {
    if (!value || value.trim() === '') {
        return `Le champ ${field} est requis.`;
    }
    if (field === 'firstName' || field === 'lastName') {
        if (value.length < 3 || value.length > 50) {
            return `Le ${field} doit contenir entre 3 et 50 caractères.`;
        }
    }
    if (field === 'phone') {
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(value)) {
            return 'Le téléphone doit être un numéro valide à 10 chiffres.';
        }
    }
    if (field === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return 'L\'email doit être une adresse valide.';
        }
    }
    if (field === 'password') {
        if (value.length < 6) {
            return 'Le mot de passe doit contenir au moins 6 caractères.';
        }
    }
    return '';
}
