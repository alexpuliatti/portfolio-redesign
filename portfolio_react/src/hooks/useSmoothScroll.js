import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export function useSmoothScroll(isLocked = false, isEnabled = true) {
    const lenisRef = useRef(null);

    useEffect(() => {
        if (!isEnabled) {
            if (lenisRef.current) {
                lenisRef.current.destroy();
                lenisRef.current = null;
                if (window.lenis) delete window.lenis;
            }
            return;
        }

        const lenis = new Lenis({
            lerp: 0.2, // Faster lerp makes it more subtle and closer to native scroll
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            smoothWheel: true,
            mouseMultiplier: 1,
            syncTouch: false,
            syncTouchLerp: 0.05,
            touchInertiaExponent: 0.92,
            touchMultiplier: 0.85,
            infinite: false,
        });
        
        lenisRef.current = lenis;
        window.lenis = lenis;

        let animationFrameId;
        function raf(time) {
            lenis.raf(time);
            animationFrameId = requestAnimationFrame(raf);
        }

        animationFrameId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(animationFrameId);
            lenis.destroy();
            lenisRef.current = null;
            if (window.lenis === lenis) {
                delete window.lenis;
            }
        };
    }, [isEnabled]);

    useEffect(() => {
        if (!lenisRef.current) return;
        if (isLocked) {
            lenisRef.current.stop();
        } else {
            lenisRef.current.start();
        }
    }, [isLocked]);
}
