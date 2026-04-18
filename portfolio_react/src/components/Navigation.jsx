import React from 'react';

export function Navigation({ activeTab, setActiveTab }) {
    return (
        <header className="site-topbar">
            <div 
                className="topbar-logo"
                onClick={() => {
                    setActiveTab('Photography');
                    window.dispatchEvent(new CustomEvent('reset-photography'));
                }}
            >
                ALEX PULIATTI
            </div>

            <nav className="topbar-nav">
                <button
                    className={`nav-pill ${activeTab === 'Photography' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Photography')}
                >
                    Photography
                </button>
                <button
                    className={`nav-pill ${activeTab?.startsWith('Design') ? 'active' : ''}`}
                    onClick={() => setActiveTab('Design')}
                >
                    Design
                </button>
                <button
                    className={`nav-pill ${activeTab === 'About' ? 'active' : ''}`}
                    onClick={() => setActiveTab('About')}
                >
                    About
                </button>
            </nav>
        </header>
    );
}
