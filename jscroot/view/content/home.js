import {getJSON} from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import {getCookie} from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import {setInner} from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
import {backend} from "../../url/config.js";

export function main() {
    // Get user data and update greeting
    getJSON(backend.user.data, "login", getCookie("login"), function(response) {
        if (response.success && response.data) {
            const userName = response.data.name || "Admin";
            setInner("biggreet", `Hello, ${userName}.`);
            setInner("subtitle", `Welcome back to GWA Project Dashboard!`);
        }
    });

    // Load dashboard statistics
    loadDashboardStats();
}

// Load dashboard statistics
async function loadDashboardStats() {
    try {
        // Get all users
        const usersResponse = await getJSON(backend.user.all, "login", getCookie("login"));
        if (usersResponse.success && Array.isArray(usersResponse.data)) {
            const totalUsers = usersResponse.data.length;
            const activeUsers = usersResponse.data.filter(user =>
                user.updated_at && new Date(user.updated_at) > new Date(Date.now() - 7*24*60*60*1000)
            ).length;

            setInner("bigtotalusers", totalUsers.toString());
            setInner("bigactiveusers", activeUsers.toString());

            // Load recent users table
            loadRecentUsers(usersResponse.data.slice(0, 5));
        }

        // Get health status
        const healthResponse = await getJSON(backend.health, "login", getCookie("login"));
        if (healthResponse.success) {
            // Set some demo project and API call numbers
            setInner("bigtotalprojects", "3");
            setInner("bigtotalapi", "1,247");
        }

        // Load system activity
        loadSystemActivity();

    } catch (error) {
        console.error("Error loading dashboard stats:", error);
        // Set default values on error
        setInner("bigtotalusers", "0");
        setInner("bigactiveusers", "0");
        setInner("bigtotalprojects", "0");
        setInner("bigtotalapi", "0");
    }
}

function loadRecentUsers(users) {
    let tableHTML = "";

    if (users.length === 0) {
        tableHTML = `
            <tr>
                <td colspan="2" class="has-text-centered has-text-grey">
                    No users found
                </td>
            </tr>
        `;
    } else {
        users.forEach(user => {
            const joinDate = user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown';
            tableHTML += `
                <tr>
                    <td>
                        <div class="media">
                            <div class="media-left">
                                <figure class="image is-32x32">
                                    <img class="is-rounded" src="${user.picture || '/assets/img/default-avatar.png'}" alt="Avatar">
                                </figure>
                            </div>
                            <div class="media-content">
                                <p class="title is-6 mb-1">${user.name || 'Unknown'}</p>
                                <p class="subtitle is-7 has-text-grey">${user.email || ''}</p>
                            </div>
                        </div>
                    </td>
                    <td>
                        <span class="tag ${user.role === 'admin' ? 'is-danger' : 'is-info'} is-small">
                            ${user.role || 'user'}
                        </span>
                        <br>
                        <small class="has-text-grey">${joinDate}</small>
                    </td>
                </tr>
            `;
        });
    }

    setInner("recentUsers", tableHTML);
}

function loadSystemActivity() {
    const activities = [
        {
            action: "User Login",
            user: "john@example.com",
            time: "2 minutes ago",
            icon: "fa-sign-in-alt",
            type: "success"
        },
        {
            action: "New User Registration",
            user: "jane@example.com",
            time: "15 minutes ago",
            icon: "fa-user-plus",
            type: "info"
        },
        {
            action: "API Call",
            user: "system",
            time: "1 hour ago",
            icon: "fa-code",
            type: "primary"
        },
        {
            action: "Database Backup",
            user: "system",
            time: "3 hours ago",
            icon: "fa-database",
            type: "warning"
        }
    ];

    let activityHTML = "";
    activities.forEach(activity => {
        activityHTML += `
            <tr>
                <td>
                    <span class="icon has-text-${activity.type}">
                        <i class="fa ${activity.icon}"></i>
                    </span>
                    ${activity.action}
                </td>
                <td>
                    <div>
                        <strong>${activity.user}</strong>
                        <br>
                        <small class="has-text-grey">${activity.time}</small>
                    </div>
                </td>
            </tr>
        `;
    });

    setInner("systemActivity", activityHTML);
}