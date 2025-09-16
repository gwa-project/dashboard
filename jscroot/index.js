//lib call
import {addCSS} from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
import { insertHTML } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.4/croot.js";
import {onHashChange} from "https://cdn.jsdelivr.net/gh/jscroot/url@0.0.4/croot.js";
import {getCookie} from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import {redirect} from "https://cdn.jsdelivr.net/gh/jscroot/url@0.0.9/croot.js";
//internal call
import { url,id,backend } from "./url/config.js";
import { getContentURL } from "./url/content.js";
import {runAfterHeader,runAfterContent,runAfterHashChange} from "./controller/main.js";

// Google OAuth handling
window.handleCredentialResponse = async function(response) {
    try {
        // Decode JWT payload from Google
        const payload = decodeJWT(response.credential);
        console.log('Google User:', payload);

        // Create user data for backend
        const userData = {
            name: payload.name,
            email: payload.email,
            picture: payload.picture,
            google_id: payload.sub
        };

        // Try to login/register with backend
        const loginResponse = await fetch(backend.auth.login, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: userData.email,
                google_auth: true,
                user_data: userData
            })
        });

        const result = await loginResponse.json();

        if (result.success) {
            // Store token
            document.cookie = `login=${result.data.token}; path=/; max-age=86400`;
            // Reload page to start dashboard
            window.location.reload();
        } else {
            throw new Error(result.message || 'Login failed');
        }

    } catch (error) {
        console.error('Google Sign-In Error:', error);
        alert('Login failed: ' + error.message);
    }
};

function decodeJWT(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

// Load configuration from backend and show login
async function loadConfigAndShowLogin() {
    try {
        const response = await fetch(backend.config);
        const configData = await response.json();

        if (configData.success && configData.data.google_client_id) {
            showLoginInterface(configData.data.google_client_id);
        } else {
            console.error('Failed to load configuration');
            showLoginInterface('');
        }
    } catch (error) {
        console.error('Error loading config:', error);
        showLoginInterface('');
    }
}

// Show login interface with Google Client ID
function showLoginInterface(googleClientId) {
    document.body.innerHTML = `
        <div class="hero is-fullheight">
            <div class="hero-body">
                <div class="container has-text-centered">
                    <div class="columns is-centered">
                        <div class="column is-4">
                            <div class="box">
                                <h1 class="title">Welcome to GWA Project</h1>
                                <p class="subtitle">Sign in with your Google account</p>

                                ${googleClientId ? `
                                <div id="g_id_onload"
                                     data-client_id="${googleClientId}"
                                     data-callback="handleCredentialResponse"
                                     data-auto_prompt="false">
                                </div>

                                <div class="g_id_signin"
                                     data-type="standard"
                                     data-size="large"
                                     data-theme="outline"
                                     data-text="sign_in_with"
                                     data-shape="rectangular"
                                     data-logo_alignment="left">
                                </div>
                                ` : `
                                <div class="notification is-warning">
                                    <strong>Configuration Error:</strong><br>
                                    Google OAuth Client ID not configured in backend.
                                </div>
                                `}

                                <hr>
                                <p class="is-size-7 has-text-grey">
                                    Powered by <strong>GoCroot</strong> Framework
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    // Add Bulma CSS for login page
    addCSS("https://unpkg.com/bulma@0.9.4/css/bulma.min.css");
}

//check cookie login
if (getCookie("login")===""){
    // Load configuration from backend first
    loadConfigAndShowLogin();
} else {
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
}