//lib call
import { setInner } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";

export function main() {
    // Load current configuration
    loadConfiguration();

    // Setup event listeners
    setupEventListeners();

    console.log("Settings config view loaded");
}

function loadConfiguration() {
    // Load theme setting
    const currentTheme = localStorage.getItem("theme") || "light";
    const themeSelect = document.getElementById("themeSelect");
    if (themeSelect) {
        themeSelect.value = currentTheme;
    }

    // Load language setting
    const currentLanguage = localStorage.getItem("language") || "en";
    const languageSelect = document.getElementById("languageSelect");
    if (languageSelect) {
        languageSelect.value = currentLanguage;
    }
}

function setupEventListeners() {
    const saveButton = document.getElementById("saveConfig");
    if (saveButton) {
        saveButton.addEventListener("click", saveConfiguration);
    }

    // Auto-save on change
    const themeSelect = document.getElementById("themeSelect");
    const languageSelect = document.getElementById("languageSelect");

    if (themeSelect) {
        themeSelect.addEventListener("change", applyTheme);
    }

    if (languageSelect) {
        languageSelect.addEventListener("change", applyLanguage);
    }
}

function saveConfiguration() {
    const themeSelect = document.getElementById("themeSelect");
    const languageSelect = document.getElementById("languageSelect");

    if (themeSelect) {
        localStorage.setItem("theme", themeSelect.value);
        applyTheme();
    }

    if (languageSelect) {
        localStorage.setItem("language", languageSelect.value);
        applyLanguage();
    }

    // Show success message
    if (window.Swal) {
        Swal.fire({
            icon: "success",
            title: "Configuration Saved",
            text: "Settings have been updated successfully",
            timer: 2000,
            showConfirmButton: false
        });
    }
}

function applyTheme() {
    const theme = document.getElementById("themeSelect")?.value || "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
}

function applyLanguage() {
    const language = document.getElementById("languageSelect")?.value || "en";
    localStorage.setItem("language", language);
    // Language changes would require page reload or dynamic translation
}