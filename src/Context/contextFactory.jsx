/**
 * createSimpleContext - Context factory for basic provider patterns
 * 
 * @description Creates a Context provider and hook with minimal boilerplate.
 * Useful for simple state-passing contexts that don't manage state themselves.
 * 
 * @param {string} contextName - Name for the context (used in dev tools)
 * @param {Object} [defaultValue={}] - Default context value
 * @returns {Object} Context utilities
 * @returns {Function} returns.Provider - Context provider component
 * @returns {Function} returns.useContext - Hook to consume the context
 * 
 * @example
 * const { Provider: ContactAsideProvider, useContext: useContactAside } = 
 *   createSimpleContext('ContactAside', { openContactAside: () => {} });
 * 
 * // Usage in parent:
 * <ContactAsideProvider openContactAside={handleOpen}>
 *   <App />
 * </ContactAsideProvider>
 * 
 * // Usage in child:
 * const { openContactAside } = useContactAside();
 */

import { createContext, useContext } from 'react';

export function createSimpleContext(contextName, defaultValue = {}) {
  const Context = createContext(defaultValue);
  Context.displayName = contextName;

  const Provider = ({ children, ...value }) => (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );

  Provider.displayName = `${contextName}Provider`;

  const useContextHook = () => useContext(Context);

  return {
    Provider,
    useContext: useContextHook
  };
}
