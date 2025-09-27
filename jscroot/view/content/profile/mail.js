//lib call
import { setInner } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";

export function main() {
    // Load user email settings
    loadEmailSettings();

    // Setup event listeners
    setupEventListeners();

    console.log("Profile mail view loaded");
}

function loadEmailSettings() {
    // Get user data from localStorage or cookie
    const userEmail = getCookie("email") || localStorage.getItem("email");

    if (userEmail) {
        const emailInput = document.getElementById("primaryEmail");
        if (emailInput) {
            emailInput.value = userEmail;
        }
    }

    // Load notification preference
    const notificationEnabled = localStorage.getItem("emailNotifications") === "true";
    const notificationCheckbox = document.getElementById("notificationEmail");
    if (notificationCheckbox) {
        notificationCheckbox.checked = notificationEnabled;
    }
}

function setupEventListeners() {
    const saveButton = document.getElementById("saveEmailSettings");
    if (saveButton) {
        saveButton.addEventListener("click", saveEmailSettings);
    }
}

function saveEmailSettings() {
    const notificationCheckbox = document.getElementById("notificationEmail");

    if (notificationCheckbox) {
        localStorage.setItem("emailNotifications", notificationCheckbox.checked);

        // Show success message
        if (window.Swal) {
            Swal.fire({
                icon: "success",
                title: "Settings Saved",
                text: "Email settings have been updated successfully",
                timer: 2000,
                showConfirmButton: false
            });
        }
    }
}