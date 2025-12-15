import { useState, useEffect } from 'react';
import { useMediaQuery } from '../../../Context/MediaQueryContext';
import './../../../Styles/Component-Styles/Background-Styles/CodedBackground-Styles/CodedBackgroundStyles.css';

/**
 * CodedBackground Component
 * 
 * @description Developer-themed background with code editor aesthetic and subtle parallax effects.
 * Creates immersive coding atmosphere with grid patterns, scan lines, and corner decorations.
 * 
 * Features:
 * - Code editor grid pattern with dynamic sizing
 * - Mouse parallax effect (desktop only)
 * - Terminal-style scan lines animation
 * - Corner decorative comments ("Portfolio", "DevDaniel.tech")
 * - Responsive grid density (30px mobile, 25px tablet, 20px desktop)
 * - Accessibility: Respects prefers-reduced-motion
 * - Performance: Disables parallax on mobile
 * 
 * Grid Sizing:
 * - Mobile: 30px grid (lower density for performance)
 * - Tablet: 25px grid
 * - Desktop: 20px grid (highest density)
 * 
 * Parallax Behavior:
 * - Normalized coordinates: -1 to 1 on both axes
 * - Mouse position drives CSS custom properties
 * - Disabled on mobile and reduced motion preference
 * - Subtle movement for depth perception
 * 
 * CSS Custom Properties:
 * - --grid-size: Pixel size of grid cells
 * - --animation-state: 'running' or 'paused'
 * - --mouse-x: Normalized mouse X position (-1 to 1)
 * - --mouse-y: Normalized mouse Y position (-1 to 1)
 * 
 * @component
 * @requires MediaQueryContext - Screen size and accessibility preferences
 * 
 * @example
 * ```jsx
 * <CodedBackground />
 * // Renders full-viewport background with grid, scan lines, and parallax
 * ```
 */
const CodedBackground = () => {
  const { isMobile, isTablet, isDesktop, prefersReducedMotion } = useMediaQuery();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Adjust pattern density based on screen size
  const gridSize = isMobile ? 30 : isTablet ? 25 : 20;
  
  // Disable animations if user prefers reduced motion
  const shouldAnimate = !prefersReducedMotion;

  useEffect(() => {
    if (prefersReducedMotion || isMobile) return;

    const handleMouseMove = (e) => {
      // Subtle parallax - normalized to -1 to 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReducedMotion, isMobile]);

  return (
    <div 
      className="coded-background"
      style={{
        '--grid-size': `${gridSize}px`,
        '--animation-state': shouldAnimate ? 'running' : 'paused',
        '--mouse-x': mousePosition.x,
        '--mouse-y': mousePosition.y
      }}
    >
      {/* Editor Grid Pattern */}
      <div className="code-grid" />
      
      {/* Subtle scan lines (terminal effect) */}
      <div className="scan-lines" />
      
      {/* Corner decorative elements */}
      <div className="corner-accent corner-top-left">
        <span className="code-comment">{'/* Portfolio */'}</span>
      </div>
      
      <div className="corner-accent corner-bottom-right">
        <span className="code-comment">{'DevDaniel.tech'}</span>
        <span className="code-comment">{'Code in the clouds, delivered to earth'}</span>
      </div>
    </div>
  );
};

export default CodedBackground;
