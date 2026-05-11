import React from 'react';

/**
 * GradientUnderline — An inline text element with an animated gradient underline.
 *
 * @param {string}  gradient    - CSS gradient for the underline.
 * @param {string}  thickness   - Underline thickness. Default '2px'.
 * @param {string}  trigger     - 'always' | 'hover'. Default 'always'.
 * @param {boolean} glow        - Enable glow effect on the underline.
 * @param {string}  className   - Additional CSS classes.
 * @param {React.ReactNode} children - The text to underline.
 */
export const GradientUnderline = ({
    gradient = 'linear-gradient(to right, #4facfe, #00f2fe)',
    thickness = '2px',
    trigger = 'always',
    glow = false,
    className = '',
    children
}) => {
    return (
        <span
            className={`gradient-underline ${trigger === 'hover' ? 'gradient-underline-hover' : 'gradient-underline-always'} ${glow ? 'gradient-underline-glow' : ''} ${className}`}
            style={{
                '--gu-gradient': gradient,
                '--gu-thickness': thickness,
            }}
        >
            {children}
        </span>
    );
};
