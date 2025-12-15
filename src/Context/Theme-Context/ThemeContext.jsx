import { createContext, useContext } from 'react';
import useTheme from '../../Hooks/Theme-Hooks/useTheme';

/**
 * ThemeContext - Theme management context wrapper
 * 
 * Wraps the useTheme hook to provide theme state and actions via Context API.
 * Enables theme access throughout the component tree without prop drilling.
 * 
 * Provides:
 * - theme: Current theme setting ('light', 'dark', 'contrast', 'system')
 * - resolvedTheme: Actual applied theme ('light', 'dark', 'contrast')
 * - setTheme: Function to set specific theme
 * - cycleTheme: Function to cycle through themes
 * 
 * Features:
 * - localStorage persistence
 * - System theme detection
 * - Auto-switching based on time of day (system mode)
 * - CSS custom property updates
 * - Theme cycling (light → dark → contrast → system)
 * 
 * @context
 * @see useTheme for implementation details
 * 
 * @example
 * import { useThemeContext } from './ThemeContext';
 * 
 * const { theme, resolvedTheme, setTheme } = useThemeContext();
 * 
 * <button onClick={() => setTheme('dark')}>
 *   Current: {resolvedTheme}
 * </button>
 */
const ThemeContext = createContext({
  theme: 'system',
  resolvedTheme: 'light',
  setTheme: () => {},
  cycleTheme: () => {}
});

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const themeValues = useTheme();

  return (
    <ThemeContext.Provider value={themeValues}>
      {children}
    </ThemeContext.Provider>
  );
};
