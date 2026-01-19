/**
 * Pauses CSS animations during scroll for performance
 * Adds data-scrolling attribute to body during scroll events
 */
let isSetup = false;
let scrollTimeout = null;

export function setupScrollPauseAnimations() {
  if (isSetup) return; // Prevent duplicate listeners
  
  const handleScroll = () => {
    // Mark body as scrolling
    document.body.setAttribute('data-scrolling', 'true');
    
    // Clear existing timeout
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    
    // Resume animations 150ms after scroll stops
    scrollTimeout = setTimeout(() => {
      document.body.setAttribute('data-scrolling', 'false');
    }, 150);
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  isSetup = true;
  
  // Cleanup function
  return () => {
    window.removeEventListener('scroll', handleScroll);
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    isSetup = false;
  };
}
