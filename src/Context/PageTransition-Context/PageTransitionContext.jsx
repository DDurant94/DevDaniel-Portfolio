import { createContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMediaQuery } from '../MediaQueryContext.hook';

/**
 * PageTransitionContext - Orchestrates smooth page transitions with 3D scene
 * 
 * Manages the complete transition lifecycle: covering screen → navigate → reveal new page.
 * Coordinates with SharedHeroScene cloud animations to hide content during navigation,
 * scrolls to top while covered, then reveals new page with appropriate scene variant.
 * 
 * Transition States:
 * 1. 'idle' - No transition, page fully visible
 * 2. 'covering' - Clouds sliding in to cover page (1000ms)
 * 3. 'covered' - Screen fully covered, navigation happening (200ms pause)
 * 4. 'revealing' - Clouds sliding away to reveal new page (1200ms)
 * 
 * Features:
 * - Smooth cloud-based transitions (no jarring cuts)
 * - Automatic scroll-to-top while screen covered
 * - Scene variant switching per route (home/about/projects/skills)
 * - Loading UI fallback for slow transitions (15s+)
 * - Body scroll lock during transition
 * - Custom event integration ('startPageTransition')
 * - Cleanup on unmount
 * 
 * Timeline (Total: ~2.6s):
 * - 0ms: Start covering animation
 * - 1000ms: Navigate to new route
 * - 1400ms: Mark covered, pause 200ms
 * - 1600ms: Start revealing
 * - 2800ms: Return to idle
 * 
 * Route to Variant Mapping:
 * - / → home
 * - /about → about
 * - /projects → portfolio
 * - /skills → skills
 * - /contact → home (fallback)
 * 
 * @context
 * @example
 * import { usePageTransition } from './PageTransitionContext';
 * 
 * const { startTransition, transitionState, currentVariant } = usePageTransition();
 * 
 * // Trigger transition on link click:
 * <a onClick={(e) => {
 *   e.preventDefault();
 *   startTransition('/about');
 * }}>About</a>
 * 
 * // Use in scene component:
 * <SharedHeroScene 
 *   variant={VARIANTS[currentVariant]}
 *   transitionState={transitionState}
 * />
 * 
 * @example
 * // Listen for custom events:
 * window.dispatchEvent(new CustomEvent('startPageTransition', {
 *   detail: { to: '/projects', options: {} }
 * }));
 */
// eslint-disable-next-line react-refresh/only-export-components
export const PageTransitionContext = createContext({
  isTransitioning: false,
  transitionState: 'idle',
  currentVariant: 'home',
  startTransition: () => {},
  cleanBodyState: () => {}
});

// Helper function to clean body state
const cleanBodyState = () => {
  const body = document.body;
  body.classList.remove('page-transitioning');
  body.classList.remove('page-revealing');
  body.style.position = '';
  body.style.top = '';
  body.style.left = '';
  body.style.right = '';
  body.style.bottom = '';
  body.style.overflow = '';
};

export const PageTransitionProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { performanceLevel } = useMediaQuery();
  const [transitionState, setTransitionState] = useState('idle');
  const previousPathRef = useRef(location.pathname);
  const isTransitioningRef = useRef(false);
  const savedScrollRef = useRef(0);
  const cleanupRunRef = useRef(false);

  // Adaptive transition durations based on performance level
  const transitionDurations = useMemo(() => {
    switch (performanceLevel) {
      case 'minimal':
        return { fadeOut: 0, fadeIn: 0 }; // Instant
      case 'reduced':
        return { fadeOut: 0, fadeIn: 0 }; // Instant (no motion)
      case 'low':
        return { fadeOut: 250, fadeIn: 250 }; // Quick fade
      case 'full':
      default:
        return { fadeOut: 350, fadeIn: 450 }; // Smooth fade (slightly longer)
    }
  }, [performanceLevel]);

  // Start transition function
  const startTransition = useCallback((targetPath, options) => {
    if (isTransitioningRef.current || targetPath === location.pathname) return;

    // For minimal/reduced modes, navigate instantly
    if (performanceLevel === 'minimal' || performanceLevel === 'reduced') {
      navigate(targetPath, options || {});
      window.scrollTo(0, 0);
      return;
    }

    isTransitioningRef.current = true;
    savedScrollRef.current = window.scrollY;

    // Fade out current page
    setTransitionState('fadeOut');
    
    // Navigate after fade out completes
    setTimeout(() => {
      window.scrollTo(0, 0);
      navigate(targetPath, options || {});
      
      // Start fading in new page
      setTimeout(() => {
        setTransitionState('fadeIn');
      }, 50); // Small delay to ensure DOM updates
    }, transitionDurations.fadeOut);
  }, [location.pathname, navigate, performanceLevel, transitionDurations]);

  useEffect(() => {
    const handleTransitionStart = (e) => {
      const targetPath = e.detail.to;
      const options = e.detail.options;
      startTransition(targetPath, options);
    };

    window.addEventListener('startPageTransition', handleTransitionStart);
    return () => window.removeEventListener('startPageTransition', handleTransitionStart);
  }, [startTransition]);

  if (!cleanupRunRef.current && !isTransitioningRef.current) {
    cleanBodyState();
    cleanupRunRef.current = true;
  }
  
  useEffect(() => {
    if (!cleanupRunRef.current) {
      cleanBodyState();
      cleanupRunRef.current = true;
    }
  }, []);

  useEffect(() => {
    const body = document.body;

    if (transitionState === 'idle') {
      cleanBodyState();
    } else if (transitionState === 'fadeOut') {
      body.classList.add('page-transitioning');
    } else if (transitionState === 'fadeIn') {
      body.classList.add('page-transitioning');
    }
  }, [transitionState]);

  useEffect(() => {
    if (transitionState === 'fadeIn') {
      const timeout = setTimeout(() => {
        setTransitionState('idle');
        previousPathRef.current = location.pathname;
        isTransitioningRef.current = false;
        cleanBodyState();
      }, transitionDurations.fadeIn);
      
      return () => clearTimeout(timeout);
    }
  }, [transitionState, location.pathname, transitionDurations.fadeIn]);

  const value = useMemo(() => ({
    isTransitioning: isTransitioningRef.current,
    transitionState,
    startTransition,
    cleanBodyState
  }), [transitionState, startTransition]);

  return (
    <PageTransitionContext.Provider value={value}>
      {children}
    </PageTransitionContext.Provider>
  );
};
