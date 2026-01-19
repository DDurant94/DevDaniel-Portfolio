/**
 * useNavigation Hook - Access navigation state and controls
 * 
 * @hook
 * @example
 * import { useNavigation } from './useNavigation';
 * 
 * const { mobileMenuOpen, openMobileMenu, closeMobileMenu } = useNavigation();
 */
import { useContext } from 'react';
import { NavigationContext } from './NavigationContext';

export const useNavigation = () => useContext(NavigationContext);
