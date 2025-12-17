/**
 * Scroll Animation Pauser
 * 
 * @description Utility to pause/resume infinite CSS animations during scroll for performance.
 * Prevents paint thrashing by pausing animations that trigger continuous repaints while scrolling.
 * 
 * Features:
 * - Automatically detects scroll start/stop
 * - Pauses animations by adding data-scrolling attribute
 * - Resumes 150ms after scroll stops
 * - Passive event listeners for performance
 * - Global singleton pattern (only one listener)
 * 
 * Usage:
 * 1. Import and call setupScrollPauseAnimations() once in App.jsx or main.jsx
 * 2. Add CSS rules to pause animations when [data-scrolling="true"]
 * 
 * @example
 * ```jsx
 * // In App.jsx
 * import { setupScrollPauseAnimations } from './Utils/scrollPauseAnimations';
 * 
 * useEffect(() => {
 *   setupScrollPauseAnimations();
 * }, []);
 * ```
 * 
 * @example
 * ```css
 * // In CSS file
 * [data-scrolling="true"] .animated-element {
 *   animation-play-state: paused !important;
 * }
 * ```
 */

let isSetup = false;
let scrollTimeout = null;

/**
 * Sets up global scroll listener to pause/resume animations
 * Only sets up once (singleton pattern)
 */
export function setupScrollPauseAnimations() {
  if (isSetup) return; // Prevent duplicate listeners
  
  const handleScroll = () => {
    // Mark body as scrolling
    document.body.setAttribute('data-scrolling', 'true');
    
    // Clear existing timeout
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    
    // Resume animations 150ms after scroll stops
    scrollTimeout = setTimeout(() => {
      document.body.setAttribute('data-scrolling', 'false');
    }, 150);
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  isSetup = true;
  
  // Cleanup function
  return () => {
    window.removeEventListener('scroll', handleScroll);
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    isSetup = false;
  };
}
