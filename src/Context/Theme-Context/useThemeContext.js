/**
 * useThemeContext Hook - Access theme state and controls
 * 
 * @hook
 * @example
 * import { useThemeContext } from './useThemeContext';
 * 
 * const { theme, resolvedTheme, setTheme, cycleTheme } = useThemeContext();
 */
import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

export const useThemeContext = () => useContext(ThemeContext);
