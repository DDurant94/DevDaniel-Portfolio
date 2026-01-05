import { useEffect, useRef, useState } from 'react';

/**
 * useLazyLoad - Intersection Observer hook for lazy loading
 * 
 * Detects when an element enters the viewport and triggers loading.
 * Useful for images, videos, and heavy content that should load on-demand.
 * 
 * Features:
 * - Customizable root margin (load before/after viewport)
 * - Threshold control (how much visible triggers load)
 * - One-time trigger (doesn't reload on re-entry)
 * - Cleanup on unmount
 * 
 * @param {Object} options - Intersection Observer options
 * @param {string} options.rootMargin - Margin around viewport (default: '200px')
 * @param {number} options.threshold - Visibility threshold 0-1 (default: 0.01)
 * 
 * @returns {Object} - { ref, isIntersecting, hasIntersected }
 * 
 * @example
 * const { ref, hasIntersected } = useLazyLoad({ rootMargin: '100px' });
 * 
 * return (
 *   <div ref={ref}>
 *     {hasIntersected && <img src={heavyImage} />}
 *   </div>
 * );
 */
export default function useLazyLoad({ 
  rootMargin = '200px', 
  threshold = 0.01 
} = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check if Intersection Observer is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: load immediately if not supported
      setIsIntersecting(true);
      setHasIntersected(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        setIsIntersecting(isVisible);
        
        // Once intersected, always mark as loaded (one-time trigger)
        if (isVisible && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [rootMargin, threshold, hasIntersected]);

  return { ref, isIntersecting, hasIntersected };
}
