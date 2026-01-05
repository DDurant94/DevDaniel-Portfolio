// src/Functions/Portfolio-Functions/BentoCardFunc.jsx
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import useLazyLoad from '../../Hooks/Utility-Hooks/useLazyLoad';
import { getMediaType } from '../../Utils/mediaHelpers.js';
import './../../Styles/General-Styles/Functions/Portfolio-Functions/BentoCardFunctionStyles.css';

/**
 * BentoCard - Individual project card for bento grid layout
 * 
 * Displays a project with image, title, description, tech stack, and badges.
 * Supports multiple size variants (small/medium/large/wide/tall) with adaptive
 * content display. Includes hover effects, keyboard navigation, and accessibility.
 * 
 * Features:
 * - 5 size variants (small, medium, large, wide, tall)
 * - Responsive content based on size
 * - Tech stack with overflow indicator (+N)
 * - Type badge (first type from array)
 * - Category badge (Personal/Professional)
 * - Featured state styling
 * - Framer Motion hover/tap effects
 * - Background image with overlay
 * - Gradient overlay for text readability
 * - Keyboard activation (Enter/Space)
 * - ARIA attributes
 * - Hover indicator arrow
 * 
 * Size-Based Content:
 * - bento-large: Full description, 4 techs
 * - bento-wide/tall: Truncated description (100 chars), 3 techs
 * - bento-medium: Truncated description, 3 techs
 * - bento-small: No description, 2 techs
 * 
 * Badges:
 * - Type badge: First type (truncated at 30 chars)
 * - Category badge: Personal/Pro (only when showCategoryBadge=true)
 * 
 * Animations:
 * - Hover: translateY(-4px), scale(1.02), spring animation
 * - Tap: scale(0.98)
 * 
 * @component
 * @param {Object} props
 * @param {string} props.title - Project title (required)
 * @param {string} props.description - Project description
 * @param {string} props.coverImage - Primary image URL
 * @param {string} props.logoOverlay - Optional SVG logo to overlay on coverImage
 * @param {Array<{src: string, alt: string}>} props.media - Additional images
 * @param {string[]} props.techs - Technologies used
 * @param {Function} props.onClick - Click handler
 * @param {string} props.size - Card size ('bento-small'|'bento-medium'|'bento-large'|'bento-wide'|'bento-tall')
 * @param {boolean} props.isFeatured - Featured project flag
 * @param {string|string[]} props.type - Project type(s)
 * @param {boolean} props.isPersonal - Personal vs professional project
 * @param {boolean} props.showCategoryBadge - Show category badge (default: true)
 * @param {string} props.personalText - Personal badge text (default: 'Personal')
 * @param {string} props.professionalText - Professional badge text (default: 'Pro')
 * 
 * @example
 * <BentoCard
 *   title="AI Image Grader"
 *   description="Upload. Analyze. Grade..."
 *   coverImage="/images/project.jpg"
 *   techs={['React', 'TypeScript', 'Express']}
 *   onClick={() => openOffCanvas(project)}
 *   size="bento-large"
 *   type={['AI/ML Engineering', 'Full-Stack']}
 *   isPersonal={false}
 * />
 */
