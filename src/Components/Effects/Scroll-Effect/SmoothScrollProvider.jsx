import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { useMediaQuery } from '../../../Context/MediaQueryContext.hook';

export default function SmoothScrollProvider({ children, options }) {
  const rafRef = useRef();
  const lenisRef = useRef();
  const { shouldSmoothScroll, performanceLevel } = useMediaQuery();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Skip Lenis entirely for reduced motion, low performance, or minimal mode
    if (!shouldSmoothScroll) return;

    // Reuse existing global Lenis if present
    let lenis = window.__lenis;
    let created = false;
    if (!lenis) {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 2.0,
        normalizeWheel: true,
        infinite: false,
        autoResize: true,
        ...options,
      });
      window.__lenis = lenis;
      created = true;
      
      // Ensure Lenis is started
      lenis.start();
    }

    const raf = (time) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };
    rafRef.current = requestAnimationFrame(raf);

    lenisRef.current = lenis;

    // Stop Lenis when page is transitioning (body is fixed)
    const checkTransition = () => {
      const isTransitioning = document.body.classList.contains('page-transitioning');
      if (isTransitioning) {
        lenis.stop();
      } else {
        lenis.start();
      }
    };

    // Only observe body class changes (remove expensive interval polling)
    const observer = new MutationObserver(checkTransition);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      observer.disconnect();
      // Only destroy if we created it
      if (created) {
        lenis.destroy();
        if (window.__lenis === lenis) {
          delete window.__lenis;
        }
      }
    };
  }, [options, shouldSmoothScroll, performanceLevel]);

  return children;
}
