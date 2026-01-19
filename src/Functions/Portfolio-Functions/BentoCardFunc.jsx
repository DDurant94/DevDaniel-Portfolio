// src/Functions/Portfolio-Functions/BentoCardFunc.jsx
import PropTypes from 'prop-types';
import { motion } from 'motion/react';
import { useIntersection } from '../../Hooks/Effect-Hooks/useIntersection';
import { getMediaType } from '../../Utils/mediaHelpers.js';
import LazyImage from '../../Components/UI/LazyImage/LazyImage';
import LazyVideo from '../../Components/UI/LazyVideo/LazyVideo';
import './../../Styles/General-Styles/Functions/Portfolio-Functions/BentoCardFunctionStyles.css';

/** BentoCard - Individual project card for bento grid layout */

export default function BentoCard({
  title,
  description,
  coverImage,
  logoOverlay,
  media = [],
  techs = [],
  onClick = () => {},
  size = 'bento-medium',
  isFeatured = false,
  type = '',
  isPersonal = false,
  showCategoryBadge = true,
  personalText = 'Personal',
  professionalText = 'Pro',
  eagerLoad = false,
}) {
  const { ref, hasIntersected } = useIntersection({ 
    rootMargin: '200px',
    threshold: 0.01 
  });

  const techLimit = size === 'bento-large' ? 4 : size === 'bento-small' ? 2 : 3;
  const displayedTechs = techs.slice(0, techLimit);
  const remainingCount = Math.max(techs.length - techLimit, 0);
  const primaryMedia = coverImage || (media.length > 0 ? media[0]?.src : null);
  
  const mediaType = getMediaType(primaryMedia);
  const shouldLoad = eagerLoad || hasIntersected;

  const showDescription = size === 'bento-large' || size === 'bento-wide' || size === 'bento-tall' || size==='bento-medium';
  
  const truncatedDescription = description && description.length > 200 
    ? description.substring(0, 200) + '...'
    : description;

  const displayType = Array.isArray(type) ? type[0] : type;
  
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
            <LazyVideo
              src={primaryMedia}
              className="bento-card__image"
              autoplay={true}
              loop={true}
              muted={true}
              playsInline={true}
              pauseWhenOutOfView={true}
              threshold={eagerLoad ? 0 : 0.1}
              rootMargin={eagerLoad ? "0px" : "200px"}
            />
          ) : (
            <LazyImage
              src={primaryMedia}
              webpSrc={primaryMedia.match(/\.(jpg|jpeg|png)$/i) ? primaryMedia.replace(/\.(jpg|jpeg|png)$/i, '.webp') : undefined}
              alt={title}
              className="bento-card__image"
              fadeIn={!eagerLoad}
              threshold={eagerLoad ? 0 : 0.1}
              rootMargin={eagerLoad ? "0px" : "200px"}
            />
          )}
          
          {/* Logo Overlay (if provided) */}
          {logoOverlay && (
            <LazyImage
              src={logoOverlay}
              alt={`${title} Logo`}
              className="bento-card__logo-overlay"
              fadeIn={false}
              threshold={eagerLoad ? 0 : 0.1}
              rootMargin={eagerLoad ? "0px" : "200px"}
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
          <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0v-6z"/>
          </svg>
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
  logoOverlay: PropTypes.string,
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