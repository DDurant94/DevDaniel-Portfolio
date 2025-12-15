/**
 * NavigationContext
 * 
 * @description Global navigation state management including mobile menu, theme dropdown,
 * and active section tracking. Handles auto-close on route change and body scroll locking.
 * 
 * Features:
 * - Mobile menu state and controls
 * - Theme dropdown state
 * - Active section tracking (based on route)
 * - Auto-close mobile menu on navigation
 * - Body scroll lock when mobile menu open
 * - Route-based section activation
 * 
 * State:
 * - mobileMenuOpen: boolean - Mobile hamburger menu state
 * - themeExpanded: boolean - Theme dropdown expanded state
 * - activeSection: string|null - Current active section ('home', 'about', etc.)
 * 
 * Actions:
 * - openMobileMenu() - Opens mobile menu
 * - closeMobileMenu() - Closes mobile menu
 * - toggleMobileMenu() - Toggles mobile menu
 * - toggleTheme() - Toggles theme dropdown
 * - closeAllMenus() - Closes all menus (mobile + theme)
 * - setActiveSection(section) - Manually set active section
 * 
 * Auto-behaviors:
 * - Closes mobile menu on route change
 * - Locks body scroll when mobile menu open
 * - Updates active section based on pathname
 * - Cleans up body scroll on unmount
 * 
 * @module NavigationContext
 * 
 * @example
 * ```jsx
 * // In App.jsx:
 * <NavigationProvider>
 *   <YourApp />
 * </NavigationProvider>
 * 
 * // In components:
 * function MobileNav() {
 *   const { mobileMenuOpen, toggleMobileMenu, activeSection } = useNavigation();
 *   
 *   return (
 *     <nav className={mobileMenuOpen ? 'open' : 'closed'}>
 *       <button onClick={toggleMobileMenu}>Toggle</button>
 *       <Link to="/" className={activeSection === 'home' ? 'active' : ''}>
 *         Home
 *       </Link>
 *     </nav>
 *   );
 * }
 * ```
 */

import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const NavigationContext = createContext({
  mobileMenuOpen: false,
  themeExpanded: false,
  activeSection: null,
  openMobileMenu: () => {},
  closeMobileMenu: () => {},
  toggleMobileMenu: () => {},
  toggleTheme: () => {},
  closeAllMenus: () => {},
  setActiveSection: () => {}
});

export const useNavigation = () => useContext(NavigationContext);

export const NavigationProvider = ({ children }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeExpanded, setThemeExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  
  // Track previous pathname to detect actual route changes
  const prevPathnameRef = useRef(location.pathname);

  // Open mobile menu
  const openMobileMenu = useCallback(() => {
    setMobileMenuOpen(true);
  }, []);

  // Close mobile menu
  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  // Toggle theme dropdown
  const toggleTheme = useCallback(() => {
    setThemeExpanded(prev => !prev);
  }, []);

  // Close all menus (mobile menu and theme dropdown)
  const closeAllMenus = useCallback(() => {
    setMobileMenuOpen(false);
    setThemeExpanded(false);
  }, []);

  // Auto-close mobile menu on route change
  useEffect(() => {
    // Only close if pathname actually changed (not initial mount or state updates)
    if (prevPathnameRef.current !== location.pathname && mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
    prevPathnameRef.current = location.pathname;
  }, [location.pathname, mobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Update active section based on current route
  useEffect(() => {
    const pathToSection = {
      '/': 'home',
      '/about': 'about',
      '/projects': 'projects',
      '/skills': 'skills'
    };
    setActiveSection(pathToSection[location.pathname] || null);
  }, [location.pathname]);

  const value = useMemo(() => ({
    mobileMenuOpen,
    themeExpanded,
    activeSection,
    openMobileMenu,
    closeMobileMenu,
    toggleMobileMenu,
    toggleTheme,
    closeAllMenus,
    setActiveSection
  }), [
    mobileMenuOpen,
    themeExpanded,
    activeSection,
    openMobileMenu,
    closeMobileMenu,
    toggleMobileMenu,
    toggleTheme,
    closeAllMenus
  ]);

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};
