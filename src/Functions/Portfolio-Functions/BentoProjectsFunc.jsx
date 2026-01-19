// src/Functions/Portfolio-Functions/BentoProjectsFunc.jsx
import PropTypes from 'prop-types';
import { motion } from 'motion/react';
import BentoCard from './BentoCardFunc';
import './../../Styles/General-Styles/Functions/Portfolio-Functions/BentoProjectsFunctionStyles.css';

/** BentoProjects - Masonry-style bento grid layout for project cards */

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
        logoOverlay={project.logoOverlay}
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
        eagerLoad={index < 4}
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