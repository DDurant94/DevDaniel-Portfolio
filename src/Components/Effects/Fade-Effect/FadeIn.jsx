/** FadeInWhenVisible - Scroll-triggered fade-in animation using IntersectionObserver */

import React, { useMemo } from 'react';
import { useIntersection } from '../../../Hooks/Effect-Hooks/useIntersection.jsx';
import './../../../Styles/General-Styles/DesignSystem-Styles/Design-Utility-Styles/EffectsStyles.css';

/**
 * FadeInWhenVisible (DS utility version)
 * Backwards-compatible props; now uses IntersectionObserver + CSS utilities.
 */
/**
 * Props:
 *  - delay: manual seconds delay (fallback if staggerIndex undefined)
 *  - staggerIndex: number -> internal calc(index * var(--motion-stagger-sm)) using semantic stagger token
 *  - once: freeze visible state after first intersection (default true)
 */
const FadeInWhenVisible = ({
  children,
  delay = 0,
  staggerIndex,
  once = true,
  y = 20,
  duration = 0.6,
  className = '',
  as = 'div',
  onVisibleClass = 'is-visible',
  ...rest
}) => {
  // Use more aggressive threshold for very small screens (JioPhone, etc.)
  const threshold = typeof window !== 'undefined' && window.innerHeight < 400 ? 0.01 : 0.1;
  const rootMargin = typeof window !== 'undefined' && window.innerHeight < 400 ? '50px' : '0px';
  
  const { ref, hasIntersected: visible } = useIntersection({ threshold, rootMargin });
  const hasShownRef = React.useRef(false);
  if (visible && once) {
    if (!hasShownRef.current) {
      hasShownRef.current = true;
    }
  }
  // Apply transitionDelay only before the element becomes visible so interactive
  // hover states don't inherit a lingering delay after the initial reveal.
  const computedDelay = useMemo(() => {
    return typeof staggerIndex === 'number'
      ? `calc(${staggerIndex} * var(--motion-stagger-sm))`
      : (delay ? `${delay}s` : undefined);
  }, [staggerIndex, delay]);

  const style = useMemo(() => ({
    '--fx-y': typeof y === 'number' ? `${y}px` : y,
    '--fx-dur': `${duration}s`,
    ...( !visible && computedDelay ? { transitionDelay: computedDelay } : {} ),
  }), [y, duration, visible, computedDelay]);
  
  const shouldShow = once ? (hasShownRef.current || visible) : visible;
  const visibilityClass = shouldShow ? onVisibleClass : '';
  
  const Component = as;
  return (
    <Component
      ref={ref}
      className={`fx-fade ${className} ${visibilityClass}`.trim()}
      data-fx-state={shouldShow ? 'in' : 'out'}
      style={style}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default FadeInWhenVisible;
