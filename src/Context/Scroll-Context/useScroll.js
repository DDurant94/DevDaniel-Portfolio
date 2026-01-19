/**
 * useScroll Hook - Access global scroll tracking
 * 
 * @hook
 * @example
 * import { useScroll } from './useScroll';
 * 
 * const { scrollY, scrollDirection, isScrolled, scrollToTop } = useScroll();
 */
import { useContext } from 'react';
import { ScrollContext } from './ScrollContext';

export const useScroll = () => useContext(ScrollContext);
