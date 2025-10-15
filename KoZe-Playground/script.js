// Switch Theme
const themeToggle = document.getElementById('themeButton');
const body = document.body;
const savedTheme = localStorage.getItem('theme');

// Apply saved or system theme
if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    body.classList.add('dark-mode');
}

// Toggle/switch on click
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
    });
}

// Log out button functionality
const logoutButton = document.getElementById('logout');
if (logoutButton) {
    logoutButton.addEventListener('click', () => {
        window.location.href = '../index.html'; // Redirect to login page
    });
}