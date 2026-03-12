import React, { useEffect, useRef } from 'react';
import imageData from './imageData.json';
import { useSmoothScroll } from './hooks/useSmoothScroll';

function App() {
  useSmoothScroll();
  const lineRefs = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      lineRefs.current.forEach((lineEl) => {
        if (!lineEl) return;

        const wrapper = lineEl.parentElement;
        if (!wrapper) return;

        const wrapperRect = wrapper.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // The gap starts at the bottom of this wrapper's image
        // and ends at the top of the next wrapper's image.
        // As the next image approaches the viewport, the line should shrink.

        // wrapperRect.bottom = bottom edge of the current image
        // When wrapperRect.bottom is at the top of the viewport, 
        // the line should be fully retracted (height = 0).
        // When wrapperRect.bottom is well above the viewport center,
        // the line should be at full height.

        const gapSize = parseFloat(getComputedStyle(lineEl).height);
        
        // How far the bottom of the image is from the bottom of the viewport
        // When this is large (image is high up), line should be at full length
        // When this approaches 0 (image bottom at viewport bottom), line starts shrinking
        // When negative (image has scrolled past), line should be very short
        
        const distFromViewportBottom = viewportHeight - wrapperRect.bottom;
        
        // Normalize: line should be fully visible when the gap is centered in the viewport
        // and shrink to 0 as the next image enters
        const totalGapPx = gapSize; // This is the CSS height
        
        // Progress: 0 = gap just started appearing, 1 = next image is fully in view
        // We want the line to start retracting when the gap is about 60% scrolled
        const progress = distFromViewportBottom / (totalGapPx + viewportHeight * 0.8);
        
        // Clamp the scale factor — slower retraction, finishes later
        const scale = Math.max(0, Math.min(1, 1 - Math.max(0, progress - 0.4) * 1.2));
        
        lineEl.style.transform = `translateX(-50%) scaleY(${scale})`;
        lineEl.style.transformOrigin = 'bottom center';
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="portfolio-container">
      {/* Sleek unified header: monogram left, nav right */}
      <header className="site-header">
        <span className="header-monogram">AP</span>
        <nav className="header-nav">
          <a href="#" className="nav-link active">Photography</a>
          <span className="nav-dot">·</span>
          <a href="#" className="nav-link">Writings</a>
          <span className="nav-dot">·</span>
          <a href="#" className="nav-link">About</a>
        </nav>
      </header>
      
      <div className="image-list">
        {imageData.map((item, idx) => {
          const isLast = idx === imageData.length - 1;
          const currentColor = item.color;
          
          // Build the gradient from the NEXT image's palette
          const nextPalette = !isLast && imageData[idx + 1].palette 
            ? imageData[idx + 1].palette 
            : [];

          // Build a multi-stop gradient string from the palette
          const buildGradient = (palette) => {
            if (palette.length === 0) return 'transparent';
            if (palette.length === 1) {
              return `linear-gradient(to bottom, transparent 0%, ${palette[0]} 50%, ${palette[0]} 100%)`;
            }
            const stops = palette.map((color, i) => {
              const percent = 15 + (i / (palette.length - 1)) * 85;
              return `${color} ${percent.toFixed(0)}%`;
            });
            return `linear-gradient(to bottom, transparent 0%, ${stops.join(', ')})`;
          };
          
          return (
            <div key={idx} className="image-wrapper">
              <img 
                src={`/asia-stillz/${item.src}`} 
                alt={`portfolio piece ${idx}`} 
                loading="lazy" 
              />
              {!isLast && (
                <div 
                  className="connecting-line"
                  ref={el => lineRefs.current[idx] = el}
                  style={{
                    background: buildGradient(nextPalette),
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
