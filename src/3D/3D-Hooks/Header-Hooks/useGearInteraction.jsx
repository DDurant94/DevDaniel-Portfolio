import { useEffect } from 'react';

/**
 * useGearInteraction - User interaction handler for 3D gear rotation
 * 
 * Manages scroll wheel and touch gesture rotation for the hero gear model.
 * Updates target rotation refs which are smoothly interpolated in the render loop.
 * 
 * Features:
 * - Scroll wheel rotation (wheel events)
 * - Touch drag rotation (single finger)
 * - Passive event listeners for performance
 * - Prevents rotation when at page top scrolling up
 * - Sensitivity tuned for natural feel (0.0003 scroll, 0.005 touch)
 * 
 * @hook
 * @param {Object} targetRotationRef - useRef containing target rotation value (Y axis)
 * @param {Object} touchStartRef - useRef containing touch state { x, dragging }
 * 
 * @example
 * const targetRotationRef = useRef(0);
 * const touchStartRef = useRef({ x: 0, dragging: false });
 * useGearInteraction(targetRotationRef, touchStartRef);
 * 
 * // In render loop:
 * mesh.current.rotation.y = THREE.MathUtils.lerp(
 *   mesh.current.rotation.y,
 *   targetRotationRef.current,
 *   0.1
 * );
 */
export default function useGearInteraction(targetRotationRef, touchStartRef) {
  useEffect(() => {
    const handleWheel = (e) => {
      if (window.scrollY === 0 && e.deltaY < 0) return;
      targetRotationRef.current += -e.deltaY * 0.0003;
    };

    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        touchStartRef.current = { x: e.touches[0].clientX, dragging: true };
      }
    };

    const handleTouchMove = (e) => {
      if (!touchStartRef.current.dragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - touchStartRef.current.x;
      touchStartRef.current.x = e.touches[0].clientX;
      targetRotationRef.current += dx * 0.005;
    };

    const handleTouchEnd = () => {
      touchStartRef.current.dragging = false;
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [targetRotationRef, touchStartRef]);
}
