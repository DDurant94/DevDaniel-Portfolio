/**
 * useLazyComponent Hook
 * 
 * @description Lazy loads React components using Intersection Observer. Component is only
 * rendered when it enters the viewport, improving initial page load performance.
 * 
 * Use Cases:
 * - Below-the-fold content
 * - Heavy components (charts, 3D graphics, large images)
 * - Long pages with many components
 * - Performance optimization
 * 
 * @hook
 * @param {React.Component} Component - Component to lazy load
 * @param {Object} [options={threshold: 0.1}] - IntersectionObserver options
 * @param {number} [options.threshold=0.1] - Percentage of component visible before loading (0.0 to 1.0)
 * @param {string} [options.rootMargin] - Margin around viewport (e.g., '100px')
 * 
 * @returns {Array} [containerRef, LazyComponent]
 * @returns {React.RefObject} return[0] - Ref to attach to container element
 * @returns {React.Component} return[1] - Component or placeholder
 * 
 * @example
 * ```jsx
 * const [ref, LazyHeavyChart] = useLazyComponent(HeavyChart, { threshold: 0.2 });
 * 
 * return (
 *   <div ref={ref}>
 *     <LazyHeavyChart data={chartData} />
 *   </div>
 * );
 * ```
 */

import { useState, useEffect, useRef } from 'react';

export function useLazyComponent(Component, options = { threshold: 0.1 }) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      options
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [options]);

  return [containerRef, shouldLoad ? Component : () => <div ref={containerRef} style={{ minHeight: "20px" }} />];
}
