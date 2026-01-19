import { createContext, useState, useEffect } from 'react';

/**
 * MediaQueryContext - Centralized responsive breakpoint management
 * 
 * Provides real-time boolean flags for all CSS breakpoints and user preferences.
 * Eliminates hydration mismatches by updating state after mount. Includes viewport
 * dimensions, orientation, touch detection, and accessibility preferences.
 * 
 * Features:
 * - Device categories: isMobile, isTablet, isDesktop, isLargeDesktop
 * - Granular breakpoints: isXSmall, isSmall, isMedium, isLarge, isXLarge
 * - Orientation: isPortrait, isLandscape
 * - User preferences: prefersReducedMotion, prefersDarkMode
 * - Touch detection: isTouchDevice
 * - Live viewport dimensions: width, height
 * - Auto-updates on resize and orientation change
 * - Legacy browser support (addListener fallback)
 * 
 * Breakpoints:
 * - isMobile: < 768px
 * - isTablet: 768px - 1023px
 * - isDesktop: >= 1024px
 * - isLargeDesktop: >= 1440px
 * - isXSmall: < 480px (phones)
 * - isSmall: 480px - 767px (large phones)
 * - isMedium: 768px - 1023px (tablets)
 * - isLarge: 1024px - 1439px (laptops)
 * - isXLarge: >= 1440px (large desktops)
 * 
 * @context
 * @example
 * import { useMediaQuery } from './MediaQueryContext';
 * 
 * const { isMobile, isDesktop, prefersReducedMotion } = useMediaQuery();
 * 
 * if (isMobile) {
 *   return <MobileNav />;
 * }
 * 
 * if (prefersReducedMotion) {
 *   return <StaticHero />;
 * }
 * 
 * @example
 * // Responsive component rendering
 * const { isTablet, width } = useMediaQuery();
 * const columns = isTablet ? 2 : width < 480 ? 1 : 3;
 */

// eslint-disable-next-line react-refresh/only-export-components
export const MediaQueryContext = createContext({
  // Device breakpoints (mobile-first)
  isMobile: false,       // < 768px
  isTablet: false,       // 768px - 1024px
  isDesktop: false,      // >= 1024px
  isLargeDesktop: false, // >= 1440px
  
  // Specific breakpoints matching your CSS
  isXSmall: false,       // < 480px (phones)
  isSmall: false,        // 480px - 768px (large phones, small tablets)
  isMedium: false,       // 768px - 1024px (tablets, small laptops)
  isLarge: false,        // 1024px - 1440px (laptops, desktops)
  isXLarge: false,       // >= 1440px (large desktops)
  
  // Common utility breakpoints
  isTouchDevice: false,  // Touch capability
  isPortrait: false,     // Portrait orientation
  isLandscape: false,    // Landscape orientation
  
  // User preferences
  prefersReducedMotion: false,
  prefersDarkMode: false,
  
  // Actual viewport dimensions
  width: 0,
  height: 0,
  
  // Performance-related defaults
  shouldSmoothScroll: true,
  shouldAnimate: true,
  shouldRender3D: true,
  performanceLevel: 'full',
});

export const MediaQueryProvider = ({ children }) => {
  const [queries, setQueries] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isLargeDesktop: false,
    isXSmall: false,
    isSmall: false,
    isMedium: false,
    isLarge: false,
    isXLarge: false,
    isTouchDevice: false,
    isPortrait: false,
    isLandscape: false,
    prefersReducedMotion: false,
    prefersDarkMode: false,
    width: 0,
    height: 0,
    // Performance-related defaults
    shouldSmoothScroll: true,
    shouldAnimate: true,
    shouldRender3D: true,
    performanceLevel: 'full',
  });

  useEffect(() => {
    // Define media queries matching common CSS breakpoints
    const mediaQueries = {
      isMobile: '(max-width: 767px)',
      isTablet: '(min-width: 768px) and (max-width: 1023px)',
      isDesktop: '(min-width: 1024px)',
      isLargeDesktop: '(min-width: 1440px)',
      
      isXSmall: '(max-width: 479px)',
      isSmall: '(min-width: 480px) and (max-width: 767px)',
      isMedium: '(min-width: 768px) and (max-width: 1023px)',
      isLarge: '(min-width: 1024px) and (max-width: 1439px)',
      isXLarge: '(min-width: 1440px)',

      isPortrait: '(orientation: portrait)',
      isLandscape: '(orientation: landscape)',

      prefersReducedMotion: '(prefers-reduced-motion: reduce)',
      prefersDarkMode: '(prefers-color-scheme: dark)',
    };

    // Create MediaQueryList objects
    const mediaQueryLists = Object.entries(mediaQueries).reduce((acc, [key, query]) => {
      acc[key] = window.matchMedia(query);
      return acc;
    }, {});

    // Handler to update state when media queries change
    const updateQueries = () => {
      const newQueries = Object.entries(mediaQueryLists).reduce((acc, [key, mql]) => {
        acc[key] = mql.matches;
        return acc;
      }, {});

      // Add viewport dimensions
      newQueries.width = window.innerWidth;
      newQueries.height = window.innerHeight;

      // Detect touch capability (not a media query, but useful)
      newQueries.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      // Performance level detection (layered degradation)
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      const cores = navigator.hardwareConcurrency || 4;
      
      let performanceLevel = 'full';
      
      // Priority order: explicit user preferences first, then network/device
      if (connection?.saveData) {
        performanceLevel = 'minimal';
      } else if (newQueries.prefersReducedMotion) {
        performanceLevel = 'reduced';
      } else if (connection?.effectiveType === '2g' || connection?.effectiveType === 'slow-2g') {
        performanceLevel = 'low'; 
      } else if (connection?.effectiveType === '3g' && cores <= 2) {
        performanceLevel = 'low';
      }
      
      newQueries.performanceLevel = performanceLevel;
      
      // Convenience flags for components
      newQueries.shouldAnimate = performanceLevel === 'full';
      newQueries.shouldRender3D = ['full', 'reduced'].includes(performanceLevel);
      newQueries.shouldSmoothScroll = !newQueries.prefersReducedMotion;
      newQueries.shouldAutoRotate = performanceLevel === 'full';
      newQueries.use3DQuality = performanceLevel === 'low' ? 'low' : 'high';

      setQueries(newQueries);
    };

    updateQueries();

    // Debounce resize updates to prevent excessive re-renders
    let resizeTimeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateQueries, 150);
    };

    Object.values(mediaQueryLists).forEach((mql) => {
      if (mql.addEventListener) {
        mql.addEventListener('change', updateQueries);
      } else {
        mql.addListener(updateQueries);
      }
    });

    window.addEventListener('resize', debouncedResize);

    // Cleanup
    return () => {
      clearTimeout(resizeTimeout);
      Object.values(mediaQueryLists).forEach((mql) => {
        if (mql.removeEventListener) {
          mql.removeEventListener('change', updateQueries);
        } else {
          mql.removeListener(updateQueries);
        }
      });
      window.removeEventListener('resize', debouncedResize);
    };
  }, []);

  return (
    <MediaQueryContext.Provider value={queries}>
      {children}
    </MediaQueryContext.Provider>
  );
};
