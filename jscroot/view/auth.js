// Auth page controller
import { authManager } from '../auth/auth.js';
import { backend } from '../url/config.js';

let isLoginForm = true;
let googleClientId = '';

export function main() {
    console.log('Auth page JavaScript loaded');

    // Check if already logged in
    if (authManager.isLoggedIn()) {
        window.location.hash = 'dashboard';
        return;
    }

    // Initialize auth page
    initializeAuthPage();
}

// Initialize auth page functionality
function initializeAuthPage() {
    // Set up form event listeners
    setupFormHandlers();

    // Load Google configuration
    loadGoogleConfig();

    // Set up global functions for HTML onclick handlers
    setupGlobalFunctions();
}

// Set up global functions for HTML
function setupGlobalFunctions() {
    // Toggle between login and register forms
    window.toggleForm = function() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const toggleText = document.getElementById('toggleText');

        if (isLoginForm) {
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
            toggleText.textContent = 'Already have an account?';
            isLoginForm = false;
        } else {
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
            toggleText.textContent = 'Create an Account';
            isLoginForm = true;
        }
        hideNotification();
    };

    // Show notification
    window.showNotification = function(message, type = 'is-danger') {
        const notification = document.getElementById('notification');
        const messageEl = document.getElementById('notification-message');

        if (notification && messageEl) {
            notification.className = `notification ${type}`;
            messageEl.textContent = message;
            notification.classList.remove('is-hidden');
        }
    };

    // Hide notification
    window.hideNotification = function() {
        const notification = document.getElementById('notification');
        if (notification) {
            notification.classList.add('is-hidden');
        }
    };

    // Google Sign-In callback
    window.handleCredentialResponse = async function(response) {
        hideNotification();

        try {
            const rememberMe = document.getElementById('rememberMe')?.checked || false;
            const result = await authManager.googleLogin(response.credential, rememberMe);

            if (result.success) {
                showNotification('Google login successful! Redirecting...', 'is-success');
                setTimeout(() => {
                    window.location.hash = 'dashboard';
                }, 1000);
            } else {
                showNotification(result.error);
            }
        } catch (error) {
            showNotification('An error occurred during Google login');
        }
    };

    // Trigger Google Sign-In manually
    window.triggerGoogleSignIn = function() {
        if (typeof google !== 'undefined' && google.accounts) {
            google.accounts.id.prompt();
        }
    };
}

// Set up form event handlers
function setupFormHandlers() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

// Handle login form submission
async function handleLogin(e) {
    e.preventDefault();
    hideNotification();
    setLoading('loginBtn', true);

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    try {
        const result = await authManager.login(email, password, rememberMe);

        if (result.success) {
            showNotification('Login successful! Redirecting...', 'is-success');
            setTimeout(() => {
                window.location.hash = 'dashboard';
            }, 1000);
        } else {
            showNotification(result.error);
        }
    } catch (error) {
        showNotification('An error occurred during login');
    } finally {
        setLoading('loginBtn', false);
    }
}

// Handle register form submission
async function handleRegister(e) {
    e.preventDefault();
    hideNotification();
    setLoading('registerBtn', true);

    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('regPhone').value;
    const password = document.getElementById('regPassword').value;

    try {
        const result = await authManager.register(name, email, password, phone);

        if (result.success) {
            showNotification('Account created successfully! Redirecting...', 'is-success');
            setTimeout(() => {
                window.location.hash = 'dashboard';
            }, 1000);
        } else {
            showNotification(result.error);
        }
    } catch (error) {
        showNotification('An error occurred during registration');
    } finally {
        setLoading('registerBtn', false);
    }
}

// Set loading state for buttons
function setLoading(buttonId, isLoading) {
    const button = document.getElementById(buttonId);
    if (button) {
        if (isLoading) {
            button.classList.add('is-loading');
            button.disabled = true;
        } else {
            button.classList.remove('is-loading');
            button.disabled = false;
        }
    }
}

// Load Google configuration
async function loadGoogleConfig() {
    try {
        const response = await fetch(backend.config);
        const configData = await response.json();

        if (configData.success && configData.data.google_client_id) {
            googleClientId = configData.data.google_client_id;
            initGoogleSignIn();
        } else {
            // Show manual Google button as fallback
            const googleBtn = document.getElementById('googleBtn');
            if (googleBtn) {
                googleBtn.style.display = 'block';
            }
        }
    } catch (error) {
        console.error('Failed to load Google config:', error);
        const googleBtn = document.getElementById('googleBtn');
        if (googleBtn) {
            googleBtn.style.display = 'block';
        }
    }
}

// Initialize Google Sign-In
function initGoogleSignIn() {
    if (googleClientId) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;

        script.onload = () => {
            google.accounts.id.initialize({
                client_id: googleClientId,
                callback: handleCredentialResponse,
                auto_prompt: false
            });

            const signInDiv = document.getElementById('g_id_signin');
            if (signInDiv) {
                google.accounts.id.renderButton(signInDiv, {
                    type: 'standard',
                    size: 'large',
                    theme: 'outline',
                    text: 'continue_with',
                    shape: 'rectangular',
                    width: '100%'
                });
            }
        };

        document.head.appendChild(script);
    }
}