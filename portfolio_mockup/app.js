const images = [
    "Still 2026-02-27 211449_1.1.2.png", "Still 2026-02-27 211449_1.10.1.png",
    "Still 2026-02-27 211449_1.11.1.png", "Still 2026-02-27 211449_1.12.1.png",
    "Still 2026-02-27 211449_1.13.1.png", "Still 2026-02-27 211449_1.14.1.png",
    "Still 2026-02-27 211449_1.15.1.png", "Still 2026-02-27 211449_1.16.1.png",
    "Still 2026-02-27 211449_1.17.1.png", "Still 2026-02-27 211449_1.18.1.png",
    "Still 2026-02-27 211449_1.19.1.png", "Still 2026-02-27 211449_1.2.1.png",
    "Still 2026-02-27 211449_1.20.1.png", "Still 2026-02-27 211449_1.21.1.png",
    "Still 2026-02-27 211449_1.22.1.png", "Still 2026-02-27 211449_1.23.1.png",
    "Still 2026-02-27 211449_1.24.1.png", "Still 2026-02-27 211449_1.25.1.png",
    "Still 2026-02-27 211449_1.26.1.png", "Still 2026-02-27 211449_1.27.1.png",
    "Still 2026-02-27 211449_1.28.1.png", "Still 2026-02-27 211449_1.29.1.png",
    "Still 2026-02-27 211449_1.3.1.png", "Still 2026-02-27 211449_1.30.1.png",
    "Still 2026-02-27 211449_1.31.1.png", "Still 2026-02-27 211449_1.4.1.png",
    "Still 2026-02-27 211449_1.5.1.png", "Still 2026-02-27 211449_1.6.1.png",
    "Still 2026-02-27 211449_1.7.1.png", "Still 2026-02-27 211449_1.8.1.png",
    "Still 2026-02-27 211449_1.9.1.png"
];

const gallery = document.getElementById('gallery');
const loading = document.getElementById('loading');

let currentIndex = 0;
const batchSize = 8;
let isLoading = false;

// Mock project titles array for visual variety
const projectNames = ['Untitled', 'Archive', 'Campaign', 'Still', 'Portrait', 'Editorial', 'Object', 'Space'];

function loadMoreImages() {
    if (isLoading || currentIndex >= images.length) return;

    if (!gallery) return; // Not on the gallery page

    isLoading = true;

    const endIndex = Math.min(currentIndex + batchSize, images.length);
    const fragment = document.createDocumentFragment();

    for (let i = currentIndex; i < endIndex; i++) {
        const item = document.createElement('article');
        item.className = 'masonry-item';

        const img = document.createElement('img');
        // Using loading="lazy" adds native lazy-load capability as it scrolls
        img.loading = 'lazy';
        img.src = `asia-stillz/${images[i]}`;
        img.alt = `Photography ${i + 1}`;

        const tag = document.createElement('div');
        tag.className = 'masonry-tag';
        // Use a random mock title
        tag.textContent = projectNames[i % projectNames.length] + ' ' + (i + 1);

        const arrow = document.createElement('div');
        arrow.className = 'masonry-arrow';
        arrow.innerHTML = '&#8599;'; // North east arrow

        item.appendChild(img);
        item.appendChild(tag);
        item.appendChild(arrow);

        fragment.appendChild(item);
    }

    gallery.appendChild(fragment);
    currentIndex = endIndex;
    isLoading = false;

    if (currentIndex >= images.length) {
        if (loading) loading.style.display = 'none';
    }
}

// Initial load
loadMoreImages();

// Infinite scroll listener
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        loadMoreImages();
    }
});
