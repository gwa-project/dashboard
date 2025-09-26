// Main index router controller
import { insertHTML } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import { runAfterHashChange, runAfterHeader } from "../controller/main.js";
import { url, id } from "../url/config.js";
import { getContentURL, getURLContentJS } from "../url/content.js";
import { authManager } from "../auth/auth.js";

export function main() {
    console.log('Main router initialized');

    // Hide loading screen
    hideLoading();

    // Initialize routing
    initializeRouting();
}

// Hide loading screen
function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = 'none';
    }
}

// Initialize routing system
function initializeRouting() {
    // Handle initial route
    handleRoute();

    // Listen for hash changes
    window.addEventListener('hashchange', handleRoute);
}

// Route handler using content.js system
function handleRoute() {
    const hash = window.location.hash.slice(1); // Remove #

    console.log('Routing to:', hash || 'home');

    // Special handling for dashboard route
    if (hash === 'dashboard') {
        if (authManager.isLoggedIn()) {
            // Redirect to standalone dashboard
            window.location.href = './jscroot/dashboard.html';
            return;
        } else {
            window.location.hash = 'auth';
            return;
        }
    }

    // Check authentication requirements for other routes
    if (needsAuthentication(hash)) {
        if (!authManager.isLoggedIn()) {
            window.location.hash = 'auth';
            return;
        }
    }

    // Load content using existing content.js system
    loadContent();
}

// Check if route needs authentication
function needsAuthentication(hash) {
    const authRequired = [
        'dashboard',
        'profile/accounts',
        'profile/mail',
        'settings/config',
        'settings/security',
        'docs/api',
        'docs/guide'
    ];
    return authRequired.includes(hash);
}

// Load content using content.js system
async function loadContent() {
    const hash = window.location.hash.slice(1);

    try {
        // For public pages (home, auth), clear header/navbar
        if (hash === '' || hash === 'home' || hash === 'auth' || hash === 'login') {
            document.getElementById('header__container').innerHTML = '';
            document.getElementById('navbar').innerHTML = '';
        } else {
            // For authenticated pages, load header/navbar
            insertHTML(url.template.header, id.header, runAfterHeader);
        }

        // Get content URL from content.js
        const contentURL = getContentURL();

        // Load content
        insertHTML(contentURL, id.content, async () => {
            // Load corresponding JavaScript controller
            const jsURL = getURLContentJS();
            try {
                const module = await import(jsURL);
                if (module.main) {
                    module.main();
                }
            } catch (error) {
                console.warn('No JavaScript controller found for:', jsURL);
            }
        });

    } catch (error) {
        console.error('Error loading content:', error);
        // Fallback to dashboard
        window.location.hash = 'dashboard';
    }
}

// Initialize auth check
function initAuthCheck() {
    // If user is logged in and on public pages, suggest dashboard
    if (authManager.isLoggedIn()) {
        const hash = window.location.hash.slice(1);
        if (!hash || hash === 'home' || hash === 'auth' || hash === 'login') {
            // Optional: Auto-redirect to dashboard for logged-in users
            // Uncomment next line if you want auto-redirect
            // window.location.hash = 'dashboard';
        }
    }
}

// Run auth check on initialization
initAuthCheck();