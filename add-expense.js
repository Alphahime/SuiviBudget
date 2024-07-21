import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getDatabase, ref, push, set, update, remove, onValue } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDZ0SmJGwjxI5qe71g_dqZdBbqcE6ptgHw",
    authDomain: "budget-8005b.firebaseapp.com",
    databaseURL: "https://budget-8005b-default-rtdb.firebaseio.com",
    projectId: "budget-8005b",
    storageBucket: "budget-8005b.appspot.com",
    messagingSenderId: "47731293514",
    appId: "1:47731293514:web:69ac0c81b184124ee595b3",
    measurementId: "G-66WYZ6ZXSR"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.addEventListener('DOMContentLoaded', () => {
    const addExpenseForm = document.getElementById('add-expense-form');

    addExpenseForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const productName = document.getElementById('product-name').value.trim();
        const productPrice = parseFloat(document.getElementById('product-price').value);
        const productQuantity = parseInt(document.getElementById('product-quantity').value);
        const productDate = document.getElementById('product-date').value;

        if (validateForm(productName, productPrice, productQuantity, productDate)) {
            addExpense(productName, productPrice, productQuantity, productDate);
            addExpenseForm.reset();
        }
    });

    function validateForm(name, price, quantity, date) {
        if (name === '') {
            showMessage('error', 'Le nom du produit est requis.');
            return false;
        }
        if (isNaN(price) || price <= 0) {
            showMessage('error', 'Le prix doit être un nombre positif.');
            return false;
        }
        if (isNaN(quantity) || quantity <= 0) {
            showMessage('error', 'La quantité doit être un nombre positif.');
            return false;
        }
        if (date === '') {
            showMessage('error', 'La date est requise.');
            return false;
        }
        return true;
    }

    function addExpense(name, price, quantity, date) {
        const newExpenseRef = push(ref(db, 'expenses'));

        set(newExpenseRef, {
            name: name,
            price: price,
            quantity: quantity,
            date: date,
            bought: false // Valeur initiale
        })
        .then(() => {
            showMessage('success', 'Dépense ajoutée avec succès !');
            window.location.href = 'index.html'; // Redirection vers index.html
        })
        .catch(error => {
            console.error('Error adding expense:', error);
            showMessage('error', 'Erreur lors de l\'ajout de la dépense : ' + error.message);
        });
    }

    function showMessage(type, message) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.innerText = message;
        document.body.appendChild(messageElement);
        setTimeout(() => {
            messageElement.remove();
        }, 3000);
    }
});
