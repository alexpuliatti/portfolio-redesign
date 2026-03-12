import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export function DecayCard({ title, date, excerpt, imageStr, onClick, layoutId }) {
    const ref = useRef(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["6deg", "-6deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-6deg", "6deg"]);

    const handleMouseMove = (e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left - width / 2;
        const mouseY = e.clientY - rect.top - height / 2;

        x.set(mouseX / width);
        y.set(mouseY / height);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            layoutId={layoutId}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="liquid-glass decay-card"
        >
            {imageStr && (
                <div
                    className="decay-image"
                    style={{
                        backgroundImage: `url(${imageStr})`,
                    }}
                />
            )}
            <div className="decay-content">
                <div className="decay-header">
                    <motion.h3 layoutId={`title-${layoutId}`}>{title}</motion.h3>
                    <span className="decay-date">{date}</span>
                </div>
                <p className="decay-excerpt">{excerpt}</p>

                <div className="decay-footer">
                    Read More <span className="arrow">&rarr;</span>
                </div>
            </div>
        </motion.div>
    );
}
