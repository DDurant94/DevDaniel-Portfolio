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

import { useEffect, useRef } from 'react';

export default function useScrollProgress(containerRef) {
  // Cache canvas element to avoid querySelector on every scroll
  const canvasRef = useRef(null);
  
  useEffect(() => {
    // Re-cache canvas when container changes (e.g., route navigation)
    if (containerRef.current) {
      canvasRef.current = containerRef.current.querySelector('canvas');
    }
    
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const maxScroll = window.innerHeight; // Scroll through one viewport height
      const progress = Math.min(window.scrollY / maxScroll, 1);
      
      // Store scroll progress for camera animation in the Canvas
      containerRef.current.dataset.scrollProgress = progress;
      
      // Fade out the canvas based on scroll progress
      if (canvasRef.current) {
        // Fade from 1 to 0 as user scrolls down
        // Keep scene slightly visible (min 0.05) until very end
        const fadeOpacity = Math.max(0, 1 - progress);
        canvasRef.current.style.opacity = progress > 0.98 ? 0 : fadeOpacity;
        canvasRef.current.style.pointerEvents = progress > 0.7 ? 'none' : 'auto';
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [containerRef]);
}
