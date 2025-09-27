// Dashboard JavaScript Module
import { backend } from "../../url/config.js";

// Check authentication
function checkAuth() {
    const token = localStorage.getItem('gwa_access_token') || getCookie('login');
    if (!token) {
        window.location.hash = '#auth';
        return false;
    }
    return true;
}

// Get cookie helper
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return '';
}

// Load user data
async function loadUserData() {
    try {
        const token = localStorage.getItem('gwa_access_token') || getCookie('login');

        if (!token) {
            window.location.hash = '#auth';
            return;
        }

        // Get user profile from backend
        try {
            const response = await fetch(backend.auth.profile, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const userData = await response.json();
                const user = userData.user || userData;

                // Update user info with actual data
                const displayName = user.name || user.email || 'User';
                document.getElementById('userName').textContent = displayName;
                document.getElementById('displayUserName').textContent = displayName;

                // Set avatar (use Google profile picture if available, otherwise initials)
                const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase();
                const avatarUrl = user.picture || `https://via.placeholder.com/40x40?text=${initials}`;
                document.getElementById('userAvatar').src = avatarUrl;

                // Show Users menu if user is admin
                if (user.role === 'admin') {
                    document.getElementById('admin-menu').style.display = 'block';
                }

                console.log('User data loaded:', user);
            } else {
                throw new Error('Failed to fetch user profile');
            }
        } catch (apiError) {
            console.log('API call failed, using fallback data');
            // Fallback to stored user data
            document.getElementById('userName').textContent = 'User';
            document.getElementById('displayUserName').textContent = 'User';
            document.getElementById('userAvatar').src = 'https://via.placeholder.com/40x40?text=U';
        }

        // Update stats with sample data
        document.getElementById('totalProjects').textContent = '12 projects active';
        document.getElementById('activeUsers').textContent = '34 users online';
        document.getElementById('completedTasks').textContent = '156';
        document.getElementById('recentUser').textContent = document.getElementById('userName').textContent;

        console.log('Dashboard data loaded successfully');
    } catch (error) {
        console.error('Error loading user data:', error);
        // Redirect to login on any major error
        window.location.hash = '#auth';
    }
}

// Show dashboard in main pane
function showDashboard() {
    // Update sidebar active state
    updateSidebarActive('dashboard');

    // Show message pane
    document.getElementById('message-pane').classList.remove('is-hidden');

    // Update content
    document.getElementById('dashboard-content').innerHTML = `
        <h2 class="title is-4">Welcome to Dashboard</h2>
        <p class="subtitle">Overview of your GWA Project</p>

        <div class="content">
            <h3>Quick Stats</h3>
            <ul>
                <li><strong>Total Projects:</strong> <span id="completedTasks">156</span></li>
                <li><strong>Active Users:</strong> <span id="recentUser">${document.getElementById('userName').textContent}</span></li>
                <li><strong>System Health:</strong> 98%</li>
            </ul>

            <h3>Recent Activity</h3>
            <p><i class="fa fa-check"></i> System health check completed</p>
            <p><i class="fa fa-user"></i> New user registered successfully</p>
            <p><i class="fa fa-folder"></i> Project updated: Backend API</p>
            <p><i class="fa fa-shield"></i> Security scan completed successfully</p>

            <h3>Quick Actions</h3>
            <div class="buttons">
                <button class="button is-primary is-small" onclick="showProjects()">
                    <span class="icon"><i class="fa fa-folder"></i></span>
                    <span>View Projects</span>
                </button>
                <button class="button is-info is-small" onclick="refreshData()">
                    <span class="icon"><i class="fa fa-refresh"></i></span>
                    <span>Refresh Data</span>
                </button>
            </div>
        </div>
    `;
}

// Show projects page
function showProjects() {
    updateSidebarActive('projects');
    document.getElementById('message-pane').classList.remove('is-hidden');

    document.getElementById('dashboard-content').innerHTML = `
        <h2 class="title is-4">Projects</h2>
        <p class="subtitle">Manage your projects</p>

        <div class="content">
            <h3>Project List</h3>
            <div class="box">
                <p><i class="fa fa-folder"></i> <strong>Backend API</strong> - Active</p>
                <p><i class="fa fa-folder"></i> <strong>Frontend Dashboard</strong> - Active</p>
                <p><i class="fa fa-folder"></i> <strong>Mobile App</strong> - In Development</p>
            </div>

            <div class="buttons">
                <button class="button is-primary is-small">
                    <span class="icon"><i class="fa fa-plus"></i></span>
                    <span>New Project</span>
                </button>
            </div>
        </div>
    `;
}

