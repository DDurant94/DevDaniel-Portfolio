import { useEffect, useRef } from 'react';
import { useScroll } from '../../../Context/Scroll-Context/useScroll';

/** parseColorToRgbTriplet - Converts color formats to R,G,B string */
function parseColorToRgbTriplet(input) {
  if (!input) return null;
  let s = String(input).trim();
  if (s.startsWith('#')) {
    const hex = s.slice(1);
    const full = hex.length === 3
      ? hex.split('').map(c => c + c).join('')
      : hex.padEnd(6, '0').slice(0, 6);
    const r = parseInt(full.slice(0, 2), 16);
    const g = parseInt(full.slice(2, 4), 16);
    const b = parseInt(full.slice(4, 6), 16);
    return `${r},${g},${b}`;
  }
  const m = s.match(/rgba?\(([^)]+)\)/i);
  if (m) {
    const parts = m[1].split(',').map(p => p.trim());
    if (parts.length >= 3) {
      return `${parseFloat(parts[0])},${parseFloat(parts[1])},${parseFloat(parts[2])}`;
    }
  }
  // If already in r,g,b form
  if (/^\s*\d+\s*,\s*\d+\s*,\s*\d+\s*$/.test(s)) return s.replace(/\s+/g, '');
  return null;
}

/** CloudZoomTransition - Scroll-based cloud zoom effect with content fade reveal */
export default function CloudZoomTransition({ targetSelector, height = '100vh', width = '100%', tint }) {
  const ref = useRef(null);
  const { scrollY } = useScroll();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const target = targetSelector ? document.querySelector(targetSelector) : null;

    const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    const mq = typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)') : { matches: false };

    const rect = el.getBoundingClientRect();
    const h = window.innerHeight || 1;
    // 0 when this block is entirely below the fold; 1 when its top reaches viewport top
    const raw = (h - rect.top) / h;
    const progress = clamp(raw, 0, 1);

    // Compute overlay scale and opacity for "into clouds then reveal" feel
    const isMobile = mq.matches;
    const scaleMax = isMobile ? 0.6 : 1.4; // desktop stronger zoom, mobile subtler
    const peak = 1.0;                       // full opacity
    const scale = 1 + progress * scaleMax;
    const peakPoint = 0.75;               // where the cloud opacity is strongest
    const opacity = progress < peakPoint
      ? peak  // Stay at full opacity until peakPoint
      : clamp((1 - (progress - peakPoint) / (1 - peakPoint)) * peak, 0, peak);

    el.style.setProperty('--cz-scale', String(scale));
    el.style.setProperty('--cz-opacity', String(opacity));
    // Apply tint override if provided
    const tintTriplet = parseColorToRgbTriplet(tint);
    if (tintTriplet) {
      el.style.setProperty('--cloud-tint-rgb', tintTriplet);
    }

    if (target) {
      // Start content fade a bit later to feel like emerging from clouds
      const start = isMobile ? 0.35 : 0.3;
      const delayed = clamp((progress - start) / (1 - start), 0, 1);
      const p = easeOutCubic(delayed);
      target.style.opacity = String(p);
      target.style.transform = `translateY(${(1 - p) * 12}px)`;
      // Add a slight blur that eases out with the fade for depth
      const blurMax = isMobile ? 3 : 6;
      const blur = (1 - p) * blurMax;
      target.style.filter = blur > 0.1 ? `blur(${blur.toFixed(2)}px)` : '';
      target.style.willChange = 'opacity, transform, filter';
    }
  }, [scrollY, targetSelector, tint]);

  // Cleanup effect
  useEffect(() => {
    const target = targetSelector ? document.querySelector(targetSelector) : null;

    return () => {
      if (target) {
        target.style.opacity = '';
        target.style.transform = '';
        target.style.filter = '';
        target.style.willChange = '';
      }
    };
  }, [targetSelector]);

  return <div ref={ref} className="cloud-zoom-transition" style={{ height, width }} aria-hidden="true" />;
}
