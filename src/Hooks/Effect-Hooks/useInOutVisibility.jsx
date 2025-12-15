import { useEffect, useRef, useState } from 'react';

/**
 * useInOutVisibility - Bidirectional visibility tracking with IntersectionObserver
 * 
 * Tracks when an element enters AND leaves the viewport. Unlike one-way observers,
 * this hook updates state on both entry and exit, allowing for enter/leave animations.
 * 
 * Features:
 * - Bidirectional tracking (inView true/false)
 * - Optional "once" mode (stays true after first intersection)
 * - Configurable threshold (0-1 or array)
 * - Custom root and root margin
 * - Returns ref to attach + inView boolean state
 * 
 * Use Cases:
 * - Scroll-triggered animations that reverse on scroll up
 * - Lazy loading with unload on exit
 * - Pause/resume animations based on viewport visibility
 * - Analytics tracking (time in viewport)
 * 
 * @hook
 * @param {Object} options - Configuration options
 * @param {number|number[]} options.threshold - Intersection threshold(s) 0-1 (default: 0.35)
 * @param {Element|null} options.root - Root element for observer (default: viewport)
 * @param {string} options.rootMargin - Root margin (default: '0px')
 * @param {boolean} options.once - If true, stays true after first enter (default: false)
 * @returns {{ ref: React.RefObject, inView: boolean }} - Ref for element + inView state
 * 
 * @example
 * // Bidirectional animation
 * const { ref, inView } = useInOutVisibility({ threshold: 0.5 });
 * return <div ref={ref} className={inView ? 'visible' : 'hidden'}>Content</div>;
 * 
 * @example
 * // One-time trigger
 * const { ref, inView } = useInOutVisibility({ once: true });
 */
export function useInOutVisibility({ threshold = 0.35, root = null, rootMargin = '0px', once = false } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const hasEntered = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          hasEntered.current = true;
          setInView(true);
          if (once) return; // still observe to keep state if once? we intentionally keep; if strict freeze, could disconnect.
        } else if (!once) {
          if (!once) setInView(false);
        }
      });
    }, { threshold, root, rootMargin });
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, root, rootMargin, once]);

  // If once and has ever entered, force true
  const effectiveInView = once && hasEntered.current ? true : inView;
  return { ref, inView: effectiveInView };
}
