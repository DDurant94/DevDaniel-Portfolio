import FadeInWhenVisible from "./../../../../Components/Effects/Fade-Effect/FadeIn";
import './../../../../Styles/Page-Styles/AboutMe-Styles/Intro-Styles/AboutIntroStyles.css';

/**
 * AboutIntro - About page introduction section
 * 
 * Personal narrative section introducing background, philosophy, and expertise.
 * Uses nested FadeInWhenVisible components for staggered scroll animations.
 * Includes metaphor lead, technical background, and highlight quote.
 * 
 * Features:
 * - Nested fade-in animations
 * - Semantic HTML tags (h2, p, blockquote)
 * - Personal narrative structure
 * - Technical expertise overview
 * - Code-style heading (&#60;Behind the Code /&#62;)
 * - Highlight quote callout
 * - Accessibility (tabIndex)
 * 
 * Content Structure:
 * 1. Heading: "<Behind the Code />" (code-styled)
 * 2. Metaphor lead: Architecture of experience concept
 * 3. Intro: Systems thinking and AI examples
 * 4. Background: Name, role, tech stack
 * 5. Current work: Website Admin + Marketing Manager
 * 6. Quote: "Great software is more than functional..."
 * 7. Closing: Building systems that feel alive
 * 
 * Technologies Mentioned:
 * - Python, Node.js, Express, React
 * - 3D graphics and animation
 * - Firebase and Google Cloud
 * - AI integration
 * - APIs and microservices
 * 
 * @component
 * @example
 * <AboutIntro />
 */
const AboutIntro = () => {
  return (
    <FadeInWhenVisible as="div" id="about-intro-container" tabIndex="0"  >
      <FadeInWhenVisible as="div" className="intro-header-container" >
        <h2 id="intro-heading" className="section-header">&#60;Behind the Code /&#62;</h2>
      </FadeInWhenVisible>

      <FadeInWhenVisible as="p" className="metaphor-lead">
        Behind every seamless interaction—whether it's a swipe, a search, or a suggestion—
        is a system quietly orchestrating the moment. That's where I live: in the architecture of experience.
      </FadeInWhenVisible>

      <FadeInWhenVisible as="p" className='about-intro-body-text'>
        Have you ever wondered how data flows invisibly across the web, or how AI knows exactly which coffee shop 
        to recommend? I build the systems that make those moments possible; I do it with precision, creativity, 
        and a touch of curiosity.
      </FadeInWhenVisible>

      <FadeInWhenVisible as="p" className='about-intro-body-text'>
        Hi, I'm Daniel—a software engineer, backend specialist, and digital strategist. I thrive on building scalable APIs, 
        integrating AI into real-world applications, and solving complex problems with clean, modular code. 
        My toolbox includes Python, Node.js, Express, React, and a growing arsenal of 3D graphics and animation techniques—
        often deployed through Firebase and Google Cloud.
      </FadeInWhenVisible>

      <FadeInWhenVisible as="p" className='about-intro-body-text'>
        Currently, I work as a Website Administrator and Marketing Manager, where I help businesses sharpen their digital 
        presence and tell their story through technology. But my passion lies deeper—in the architecture behind the interface, 
        the logic beneath the visuals, and the data pipelines that quietly power user experiences.
      </FadeInWhenVisible>

      <FadeInWhenVisible as="blockquote" className="highlight-quote">
        Great software is more than functional—it's immersive, intuitive, and human-centered.
      </FadeInWhenVisible>

      <FadeInWhenVisible as="p" className='about-intro-body-text'>
        Whether I'm debugging a microservice or animating a hero section, I aim to build systems that feel alive.
      </FadeInWhenVisible>
    </FadeInWhenVisible>
  );
};

export default AboutIntro;
