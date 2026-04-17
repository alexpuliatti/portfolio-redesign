import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Using Vite's import.meta.glob to dynamically import images in the folder
const imageModules = import.meta.glob('/public/asia-stillz-cropped/*.{png,webp,jpg}', { eager: true });
const images = Object.values(imageModules).map(mod => mod.default);

export function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
              <img 
                src={images[currentImageIndex]} 
                alt="Loading" 
                className="loading-image"
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
