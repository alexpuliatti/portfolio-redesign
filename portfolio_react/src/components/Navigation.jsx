import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navigation({ activeTab, setActiveTab }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const showLogo = !isMenuOpen;

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
                    className="mobile-dot-btn"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span className="dot"></span>
                </motion.button>
            </motion.nav>
        </header>
    );
}
