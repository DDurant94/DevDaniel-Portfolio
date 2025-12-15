/**
 * usePageTransition Hook
 * 
 * @description Provides navigation function with page transition animations. Triggers custom
 * 'startPageTransition' event before navigation to allow transition components to animate out.
 * Use this instead of useNavigate() when you want smooth transitions between pages.
 * 
 * How it works:
 * 1. Call navigateWithTransition(path)
 * 2. Hook dispatches 'startPageTransition' custom event
 * 3. PageTransition component listens for event and animates out
 * 4. After animation, PageTransition navigates to new route
 * 5. New page animates in
 * 
 * @hook
 * @returns {Function} navigateWithTransition - Navigation function with transition support
 * 
 * @example
 * ```jsx
 * const navigateWithTransition = usePageTransition();
 * 
 * // Simple navigation
 * navigateWithTransition('/about');
 * 
 * // With state
 * navigateWithTransition('/projects', { 
 *   state: { projectId: 123 } 
 * });
 * 
 * // In button click
 * <button onClick={() => navigateWithTransition('/contact')}>
 *   Contact Me
 * </button>
 * ```
 */

import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Custom hook that provides a navigate function with page transition support.
 * Use this instead of useNavigate() directly when you want transitions on programmatic navigation.
 * 
 * @returns {Function} navigateWithTransition - A function that triggers page transition before navigating
 * 
 * @example
 * const navigateWithTransition = usePageTransition();
 * navigateWithTransition('/about');
 * navigateWithTransition('/projects', { state: { projectTitle: 'My Project' } });
 */
export const usePageTransition = () => {
  const location = useLocation();

  const navigateWithTransition = (to, options = {}) => {
    // Don't trigger transition if navigating to current page
    if (to === location.pathname) return;

    // Dispatch the transition event
    window.dispatchEvent(new CustomEvent('startPageTransition', { 
      detail: { 
        to,
        options // Pass through any navigation options (state, replace, etc.)
      } 
    }));
  };

  return navigateWithTransition;
};

export default usePageTransition;
