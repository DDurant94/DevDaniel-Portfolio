/**
 * App Component - Main Application Root
 * 
 * @module App
 * @description Root component orchestrating the entire portfolio application.
 * Manages lazy loading, routing, context providers, 3D scenes, and global UI elements.
 * 
 * Architecture:
 * - Nested context providers for state management
 * - React Router for client-side routing
 * - React.lazy + Suspense for code splitting
 * - Persistent 3D hero scene across routes
 * - Global background effects and overlays
 * - Responsive navigation (desktop sidebar + mobile drawer)
 * - Side panels (ContactAside, ProjectOffCanvas)
 * 
 * Context Providers (outer to inner):
 * 1. ThemeProvider - Theme mode (light/dark/contrast/system)
 * 2. MediaQueryProvider - Responsive breakpoint detection
 * 3. NavigationProvider - Navigation state and transitions
 * 4. PageTransitionProvider - Route transition animations
 * 5. ScrollProvider - Smooth scroll and scroll position
 * 6. PortfolioFilterProvider - Project filtering state
 * 7. ContactAsideProvider - Contact panel state
 * 8. ProjectOffCanvasProvider - Project detail panel state
 * 
 * Code Splitting Strategy:
 * - Pages: Lazy loaded (Home, About, Projects, Skills, NotFound)
 * - Heavy components: Lazy loaded (SharedHeroScene, backgrounds)
 * - Navigation/Footer: Eagerly loaded (always visible)
 * - Side panels: Lazy loaded, mounted on demand
 * 
 * Loading Strategy:
 * - Initial: LoadingFallback with 3D gear animation
 * - Route changes: PageTransition overlay with quadrant slides
 * - Component chunks: Suspense boundaries with fallback={null}
 * - Fade-out after 100ms mount + 600ms transition
 * 
 * 3D Scene Management:
 * - SharedHeroScene persists across routes (not unmounted)
 * - showGear prop controls gear visibility (Home, About, Projects, Skills only)
 * - Three.js canvas reused for performance
 * - Mountains, clouds, fog rendered continuously
 * 
 * Background Effects:
 * - CodedBackground: Animated grid pattern with mouse parallax
 * - TerminalPromptDecorations: Depth-based terminal prompts
 * - CodeSnippetWatermark: Faded code snippets
 * - All lazy loaded and rendered persistently
 * 
 * Side Panels:
 * - ContactAside: Email form, slides from right
 * - ProjectOffCanvas: Project details, slides from right
 * - Mounted only when open (Suspense wrapped)
 * - State lifted to App for global control
 * 
 * Routes:
 * - / : Home page
 * - /about : About Me page
 * - /projects : Portfolio landing
 * - /skills : Skills showcase
 * - * : 404 Not Found
 * 
 * @component
 * @example
 * // Rendered in main.jsx
 * <BrowserRouter>
 *   <App />
 * </BrowserRouter>
 */

// Imports
import React, { useEffect, Suspense, useRef } from 'react';
import { Routes, Route, useLocation } from "react-router-dom";
import { setupScrollPauseAnimations } from './Utils/scrollPauseAnimations.js';

import ScrollToTop from './Components/Navigation/ScrollToTop/ScrollToTop.jsx';
import LoadingFallback from './Components/UI/LoadingFallback/LoadingFallback.jsx';
import PageTransition from './Components/UI/LoadingFallback/PageTransition.jsx';

// Lazy load components

// Pages - lazy load without artificial delay
const Home = React.lazy(() => import('./Pages/Home-Page/Home'));
const ContactMe = React.lazy(() => import('./Pages/ContactMe-Page/ContactMe'));
// const ContactAside = React.lazy(() => import('./Pages/ContactMe-Page/ContactMe'));
const AboutMe = React.lazy(() => import('./Pages/AboutMe-Page/AboutMe'));
const Projects = React.lazy(() => import('./Pages/Portfolio-Pages/PortfolioLanding'));
const Skills = React.lazy(() => import('./Pages/Skills-Page/Skills'));

const NotFound = React.lazy(() => import('./Pages/NotFound-Page/NotFound'));

