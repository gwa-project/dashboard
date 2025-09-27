//lib call
import { setInner } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";

export function main() {
    // Load current security settings
    loadSecuritySettings();

    // Setup event listeners
    setupEventListeners();

    console.log("Settings security view loaded");
}

function loadSecuritySettings() {
    // Load 2FA setting
    const twoFAEnabled = localStorage.getItem("twoFAEnabled") === "true";
    const twoFACheckbox = document.getElementById("enable2FA");
    if (twoFACheckbox) {
        twoFACheckbox.checked = twoFAEnabled;
    }
}

function setupEventListeners() {
    const saveButton = document.getElementById("saveSecuritySettings");
    if (saveButton) {
        saveButton.addEventListener("click", saveSecuritySettings);
    }
}

function saveSecuritySettings() {
    const currentPassword = document.getElementById("currentPassword")?.value;
    const newPassword = document.getElementById("newPassword")?.value;
    const confirmPassword = document.getElementById("confirmPassword")?.value;
    const enable2FA = document.getElementById("enable2FA")?.checked;

    // Validate password change if provided
    if (newPassword || confirmPassword) {
        if (!currentPassword) {
            showError("Current password is required");
            return;
        }

        if (newPassword !== confirmPassword) {
            showError("New passwords do not match");
            return;
        }

        if (newPassword.length < 8) {
            showError("New password must be at least 8 characters long");
            return;
        }
    }

    // Save 2FA setting
    if (enable2FA !== undefined) {
        localStorage.setItem("twoFAEnabled", enable2FA);
    }

    // Clear password fields
    document.getElementById("currentPassword").value = "";
    document.getElementById("newPassword").value = "";
    document.getElementById("confirmPassword").value = "";

    // Show success message
    if (window.Swal) {
        Swal.fire({
            icon: "success",
            title: "Security Settings Updated",
            text: "Your security settings have been saved successfully",
            timer: 2000,
            showConfirmButton: false
        });
    }
}

function showError(message) {
    if (window.Swal) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: message,
            timer: 3000,
            showConfirmButton: false
        });
    } else {
        alert(message);
    }
}