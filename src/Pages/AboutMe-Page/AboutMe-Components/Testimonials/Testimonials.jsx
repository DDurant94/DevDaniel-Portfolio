/**
 * Testimonials Component
 * 
 * @description Displays client testimonials with expandable content in a masonry grid layout.
 * Features include:
 * - Read more/less functionality for long testimonials
 * - 3D card effects with light overlays and shine animations
 * - Responsive masonry layout (2 columns on desktop, 1 on mobile)
 * - Automatic centering for single testimonials
 * - Full accessibility support (ARIA labels, keyboard navigation, focus states)
 * 
 * @component
 * @example
 * ```jsx
 * <Testimonials />
 * ```
 */

import { useState } from 'react';
import { TestimonialData } from '../../../../DataSets/Testimonials/TestimonialData';
import './../../../../Styles/Page-Styles/AboutMe-Styles/Testimonial-Styles/TestimonialStyles.css';

const Testimonials = () => {
  /**
   * Tracks which testimonials are currently expanded
   * @type {Set<number>} Set of testimonial IDs that are expanded
   */
  const [expandedIds, setExpandedIds] = useState(new Set());

  /**
   * Toggles the expansion state of a testimonial
   * @param {number} id - The testimonial ID to toggle
   */
  const toggleExpand = (id) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  /**
   * Truncates testimonial text to first 2 sentences or 200 characters
   * @param {string} text - The full testimonial text
   * @param {boolean} isExpanded - Whether the testimonial is currently expanded
   * @returns {string} Truncated or full text based on expansion state
   */
  const truncateText = (text, isExpanded) => {
    if (isExpanded) return text;
    
    const sentences = text.split(/(?<=[.!?])\s+/);
    if (sentences.length <= 2) return text;
    
    const truncated = sentences.slice(0, 2).join(' ');
    return truncated.length > 200 ? text.substring(0, 200) + '...' : truncated;
  };

  return (
    <div className="testimonials-container">
      <div className="testimonials-grid">
        {TestimonialData.map((testimonial) => {
          const isExpanded = expandedIds.has(testimonial.id);
          const needsTruncation = testimonial.text.length > 200 || testimonial.text.split(/(?<=[.!?])\s+/).length > 2;
          
          return (
            <article 
              key={testimonial.id} 
              className="testimonial-card"
              tabIndex="0"
              role="article"
              aria-labelledby={`author-${testimonial.id}`}
              aria-describedby={`quote-${testimonial.id}`}
            >
            <div className="testimonial-light-overlay" aria-hidden="true"></div>
            <div className="testimonial-shine" aria-hidden="true"></div>
            
            <div className="testimonial-content">
              <header className="testimonial-author">
                {testimonial.image && (
                  <div className="author-image-wrapper">
                    <img 
                      src={testimonial.image} 
                      alt={`${testimonial.name}, ${testimonial.role}`}
                      className="author-image"
                    />
                  </div>
                )}
                <div className="author-info">
                  <cite 
                    className="author-name"
                    id={`author-${testimonial.id}`}
                  >
                    {testimonial.name}
                  </cite>
                  <p className="author-role">
                    {testimonial.role}
                    {testimonial.company && ` • ${testimonial.company}`}
                  </p>
                </div>
              </header>


              
              <blockquote 
                className="testimonial-text"
                id={`quote-${testimonial.id}`}
              >
                {truncateText(testimonial.text, isExpanded).split('\n\n').map((paragraph, idx, arr) => (
                  <p key={idx} className="testimonial-paragraph">
                    {idx === 0 && (
                      <svg 
                        className="quote-icon quote-icon-start" 
                        width="32" 
                        height="32" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path 
                          d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" 
                          fill="currentColor" 
                          opacity="0.2"
                        />
                      </svg>
                    )}
                    {paragraph}
                    {idx === arr.length - 1 && (!needsTruncation || isExpanded) && (
                      <svg 
                        className="quote-icon quote-icon-end" 
                        width="32" 
                        height="32" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path 
                          d="M18 7h-3l-2 4v6h6v-6h-3zm-8 0H7L5 11v6h6v-6h-3z" 
                          fill="currentColor" 
                          opacity="0.2"
                        />
                      </svg>
                    )}
                  </p>
                ))}
              </blockquote>

              {needsTruncation && (
                <button
                  className="read-more-btn"
                  onClick={() => toggleExpand(testimonial.id)}
                  aria-expanded={isExpanded}
                  aria-controls={`quote-${testimonial.id}`}
                >
                  {isExpanded ? 'Read Less' : 'Read More'}
                  <svg 
                    className={`read-more-icon ${isExpanded ? 'expanded' : ''}`}
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path 
                      d="M7 10l5 5 5-5" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
            </div>
          </article>
        );
      })}
      </div>
    </div>
  );
};

export default Testimonials;
