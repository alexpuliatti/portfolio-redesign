import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const allImages = [
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

const mockProjectNames = ['Archive', 'Campaign', 'Still', 'Portrait', 'Editorial', 'Object', 'Space'];

// Hardcode the recently cropped varied-aspect-ratio images
const croppedVertical = [
    "Still 2026-02-27 211449_1.1.2_vertical.png",
    "Still 2026-02-27 211449_1.10.1_vertical.png",
    "Still 2026-02-27 211449_1.11.1_vertical.png",
    "Still 2026-02-27 211449_1.12.1_vertical.png",
    "Still 2026-02-27 211449_1.13.1_vertical.png",
];

const croppedSquare = [
    "Still 2026-02-27 211449_1.14.1_square.png",
    "Still 2026-02-27 211449_1.15.1_square.png",
    "Still 2026-02-27 211449_1.16.1_square.png",
    "Still 2026-02-27 211449_1.17.1_square.png",
    "Still 2026-02-27 211449_1.18.1_square.png",
];

// Rebuild the categorizedImages array to mix originals with the new aspect ratios
let categorizedImages = [];
let idCounter = 0;

// Helper to push with modular project assignment
const pushImage = (src, isCropped = false) => {
    const basePath = isCropped ? '/asia-stillz-cropped' : '/asia-stillz';
    categorizedImages.push({
        src: `${basePath}/${src}`,
        project: mockProjectNames[idCounter % mockProjectNames.length],
        id: `img-${idCounter++}`
    });
};

// Start by injecting some mixed ratios, then fall back to the rest of the standard horizontals
pushImage(croppedVertical[0], true);
pushImage(allImages[0]);
pushImage(croppedSquare[0], true);
pushImage(allImages[1]);
pushImage(croppedVertical[1], true);
pushImage(allImages[2]);
pushImage(croppedSquare[1], true);
pushImage(croppedVertical[2], true);
pushImage(allImages[3]);
pushImage(croppedSquare[2], true);
pushImage(allImages[4]);
pushImage(croppedVertical[3], true);
pushImage(allImages[5]);
pushImage(croppedSquare[3], true);
pushImage(croppedVertical[4], true);
pushImage(allImages[6]);
pushImage(croppedSquare[4], true);

// Add the rest of the standard horizontals
for (let i = 7; i < allImages.length; i++) {
    pushImage(allImages[i]);
}

export function Photography() {
    const [activeFilter, setActiveFilter] = useState('All');
    const [images, setImages] = useState([]);
    const [page, setPage] = useState(1);
    const [hoveredId, setHoveredId] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const itemsPerPage = 8;
    const loaderRef = useRef(null);

    const filteredData = activeFilter === 'All'
        ? categorizedImages
        : categorizedImages.filter(img => img.project === activeFilter);

    // Initial load or filter change
    useEffect(() => {
        setPage(1);
        setImages(filteredData.slice(0, itemsPerPage));
    }, [activeFilter]);

    // Infinite Scroll Intersection Observer
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const target = entries[0];
            if (target.isIntersecting) {
                setPage((prev) => prev + 1);
            }
        });

        if (loaderRef.current) observer.observe(loaderRef.current);

        return () => {
            if (loaderRef.current) observer.unobserve(loaderRef.current);
        };
    }, []);

    // Compute slice based on page
    useEffect(() => {
        if (page > 1) {
            setImages(filteredData.slice(0, page * itemsPerPage));
        }
    }, [page, filteredData]);

    // Handle Escape key to close full screen
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setSelectedImage(null);
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <main>

            {/* Sub-Navigation for Projects Filter */}
            <div className="filter-nav glass-card">
                <button
                    className={`filter-btn ${activeFilter === 'All' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('All')}
                >
                    All
                </button>
                {mockProjectNames.map(proj => (
                    <button
                        key={proj}
                        className={`filter-btn ${activeFilter === proj ? 'active' : ''}`}
                        onClick={() => setActiveFilter(proj)}
                    >
                        {proj}
                    </button>
                ))}
            </div>

            <section className="masonry-gallery">
                <AnimatePresence mode="popLayout">
                    {images.map((img) => {
                        const isHovered = hoveredId === img.id;
                        const isAnyHovered = hoveredId !== null;
                        const opacity = isAnyHovered && !isHovered ? 0.4 : 1;

                        return (
                            <motion.article
                                layoutId={`container-${img.id}`}
                                className="masonry-item"
                                key={img.id}
                                onMouseEnter={() => setHoveredId(img.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                onClick={() => setSelectedImage(img)}
                                style={{ opacity, transition: 'opacity 0.3s ease' }}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: isAnyHovered && !isHovered ? 0.4 : 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4 }}
                            >
                                <motion.img
                                    layoutId={`image-${img.id}`}
                                    src={img.src}
                                    alt={img.project}
                                    loading="lazy"
                                />

                                <AnimatePresence>
                                    {isHovered && (
                                        <motion.div
                                            key="tag"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="masonry-tag glass-nav"
                                        >
                                            {img.project}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                            </motion.article>
                        );
                    })}
                </AnimatePresence>
            </section>

            {images.length < filteredData.length && (
                <div ref={loaderRef} className="loading-indicator">
                    Loading...
                </div>
            )}

            {/* Full Screen Lightbox using Framer Motion Shared Layouts */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        className="fullscreen-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div
                            layoutId={`container-${selectedImage.id}`}
                            className="fullscreen-image-wrapper"
                            onClick={(e) => e.stopPropagation()} // Prevent close when clicking image
                        >
                            <motion.img
                                layoutId={`image-${selectedImage.id}`}
                                src={selectedImage.src}
                                alt="Full screen"
                            />
                            <button className="close-btn" onClick={() => setSelectedImage(null)}>
                                &times;
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </main>
    );
}
