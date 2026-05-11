import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navigation({ activeTab, setActiveTab }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const showLogo = !isMenuOpen;

    const handleMouseEnter = (e) => {
        const hue1 = Math.floor(Math.random() * 360);
        const hue2 = (hue1 + 30 + Math.floor(Math.random() * 60)) % 360; 
        
        // Very low saturation to match the elegant, muted tone of the site's extracted lines
        const sat = 15 + Math.floor(Math.random() * 15);
        const light = 65 + Math.floor(Math.random() * 15);

        const c1 = `hsla(${hue1}, ${sat}%, ${light}%, 0.8)`;
        const c2 = `hsla(${hue2}, ${sat}%, ${light}%, 0.2)`;

        // Radial gradient ensures perfect visual centering behind the dot
        const gradient = `radial-gradient(circle at center, ${c1} 0%, ${c2} 50%, transparent 100%)`;
        e.currentTarget.style.setProperty('--glow-bg', gradient);
    };

    return (
        <header className={`site-topbar ${isMenuOpen ? 'menu-open' : ''}`}>
            <AnimatePresence>
                {showLogo && (
                    <motion.div 
                        key="logo"
                        layout="position"
                        initial={{ opacity: 0, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, filter: 'blur(4px)', position: 'absolute' }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="topbar-logo"
                        onClick={() => {
                            setActiveTab('Photography');
                            window.dispatchEvent(new CustomEvent('reset-photography'));
                        }}
                    >
                        ALEX PULIATTI
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.nav 
                layout
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="topbar-nav" 
                style={{ marginLeft: 'auto' }}
            >
                <AnimatePresence initial={false}>
                    {isMenuOpen && (
                        <motion.div
                            key="nav-categories"
                            layout
                            initial={{ width: 0, opacity: 0, filter: 'blur(4px)' }}
                            animate={{ width: 'auto', opacity: 1, filter: 'blur(0px)' }}
                            exit={{ width: 0, opacity: 0, filter: 'blur(4px)' }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', overflow: 'hidden' }}
                        >
                            <button
                                className={`nav-pill ${activeTab === 'Photography' ? 'active' : ''}`}
                                onClick={() => { setActiveTab('Photography'); setIsMenuOpen(false); }}
                            >
                                Photography
                            </button>
                            <button
                                className={`nav-pill ${activeTab?.startsWith('Design') ? 'active' : ''}`}
                                onClick={() => { setActiveTab('Design'); setIsMenuOpen(false); }}
                            >
                                Design
                            </button>
                            <button
                                className={`nav-pill ${activeTab === 'About' ? 'active' : ''}`}
                                onClick={() => { setActiveTab('About'); setIsMenuOpen(false); }}
                            >
                                About
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    layout="position"
                    className="mobile-dot-btn style-glow"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    onMouseEnter={handleMouseEnter}
                    aria-label="Toggle menu"
                >
                    <span className="dot"></span>
                </motion.button>
            </motion.nav>
        </header>
    );
}
