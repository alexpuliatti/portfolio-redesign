import React from 'react';
import { motion } from 'framer-motion';

export function Design({ setActiveTab }) {
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.18,
                delayChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
        }
    };

    const lineGradient = 'linear-gradient(to bottom, transparent 0%, #6b7b8d 30%, #a0785a 60%, #8a6d5e 100%)';

    return (
        <main className="design-page">
            {/* Gradient line leading into design section */}
            <div className="section-divider-wrapper">
                <div
                    className="section-divider"
                    style={{ background: lineGradient }}
                />
            </div>

            <motion.div
                className="design-icons-row"
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                {/* Speaker */}
                <motion.div variants={itemVariants} className="design-icon-wrapper" onClick={() => setActiveTab('Design-speaker')} style={{cursor: 'pointer'}}>
                    <svg viewBox="0 0 120 200" className="design-icon" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="15" y="10" width="90" height="180" rx="4" />
                        <path d="M45 50 L60 60 L75 50 L75 70 L60 60 L45 70 Z" />
                        <circle cx="60" cy="100" r="12" />
                        <circle cx="60" cy="100" r="6" />
                        <circle cx="60" cy="150" r="28" />
                        <circle cx="60" cy="150" r="18" />
                        <circle cx="60" cy="150" r="8" />
                    </svg>
                </motion.div>

                {/* Sink / Vanity */}
                <motion.div variants={itemVariants} className="design-icon-wrapper" onClick={() => setActiveTab('Design-vanity')} style={{cursor: 'pointer'}}>
                    <svg viewBox="0 0 160 200" className="design-icon" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="80" y1="50" x2="80" y2="80" />
                        <line x1="72" y1="50" x2="88" y2="50" />
                        <rect x="25" y="80" width="110" height="16" rx="2" />
                        <line x1="40" y1="96" x2="40" y2="175" />
                        <line x1="80" y1="96" x2="80" y2="175" />
                        <line x1="120" y1="96" x2="120" y2="175" />
                        <line x1="35" y1="175" x2="45" y2="175" />
                        <line x1="75" y1="175" x2="85" y2="175" />
                        <line x1="115" y1="175" x2="125" y2="175" />
                    </svg>
                </motion.div>

                {/* Shelf / Ladder */}
                <motion.div variants={itemVariants} className="design-icon-wrapper" onClick={() => setActiveTab('Design-shelf')} style={{cursor: 'pointer'}}>
                    <svg viewBox="0 0 120 200" className="design-icon" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="25" y1="10" x2="25" y2="190" />
                        <line x1="95" y1="10" x2="95" y2="190" />
                        <line x1="18" y1="10" x2="18" y2="190" />
                        <line x1="102" y1="10" x2="102" y2="190" />
                        <line x1="18" y1="10" x2="102" y2="10" />
                        <line x1="18" y1="55" x2="102" y2="55" />
                        <line x1="18" y1="100" x2="102" y2="100" />
                        <line x1="18" y1="145" x2="102" y2="145" />
                        <line x1="18" y1="190" x2="102" y2="190" />
                    </svg>
                </motion.div>
            </motion.div>

            {/* Gradient line trailing out */}
            <div className="section-divider-wrapper section-divider-bottom">
                <div
                    className="section-divider"
                    style={{ background: 'linear-gradient(to top, transparent 0%, #6b7b8d 30%, #a0785a 60%, #8a6d5e 100%)' }}
                />
            </div>
        </main>
    );
}
