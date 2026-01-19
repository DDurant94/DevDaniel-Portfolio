import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** ScrollToTop - Automatically scrolls to top on route navigation */
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