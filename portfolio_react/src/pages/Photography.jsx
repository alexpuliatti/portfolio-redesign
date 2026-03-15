import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import photographyProjects, { getImagePath } from '../photographyData';

// Helper to compute the thumbnail path from a full image path
const getThumbPath = (src) => {
    const dotIdx = src.lastIndexOf('.');
    if (dotIdx === -1) return src;
    return src.substring(0, dotIdx) + '_thumb.jpg';
};

const STATIC_GRADIENT = 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0.3) 100%)';

// ─── Detail Grid Item with LQIP blur-up loading ───
const DetailGridItem = ({ src, onClick }) => {
    const containerRef = useRef(null);
    const [visible, setVisible] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const thumbSrc = getThumbPath(src);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '200px 0px' }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div className="grid-item" ref={containerRef} style={{ contentVisibility: 'auto' }}>
            <div className="grid-image-wrapper">
                <div
                    className="grid-vertical-line left-line"
                    style={{
                        background: STATIC_GRADIENT,
                        transformOrigin: 'top',
                        transform: `scaleY(${imageLoaded ? 1 : 0})`,
                        transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
                    }}
                />
                <div
                    className="grid-vertical-line right-line"
                    style={{
                        background: STATIC_GRADIENT,
                        transformOrigin: 'top',
                        transform: `scaleY(${imageLoaded ? 1 : 0})`,
                        transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
                    }}
                />
                <div className="lqip-container" onClick={() => imageLoaded && onClick(src)}>
                    <img
                        src={`${import.meta.env.BASE_URL}${thumbSrc}`}
                        alt=""
                        className={`lqip-thumb ${imageLoaded ? 'lqip-hidden' : ''}`}
                        aria-hidden="true"
                    />
                    {visible && (
                        <img
                            src={`${import.meta.env.BASE_URL}${src}`}
                            alt="Project detail"
                            loading="lazy"
                            decoding="async"
                            className={`lqip-full ${imageLoaded ? 'lqip-visible' : ''}`}
                            onLoad={() => setImageLoaded(true)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Vertical Connecting Line using next image's colors ───
const ConnectingLine = ({ nextImageSrc, className = '' }) => {
    const [gradient, setGradient] = useState('transparent');
    const lineRef = useRef(null);

    // Extract gradient from next image
    useEffect(() => {
        if (!nextImageSrc) return;
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = `${import.meta.env.BASE_URL}${nextImageSrc}`;
        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d', { willReadFrequently: true });
                canvas.width = 1;
                canvas.height = 3;
                ctx.drawImage(img, 0, 0, 1, 3);
                
                const c1 = ctx.getImageData(0, 0, 1, 1).data;
                const c2 = ctx.getImageData(0, 1, 1, 1).data;
                const c3 = ctx.getImageData(0, 2, 1, 1).data;
                
                const rgb1 = `rgb(${c1[0]}, ${c1[1]}, ${c1[2]})`;
                const rgb2 = `rgb(${c2[0]}, ${c2[1]}, ${c2[2]})`;
                const rgb3 = `rgb(${c3[0]}, ${c3[1]}, ${c3[2]})`;
                
                setGradient(`linear-gradient(to bottom, transparent 0%, ${rgb1} 30%, ${rgb2} 60%, ${rgb3} 100%)`);
            } catch(e) {}
        };
    }, [nextImageSrc]);

    // Scroll effect identical to old App.jsx logic
    useEffect(() => {
        const handleScroll = () => {
            if (!lineRef.current) return;
            const wrapper = lineRef.current.parentElement;
            if (!wrapper) return;

            const wrapperRect = wrapper.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            const gapSize = parseFloat(getComputedStyle(lineRef.current).height);
            const distFromViewportBottom = viewportHeight - wrapperRect.bottom;
            const progress = distFromViewportBottom / (gapSize + viewportHeight * 0.8);
            const scale = Math.max(0, Math.min(1, 1 - Math.max(0, progress - 0.4) * 1.2));
            
            lineRef.current.style.transform = `translateX(-50%) scaleY(${scale})`;
            lineRef.current.style.transformOrigin = 'bottom center';
        };

        const scroller = () => requestAnimationFrame(handleScroll);
        window.addEventListener('scroll', scroller, { passive: true });
        scroller();
        return () => window.removeEventListener('scroll', scroller);
    }, []);

    return <div className={`connecting-line ${className}`} ref={lineRef} style={{ background: gradient }} />;
};

// ─── Build a flat gallery of all SHOWCASE images across all projects ───
const buildGalleryItems = () => {
    const items = [];
    photographyProjects.forEach((project) => {
        project.showcaseImages.forEach((img, idx) => {
            items.push({
                id: `${project.id}-showcase-${idx}`,
                projectId: project.id,
                title: project.title,
                slug: project.slug,
                // Compressed image generated via sharp for the main gallery fast loading
                src: getImagePath(project.slug, img.replace(/\.(jpg|jpeg|png)$/i, '_compressed.jpg')),
                // Original massive image kept for the expanded view
                originalSrc: getImagePath(project.slug, img),
                order: project.order,
                showcaseIdx: idx,
            });
        });
    });
    items.sort((a, b) => a.order - b.order || a.showcaseIdx - b.showcaseIdx);
    return items;
};

const galleryItems = buildGalleryItems();

export function Photography() {
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedShowcaseSrc, setSelectedShowcaseSrc] = useState(null);
    const [enlargedImage, setEnlargedImage] = useState(null);
    const expandedRef = useRef(null);
    const scrollPositionRef = useRef(0);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                if (enlargedImage) {
                    setEnlargedImage(null);
                } else {
                    setSelectedProject(null);
                    setSelectedShowcaseSrc(null);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [enlargedImage]);

    useEffect(() => {
        if (selectedProject) {
            // Reset scroll position to top when opening a project
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            if (expandedRef.current) {
                expandedRef.current.scrollTop = 0;
            }
        }
    }, [selectedProject]);

    const handleImageClick = (item) => {
        const project = photographyProjects.find((p) => p.id === item.projectId);
        if (project) {
            scrollPositionRef.current = window.scrollY;
            setSelectedProject(project);
            setSelectedShowcaseSrc(item.originalSrc);
        }
    };

    const handleClose = () => {
        setSelectedProject(null);
        setSelectedShowcaseSrc(null);
    };

    return (
        <main className="photography-page">
            {/* ─── Main View: Vertical List with Connecting Lines ─── */}
            <motion.div
                initial="visible"
                animate={selectedProject ? 'hidden' : 'visible'}
                variants={{
                    visible: { opacity: 1, display: 'flex' },
                    hidden: { opacity: 0, transitionEnd: { display: 'none' } },
                }}
                transition={{ duration: 0.4 }}
                style={{ width: '100%', flexDirection: 'column', alignItems: 'center', position: 'relative' }}
                onAnimationStart={() => {
                    // Restore scroll position when returning to gallery
                    if (!selectedProject && scrollPositionRef.current > 0) {
                        setTimeout(() => {
                            window.scrollTo({ top: scrollPositionRef.current, left: 0, behavior: 'instant' });
                            if (window.lenis) {
                                window.lenis.scrollTo(scrollPositionRef.current, { immediate: true });
                            }
                        }, 50);
                    }
                }}
            >
                        {/* Dynamic top gradient line connected to the first image */}
                        <div className="intro-divider-wrapper" style={{ marginTop: '5vh' }}>
                            {galleryItems.length > 0 && (
                                <ConnectingLine className="top-line" nextImageSrc={galleryItems[0].src} />
                            )}
                        </div>

                        <div className="image-list">
                            {galleryItems.map((item, idx) => {
                                const isLast = idx === galleryItems.length - 1;
                                const nextImageSrc = !isLast ? galleryItems[idx + 1].src : null;

                                return (
                                    <div key={`${item.projectId}-${item.showcaseIdx}-${idx}`} className="image-wrapper">
                                        <motion.img
                                            layoutId={`project-image-${item.projectId}-${item.showcaseIdx}`}
                                            src={`${import.meta.env.BASE_URL}${item.src}`}
                                            alt={item.title}
                                            loading="lazy"
                                            onClick={() => handleImageClick(item)}
                                            onContextMenu={(e) => e.preventDefault()}
                                        />
                                        {!isLast && <ConnectingLine nextImageSrc={nextImageSrc} />}
                                    </div>
                                );
                            })}
                        </div>
            </motion.div>

            {/* ─── Expanded Project View ─── */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div
                        key="expanded"
                        className="project-expanded"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        onAnimationStart={() => {
                            // Ensure window gets snapped to the top of the expanded view so user doesn't stay at y=5000px
                            if (selectedProject) {
                                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                                if (window.lenis) {
                                    window.lenis.scrollTo(0, { immediate: true });
                                }
                            }
                        }}
                    >
                        <button className="back-btn project-back-btn" onClick={handleClose}>
                            &larr; BACK
                        </button>

                        <div className="project-expanded-layout">
                            {/* Left: Main showcase image, sticky with layoutId */}
                            <div className="project-showcase-side">
                                <div className="project-showcase-sticky">
                                    <motion.img
                                        layoutId={`project-image-${selectedProject.id}-${galleryItems.find(i => i.src === selectedShowcaseSrc)?.showcaseIdx}`}
                                        src={`${import.meta.env.BASE_URL}${selectedShowcaseSrc}`}
                                        alt={selectedProject.title}
                                        className="project-showcase-image"
                                        onClick={() => setEnlargedImage(selectedShowcaseSrc)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                    <motion.h2 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="project-showcase-title"
                                    >
                                        {selectedProject.title}
                                    </motion.h2>
                                </div>
                            </div>

                            {/* Right: Scrollable detail grid with gradient lines */}
                            <div className="project-detail-side" ref={expandedRef}>
                                <div className="project-detail-grid">
                                    {selectedProject.detailImages.map((img, idx) => (
                                        <DetailGridItem
                                            key={idx}
                                            src={getImagePath(selectedProject.slug, img)}
                                            onClick={(src) => setEnlargedImage(src)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ─── Fullscreen Image Overlay (CSS-only, no exit animation = no flash) ─── */}
            {enlargedImage && (
                <div
                    className="fullscreen-overlay"
                    onClick={() => setEnlargedImage(null)}
                >
                    <img
                        src={`${import.meta.env.BASE_URL}${enlargedImage}`}
                        alt="Expanded detail"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </main>
    );
}
