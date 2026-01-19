import useResumeViewer from '../../../../Hooks/Utility-Hooks/useResumeViewer.hook';
import BaseButton from '../../../../Components/UI/BaseButton/BaseButton.jsx';
import LazyImage from '../../../../Components/UI/LazyImage/LazyImage';
import FadeInWhenVisible from "./../../../../Components/Effects/Fade-Effect/FadeIn";
import './../../../../Styles/Page-Styles/Home-Styles/Intro-Styles/HomeIntroStyles.css';

import Logo from './../../../../Assets/Photos/Logo.webp';

/**
 * HomeIntro - Home page introduction section
 * 
 * Displays the main value proposition with tagline, description, and action buttons.
 * Uses FadeInWhenVisible for scroll-triggered animations. Includes navigation to
 * projects/skills pages and resume viewer modal.
 * 
 * Features:
 * - Fade-in scroll animations (nested)
 * - Primary heading with brand message
 * - Descriptive body text (services/expertise)
 * - Three action buttons (My Work, My Skills, Resume)
 * - Resume opens in fullscreen modal viewer
 * - Semantic HTML structure
 * - Accessibility (tabIndex, aria-labels)
 * 
 * Content:
 * - Heading: "Building systems that move ideas forward"
 * - Body: Describes API, ML, UI, and 3D expertise
 * - Focus: Performance, clarity, adaptability, maintainability
 * 
 * Actions:
 * 1. My Work → /projects
 * 2. My Skills → /skills
 * 3. Resume → Opens fullscreen PDF viewer
 * 
 * @component
 * @example
 * <Intro />
 */
const Intro = () => {
  const { openResume } = useResumeViewer();

  return (

    <FadeInWhenVisible as="div" id="home-intro-container" className="util-text-center util-flex-col-center-all" tabIndex="0" aria-labelledby="home-intro-heading">
      <FadeInWhenVisible as="div" className="home-intro-header-container util-text-center" >
        <h2 id="home-intro-heading" className="home-section-header">Building systems that move ideas forward</h2>
      </FadeInWhenVisible>


      <FadeInWhenVisible as="p" className='home-intro-body-text util-max-w-readable'>
        I design and implement solutions where performance, clarity, and adaptability matter. From API orchestration and ML-assisted document pipelines to modern UI flows and 3D interfaces—I focus on maintainability and measurable impact.
      </FadeInWhenVisible>

      <div className='home-logo-container util-my-md util-flex-center'>
        <div className='home-logo'>
          <LazyImage
            src={Logo}
            alt='Daniel Durant Logo'
            className='home-intro-logo-img img-fluid mx-auto'
            fadeIn={false}
            threshold={0}
            rootMargin="0px"
            width="250"
            height="250"
          />
        </div>
      </div>

      <div className="home-intro-btn-container util-flex util-justify-center util-flex-wrap" >
        <BaseButton
          variant="primary"
          size="md"
          to="/projects"
          ariaLabel="Explore my work projects via the projects section"
        >
          My Work
        </BaseButton>

        <BaseButton
          variant="primary"
          size="md"
          to="/skills"
          ariaLabel="Explore my skills section via the skills page"
        >
          My Skills
        </BaseButton>
          <button type="button" className="base-btn btn-variant-outline" onClick={openResume}>Resume</button>
      </div>
    </FadeInWhenVisible>
  );
};

export default Intro;
