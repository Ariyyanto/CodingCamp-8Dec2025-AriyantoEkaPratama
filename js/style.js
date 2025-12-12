// Data untuk menyimpan todo items
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all'; // all, active, completed

// DOM Elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoDate = document.getElementById('todo-date');
const todoList = document.getElementById('todo-list');
const clearAllBtn = document.getElementById('clear-all');
const filterBtn = document.getElementById('filter-todos');

// Set min date untuk input tanggal (hari ini)
const today = new Date().toISOString().split('T')[0];
todoDate.min = today;

// Initialize aplikasi
document.addEventListener('DOMContentLoaded', function () {
    renderTodos();

    // Event listener untuk form
    todoForm.addEventListener('submit', function (e) {
        e.preventDefault();
        addTodo();
    });

    // Event listener untuk clear all button
    clearAllBtn.addEventListener('click', resetTodos);

    // Event listener untuk filter button
    filterBtn.addEventListener('click', toggleFilter);
});

// Fungsi untuk menambahkan todo
function addTodo() {
    const todoText = todoInput.value.trim();
    const todoDueDate = todoDate.value;

    if (todoText === '') {
        alert('Please enter a todo item!');
        return;
    }

    // Buat objek todo baru
    const newTodo = {
        id: Date.now(),
        text: todoText,
        date: todoDueDate || 'No date set',
        completed: false,
        createdAt: new Date().toISOString()
    };

    // Tambahkan ke array todos
    todos.push(newTodo);

    // Simpan ke localStorage
    saveTodos();

    // Render ulang daftar todos
    renderTodos();

    // Reset form
    todoForm.reset();
    todoDate.min = today; // Reset min date
}

// Fungsi untuk menghapus todo
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

// Fungsi untuk menandai todo sebagai selesai
function toggleComplete(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });

    saveTodos();
    renderTodos();
}

// Fungsi untuk menghapus semua todos
function resetTodos() {
    if (todos.length === 0) {
        alert('No todos to clear!');
        return;
    }

    if (confirm('Are you sure you want to clear all todos?')) {
        todos = [];
        saveTodos();
        renderTodos();
    }
}

// Fungsi untuk toggle filter
function toggleFilter() {
    // Cycle melalui filter: all -> active -> completed -> all
    if (currentFilter === 'all') {
        currentFilter = 'active';
        filterBtn.textContent = 'Filter Todos (Active)';
    } else if (currentFilter === 'active') {
        currentFilter = 'completed';
        filterBtn.textContent = 'Filter Todos (Completed)';
    } else {
        currentFilter = 'all';
        filterBtn.textContent = 'Filter Todos (All)';
    }

    renderTodos();
}

// Fungsi untuk render todos berdasarkan filter
function renderTodos() {
    // Filter todos berdasarkan currentFilter
    let filteredTodos = [];

    if (currentFilter === 'active') {
        filteredTodos = todos.filter(todo => !todo.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(todo => todo.completed);
    } else {
        filteredTodos = todos;
    }

    // Jika tidak ada todos
    if (filteredTodos.length === 0) {
        let message = '';
        if (currentFilter === 'all' && todos.length === 0) {
            message = 'No todos available. Add your first todo above!';
        } else if (currentFilter === 'active') {
            message = 'No active todos. Great job!';
        } else if (currentFilter === 'completed') {
            message = 'No completed todos yet.';
        }

        todoList.innerHTML = `<li class="empty-state">${message}</li>`;
        return;
    }

    // Render todos
    todoList.innerHTML = '';

    filteredTodos.forEach(todo => {
        const todoItem = document.createElement('li');
        todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;

        todoItem.innerHTML = `
            <div class="todo-content">
                <div class="todo-text">${todo.text}</div>
                <div class="todo-date">Due: ${todo.date}</div>
            </div>
            <div class="todo-actions">
                <button class="complete-btn" onclick="toggleComplete(${todo.id})">
                    ${todo.completed ? 'Undo' : 'Complete'}
                </button>
                <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
            </div>
        `;

        todoList.appendChild(todoItem);
    });
}

// Fungsi untuk menyimpan todos ke localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}