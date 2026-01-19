/**
 * NavigationContext - Global navigation state (mobile menu, theme dropdown, active section tracking)
 */
import { createContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// eslint-disable-next-line react-refresh/only-export-components
export const NavigationContext = createContext({
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

export const NavigationProvider = ({ children }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeExpanded, setThemeExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  
  const prevPathnameRef = useRef(location.pathname);

  const openMobileMenu = useCallback(() => {
    setMobileMenuOpen(true);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeExpanded(prev => !prev);
  }, []);

  const closeAllMenus = useCallback(() => {
    setMobileMenuOpen(false);
    setThemeExpanded(false);
  }, []);

  useEffect(() => {
    if (prevPathnameRef.current !== location.pathname && mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
    prevPathnameRef.current = location.pathname;
  }, [location.pathname, mobileMenuOpen]);

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
