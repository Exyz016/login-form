function switchTab(tab) {
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tab));
    document.querySelectorAll('.form-container').forEach(form => form.classList.toggle('active', form.id === `${tab}-form`));
}

function showMessage(message, type = "info") {
    // simple inline toast instead of alert
    const container = document.getElementById('toast-container');
    if (!container) {
        // fallback (shouldn't happen because we create it on DOMContentLoaded)
        alert(message);
        return;
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    // allow CSS entrance transition
    requestAnimationFrame(() => toast.classList.add('visible'));

    // auto-remove
    const REMOVE_AFTER = 3500;
    setTimeout(() => {
        toast.classList.remove('visible');
        toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, REMOVE_AFTER);

    // allow user to click to dismiss early
    toast.addEventListener('click', () => {
        toast.classList.remove('visible');
        toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    });
}

// Hash password using SHA-256 ( Found on web )
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function handleRegister(event) {
    event.preventDefault();
    const email = document.getElementById('register-email').value.trim();
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

    const hashedPassword = await hashPassword(password);
    users.push({ email, password: hashedPassword });
    localStorage.setItem('users', JSON.stringify(users));
    showMessage("Registration successful! You can now log in.", "success");
    document.getElementById('registerForm').reset(); // Reset/empty registration form
    switchTab('login');
}

async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const hashedPassword = await hashPassword(password);
    const user = users.find(u => u.email === email && u.password === hashedPassword);

    if (user) {
        document.getElementById('loginForm').reset(); // Reset/empty login form
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
    document.getElementById('registerForm').addEventListener('submit', handleRegister);

    // create toast container for inline messages
    if (!document.getElementById('toast-container')) {
        const tc = document.createElement('div');
        tc.id = 'toast-container';
        document.body.appendChild(tc);
    }
});
