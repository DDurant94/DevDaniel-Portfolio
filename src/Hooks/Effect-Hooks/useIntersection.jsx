import { useEffect, useRef, useState } from 'react';

/**
 * useIntersection - Unified IntersectionObserver hook
 * Covers lazy loading, scroll effects, and viewport detection with a single implementation.
 * 
 * @param {Object} options
 * @param {number} options.threshold - Visibility threshold 0-1 (default: 0.1)
 * @param {string} options.rootMargin - Root margin (default: '0px')
 * @param {Element|null} options.root - Root element (default: viewport)
 * @param {boolean} options.once - Disconnect after first intersection (default: true)
 * @param {boolean} options.trackExit - Track both entry and exit (default: false)
 * 
 * @returns {{ ref: React.RefObject, isIntersecting: boolean, hasIntersected: boolean }}
 * 
 * @example
 * // Lazy loading (one-time trigger)
 * const { ref, hasIntersected } = useIntersection({ rootMargin: '200px' });
 * 
 * // Scroll effects (one-time trigger with higher threshold)
 * const { ref, hasIntersected: visible } = useIntersection({ threshold: 0.55 });
 * 
 * // Bidirectional tracking (track entry and exit)
 * const { ref, isIntersecting } = useIntersection({ once: false, trackExit: true });
 */
export function useIntersection({
  threshold = 0.1,
  rootMargin = '0px',
  root = null,
  once = true,
  trackExit = false
} = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Fallback for browsers without IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      setIsIntersecting(true);
      setHasIntersected(true);
      return;
    }

    // If once=true and already intersected, don't observe again
    if (once && hasIntersected) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        
        // Update current state
        if (trackExit || isVisible) {
          setIsIntersecting(isVisible);
        }
        
        // Mark as intersected on first visibility
        if (isVisible && !hasIntersected) {
          setHasIntersected(true);
          
          // Disconnect if one-time trigger
          if (once) {
            observer.disconnect();
          }
        }
      },
      { threshold, rootMargin, root }
    );

    observerRef.current = observer;
    observer.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, rootMargin, root, once, trackExit, hasIntersected]);

  return { ref, isIntersecting, hasIntersected };
}