// Show users management page (admin only)
function showUsers() {
    updateSidebarActive('users');
    document.getElementById('message-pane').classList.remove('is-hidden');

    document.getElementById('dashboard-content').innerHTML = `
        <h2 class="title is-4">User Management</h2>
        <p class="subtitle">Manage system users (Admin Only)</p>

        <div class="content">
            <div class="buttons mb-4">
                <button class="button is-primary is-small" onclick="addUser()">
                    <span class="icon"><i class="fa fa-plus"></i></span>
                    <span>Add User</span>
                </button>
                <button class="button is-info is-small" onclick="loadUsers()">
                    <span class="icon"><i class="fa fa-refresh"></i></span>
                    <span>Refresh</span>
                </button>
            </div>

            <div id="users-list">
                <div class="box">
                    <p>Loading users...</p>
                </div>
            </div>
        </div>
    `;

    // Load users immediately
    loadUsers();
}

// Show settings page (all users)
function showSettings() {
    updateSidebarActive('settings');
    document.getElementById('message-pane').classList.remove('is-hidden');

    const currentUser = document.getElementById('userName').textContent;
    const currentAvatar = document.getElementById('userAvatar').src;

    document.getElementById('dashboard-content').innerHTML = `
        <h2 class="title is-4">Settings</h2>
        <p class="subtitle">Manage your profile and account settings</p>

        <div class="content">
            <!-- Profile Section -->
            <div class="box">
                <h3 class="title is-5">Profile Information</h3>
                <div class="columns">
                    <div class="column is-2">
                        <img src="${currentAvatar}" class="user-avatar" alt="Profile Avatar" style="width: 64px; height: 64px;">
                    </div>
                    <div class="column is-10">
                        <div class="field">
                            <label class="label">Name</label>
                            <div class="control">
                                <input class="input" type="text" id="profile-name" value="${currentUser}" placeholder="Your name">
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Email</label>
                            <div class="control">
                                <input class="input" type="email" id="profile-email" placeholder="Your email" readonly>
                            </div>
                            <p class="help">Email cannot be changed</p>
                        </div>
                        <div class="field">
                            <div class="control">
                                <button class="button is-primary is-small" onclick="updateProfile()">
                                    <span class="icon"><i class="fa fa-save"></i></span>
                                    <span>Update Profile</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Change Password Section -->
            <div class="box">
                <h3 class="title is-5">Change Password</h3>
                <div class="columns">
                    <div class="column is-6">
                        <div class="field">
                            <label class="label">Current Password</label>
                            <div class="control">
                                <input class="input" type="password" id="current-password" placeholder="Enter current password">
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">New Password</label>
                            <div class="control">
                                <input class="input" type="password" id="new-password" placeholder="Enter new password (min 6 chars)">
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Confirm New Password</label>
                            <div class="control">
                                <input class="input" type="password" id="confirm-password" placeholder="Confirm new password">
                            </div>
                        </div>
                        <div class="field">
                            <div class="control">
                                <button class="button is-warning is-small" onclick="changePassword()">
                                    <span class="icon"><i class="fa fa-key"></i></span>
                                    <span>Change Password</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="column is-6">
                        <div class="notification is-info is-light">
                            <h4 class="title is-6">Password Requirements:</h4>
                            <ul>
                                <li>Minimum 6 characters</li>
                                <li>Must be different from current password</li>
                                <li>Both new password fields must match</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Account Information -->
            <div class="box">
                <h3 class="title is-5">Account Information</h3>
                <div id="account-info">
                    <p>Loading account information...</p>
                </div>
            </div>
        </div>
    `;

    // Load current user data
    loadCurrentUserProfile();
}

