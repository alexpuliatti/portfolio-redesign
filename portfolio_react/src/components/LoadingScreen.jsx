import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Use tiny 64px thumbnails (~3-9KB each) instead of full-res images (~2-4MB each)
// Imported from src/assets so Vite bundles them properly (may even inline as base64)
const imageModules = import.meta.glob('../assets/loading-thumbs/*.{png,webp,jpg}', { eager: true });
const imageSrcs = Object.values(imageModules).map(mod => mod.default);

// Preload all images into browser cache at module level (runs once on import)
const preloadedImages = imageSrcs.map(src => {
  const img = new Image();
  img.src = src;
  return img;
});

export function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagesReady, setImagesReady] = useState(false);
  const canvasRef = useRef(null);

  // Wait for all preloaded images to be fully decoded before starting
  useEffect(() => {
    if (preloadedImages.length === 0) {
      setImagesReady(true);
      return;
    }

    // Check if all images are already loaded (cached)
    const allComplete = preloadedImages.every(img => img.complete && img.naturalWidth > 0);
    if (allComplete) {
      setImagesReady(true);
      return;
    }

    // Otherwise wait for them all
    let mounted = true;
    Promise.all(
      preloadedImages.map(img =>
        img.complete && img.naturalWidth > 0
          ? Promise.resolve()
          : new Promise(resolve => {
              img.onload = resolve;
              img.onerror = resolve; // Don't block on failures
            })
      )
    ).then(() => {
      if (mounted) setImagesReady(true);
    });

    return () => { mounted = false; };
  }, []);

  // Update canvas for pixel effect — use preloaded Image objects directly
  useEffect(() => {
    if (!imagesReady || preloadedImages.length === 0 || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    // Keep it blocky
    ctx.imageSmoothingEnabled = false;

    const img = preloadedImages[currentImageIndex];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const targetSize = 32; 
    const scale = Math.max(targetSize / img.naturalWidth, targetSize / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    const x = (targetSize - w) / 2;
    const y = (targetSize - h) / 2;
    
    ctx.clearRect(0, 0, targetSize, targetSize);
    ctx.drawImage(img, x, y, w, h);
  }, [currentImageIndex, imagesReady]);

  useEffect(() => {
    if (!imagesReady) return;

    // Prevent scrolling while loading
    document.body.style.overflow = 'hidden';
    
    const duration = 3000; // 3 seconds loading prototype
    const interval = 50; // Update every 50ms
    const totalSteps = duration / interval;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const currentProgress = Math.min((step / totalSteps) * 100, 100);
      setProgress(currentProgress);
      
      // Change image rapidly (every 2 steps = 100ms)
      if (step % 2 === 0 && preloadedImages.length > 0) {
        setCurrentImageIndex(prev => (prev + 1) % preloadedImages.length);
      }

      if (currentProgress >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          document.body.style.overflow = '';
          onComplete();
        }, 400); // Small delay before unmounting
      }
    }, interval);

    return () => {
      clearInterval(timer);
      document.body.style.overflow = '';
    };
  }, [onComplete, imagesReady]);

  return (
    <motion.div
      className="loading-screen"
      initial={{ opacity: 1 }}
      exit={{ y: '-100%', opacity: 0, transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
    >
      {/* BOTTOM PROGRESS BAR */}
      <div 
        className="loading-progress-bar"
        style={{ width: `${progress}%` }}
      />

      <div className="loading-content">
        {/* INLINE TEXT AND IMAGE */}
        <div className="loading-split-container">
          <div className="loading-text">ALEX</div>
          
          <div className="loading-image-container">
            {preloadedImages.length > 0 ? (
              <canvas 
                ref={canvasRef} 
                width={32}
                height={32}
                className="loading-image"
                style={{ imageRendering: 'pixelated' }}
              />
            ) : (
              <div className="loading-image bg-placeholder" />
            )}
          </div>
          
          <div className="loading-text">PULIATTI</div>
        </div>

        {/* PROGRESS INFO */}
        <div className="loading-progress">
          {Math.floor(progress)}%
        </div>
      </div>
    </motion.div>
  );
}
