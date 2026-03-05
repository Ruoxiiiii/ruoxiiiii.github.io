// Sidebar Navigation
document.addEventListener('DOMContentLoaded', function() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const sections = document.querySelectorAll('.project-section');

    // Handle URL hash on page load (for dropdown nav links)
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetSection = document.getElementById(targetId);
        const targetLink = document.querySelector(`.sidebar-link[data-section="${targetId}"]`);

        if (targetSection && targetLink) {
            sidebarLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            targetLink.classList.add('active');
            targetSection.classList.add('active');
        }
    }

    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Stop all YouTube videos by removing and re-adding iframe
            const allIframes = document.querySelectorAll('iframe');
            allIframes.forEach(iframe => {
                if (iframe.src.includes('youtube')) {
                    const parent = iframe.parentNode;
                    const clone = iframe.cloneNode(true);
                    parent.removeChild(iframe);
                    parent.appendChild(clone);
                }
            });

            // Get target section
            const targetId = this.getAttribute('data-section');
            const targetSection = document.getElementById(targetId);

            // Update active states
            sidebarLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            this.classList.add('active');
            targetSection.classList.add('active');

            // Scroll main content to top
            document.querySelector('.main-content').scrollTop = 0;
        });
    });

    // Info Toggle
    const infoToggles = document.querySelectorAll('.info-toggle');

    infoToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const header = this.closest('.project-header');
            const description = header.querySelector('.project-description');
            this.classList.toggle('active');
            description.classList.toggle('show');
        });
    });
});
