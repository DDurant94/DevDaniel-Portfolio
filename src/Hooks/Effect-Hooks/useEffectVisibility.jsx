import { useEffect, useRef, useState } from 'react';

/**
 * useEffectVisibility - Design system visibility hook for effect utilities
 * 
 * One-way IntersectionObserver hook optimized for scroll effects in the design system.
 * Triggers once when element becomes visible, then disconnects. Works with CSS
 * utility classes that check data-fx-state attribute.
 * 
 * Features:
 * - One-time trigger (observer disconnects after visibility)
 * - Higher default threshold (0.55 - majority visible)
 * - Optimized for scroll animations
 * - Design system integration (data-fx-state attribute)
 * - Performance focused (auto-cleanup)
 * 
 * Design System Usage:
 * Pairs with .util-fade-in-up, .util-slide-in, and other effect utilities
 * that apply animations when data-fx-state="visible".
 * 
 * @hook
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Intersection threshold 0-1 (default: 0.55)
 * @param {Element|null} options.root - Root element for observer (default: viewport)
 * @param {string} options.rootMargin - Root margin (default: '0px')
 * @returns {{ ref: React.RefObject, visible: boolean }} - Ref for element + visible state
 * 
 * @example
 * const { ref, visible } = useEffectVisibility({ threshold: 0.6 });
 * return (
 *   <div ref={ref} data-fx-state={visible ? 'visible' : ''} className="util-fade-in-up">
 *     Content fades in when 60% visible
 *   </div>
 * );
 */
export function useEffectVisibility({ threshold = 0.15, root = null, rootMargin = '0px 0px -100px 0px' } = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || visible) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      });
    }, { threshold, root, rootMargin });
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, root, rootMargin, visible]);

  return { ref, visible };
}
