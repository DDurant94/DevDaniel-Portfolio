/**
 * useScrollProgress Hook
 * 
 * @description Tracks scroll progress through the first viewport height and stores it
 * as a data attribute on the container element. Disables pointer events on canvas when
 * scene is mostly scrolled out of view.
 * 
 * Features:
 * - Calculates normalized scroll progress (0 to 1) over first viewport
 * - Stores progress in data-scrollProgress attribute for CSS/animation access
 * - Automatically disables canvas pointer events at 70% scroll for performance
 * - Passive scroll listener for smooth 60fps tracking
 * 
 * Use Cases:
 * - Camera animation based on scroll
 * - Fade out effects
 * - Parallax calculations
 * - Disabling interactions when out of view
 * 
 * @hook
 * @param {React.RefObject} containerRef - Ref to the container element (usually Canvas wrapper)
 * 
 * @example
 * ```jsx
 * const containerRef = useRef();
 * useScrollProgress(containerRef);
 * 
 * return (
 *   <div ref={containerRef} className="hero-container">
 *     <Canvas>
 *       {// Access via: containerRef.current.dataset.scrollProgress}
 *       <CameraAnimation />
 *     </Canvas>
 *   </div>
 * );
 * ```
 */

import { useEffect } from 'react';

export default function useScrollProgress(containerRef) {
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const maxScroll = window.innerHeight; // Scroll through one viewport height
      const progress = Math.min(window.scrollY / maxScroll, 1);
      
      // Store scroll progress for camera animation in the Canvas
      containerRef.current.dataset.scrollProgress = progress;
      
      // Disable pointer events when mostly faded out
      const canvas = containerRef.current.querySelector('canvas');
      if (canvas) {
        canvas.style.pointerEvents = progress > 0.7 ? 'none' : 'auto';
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [containerRef]);
}
