import { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

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
const PageTransitionContext = createContext({
  isTransitioning: false,
  transitionState: 'idle',
  currentVariant: 'home',
  startTransition: () => {},
  cleanBodyState: () => {}
});

export const usePageTransition = () => useContext(PageTransitionContext);

// Map routes to scene variants
const routeToVariant = {
  '/': 'home',
  '/about': 'about',
  '/projects': 'portfolio',
  '/skills': 'skills',
  '/contact': 'home',
};

// Helper function to clean body state
const cleanBodyState = () => {
  const body = document.body;
  body.classList.remove('page-transitioning');
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
  
  const [transitionState, setTransitionState] = useState('idle'); // 'idle', 'covering', 'covered', 'revealing'
  const [currentVariant, setCurrentVariant] = useState('home');
  const [showLoadingUI, setShowLoadingUI] = useState(false);
  
  const previousPathRef = useRef(location.pathname);
  const loadingTimeoutRef = useRef(null);
  const coveringCompleteRef = useRef(false);
  const isTransitioningRef = useRef(false);
  const pendingPathRef = useRef(null);
  const pendingOptionsRef = useRef(null);
  const savedScrollRef = useRef(0);
  const cleanupRunRef = useRef(false);

  // Start transition function
  const startTransition = useCallback((targetPath, options) => {
    if (isTransitioningRef.current || targetPath === location.pathname) return;

    // Store the target path and options
    pendingPathRef.current = targetPath;
    pendingOptionsRef.current = options || null;
    isTransitioningRef.current = true;

    // Clear any existing loading timeout
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }

    // Save current scroll position
    savedScrollRef.current = window.scrollY;

    // Get the variant for the page we're leaving
    const leavingVariant = routeToVariant[previousPathRef.current] || 'home';
    setCurrentVariant(leavingVariant);

    coveringCompleteRef.current = false;

    // Start transition - clouds slide in
    setTransitionState('covering');
    setShowLoadingUI(false);

    // Show loading UI only if transition takes too long (15+ seconds)
    loadingTimeoutRef.current = setTimeout(() => {
      if (isTransitioningRef.current) {
        setShowLoadingUI(true);
      }
    }, 15000);

    // After clouds mostly cover (1000ms), navigate to new page
    setTimeout(() => {
      if (pendingPathRef.current) {
        navigate(pendingPathRef.current, pendingOptionsRef.current || {});
        pendingPathRef.current = null;
        pendingOptionsRef.current = null;
      }
    }, 1000);

    // After slide-in animation completes (1.4s), mark covering as complete and start revealing
    setTimeout(() => {
      coveringCompleteRef.current = true;
      setTransitionState('covered');
      
      // Brief pause to let new page render at top, then reveal
      setTimeout(() => {
        setTransitionState('revealing');
      }, 200);
    }, 1400);
  }, [location.pathname, navigate]);

  // Listen for navigation requests from intercepted clicks
  useEffect(() => {
    const handleTransitionStart = (e) => {
      const targetPath = e.detail.to;
      const options = e.detail.options;
      startTransition(targetPath, options);
    };

    window.addEventListener('startPageTransition', handleTransitionStart);
    return () => window.removeEventListener('startPageTransition', handleTransitionStart);
  }, [startTransition]);

  // Ensure clean state on mount
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

  // Manage page visibility based on transition state
  useEffect(() => {
    const body = document.body;

    if (transitionState === 'idle') {
      cleanBodyState();
    } else if (transitionState === 'covering') {
      body.style.top = `-${savedScrollRef.current}px`;
      body.classList.remove('page-transitioning');
    } else if (transitionState === 'covered') {
      body.classList.add('page-transitioning');
      body.style.top = '0px';
    } else if (transitionState === 'revealing') {
      setTimeout(() => {
        body.classList.remove('page-transitioning');
        body.style.top = '';
      }, 100);
    }
  }, [transitionState]);

  // Handle transition state changes
  useEffect(() => {
    if (transitionState === 'revealing') {
      const timeout = setTimeout(() => {
        setTransitionState('idle');
        setShowLoadingUI(false);
        previousPathRef.current = location.pathname;
        isTransitioningRef.current = false;
        
        cleanBodyState();
        
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
      }, 1200);
      
      return () => clearTimeout(timeout);
    }
  }, [transitionState, location.pathname]);

  const value = useMemo(() => ({
    isTransitioning: isTransitioningRef.current,
    transitionState,
    currentVariant,
    showLoadingUI,
    startTransition,
    cleanBodyState
  }), [transitionState, currentVariant, showLoadingUI, startTransition]);

  return (
    <PageTransitionContext.Provider value={value}>
      {children}
    </PageTransitionContext.Provider>
  );
};
