/**
 * ScrollContext
 * 
 * @description Global scroll position tracking with throttled updates and utility functions.
 * Provides scroll position, direction, progress, and helper methods for smooth scrolling.
 * 
 * Features:
 * - Throttled scroll tracking (~60fps with RAF)
 * - Scroll direction detection (up/down)
 * - isScrolled flag (threshold-based)
 * - Position flags (atTop, atBottom)
 * - Scroll progress (0-1 normalized)
 * - Smooth scroll utilities
 * - Automatic cleanup and performance optimization
 * 
 * State Values:
 * - scrollY: number - Current vertical scroll position (pixels)
 * - scrollDirection: 'up'|'down' - Current scroll direction
 * - isScrolled: boolean - True if scrolled past SCROLL_THRESHOLD (50px)
 * - atTop: boolean - True if at top of page (scrollY <= 0)
 * - atBottom: boolean - True if at bottom (within 10px)
 * - scrollProgress: number - Scroll percentage (0.0 to 1.0)
 * 
 * Utility Functions:
 * - scrollToTop(smooth) - Scroll to top of page
 * - scrollToSection(id, offset, smooth) - Scroll to element by ID
 * - scrollToElement(element, offset, smooth) - Scroll to DOM element
 * 
 * Performance:
 * - Uses requestAnimationFrame for throttling
 * - Passive event listeners
 * - Ticking flag prevents redundant updates
 * - Updates on scroll and resize events
 * 
 * Constants:
 * - SCROLL_THRESHOLD: 50px (isScrolled activation point)
 * - THROTTLE_MS: 16ms (~60fps target)
 * 
 * @module ScrollContext
 * 
 * @example
 * ```jsx
 * // In App.jsx:
 * <ScrollProvider>
 *   <YourApp />
 * </ScrollProvider>
 * 
 * // In components:
 * function ScrollIndicator() {
 *   const { scrollProgress, scrollDirection, atTop } = useScroll();
 *   
 *   return (
 *     <div className="scroll-indicator">
 *       <div 
 *         className="progress-bar" 
 *         style={{ width: `${scrollProgress * 100}%` }}
 *       />
 *       <p>Direction: {scrollDirection}</p>
 *       {!atTop && (
 *         <button onClick={() => scrollToTop()}>Back to Top</button>
 *       )}
 *     </div>
 *   );
 * }
 * 
 * // Smooth scroll to section:
 * const { scrollToSection } = useScroll();
 * <button onClick={() => scrollToSection('about', -80)}>About</button>
 * ```
 */

import { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';

const ScrollContext = createContext({
  scrollY: 0,
  scrollDirection: 'down',
  isScrolled: false,
  atTop: true,
  atBottom: false,
  scrollProgress: 0,
  scrollToTop: () => {},
  scrollToSection: () => {},
  scrollToElement: () => {}
});

export const useScroll = () => useContext(ScrollContext);

const SCROLL_THRESHOLD = 50; // px before isScrolled becomes true
const THROTTLE_MS = 16; // ~60fps

export const ScrollProvider = ({ children }) => {
  const [scrollY, setScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState('down');
  const [isScrolled, setIsScrolled] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // Throttled scroll update using requestAnimationFrame
  const updateScrollState = useCallback(() => {
    const currentScrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    
    // Update scroll position
    setScrollY(currentScrollY);
    
    // Update scroll direction
    if (currentScrollY > lastScrollY.current) {
      setScrollDirection('down');
    } else if (currentScrollY < lastScrollY.current) {
      setScrollDirection('up');
    }
    lastScrollY.current = currentScrollY;
    
    // Update isScrolled (threshold-based)
    setIsScrolled(currentScrollY > SCROLL_THRESHOLD);
    
    // Update position flags
    setAtTop(currentScrollY <= 0);
    setAtBottom(currentScrollY >= maxScroll - 10); // 10px buffer
    
    // Update scroll progress (0-1)
    const progress = maxScroll > 0 ? currentScrollY / maxScroll : 0;
    setScrollProgress(Math.min(1, Math.max(0, progress)));
    
    ticking.current = false;
  }, []);

  // Scroll event handler with RAF throttling
  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(updateScrollState);
        ticking.current = true;
      }
    };

    // Initialize on mount
    updateScrollState();
    
    // Listen to scroll
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Also update on resize (changes max scroll)
    window.addEventListener('resize', updateScrollState, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState]);

  // Utility: Smooth scroll to top
  const scrollToTop = useCallback((smooth = true) => {
    window.scrollTo({
      top: 0,
      behavior: smooth ? 'smooth' : 'instant'
    });
  }, []);

  // Utility: Smooth scroll to section by ID
  const scrollToSection = useCallback((sectionId, offset = 0, smooth = true) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const targetPosition = element.offsetTop + offset;
      window.scrollTo({
        top: targetPosition,
        behavior: smooth ? 'smooth' : 'instant'
      });
    }
  }, []);

  // Utility: Smooth scroll to element
  const scrollToElement = useCallback((element, offset = 0, smooth = true) => {
    if (element) {
      const targetPosition = element.offsetTop + offset;
      window.scrollTo({
        top: targetPosition,
        behavior: smooth ? 'smooth' : 'instant'
      });
    }
  }, []);

  const value = useMemo(() => ({
    scrollY,
    scrollDirection,
    isScrolled,
    atTop,
    atBottom,
    scrollProgress,
    scrollToTop,
    scrollToSection,
    scrollToElement
  }), [scrollY, scrollDirection, isScrolled, atTop, atBottom, scrollProgress, scrollToTop, scrollToSection, scrollToElement]);

  return (
    <ScrollContext.Provider value={value}>
      {children}
    </ScrollContext.Provider>
  );
};
