/**
 * useMediaQuery Hook - Access responsive breakpoint state
 * 
 * @hook
 * @example
 * import { useMediaQuery } from './MediaQueryContext.hook';
 * 
 * const { isMobile, isDesktop, prefersReducedMotion } = useMediaQuery();
 */
import { useContext } from 'react';
import { MediaQueryContext } from './MediaQueryContext';

export const useMediaQuery = () => useContext(MediaQueryContext);
