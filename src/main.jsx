/**
 * Main Entry Point
 * 
 * @module main
 * @description Application bootstrap file that initializes React app and loads global styles.
 * Handles CSS cascade order, router setup, and root mounting.
 * 
 * CSS Loading Strategy:
 * 1. Bootstrap CSS (grid, utilities) - Foundation
 * 2. Design Tokens (Tokens.css) - CSS custom properties
 * 3. Root Styles (RootStyles.css) - Reset and base layout
 * 4. BaseButton Styles - Pressable button system
 * 5. Design System (design-system.css) - Component library
 * 6. Component-specific CSS loaded via imports in components
 * 
 * Critical CSS Order:
 * - Tokens MUST load before Root (variables used in reset)
 * - Root MUST load before components (base styles first)
 * - BaseButton loads early (used throughout app)
 * - Design system loads after base (builds on foundation)
 * 
 * Router Configuration:
 * - BrowserRouter: HTML5 History API routing
 * - Client-side navigation (no page reloads)
 * - Supports nested routes and transitions
 * - Base URL: / (configured in Vite)
 * 
 * Strict Mode:
 * - Currently disabled (commented out)
 * - When enabled: Double-invokes effects in development
 * - Helps detect side effects and unsafe lifecycles
 * - No impact on production builds
 * 
 * Pressable Helper:
 * - Initializes global mouse event listeners
 * - Adds hover/active states to .base-btn elements
 * - Runs immediately on import (IIFE pattern)
 * - Manages CSS class application for 3D button effects
 * 
 * Root Element:
 * - Mounts to <div id="root"> in index.html
 * - Single-page application root
 * - React 18 concurrent rendering enabled
 * 
 * Performance Considerations:
 * - CSS loaded synchronously (blocks render)
 * - Ensures styles present before first paint
 * - Prevents flash of unstyled content (FOUC)
 * - Component CSS lazy loaded with code splitting
 * 
 * Development vs Production:
 * - Development: Source maps enabled, HMR active
 * - Production: Minified, tree-shaken, optimized
 * - Vite handles bundling and optimization
 * 
 * Browser Compatibility:
 * - React 18: Modern browsers (ES6+)
 * - History API: All modern browsers
 * - CSS custom properties: Widely supported
 * - Fallbacks handled in individual CSS files
 * 
 * @example
 * // Build for production
 * npm run build
 * 
 * @example
 * // Development server
 * npm run dev
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.jsx';
import './Utils/pressableHelper.js'; // initializes pressable states
// Global design tokens and base styles must load before component CSS
import './Styles/General-Styles/Tokens.css';
import './Styles/General-Styles/RootStyles.css';
import './Styles/Component-Styles/UI-Styles/Button-Styles/BaseButtonStyles.css';
import './Styles/General-Styles/DesignSystem-Styles/design-system.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  // </React.StrictMode>,
)