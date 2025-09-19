//lib call
import {addCSS} from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
import { insertHTML } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.4/croot.js";
import {onHashChange} from "https://cdn.jsdelivr.net/gh/jscroot/url@0.0.4/croot.js";
import {redirect} from "https://cdn.jsdelivr.net/gh/jscroot/url@0.0.9/croot.js";
//internal call
import { url,id,backend } from "./url/config.js";
import { getContentURL } from "./url/content.js";
import {runAfterHeader,runAfterContent,runAfterHashChange} from "./controller/main.js";
import { authManager } from "./auth/auth.js";

// Check authentication status and initialize app
function initializeApp() {
    // Check if user is logged in
    if (!authManager.isLoggedIn()) {
        // Redirect to login page
        window.location.href = './login.html';
        return;
    }

    // User is logged in, load dashboard
    loadDashboard();
}

// Load main dashboard
function loadDashboard() {
    //adding CSS
    addCSS("https://unpkg.com/bulma@0.9.4/css/bulma.min.css");
    addCSS("https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css");
    addCSS("https://cdn.jsdelivr.net/npm/boxicons@latest/css/boxicons.min.css");
    addCSS("https://cdn.datatables.net/2.0.8/css/dataTables.dataTables.min.css");
    addCSS("assets/css/custom.css");

    //rendering HTML
    insertHTML(url.template.header,id.header,runAfterHeader);
    insertHTML(getContentURL(),id.content,runAfterContent);
    onHashChange(runAfterHashChange);

    // Auto-refresh token periodically
    startTokenRefreshTimer();
}

// Auto refresh token
function startTokenRefreshTimer() {
    // Refresh token every 50 minutes (tokens expire in 1 hour)
    setInterval(async () => {
        try {
            await authManager.refreshToken();
        } catch (error) {
            console.error('Auto token refresh failed:', error);
            // If refresh fails, redirect to login
            authManager.logout();
            window.location.href = './login.html';
        }
    }, 50 * 60 * 1000); // 50 minutes
}

// Global logout function
window.logout = async function() {
    try {
        await authManager.serverLogout();
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        window.location.href = './login.html';
    }
};

// Make authManager globally available
window.authManager = authManager;


// Initialize the application
initializeApp();