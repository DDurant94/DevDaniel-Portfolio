/**
 * About Me Page - Personal introduction with workflow, services, and testimonials
 */

import AboutIntro from "./AboutMe-Components/Intro/AboutIntro";
import Workflow from "./AboutMe-Components/Workflow/Workflow";
import Services from "./AboutMe-Components/Services/Services";
import Testimonials from "./AboutMe-Components/Testimonials/Testimonials";
import FadeInWhenVisible from "./../../Components/Effects/Fade-Effect/FadeIn";
import SkipToMain from '../../Components/UI/SkipToMain/SkipToMain';

import './../../Styles/Page-Styles/AboutMe-Styles/AboutMeStyles.css';
import PageHero from '../../Components/UI/PageHero/PageHero.jsx';

const headerStyle = { width: '100%', height: '100vh' };

const AboutMe = () => {
  return (
    <div id="about-container">
      <SkipToMain targetId="about-main-content" />
      
      <header id="about-header" style={headerStyle}>
        <div id="about-hero-container">
          <div id="about-hero">
            <PageHero
              id="about-hero"
              title="About Me"
              subtitle="Crafting thoughtful software & immersive experiences."
            />
          </div>
        </div>
      </header>

      <main id="about-main-content">
        {/* Intro Section */}
        <section 
          id="about-intro-section" 
          className="util-p-sm"
          aria-labelledby="intro-heading"
        >
          <FadeInWhenVisible as="div">
            <AboutIntro />
          </FadeInWhenVisible>
        </section>

        {/* Process Section */}
        <section 
          id="about-process-section" 
          className="util-mt-md"
          aria-labelledby="process-heading"
        >
          <FadeInWhenVisible as="div" className="section-intro">
            <h2 id="process-heading">How I Work</h2>
            <p>
              From initial consultation to final deployment, I build software that's scalable, intuitive, 
              and tailored to real-world needs. Here's how I approach development—and what I bring to the table.
            </p>
          </FadeInWhenVisible>

          <Workflow />
          <Services />
        </section>

        {/* Testimonials Section */}
        <section 
          id="about-testimonials-section" 
          className="util-mt-md"
          aria-labelledby="testimonials-heading"
        >
          <FadeInWhenVisible as="div" className="section-intro">
            <h2 id="testimonials-heading">What People Say</h2>
            <p>
              Don't just take my word for it—here's what colleagues and clients have to say about working with me.
            </p>
          </FadeInWhenVisible>

          <FadeInWhenVisible as="div">
            <Testimonials />
          </FadeInWhenVisible>
        </section>

        {/* Signoff */}
        <FadeInWhenVisible 
          id="about-signoff"
          tabIndex="0" 
          role="contentinfo"
          aria-label="Closing statement"
        >
          <p className="signoff-line">Let's build something that feels as good as it works.</p>
          <p className="signoff-name">—Daniel Durant</p>
        </FadeInWhenVisible>
      </main>
    </div>
  );
};

export default AboutMe;


