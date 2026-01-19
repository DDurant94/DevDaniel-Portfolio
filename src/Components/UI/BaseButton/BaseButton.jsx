/** BaseButton - Unified button component supporting multiple variants, sizes, and interaction patterns */

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
