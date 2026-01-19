/**
 * Application bootstrap - initializes React app with global styles and routing
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './Utils/pressableHelper.js';

// Critical CSS only - load synchronously
import './Styles/General-Styles/Tokens.css';
import './Styles/General-Styles/RootStyles.css';

// Non-critical CSS - load after initial render
Promise.all([
  import('./Styles/Component-Styles/UI-Styles/Button-Styles/BaseButtonStyles.css'),
  import('./Styles/General-Styles/DesignSystem-Styles/design-system.css')
]).catch(err => console.error('CSS loading error:', err));

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  // </React.StrictMode>,
)