/**
 * Hooks Barrel Export
 * 
 * @description Central export point for all custom React hooks in the application.
 * Provides organized, tree-shakeable imports grouped by category.
 * 
 * Categories:
 * - Theme Hooks: Theme switching and persistence
 * - Effect Hooks: Visual effects and transitions
 * - Utility Hooks: Lazy loading and performance
 * - Portfolio Hooks: Project filtering and search
 * 
 * @module hooks
 * 
 * @example
 * ```js
 * // Import specific hooks:
 * import { useTheme, usePageTransition } from './Hooks';
 * 
 * // Or import all:
 * import * as Hooks from './Hooks';
 * const { useTheme, useProjectFilters } = Hooks;
 * ```
 */

// Hooks barrel export
// Theme Hooks
export { default as useTheme } from './Theme-Hooks/useTheme.jsx';

// Effect Hooks
export { useEffectVisibility } from './Effect-Hooks/useEffectVisibility.jsx';
export { usePageTransition } from './Effect-Hooks/usePageTransition.jsx';

// Utility Hooks
export { default as useLazyComponent } from './Utility-Hooks/useLazyComponent.jsx';

// Portfolio Hooks
export { default as useProjectFilters } from './Portfolio-Hooks/useProjectFilters.jsx';
