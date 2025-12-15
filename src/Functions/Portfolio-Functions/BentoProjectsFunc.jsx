// src/Functions/Portfolio-Functions/BentoProjectsFunc.jsx
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import BentoCard from './BentoCardFunc';
import './../../Styles/General-Styles/Functions/Portfolio-Functions/BentoProjectsFunctionStyles.css';

/**
 * BentoProjects - Masonry-style bento grid layout for project cards
 * 
 * Displays projects in a Pinterest-style bento grid with varied card sizes
 * for visual interest. Adapts pattern based on project count and includes
 * staggered entrance animations.
 * 
 * Features:
 * - Dynamic bento patterns (small/medium/large collections)
 * - Varied card sizes: bento-large, bento-medium, bento-small, bento-wide, bento-tall
 * - Staggered entrance animations (0.08s delay between cards)
 * - Category badges (Personal/Professional) when mixed
 * - Empty state with helpful message
 * - Framer Motion animations
 * - Responsive grid (CSS Grid with auto-placement)
 * 
 * Bento Patterns:
 * - Small (1-3 projects): 1 large, 2 medium
 * - Medium (4-8 projects): 8 cards (2 large, 3 medium, 1 wide, 2 small)
 * - Large (9+ projects): 18-card repeating pattern with balanced variety
 * 
 * Card Sizes:
 * - bento-large: 2x2 grid cells (featured emphasis)
 * - bento-wide: 2x1 grid cells (horizontal)
 * - bento-tall: 1x2 grid cells (vertical)
 * - bento-medium: 1x1 grid cell (standard)
 * - bento-small: 1x1 grid cell (compact)
 * 
 * @component
 * @param {Object} props
 * @param {Array<Object>} props.projects - Array of project objects to display
 * @param {Function} props.onProjectClick - Handler for project card clicks
 * 
 * @example
 * <BentoProjects
 *   projects={filteredProjects}
 *   onProjectClick={(project) => setSelectedProject(project)}
 * />
 */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' }
  },
};

// Bento layout patterns for different project counts
const getBentoPattern = (projectCount) => {
  // Define size classes for bento layout - better distribution
  const patterns = {
    // Small collection (1-3 projects)
    small: [
      'bento-large', 'bento-medium', 'bento-medium'
    ],
    // Medium collection (4-8 projects)
    medium: [
      'bento-large', 'bento-medium', 'bento-small',
      'bento-wide', 'bento-large', 'bento-medium',
      'bento-small', 'bento-medium'
    ],
    // Large collection (9+ projects) - more balanced with additional large cards
    large: [
      'bento-large', 'bento-medium', 'bento-small',
      'bento-small', 'bento-wide', 'bento-large',
      'bento-small', 'bento-tall', 'bento-small',
      'bento-medium', 'bento-large', 'bento-wide',
      'bento-small', 'bento-medium', 'bento-small',
      'bento-large', 'bento-small', 'bento-medium'
    ]
  };

  if (projectCount <= 3) return patterns.small;
  if (projectCount <= 8) return patterns.medium;
  return patterns.large;
};

export default function BentoProjects({ projects = [], onProjectClick }) {
  if (!projects.length) {
    return (
      <div className="no-results bento-no-results" role="status">
        <div className="no-results-content">
          <h3>No projects found</h3>
          <p>No projects match your current filters.</p>
          <p>Try adjusting your search or removing some filters.</p>
        </div>
      </div>
    );
  }

  const bentoPattern = getBentoPattern(projects.length);
  // Remove the complex getFeaturedProjects logic - we'll check featured directly
  
  // Determine if we should show category badges
  // Only show them if there's a mix of personal and professional projects
  const hasPersonal = projects.some(p => p.isPersonal);
  const hasProfessional = projects.some(p => !p.isPersonal);
  const showCategoryBadges = hasPersonal && hasProfessional;

  return (
    <div className="bento-projects-container">
      <motion.div
        className="bento-grid"
        role="list"
        aria-label="Projects in bento layout"
        initial="visible"
        animate="visible"
        variants={containerVariants}
      >
{projects.map((project, index) => {
  const isFeatured = project.featured === true;
  let sizeClass;

  if (isFeatured) {
    sizeClass = 'bento-large';
  } else {
    // Alternate between medium and wide for non-featured
    sizeClass = index % 2 === 0 ? 'bento-tall' : 'bento-medium';
  }

  return (
    <motion.div
      role="listitem"
      key={project.id || project.title}
      className={`bento-item ${sizeClass} ${isFeatured ? 'bento-featured' : ''}`}
      variants={itemVariants}
    >
      <BentoCard
        title={project.title}
        description={project.description}
        coverImage={project.coverImage}
        media={project.media}
        techs={project.body?.techs || []}
        onClick={() => onProjectClick(project)}
        size={sizeClass}
        isFeatured={isFeatured}
        type={project.type}
        isPersonal={project.isPersonal}
        showCategoryBadge={showCategoryBadges}
        personalText="Personal"
        professionalText="Professional"
      />
    </motion.div>
  );
})}
      </motion.div>
    </div>
  );
}

BentoProjects.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.object).isRequired,
  onProjectClick: PropTypes.func.isRequired,
};