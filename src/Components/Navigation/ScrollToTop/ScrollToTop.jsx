import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop - Automatic scroll to top on route navigation
 * 
 * Scrolls the window to the top when the route changes. Works in coordination
 * with page transitions - scrolling happens during the transition animation
 * when the screen is covered, creating a seamless experience.
 * 
 * Features:
 * - Listens to pathname changes (React Router)
 * - Fallback scroll for direct navigation without transitions
 * - Respects page-transitioning state (doesn't scroll if transition handles it)
 * - No visual component (returns null)
 * 
 * Integration:
 * Place inside Router, typically near Routes. Works with usePageTransition hook.
 * 
 * @component
 * @example
 * <Router>
 *   <ScrollToTop />
 *   <Routes>
 *     <Route path="/" element={<Home />} />
 *   </Routes>
 * </Router>
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll happens during page transition now (while screen is covered)
    // This is just a fallback for direct navigation without transitions
    const isTransitioning = document.body.classList.contains('page-transitioning');
    if (!isTransitioning) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;