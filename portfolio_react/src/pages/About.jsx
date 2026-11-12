import { useState } from 'react';
import { motion as Motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

const archiveData = [
    { category: "Personal", title: "Wip", date: "2026" },
    { category: "Client", title: "The kooples", date: "2025" },
    { category: "Personal", title: "Yourmirror.io", date: "2025" },
    { category: "In-house", title: "Signature ai", date: "2024" },
    { category: "Talk", title: "Apex lab", date: "2024" },
    { category: "Client", title: "A-cold-wall", date: "2024" },
    { category: "Talk", title: "Royal college of art creative ai lab", date: "2024" },
    { category: "Talk", title: "King's college lecture", date: "2024" },
    { category: "Personal", title: "Zurich53", date: "2024" },
    { category: "Client", title: "Oree nyc", date: "2023" },
    { category: "Client", title: "Rkomi", date: "2023" },
    { category: "Client", title: "Irama", date: "2023" },
    { category: "Client", title: "Warner music group", date: "2023" },
    { category: "Client", title: "Universal music group", date: "2023" },
    { category: "Client", title: "Black coffee", date: "2023" },
    { category: "Client", title: "Peggy gou", date: "2023" },
    { category: "Client", title: "The martinez brothers", date: "2023" },
    { category: "Personal", title: "Rend", date: "2023" },
    { category: "In-house", title: "Maison margiela", date: "2022" },
    { category: "In-house", title: "Marni", date: "2022" },
    { category: "In-house", title: "Diesel", date: "2022" },
    { category: "Client", title: "Wasted youth", date: "2020" },
    { category: "Personal", title: "Dropart", date: "2019" },
    { category: "Personal", title: "Entourage", date: "2016" }
];

const interestsData = [
    {
        id: 'visual-artists',
        title: 'Visual Artists',
        items: [
            { title: 'Rory Menage' },
            { title: 'Sergio Fiorentino' },
            { title: 'Rita Ackermann' },
            { title: 'Cy Twombly' },
            { title: 'Ren Hang' },
            { title: 'Emmanuel Lubezki' }
        ]
    },
    {
        id: 'sounds',
        title: 'Sounds',
        items: [
            { title: 'Jóhann Jóhannsson' },
            { title: 'Keith Jarret' },
            { title: 'Hania Rani' },
            { title: 'Justin Vernon' }
        ]
    },
    {
        id: 'read',
        title: 'Read',
        items: [
            { title: 'On the perfect State', author: 'Al Farabi' },
            { title: 'The late Mattia Pascal', author: 'Pirandello' },
            { title: 'A little life', author: 'Yanagihara' },
            { title: 'The Aleph', author: 'Borges' },
            { title: 'The integrated mind', author: 'Ledoux & Gazzaniga' }
        ]
    }
];

const getRandomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;

export function About() {
    const { scrollYProgress } = useScroll();
    const trackScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

    const [gradientCSS] = useState(() => {
        const c1 = getRandomColor();
        const c2 = getRandomColor();
        const c3 = getRandomColor();
        return `linear-gradient(to bottom, ${c1} 0%, ${c2} 50%, ${c3} 100%)`;
    });
    const [expandedIndex, setExpandedIndex] = useState(null);

    const toggleExpand = (i) => setExpandedIndex((current) => current === i ? null : i);

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
                <Motion.div
                    className="concept-track-fill"
                    style={{ scaleY: trackScale, background: gradientCSS }}
                />
            </div>

            <div className="archive-content">
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="archive-intro"
                >
                    <div className="archive-bio">
                        <p>I’ve designed garments with some of the most culturally relevant brands and worked alongside defining musicians of our generation. Since then, I’ve taken a slightly different path and have been having a lot of fun with technology. Right now, I’m doing research in neuroscience and building something new.</p>
                    </div>
                    <div className="archive-contact">
                        <a href="mailto:a@puliatti.com" className="hover-link">a@puliatti.com</a>
                        <a href="https://www.instagram.com/alexpuliatti" target="_blank" rel="noopener noreferrer" className="hover-link">INSTAGRAM</a>
                        <a href="https://www.are.na/a-p-8ilc0lfnvlk/channels" target="_blank" rel="noopener noreferrer" className="hover-link">ARE.NA</a>
                    </div>
                </Motion.div>

                <div className="about-sections">
                    <details className="about-section" name="about-sections">
                        <summary className="about-section-summary">
                            <h2>Things I like</h2>
                            <span className="about-disclosure-icon" aria-hidden="true" />
                        </summary>
                        <div className="about-interests">
                            {interestsData.map((group) => (
                                <details className="about-interest-group" name="about-interests" key={group.id}>
                                    <summary className="about-interest-summary">
                                        <h3>{group.title}</h3>
                                        <span className="about-disclosure-icon" aria-hidden="true" />
                                    </summary>
                                    <ul className="about-interest-list">
                                        {group.items.map((item) => (
                                            <li key={item.title}>
                                                <span>{item.title}</span>
                                                {item.author ? <span className="about-book-author">{item.author}</span> : null}
                                            </li>
                                        ))}
                                    </ul>
                                </details>
                            ))}
                        </div>
                    </details>

                    <details className="about-section" name="about-sections">
                        <summary className="about-section-summary">
                            <h2>Clients</h2>
                            <span className="about-disclosure-icon" aria-hidden="true" />
                        </summary>
                        <div className="about-clients">
                            <Motion.div variants={containerVariants} initial={false} animate="show" className="archive-table">
                                <Motion.div variants={headerVariants} className="archive-row archive-header">
                                    <div className="archive-col date-col">Year</div>
                                    <div className="archive-col title-col">Name</div>
                                    <div className="archive-col category-col">Category</div>
                                </Motion.div>

                                {archiveData.map((item, i) => {
                                    const hasContent = !!item.content;
                                    const isExpanded = expandedIndex === i;

                                    return (
                                        <Motion.div variants={rowVariants} className={`archive-row-group ${hasContent ? 'has-content' : ''}`} key={i}>
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
                                                    <Motion.div
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
                                                    </Motion.div>
                                                )}
                                            </AnimatePresence>
                                        </Motion.div>
                                    );
                                })}
                            </Motion.div>
                        </div>
                    </details>
                </div>
            </div>
        </main>
    );
}
