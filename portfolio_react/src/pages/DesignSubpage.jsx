import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const subpageData = {
    speaker: {
        title: "SPEAKER",
        description: "Exploring acoustic forms and material resonance. The speaker design focuses on minimal geometry and maximized acoustic performance.",
        images: [
            "/asia-stillz/Still 2026-02-27 211449_1.1.2.webp",
            "/asia-stillz-cropped/Still 2026-02-27 211449_1.10.1_vertical.webp",
            "/asia-stillz/Still 2026-02-27 211449_1.11.1.webp"
        ],
        palette: ['#6b7b8d', '#a0785a']
    },
    vanity: {
        title: "VANITY",
        description: "A study in reflection and daily rituals. Integrating seamless storage with brutalist surface selections.",
        images: [
            "/asia-stillz-cropped/Still 2026-02-27 211449_1.14.1_square.webp",
            "/asia-stillz/Still 2026-02-27 211449_1.2.1.webp",
            "/asia-stillz-cropped/Still 2026-02-27 211449_1.12.1_vertical.webp"
        ],
        palette: ['#8a6d5e', '#6b7b8d']
    },
    shelf: {
        title: "SHELF",
        description: "Modular resting spaces for objects of importance. Emphasizing verticality and intersecting planes.",
        images: [
            "/asia-stillz/Still 2026-02-27 211449_1.9.1.webp",
            "/asia-stillz-cropped/Still 2026-02-27 211449_1.16.1_square.webp",
            "/asia-stillz/Still 2026-02-27 211449_1.25.1.webp"
        ],
        palette: ['#a0785a', '#8a6d5e']
    }
};

const GridItem = ({ src }) => {
    const containerRef = useRef(null);
    const [dynamicGradient, setDynamicGradient] = useState('linear-gradient(to bottom, transparent, rgba(255,255,255,0.1))');
    
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 90%", "center center"]
    });

    const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [0, 1]);
    const y = useTransform(scrollYProgress, [0, 1], [40, 0]);

    const handleImageLoad = (e) => {
        try {
            const img = e.target;
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            
            // Downscale to 1x3 to easily get average colors for top, middle, and bottom
            canvas.width = 1;
            canvas.height = 3;
            ctx.drawImage(img, 0, 0, 1, 3);
            
            const c1 = ctx.getImageData(0, 0, 1, 1).data;
            const c2 = ctx.getImageData(0, 1, 1, 1).data;
            const c3 = ctx.getImageData(0, 2, 1, 1).data;
            
            const rgb1 = `rgb(${c1[0]}, ${c1[1]}, ${c1[2]})`;
            const rgb2 = `rgb(${c2[0]}, ${c2[1]}, ${c2[2]})`;
            const rgb3 = `rgb(${c3[0]}, ${c3[1]}, ${c3[2]})`;
            
            // Create a gradient that matches the image's vertical color flow
            setDynamicGradient(`linear-gradient(to bottom, transparent, ${rgb1} 25%, ${rgb2} 60%, ${rgb3} 100%)`);
        } catch (err) {
            console.error("Failed to extract image colors:", err);
        }
    };

    return (
        <div className="grid-item" ref={containerRef}>
            <motion.div className="grid-image-wrapper" style={{ opacity, y }}>
                <motion.div 
                    className="grid-vertical-line left-line"
                    style={{ 
                        scaleY,
                        background: dynamicGradient,
                        transformOrigin: 'top'
                    }}
                />
                <motion.div 
                    className="grid-vertical-line right-line"
                    style={{ 
                        scaleY,
                        background: dynamicGradient,
                        transformOrigin: 'top'
                    }}
                />
                <img 
                    src={`${import.meta.env.BASE_URL}${src.replace(/^\//, '')}`} 
                    alt="Design detail" 
                    loading="lazy"
                    crossOrigin="anonymous"
                    onLoad={handleImageLoad}
                />
            </motion.div>
        </div>
    );
};

export function DesignSubpage({ type, setActiveTab }) {
    const data = subpageData[type] || subpageData.speaker;
    
    return (
        <main className="design-grid-subpage">
            <div className="subpage-header">
                <button 
                    className="back-btn"
                    onClick={() => setActiveTab('Design')}
                >
                    &larr; BACK
                </button>
                <div className="subpage-text">
                    <h1>{data.title}</h1>
                    <p>{data.description}</p>
                </div>
            </div>

            <div className="subpage-grid">
                {/* Image grid items */}
                {data.images.map((src, idx) => (
                    <GridItem 
                        key={idx} 
                        src={src} 
                    />
                ))}
            </div>
        </main>
    );
}
