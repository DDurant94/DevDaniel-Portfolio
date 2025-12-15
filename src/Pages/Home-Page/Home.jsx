/**
 * Home Page Component
 * 
 * @description Main landing page featuring hero section, introduction, featured projects carousel,
 * and services preview. Includes scroll animations, lazy loading, and interactive call-to-action buttons.
 * 
 * Features:
 * - 3D animated hero section with particle effects
 * - Smooth scroll navigation between sections
 * - Featured projects carousel with project selection
 * - Resume download functionality
 * - Contact aside integration
 * - Lazy-loaded components for performance
 * - Full accessibility (skip links, ARIA, keyboard navigation)
 * 
 * @component
 * @requires framer-motion - For scroll-triggered animations
 * @requires ContactAsideContext - For contact panel control
 * 
 * @example
 * ```jsx
 * <Home />
 * ```
 */

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useContactAside } from '../../Context/Aside-Context/ContactAsideContext';
import './../../Styles/Page-Styles/Home-Styles/HomeStyles.css';
import './../../Styles/General-Styles/3D-Styles/3DHero-Styles/HeroStyles.css';

// Section components
import Hero from './Home-Components/Hero/HomeHero.jsx';
import Intro from './Home-Components/Intro/HomeIntro.jsx';
import FeaturedProjects from './Home-Components/FeaturedProjects/FeaturedProjectsSection.jsx';
import ServicesPreview from './Home-Components/ServicesPreview/ServicesPreviewSection.jsx';
import { useLazyComponent } from './../../Hooks/Utility-Hooks/useLazyComponent';
import BaseButton from '../../Components/UI/BaseButton/BaseButton.jsx';
import SkipToMain from '../../Components/UI/SkipToMain/SkipToMain';

const Home = () => {
  const { openContactAside } = useContactAside();
  
  /** Currently selected project in the featured carousel */
  const [selectedProject, setSelectedProject] = useState(null);

  /**
   * Updates selected project state from carousel interaction
   * @callback
   */
  const handleProjectSelect = useCallback((project) => {
    setSelectedProject(project);
  }, []);

  /**
   * Handles resume download and opens in new tab
   * Creates temporary link element to trigger download while maintaining new tab behavior
   */
  function handleResumeClick() {
    const resumeUrl = "/Resume/DanielDurantResume.pdf";
    window.open(resumeUrl, "_blank");
    const link = document.createElement("a");
    link.href = resumeUrl;
    link.download = "DanielDurantResume.pdf";
    link.textContent = "Resume";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div id="home-container" className='container-fluid-center'>
      <SkipToMain targetId="home-main-container" />
      
      <Hero
        onPrimaryCta={() => {
          const el = document.getElementById('featured-projects');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
        onSecondaryCta={() => {}}
      />

      <main id="home-main-container" role="main" tabIndex="-1">

        <motion.section
          id='home-intro-section'>
          <Intro />
        </motion.section>

        <motion.section
          id='home-featured-projects-section'
          aria-labelledby='home-featured-projects'
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          viewport={{ once: false }}>
          <FeaturedProjects onSelectProject={handleProjectSelect} />
        </motion.section>

        <motion.section
          id="home-services-preview-section"
          aria-labelledby="home-services-preview"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          viewport={{ once: false }}
          >
          <ServicesPreview />
        </motion.section>

        <motion.section
          id="home-contact-cta-section"
          className="home-contact-cta-section"
          aria-labelledby="home-contact-cta-heading"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-25% 0px' }}
          transition={{ duration: 0.7 }}
        >
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
                className="base-btn btn-variant-outline" 
                onClick={handleResumeClick}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleResumeClick();
                  }
                }}
                aria-label="Download resume as PDF"
              >
                Resume
              </button>
              
            </div>
          </div>
        </motion.section>

      </main>
    </div>
  );
};

export default Home;
