import React, { useState, useEffect } from 'react';

export function Navigation({ activeTab, setActiveTab }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
            document.body.classList.add('menu-open');
        } else {
            document.body.style.overflow = '';
            document.body.classList.remove('menu-open');
        }
        return () => { 
            document.body.style.overflow = ''; 
            document.body.classList.remove('menu-open');
        };
    }, [isMenuOpen]);

    const handleNavigate = (tab) => {
        setActiveTab(tab);
        setIsMenuOpen(false);
        if (tab === 'Photography') {
            window.dispatchEvent(new CustomEvent('reset-photography'));
        }
    };

    return (
        <>
            <header className="site-topbar">
                <div 
                    className="topbar-logo"
                    onClick={() => handleNavigate('Photography')}
                >
                    ALEX PULIATTI
                </div>

                <div className="menu-container">
                    <button 
                        className="menu-cta"
                        onClick={() => setIsMenuOpen(true)}
                    >
                        MENU
                    </button>
                </div>
            </header>

            {/* Centered Liquid Glass Modal */}
            <div className={`floating-menu-overlay ${isMenuOpen ? 'open' : ''}`}>
                <div className="floating-menu-backdrop" onClick={() => setIsMenuOpen(false)}></div>
                <div className="floating-menu">
                    <div className="floating-header">
                        <div className="floating-header-title">NAVIGATION</div>
                        <button className="floating-close" onClick={() => setIsMenuOpen(false)}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    
                    <nav className="floating-nav">
                        <button 
                            className={`floating-nav-item ${activeTab === 'Photography' ? 'active' : ''}`}
                            onClick={() => handleNavigate('Photography')}
                        >
                            Photography
                        </button>
                        <button 
                            className={`floating-nav-item ${activeTab?.startsWith('Design') ? 'active' : ''}`}
                            onClick={() => handleNavigate('Design')}
                        >
                            Design
                        </button>
                        <button 
                            className={`floating-nav-item ${activeTab === 'About' ? 'active' : ''}`}
                            onClick={() => handleNavigate('About')}
                        >
                            About
                        </button>
                    </nav>
                </div>
            </div>
        </>
    );
}