// General Components - Load eagerly (no lazy loading) since they're always needed
import NavigationBar from './Components/Navigation/NavigationBar';
import NavigationInterceptor from './Components/Navigation/NavigationInterceptor';
import Footer from './Components/Footer/WebsiteFooter';
import { ContactAsideProvider } from './Context/Aside-Context/ContactAsideContext';
import { ProjectOffCanvasProvider } from './Context/OffCanvas-Context/ProjectOffCanvasContext';
import { ThemeProvider } from './Context/Theme-Context/ThemeContext';
import { ScrollProvider } from './Context/Scroll-Context/ScrollContext';
import { PageTransitionProvider } from './Context/PageTransition-Context/PageTransitionContext';
import { NavigationProvider } from './Context/Navigation-Context/NavigationContext';
import { PortfolioFilterProvider } from './Context/Portfolio-Context/PortfolioFilterContext';
import { MediaQueryProvider } from './Context/MediaQueryContext';

// Lazy load the shared hero scene
const SharedHeroScene = React.lazy(() => import('./3D/3D-Components/Header-Components/GearCloud/SharedHeroScene.jsx'));
const ContactAside = React.lazy(() => import('./Components/Aside/Right-Aside/ContactAside'));
const ProjectOffCanvas = React.lazy(() => import('./Functions/Portfolio-Functions/ProjectOffCanvas'));


// Effects & Backgrounds
const CodedBackground = React.lazy(() => import('./Components/Background/CodedBackground/CodedBackground'));
const CodeSnippetWatermark = React.lazy(() => import('./Components/Background/CodeSnippetWatermark/CodeSnippetWatermark'));
const TerminalPromptDecorations = React.lazy(() => import('./Components/Background/TerminalPromptDecorations/TerminalPromptDecorations'));

// Styles
import './Styles/General-Styles/RootStyles.css';
import './Styles/General-Styles/Tokens.css';
import SmoothScrollProvider from './Components/Effects/Scroll-Effect/SmoothScrollProvider.jsx';

/**
 * App - Root component with loading overlay
 * 
 * @function
 * @description Top-level wrapper managing initial loading state and smooth scroll.
 * Shows LoadingFallback during initial mount, then renders AppContent.
 * 
 * State:
 * - isLoading: Controls opacity of loading overlay
 * - shouldRender: Controls DOM presence of loading overlay
 * 
 * Loading Flow:
 * 1. LoadingFallback visible (opacity 1)
 * 2. AppContent mounts, triggers onLoaded after 100ms
 * 3. isLoading -> false, opacity -> 0 (600ms transition)
 * 4. shouldRender -> false after fade completes
 * 5. LoadingFallback removed from DOM
 * 
 * Cleanup:
 * - Removes page-transitioning class from body
 * - Resets body positioning styles (in case of incomplete transitions)
 * - Adds mousemove listener for cursor effects
 * 
 * @returns {React.ReactElement} App with loading overlay
 */
function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [shouldRender, setShouldRender] = React.useState(true);

  useEffect(() => {
    // Setup scroll animation pauser (Option 3)
    const cleanup = setupScrollPauseAnimations();
    
    // Force clean body state on app mount
    document.body.classList.remove('page-transitioning');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.bottom = '';
    document.body.style.overflow = '';
    
    const mouse = document.addEventListener('mousemove', (e) => {
      const x = e.clientX -2;
      const y = e.clientY -2;
    })
    
    return () => {
      if (mouse) mouse();
      if (cleanup) cleanup();
    }
  },[]);

  const handleLoaded = () => {
    setIsLoading(false);
    // Remove from DOM after fade completes
    setTimeout(() => setShouldRender(false), 600);
  };

  return (
    <>
      {/* Show loading fallback while app loads */}
      {shouldRender && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          zIndex: 9999,
          opacity: isLoading ? 1 : 0,
          transition: 'opacity 600ms ease-out',
          pointerEvents: isLoading ? 'auto' : 'none'
        }}>
          <LoadingFallback />
        </div>
      )}
      
      <SmoothScrollProvider>
        <Suspense fallback={null}>
          <AppContent onLoaded={handleLoaded} />
        </Suspense>
      </SmoothScrollProvider>
    </>
  )
};