// Update sidebar active state
function updateSidebarActive(section) {
    document.querySelectorAll('.aside .item').forEach(item => {
        item.classList.remove('active');
    });

    const activeItem = document.querySelector(`.aside .item[onclick*="${section}"]`) ||
                     document.querySelector(`.aside .item[onclick*="show${section.charAt(0).toUpperCase() + section.slice(1)}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }
}

// Navigation functions
function navigateTo(section) {
    // Handle navigation using hash routing
    switch(section) {
        case 'dashboard':
            showDashboard();
            break;
        case 'projects':
            showProjects();
            break;
        case 'settings':
            showSettings();
            break;
        case 'users':
            if (document.getElementById('admin-menu').style.display !== 'none') {
                showUsers();
            }
            break;
        default:
            console.log('Navigating to:', section);
    }
}

// Refresh data
function refreshData() {
    const button = event.target.closest('.button');
    button.classList.add('is-loading');

    setTimeout(() => {
        button.classList.remove('is-loading');
        loadUserData();
        alert('Data refreshed successfully!');
    }, 1500);
}

// Export data function
function exportData() {
    alert('Export functionality - To be implemented');
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear auth data
        localStorage.removeItem('gwa_access_token');
        document.cookie = 'login=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

        // Redirect to home using hash routing
        window.location.hash = '#home';
    }
}

// User Management Functions
async function loadUsers() {
    const token = localStorage.getItem('gwa_access_token') || getCookie('login');

    try {
        const response = await fetch(backend.admin.users, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            const users = data.users || data || [];
            displayUsers(users);
        } else {
            throw new Error('Failed to load users');
        }
    } catch (error) {
        console.error('Error loading users:', error);
        document.getElementById('users-list').innerHTML = `
            <div class="box">
                <p class="has-text-danger">Error loading users. API endpoint may not exist yet.</p>
                <p><small>Expected endpoint: /admin/users</small></p>
            </div>
        `;
    }
}

function displayUsers(users) {
    const usersList = document.getElementById('users-list');

    if (!users || users.length === 0) {
        usersList.innerHTML = `
            <div class="box">
                <p>No users found.</p>
            </div>
        `;
        return;
    }

    const usersHtml = users.map(user => `
        <div class="box">
            <div class="columns is-vcentered">
                <div class="column is-2">
                    <img src="${user.picture || `https://via.placeholder.com/40x40?text=${(user.name || user.email || 'U')[0].toUpperCase()}`}"
                         class="user-avatar" alt="Avatar">
                </div>
                <div class="column is-6">
                    <p><strong>${user.name || 'No Name'}</strong></p>
                    <p><small>${user.email}</small></p>
                    <p><span class="tag ${user.role === 'admin' ? 'is-danger' : 'is-info'}">${user.role || 'user'}</span></p>
                </div>
                <div class="column is-4">
                    <div class="buttons">
                        <button class="button is-small is-warning" onclick="editUser('${user._id || user.id}')">
                            <i class="fa fa-edit"></i> Edit
                        </button>
                        <button class="button is-small is-danger" onclick="deleteUser('${user._id || user.id}', '${user.email}')">
                            <i class="fa fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    usersList.innerHTML = usersHtml;
}

async function addUser() {
    const name = prompt('Enter user name:');
    const email = prompt('Enter user email:');
    const password = prompt('Enter user password (min 6 chars):');
    const role = confirm('Is this user an admin?') ? 'admin' : 'user';

    if (!name || !email || !password || password.length < 6) {
        alert('Please provide valid name, email, and password (min 6 chars)');
        return;
    }

    const token = localStorage.getItem('gwa_access_token') || getCookie('login');

    try {
        const response = await fetch(backend.admin.users, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password,
                role: role
            })
        });

        if (response.ok) {
            alert('User added successfully!');
            loadUsers(); // Refresh the list
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Failed to add user');
        }
    } catch (error) {
        console.error('Error adding user:', error);
        alert('Error adding user: ' + error.message);
    }
}

async function editUser(userId) {
    const newName = prompt('Enter new name:');
    const newRole = confirm('Is this user an admin?') ? 'admin' : 'user';

    if (!newName) {
        alert('Please provide a valid name');
        return;
    }

    const token = localStorage.getItem('gwa_access_token') || getCookie('login');

    try {
        const response = await fetch(`${backend.admin.users}/${userId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: newName,
                role: newRole
            })
        });

        if (response.ok) {
            alert('User updated successfully!');
            loadUsers(); // Refresh the list
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update user');
        }
    } catch (error) {
        console.error('Error updating user:', error);
        alert('Error updating user: ' + error.message);
    }
}

async function deleteUser(userId, userEmail) {
    if (!confirm(`Are you sure you want to delete user: ${userEmail}?`)) {
        return;
    }

    const token = localStorage.getItem('gwa_access_token') || getCookie('login');

    try {
        const response = await fetch(`${backend.admin.users}/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            alert('User deleted successfully!');
            loadUsers(); // Refresh the list
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete user');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user: ' + error.message);
    }
}

