import { useState, useEffect, useMemo } from 'react';
import { useIntersection } from '../Effect-Hooks/useIntersection.jsx';

/**
 * Custom hook for lazy loading images with Intersection Observer
 * Wrapper around useIntersection for backward compatibility.
 */
export const useLazyLoad = ({ threshold = 0.1, rootMargin = '50px' } = {}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { ref, hasIntersected: isInView } = useIntersection({ threshold, rootMargin });

  const handleLoad = () => setIsLoaded(true);

  return { ref, isInView, isLoaded, handleLoad };
};

/**
 * Custom hook for preloading images
 * Useful for critical images that should load before being visible
 * 
 * @param {string|string[]} src - Image source(s) to preload
 * @returns {boolean} - Loading state
 * 
 * @example
 * const isLoaded = useImagePreload('/hero-image.jpg');
 */

export const useImagePreload = (src) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!src) return;

    const sources = Array.isArray(src) ? src : [src];
    let loadedCount = 0;

    const preloadImage = (source) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          if (loadedCount === sources.length) {
            setIsLoaded(true);
          }
          resolve();
        };
        img.onerror = reject;
        img.src = source;
      });
    };

    Promise.all(sources.map(preloadImage)).catch((error) => {
      console.error('Image preload failed:', error);
    });
  }, [src]);

  return isLoaded;
};

/**
 * Custom hook for responsive images with srcset
 * Automatically selects appropriate image based on screen size
 * 
 * @param {Object} sources - Object with breakpoint keys and image sources
 * @param {Object} options - MediaQuery options
 * @returns {string} - Current image source
 * 
 * @example
 * const src = useResponsiveImage({
 *   mobile: '/image-small.jpg',
 *   tablet: '/image-medium.jpg',
 *   desktop: '/image-large.jpg'
 * });
 */

export const useResponsiveImage = (sources, options = {}) => {
  const defaultBreakpoints = {
    mobile: '(max-width: 768px)',
    tablet: '(min-width: 769px) and (max-width: 1024px)',
    desktop: '(min-width: 1025px)'
  };

  const breakpoints = useMemo(
    () => ({ ...defaultBreakpoints, ...options }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [options]
  );
  const [currentSrc, setCurrentSrc] = useState(sources.desktop || sources.mobile);

  useEffect(() => {
    const mediaQueries = Object.entries(breakpoints).map(([key, query]) => ({
      key,
      mql: window.matchMedia(query)
    }));

    const updateSource = () => {
      const matched = mediaQueries.find(({ mql }) => mql.matches);
      if (matched && sources[matched.key]) {
        setCurrentSrc(sources[matched.key]);
      }
    };

    // Initial check
    updateSource();

    // Listen for changes
    mediaQueries.forEach(({ mql }) => {
      mql.addEventListener('change', updateSource);
    });

    return () => {
      mediaQueries.forEach(({ mql }) => {
        mql.removeEventListener('change', updateSource);
      });
    };
  }, [sources, breakpoints]);

  return currentSrc;
};
