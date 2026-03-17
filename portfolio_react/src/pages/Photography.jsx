import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import photographyProjects, { getImagePath } from '../photographyData';

// Helper to compute the thumbnail path from a full image path
const getThumbPath = (src) => {
    const dotIdx = src.lastIndexOf('.');
    if (dotIdx === -1) return src;
    return src.substring(0, dotIdx) + '_thumb.jpg';
};

// Helper to compute the mobile-optimised path from a full image path
const getMobilePath = (src) => {
    const dotIdx = src.lastIndexOf('.');
    if (dotIdx === -1) return src;
    return src.substring(0, dotIdx) + '_mobile.jpg';
};

const isMobile = () => typeof window !== 'undefined' && window.innerWidth <= 900;

const STATIC_GRADIENT = 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0.3) 100%)';

// ─── Detail Grid Item with LQIP blur-up loading ───
const DetailGridItem = ({ src, onClick }) => {
    const containerRef = useRef(null);
    const [visible, setVisible] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const thumbSrc = getThumbPath(src);
    // On mobile, load the lightweight _mobile.jpg variant instead of the full original
    const displaySrc = isMobile() ? getMobilePath(src) : src;

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
        <div className="grid-item" ref={containerRef}>
            <div className="grid-image-wrapper">
                <div
                    className="grid-vertical-line left-line"
                    style={{
                        background: STATIC_GRADIENT,
                        transformOrigin: 'top',
                        transform: `scaleY(${imageLoaded ? 1 : 0})`,
                        transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s, opacity 0.6s ease',
                        opacity: visible ? 1 : 0,
                    }}
                />
                <div
                    className="grid-vertical-line right-line"
                    style={{
                        background: STATIC_GRADIENT,
                        transformOrigin: 'top',
                        transform: `scaleY(${imageLoaded ? 1 : 0})`,
                        transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s, opacity 0.6s ease',
                        opacity: visible ? 1 : 0,
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
                            src={`${import.meta.env.BASE_URL}${displaySrc}`}
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

// ─── Shared scroll manager (desktop only) ───
// One scroll listener drives all ConnectingLine animations instead of N separate ones.
const scrollUpdaters = new Set();
let scrollListenerActive = false;
let scrollTicking = false;

const sharedScrollHandler = () => {
    if (!scrollTicking) {
        window.requestAnimationFrame(() => {
            scrollUpdaters.forEach((fn) => fn());
            scrollTicking = false;
        });
        scrollTicking = true;
    }
};

const registerScrollUpdater = (fn) => {
    scrollUpdaters.add(fn);
    if (!scrollListenerActive) {
        window.addEventListener('scroll', sharedScrollHandler, { passive: true });
        scrollListenerActive = true;
    }
};

const unregisterScrollUpdater = (fn) => {
    scrollUpdaters.delete(fn);
    if (scrollUpdaters.size === 0 && scrollListenerActive) {
        window.removeEventListener('scroll', sharedScrollHandler);
        scrollListenerActive = false;
    }
};

// ─── Vertical Connecting Line using next image's colors ───
const ConnectingLine = ({ nextImageSrc, className = '' }) => {
    const [gradient, setGradient] = useState('transparent');
    const [revealed, setRevealed] = useState(false);
    const lineRef = useRef(null);
    const mobile = isMobile();

    // Reveal line when it enters the viewport
    useEffect(() => {
        const el = lineRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setRevealed(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '100px 0px' }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // Extract gradient from next image — use thumbnail on mobile for speed
    useEffect(() => {
        if (!nextImageSrc) return;
        // Use the tiny _thumb_compressed version for color sampling (no resolution needed for a 1×3 canvas)
        const thumbSrc = nextImageSrc.replace('_compressed.jpg', '_thumb_compressed.jpg');
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = `${import.meta.env.BASE_URL}${thumbSrc}`;
        img.onerror = () => {
            // Fallback to the original source if thumb doesn't exist
            const fallback = new Image();
            fallback.crossOrigin = 'anonymous';
            fallback.src = `${import.meta.env.BASE_URL}${nextImageSrc}`;
            fallback.onload = () => extractColors(fallback);
        };
        img.onload = () => extractColors(img);

        function extractColors(loadedImg) {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d', { willReadFrequently: true });
                canvas.width = 1;
                canvas.height = 3;
                ctx.drawImage(loadedImg, 0, 0, 1, 3);
                
                const c1 = ctx.getImageData(0, 0, 1, 1).data;
                const c2 = ctx.getImageData(0, 1, 1, 1).data;
                const c3 = ctx.getImageData(0, 2, 1, 1).data;
                
                const rgb1 = `rgb(${c1[0]}, ${c1[1]}, ${c1[2]})`;
                const rgb2 = `rgb(${c2[0]}, ${c2[1]}, ${c2[2]})`;
                const rgb3 = `rgb(${c3[0]}, ${c3[1]}, ${c3[2]})`;
                
                setGradient(`linear-gradient(to bottom, ${rgb1} 0%, ${rgb2} 50%, ${rgb3} 100%)`);
            } catch(e) {}
        }
    }, [nextImageSrc]);

    // Scroll-driven retraction effect via the shared scroll manager
    useEffect(() => {
        if (!revealed) return;

        let cachedDims = null;

        const updateDimensions = () => {
            if (!lineRef.current) return;
            const wrapper = lineRef.current.parentElement;
            if (!wrapper) return;

            const rect = wrapper.getBoundingClientRect();
            const absoluteY = window.scrollY + rect.top;
            
            cachedDims = {
                wrapperBottom: absoluteY + rect.height,
                gapSize: window.innerHeight * (window.innerWidth <= 900 ? 0.2 : 0.3), // Matches 20vh / 30vh CSS logic 
                viewportHeight: window.innerHeight,
            };
            
            performAnimation();
        };

        const performAnimation = () => {
            if (!lineRef.current || !cachedDims) return;
            
            const { wrapperBottom, gapSize, viewportHeight } = cachedDims;
            const currentScrollBottom = window.scrollY + viewportHeight;
            const distFromViewportBottom = currentScrollBottom - wrapperBottom;
            
            const progress = distFromViewportBottom / (gapSize + viewportHeight * 0.8);
            const rawScale = 1 - Math.max(0, progress - 0.4) * 1.2;
            const scale = Math.max(0, Math.min(1, rawScale));
            
            lineRef.current.style.transform = `translate3d(-50%, 0, 0) scaleY(${scale})`;
        };

        updateDimensions();
        registerScrollUpdater(performAnimation);
        
        const handleResize = () => updateDimensions();
        window.addEventListener('resize', handleResize, { passive: true });
        
        return () => {
            unregisterScrollUpdater(performAnimation);
            window.removeEventListener('resize', handleResize);
        };
    }, [revealed, mobile]);

    return (
        <div
            className={`connecting-line ${className} ${revealed ? 'line-revealed' : ''}`}
            ref={lineRef}
            style={{ background: gradient }}
        />
    );
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

// ─── Showcase Grid Item with LQIP blur-up loading ───
const ShowcaseGridItem = ({ item, onClick }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    
    // Construct the thumb src
    const thumbSrc = item.src.replace('_compressed.jpg', '_thumb_compressed.jpg');

    return (
        <div className="lqip-container showcase-lqip" onClick={() => onClick(item)}>
            <img
                src={`${import.meta.env.BASE_URL}${thumbSrc}`}
                alt=""
                className={`lqip-thumb ${imageLoaded ? 'lqip-hidden' : ''}`}
                aria-hidden="true"
            />
            <motion.img
                layoutId={`project-image-${item.projectId}-${item.showcaseIdx}`}
                src={`${import.meta.env.BASE_URL}${item.src}`}
                alt={item.title}
                loading="lazy"
                decoding="async"
                className={`lqip-full ${imageLoaded ? 'lqip-visible' : ''}`}
                onLoad={() => setImageLoaded(true)}
                onContextMenu={(e) => e.preventDefault()}
            />
        </div>
    );
};

export function Photography() {
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedShowcaseSrc, setSelectedShowcaseSrc] = useState(null);
    const [enlargedImage, setEnlargedImage] = useState(null);
    const expandedRef = useRef(null);
    const scrollPositionRef = useRef(0);
    const mainGalleryRef = useRef(null);
    const projectContainerRef = useRef(null);

    // Close project helper (shared by back button, Escape, popstate)
    const closeProject = () => {
        // Freeze the expanded project view exactly where it currently is scrolled
        if (projectContainerRef.current) {
            projectContainerRef.current.style.position = 'fixed';
            projectContainerRef.current.style.top = `-${window.scrollY}px`;
            projectContainerRef.current.style.width = '100%';
        }
        // Unlock the main gallery
        // Unlock the main gallery. Since we no longer use display: none, the DOM 
        // heights are perfectly preserved in memory and instantly re-apply to layout.
        if (mainGalleryRef.current) {
            mainGalleryRef.current.style.position = '';
            mainGalleryRef.current.style.top = '';
        }
        
        // Synchronously jump the real window back to the original place
        if (window.lenis) {
            window.lenis.resize(); // Force Lenis to update its internal bounds synchronously
            window.lenis.scrollTo(scrollPositionRef.current, { immediate: true });
        }
        window.scrollTo({ top: scrollPositionRef.current, left: 0, behavior: 'instant' });

        setSelectedProject(null);
        setSelectedShowcaseSrc(null);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                if (enlargedImage) {
                    setEnlargedImage(null);
                } else if (selectedProject) {
                    // Use history.back() so the popstate handler fires
                    window.history.back();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [enlargedImage, selectedProject]);

    // Listen for topbar logo click to completely reset to main gallery
    useEffect(() => {
        const handleReset = () => {
            closeProject();
            // Replace the hash back to Photography
            window.history.replaceState(null, '', '#Photography');
            window.scrollTo({ top: 0, behavior: 'instant' });
            if (window.lenis) {
                window.lenis.scrollTo(0, { immediate: true });
            }
        };
        window.addEventListener('reset-photography', handleReset);
        return () => window.removeEventListener('reset-photography', handleReset);
    }, []);

    // Handle browser back/forward for project sub-URLs
    useEffect(() => {
        const handlePopState = () => {
            const hash = window.location.hash.replace('#', '');
            if (hash === 'Photography' || !hash.startsWith('Photography/')) {
                // User pressed back, close the project
                closeProject();
            }
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    useEffect(() => {
        if (selectedProject) {
            if (expandedRef.current) {
                expandedRef.current.scrollTop = 0;
            }
        }
    }, [selectedProject]);

    const handleImageClick = (item) => {
        const project = photographyProjects.find((p) => p.id === item.projectId);
        if (project) {
            scrollPositionRef.current = window.scrollY;

            // Freeze main gallery exactly where it is so it fades out without jumping to 0
            if (mainGalleryRef.current) {
                mainGalleryRef.current.style.position = 'fixed';
                mainGalleryRef.current.style.top = `-${scrollPositionRef.current}px`;
                mainGalleryRef.current.style.width = '100%';
            }
            // Unlock the expanded gallery container if it was frozen
            if (projectContainerRef.current) {
                projectContainerRef.current.style.position = '';
                projectContainerRef.current.style.top = '';
            }
            
            // Synchronously immediately jump real scroll to 0 for the expanding project view
            if (window.lenis) {
                window.lenis.resize();
                window.lenis.scrollTo(0, { immediate: true });
            }
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

            setSelectedProject(project);
            setSelectedShowcaseSrc(item.originalSrc);
            // Push sub-URL so browser back returns to gallery
            window.history.pushState({ projectSlug: project.slug }, '', `#Photography/${project.slug}`);
        }
    };

    const handleClose = () => {
        // Use history.back() so the popstate handler fires and URL updates
        window.history.back();
    };

    return (
        <main className="photography-page">
            {/* ─── Main View: Vertical List with Connecting Lines ─── */}
            <motion.div
                ref={mainGalleryRef}
                initial="visible"
                animate={selectedProject ? 'hidden' : 'visible'}
                variants={{
                    visible: { opacity: 1, pointerEvents: 'auto' },
                    hidden: { opacity: 0, pointerEvents: 'none' },
                }}
                transition={{ duration: 0.4 }}
                style={{ width: '100%', flexDirection: 'column', alignItems: 'center', display: 'flex' }}
            >
                        {/* Dynamic top gradient line connected to the first image */}
                        <div className="intro-divider-wrapper">
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
                                        <ShowcaseGridItem item={item} onClick={handleImageClick} />
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
                        ref={projectContainerRef}
                        key="expanded"
                        className="project-expanded"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
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
