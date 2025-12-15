/**
 * Home Hero Component
 * 
 * @description Hero section for the home page with scroll-based fade effect.
 * Displays main value proposition and fades out as user scrolls down.
 * 
 * Features:
 * - Scroll-triggered opacity fade (fades within first 50vh)
 * - Professional tagline and introduction
 * - Optimized scroll performance
 * - Responsive typography
 * 
 * Scroll Behavior:
 * - Opacity starts at 1.0 (fully visible)
 * - Fades to 0.0 within first 50% of viewport height scrolled
 * - Uses linear interpolation: opacity = max(0, 1 - (scrollY / maxScroll))
 * 
 * @component
 * @requires ScrollContext - Global scroll position tracking
 * 
 * @example
 * ```jsx
 * <Hero />
 * ```
 */

import { useEffect, useRef } from 'react';
import { useScroll } from '../../../../Context/Scroll-Context/ScrollContext';
import '../../../../Styles/General-Styles/3D-Styles/3DHero-Styles/HeroStyles.css';

const Hero = () => {
  const heroRef = useRef(null);
  const { scrollY } = useScroll();

  useEffect(() => {
    // Fade out hero text as user scrolls
    const heroEl = heroRef.current;
    if (!heroEl) return;
    
    const heroCopy = heroEl.querySelector('.hero-copy');
    if (!heroCopy) return;
    
    const maxScroll = window.innerHeight * 0.5; // Fade out within first 50vh of scroll
    const opacity = Math.max(0, 1 - (scrollY / maxScroll));
    
    heroCopy.style.opacity = opacity;
  }, [scrollY]);

  return (
  <header id="home-hero" className="hero-section" ref={heroRef}>
      <div className="hero-copy hero-copy-visible">
        <h1>Engineering Intelligent Web Platforms</h1>
        <p>Hello, my name is Daniel Durant. I architect scalable backends and craft immersive interfaces.</p>
      </div>
    </header>
  );
};

export default Hero;
