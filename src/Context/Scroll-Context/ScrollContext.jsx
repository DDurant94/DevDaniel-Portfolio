/**
 * ScrollContext - Global scroll tracking with throttled updates (position, direction, progress)
 */
import { createContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const ScrollContext = createContext({
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

const SCROLL_THRESHOLD = 50;
const THROTTLE_MS = 16;

export const ScrollProvider = ({ children }) => {
  const [scrollY, setScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState('down');
  const [isScrolled, setIsScrolled] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const updateScrollState = useCallback(() => {
    const currentScrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    
    setScrollY(currentScrollY);
    
    if (currentScrollY > lastScrollY.current) {
      setScrollDirection('down');
    } else if (currentScrollY < lastScrollY.current) {
      setScrollDirection('up');
    }
    lastScrollY.current = currentScrollY;
    
    setIsScrolled(currentScrollY > SCROLL_THRESHOLD);
    
    setAtTop(currentScrollY <= 0);
    setAtBottom(currentScrollY >= maxScroll - 10);
    
    const progress = maxScroll > 0 ? currentScrollY / maxScroll : 0;
    setScrollProgress(Math.min(1, Math.max(0, progress)));
    
    ticking.current = false;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(updateScrollState);
        ticking.current = true;
      }
    };

    updateScrollState();

    window.addEventListener('scroll', handleScroll, { passive: true });

    window.addEventListener('resize', updateScrollState, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState]);

  const scrollToTop = useCallback((smooth = true) => {
    window.scrollTo({
      top: 0,
      behavior: smooth ? 'smooth' : 'instant'
    });
  }, []);

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
