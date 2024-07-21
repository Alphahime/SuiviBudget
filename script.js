import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getDatabase, ref, push, update, remove, onValue } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js";


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.addEventListener('DOMContentLoaded', () => {
    const addExpenseForm = document.getElementById('add-expense-form');
    const taskList = document.getElementById('task-list');
    const shoppingList = document.getElementById('shopping-list-tasks');
    const totalAmountElement = document.getElementById('total-amount');

    addExpenseForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const productName = document.getElementById('product-name').value.trim();
        const productPrice = parseFloat(document.getElementById('product-price').value);
        const productQuantity = parseInt(document.getElementById('product-quantity').value);
        const productDate = document.getElementById('product-date').value;

        if (validateForm(productName, productPrice, productQuantity, productDate)) {
            addExpense(productName, productPrice, productQuantity, productDate);
            addExpenseForm.reset();
            toggleAddExpenseForm(); // Masquer le formulaire après ajout
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

        update(newExpenseRef, {
            name: name,
            price: price,
            quantity: quantity,
            date: date,
            bought: false // Initial value
        })
        .then(() => {
            showMessage('success', 'Dépense ajoutée avec succès !');
            displayExpenses();
        })
        .catch(error => {
            console.error('Error adding expense:', error);
            showMessage('error', 'Erreur lors de l\'ajout de la dépense : ' + error.message);
        });
    }

    function displayExpenses() {
        onValue(ref(db, 'expenses'), snapshot => {
            taskList.innerHTML = '';
            shoppingList.innerHTML = '';
            let totalAmount = 0;

            snapshot.forEach(childSnapshot => {
                const expense = childSnapshot.val();
                totalAmount += expense.price * expense.quantity;
                const expenseElement = createExpenseElement(childSnapshot.key, expense);
                const shoppingListElement = createExpenseElement(childSnapshot.key, expense, true);
                taskList.appendChild(expenseElement);
                shoppingList.appendChild(shoppingListElement);
            });

            totalAmountElement.innerText = ` Total ${totalAmount} XOF`;
            attachEventHandlers();
        });
    }
    function createExpenseElement(id, expense, forShoppingList = false) {
        const expenseElement = document.createElement('div');
        expenseElement.classList.add('expense');
        if (expense.bought) {
            expenseElement.classList.add('checked');
        }
        expenseElement.innerHTML = `
            <h3>${expense.name}</h3>
            <p>Prix: ${expense.price} xof</p>
            <p>Quantité: ${expense.quantity}</p>
            <p>Date: ${expense.date}</p>
            <input type="checkbox" class="mark-as-bought" data-id="${id}" ${expense.bought ? 'checked' : ''}>
            ${forShoppingList ? `
                <div class="actions">
                    <button class="edit" data-id="${id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete" data-id="${id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>` : ''}
        `;
        return expenseElement;
    }
    

    function attachEventHandlers() {
        const deleteButtons = document.querySelectorAll('.delete');
        const editButtons = document.querySelectorAll('.edit');
        const markAsBoughtCheckboxes = document.querySelectorAll('.mark-as-bought');

        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                deleteExpense(id);
            });
        });

        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                editExpense(id);
            });
        });

        markAsBoughtCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const id = this.getAttribute('data-id');
                const bought = this.checked;
                updateExpenseStatus(id, bought);
            });
        });
    }

    function deleteExpense(id) {
        remove(ref(db, `expenses/${id}`))
        .then(() => {
            showMessage('success', 'Dépense supprimée avec succès !');
            displayExpenses();
        })
        .catch(error => {
            console.error('Error deleting expense:', error);
            showMessage('error', 'Erreur lors de la suppression de la dépense : ' + error.message);
        });
    }

    function editExpense(id) {
        const expenseRef = ref(db, `expenses/${id}`);
        onValue(expenseRef, snapshot => {
            const expense = snapshot.val();
            document.getElementById('product-name').value = expense.name;
            document.getElementById('product-price').value = expense.price;
            document.getElementById('product-quantity').value = expense.quantity;
            document.getElementById('product-date').value = expense.date;
            toggleAddExpenseForm(); // Afficher le formulaire pour la modification
            document.getElementById('add-expense-form').onsubmit = function(event) {
                event.preventDefault();
                const updatedName = document.getElementById('product-name').value.trim();
                const updatedPrice = parseFloat(document.getElementById('product-price').value);
                const updatedQuantity = parseInt(document.getElementById('product-quantity').value);
                const updatedDate = document.getElementById('product-date').value;
                if (validateForm(updatedName, updatedPrice, updatedQuantity, updatedDate)) {
                    updateExpense(id, updatedName, updatedPrice, updatedQuantity, updatedDate);
                }
            };
        });
    }
    
    function updateExpense(id, name, price, quantity, date) {
        const expenseRef = ref(db, `expenses/${id}`);
        update(expenseRef, {
            name: name,
            price: price,
            quantity: quantity,
            date: date
        })
        .then(() => {
            showMessage('success', 'Dépense mise à jour avec succès !');
            displayExpenses();
            document.getElementById('add-expense-form').reset();
            document.getElementById('add-expense-form').onsubmit = submitExpenseForm;
            toggleAddExpenseForm(); // Masquer le formulaire après mise à jour
        })
        .catch(error => {
            console.error('Error updating expense:', error);
            showMessage('error', 'Erreur lors de la mise à jour de la dépense : ' + error.message);
        });
    }
    

    function updateExpenseStatus(id, bought) {
        const expenseRef = ref(db, `expenses/${id}`);
        update(expenseRef, { bought: bought })
        .then(() => {
            displayExpenses();
        })
        .catch(error => {
            console.error('Error updating expense status:', error);
            showMessage('error', 'Erreur lors de la mise à jour du statut de la dépense : ' + error.message);
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

    function toggleAddExpenseForm() {
        const addExpenseSection = document.getElementById('add-expense-section');
        addExpenseSection.classList.toggle('hidden');
    }

    function submitExpenseForm(event) {
        event.preventDefault();
        const productName = document.getElementById('product-name').value.trim();
        const productPrice = parseFloat(document.getElementById('product-price').value);
        const productQuantity = parseInt(document.getElementById('product-quantity').value);
        const productDate = document.getElementById('product-date').value;
        if (validateForm(productName, productPrice, productQuantity, productDate)) {
            addExpense(productName, productPrice, productQuantity, productDate);
            addExpenseForm.reset();
            toggleAddExpenseForm(); // Masquer le formulaire après ajout
        }
    }

    displayExpenses();
});