// Profile and Settings Functions
async function loadCurrentUserProfile() {
    const token = localStorage.getItem('gwa_access_token') || getCookie('login');

    try {
        const response = await fetch(backend.auth.profile, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            const user = data.user || data;

            // Update profile form with current data
            document.getElementById('profile-name').value = user.name || '';
            document.getElementById('profile-email').value = user.email || '';

            // Update account info
            document.getElementById('account-info').innerHTML = `
                <div class="columns">
                    <div class="column is-6">
                        <p><strong>User ID:</strong> ${user._id || user.id || 'N/A'}</p>
                        <p><strong>Role:</strong> <span class="tag ${user.role === 'admin' ? 'is-danger' : 'is-info'}">${user.role || 'user'}</span></p>
                    </div>
                    <div class="column is-6">
                        <p><strong>Created:</strong> ${user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
                        <p><strong>Last Updated:</strong> ${user.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'N/A'}</p>
                    </div>
                </div>
            `;
        } else {
            throw new Error('Failed to load profile');
        }
    } catch (error) {
        console.error('Error loading profile:', error);
        document.getElementById('account-info').innerHTML = `
            <p class="has-text-danger">Error loading profile information.</p>
        `;
    }
}

async function updateProfile() {
    const name = document.getElementById('profile-name').value.trim();

    if (!name) {
        alert('Please enter your name');
        return;
    }

    const token = localStorage.getItem('gwa_access_token') || getCookie('login');

    try {
        const response = await fetch(backend.user.update, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name
            })
        });

        if (response.ok) {
            alert('Profile updated successfully!');

            // Update the display name in navbar and content
            document.getElementById('userName').textContent = name;
            document.getElementById('displayUserName').textContent = name;

            // Refresh the settings page
            loadCurrentUserProfile();
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update profile');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('Error updating profile: ' + error.message);
    }
}

async function changePassword() {
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
        alert('Please fill in all password fields');
        return;
    }

    if (newPassword.length < 6) {
        alert('New password must be at least 6 characters long');
        return;
    }

    if (newPassword !== confirmPassword) {
        alert('New password and confirm password do not match');
        return;
    }

    if (currentPassword === newPassword) {
        alert('New password must be different from current password');
        return;
    }

    const token = localStorage.getItem('gwa_access_token') || getCookie('login');

    try {
        const response = await fetch(backend.auth.changePassword, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                currentPassword: currentPassword,
                newPassword: newPassword
            })
        });

        if (response.ok) {
            alert('Password changed successfully!');

            // Clear the form
            document.getElementById('current-password').value = '';
            document.getElementById('new-password').value = '';
            document.getElementById('confirm-password').value = '';
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Failed to change password');
        }
    } catch (error) {
        console.error('Error changing password:', error);
        alert('Error changing password: ' + error.message);
    }
}

// Main function called by jscroot
export function main() {
    // Check authentication
    if (!checkAuth()) return;

    // Load user data
    loadUserData();

    // Mobile burger menu
    const navbarBurger = document.querySelector('.navbar-burger');
    if (navbarBurger) {
        navbarBurger.addEventListener('click', function() {
            navbarBurger.classList.toggle('is-active');
            const navbarMenu = document.querySelector('.navbar-menu');
            if (navbarMenu) {
                navbarMenu.classList.toggle('is-active');
            }
        });
    }

    console.log('Dashboard initialized successfully');
}

// Make functions globally available
window.showDashboard = showDashboard;
window.showProjects = showProjects;
window.showUsers = showUsers;
window.showSettings = showSettings;
window.navigateTo = navigateTo;
window.refreshData = refreshData;
window.exportData = exportData;
window.logout = logout;
window.loadUsers = loadUsers;
window.addUser = addUser;
window.editUser = editUser;
window.deleteUser = deleteUser;
window.updateProfile = updateProfile;
window.changePassword = changePassword;