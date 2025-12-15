import React from 'react';
import { useInOutVisibility } from '../../../Hooks/Effect-Hooks/useInOutVisibility.jsx';
import './../../../Styles/General-Styles/DesignSystem-Styles/Design-Utility-Styles/EffectsStyles.css';

/**
 * FadeInOutWhenVisible - Bidirectional Viewport Reveal Effect
 * 
 * @component
 * @description Wrapper component that fades and translates children when entering/exiting viewport.
 * Uses Intersection Observer to trigger bidirectional animations with customizable timing and offsets.
 * 
 * Features:
 * - Bidirectional animation (fades in when visible, reverses when scrolled out)
 * - Customizable vertical offset and scale transforms
 * - Independent opacity and transform durations
 * - Stagger support via index or direct delay
 * - Once mode for single-fire animations
 * - Polymorphic component (customizable tag)
 * - CSS custom properties for animation control
 * 
 * Animation Behavior:
 * - Initial state: opacity 0, translateY(y), scale(scaleFrom)
 * - In view: opacity 1, translateY(0), scale(1)
 * - Out of view: Reverses to initial state (unless once=true)
 * - Delay only applied on enter, removed on exit to prevent hover latency
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to animate
 * @param {number|string} [props.y=24] - Vertical offset in pixels or CSS value (e.g., '2rem')
 * @param {number} [props.scaleFrom=0.94] - Initial scale value (0-1)
 * @param {number} [props.duration=0.6] - Animation duration in seconds for both opacity and transform
 * @param {number} [props.delay=0] - Animation delay in seconds (only on enter)
 * @param {number} [props.staggerIndex] - Index for stagger calculation (overrides delay)
 * @param {boolean} [props.once=false] - If true, animation only plays once (no exit animation)
 * @param {string|React.ComponentType} [props.as='div'] - HTML tag or component to render
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {string} [props.onVisibleClass='is-visible'] - Class added when element is visible
 * @param {Object} [props....rest] - Additional props spread to wrapper element
 * 
 * @example
 * // Basic fade-in/out
 * <FadeInOutWhenVisible>
 *   <p>This text fades in and out on scroll</p>
 * </FadeInOutWhenVisible>
 * 
 * @example
 * // Custom offset and duration
 * <FadeInOutWhenVisible y={48} duration={0.8}>
 *   <div>Slower, longer animation</div>
 * </FadeInOutWhenVisible>
 * 
 * @example
 * // Staggered list items
 * {items.map((item, i) => (
 *   <FadeInOutWhenVisible key={item.id} staggerIndex={i}>
 *     <ListItem>{item.title}</ListItem>
 *   </FadeInOutWhenVisible>
 * ))}
 * 
 * @example
 * // One-time animation with custom element
 * <FadeInOutWhenVisible as="section" once className="hero">
 *   <h1>Welcome</h1>
 * </FadeInOutWhenVisible>
 * 
 * CSS Custom Properties:
 * - --fx-y: Vertical offset distance
 * - --fx-scale-from: Initial scale value
 * - --fx-dur-op: Opacity transition duration
 * - --fx-dur-tr: Transform transition duration
 * 
 * Data Attributes:
 * - data-fx-state="in" | "out": Current animation state
 * 
 * Stagger Calculation:
 * - If staggerIndex provided: delay = staggerIndex * var(--motion-stagger-sm)
 * - Otherwise uses delay prop
 * - Stagger delay only applied when element is out of view
 * - Removed when in view to avoid hover interaction delays
 * 
 * Accessibility:
 * - No ARIA changes (purely visual enhancement)
 * - Content visible and readable before/during/after animation
 * - Respects user's motion preferences (via prefers-reduced-motion in CSS)
 * - No layout shift during animation
 * 
 * Performance:
 * - Uses Intersection Observer (efficient viewport detection)
 * - transform and opacity: GPU accelerated
 * - Minimal recalculations with CSS custom properties
 * - Cleans up observer on unmount
 * 
 * Browser Compatibility:
 * - Intersection Observer: All modern browsers
 * - CSS custom properties: Widely supported
 * - transform/opacity: Universal support
 * - Graceful degradation: Content visible without JS
 * 
 * @see useInOutVisibility - Hook powering the visibility detection
 * @see EffectsStyles.css - CSS definitions for .fx-fade class
 * 
 * @returns {React.ReactElement} Animated wrapper component
 */
const FadeInOutWhenVisible = ({
  children,
  y = 24,
  scaleFrom = 0.94,
  duration = 0.6,
  delay = 0,
  staggerIndex,
  once = false,
  as: Tag = 'div',
  className = '',
  onVisibleClass = 'is-visible',
  ...rest
}) => {
  const { ref, inView } = useInOutVisibility({ once });

  const computedDelay = typeof staggerIndex === 'number'
    ? `calc(${staggerIndex} * var(--motion-stagger-sm))`
    : (delay ? `${delay}s` : undefined);

  // Delay only on enter; remove when inView true to avoid hover latency
  const style = {
    '--fx-y': typeof y === 'number' ? `${y}px` : y,
    '--fx-scale-from': scaleFrom,
    '--fx-dur-op': `${duration}s`,
    '--fx-dur-tr': `${duration}s`,
    ...( !inView && computedDelay ? { transitionDelay: computedDelay } : {} ),
  };
  const state = inView ? 'in' : 'out';
  const visibilityClass = inView ? onVisibleClass : '';
  return (
    <Tag
      ref={ref}
      className={`fx-fade ${className} ${visibilityClass}`.trim()}
      data-fx-state={state}
      style={style}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default FadeInOutWhenVisible;
