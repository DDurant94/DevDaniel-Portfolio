import { useIntersection } from './useIntersection.jsx';

/**
 * useEffectVisibility - Backward compatibility wrapper for useIntersection
 * One-way IntersectionObserver hook optimized for scroll effects.
 * 
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Intersection threshold 0-1 (default: 0.55)
 * @param {Element|null} options.root - Root element for observer (default: viewport)
 * @param {string} options.rootMargin - Root margin (default: '0px')
 * @returns {{ ref: React.RefObject, visible: boolean }}
 */
export function useEffectVisibility({ threshold = 0.1, root = null, rootMargin = '0px' } = {}) {
  const { ref, hasIntersected: visible } = useIntersection({ 
    threshold, 
    root, 
    rootMargin,
    once: true 
  });
  
  return { ref, visible };
}

