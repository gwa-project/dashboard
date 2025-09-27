//lib call
import { setInner } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";

export function main() {
    // Setup API documentation functionality
    setupAPIDocumentation();

    console.log("API documentation view loaded");
}

function setupAPIDocumentation() {
    // Add syntax highlighting to code blocks if available
    const codeBlocks = document.querySelectorAll("pre code");
    codeBlocks.forEach(block => {
        block.classList.add("language-json");
    });

    // Add copy functionality to code blocks
    codeBlocks.forEach(block => {
        const pre = block.parentElement;
        if (pre) {
            const copyButton = document.createElement("button");
            copyButton.textContent = "Copy";
            copyButton.className = "button is-small is-pulled-right";
            copyButton.style.position = "relative";
            copyButton.style.top = "-40px";
            copyButton.style.right = "10px";

            copyButton.addEventListener("click", () => {
                navigator.clipboard.writeText(block.textContent).then(() => {
                    copyButton.textContent = "Copied!";
                    setTimeout(() => {
                        copyButton.textContent = "Copy";
                    }, 2000);
                });
            });

            pre.appendChild(copyButton);
        }
    });

    // Setup endpoint testing functionality
    setupEndpointTesting();
}

function setupEndpointTesting() {
    // This could be expanded to include API testing functionality
    const endpoints = document.querySelectorAll("li strong");
    endpoints.forEach(endpoint => {
        endpoint.style.cursor = "pointer";
        endpoint.title = "Click to test endpoint";

        endpoint.addEventListener("click", () => {
            const endpointText = endpoint.textContent;
            if (window.Swal) {
                Swal.fire({
                    title: "Test Endpoint",
                    text: `Testing ${endpointText}`,
                    icon: "info",
                    showConfirmButton: false,
                    timer: 2000
                });
            }
        });
    });
}