import {getJSON} from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import {getCookie} from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import {setInner} from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
import {backend} from "../../../url/config.js";

let allUsers = [];
let currentPage = 1;
let usersPerPage = 10;
let filteredUsers = [];

export function main() {
    // Load users on page load
    loadUsers();
}

async function loadUsers() {
    try {
        const response = await getJSON(backend.user.all, "login", getCookie("login"));

        if (response.success && Array.isArray(response.data)) {
            allUsers = response.data;
            filteredUsers = [...allUsers];

            // Update total count
            setInner("totalUsersCount", allUsers.length.toString());

            // Display users
            displayUsers();
            updatePagination();
        } else {
            throw new Error(response.message || 'Failed to load users');
        }

    } catch (error) {
        console.error('Error loading users:', error);

        // Show error in table
        const tbody = document.getElementById('usersTableBody');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="has-text-centered has-text-danger">
                        <span class="icon"><i class="fa fa-exclamation-triangle"></i></span>
                        Error loading users: ${error.message}
                    </td>
                </tr>
            `;
        }
    }
}

function displayUsers() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    // Calculate pagination
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    const pageUsers = filteredUsers.slice(startIndex, endIndex);

    if (pageUsers.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="has-text-centered has-text-grey">
                    <span class="icon"><i class="fa fa-users"></i></span>
                    No users found
                </td>
            </tr>
        `;
        return;
    }

    // Generate table rows
    let tableHTML = '';
    pageUsers.forEach(user => {
        const joinDate = user.created_at ?
            new Date(user.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }) : 'Unknown';

        const lastActivity = user.updated_at ?
            new Date(user.updated_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }) : 'Never';

        const isRecent = user.updated_at &&
            new Date(user.updated_at) > new Date(Date.now() - 7*24*60*60*1000);

        tableHTML += `
            <tr>
                <td>
                    <figure class="image is-48x48">
                        <img class="is-rounded" src="${user.picture || '/assets/img/default-avatar.png'}" alt="Avatar">
                    </figure>
                </td>
                <td>
                    <div>
                        <strong>${user.name || 'Unknown'}</strong>
                        <br>
                        <small class="has-text-grey">ID: ${(user._id || user.id || '').substring(0, 8)}...</small>
                    </div>
                </td>
                <td>${user.email || 'No email'}</td>
                <td>
                    <span class="tag ${getRoleTagClass(user.role)}">
                        ${user.role || 'user'}
                    </span>
                </td>
                <td>
                    <span class="tag ${isRecent ? 'is-success' : 'is-light'}">
                        ${isRecent ? 'Active' : 'Inactive'}
                    </span>
                    <br>
                    <small class="has-text-grey">Last: ${lastActivity}</small>
                </td>
                <td>
                    <small class="has-text-grey">${joinDate}</small>
                </td>
                <td>
                    <div class="field is-grouped">
                        <div class="control">
                            <button class="button is-small is-info" onclick="editUser('${user._id || user.id}')">
                                <span class="icon"><i class="fa fa-edit"></i></span>
                            </button>
                        </div>
                        <div class="control">
                            <button class="button is-small is-primary" onclick="viewUser('${user._id || user.id}')">
                                <span class="icon"><i class="fa fa-eye"></i></span>
                            </button>
                        </div>
                    </div>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = tableHTML;
}

function getRoleTagClass(role) {
    switch (role?.toLowerCase()) {
        case 'admin':
            return 'is-danger';
        case 'moderator':
            return 'is-warning';
        case 'user':
        default:
            return 'is-info';
    }
}

function updatePagination() {
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    const pageInfo = document.getElementById('pageInfo');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (pageInfo) {
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    }

    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
    }

    if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    }
}

// Global functions for buttons
window.refreshUsers = function() {
    // Show loading
    const tbody = document.getElementById('usersTableBody');
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="has-text-centered">
                    <span class="icon"><i class="fa fa-spinner fa-spin"></i></span>
                    Refreshing users...
                </td>
            </tr>
        `;
    }

    // Reset and reload
    currentPage = 1;
    loadUsers();
};

window.searchUsers = function() {
    const searchInput = document.getElementById('searchUsers');
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

    if (searchTerm === '') {
        filteredUsers = [...allUsers];
    } else {
        filteredUsers = allUsers.filter(user =>
            (user.name || '').toLowerCase().includes(searchTerm) ||
            (user.email || '').toLowerCase().includes(searchTerm) ||
            (user.role || '').toLowerCase().includes(searchTerm)
        );
    }

    currentPage = 1;
    displayUsers();
    updatePagination();
};

window.prevPage = function() {
    if (currentPage > 1) {
        currentPage--;
        displayUsers();
        updatePagination();
    }
};

window.nextPage = function() {
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayUsers();
        updatePagination();
    }
};

window.editUser = function(userId) {
    // TODO: Navigate to edit user page
    console.log('Edit user:', userId);
    alert(`Edit user functionality coming soon!\nUser ID: ${userId}`);
};

window.viewUser = function(userId) {
    // TODO: Show user details modal or navigate to user detail page
    console.log('View user:', userId);
    alert(`View user functionality coming soon!\nUser ID: ${userId}`);
};

// Search on Enter key
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchUsers');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchUsers();
            }
        });
    }
});