function switchTab(tab) {
    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    
    // Update form containers
    document.querySelectorAll('.form-container').forEach(form => {
        form.classList.remove('active');
    });
    document.getElementById(`${tab}-form`).classList.add('active');
}


function showMessage(message, type = "info") {
    alert(message);
}

// 100% Stolen!!
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// partly AI generated
async function handleRegister(event) {
    event.preventDefault();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    // Password validation
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
    document.getElementById('registerForm').reset(); // Reset register form
    switchTab('login');
}

// (50/50 AI generated)
async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const hashedPassword = await hashPassword(password);
    const user = users.find(u => u.email === email && u.password === hashedPassword);

    if (user) {
        document.getElementById('loginForm').reset(); // Reset login form
        window.location.href = "/KoZe-Playground/index.html";
    } else {
        showMessage("Invalid login details", "error");
    }

}
