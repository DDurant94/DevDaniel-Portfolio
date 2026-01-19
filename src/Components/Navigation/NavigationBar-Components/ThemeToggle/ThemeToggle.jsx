/** ThemeToggle - Accessible segmented control for theme switching (Light/Dark/High Contrast) */

import React, { useId, useMemo, useRef, useState } from 'react';
import { useThemeContext } from '../../../../Context/Theme-Context/useThemeContext';
import '../../../../Styles/Component-Styles/NavigationBar-Styles/NavigationBar-Components/ThemeToggle-Styles/ThemeToggleStyles.css';

/**
 * Calculates relative position (0-1) from pointer clientX
 * @param {HTMLElement} el - Container element
 * @param {number} clientX - Pointer X coordinate
 * @returns {number} Position from 0 to 1
 */
function relFromClientX(el, clientX) {
  if (!el) return 0;
  const rect = el.getBoundingClientRect();
  return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
}

/**
 * Calculates segment index from pointer clientX
 * @param {HTMLElement} el - Container element
 * @param {number} clientX - Pointer X coordinate
 * @param {number} length - Number of segments
 * @returns {number} Segment index (0 to length-1)
 */
function indexFromClientX(el, clientX, length) {
  const rel = relFromClientX(el, clientX);
  const idx = Math.floor(rel * length);
  return Math.max(0, Math.min(length - 1, idx));
}

/**
 * ThemeToggle - segmented slider
 * Accessible radios with a sliding indicator. No explicit "System" option; on first load the selected
 * segment reflects the OS preference via resolvedTheme.
 */
export default function ThemeToggle({ className = '', showContrast = true, ...rest }) {
  const { theme, resolvedTheme, setTheme } = useThemeContext();
  const segmentsRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const pointerIdRef = useRef(null);
  const [pos, setPos] = useState(null);
  const groupNameId = useId();

  const options = useMemo(() => {
    const base = [
      { id: 'light', label: 'Light', icon: SunIcon },
      { id: 'dark', label: 'Dark', icon: MoonIcon },
    ];
    return showContrast ? [...base, { id: 'contrast', label: 'High contrast', icon: ContrastIcon }] : base;
  }, [showContrast]);

  // If theme is 'system', visually select the resolved OS theme (light/dark) by default
  const selectedId = theme === 'system' ? resolvedTheme : theme;
  const index = Math.max(0, options.findIndex(o => o.id === selectedId));
  const count = options.length || 1;
  const discretePos = count > 1 ? index / (count - 1) : 0;

  // helpers for sliding selection
  const getIndexFromClientX = (clientX) => indexFromClientX(segmentsRef.current, clientX, options.length);
  const getRelFromClientX = (clientX) => relFromClientX(segmentsRef.current, clientX);

  const onPointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    const idx = getIndexFromClientX(e.clientX);
    setPos(getRelFromClientX(e.clientX));
    const choice = options[idx]?.id;
    if (choice) setTheme(choice);
    pointerIdRef.current = e.pointerId ?? 'mouse';
    segmentsRef.current?.setPointerCapture?.(e.pointerId);
    setDragging(true);
    e.preventDefault();
  };

  const onPointerMove = (e) => {
    if (!dragging) return;
    if (pointerIdRef.current !== (e.pointerId ?? 'mouse')) return;
    const rel = getRelFromClientX(e.clientX);
    setPos(rel);
    const idx = Math.floor(rel * options.length);
    const choice = options[idx]?.id;
    if (choice) setTheme(choice);
  };

  const endDrag = (e) => {
    if (!dragging) return;
    if (pointerIdRef.current !== (e.pointerId ?? 'mouse')) return;
    setDragging(false);
    setPos(null);
    pointerIdRef.current = null;
    segmentsRef.current?.releasePointerCapture?.(e.pointerId);
  };

  return (
    <fieldset
      className={`theme-segmented ${className}`}
      role="radiogroup"
      aria-label="Color theme"
      style={{ ['--index']: index, ['--count']: options.length, ['--pos']: pos != null ? pos : discretePos }}
      data-dragging={dragging ? 'true' : 'false'}
      {...rest}
    >
      <legend className="sr-only">Color theme</legend>
      <div
        ref={segmentsRef}
        className="segments"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div className="thumb" aria-hidden="true" />
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selectedId === opt.id;
          return (
            <label key={opt.id} className={`segment ${isSelected ? 'is-selected' : ''}`}>
              <input
                type="radio"
                name={`theme-mode-${groupNameId}`}
                value={opt.id}
                checked={isSelected}
                onChange={() => setTheme(opt.id)}
                aria-label={opt.label}
              />
              <span className="segment-icon" aria-hidden="true"><Icon /></span>
              <span className="sr-only">{opt.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function ContrastIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18" />
      <path d="M12 12h9" />
    </svg>
  );
}
