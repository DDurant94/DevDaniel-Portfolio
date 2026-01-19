import { useState, useEffect } from 'react';
import { useMediaQuery } from '../../../Context/MediaQueryContext.hook';
import './../../../Styles/Component-Styles/Background-Styles/CodedBackground-Styles/CodedBackgroundStyles.css';

/** CodedBackground - Developer-themed background with code editor aesthetic and subtle parallax effects */
const CodedBackground = () => {
  const { isMobile, isTablet, prefersReducedMotion } = useMediaQuery();
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
