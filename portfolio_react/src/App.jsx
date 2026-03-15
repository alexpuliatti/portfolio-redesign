import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { Navigation } from './components/Navigation';
import { Photography } from './pages/Photography';
import { Design } from './pages/Design';
import { DesignSubpage } from './pages/DesignSubpage';
import { About } from './pages/About';

function App() {
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    // Extract base tab — e.g. "Photography/charlotte-taylor" → "Photography"
    return (hash ? hash.split('/')[0] : '') || 'Photography';
  });
  const cursorRef = useRef(null);
  
  useSmoothScroll(false);

  useEffect(() => {
    const moveCursor = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`;
      }
    };
    
    const handleMouseEnter = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = '1';
    };
    const handleMouseLeave = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = '0';
    };
    
    const handleMouseOver = (e) => {
      if (!cursorRef.current) return;
      if (e.target.closest('a') || e.target.classList.contains('nav-link')) {
        cursorRef.current.classList.add('cursor-link');
      } else if (e.target.tagName.toLowerCase() === 'img' && !e.target.closest('.fullscreen-overlay')) {
        cursorRef.current.classList.add('cursor-image');
      }
    };
    
    const handleMouseOut = (e) => {
      if (!cursorRef.current) return;
      if (e.target.closest('a') || e.target.classList.contains('nav-link')) {
        cursorRef.current.classList.remove('cursor-link');
      } else if (e.target.tagName.toLowerCase() === 'img' && !e.target.closest('.fullscreen-overlay')) {
        cursorRef.current.classList.remove('cursor-image');
      }
    };

    window.addEventListener('mousemove', moveCursor);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  // Sync state to URL hash and listen for browser back/forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        // Extract base tab — e.g. "Photography/charlotte-taylor" → "Photography"
        const baseTab = hash.split('/')[0];
        setActiveTab(baseTab);
      } else {
        setActiveTab('Photography');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when tab changes (without triggering a jump)
  useEffect(() => {
    if (activeTab) {
      // Use replaceState to avoid jumping to ID anchors if they existed
      window.history.replaceState(null, '', `#${activeTab}`);
    }
  }, [activeTab]);

  // Scroll to top when switching tabs
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab]);

  const pageTransition = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, transition: { duration: 0.3, ease: 'easeIn' } }
  };

  return (
    <div className="portfolio-container">
      <div className="glass-cursor" ref={cursorRef} style={{ opacity: 1 }} />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="page-spacer" />

      <AnimatePresence mode="wait">
        {activeTab === 'Photography' && (
          <motion.div key="photography" {...pageTransition} style={{ width: '100%' }}>
            <Photography />
          </motion.div>
        )}

        {activeTab === 'Design' && (
          <motion.div key="design" {...pageTransition}>
            <Design setActiveTab={setActiveTab} />
          </motion.div>
        )}

        {activeTab?.startsWith('Design-') && (
          <motion.div key="design-sub" {...pageTransition}>
            <DesignSubpage 
              type={activeTab.split('-')[1]} 
              setActiveTab={setActiveTab} 
            />
          </motion.div>
        )}

        {activeTab === 'About' && (
          <motion.div key="about" {...pageTransition}>
            <About />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
