import { useEffect } from 'react';

/** NavigationInterceptor - Intercepts internal navigation clicks for smooth page transitions */
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
