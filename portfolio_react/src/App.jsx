import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { Navigation } from './components/Navigation';
import { Photography } from './pages/Photography';
import { Design } from './pages/Design';
import { DesignSubpage } from './pages/DesignSubpage';
import { About } from './pages/About';
import { LoadingScreen } from './components/LoadingScreen';

function App() {
  const [activeTab, setActiveTab] = useState(() => {
    const path = window.location.pathname.replace(/^\/+/g, '');
    if (!path) return 'Photography';
    const segments = path.split('/');
    let baseTab = segments[0].charAt(0).toUpperCase() + segments[0].slice(1);
    if (baseTab.toLowerCase() === 'design' && segments.length > 1) {
        return `Design-${segments[1]}`;
    }
    return baseTab;
  });
  const [isLoading, setIsLoading] = useState(true);
  const cursorRef = useRef(null);
  
  useSmoothScroll(false);

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

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

  // Sync state to URL path and listen for browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\/+/g, '');
      if (!path) {
        setActiveTab('Photography');
        return;
      }
      const segments = path.split('/');
      let baseTab = segments[0].charAt(0).toUpperCase() + segments[0].slice(1);
      if (baseTab.toLowerCase() === 'design' && segments.length > 1) {
          setActiveTab(`Design-${segments[1]}`);
      } else {
          setActiveTab(baseTab);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update path when tab changes
  useEffect(() => {
    if (activeTab) {
      let newPath = `/${activeTab.toLowerCase()}`;
      if (activeTab.startsWith('Design-')) {
          newPath = `/design/${activeTab.split('-')[1].toLowerCase()}`;
      }
      if (window.location.pathname !== newPath) {
        window.history.pushState(null, '', newPath);
      }
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
    <>
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen key="loading" onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      <div 
        className="portfolio-container" 
        style={{ 
          opacity: isLoading ? 0 : 1, 
          pointerEvents: isLoading ? 'none' : 'auto',
          transition: 'opacity 0.8s ease'
        }}
      >
        <div className="glass-cursor" ref={cursorRef} style={{ opacity: 1 }} />
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {!activeTab?.startsWith('Design') && <div className="page-spacer" />}

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
            <motion.div key="about" {...pageTransition} style={{ width: '100%' }}>
              <About />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default App;
