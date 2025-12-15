/**
 * Services Section Component
 * 
 * @description Full services showcase using scroll-stacking effect with all service offerings.
 * Features window-based scroll animations and CTAs to projects and skills pages.
 * 
 * Features:
 * - Scroll-stacking animation (cards stack and reveal as you scroll)
 * - Window scroll integration (works with Lenis global smoothing)
 * - All services displayed (not truncated like home preview)
 * - Fade-in header with value proposition
 * - Dual CTAs: "Explore My Work" and "Explore Skills"
 * - Contact aside integration
 * - Semantic accessibility (headings, ARIA labels)
 * 
 * Technical Notes:
 * - Uses useWindowScroll to avoid conflicts with Lenis smooth scrolling
 * - ScrollStackItem components auto-stack with perspective transforms
 * - Previous commented code shows alternative StackedScrollCards approach
 * 
 * @component
 * @requires ScrollStack - Scroll-stacking container component
 * @requires ScrollStackItem - Individual stacking card wrapper
 * @requires FadeInWhenVisible - Scroll-triggered fade animation
 * @requires ContactAsideContext - Contact panel control
 * @requires Services dataset - Service offerings data
 * 
 * @example
 * ```jsx
 * <Services />
 * ```
 */

import { useContactAside } from "../../../../Context/Aside-Context/ContactAsideContext";
import BaseButton from '../../../../Components/UI/BaseButton/BaseButton.jsx';
import { services } from "./../../../../DataSets/About/Services";
import FadeInWhenVisible from "./../../../../Components/Effects/Fade-Effect/FadeIn.jsx";
import ScrollStack, { ScrollStackItem } from './../../../../Components/UI/ScrollStack/ScrollStack.jsx';

import './../../../../Styles/Page-Styles/AboutMe-Styles/Services-Styles/ServicesStyles.css';

const Services = () => {
  const { openContactAside } = useContactAside();

  return (
    <section
      id="about-srvs-container"
      className="mt-2 pt-3"
      aria-labelledby="services-heading"
    >
      {/* Header */}
      <FadeInWhenVisible as="header" className="about-srvs-header" id="about-srvs-header" tabIndex="0">
        <h2 id="services-heading" className="my-2">What I Build & Offer</h2>
        <p>
          I craft immersive, scalable, and intelligent web experiences that fuse technical depth with creative vision. 
          Whether you're launching a product, visualizing data, or building a brand, I bring precision and personality to every line of code.
        </p>
      </FadeInWhenVisible>

      {/* Services: stacked scroll reveal
      <StackedScrollCards
        containerId="about-srvs-grid"
        ariaLabel="List of services I provide"
        itemClassName="about-srvs-card"
        getItemAriaLabel={(item) => `Service: ${item.title}`}
        items={services}
        renderItem={(item) => (
          <div className="stacked-card-inner">
            <div className="stacked-card-title">
              <h3>{item.title}</h3>
            </div>
            <div className="stacked-card-body">
              <p>{item.desc}</p>
            </div>
          </div>
        )}
      /> */}

      {/* ScrollStack: enable window scroll instead of nested scroll to avoid conflicts with Lenis global smoothing */}
      <ScrollStack useWindowScroll>
        {services.map((item, index) => (
          <ScrollStackItem
            key={index}
            // className="about-srvs-card"
          >
            <h2>{item.title}</h2>
            <p>{item.desc}</p>
          </ScrollStackItem>
        ))}
      </ScrollStack>

      {/* CTA */}
      <FadeInWhenVisible as="div" id="about-srvs-cta-container" tabIndex="0">
        <p id="about-srvs-cta-text">
          If you're looking for a developer who blends <strong>engineering precision</strong> with <strong>creative flair</strong>—check out my projects. Let’s build something remarkable.
        </p>

        <div id="srvs-cta-btn-container" className='mt-1'>
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
            to="/skills"
            ariaLabel="Explore my skills section via the skills page"
          >
            Explore My Skills
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
      </FadeInWhenVisible>
    </section>
  );
};

export default Services;