import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { Navigation } from './components/Navigation';
import { Photography } from './pages/Photography';
import { Design } from './pages/Design';
import { DesignSubpage } from './pages/DesignSubpage';
import { About } from './pages/About';
import { LoadingScreen } from './components/LoadingScreen';

// Resolve the initial tab from the URL path
const resolveTabFromPath = () => {
  const path = window.location.pathname.replace(/^\/+/g, '');
  if (!path) return 'Photography';
  const segments = path.split('/');
  let baseTab = segments[0].charAt(0).toUpperCase() + segments[0].slice(1);
  if (baseTab.toLowerCase() === 'design' && segments.length > 1) {
    return `Design-${segments[1]}`;
  }
  return baseTab;
};

function App() {
  const [activeTab, setActiveTab] = useState(resolveTabFromPath);
  const [isLoading, setIsLoading] = useState(true);
  const cursorRef = useRef(null);

  // Track which pages have been visited so we can lazy-mount them.
  // Once mounted, they stay in the DOM (keep-alive) to avoid expensive re-mounts.
  const [visitedTabs, setVisitedTabs] = useState(() => new Set([resolveTabFromPath()]));
  
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
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    }
  }, [activeTab]);

  // Mark newly-visited tabs so they get lazy-mounted
  useEffect(() => {
    setVisitedTabs((prev) => {
      if (prev.has(activeTab)) return prev;
      const next = new Set(prev);
      next.add(activeTab);
      return next;
    });
  }, [activeTab]);

  // Derive which "base" category group is active for the Design sub-pages
  const isDesignSub = activeTab?.startsWith('Design-');
  const isPhotography = activeTab === 'Photography';
  const isDesign = activeTab === 'Design';
  const isAbout = activeTab === 'About';

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

        {/* ── Keep-alive page slots ──
             Pages are lazy-mounted on first visit and then stay in the DOM.
             Inactive pages are hidden via CSS (opacity + pointer-events + position).
             This completely eliminates the expensive unmount/remount cycle for
             heavy pages like Photography (22+ IntersectionObservers, canvas ops, etc).
        */}

        {visitedTabs.has('Photography') && (
          <div
            className={`page-slot ${isPhotography ? 'page-slot--active' : 'page-slot--hidden'}`}
            style={{ width: '100%' }}
          >
            <div className="page-spacer" />
            <Photography />
          </div>
        )}

        {visitedTabs.has('Design') && (
          <div
            className={`page-slot ${isDesign ? 'page-slot--active' : 'page-slot--hidden'}`}
          >
            <Design setActiveTab={setActiveTab} />
          </div>
        )}

        {visitedTabs.has(activeTab) && isDesignSub && (
          <div
            className={`page-slot ${isDesignSub ? 'page-slot--active' : 'page-slot--hidden'}`}
          >
            <DesignSubpage 
              type={activeTab.split('-')[1]} 
              setActiveTab={setActiveTab} 
            />
          </div>
        )}

        {visitedTabs.has('About') && (
          <div
            className={`page-slot ${isAbout ? 'page-slot--active' : 'page-slot--hidden'}`}
            style={{ width: '100%' }}
          >
            <div className="page-spacer" />
            <About />
          </div>
        )}
      </div>
    </>
  );
}

export default App;