/**
 * AppContent - Main application content wrapper
 * 
 * @function
 * @description Core application logic with routing, contexts, and global components.
 * Manages side panel state and coordinates all major UI elements.
 * 
 * @param {Object} props
 * @param {Function} props.onLoaded - Callback to hide loading overlay
 * 
 * State:
 * - showContactAside: Controls ContactAside panel visibility
 * - showProjectOffCanvas: Controls ProjectOffCanvas panel visibility
 * - projectContent: Current project data for OffCanvas panel
 * 
 * Route-based Features:
 * - showGear: Controls 3D gear visibility (true for /, /about, /projects, /skills)
 * - SharedHeroScene rendered on valid routes only
 * - PageTransition overlay on all route changes
 * 
 * Side Panel Management:
 * - ContactAside: Opens via handleOpenContactAside (from context)
 * - ProjectOffCanvas: Opens via handleOpenProject with project data
 * - Both mounted only when needed (Suspense wrapped)
 * - Close handlers reset state and unmount components
 * 
 * @returns {React.ReactElement} Full application with providers and routes
 */
function AppContent({ onLoaded }) {
  const [backgroundsReady, setBackgroundsReady] = React.useState(false);
  
  React.useEffect(() => {
    // Wait a tick to ensure everything is mounted, then hide loader
    const timer = setTimeout(() => {
      onLoaded();
    }, 100);
    
    // Load backgrounds immediately but fade them in after content loads
    // This prevents them from being counted as LCP
    const backgroundTimer = setTimeout(() => {
      setBackgroundsReady(true);
    }, 500); // Faster load, smoother transition
    
    return () => {
      clearTimeout(timer);
      clearTimeout(backgroundTimer);
    };
  }, [onLoaded]);
  
  const location = useLocation();
  const validRoutes = ['/', '/about', '/projects', '/skills'];
  const showGear = validRoutes.includes(location.pathname);
  const [showContactAside, setShowContactAside] = React.useState(false);
  const handleOpenContactAside = () => setShowContactAside(true);
  const handleCloseContactAside = () => setShowContactAside(false);
  
  const [showProjectOffCanvas, setShowProjectOffCanvas] = React.useState(false);
  const [projectContent, setProjectContent] = React.useState(null);
  const handleOpenProject = (project) => {
    setProjectContent(project);
    setShowProjectOffCanvas(true);
  };
  const handleCloseProject = () => {
    setShowProjectOffCanvas(false);
    setProjectContent(null);
  };

  return (
    <ThemeProvider>
      <MediaQueryProvider>
        <NavigationProvider>
          <PageTransitionProvider>
            <ScrollProvider>
              <PortfolioFilterProvider>
                <ContactAsideProvider openContactAside={handleOpenContactAside}>
                  <ProjectOffCanvasProvider openProject={handleOpenProject} closeProject={handleCloseProject}>
              {/* Coding-themed background patterns - deferred to prevent LCP blocking */}
              {backgroundsReady && (
                <div style={{
                  animation: 'fadeIn 800ms ease-in-out',
                  pointerEvents: 'none',
                  position: 'fixed',
                  inset: 0,
                  zIndex: -1
                }}>
                  <CodedBackground />
                  <TerminalPromptDecorations />
                  <CodeSnippetWatermark />
                </div>
              )}
              
              {/* <SpotlightEffect />  */}
              <NavigationInterceptor />
              <PageTransition />
      
      {/* Persistent 3D Hero Scene - Mountains, clouds, and fog */}
      <SharedHeroScene showGear={showGear} />
      
      {/* Unified Navigation - Desktop sidebar + Mobile full-screen menu */}
      <NavigationBar />
      
      {/* <ThemeToggleContainer /> */}
      <ScrollToTop />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutMe />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <Footer />
      
        {/* Contact Aside - slides in from right */}
        <Suspense fallback={null}>
          {showContactAside && (
            <ContactAside open={showContactAside} onClose={handleCloseContactAside} />
          )}
        </Suspense>
        
        {/* Project OffCanvas - slides in from right */}
        <Suspense fallback={null}>
          {showProjectOffCanvas && projectContent && (
            <ProjectOffCanvas
              show={showProjectOffCanvas}
              onHide={handleCloseProject}
              content={projectContent}
            />
          )}
        </Suspense>
                </ProjectOffCanvasProvider>
              </ContactAsideProvider>
            </PortfolioFilterProvider>
          </ScrollProvider>
        </PageTransitionProvider>
      </NavigationProvider>
      </MediaQueryProvider>
    </ThemeProvider>
  );
}

export default App;