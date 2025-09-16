export function main() {
    // Handle menu click events
    document.addEventListener('click', function(e) {
        // Handle navbar burger menu for mobile
        if (e.target.classList.contains('navbar-burger') || e.target.closest('.navbar-burger')) {
            const burger = e.target.closest('.navbar-burger') || e.target;
            const target = document.getElementById(burger.dataset.target || 'navbarMain');

            if (target) {
                burger.classList.toggle('is-active');
                target.classList.toggle('is-active');
            }
        }

        // Handle menu item clicks
        if (e.target.tagName === 'A' && e.target.hash) {
            // Remove active class from all menu items
            document.querySelectorAll('.menu-list a').forEach(link => {
                link.classList.remove('is-active');
            });

            // Add active class to clicked item
            e.target.classList.add('is-active');
        }
    });

    // Set initial active menu item based on hash
    const currentHash = window.location.hash || '#home';
    const activeLink = document.querySelector(`a[href="${currentHash}"]`);
    if (activeLink) {
        // Remove active from all
        document.querySelectorAll('.menu-list a').forEach(link => {
            link.classList.remove('is-active');
        });
        // Set current as active
        activeLink.classList.add('is-active');
    }

    console.log("Navbar view loaded");
}