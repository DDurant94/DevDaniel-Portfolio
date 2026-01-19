import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/** LazyImage - Performance-optimized image component with Intersection Observer lazy loading */

const LazyImage = ({ 
  src, 
  webpSrc,
  alt, 
  className = '',
  placeholderSrc,
  threshold = 0.1,
  rootMargin = '50px',
  fadeIn = true,
  width,
  height,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const currentImg = imgRef.current;
    if (!currentImg) return;

    // Create Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(currentImg);

    return () => {
      if (currentImg) {
        observer.unobserve(currentImg);
      }
    };
  }, [threshold, rootMargin]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const imgStyle = {
    opacity: fadeIn ? (isLoaded ? 1 : 0) : 1,
    transition: fadeIn ? 'opacity var(--ease-duration-4) var(--ease-smooth)' : 'none'
  };

  return (
    <picture ref={imgRef} className={className} style={{ display: 'contents' }}>
      {/* WebP source if provided */}
      {webpSrc && isInView && (
        <source srcSet={webpSrc} type="image/webp" />
      )}
      
      {/* Fallback image */}
      <img
        src={isInView ? src : placeholderSrc || src}
        alt={alt}
        className={className}
        loading="lazy"
        onLoad={handleLoad}
        style={imgStyle}
        width={width}
        height={height}
        {...props}
      />
    </picture>
  );
};

LazyImage.propTypes = {
  src: PropTypes.string.isRequired,
  webpSrc: PropTypes.string,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  placeholderSrc: PropTypes.string,
  threshold: PropTypes.number,
  rootMargin: PropTypes.string,
  fadeIn: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default LazyImage;
