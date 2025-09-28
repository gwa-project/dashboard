import {setInner} from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";

export function main() {
    // Get user data from authManager (available globally)
    const user = window.authManager ? window.authManager.getUser() : null;

    if (user) {
        // Update user avatar, name, and email in header
        const userAvatar = document.getElementById('userAvatar');
        const userName = document.getElementById('userName');
        const userEmail = document.getElementById('userEmail');

        if (userAvatar) {
            userAvatar.src = user.picture || 'https://via.placeholder.com/35x35?text=U';
            userAvatar.alt = user.name || 'User';
        }

        if (userName) {
            userName.textContent = user.name || 'User';
        }

        if (userEmail) {
            userEmail.textContent = user.email || 'user@example.com';
        }
    } else {
        // No user data, show default
        const userName = document.getElementById('userName');
        const userEmail = document.getElementById('userEmail');

        if (userName) userName.textContent = 'Guest';
        if (userEmail) userEmail.textContent = 'Not logged in';
    }

    // Setup mobile toggle
    const headerToggle = document.getElementById('header-toggle');
    const nav = document.querySelector('.nav');

    if (headerToggle && nav) {
        headerToggle.addEventListener('click', () => {
            nav.classList.toggle('show-menu');
        });
    }

    console.log("Header view loaded");
}