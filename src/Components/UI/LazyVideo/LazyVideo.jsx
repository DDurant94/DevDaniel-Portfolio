import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/** LazyVideo - Performance-optimized video component with Intersection Observer lazy loading */

const LazyVideo = ({ 
  src,
  poster,
  className = '',
  threshold = 0.5,
  rootMargin = '0px',
  autoplay = true,
  pauseWhenOutOfView = false,
  preload = 'none',
  loop = true,
  muted = true,
  playsInline = true,
  controls = false,
  ...props 
}) => {
  const [isInView, setIsInView] = useState(false);
  const [shouldPlay, setShouldPlay] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const currentVideo = videoRef.current;
    if (!currentVideo) return;

    // Create Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            setShouldPlay(true);
          } else if (pauseWhenOutOfView) {
            setShouldPlay(false);
          }
        });
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(currentVideo);

    return () => {
      if (currentVideo) {
        observer.unobserve(currentVideo);
      }
    };
  }, [threshold, rootMargin, pauseWhenOutOfView]);

  useEffect(() => {
    const currentVideo = videoRef.current;
    if (!currentVideo) return;

    if (shouldPlay && autoplay) {
      currentVideo.play().catch(() => {
        // Autoplay failed, likely due to browser policy
        // User interaction required
      });
    } else if (!shouldPlay && pauseWhenOutOfView) {
      currentVideo.pause();
    }
  }, [shouldPlay, autoplay, pauseWhenOutOfView]);

  return (
    <video
      ref={videoRef}
      className={className}
      poster={poster}
      preload={isInView ? preload : 'none'}
      loop={loop}
      muted={muted}
      playsInline={playsInline}
      controls={controls}
      {...props}
    >
      {isInView && <source src={src} type="video/mp4" />}
      Your browser does not support the video tag.
    </video>
  );
};

LazyVideo.propTypes = {
  src: PropTypes.string.isRequired,
  poster: PropTypes.string,
  className: PropTypes.string,
  threshold: PropTypes.number,
  rootMargin: PropTypes.string,
  autoplay: PropTypes.bool,
  pauseWhenOutOfView: PropTypes.bool,
  preload: PropTypes.oneOf(['none', 'metadata', 'auto']),
  loop: PropTypes.bool,
  muted: PropTypes.bool,
  playsInline: PropTypes.bool,
  controls: PropTypes.bool
};

export default LazyVideo;
