// Mycket av denna javascript-kod är inspirerad av online-resurser.
// Hanterar användarregistrering och inloggning med localStorage
// Visar meddelanden med en "toast" funktion
// Hanterar tabs mellan inloggning och registrering

function switchTab(tab) {
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tab));
    document.querySelectorAll('.form-container').forEach(form => form.classList.toggle('active', form.id === `${tab}-form`));
}

function showMessage(message, type = "info") {
    const container = document.getElementById('toast-container');
    if (!container) {
        alert(message);
        return;
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('visible'));

    const REMOVE_AFTER = 3500;
    setTimeout(() => {
        toast.classList.remove('visible');
        toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, REMOVE_AFTER);

    toast.addEventListener('click', () => {
        toast.classList.remove('visible');
        toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    });
}

function togglePasswordVisibility(event) {
    const button = event.currentTarget;
    const input = button.parentElement.querySelector('input');
    const type = input.type === 'password' ? 'text' : 'password';
    input.type = type;
    
    button.classList.toggle('fa-eye-slash');
    button.classList.toggle('fa-eye');
}

async function handleRegistration(event) {
    event.preventDefault();
    const email = document.getElementById('register-email').value.trim();
    const gender = document.getElementById('register-gender').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
        showMessage("Password must be at least 8 characters, include uppercase, lowercase, and a number.", "error");
        return;
    }
    if (password !== confirmPassword) {
        showMessage("Passwords do not match.", "error");
        return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) {
        showMessage("Email already registered.", "error");
        return;
    }

    users.push({ 
        email, 
        gender,
        password
    });
    localStorage.setItem('users', JSON.stringify(users));
    showMessage("Registration successful! You can now log in.", "success");
    document.getElementById('registerForm').reset();
    switchTab('login');
}

async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        document.getElementById('loginForm').reset();
        window.location.href = "KoZe-Playground/index.html";
    } else {
        showMessage("Invalid login details", "error");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegistration);

    if (!document.getElementById('toast-container')) {
        const tc = document.createElement('div');
        tc.id = 'toast-container';
        document.body.appendChild(tc);
    }
    
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', togglePasswordVisibility);
    });
    
    // Clear all localStorage data for this website ( testing )
    document.getElementById('clear-data').addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all stored data? This will remove all registered users.')) {
            localStorage.clear();
            showMessage('All stored data has been cleared', 'info');
        }
    });
});
