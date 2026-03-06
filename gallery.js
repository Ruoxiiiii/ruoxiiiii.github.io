// Gallery with View Toggle
document.addEventListener('DOMContentLoaded', function() {
    // Clean up any cached single-view state from browser cache FIRST
    document.querySelectorAll('.gallery.single-view').forEach(gallery => {
        gallery.classList.remove('single-view');
        const mainContainer = gallery.querySelector('.main-image-container');
        const thumbnailStrip = gallery.querySelector('.thumbnail-strip');
        if (mainContainer) mainContainer.remove();
        if (thumbnailStrip) thumbnailStrip.remove();
    });
    document.querySelectorAll('.view-toggle.active').forEach(btn => {
        btn.classList.remove('active');
    });

    const sections = document.querySelectorAll('.project-section');
    const exitFunctions = [];

    sections.forEach(section => {
        const gallery = section.querySelector('.gallery');
        const viewToggle = section.querySelector('.view-toggle');
        if (!gallery || !viewToggle) return;

        const images = Array.from(gallery.querySelectorAll('img'));
        let currentIndex = 0;
        let isSingleView = false;

        // Create single view elements
        const mainContainer = document.createElement('div');
        mainContainer.className = 'main-image-container';

        const prevBtn = document.createElement('button');
        prevBtn.className = 'nav-arrow nav-prev';
        prevBtn.innerHTML = '‹';
        prevBtn.addEventListener('click', () => showImage(currentIndex - 1));

        const mainImage = document.createElement('img');
        mainImage.className = 'main-image';

        const nextBtn = document.createElement('button');
        nextBtn.className = 'nav-arrow nav-next';
        nextBtn.innerHTML = '›';
        nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

        mainContainer.appendChild(prevBtn);
        mainContainer.appendChild(mainImage);
        mainContainer.appendChild(nextBtn);

        const thumbnailStrip = document.createElement('div');
        thumbnailStrip.className = 'thumbnail-strip';

        images.forEach((img, index) => {
            const thumb = document.createElement('img');
            thumb.src = img.src;
            thumb.alt = img.alt;
            thumb.addEventListener('click', () => showImage(index));
            thumbnailStrip.appendChild(thumb);
        });

        function showImage(index) {
            // Loop around
            if (index < 0) index = images.length - 1;
            if (index >= images.length) index = 0;

            currentIndex = index;
            mainImage.src = images[index].src;
            mainImage.alt = images[index].alt;

            const thumbs = thumbnailStrip.querySelectorAll('img');
            thumbs.forEach((thumb, i) => {
                thumb.classList.toggle('active', i === index);
            });

            // Scroll thumbnail into view
            thumbs[index].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }

        function enterSingleView(index = 0) {
            if (!isSingleView) {
                isSingleView = true;
                viewToggle.classList.add('active');
                gallery.classList.add('single-view');
                gallery.insertBefore(mainContainer, gallery.firstChild);
                gallery.appendChild(thumbnailStrip);
            }
            showImage(index);
        }

        function exitSingleView() {
            isSingleView = false;
            viewToggle.classList.remove('active');
            gallery.classList.remove('single-view');
            if (mainContainer.parentNode) mainContainer.remove();
            if (thumbnailStrip.parentNode) thumbnailStrip.remove();
        }

        // Store exit function for reset on page restore
        exitFunctions.push(exitSingleView);

        function toggleView() {
            if (isSingleView) {
                exitSingleView();
            } else {
                enterSingleView(0);
            }
        }

        viewToggle.addEventListener('click', toggleView);

        // Click on grid image to enter single view
        images.forEach((img, index) => {
            img.addEventListener('click', () => {
                if (!isSingleView) {
                    enterSingleView(index);
                }
            });
        });

        // Keyboard navigation for single view
        document.addEventListener('keydown', (e) => {
            if (!isSingleView || !section.classList.contains('active')) return;
            if (e.key === 'ArrowRight') showImage(currentIndex + 1);
            if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
        });
    });

    // Reset to grid view when navigating back to page
    window.addEventListener('pageshow', function(event) {
        // Always reset all galleries to grid view
        exitFunctions.forEach(fn => fn());
    });

    // Reset when switching sections via sidebar
    window.addEventListener('resetGalleryView', function() {
        exitFunctions.forEach(fn => fn());
    });
});
