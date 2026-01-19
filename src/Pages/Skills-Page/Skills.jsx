/**
 * Skills Page - Tech stack showcase with logo carousel and interactive skill cards
 */

import BaseButton from '../../Components/UI/BaseButton/BaseButton.jsx';
import SkipToMain from '../../Components/UI/SkipToMain/SkipToMain.jsx';
import FadeInWhenVisible from '../../Components/Effects/Fade-Effect/FadeIn.jsx';
import SkillsTechStack from './Skills-Components/SkillsTechStack/SkillsTechStack';
import LogoLoop from '../../Components/UI/LogoLoop/LogoLoop.jsx';
import { IconList } from '../../DataSets/ProgrammingIcons/Icons';
import { useContactAside } from '../../Context/Aside-Context/useContactAside';
import './../../Styles/Page-Styles/Skills-Styles/SkillsStyles.css';
import PageHero from '../../Components/UI/PageHero/PageHero.jsx';

const headerStyle = { width: '100%', height: '100vh' };

const Skills = () => {
  const { openContactAside } = useContactAside();
  return (
    <div id="skills-container">
      <SkipToMain targetId="skills-main-content" />
      
      <header id="skills-header" style={headerStyle}>
        <div id="skills-hero-container">
          <div id="skills-hero">
            <PageHero
              id="skills-hero"
              title="My Skills"
              subtitle="Core technologies and tools I use to craft immersive, scalable solutions."
            />
          </div>
        </div>
      </header>

      <main id="skills-main-content">
        
        {/* Intro Section */}
        <FadeInWhenVisible
          as="section"
          id="skills-intro-section"
          className="util-text-center util-w-full util-flex util-justify-center"
          y={20}
          duration={0.6}>
          <div id="skills-intro-container">
            <h1>Technical Expertise</h1>
            <p className="util-max-w-compact">
              From backend architecture to interactive 3D experiences, I bring a diverse skill set
              focused on building scalable, innovative solutions. Here's what I bring to the table.
            </p>
          </div>
        </FadeInWhenVisible>

        {/* Tech Stack Grid */}
        <FadeInWhenVisible
          as="section"
          id="skills-tech-section"
          className="util-w-full"
          y={20}
          duration={0.6}>
        <div id='logo-loop-container' className='util-flex util-justify-center'>
          <div id='logo-loop-inner' className='util-w-full'>
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
        <div id="skills-cta-btn-container" className='util-mt-sm util-flex util-justify-center util-flex-wrap'>
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
