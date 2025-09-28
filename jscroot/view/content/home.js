import { backend } from "../../url/config.js";

export function main() {
    console.log("Home view loaded");

    // Load dashboard statistics
    loadDashboardStats();

    // Setup welcome message
    setupWelcomeMessage();
}

async function loadDashboardStats() {
    try {
        // Load user statistics (if admin)
        const totalUsersEl = document.getElementById('totalUsers');
        const activeUsersEl = document.getElementById('activeUsers');
        const systemStatusEl = document.getElementById('systemStatus');

        if (totalUsersEl) {
            // Try to fetch total users
            try {
                const response = await fetch(backend.user.all, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    totalUsersEl.textContent = data.data ? data.data.length : '0';
                } else {
                    totalUsersEl.textContent = '-';
                }
            } catch (error) {
                totalUsersEl.textContent = '-';
            }
        }

        if (activeUsersEl) {
            activeUsersEl.textContent = '1'; // Current user
        }

        if (systemStatusEl) {
            // Check system health
            try {
                const response = await fetch(backend.home);
                systemStatusEl.textContent = response.ok ? 'Online' : 'Offline';
                systemStatusEl.className = 'stat-number ' + (response.ok ? 'status-online' : 'status-offline');
            } catch (error) {
                systemStatusEl.textContent = 'Offline';
                systemStatusEl.className = 'stat-number status-offline';
            }
        }

    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

function setupWelcomeMessage() {
    const user = window.authManager ? window.authManager.getUser() : null;
    const welcomeTitle = document.querySelector('.hero-title');

    if (user && welcomeTitle) {
        welcomeTitle.textContent = `Welcome back, ${user.name}!`;
    }
}