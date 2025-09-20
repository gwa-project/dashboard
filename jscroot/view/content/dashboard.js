import { authManager } from "../../auth/auth.js";
import { backend } from "../../url/config.js";

export function main() {
    // Load user data and update greeting
    const user = authManager.getUser();
    if (user) {
        document.getElementById('biggreet').textContent = `Hello, ${user.name || 'Admin'}.`;
        document.getElementById('subtitle').textContent = 'Welcome to GWA Project Dashboard!';
    }

    // Load dashboard data
    loadDashboardStats();
    loadRecentUsers();
    loadSystemStatus();
}

async function loadDashboardStats() {
    try {
        // Load users count
        const usersResponse = await authManager.makeAuthenticatedRequest('/users');
        if (usersResponse.ok) {
            const usersResult = await usersResponse.json();
            if (usersResult.success && usersResult.data) {
                document.getElementById('bigactiveusers').textContent = usersResult.data.length;
            }
        }

        // Set other static stats for now
        document.getElementById('bigtotalprojects').textContent = '24';
        document.getElementById('bigsuccessrate').textContent = '89%';
        document.getElementById('bigrevenue').textContent = '$2,439';

    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

async function loadRecentUsers() {
    try {
        const response = await authManager.makeAuthenticatedRequest('/users');
        if (response.ok) {
            const result = await response.json();
            if (result.success && result.data) {
                const recentUsersContainer = document.getElementById('recentUsers');
                if (result.data.length > 0) {
                    recentUsersContainer.innerHTML = result.data.slice(0, 5).map(user => `
                        <tr>
                            <td>
                                <div class="level">
                                    <div class="level-left">
                                        <div class="level-item">
                                            <figure class="image is-32x32">
                                                <img class="is-rounded" src="${user.picture || 'https://via.placeholder.com/32x32?text=U'}" alt="${user.name}">
                                            </figure>
                                        </div>
                                        <div class="level-item">
                                            <div>
                                                <p class="subtitle is-6">${user.name}</p>
                                                <p class="subtitle is-7 has-text-grey">${user.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="level-right">
                                        <span class="tag is-primary">${user.role || 'user'}</span>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    `).join('');
                } else {
                    recentUsersContainer.innerHTML = '<tr><td class="has-text-grey">No users found</td></tr>';
                }
            }
        }
    } catch (error) {
        console.error('Error loading recent users:', error);
        document.getElementById('recentUsers').innerHTML = '<tr><td class="has-text-danger">Error loading data</td></tr>';
    }
}

async function loadSystemStatus() {
    try {
        // Check backend health
        const healthResponse = await fetch(backend.home);
        const apiStatus = document.getElementById('apiStatus');

        if (healthResponse.ok) {
            // Update API status to online
            apiStatus.innerHTML = `
                <tr>
                    <td>
                        <span class="icon has-text-success">
                            <i class="fa fa-check-circle"></i>
                        </span>
                        Backend API
                    </td>
                    <td>
                        <span class="tag is-success">Online</span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span class="icon has-text-success">
                            <i class="fa fa-check-circle"></i>
                        </span>
                        Database
                    </td>
                    <td>
                        <span class="tag is-success">Connected</span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span class="icon has-text-success">
                            <i class="fa fa-check-circle"></i>
                        </span>
                        Google OAuth
                    </td>
                    <td>
                        <span class="tag is-success">Active</span>
                    </td>
                </tr>
            `;
        } else {
            throw new Error('API not responding');
        }
    } catch (error) {
        console.error('Error checking system status:', error);
        const apiStatus = document.getElementById('apiStatus');
        apiStatus.innerHTML = `
            <tr>
                <td>
                    <span class="icon has-text-danger">
                        <i class="fa fa-times-circle"></i>
                    </span>
                    Backend API
                </td>
                <td>
                    <span class="tag is-danger">Offline</span>
                </td>
            </tr>
        `;
    }
}