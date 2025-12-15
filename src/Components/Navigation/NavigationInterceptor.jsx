import { useEffect } from 'react';

/**
 * NavigationInterceptor - Intercepts internal navigation clicks for smooth transitions
 * 
 * Captures all clicks on internal links (href starting with '/') before they trigger
 * browser navigation, then dispatches a custom event to trigger the page transition
 * animation system. Mounted once at app level.
 * 
 * Features:
 * - Capture phase event listening (intercepts before other handlers)
 * - Targets only internal links (href^='/')
 * - Prevents navigation to same page
 * - Dispatches 'startPageTransition' custom event
 * - Returns null (no visual component)
 * - Auto-cleanup on unmount
 * 
 * Behavior:
 * - Finds closest <a> tag with href starting with '/'
 * - Compares href with current pathname
 * - If different: preventDefault, stopPropagation, dispatch event
 * - If same: does nothing (allows default)
 * 
 * Custom Event:
 * Event name: 'startPageTransition'
 * Event detail: { to: string } - target path
 * 
 * Integration:
 * Works with PageTransitionContext which listens for the custom event
 * and orchestrates the cloud-based transition animation.
 * 
 * @component
 * @example
 * // Mount once at app root:
 * <BrowserRouter>
 *   <NavigationInterceptor />
 *   <Routes>...</Routes>
 * </BrowserRouter>
 * 
 * // All internal links will trigger transitions:
 * <a href="/about">About</a> // Intercepted
 * <a href="https://example.com">External</a> // Not intercepted
 */
const NavigationInterceptor = () => {
  useEffect(() => {
    const handleClick = (e) => {
      const link = e.target.closest('a[href^="/"]');
      
      if (link) {
        const href = link.getAttribute('href');
        const currentPath = window.location.pathname;
        
        if (href !== currentPath) {
          e.preventDefault();
          e.stopPropagation();
          
          // Dispatch custom event to trigger transition
          window.dispatchEvent(new CustomEvent('startPageTransition', { 
            detail: { to: href } 
          }));
        }
      }
    };

    // Capture phase to intercept before other handlers
    window.addEventListener('click', handleClick, true);
    
    return () => window.removeEventListener('click', handleClick, true);
  }, []);

  return null; // This component doesn't render anything
};

export default NavigationInterceptor;
