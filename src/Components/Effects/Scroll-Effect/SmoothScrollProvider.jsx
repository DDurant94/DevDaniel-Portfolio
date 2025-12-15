import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export default function SmoothScrollProvider({ children, options }) {
  const rafRef = useRef();
  const lenisRef = useRef();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Reuse existing global Lenis if present
    let lenis = window.__lenis;
    let created = false;
    if (!lenis) {
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.25,
        normalizeWheel: true,
        ...options,
      });
      window.__lenis = lenis;
      created = true;
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

    // Check on interval
    const intervalId = setInterval(checkTransition, 100);

    // Also observe body class changes
    const observer = new MutationObserver(checkTransition);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearInterval(intervalId);
      observer.disconnect();
      // Only destroy if we created it
      if (created) {
        lenis.destroy();
        if (window.__lenis === lenis) {
          delete window.__lenis;
        }
      }
    };
  }, [options]);

  return children;
}
