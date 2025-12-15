

import BaseButton from '../../../../Components/UI/BaseButton/BaseButton.jsx';
import FadeInWhenVisible from "./../../../../Components/Effects/Fade-Effect/FadeIn";
import './../../../../Styles/Page-Styles/Home-Styles/Intro-Styles/HomeIntroStyles.css';

/**
 * handleResumeClick - Opens and downloads resume PDF
 * 
 * Opens resume in new tab for viewing, then triggers download.
 * Creates temporary link element for download functionality.
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

/**
 * HomeIntro - Home page introduction section
 * 
 * Displays the main value proposition with tagline, description, and action buttons.
 * Uses FadeInWhenVisible for scroll-triggered animations. Includes navigation to
 * projects/skills pages and resume download.
 * 
 * Features:
 * - Fade-in scroll animations (nested)
 * - Primary heading with brand message
 * - Descriptive body text (services/expertise)
 * - Three action buttons (My Work, My Skills, Resume)
 * - Resume dual action (open + download)
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
 * 3. Resume → Opens PDF in new tab + downloads
 * 
 * @component
 * @example
 * <Intro />
 */
const Intro = () => {
  return (

    <FadeInWhenVisible as="div" id="home-intro-container" tabIndex="0"  >
      <FadeInWhenVisible as="div" className="home-intro-header-container" >
        <h2 id="home-intro-heading" className="home-section-header">Building systems that move ideas forward</h2>
      </FadeInWhenVisible>


      <FadeInWhenVisible as="p" className='home-intro-body-text'>
        I design and implement solutions where performance, clarity, and adaptability matter. From API orchestration and ML-assisted document pipelines to modern UI flows and 3D interfaces—I focus on maintainability and measurable impact.
      </FadeInWhenVisible>

      <div className="home-intro-btn-container" >
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
          <button className="base-btn btn-variant-outline" onClick={handleResumeClick}>Resume</button>
      </div>
    </FadeInWhenVisible>
  );
};

export default Intro;
