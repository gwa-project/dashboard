//lib call
import { setInner } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";

export function main() {
    // Setup user guide functionality
    setupUserGuide();

    console.log("User guide view loaded");
}

function setupUserGuide() {
    // Add interactive elements to the guide
    setupNavigationHighlights();
    setupProgressTracking();
}

function setupNavigationHighlights() {
    // Highlight navigation items when mentioned
    const navItems = document.querySelectorAll("li");
    navItems.forEach(item => {
        const text = item.textContent;
        if (text.includes("🏠") || text.includes("👤") || text.includes("⚙️") || text.includes("📚")) {
            item.style.backgroundColor = "#f0f8ff";
            item.style.padding = "8px";
            item.style.borderRadius = "4px";
            item.style.margin = "4px 0";
        }
    });
}

function setupProgressTracking() {
    // Add completion tracking for guide steps
    const steps = document.querySelectorAll("ol li");
    steps.forEach((step, index) => {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `step-${index}`;
        checkbox.style.marginRight = "8px";

        // Load saved progress
        const isCompleted = localStorage.getItem(`guide-step-${index}`) === "true";
        checkbox.checked = isCompleted;

        // Save progress on change
        checkbox.addEventListener("change", () => {
            localStorage.setItem(`guide-step-${index}`, checkbox.checked);
            updateProgress();
        });

        step.insertBefore(checkbox, step.firstChild);
    });

    updateProgress();
}

function updateProgress() {
    const totalSteps = document.querySelectorAll("ol li").length;
    const completedSteps = document.querySelectorAll("ol li input:checked").length;
    const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

    // Create or update progress bar
    let progressContainer = document.getElementById("guide-progress");
    if (!progressContainer) {
        progressContainer = document.createElement("div");
        progressContainer.id = "guide-progress";
        progressContainer.innerHTML = `
            <div class="box">
                <h4>Your Progress</h4>
                <progress class="progress is-primary" value="${progress}" max="100">${progress}%</progress>
                <p><span id="completed-count">${completedSteps}</span> of ${totalSteps} steps completed</p>
            </div>
        `;

        const firstBox = document.querySelector(".box");
        if (firstBox && firstBox.parentNode) {
            firstBox.parentNode.insertBefore(progressContainer, firstBox);
        }
    } else {
        const progressBar = progressContainer.querySelector("progress");
        const countSpan = progressContainer.querySelector("#completed-count");
        if (progressBar) {
            progressBar.value = progress;
        }
        if (countSpan) {
            countSpan.textContent = completedSteps;
        }
    }
}