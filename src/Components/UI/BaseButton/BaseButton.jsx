/**
 * BaseButton Component
 * 
 * @description Unified button component supporting multiple variants, sizes, and interaction patterns.
 * Handles both internal routing (Link), external links (anchor), and standard button actions.
 * Includes built-in loading states, icons, accessibility features, and pressable effects.
 * 
 * Features:
 * - Multiple visual variants (primary, secondary, ghost)
 * - Flexible sizing (sm, md, lg)
 * - Icon support (left/right positioning)
 * - Loading state with spinner
 * - Glow, edge, and inset effects from pressable utilities
 * - Full keyboard and screen reader support
 * - Page transition animations when routing
 * 
 * @component
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button text or content
 * @param {'primary'|'secondary'|'ghost'} [props.variant='primary'] - Visual style variant
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Button size
 * @param {string} [props.to] - Internal route path (renders as React Router Link)
 * @param {string} [props.href] - External URL (renders as anchor tag)
 * @param {Function} [props.onClick] - Click handler function
 * @param {'button'|'submit'|'reset'} [props.type='button'] - HTML button type
 * @param {boolean} [props.disabled=false] - Disables interaction and applies aria-disabled
 * @param {boolean} [props.loading=false] - Shows loading state with aria-busy
 * @param {React.ReactNode} [props.iconLeft] - Icon element to display before text
 * @param {React.ReactNode} [props.iconRight] - Icon element to display after text
 * @param {boolean} [props.glow=true] - Apply glow effect from pressable utilities
 * @param {boolean} [props.edge=true] - Apply edge effect from pressable utilities
 * @param {boolean} [props.inset=false] - Apply inset effect from pressable utilities
 * @param {boolean} [props.fullWidth=false] - Stretch button to full container width
 * @param {string} [props.ariaLabel] - Accessible label (overrides children for screen readers)
 * @param {string} [props.className] - Additional CSS classes to append
 * 
 * @example
 * ```jsx
 * // Internal link button
 * <BaseButton to="/about" variant="primary" size="lg">
 *   Learn More
 * </BaseButton>
 * 
 * // External link button
 * <BaseButton href="https://github.com" variant="secondary">
 *   View on GitHub
 * </BaseButton>
 * 
 * // Action button with icon
 * <BaseButton onClick={handleClick} iconLeft={<Icon />} loading={isLoading}>
 *   Submit
 * </BaseButton>
 * ```
 */

import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { usePageTransition } from '../../../Hooks/Effect-Hooks/usePageTransition';
import PropTypes from 'prop-types';

/** Maps variant prop to CSS class name */
const variantClass = (v) => `btn-variant-${v}`;

/** Maps size prop to CSS class name */
const sizeClass = (s) => `btn-size-${s}`;

const BaseButton = forwardRef(function BaseButton({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  iconLeft,
  iconRight,
  glow = true,
  edge = true,
  inset = true, // maintain current glow-inset combo naming
  fullWidth = false,
  className = '',
  ariaLabel,
  role,
  ...rest
}, ref) {
  const navigateWithTransition = usePageTransition();

  const isLink = !!to;
  const isExternal = !!href && !to;

  const combinedClass = [
    'base-btn',
    'pressable',
    edge && 'pressable-edge',
    glow && inset && 'pressable-glow-inset',
    !glow && inset && 'pressable-inset',
    variantClass(variant),
    sizeClass(size),
    fullWidth && 'btn-block',
    loading && 'is-loading',
    disabled && 'is-disabled',
    className
  ].filter(Boolean).join(' ');

  const commonProps = {
    ref,
    className: combinedClass,
    'data-variant': variant,
    'data-size': size,
    'aria-disabled': disabled || loading ? true : undefined,
    'aria-busy': loading || undefined,
    'aria-label': ariaLabel,
    role: role || (isExternal ? 'link' : undefined),
    onClick: (e) => {
      if (disabled || loading) {
        e.preventDefault();
        return;
      }
      if (onClick) onClick(e);
      if (isLink && !e.defaultPrevented && to && typeof to === 'string') {
        navigateWithTransition(to);
      }
    },
    ...rest
  };

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...commonProps}>
        {iconLeft && !loading && <span className="btn-icon left" aria-hidden>{iconLeft}</span>}
        {loading && <span className="btn-spinner" aria-hidden />}
        <span className="btn-label">{children}</span>
        {iconRight && !loading && <span className="btn-icon right" aria-hidden>{iconRight}</span>}
      </a>
    );
  }

  if (isLink) {
    // Navigate manually on click; still render button element for semantics unless we want <Link>.
    return (
      <button type={type} {...commonProps}>
        {iconLeft && !loading && <span className="btn-icon left" aria-hidden>{iconLeft}</span>}
        {loading && <span className="btn-spinner" aria-hidden />}
        <span className="btn-label">{children}</span>
        {iconRight && !loading && <span className="btn-icon right" aria-hidden>{iconRight}</span>}
      </button>
    );
  }

  if (href) {
    // fallback if both to + href not used but href is (non-external e.g., anchor on page)
    return (
      <a href={href} {...commonProps}>
        {iconLeft && !loading && <span className="btn-icon left" aria-hidden>{iconLeft}</span>}
        {loading && <span className="btn-spinner" aria-hidden />}
        <span className="btn-label">{children}</span>
        {iconRight && !loading && <span className="btn-icon right" aria-hidden>{iconRight}</span>}
      </a>
    );
  }

  return (
    <button type={type} {...commonProps}>
      {iconLeft && !loading && <span className="btn-icon left" aria-hidden>{iconLeft}</span>}
      {loading && <span className="btn-spinner" aria-hidden />}
      <span className="btn-label">{children}</span>
      {iconRight && !loading && <span className="btn-icon right" aria-hidden>{iconRight}</span>}
    </button>
  );
});

BaseButton.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary','secondary','ghost','outline','danger']),
  size: PropTypes.oneOf(['sm','md','lg']),
  to: PropTypes.string,
  href: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button','submit','reset']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  iconLeft: PropTypes.node,
  iconRight: PropTypes.node,
  glow: PropTypes.bool,
  edge: PropTypes.bool,
  inset: PropTypes.bool,
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
  role: PropTypes.string
};

export default BaseButton;
