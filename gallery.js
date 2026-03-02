// Lightbox Gallery
document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.querySelector('.gallery');
    if (!gallery) return;

    const images = Array.from(gallery.querySelectorAll('img'));
    let currentIndex = 0;

    // Create lightbox elements
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-close">&times;</div>
        <div class="lightbox-main">
            <div class="lightbox-nav lightbox-prev">&lsaquo;</div>
            <img src="" alt="">
            <div class="lightbox-nav lightbox-next">&rsaquo;</div>
        </div>
        <div class="lightbox-thumbnails"></div>
    `;
    document.body.appendChild(lightbox);

    const mainImg = lightbox.querySelector('.lightbox-main img');
    const thumbnailsContainer = lightbox.querySelector('.lightbox-thumbnails');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    // Create thumbnails
    images.forEach((img, index) => {
        const thumb = document.createElement('img');
        thumb.src = img.src;
        thumb.alt = img.alt;
        thumb.addEventListener('click', () => showImage(index));
        thumbnailsContainer.appendChild(thumb);
    });

    const thumbnails = thumbnailsContainer.querySelectorAll('img');

    function showImage(index) {
        currentIndex = index;
        mainImg.src = images[index].src;
        mainImg.alt = images[index].alt;

        // Update active thumbnail
        thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });

        // Scroll thumbnail into view
        thumbnails[index].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }

    function openLightbox(index) {
        showImage(index);
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function nextImage() {
        showImage((currentIndex + 1) % images.length);
    }

    function prevImage() {
        showImage((currentIndex - 1 + images.length) % images.length);
    }

    // Event listeners
    images.forEach((img, index) => {
        img.addEventListener('click', () => openLightbox(index));
    });

    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeLightbox();
    });
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        prevImage();
    });
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        nextImage();
    });

    // Close on background click (only on the lightbox overlay itself)
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Also close when clicking the main image area background (not the image)
    const lightboxMain = lightbox.querySelector('.lightbox-main');
    lightboxMain.addEventListener('click', (e) => {
        if (e.target === lightboxMain) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });
});
