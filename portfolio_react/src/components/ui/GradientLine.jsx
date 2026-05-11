import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

/**
 * GradientLine — A flexible, animated gradient line primitive.
 *
 * @param {string}      gradient       - CSS background gradient string.
 * @param {string}      orientation    - 'vertical' | 'horizontal'.
 * @param {string}      thickness      - Minor-axis dimension (e.g. '4px').
 * @param {string}      length         - Major-axis dimension (e.g. '100%', '60vh').
 * @param {string}      origin         - CSS transform-origin (e.g. 'top', 'center', 'bottom center').
 * @param {string}      animation      - 'none' | 'entrance' | 'scroll' | 'flow' | 'breathe' | 'draw'.
 * @param {MotionValue} scrollProgress - External Framer Motion scroll progress value.
 * @param {boolean}     glow           - Enables neon pulse glow effect.
 * @param {string}      taper          - 'start' | 'end' | 'both' | null — fades line to a point.
 * @param {number}      segments       - If > 0, renders as dashed segments.
 * @param {number}      flowSpeed      - Seconds for one full gradient cycle (enables flow animation).
 * @param {number}      delay          - Animation delay in seconds.
 * @param {string}      className      - Additional CSS classes.
 * @param {object}      style          - Additional inline styles.
 */
export const GradientLine = ({
    gradient = 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.2))',
    orientation = 'vertical',
    thickness = '4px',
    length = '100%',
    origin = 'top',
    animation = 'none',
    scrollProgress = null,
    glow = false,
    taper = null,
    segments = 0,
    flowSpeed = 0,
    delay = 0,
    className = '',
    style = {}
}) => {
    const lineRef = useRef(null);
    const isVertical = orientation === 'vertical';

    // ── Internal scroll if animation="scroll" with no external value ──
    const { scrollYProgress: internalScroll } = useScroll({
        target: lineRef,
        offset: ['start end', 'center center']
    });
    const activeScroll = scrollProgress || internalScroll;
    const smoothScroll = useSpring(activeScroll, { stiffness: 100, damping: 30, restDelta: 0.001 });
    const scale = useTransform(smoothScroll, [0, 1], [0, 1]);

    // ── Taper mask ──
    const taperMask = (() => {
        if (!taper) return undefined;
        const dir = isVertical ? 'to bottom' : 'to right';
        switch (taper) {
            case 'start':
                return `linear-gradient(${dir}, transparent 0%, black 20%)`;
            case 'end':
                return `linear-gradient(${dir}, black 80%, transparent 100%)`;
            case 'both':
                return `linear-gradient(${dir}, transparent 0%, black 15%, black 85%, transparent 100%)`;
            default:
                return undefined;
        }
    })();

    // ── Segments mask ──
    const segmentMask = segments > 0
        ? `repeating-linear-gradient(${isVertical ? 'to bottom' : 'to right'}, black 0px, black ${Math.floor(100 / segments * 0.6)}%, transparent ${Math.floor(100 / segments * 0.6)}%, transparent ${Math.floor(100 / segments)}%)`
        : undefined;

    // Combine masks
    const combinedMask = [taperMask, segmentMask].filter(Boolean).join(', ');

    // ── Base style ──
    const baseStyle = {
        background: gradient,
        transformOrigin: origin,
        width: isVertical ? thickness : length,
        height: isVertical ? length : thickness,
        ...(combinedMask ? {
            WebkitMaskImage: combinedMask,
            maskImage: combinedMask,
            WebkitMaskComposite: taperMask && segmentMask ? 'destination-in' : undefined,
            maskComposite: taperMask && segmentMask ? 'intersect' : undefined,
        } : {}),
        ...style
    };

    // ── Class assembly ──
    let cls = `gradient-line-base ${isVertical ? 'gradient-line-vertical' : 'gradient-line-horizontal'}`;
    if (glow) cls += ' gradient-line-glow';
    if (flowSpeed > 0) cls += ' gradient-line-flow';
    if (animation === 'breathe') cls += ' gradient-line-breathe';
    if (className) cls += ` ${className}`;

    // ── Flow animation uses CSS custom property for speed ──
    if (flowSpeed > 0) {
        baseStyle['--flow-speed'] = `${flowSpeed}s`;
        // Tripled background size so the gradient has room to translate
        baseStyle.backgroundSize = isVertical ? '100% 300%' : '300% 100%';
    }

    // ── ANIMATION: scroll ──
    if (animation === 'scroll') {
        return (
            <motion.div
                ref={lineRef}
                className={cls}
                style={{
                    ...baseStyle,
                    scaleY: isVertical ? scale : 1,
                    scaleX: !isVertical ? scale : 1,
                }}
            />
        );
    }

    // ── ANIMATION: entrance ──
    if (animation === 'entrance') {
        return (
            <motion.div
                ref={lineRef}
                className={cls}
                style={baseStyle}
                initial={{
                    scaleY: isVertical ? 0 : 1,
                    scaleX: !isVertical ? 0 : 1,
                    opacity: 0
                }}
                animate={{
                    scaleY: 1,
                    scaleX: 1,
                    opacity: 1
                }}
                transition={{
                    duration: 1,
                    ease: [0.16, 1, 0.3, 1],
                    delay
                }}
            />
        );
    }

    // ── ANIMATION: draw (SVG stroke-dashoffset) ──
    if (animation === 'draw') {
        const svgLength = isVertical ? length : length;
        return (
            <motion.div ref={lineRef} className={cls} style={{ ...baseStyle, background: 'none', overflow: 'visible' }}>
                <svg
                    width={isVertical ? thickness : '100%'}
                    height={isVertical ? '100%' : thickness}
                    style={{ display: 'block', overflow: 'visible' }}
                >
                    <motion.line
                        x1={isVertical ? '50%' : '0'}
                        y1={isVertical ? '0' : '50%'}
                        x2={isVertical ? '50%' : '100%'}
                        y2={isVertical ? '100%' : '50%'}
                        stroke="url(#grad)"
                        strokeWidth={thickness}
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay }}
                    />
                    <defs>
                        <linearGradient id="grad" x1="0" y1="0" x2={isVertical ? '0' : '1'} y2={isVertical ? '1' : '0'}>
                            <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
                            <stop offset="50%" stopColor="rgba(255,255,255,0.4)" />
                            <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
                        </linearGradient>
                    </defs>
                </svg>
            </motion.div>
        );
    }

    // ── ANIMATION: flow / breathe / none ──
    return (
        <div
            ref={lineRef}
            className={cls}
            style={baseStyle}
        />
    );
};
