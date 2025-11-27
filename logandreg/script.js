document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');

    
    if (registerForm) {
        registerForm.addEventListener('submit', validateRegister);
    }
    if (loginForm) {
        loginForm.addEventListener('submit', validateLogin);
    }
});

function validateRegister(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorDisplay = document.getElementById('registerErrorBox');  
    
    const displayError = (message) => {
        errorDisplay.textContent = message;
        errorDisplay.style.display = 'block'; 
    };
    
    const clearError = () => {
        errorDisplay.textContent = '';
        errorDisplay.style.display = 'none'; 
    };
    clearError();
    if (!fullName || !email || !password || !confirmPassword) {
        displayError('All fields are required.');
        return;
    }
    if (!email.includes('@') || !email.includes('.')) {
        displayError('Please enter a valid email address.');
        return;
    }
    if (password.length < 6) {
        displayError('Password must be at least 6 characters long.');
        return;
    }
    
    if (password !== confirmPassword) {
        displayError('Passwords do not match.');
        return;
    } 
    const userData = {
        fullName,
        email,
        password
    };
    console.log('Registration Successful! User Data:', userData);
    localStorage.setItem('registeredUser', JSON.stringify(userData));
    alert("Registration successful! You can now log in.");
    window.location.href = 'login.html'; 
}
function validateLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorDisplay = document.getElementById('loginErrorBox'); 
    const displayError = (message) => {
        errorDisplay.textContent = message;
        errorDisplay.style.display = 'block'; 
    };
    const clearError = () => {
        errorDisplay.textContent = '';
        errorDisplay.style.display = 'none';
    };
    clearError();
    if (!email || !password) {
        displayError('Both email and password are required.');
        return;
    } 
    if (!email.includes('@') || !email.includes('.')) {
        displayError('Please enter a valid email address.');
        return;
    }  
    const storedUser = localStorage.getItem('registeredUser');
    
    if (!storedUser) {
        displayError('No registered user found. Please register first.');
        return;
    }
    const registeredUser = JSON.parse(storedUser);
    if (email === registeredUser.email && password === registeredUser.password) {
       
        alert("Login successful!");

        window.location.href = 'childhood.html';
       
        document.getElementById('loginForm').reset();
    } else {
        displayError('Invalid email or password.');
    }
}