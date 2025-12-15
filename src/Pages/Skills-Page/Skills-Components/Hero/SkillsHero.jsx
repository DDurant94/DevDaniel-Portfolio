/**
 * Skills Hero Component
 * 
 * @description Hero section for skills page with scroll-based fade effect.
 * Displays page title and subtitle, fading out as user scrolls.
 * 
 * Features:
 * - Scroll-triggered opacity fade (fades within first 50vh)
 * - Skills page introduction
 * - Optimized scroll performance
 * - Consistent hero pattern with other pages
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
 * <SkillsHero />
 * ```
 */

import { useEffect, useRef } from 'react';
import { useScroll } from '../../../../Context/Scroll-Context/ScrollContext';
import '../../../../Styles/General-Styles/3D-Styles/3DHero-Styles/HeroStyles.css';

export default function SkillsHero() {
  const heroRef = useRef(null);
  const { scrollY } = useScroll();

  useEffect(() => {
    // Fade out hero text as user scrolls
    const heroEl = heroRef.current;
    if (!heroEl) return;
    
    const heroCopy = heroEl.querySelector('.hero-copy');
    if (!heroCopy) return;
    
    const maxScroll = window.innerHeight * 0.5;
    const opacity = Math.max(0, 1 - (scrollY / maxScroll));
    
    heroCopy.style.opacity = opacity;
  }, [scrollY]);

  return (
    <header id="skills-hero" className="hero-section" ref={heroRef}>
      <div className="hero-copy hero-copy-visible">
        <h1>My Skills</h1>
        <p>Core technologies and tools I use to craft immersive, scalable solutions.</p>
      </div>
    </header>
  );
}
