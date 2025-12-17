/**
 * Skills Page Component
 * 
 * @description Technical expertise showcase featuring hero section, animated logo carousel,
 * and interactive tech stack grid. Displays programming languages, frameworks, tools,
 * and technologies with proficiency levels.
 * 
 * Features:
 * - 3D animated hero section
 * - Infinite scrolling logo carousel of tech icons
 * - Interactive tech stack cards with hover effects
 * - Categorized skill display (Frontend, Backend, Tools, etc.)
 * - Scroll-triggered animations using Framer Motion
 * - Contact CTA integration
 * 
 * @component
 * @requires framer-motion - Scroll and reveal animations
 * @requires ContactAsideContext - Contact panel integration
 * @requires LogoLoop - Infinite scrolling logo carousel
 * @requires SkillsTechStack - Interactive skill cards grid
 * 
 * @example
 * ```jsx
 * <Skills />
 * ```
 */

import BaseButton from '../../Components/UI/BaseButton/BaseButton.jsx';
import SkipToMain from '../../Components/UI/SkipToMain/SkipToMain.jsx';
import FadeInWhenVisible from '../../Components/Effects/Fade-Effect/FadeIn.jsx';
import SkillsTechStack from './Skills-Components/SkillsTechStack/SkillsTechStack';
import LogoLoop from '../../Components/UI/LogoLoop/LogoLoop.jsx';
import { IconList } from '../../DataSets/ProgrammingIcons/Icons';
import { useContactAside } from '../../Context/Aside-Context/ContactAsideContext';
import './../../Styles/Page-Styles/Skills-Styles/SkillsStyles.css';
import SkillsHero from './Skills-Components/Hero/SkillsHero.jsx';

const Skills = () => {
  const { openContactAside } = useContactAside();
  return (
    <div id="skills-container" className="container-fluid-center">
      <SkipToMain targetId="skills-main-content" />
      
      <header id="skills-header" style={{ width: '100%', height: '100vh' }}>
        <div id="skills-hero-container">
          <div id="skills-hero">
            <SkillsHero />
          </div>
        </div>
      </header>

      <main id="skills-main-content">
        
        {/* Intro Section */}
        <FadeInWhenVisible
          as="section"
          id="skills-intro-section"
          y={20}
          duration={0.6}>
          <div id="skills-intro-container">
            {/* <h1>&#60;Technical Expertise /&#62;</h1> */}
            <h1>&#60;Technical Expertise /&#62;</h1>
            <p>
              From backend architecture to interactive 3D experiences, I bring a diverse skill set
              focused on building scalable, innovative solutions. Here's what I bring to the table.
            </p>
          </div>
        </FadeInWhenVisible>

        {/* Tech Stack Grid */}
        <FadeInWhenVisible
          as="section"
          id="skills-tech-section"
          y={20}
          duration={0.6}>
        <div id='logo-loop-container'>
          <div id='logo-loop-inner'>
            <LogoLoop logos={Object.values(IconList)}
              speed={60}
              direction="left"
              logoHeight={3}
              gap={40}
              maxCopies={2}
              pauseOnHover
              scaleOnHover
              fadeOut
              fadeOutColor='var(--color-bg)'
              ariaLabel="Technology"/>
          </div>
        </div>
          <SkillsTechStack />
        </FadeInWhenVisible>

        {/* Signoff */}
        <FadeInWhenVisible
          id="skills-signoff"
          y={20}
          duration={0.6}>
          <p>
            These aren't just tools, they're the building blocks of immersive, scalable experiences.
            Let's put them to work.
          </p>
        </FadeInWhenVisible>

        {/* CTA */}
        <div id="skills-cta-btn-container" className='mt-1'>
          <BaseButton
            variant="primary"
            size="md"
            to="/projects"
            ariaLabel="Explore my work projects via the projects section"
          >
            Explore My Work
          </BaseButton>

          <BaseButton
            variant="primary"
            size="md"
            to="/about"
            ariaLabel="Learn more about me via the about me section"
          >
            Learn About Me
          </BaseButton>

          <BaseButton
            variant="primary"
            size="md"
            onClick={openContactAside}
            ariaLabel="Lets connect via the contact panel"
          >
            Lets Connect
          </BaseButton>
        </div>
      </main>
    </div>
  );
};

export default Skills;
