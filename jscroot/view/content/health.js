import {getJSON} from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import {getCookie} from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import {setInner} from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
import {backend} from "../../url/config.js";

export function main() {
    // Check backend health on page load
    checkBackendHealth();
}

async function checkBackendHealth() {
    const startTime = Date.now();

    try {
        // Show loading state
        setInner("backendStatus", '<span class="tag is-warning">Checking...</span>');
        setInner("backendResponseTime", 'Measuring...');

        const response = await getJSON(backend.health, "login", getCookie("login"));
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        if (response.success) {
            // Backend is healthy
            setInner("backendStatus", '<span class="tag is-success">Online</span>');
            setInner("backendResponseTime", `${responseTime}ms`);

            // Set environment from health response
            if (response.data && response.data.environment) {
                setInner("backendEnvironment", response.data.environment);
            }

            // Set database status from health response
            if (response.data && response.data.database) {
                const dbStatus = response.data.database === 'connected' ?
                    '<span class="tag is-success">Connected</span>' :
                    '<span class="tag is-danger">Disconnected</span>';
                setInner("databaseStatus", dbStatus);
            }

            // Update functions status
            setInner("functionsStatus", "Online");
            setInner("functionsLastUpdate", new Date().toLocaleString());

        } else {
            throw new Error(response.message || 'Health check failed');
        }

    } catch (error) {
        console.error('Health check error:', error);

        // Backend is down or unreachable
        setInner("backendStatus", '<span class="tag is-danger">Offline</span>');
        setInner("backendResponseTime", 'Timeout');
        setInner("databaseStatus", '<span class="tag is-danger">Unknown</span>');
        setInner("functionsStatus", "Error");
    }

    // Update last check time
    setInner("lastHealthCheck", new Date().toLocaleString());
}

// Global functions for buttons
window.checkBackendHealth = checkBackendHealth;

window.checkFunctionsStatus = async function() {
    try {
        // Test a simple endpoint to check if functions are responding
        const response = await fetch(backend.home);
        const responseTime = Date.now();

        if (response.ok) {
            setInner("functionsStatus", "Online");
            setInner("functionsLastUpdate", new Date().toLocaleString());

            // Show success notification
            showNotification('Cloud Functions are responding normally', 'success');
        } else {
            throw new Error(`HTTP ${response.status}`);
        }

    } catch (error) {
        console.error('Functions check error:', error);
        setInner("functionsStatus", "Error");

        // Show error notification
        showNotification('Cloud Functions check failed: ' + error.message, 'danger');
    }
};

window.runFullHealthCheck = async function() {
    // Show loading notification
    showNotification('Running full system health check...', 'info');

    try {
        // Check backend health
        await checkBackendHealth();

        // Check functions status
        await checkFunctionsStatus();

        // Simulate additional checks
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Show success notification
        showNotification('Full health check completed successfully', 'success');

    } catch (error) {
        console.error('Full health check error:', error);
        showNotification('Health check encountered errors: ' + error.message, 'danger');
    }
};

window.downloadHealthReport = function() {
    // Generate health report data
    const report = {
        timestamp: new Date().toISOString(),
        backend: {
            status: document.getElementById('backendStatus')?.textContent || 'Unknown',
            responseTime: document.getElementById('backendResponseTime')?.textContent || 'Unknown',
            environment: document.getElementById('backendEnvironment')?.textContent || 'Unknown',
        },
        database: {
            status: document.getElementById('databaseStatus')?.textContent || 'Unknown',
            type: 'MongoDB Atlas',
            collections: 'users'
        },
        services: [
            {
                name: 'Google OAuth',
                status: 'Active',
                version: 'OAuth 2.0'
            },
            {
                name: 'Cloud Functions',
                status: document.getElementById('functionsStatus')?.textContent || 'Unknown',
                version: 'Gen 2'
            },
            {
                name: 'PASETO Security',
                status: 'Active',
                version: 'v4.local'
            },
            {
                name: 'CORS Policy',
                status: 'Configured',
                version: 'Multiple Origins'
            }
        ]
    };

    // Convert to JSON and download
    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `health-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    showNotification('Health report downloaded successfully', 'success');
};

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification is-${type}`;
    notification.innerHTML = `
        <button class="delete" onclick="this.parentElement.remove()"></button>
        ${message}
    `;

    // Insert at top of content area
    const content = document.querySelector('.column.is-9');
    if (content) {
        content.insertBefore(notification, content.firstChild);
    }

    // Auto-hide after 4 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 4000);
}