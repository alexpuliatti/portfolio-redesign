import React from 'react';
import { motion } from 'framer-motion';

export function About() {
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 40 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <main className="about-gallery-wrapper">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="about-gallery"
            >

                {/* Floating Bio Card */}
                <motion.div variants={itemVariants} className="gallery-element liquid-glass gallery-bio">
                    <p>
                        Photographer & Art Director based in London.<br /><br />
                        Focused on the intersection of industrial design, light, and modern brutalism.
                    </p>
                </motion.div>

                {/* Small floating contact pill */}
                <motion.div variants={itemVariants} className="gallery-element liquid-glass gallery-contact">
                    <a href="mailto:a@puliatti.com" className="hover-link">a@puliatti.com</a>
                    <br />
                    <a href="https://www.instagram.com/alexpuliatti" target="_blank" rel="noopener noreferrer" className="hover-link">@alexpuliatti</a>
                </motion.div>

                {/* Accolades Block */}
                <motion.div variants={itemVariants} className="gallery-element liquid-glass gallery-lists">
                    <div className="list-columns">

                        <div className="list-group">
                            <h2>Selected Clients</h2>
                            <ul className="dense-list">
                                <li>Diesel</li>
                                <li>Marni</li>
                                <li>Jil Sander</li>
                                <li>Maison Margiela</li>
                                <li>A-COLD-WALL*</li>
                                <li>Peggy Gou</li>
                                <li>Saint Levant</li>
                            </ul>
                        </div>

                        <div className="list-group">
                            <h2>Features & Awards</h2>
                            <ul className="dense-list">
                                <li>Leica Photography Award '23</li>
                                <li>AnOther</li>
                                <li>Chaos</li>
                                <li>Notion</li>
                                <li>GQ Italia</li>
                            </ul>
                        </div>

                        <div className="list-group">
                            <h2>Public Talks</h2>
                            <ul className="dense-list">
                                <li>King's College (2024)</li>
                                <li>Royal College of Art (2024)</li>
                                <li>APEX at 180 Studios (2024)</li>
                            </ul>
                        </div>

                    </div>
                </motion.div>

            </motion.div>
        </main>
    );
}