export default function BentoCard({
  title,
  description,
  coverImage,
  logoOverlay, // Optional SVG logo to overlay on video/image
  media = [],
  techs = [],
  onClick = () => {},
  size = 'bento-medium',
  isFeatured = false,
  type = '',
  isPersonal = false,
  showCategoryBadge = true, // New prop to control when to show category
  personalText = 'Personal', // Customizable text
  professionalText = 'Pro', // Customizable text
  eagerLoad = false, // Load immediately (for first few cards)
}) {
  // Lazy load hook - load media when card enters viewport
  const { ref, hasIntersected } = useLazyLoad({ 
    rootMargin: '200px', // Start loading 200px before entering viewport
    threshold: 0.01 
  });

  // Limit displayed techs based on card size
  const techLimit = size === 'bento-large' ? 4 : size === 'bento-small' ? 2 : 3;
  const displayedTechs = techs.slice(0, techLimit);
  const remainingCount = Math.max(techs.length - techLimit, 0);
  const primaryMedia = coverImage || (media.length > 0 ? media[0]?.src : null);
  
  const mediaType = getMediaType(primaryMedia);
  const shouldLoad = eagerLoad || hasIntersected;

  // Show description only on larger cards
  const showDescription = size === 'bento-large' || size === 'bento-wide' || size === 'bento-tall' || size==='bento-medium';
  
  // Truncate description for medium cards
  const truncatedDescription = description && description.length > 200 
    ? description.substring(0, 200) + '...'
    : description;

  // Get the first type for display
  const displayType = Array.isArray(type) ? type[0] : type;
  
  // Truncate type if too long - more generous limit
  const truncatedType = displayType && displayType.length > 30 
    ? displayType.substring(0, 30) + '...' 
    : displayType;

  return (
    <motion.div
      ref={ref}
      className={`bento-card ${size} ${isFeatured ? 'featured' : ''} ${isPersonal ? 'personal' : 'professional'}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      whileHover={{
        y: -4,
        scale: 1.02,
        transition: { type: 'spring', stiffness: 300, damping: 30 },
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Badge Container */}
      <div className="bento-card__badges">
        {/* Project Type Badge */}
        {truncatedType && (
          <div className="bento-card__type-badge">
            {truncatedType}
          </div>
        )}

        {/* Personal/Professional Indicator - only show when meaningful */}
        {showCategoryBadge && (
          <div className={`bento-card__category ${isPersonal ? 'personal' : 'professional'}`}>
            {isPersonal ? personalText : professionalText}
          </div>
        )}
      </div>

      {/* Background Image/Video */}
      {primaryMedia && shouldLoad && (
        <div className="bento-card__image-container">
          {mediaType === 'video' ? (
            <video
              className="bento-card__image"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              disablePictureInPicture
            >
              <source src={primaryMedia} type="video/mp4" />
              {/* Fallback for WebM */}
              <source src={primaryMedia.replace('.mp4', '.webm')} type="video/webm" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={primaryMedia}
              alt={title}
              className="bento-card__image"
              loading={eagerLoad ? "eager" : "lazy"}
            />
          )}
          
          {/* Logo Overlay (if provided) */}
          {logoOverlay && (
            <img
              src={logoOverlay}
              alt={`${title} Logo`}
              className="bento-card__logo-overlay"
              loading={eagerLoad ? "eager" : "lazy"}
            />
          )}
          
          <div className="bento-card__image-overlay"></div>
        </div>
      )}
      
      {/* Placeholder for unloaded media */}
      {primaryMedia && !shouldLoad && (
        <div className="bento-card__image-container bento-card__image-placeholder">
          <div className="bento-card__image-overlay"></div>
        </div>
      )}

      {/* Content */}
      <div className="bento-card__content">
        <div className="bento-card__header">
          <h3 className="bento-card__title">{title}</h3>
          {showDescription && description && (
            <p className="bento-card__description">
              {size === 'bento-large' ? description : truncatedDescription}
            </p>
          )}
        </div>

        {/* Tech Stack */}
        {techs.length > 0 && (
          <div className="bento-card__tech-container">
            <ul className="bento-card__tech-list">
              {displayedTechs.map((tech) => (
                <li key={tech} className="bento-card__tech-item">
                  {tech}
                </li>
              ))}
              {remainingCount > 0 && (
                <li className="bento-card__tech-item bento-card__tech-more">
                  +{remainingCount}
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Hover Indicator */}
        <div className="bento-card__hover-indicator">
          <i className="bi bi-arrow-up-right" aria-hidden="true"></i>
        </div>
      </div>

      {/* Gradient Overlay for better text readability */}
      <div className="bento-card__gradient-overlay"></div>
    </motion.div>
  );
}

BentoCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  coverImage: PropTypes.string,
  logoOverlay: PropTypes.string, // SVG logo overlay
  media: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string.isRequired,
      alt: PropTypes.string,
    })
  ),
  techs: PropTypes.arrayOf(PropTypes.string),
  onClick: PropTypes.func,
  size: PropTypes.oneOf(['bento-small', 'bento-medium', 'bento-large', 'bento-wide', 'bento-tall']),
  isFeatured: PropTypes.bool,
  type: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  isPersonal: PropTypes.bool,
  showCategoryBadge: PropTypes.bool,
  personalText: PropTypes.string,
  professionalText: PropTypes.string,
  eagerLoad: PropTypes.bool,
};