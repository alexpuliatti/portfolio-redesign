import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Using Vite's import.meta.glob to dynamically import images in the folder
const imageModules = import.meta.glob('/public/asia-stillz-cropped/*.{png,webp,jpg}', { eager: true });
const images = Object.values(imageModules).map(mod => mod.default);

export function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const canvasRef = useRef(null);

  // Update canvas for pixel effect
  useEffect(() => {
    if (images.length === 0 || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    // Keep it blocky
    ctx.imageSmoothingEnabled = false;

    const img = new Image();
    img.src = images[currentImageIndex];
    
    const drawPixelArt = () => {
      const targetSize = 32; 
      const scale = Math.max(targetSize / img.naturalWidth, targetSize / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      const x = (targetSize - w) / 2;
      const y = (targetSize - h) / 2;
      
      ctx.clearRect(0, 0, targetSize, targetSize);
      ctx.drawImage(img, x, y, w, h);
    };

    if (img.complete && img.naturalWidth > 0) {
      drawPixelArt();
    } else {
      img.onload = drawPixelArt;
    }
  }, [currentImageIndex]);

  useEffect(() => {
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
      if (step % 2 === 0 && images.length > 0) {
        setCurrentImageIndex(prev => (prev + 1) % images.length);
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
  }, [onComplete]);

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
            {images.length > 0 ? (
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
