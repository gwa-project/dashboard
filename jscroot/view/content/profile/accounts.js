import {getJSON,putJSON} from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import {getCookie} from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import {setInner,getValue} from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
import {backend} from "../../../url/config.js";

export function main() {
    // Load user profile data
    getJSON(backend.user.data, "login", getCookie("login"), function(response) {
        if (response.success && response.data) {
            const user = response.data;

            // Set profile picture
            const profilePicture = document.getElementById('profilePicture');
            if (profilePicture) {
                profilePicture.src = user.picture || '/assets/img/default-avatar.png';
            }

            // Set form values
            const nameInput = document.getElementById('profileName');
            const emailInput = document.getElementById('profileEmail');
            const roleInput = document.getElementById('profileRole');
            const joinedInput = document.getElementById('profileJoined');

            if (nameInput) nameInput.value = user.name || '';
            if (emailInput) emailInput.value = user.email || '';
            if (roleInput) roleInput.value = user.role || 'user';

            if (joinedInput && user.created_at) {
                const joinDate = new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                joinedInput.value = joinDate;
            }

            // Set account stats (demo data)
            setInner("loginCount", "47");
            setInner("lastLogin", "2 hours ago");
        }
    });
}

// Update profile function
window.updateProfile = async function() {
    const nameInput = document.getElementById('profileName');

    if (!nameInput || !nameInput.value.trim()) {
        alert('Please enter a valid name');
        return;
    }

    try {
        const updateData = {
            name: nameInput.value.trim()
        };

        const response = await putJSON(backend.user.update, "login", getCookie("login"), updateData);

        if (response.success) {
            // Show success message
            const notification = document.createElement('div');
            notification.className = 'notification is-success';
            notification.innerHTML = `
                <button class="delete" onclick="this.parentElement.remove()"></button>
                Profile updated successfully!
            `;

            // Insert notification at top of content
            const content = document.querySelector('.column.is-9');
            if (content) {
                content.insertBefore(notification, content.firstChild);
            }

            // Auto-hide notification after 3 seconds
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 3000);

        } else {
            throw new Error(response.message || 'Update failed');
        }

    } catch (error) {
        console.error('Profile update error:', error);

        // Show error message
        const notification = document.createElement('div');
        notification.className = 'notification is-danger';
        notification.innerHTML = `
            <button class="delete" onclick="this.parentElement.remove()"></button>
            Failed to update profile: ${error.message}
        `;

        // Insert notification at top of content
        const content = document.querySelector('.column.is-9');
        if (content) {
            content.insertBefore(notification, content.firstChild);
        }

        // Auto-hide notification after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
};