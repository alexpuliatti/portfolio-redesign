import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export function useSmoothScroll(isLocked = false) {
    const lenisRef = useRef(null);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            smoothWheel: true,
            mouseMultiplier: 1,
            syncTouch: true,
            smoothTouch: true,
            touchMultiplier: 2,
            infinite: false,
        });
        
        lenisRef.current = lenis;
        window.lenis = lenis;

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
            lenisRef.current = null;
            if (window.lenis === lenis) {
                delete window.lenis;
            }
        };
    }, []);

    useEffect(() => {
        if (!lenisRef.current) return;
        if (isLocked) {
            lenisRef.current.stop();
        } else {
            lenisRef.current.start();
        }
    }, [isLocked]);
}
