export function main() {
    // Handle menu click events
    document.addEventListener('click', function(e) {
        // Handle nav link clicks
        if (e.target.closest('.nav__link') && e.target.closest('.nav__link').hash) {
            // Remove active class from all nav links
            document.querySelectorAll('.nav__link').forEach(link => {
                link.classList.remove('active');
            });

            // Add active class to clicked item
            e.target.closest('.nav__link').classList.add('active');
        }

        // Handle logout click
        if (e.target.closest('.nav__logout')) {
            e.preventDefault();
            if (window.authManager) {
                window.authManager.logout();
            } else {
                // Fallback logout
                document.cookie.split(";").forEach(function(c) {
                    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                });
                window.location.hash = '#home';
                window.location.reload();
            }
        }
    });

    // Set initial active menu item based on hash
    const currentHash = window.location.hash || '#home';
    const activeLink = document.querySelector(`.nav__link[href="${currentHash}"]`);
    if (activeLink) {
        // Remove active from all
        document.querySelectorAll('.nav__link').forEach(link => {
            link.classList.remove('active');
        });
        // Set current as active
        activeLink.classList.add('active');
    }

    console.log("Navbar view loaded");
}