/**
 * App - Root component with context providers, routing, and lazy-loaded pages
 */
import React, { useEffect, Suspense, useCallback, useMemo } from 'react';
import { Routes, Route, useLocation } from "react-router-dom";
import { setupScrollPauseAnimations } from './Utils/scrollPauseAnimations.js';

import ScrollToTop from './Components/Navigation/ScrollToTop/ScrollToTop.jsx';
import PageTransition from './Components/UI/LoadingFallback/PageTransition.jsx';

const Home = React.lazy(() => import('./Pages/Home-Page/Home'));
const AboutMe = React.lazy(() => import('./Pages/AboutMe-Page/AboutMe'));
const Projects = React.lazy(() => import('./Pages/Portfolio-Pages/PortfolioLanding'));
const Skills = React.lazy(() => import('./Pages/Skills-Page/Skills'));
const NotFound = React.lazy(() => import('./Pages/NotFound-Page/NotFound'));

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

// Lazy load components (NOT the 3D scene - it's dynamically imported below)
const ContactAside = React.lazy(() => import('./Components/Aside/Right-Aside/ContactAside'));
const ProjectOffCanvas = React.lazy(() => import('./Functions/Portfolio-Functions/ProjectOffCanvas'));
const FullscreenMediaViewer = React.lazy(() => import('./Components/UI/FullscreenMediaViewer/FullscreenMediaViewer'));

// Import resume viewer hook
import useResumeViewer from './Hooks/Utility-Hooks/useResumeViewer.hook';
import { ResumeViewerProvider } from './Hooks/Utility-Hooks/useResumeViewer';

// Effects & Backgrounds
const CodedBackground = React.lazy(() => import('./Components/Background/CodedBackground/CodedBackground'));
const CodeSnippetWatermark = React.lazy(() => import('./Components/Background/CodeSnippetWatermark/CodeSnippetWatermark'));
const TerminalPromptDecorations = React.lazy(() => import('./Components/Background/TerminalPromptDecorations/TerminalPromptDecorations'));

import SmoothScrollProvider from './Components/Effects/Scroll-Effect/SmoothScrollProvider.jsx';

// Constant style objects to prevent re-renders
const backgroundContainerStyle = {
  pointerEvents: 'none',
  position: 'fixed',
  inset: 0,
  zIndex: -1
};

function App() {
  useEffect(() => {
    // Set up scroll pause animations
    const cleanup = setupScrollPauseAnimations();
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <SmoothScrollProvider>
      <ResumeViewerProvider>
        <Suspense fallback={null}>
          <AppContent />
        </Suspense>
      </ResumeViewerProvider>
    </SmoothScrollProvider>
  )
};

function AppContent() {
  const [shouldMount3D, setShouldMount3D] = React.useState(false);
  const [shouldMountBackgrounds, setShouldMountBackgrounds] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [SharedHeroScene, setSharedHeroScene] = React.useState(null);
  
  // Detect mobile based on viewport width (more reliable than user agent)
  React.useEffect(() => {
    const checkMobile = () => {
      const isMobileViewport = window.innerWidth < 768;
      setIsMobile(isMobileViewport);
    };
    
    // Check immediately
    checkMobile();
    
    // Also check on resize (for orientation changes)
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Skip decorative backgrounds on mobile to reduce blocking
  React.useEffect(() => {
    if (!isMobile) {
      setShouldMountBackgrounds(true);
    }
  }, [isMobile]);
  
  // Load 3D on both desktop and mobile, but mobile gets performance mode
  React.useEffect(() => {
    // Desktop: load immediately; Mobile: defer until after initial paint
    const delay = isMobile ? 100 : 0;
    
    const timer = setTimeout(() => {
      import(/* webpackPrefetch: true */ './3D/3D-Components/Header-Components/GearCloud/SharedHeroScene.jsx')
        .then(module => {
          setSharedHeroScene(() => module.default);
          setShouldMount3D(true);
        });
    }, delay);
    
    return () => clearTimeout(timer);
  }, [isMobile]);
  
  const location = useLocation();
  const showGear = useMemo(() => {
    const validRoutes = ['/', '/about', '/projects', '/skills'];
    return validRoutes.includes(location.pathname);
  }, [location.pathname]);
  
  const [showContactAside, setShowContactAside] = React.useState(false);
  const handleOpenContactAside = useCallback(() => setShowContactAside(true), []);
  const handleCloseContactAside = useCallback(() => setShowContactAside(false), []);
  
  const [showProjectOffCanvas, setShowProjectOffCanvas] = React.useState(false);
  const [projectContent, setProjectContent] = React.useState(null);
  const handleOpenProject = useCallback((project) => {
    setProjectContent(project);
    setShowProjectOffCanvas(true);
  }, []);
  const handleCloseProject = useCallback(() => {
    setShowProjectOffCanvas(false);
    setProjectContent(null);
  }, []);

  // Close project viewer when navigating to a different page
  React.useEffect(() => {
    if (showProjectOffCanvas) {
      handleCloseProject();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Resume viewer state
  const { isOpen: isResumeOpen, closeResume, resumeUrl } = useResumeViewer();

  return (
    <ThemeProvider>
      <MediaQueryProvider>
        <NavigationProvider>
          <PageTransitionProvider>
            <ScrollProvider>
              <PortfolioFilterProvider>
                <ContactAsideProvider openContactAside={handleOpenContactAside}>
                  <ProjectOffCanvasProvider openProject={handleOpenProject} closeProject={handleCloseProject}>
              
                    {/* Background elements - deferred load to reduce initial cost */}
                    {shouldMountBackgrounds && (
                      <div style={backgroundContainerStyle}>
                        <CodedBackground />
                        <TerminalPromptDecorations />
                        <CodeSnippetWatermark />
                      </div>
                    )}
                    
                    <NavigationInterceptor />
                    <PageTransition />
            
                      {/* Persistent 3D Hero Scene - Loads progressively without blocking */}
                      {shouldMount3D && SharedHeroScene && (
                        <Suspense fallback={null}>
                          <SharedHeroScene showGear={showGear} isMobile={isMobile} />
                        </Suspense>
                      )}
                      <NavigationBar />
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
                      {(showProjectOffCanvas || !isMobile) && (
                        <ProjectOffCanvas
                          show={showProjectOffCanvas}
                          onHide={handleCloseProject}
                          content={projectContent}
                        />
                      )}
                    </Suspense>

                    {/* Global Resume Viewer */}
                    <Suspense fallback={null}>
                      <FullscreenMediaViewer
                        isOpen={isResumeOpen}
                        onClose={closeResume}
                        mediaSrc={resumeUrl}
                        mediaType="pdf"
                        mediaAlt="DanielDurantsResume.pdf"
                      />
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