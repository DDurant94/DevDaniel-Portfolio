/**
 * ContactAsideContext
 * 
 * @description Context provider for managing contact aside panel state globally.
 * Allows any component to trigger the contact form slide-out panel.
 * 
 * Features:
 * - Global access to openContactAside function
 * - Decoupled contact form triggering
 * - Simple provider pattern
 * - Default no-op implementation
 * 
 * @module ContactAsideContext
 * 
 * @example
 * ```jsx
 * // In App.jsx or layout:
 * <ContactAsideProvider openContactAside={handleOpenAside}>
 *   <YourApp />
 * </ContactAsideProvider>
 * 
 * // In any child component:
 * function CTAButton() {
 *   const { openContactAside } = useContactAside();
 *   
 *   return (
 *     <button onClick={openContactAside}>
 *       Get In Touch
 *     </button>
 *   );
 * }
 * ```
 */

import { createContext, useContext } from 'react';

const ContactAsideContext = createContext({ openContactAside: () => {} });

/**
 * useContactAside Hook
 * 
 * @description Access the contact aside panel controls from any component.
 * 
 * @returns {Object} Contact aside controls
 * @returns {Function} returns.openContactAside - Opens the contact form panel
 * 
 * @example
 * ```jsx
 * const { openContactAside } = useContactAside();
 * <button onClick={openContactAside}>Contact Me</button>
 * ```
 */
export const useContactAside = () => useContext(ContactAsideContext);

export const ContactAsideProvider = ({ children, openContactAside }) => (
  <ContactAsideContext.Provider value={{ openContactAside }}>
    {children}
  </ContactAsideContext.Provider>
);
