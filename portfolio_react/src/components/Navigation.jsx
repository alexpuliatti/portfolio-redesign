import React from 'react';

export function Navigation({ activeTab, setActiveTab }) {
    return (
        <>
            <nav className="glass-nav">
                <button
                    className={`nav-pill ${activeTab === 'Photography' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Photography')}
                >
                    Photography
                </button>
                <button
                    className={`nav-pill ${activeTab === 'Writings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Writings')}
                >
                    Writings
                </button>
                <button
                    className={`nav-pill ${activeTab === 'About' ? 'active' : ''}`}
                    onClick={() => setActiveTab('About')}
                >
                    About
                </button>
            </nav>

            <div className="floating-badge glass-nav">
                Alex Puliatti
            </div>
        </>
    );
}
