/**
 * FadeInWhenVisible Component
 * 
 * @description Scroll-triggered fade-in animation using IntersectionObserver and CSS utilities.
 * Animates elements into view when they enter the viewport. Optimized for performance
 * using CSS transitions instead of JavaScript animations.
 * 
 * Features:
 * - IntersectionObserver-based visibility detection
 * - Configurable stagger delay for sequential animations
 * - Y-axis translation on entrance
 * - Once mode (animate only on first view)
 * - Customizable duration and timing
 * - CSS-based animations (GPU accelerated)
 * - Removes transition delay after animation for hover states
 * 
 * Animation Flow:
 * 1. Element starts with opacity: 0 and translateY
 * 2. IntersectionObserver detects viewport entry
 * 3. Adds 'is-visible' class triggering CSS transition
 * 4. Removes transitionDelay after animation completes
 * 
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to animate
 * @param {number} [props.delay=0] - Manual delay in seconds (fallback if no staggerIndex)
 * @param {number} [props.staggerIndex] - Index for auto-calculated stagger delay
 * @param {boolean} [props.once=true] - Animate only once (freeze after first view)
 * @param {number|string} [props.y=20] - Y-axis translation distance (px or CSS value)
 * @param {number} [props.duration=0.6] - Animation duration in seconds
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {string} [props.as='div'] - HTML tag or component to render
 * @param {string} [props.onVisibleClass='is-visible'] - Class added when visible
 * 
 * @example
 * ```jsx
 * // Simple fade in
 * <FadeInWhenVisible>
 *   <h1>Welcome</h1>
 * </FadeInWhenVisible>
 * 
 * // Staggered list animation
 * {items.map((item, idx) => (
 *   <FadeInWhenVisible key={item.id} staggerIndex={idx} y={30}>
 *     <Card>{item.content}</Card>
 *   </FadeInWhenVisible>
 * ))}
 * 
 * // Custom element with repeat animations
 * <FadeInWhenVisible as="section" once={false} duration={0.8}>
 *   <Content />
 * </FadeInWhenVisible>
 * ```
 */

import React, { useMemo } from 'react';
import { useEffectVisibility } from '../../../Hooks/Effect-Hooks/useEffectVisibility.jsx';
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
  as: Tag = 'div',
  onVisibleClass = 'is-visible', // new: class appended when visible
  variants, // ignored now but accepted to avoid breaking callers
  custom,   // ignored
  ...rest
}) => {
  const { ref, visible } = useEffectVisibility();
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
  return (
    <Tag
      ref={ref}
      className={`fx-fade ${className} ${visibilityClass}`.trim()}
  data-fx-state={shouldShow ? 'in' : 'out'}
      style={style}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default FadeInWhenVisible;
