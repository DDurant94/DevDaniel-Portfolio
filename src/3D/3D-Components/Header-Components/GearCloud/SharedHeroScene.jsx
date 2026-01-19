/**
 * SharedHeroScene - Persistent 3D scene with route-based variants and scroll parallax
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useMediaQuery } from '../../../../Context/MediaQueryContext.hook';
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

// Constant style objects to prevent re-renders
const loadingContainerStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '12px',
  color: 'var(--color-primary)',
  opacity: 0.7,
  zIndex: 10
};

const spinnerStyle = {
  width: '40px',
  height: '40px',
  border: '3px solid transparent',
  borderTopColor: 'var(--color-primary)',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite'
};

const loadingTextStyle = {
  fontSize: '14px',
  fontWeight: 500
};

const fallbackGradientStyle = {
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 50%, #FFE5B4 100%)',
  pointerEvents: 'none'
};

const errorGradientStyle = {
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 50%, #FFE5B4 100%)',
  pointerEvents: 'none'
};

const errorLogoContainerStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  opacity: 0.08,
  pointerEvents: 'none',
  width: '60%',
  maxWidth: '800px'
};

const errorLogoStyle = {
  width: '100%',
  height: 'auto',
  filter: 'grayscale(1)'
};

const errorMessageStyle = {
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
  color: '#2c3e50'
};

const errorCloseButtonStyle = {
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
};

const errorNoticeStyle = {
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  fontWeight: '500',
  color: '#e74c3c',
  marginBottom: '0.5rem'
};

const errorTextStyle = {
  fontSize: '0.95rem',
  lineHeight: '1.5',
  opacity: 0.85
};

const errorReopenButtonStyle = {
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
  fontWeight: '600',
  color: '#e74c3c',
  pointerEvents: 'auto',
  transition: 'all 0.2s ease'
};

/**
 * SharedHeroScene - A persistent 3D scene that smoothly transitions between page variants
 * This component stays mounted and updates its variant based on the current route
 */
export default function SharedHeroScene({ showGear = true, isMobile = false }) {
  const location = useLocation();
  const containerRef = useRef(null);
  const { shouldRender3D, performanceLevel } = useMediaQuery();
  const [currentVariant, setCurrentVariant] = useState(routeToVariant[location.pathname] || 'home');
  const [hasError, setHasError] = useState(false);
  const [isErrorVisible, setIsErrorVisible] = useState(true);
  const [shouldShake, setShouldShake] = useState(false);
  const [isSceneLoaded, setIsSceneLoaded] = useState(false);
  const hasShownLoader = useRef(false);

  const shouldRenderScene = shouldRender3D && performanceLevel !== 'minimal';

  // Track when scene finishes loading - memoized to prevent re-renders
  const handleSceneReady = useCallback(() => {
    setIsSceneLoaded(true);
    hasShownLoader.current = true;
    // Reset position to top when scene loads to prevent wrong scroll position
    if (containerRef.current) {
      containerRef.current.style.transform = 'translateY(0)';
    }
  }, []);

  // Update variant when route changes
  useEffect(() => {
    const isValidRoute = validRoutes.includes(location.pathname);
    const newVariant = isValidRoute ? routeToVariant[location.pathname] : 'notfound';
    setCurrentVariant(newVariant);
  }, [location.pathname]);

  // Move scene up with scroll instead of hiding it - use RAF for smooth updates
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!containerRef.current) {
            ticking = false;
            return;
          }
          
          const scrollY = window.scrollY;
          const startMove = window.innerHeight;
          
          if (scrollY > startMove) {
            const moveAmount = scrollY - startMove;
            containerRef.current.style.transform = `translateY(-${moveAmount}px)`;
          } else {
            containerRef.current.style.transform = 'translateY(0)';
          }
          
          ticking = false;
        });
        
        ticking = true;
      }
    };

    // Initialize position to top on mount, regardless of current scroll
    if (containerRef.current) {
      containerRef.current.style.transform = 'translateY(0)';
    }

    // Use native scroll listener with RAF debouncing
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Don't call handleScroll on mount - let it start at top
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.position = 'fixed';
      containerRef.current.style.top = '0';
      containerRef.current.style.left = '0';
      containerRef.current.style.width = '100%';
      containerRef.current.style.height = '100vh';
      containerRef.current.style.zIndex = '0';
      containerRef.current.style.pointerEvents = 'auto';
      containerRef.current.style.overflow = 'hidden';
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
        <div style={errorGradientStyle}>
          {/* Subtle logo watermark in center */}
          {hasError && (
            <div style={errorLogoContainerStyle}>
              <img 
                src="/src/Assets/SVGS/LogoIconOnly.svg" 
                alt=""
                style={errorLogoStyle}
              />
            </div>
          )}

          {/* Error message - positioned on right side to avoid hero-copy on left */}
          {hasError && isErrorVisible && (
            <div 
              style={{
                ...errorMessageStyle,
                animation: shouldShake ? 'shake 0.5s ease-in-out, fadeIn 0.5s ease-out' : 'fadeIn 0.5s ease-out'
              }}
              className="hero-error-message"
            >
              {/* Close button */}
              <button
                onClick={() => setIsErrorVisible(false)}
                style={errorCloseButtonStyle}
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

              <div style={errorNoticeStyle}>
                Notice
              </div>
              <div style={errorTextStyle}>
                3D experience unavailable. Your device may not support WebGL.
              </div>
            </div>
          )}

          {/* Reopen button - shows when error message is closed */}
          {hasError && !isErrorVisible && (
            <button
              onClick={() => setIsErrorVisible(true)}
              style={{
                ...errorReopenButtonStyle,
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
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
      
      {/* Loading indicator for 3D scene - only show during initial load */}
      {!hasError && shouldRenderScene && !isSceneLoaded && !hasShownLoader.current && (
        <div style={loadingContainerStyle}>
          <div style={spinnerStyle} />
          <span style={loadingTextStyle}>Loading 3D Scene...</span>
        </div>
      )}

      {/* 3D Scene - renders immediately */}
      {!hasError && shouldRenderScene && (
        <GearCloudScene 
          variant={currentVariant} 
          containerRef={containerRef}
          showGear={showGear}
          performanceLevel={performanceLevel}
          onSceneReady={handleSceneReady}
          isMobile={isMobile}
        />
      )}

      {/* Fallback gradient for minimal performance mode */}
      {!hasError && !shouldRenderScene && (
        <div style={fallbackGradientStyle} />
      )}
    </div>
  );
}
