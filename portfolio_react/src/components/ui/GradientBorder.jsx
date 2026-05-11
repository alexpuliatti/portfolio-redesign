import React from 'react';

/**
 * GradientBorder — Wraps any child element with an animated gradient border.
 *
 * @param {string}  gradient   - CSS gradient for the border.
 * @param {string}  thickness  - Border thickness. Default '2px'.
 * @param {string}  radius     - Border radius. Default '8px'.
 * @param {boolean} glow       - Enable outer glow.
 * @param {boolean} animate    - Enable continuous rotation animation on the gradient.
 * @param {number}  speed      - Rotation animation speed in seconds.
 * @param {string}  className  - Additional CSS classes.
 * @param {React.ReactNode} children - Content inside the border.
 */
export const GradientBorder = ({
    gradient = 'linear-gradient(135deg, #4facfe, #00f2fe, #43e97b, #fa709a, #4facfe)',
    thickness = '2px',
    radius = '8px',
    glow = false,
    animate = false,
    speed = 3,
    className = '',
    children
}) => {
    return (
        <div
            className={`gradient-border-outer ${animate ? 'gradient-border-animated' : ''} ${glow ? 'gradient-border-glow' : ''} ${className}`}
            style={{
                '--gb-gradient': gradient,
                '--gb-thickness': thickness,
                '--gb-radius': radius,
                '--gb-speed': `${speed}s`,
                padding: thickness,
                borderRadius: radius,
                background: gradient,
                backgroundSize: animate ? '400% 400%' : undefined,
            }}
        >
            <div
                className="gradient-border-inner"
                style={{ borderRadius: `calc(${radius} - ${thickness})` }}
            >
                {children}
            </div>
        </div>
    );
};
