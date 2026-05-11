import React from 'react';
import { GradientLine } from './GradientLine';

/**
 * GradientDivider — A full-width horizontal section separator with an optional centered label.
 *
 * @param {string} gradient  - CSS gradient for the line.
 * @param {string} label     - Optional text label centered on the line.
 * @param {string} thickness - Line thickness. Default '2px'.
 * @param {string} taper     - 'start' | 'end' | 'both'. Default 'both'.
 * @param {string} animation - Animation mode passed to GradientLine.
 * @param {boolean} glow     - Enable glow effect.
 * @param {string} className - Additional CSS classes.
 */
export const GradientDivider = ({
    gradient = 'linear-gradient(to right, #4facfe, #00f2fe)',
    label = '',
    thickness = '2px',
    taper = 'both',
    animation = 'entrance',
    glow = false,
    className = ''
}) => {
    if (label) {
        return (
            <div className={`gradient-divider ${className}`}>
                <GradientLine
                    gradient={gradient}
                    orientation="horizontal"
                    thickness={thickness}
                    length="100%"
                    taper="end"
                    animation={animation}
                    glow={glow}
                    className="gradient-divider-left"
                />
                <span className="gradient-divider-label">{label}</span>
                <GradientLine
                    gradient={gradient}
                    orientation="horizontal"
                    thickness={thickness}
                    length="100%"
                    taper="start"
                    animation={animation}
                    glow={glow}
                    className="gradient-divider-right"
                />
            </div>
        );
    }

    return (
        <div className={`gradient-divider ${className}`}>
            <GradientLine
                gradient={gradient}
                orientation="horizontal"
                thickness={thickness}
                length="100%"
                taper={taper}
                animation={animation}
                glow={glow}
            />
        </div>
    );
};
