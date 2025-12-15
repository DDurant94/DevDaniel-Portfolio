/**
 * SharedHeroScene Component
 * 
 * @description Persistent 3D hero scene that transitions smoothly between pages without remounting.
 * Manages scene variants based on current route and provides scroll-based parallax movement.
 * 
 * Features:
 * - Route-based scene variants (home, about, projects, skills, notfound)
 * - Smooth variant transitions without unmounting Canvas
 * - Scroll-based vertical translation (moves up with page scroll)
 * - Error boundary with shake animation
 * - Lazy scene initialization for performance
 * - Maintains 3D context across page transitions
 * 
 * Scene Variants:
 * - 'home': Default landing scene
 * - 'about': About page variant with adjusted camera/elements
 * - 'projects': Portfolio showcase variant
 * - 'skills': Technical skills variant
 * - 'notfound': 404 error state
 * 
 * Scroll Behavior:
 * - Scene stays fixed until user scrolls past viewport height
 * - Then translates upward with scroll to reveal content below
 * - Uses direct DOM manipulation for smooth 60fps performance
 * 
 * @component
 * @param {Object} props
 * @param {boolean} [props.showGear=true] - Whether to show animated gear models
 * 
 * @example
 * ```jsx
 * <SharedHeroScene showGear={true} />
 * ```
 */

import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import GearCloudScene from './GearCloudScene.jsx';
import '../../../../Styles/General-Styles/3D-Styles/3DHero-Styles/HeroStyles.css';

/** Maps route paths to scene variant names */
const routeToVariant = {
  '/': 'home',
  '/about': 'about',
  '/projects': 'projects',
  '/skills': 'skills',
};

// Valid routes for 404 detection
const validRoutes = ['/', '/about', '/projects', '/skills'];

/**
 * SharedHeroScene - A persistent 3D scene that smoothly transitions between page variants
 * This component stays mounted and updates its variant based on the current route
 */
export default function SharedHeroScene({ showGear = true }) {
  const location = useLocation();
  const containerRef = useRef(null);
  const [currentVariant, setCurrentVariant] = useState(routeToVariant[location.pathname] || 'home');
  const [hasError, setHasError] = useState(false);
  const [isErrorVisible, setIsErrorVisible] = useState(true);
  const [shouldShake, setShouldShake] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);

  // Update variant when route changes
  useEffect(() => {
    const isValidRoute = validRoutes.includes(location.pathname);
    const newVariant = isValidRoute ? routeToVariant[location.pathname] : 'notfound';
    setCurrentVariant(newVariant);
  }, [location.pathname]);

  // Allow scene animations to start after brief mount delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setSceneReady(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Move scene up with scroll instead of hiding it - use direct DOM manipulation for smoothness
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const scrollY = window.scrollY;
      const startMove = window.innerHeight;
      
      if (scrollY > startMove) {
        const moveAmount = scrollY - startMove;
        containerRef.current.style.transform = `translateY(-${moveAmount}px)`;
      } else {
        containerRef.current.style.transform = 'translateY(0)';
      }
    };

    // Use native scroll listener for smoother 3D scene movement
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Ensure the container is positioned correctly
    if (containerRef.current) {
      containerRef.current.style.position = 'fixed';
      containerRef.current.style.top = '0';
      containerRef.current.style.left = '0';
      containerRef.current.style.width = '100%';
      containerRef.current.style.height = '100vh';
      containerRef.current.style.zIndex = '0';
      // Allow pointer events so mouse interaction works with parallax
      containerRef.current.style.pointerEvents = 'auto';
    }
  }, []);

  // Error boundary handler
  useEffect(() => {
    const handleError = (event) => {
      if (event.message?.includes('WebGL') || event.message?.includes('GLTFLoader')) {
        setHasError(true);
      }
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // Shake animation every 4 seconds when there's an error
  useEffect(() => {
    if (!hasError) return;
    
    const shakeInterval = setInterval(() => {
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 500);
    }, 4000);
    
    return () => clearInterval(shakeInterval);
  }, [hasError]);

  return (
    <div ref={containerRef} className="shared-hero-canvas-wrapper">
      {/* Fallback gradient background for errors */}
      {hasError && (
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 50%, #FFE5B4 100%)',
            pointerEvents: 'none'
          }}
        >
          {/* Subtle logo watermark in center */}
          {hasError && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                opacity: 0.08,
                pointerEvents: 'none',
                width: '60%',
                maxWidth: '800px'
              }}
            >
              <img 
                src="/src/Assets/SVGS/LogoIconOnly.svg" 
                alt=""
                style={{ width: '100%', height: 'auto', filter: 'grayscale(1)' }}
              />
            </div>
          )}

          {/* Error message - positioned on right side to avoid hero-copy on left */}
          {hasError && isErrorVisible && (
            <div 
              style={{
                position: 'absolute',
                top: '50%',
                right: '5%',
                transform: 'translateY(-50%)',
                maxWidth: '280px',
                padding: '1.25rem 1.5rem',
                background: 'rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                color: '#2c3e50',
                animation: shouldShake ? 'shake 0.5s ease-in-out, fadeIn 0.5s ease-out' : 'fadeIn 0.5s ease-out'
              }}
              className="hero-error-message"
            >
              {/* Close button */}
              <button
                onClick={() => setIsErrorVisible(false)}
                style={{
                  position: 'absolute',
                  top: '0.75rem',
                  right: '0.75rem',
                  width: '24px',
                  height: '24px',
                  border: 'none',
                  background: 'rgba(0, 0, 0, 0.05)',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  color: '#666',
                  transition: 'all 0.2s ease',
                  pointerEvents: 'auto'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                ×
              </button>

              <div style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontWeight: '500',
                color: '#e74c3c',
                marginBottom: '0.5rem'
              }}>
                Notice
              </div>
              <div style={{
                fontSize: '0.95rem',
                lineHeight: '1.5',
                opacity: 0.85
              }}>
                3D experience unavailable. Your device may not support WebGL.
              </div>
            </div>
          )}

          {/* Reopen button - shows when error message is closed */}
          {hasError && !isErrorVisible && (
            <button
              onClick={() => setIsErrorVisible(true)}
              style={{
                position: 'absolute',
                top: '50%',
                right: '5%',
                transform: 'translateY(-50%)',
                width: '48px',
                height: '48px',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                background: 'rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(20px)',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                color: '#e74c3c',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                pointerEvents: 'auto',
                animation: shouldShake ? 'shake 0.5s ease-in-out, fadeIn 0.3s ease-out' : 'fadeIn 0.3s ease-out'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                e.currentTarget.style.boxShadow = '0 6px 24px rgba(0, 0, 0, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.08)';
              }}
              title="Show error details"
            >
              !
            </button>
          )}
        </div>
      )}
      
      {/* 3D Scene */}
      {!hasError && (
        <GearCloudScene 
          variant={currentVariant} 
          containerRef={containerRef}
          sceneReady={sceneReady}
          showGear={showGear}
        />
      )}
    </div>
  );
}
