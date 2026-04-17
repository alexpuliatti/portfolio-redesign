import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

const archiveData = [
    { category: "Personal", title: "WIP", date: "2026" },
    { category: "Client", title: "The Kooples", date: "2025" },
    { category: "Personal", title: "YourMirror.io", date: "2025" },
    { category: "In-house", title: "SIGNATURE AI", date: "2024" },
    { category: "Talk", title: "APEX LAB - ISSUE 1 - Talk", date: "2024" },
    { category: "Client", title: "A-COLD-WALL", date: "2024" },
    { category: "Talk", title: "Royal College of Art - Public Lecture", date: "2024", content: { type: "youtube", videoId: "XhVnsLeFkwI" } },
    { category: "Talk", title: "King's College Lecture", date: "2024" },
    { category: "Personal", title: "Zurich53", date: "2024" },
    { category: "Client", title: "OREE NYC - Small Hours Mag", date: "2023" },
    { category: "Client", title: "Rkomi", date: "—" },
    { category: "Client", title: "Irama", date: "2023" },
    { category: "Client", title: "Warner Music Group", date: "2023" },
    { category: "Client", title: "Universal Music Group", date: "2023" },
    { category: "Client", title: "Black Coffee", date: "2023" },
    { category: "Client", title: "Peggy Gou", date: "2023" },
    { category: "Client", title: "The Martinez Brothers", date: "2023" },
    { category: "Personal", title: "REND", date: "2023" },
    { category: "In-house", title: "MAISON MARGIELA - OTB Group", date: "2022" },
    { category: "In-house", title: "MARNI - OTB Group", date: "2022" },
    { category: "In-house", title: "DIESEL - OTB Group", date: "2022" },
    { category: "Client", title: "WASTED YOUTH", date: "2020" },
    { category: "Personal", title: "dropArt", date: "2019" },
    { category: "Personal", title: "ENTOURAGE", date: "2016" }
];

const getRandomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;

export function About() {
    const { scrollYProgress } = useScroll();
    const trackScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
    
    const [gradientCSS, setGradientCSS] = useState('transparent');
    const [expandedIndex, setExpandedIndex] = useState(null);
    
    useEffect(() => {
        const c1 = getRandomColor();
        const c2 = getRandomColor();
        const c3 = getRandomColor();
        setGradientCSS(`linear-gradient(to bottom, ${c1} 0%, ${c2} 50%, ${c3} 100%)`);
    }, []);

    const toggleExpand = (i) => setExpandedIndex(expandedIndex === i ? null : i);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.04, delayChildren: 0.1 }
        }
    };

    const rowVariants = {
        hidden: { opacity: 0, x: -10 },
        show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    const headerVariants = {
        hidden: { opacity: 0, y: -10 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <main className="about-archive-wrapper">

            {/* --- Progress Track --- */}
            <div className="concept-track-bg">
                <motion.div 
                    className="concept-track-fill" 
                    style={{ scaleY: trackScale, background: gradientCSS }} 
                />
            </div>

            <div className="archive-content">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="archive-intro"
                >
                    <div className="archive-bio">
                        PHOTOGRAPHER & CREATIVE TECHNOLOGIST<br />
                        BASED IN LONDON
                    </div>
                    <div className="archive-contact">
                        <a href="mailto:a@puliatti.com" className="hover-link">a@puliatti.com</a>
                        <a href="https://www.instagram.com/alexpuliatti" target="_blank" rel="noopener noreferrer" className="hover-link">INSTAGRAM</a>
                        <a href="https://www.are.na/a-p-8ilc0lfnvlk/channels" target="_blank" rel="noopener noreferrer" className="hover-link">ARE.NA</a>
                    </div>
                </motion.div>

                <motion.div variants={containerVariants} initial="hidden" animate="show" className="archive-table">
                    <motion.div variants={headerVariants} className="archive-row archive-header">
                        <div className="archive-col date-col">Year</div>
                        <div className="archive-col title-col">Name</div>
                        <div className="archive-col category-col">Category</div>
                    </motion.div>

                    {archiveData.map((item, i) => {
                        const hasContent = !!item.content;
                        const isExpanded = expandedIndex === i;
                        
                        return (
                            <motion.div variants={rowVariants} className={`archive-row-group ${hasContent ? 'has-content' : ''}`} key={i}>
                                <div className="archive-row" onClick={() => hasContent && toggleExpand(i)}>
                                    
                                    <div className="archive-col date-col date-text" style={{zIndex: 2}}>{item.date}</div>
                                    
                                    <div className="archive-col title-col title-text" style={{zIndex: 2}}>
                                        <span className="base-title">{item.title}</span>
                                    </div>
                                    
                                    <div className="archive-col category-col category-text" style={{zIndex: 2, position: 'relative'}}>
                                        <span className="category-label">{item.category}</span>
                                    </div>
                                </div>
                                
                                {/* Inline Thumbnail Preview */}
                                {hasContent && (
                                    <div className="inline-preview" onClick={() => toggleExpand(i)}>
                                        {item.content.type === "youtube" && (
                                            <img 
                                                src={`https://img.youtube.com/vi/${item.content.videoId}/mqdefault.jpg`}
                                                alt={`Preview: ${item.title}`}
                                                className="inline-preview-img"
                                            />
                                        )}
                                    </div>
                                )}
                                
                                <AnimatePresence>
                                    {isExpanded && hasContent && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            style={{ overflow: "hidden" }}
                                            className="expanded-content"
                                        >
                                            <div className="expanded-content-inner">
                                                {item.content.type === "youtube" && (
                                                    <div className="youtube-embed">
                                                        <iframe 
                                                            width="100%" 
                                                            height="400px" 
                                                            src={`https://www.youtube.com/embed/${item.content.videoId}`} 
                                                            frameBorder="0" 
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                                            allowFullScreen 
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </main>
    );
}
