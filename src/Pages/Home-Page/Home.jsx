/**
 * Home Page - Landing page with hero, intro, featured projects, and services preview
 */

import { useCallback } from 'react';
import { useContactAside } from '../../Context/Aside-Context/useContactAside';
import useResumeViewer from '../../Hooks/Utility-Hooks/useResumeViewer.hook';
import { usePageTransition } from '../../Context/PageTransition-Context/usePageTransition';
import FadeInWhenVisible from '../../Components/Effects/Fade-Effect/FadeIn.jsx';
import './../../Styles/Page-Styles/Home-Styles/HomeStyles.css';
import './../../Styles/General-Styles/3D-Styles/3DHero-Styles/HeroStyles.css';

// Section components
import PageHero from '../../Components/UI/PageHero/PageHero.jsx';
import Intro from './Home-Components/Intro/HomeIntro.jsx';
import FeaturedProjects from './Home-Components/FeaturedProjects/FeaturedProjectsSection.jsx';
import ServicesPreview from './Home-Components/ServicesPreview/ServicesPreviewSection.jsx';
import BaseButton from '../../Components/UI/BaseButton/BaseButton.jsx';
import SkipToMain from '../../Components/UI/SkipToMain/SkipToMain';

const Home = () => {
  const { openContactAside } = useContactAside();
  const { openResume } = useResumeViewer();
  const { startTransition } = usePageTransition();

  /**
   * Navigate to projects page and open the selected project offcanvas
   * @callback
   */
  const handleProjectSelect = useCallback((project) => {
    startTransition('/projects', { state: { project, openImmediately: true } });
  }, [startTransition]);

  return (
    <div id="home-container">
      <SkipToMain targetId="home-main-container" />
      
      <PageHero
        id="home-hero"
        title="Engineering Intelligent Web Platforms"
        subtitle="Hello, my name is Daniel Durant. I architect scalable backends and craft immersive interfaces."
      />

      <main id="home-main-container" role="main" tabIndex="-1">

        <FadeInWhenVisible
          as="section"
          id='home-intro-section'
          y={30}
          duration={0.6}>
          <Intro />
        </FadeInWhenVisible>

        <FadeInWhenVisible
          as="section"
          id='home-featured-projects-section'
          aria-labelledby='home-featured-projects'
          y={20}
          duration={0.3}>
          <FeaturedProjects onSelectProject={handleProjectSelect} />
        </FadeInWhenVisible>

        <FadeInWhenVisible
          as="section"
          id="home-services-preview-section"
          aria-labelledby="home-services-preview"
          y={30}
          duration={0.6}>
          <ServicesPreview />
        </FadeInWhenVisible>

        <FadeInWhenVisible
          as="section"
          id="home-contact-cta-section"
          className="home-contact-cta-section util-flex-col-center-all"
          aria-labelledby="home-contact-cta-heading"
          y={28}
          duration={0.7}>
          <div className="cta-bg" aria-hidden="true" />
          <div className="cta-inner">
            <h2 id="home-contact-cta-heading">Ready to build something?</h2>
            <p className="home-contact-cta-tagline">Let's architect a platform, automate a workflow, or bring a 3D concept to life.</p>
            <div className="home-contact-cta-actions" role="group" aria-label="Contact options">
              <BaseButton
                variant="primary"
                size="md"
                onClick={openContactAside}
                ariaLabel="Start a conversation with me via the contact panel"
              >
                Start Conversation
              </BaseButton>
              <button 
                type="button"
                className="base-btn btn-variant-outline" 
                onClick={openResume}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openResume();
                  }
                }}
                aria-label="View resume in fullscreen"
              >
                Resume
              </button>
              
            </div>
          </div>
        </FadeInWhenVisible>

      </main>
    </div>
  );
};

export default Home;
