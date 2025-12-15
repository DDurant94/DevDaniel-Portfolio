/**
 * useTheme Hook
 * 
 * @description Manages theme state with support for light, dark, high-contrast, and system preference modes.
 * Persists user choice to localStorage and automatically responds to system preference changes
 * when in 'system' mode.
 * 
 * Theme Modes:
 * - 'light': Light theme
 * - 'dark': Dark theme
 * - 'contrast': High contrast dark theme for accessibility
 * - 'system': Follows OS/browser preference (auto-switches based on system)
 * 
 * Features:
 * - Automatic system preference detection
 * - LocalStorage persistence
 * - Real-time updates when system preference changes
 * - Applies theme via data-theme attribute on <html>
 * - Tracks user explicit choice vs auto-selection
 * 
 * @hook
 * @returns {Object} Theme state and controls
 * @returns {string} return.theme - Current theme mode ('light'|'dark'|'contrast'|'system')
 * @returns {string} return.resolved - Actual applied theme (resolves 'system' to 'light' or 'dark')
 * @returns {Function} return.setThemeMode - Function to change theme mode
 * @returns {boolean} return.isDark - True if resolved theme is dark or contrast
 * @returns {boolean} return.isLight - True if resolved theme is light
 * @returns {boolean} return.isContrast - True if theme is high-contrast mode
 * @returns {boolean} return.isSystem - True if following system preference
 * 
 * @example
 * ```jsx
 * const { theme, resolved, setThemeMode, isDark } = useTheme();
 * 
 * // Set explicit theme
 * setThemeMode('dark');
 * 
 * // Follow system
 * setThemeMode('system');
 * 
 * // Check current state
 * if (isDark) {
 *   // Apply dark mode specific logic
 * }
 * ```
 */

import { useCallback, useEffect, useState } from 'react';

/** LocalStorage key for theme preference */
const STORAGE_KEY = 'site-theme'; // values: 'light' | 'dark' | 'contrast' | 'system'
/** LocalStorage key tracking if user explicitly set theme */
const USER_SET_KEY = 'site-theme-user-set-v1';

/**
 * Detects system color scheme preference
 * @returns {'light'|'dark'} System preference
 */
function getSystemPreference() {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Applies theme to document root
 * Sets data-theme attribute for CSS, tracks mode and resolved theme for debugging
 * @param {string} resolvedTheme - Actual theme to apply ('light'|'dark'|'contrast')
 * @param {string} explicitChoice - User's explicit choice ('light'|'dark'|'contrast'|'system')
 */
function applyTheme(resolvedTheme, explicitChoice) {
  const root = document.documentElement; // <html>
  // Reflect the theme in the attribute so CSS using [data-theme] updates immediately
  // If user chose an explicit mode (light|dark|contrast), honor it directly; for 'system', use resolvedTheme
  const attrValue = (explicitChoice === 'system') ? resolvedTheme : explicitChoice;
  root.setAttribute('data-theme', attrValue);
  // Track user mode and resolved theme for debugging/conditional logic if needed
  root.dataset.themeMode = explicitChoice;
  root.dataset.themeResolved = resolvedTheme; // debug aid (not styled)
}

export default function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'system';
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const userSet = localStorage.getItem(USER_SET_KEY);
      // If user has never explicitly set a theme, follow system by default
      if (!userSet) return 'system';
      return saved || 'system';
    } catch {
      return 'system';
    }
  });

  // Derived actual theme applied
  const [resolved, setResolved] = useState(() => theme === 'system' ? getSystemPreference() : (theme === 'contrast' ? 'dark' : theme));

  // Respond to system changes if in system mode
  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = () => {
      const sys = getSystemPreference();
      setResolved(sys);
      applyTheme(sys, 'system');
    };
    mq.addEventListener('change', listener);
    listener();
    return () => mq.removeEventListener('change', listener);
  }, [theme]);

  // Apply on theme change
  useEffect(() => {
    const actual = theme === 'system' ? getSystemPreference() : (theme === 'contrast' ? 'dark' : theme);
    setResolved(actual);
    applyTheme(actual, theme);
    try {
      if (theme === 'system') {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(USER_SET_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, theme);
        localStorage.setItem(USER_SET_KEY, '1');
      }
    } catch {}
  }, [theme]);

  // Apply once on mount to sync DOM when theme comes from storage or defaults
  useEffect(() => {
    const actual = theme === 'system' ? getSystemPreference() : (theme === 'contrast' ? 'dark' : theme);
    setResolved(actual);
    applyTheme(actual, theme);
    // do not touch storage here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cycleTheme = useCallback(() => {
    setTheme(prev => {
      switch (prev) {
        case 'light': return 'dark';
        case 'dark': return 'contrast';
        case 'contrast': return 'system';
        default: return 'light';
      }
    });
  }, []);

  return { theme, resolvedTheme: resolved, setTheme, cycleTheme };
}
