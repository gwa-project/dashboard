import {setInner} from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";

export function main() {
    // Get user data from authManager (available globally)
    const user = window.authManager ? window.authManager.getUser() : null;

    if (user) {
        // Update user avatar and name in header
        const userAvatar = document.getElementById('userAvatar');
        const userName = document.getElementById('userName');

        if (userAvatar) {
            userAvatar.src = user.picture || 'https://via.placeholder.com/32x32?text=U';
            userAvatar.alt = user.name || 'User';
        }

        if (userName) {
            userName.textContent = user.name || 'User';
        }
    } else {
        // No user data, redirect to login
        console.warn('No user data found, redirecting to login');
        window.location.hash = '#auth';
    }

    // Setup navbar burger toggle for mobile
    const burger = document.querySelector('.navbar-burger');
    const nav = document.querySelector('#navbarMain');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('is-active');
            nav.classList.toggle('is-active');
        });
    }

    console.log("Header view loaded");
}