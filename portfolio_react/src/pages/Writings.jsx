import React, { useState, useEffect } from 'react';
import { DecayCard } from '../components/DecayCard';
import { motion, AnimatePresence } from 'framer-motion';

const mockArticles = [
    {
        id: 1,
        title: "Light & brutalism in modern architecture",
        date: "March 2026",
        excerpt: "Exploring how heavy concrete textures play against soft, diffused natural lighting in contemporary gallery spaces.",
        image: "/asia-stillz/Still 2026-02-27 211449_1.21.1.png"
    },
    {
        id: 2,
        title: "The evolution of the standard",
        date: "February 2026",
        excerpt: "A diary entry chronicling the process of removing excess visual noise to achieve a more pure execution of concept.",
        image: "/asia-stillz/Still 2026-02-27 211449_1.6.1.png"
    },
    {
        id: 3,
        title: "Designing the new transparent device",
        date: "January 2026",
        excerpt: "Behind the scenes on our OEM care device collaboration. Finding the harmony between industrial engineering and soft aesthetics.",
        image: "/asia-stillz/Still 2026-02-27 211449_1.13.1.png"
    },
    {
        id: 4,
        title: "Visual vocabulary: glassmorphism",
        date: "December 2025",
        excerpt: "Why transparent and translucent UI layers create psychological depth in digital experiences.",
        image: "/asia-stillz/Still 2026-02-27 211449_1.2.1.png"
    }
];

export function Writings() {
    const [selectedArticle, setSelectedArticle] = useState(null);

    // Escape listener to close article
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setSelectedArticle(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Prevent scrolling on body when overlay is open
    useEffect(() => {
        if (selectedArticle) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [selectedArticle]);

    return (
        <main className="writings-container">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="writing-header"
            >
                Writings
            </motion.h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '3rem' }}>
                {mockArticles.map((article) => (
                    <DecayCard
                        key={article.id}
                        title={article.title}
                        date={article.date}
                        excerpt={article.excerpt}
                        imageStr={article.image}
                        layoutId={`article-${article.id}`}
                        onClick={() => setSelectedArticle(article)}
                    />
                ))}
            </div>

            <AnimatePresence>
                {selectedArticle && (
                    <div className="article-overlay" data-lenis-prevent="true">
                        <motion.div
                            layoutId={`article-${selectedArticle.id}`}
                            className="article-reader liquid-glass"
                        >
                            <div className="article-hero" style={{ backgroundImage: `url(${selectedArticle.image})` }} />
                            <div className="article-body">
                                <motion.div layoutId={`title-article-${selectedArticle.id}`}>
                                    <h2 className="article-title">{selectedArticle.title}</h2>
                                </motion.div>
                                <div className="article-meta">{selectedArticle.date}</div>
                                <div className="article-text">
                                    <p>{selectedArticle.excerpt}</p>
                                    <p>The interplay of texture and transparency defines modern interfaces just as strongly as brutalist concrete juxtaposed with wide glass panes dictates modern museum architecture. In attempting to strip away extraneous elements, we do not aim for sterility, but for profound focal clarity. Shadows become intentional vectors indicating depth. Blur becomes a material signifying distance and focus. It forces the content into the foreground, a quiet reverence for the raw material.</p>
                                    <p>As we iterate, the "liquid glass" approach seeks to elevate digital components into physical objects. They possess weight, light refraction across inset borders, and contextual reflection of what lies beneath them.</p>
                                </div>
                            </div>
                        </motion.div>
                        <motion.button
                            className="close-article-btn glass-nav"
                            onClick={() => setSelectedArticle(null)}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                        >
                            Close
                        </motion.button>
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
}
