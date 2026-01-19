/**
 * Home Hero - Hero section with scroll-based fade effect
 */

import { useEffect, useRef } from 'react';
import { useScroll } from '../../../../Context/Scroll-Context/useScroll';
import '../../../../Styles/General-Styles/3D-Styles/3DHero-Styles/HeroStyles.css';

const Hero = () => {
  const heroRef = useRef(null);
  const { scrollY } = useScroll();

  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;
    
    const heroCopy = heroEl.querySelector('.hero-copy');
    if (!heroCopy) return;
    
    const maxScroll = window.innerHeight * 0.5;
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
