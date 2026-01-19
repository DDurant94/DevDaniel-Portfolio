/**
 * usePageTransition Hook - Access page transition state and controls
 * 
 * @hook
 * @example
 * import { usePageTransition } from './usePageTransition';
 * 
 * const { startTransition, transitionState, currentVariant } = usePageTransition();
 */
import { useContext } from 'react';
import { PageTransitionContext } from './PageTransitionContext';

export const usePageTransition = () => useContext(PageTransitionContext);
