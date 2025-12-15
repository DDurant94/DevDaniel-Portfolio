/**
 * MediaQueryContext Usage Examples
 * 
 * @description Comprehensive examples demonstrating responsive patterns with MediaQueryContext.
 * Shows real-world usage patterns for breakpoints, device detection, and accessibility.
 * 
 * **THIS IS A REFERENCE FILE - Not imported/executed in production**
 * 
 * Topics Covered:
 * 1. Conditional rendering based on device type
 * 2. Adjusting component props per breakpoint
 * 3. Background patterns with responsive density
 * 4. Touch vs mouse interaction handling
 * 5. Orientation-specific layouts
 * 6. Granular breakpoint control (XS/SM/MD/LG/XL)
 * 7. Combining multiple media queries
 * 8. Decorative elements with performance considerations
 * 
 * Common Patterns:
 * - Dense grid on desktop, sparse on mobile (performance)
 * - Disable animations on mobile or reduced motion preference
 * - Hide decorative elements on small screens
 * - Single/two/three column layouts by breakpoint
 * 
 * @module MediaQueryContext.examples
 * @see {@link Context/MediaQueryContext.jsx} for provider implementation
 * 
 * @example
 * ```js
 * // Copy patterns from this file into your components
 * import { useMediaQuery } from '../Context/MediaQueryContext';
 * 
 * function MyComponent() {
 *   const { isMobile, prefersReducedMotion } = useMediaQuery();
 *   // Use the pattern that fits your needs
 * }
 * ```
 */

/**
 * MediaQueryContext Usage Examples
 * 
 * This file demonstrates how to use the MediaQueryContext
 * throughout your application for responsive behavior.
 */

import { useMediaQuery } from '../Context/MediaQueryContext';

// ===================================================================
// EXAMPLE 1: Conditional Rendering Based on Device
// ===================================================================

/**
 * Example: Conditional rendering based on device type
 * Shows different navigation components for mobile vs desktop
 */
function ResponsiveNav() {
  const { isMobile, isDesktop } = useMediaQuery();
  
  return (
    <>
      {isMobile && <MobileNavigation />}
      {isDesktop && <DesktopSidebar />}
    </>
  );
}

// ===================================================================
// EXAMPLE 2: Adjust Component Props Based on Breakpoint
// ===================================================================

function ResponsiveGrid() {
  const { isMobile, isTablet, isDesktop } = useMediaQuery();
  
  const columns = isMobile ? 1 : isTablet ? 2 : 3;
  const gap = isMobile ? 'var(--space-2)' : 'var(--space-4)';
  
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: gap
    }}>
      {/* Grid items */}
    </div>
  );
}

// ===================================================================
// EXAMPLE 3: Background Patterns (For Our Coding Theme!)
// ===================================================================

function CodedBackground() {
  const { isMobile, isTablet, prefersReducedMotion } = useMediaQuery();
  
  // Adjust pattern density based on screen size
  const gridSize = isMobile ? 30 : isTablet ? 25 : 20;
  
  // Disable animations if user prefers reduced motion
  const shouldAnimate = !prefersReducedMotion;
  
  return (
    <div 
      className="coded-background"
      style={{
        '--grid-size': `${gridSize}px`,
        '--animation-duration': shouldAnimate ? '20s' : '0s'
      }}
    >
      {/* Background content */}
    </div>
  );
}

// ===================================================================
// EXAMPLE 4: Touch vs Mouse Interactions
// ===================================================================

function InteractiveCard() {
  const { isTouchDevice } = useMediaQuery();
  
  return (
    <div className={`card ${isTouchDevice ? 'touch' : 'mouse'}`}>
      {/* Card content */}
      {/* CSS can handle :hover differently for .touch vs .mouse */}
    </div>
  );
}

// ===================================================================
// EXAMPLE 5: Orientation-Specific Layouts
// ===================================================================

function MediaViewer() {
  const { isPortrait, isLandscape } = useMediaQuery();
  
  return (
    <div className={isPortrait ? 'vertical-layout' : 'horizontal-layout'}>
      {/* Content adapts to orientation */}
    </div>
  );
}

// ===================================================================
// EXAMPLE 6: Granular Breakpoint Control
// ===================================================================

function HeroSection() {
  const { isXSmall, isSmall, isMedium, isLarge, isXLarge } = useMediaQuery();
  
  const fontSize = isXSmall ? '2rem' 
    : isSmall ? '2.5rem'
    : isMedium ? '3rem'
    : isLarge ? '3.5rem'
    : '4rem'; // isXLarge
  
  return (
    <h1 style={{ fontSize }}>
      Responsive Hero Text
    </h1>
  );
}

// ===================================================================
// EXAMPLE 7: Combining Multiple Queries
// ===================================================================

function SmartComponent() {
  const { 
    isMobile, 
    isTouchDevice, 
    prefersReducedMotion,
    width 
  } = useMediaQuery();
  
  const showComplexAnimation = !isMobile && !prefersReducedMotion;
  const enableSwipeGestures = isTouchDevice;
  const isNarrow = width < 400;
  
  return (
    <div>
      {showComplexAnimation && <FancyAnimation />}
      {enableSwipeGestures && <SwipeHandler />}
      {isNarrow && <CompactLayout />}
    </div>
  );
}

// ===================================================================
// EXAMPLE 8: For Background Decorative Elements
// ===================================================================

function DecorativeCodeSymbols() {
  const { isMobile, isDesktop, prefersReducedMotion } = useMediaQuery();
  
  // Only show on desktop, respect motion preferences
  if (!isDesktop) return null;
  
  const floatDuration = prefersReducedMotion ? '0s' : '15s';
  
  return (
    <div className="floating-symbols" style={{ animationDuration: floatDuration }}>
      <span className="symbol">{'<>'}</span>
      <span className="symbol">{'{ }'}</span>
      <span className="symbol">{'[ ]'}</span>
    </div>
  );
}

// ===================================================================
// COMMON PATTERNS FOR YOUR PROJECT
// ===================================================================

/*
1. CODING BACKGROUND PATTERNS:
   - Dense grid on desktop, sparse on mobile
   - Disable floating animations on mobile for performance
   - Hide decorative code snippets on small screens

2. SECTION LAYOUTS:
   - Single column on mobile
   - Two columns on tablet
   - Three columns on desktop

3. PERFORMANCE:
   - Load lighter backgrounds on mobile
   - Reduce animation complexity on touch devices
   - Respect prefers-reduced-motion for accessibility

4. DECORATIVE ELEMENTS:
   - Floating code symbols: desktop only
   - Terminal prompts: all sizes (adjust font)
   - Grid patterns: adjust density by breakpoint
*/

export {
  ResponsiveNav,
  ResponsiveGrid,
  CodedBackground,
  InteractiveCard,
  MediaViewer,
  HeroSection,
  SmartComponent,
  DecorativeCodeSymbols,
};
