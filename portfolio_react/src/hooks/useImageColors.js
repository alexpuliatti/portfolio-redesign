import { useState, useEffect } from 'react';

// Global cache to avoid re-extracting colors from the same image source
const colorCache = new Map();

/**
 * Custom hook to extract colors from an image and generate a CSS linear gradient.
 * 
 * @param {string} src - The image source URL.
 * @param {Object} options - Configuration options.
 * @param {string} options.direction - The gradient direction (e.g., 'to bottom', 'to right'). Default 'to bottom'.
 * @param {string} options.fallbackGradient - Gradient to return before loading or on error.
 * @param {number} options.samples - Number of color segments to sample (default 5).
 * @returns {Object} { gradient, isLoaded }
 */
export function useImageColors(src, options = {}) {
    const {
        direction = 'to bottom',
        fallbackGradient = 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.12) 40%, rgba(255,255,255,0.25) 100%)',
        samples = 5
    } = options;

    const [gradient, setGradient] = useState(fallbackGradient);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (!src) return;

        // Check cache first
        const cacheKey = `${src}-${direction}-${samples}`;
        if (colorCache.has(cacheKey)) {
            setGradient(colorCache.get(cacheKey));
            setIsLoaded(true);
            return;
        }

        // Reset state for new src
        setIsLoaded(false);

        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        // We use the full src but appending a query param or ensuring we load the lowest-res
        // version available for performance if possible. Here we just use the provided src.
        // For optimal performance, pass a thumbnail src if available.
        img.src = src.startsWith('/') ? `${import.meta.env.BASE_URL}${src.substring(1)}` : src;

        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d', { willReadFrequently: true });
                
                // We draw the image squished into a 1 x 'samples' pixel canvas
                canvas.width = 1;
                canvas.height = samples;
                ctx.drawImage(img, 0, 0, 1, samples);
                
                const colors = [];
                for (let i = 0; i < samples; i++) {
                    const pixel = ctx.getImageData(0, i, 1, 1).data;
                    colors.push(`rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`);
                }
                
                // Construct gradient bands
                let gradientString = `linear-gradient(${direction}, `;
                
                // Simple banding logic:
                // 0-15%, 25-35%, 45-55%, 65-75%, 85-100% for 5 samples
                if (samples === 5) {
                    gradientString += `${colors[0]} 0%, ${colors[0]} 15%, `;
                    gradientString += `${colors[1]} 25%, ${colors[1]} 35%, `;
                    gradientString += `${colors[2]} 45%, ${colors[2]} 55%, `;
                    gradientString += `${colors[3]} 65%, ${colors[3]} 75%, `;
                    gradientString += `${colors[4]} 85%, ${colors[4]} 100%`;
                } else {
                    // Generic even distribution for other sample sizes
                    colors.forEach((col, idx) => {
                        const step = 100 / (samples - 1);
                        gradientString += `${col} ${Math.round(idx * step)}%${idx < samples - 1 ? ', ' : ''}`;
                    });
                }
                
                gradientString += ')';
                
                colorCache.set(cacheKey, gradientString);
                setGradient(gradientString);
                setIsLoaded(true);
            } catch (e) {
                console.error("Failed to extract image colors:", e);
                // Keep fallback gradient on error
            }
        };

        img.onerror = () => {
            console.error("Failed to load image for color extraction:", src);
        };
    }, [src, direction, samples, fallbackGradient]);

    return { gradient, isLoaded };
}
