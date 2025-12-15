/**
 * Featured Projects Section Component
 * 
 * @description Showcases featured projects with carousel and fallback grid layouts.
 * Provides progressive enhancement with carousel for modern browsers and static
 * grid for no-JS/SEO scenarios.
 * 
 * Features:
 * - Auto-playing carousel for featured projects
 * - No-JS fallback with static grid (SEO-friendly)
 * - Hidden fallback grid for accessibility
 * - Carousel index tracking
 * - Project selection callbacks
 * - Progressive enhancement strategy
 * 
 * Rendering Strategy:
 * 1. Primary: Interactive carousel (JavaScript enabled)
 * 2. Fallback: <noscript> static grid (no JavaScript)
 * 3. Hidden: Visually hidden grid for screen readers
 * 
 * @component
 * @param {Object} props
 * @param {Function} props.onSelectProject - Callback when project is selected from carousel
 * 
 * @requires motion/react-client - Framer Motion for scroll animations
 * @requires FeaturedProjectsCarousel - Interactive carousel component
 * @requires Projects dataset - Featured projects data
 * 
 * @example
 * ```jsx
 * <FeaturedProjects onSelectProject={(project) => console.log(project)} />
 * ```
 */

import { useMemo, useState } from 'react';
import * as motion from 'motion/react-client';
import { allProjects } from '../../../../DataSets/Portfolio/Projects';
import FeaturedProjectsCarousel from './FeaturedProjectsCarousel';
import BaseButton from '../../../../Components/UI/BaseButton/BaseButton.jsx';
import '../../../../Styles/Page-Styles/Home-Styles/FeaturedProjects-Styles/FeaturedProjectsSectionStyles.css';


// Section that can show either a carousel, a grid, or both (carousel primary, grid fallback for no-JS / SEO)
const FeaturedProjects = ({ onSelectProject }) => {
  const [carouselIndex, setCarouselIndex] = useState(0);

  const featured = useMemo(() => {
    return allProjects.filter(p => p.featured === true);
  }, []);

  return (
    <>
      <div className="home-featured-projects-head" aria-labelledby="home-featured-projects-heading">
        <h2 id="home-featured-projects-heading">Featured Projects</h2>
        <p className="home-featured-projects-heading-tagline">Select work spanning AI, automation, and platform engineering.</p>
      </div>

      <div className="home-featured-carousel-wrapper">
        <FeaturedProjectsCarousel
          index={carouselIndex}
            onSelect={(i) => setCarouselIndex(i)}
          onDetails={onSelectProject}
        />
      </div>

      <noscript>
        <div className="project-grid noscript-grid">
          {featured.map(project => (
            <article key={project.title} className="project-card">
              <div className="project-media-wrapper">
                <img src={project.coverImage} alt={`${project.title} cover`} className='img-fluid mx-auto' />
              </div>
              <div className="project-content container-fluid-center mx-4">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-desc">{project.description}</p>
              </div>
            </article>
          ))}
        </div>
      </noscript>

      <div className="grid-fallback visually-hidden" aria-hidden="true">
        {featured.map(project => (
          <motion.article
            key={project.title}
            className="project-card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-25% 0px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className="project-media-wrapper">
              <img src={project.coverImage} alt="" aria-hidden="true" width="320" height="180" />
            </div>
            <div className="project-content">
              <h3 className="project-title">{project.title}</h3>
              <p className="project-desc">{project.description}</p>
            </div>
          </motion.article>
        ))}
      </div>

    </>
  );
};

export default FeaturedProjects;
