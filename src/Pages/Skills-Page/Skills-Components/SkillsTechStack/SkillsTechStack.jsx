/**
 * Skills Tech Stack Component
 * 
 * @description Interactive grid of technology categories with expandable cards.
 * Displays categorized technical skills with keyboard navigation and staggered animations.
 * 
 * Features:
 * - Expandable category cards (click or Enter/Space to toggle)
 * - Single active card at a time (accordion-style)
 * - Staggered entrance animations (100ms delay between cards)
 * - Responsive grid layout (4 cols on XL, 3 on LG, 2 on MD, 1 on mobile)
 * - Keyboard accessible with Enter/Space toggle
 * - Scroll-triggered entrance animations
 * - Overlay reveals tech list on expansion
 * 
 * Grid Layout:
 * - XS/Mobile: 1 column (12/12)
 * - SM/MD: 2 columns (6/12)
 * - LG/XL: 3-4 columns (4/12)
 * 
 * @component
 * @requires framer-motion - Scroll-triggered and entrance animations
 * @requires TechCategories dataset - Categorized tech skills
 * 
 * @example
 * ```jsx
 * <SkillsTechStack />
 * ```
 */

// src/Pages/Skills-Components/SkillsTechStack/SkillsTechStack.jsx
import { useState } from 'react';
import FadeInWhenVisible from '../../../../Components/Effects/Fade-Effect/FadeIn.jsx';
import { techCategories } from './../../../../DataSets/Skills/TechCategories';
import './../../../../Styles/Page-Styles/Skills-Styles/TechStack-Styles/TechStackStyles.css';

const SkillsTechStack = () => {
  const [activeCard, setActiveCard] = useState(null);
  const [announcement, setAnnouncement] = useState('');

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const newActiveCard = activeCard === index ? null : index;
      setActiveCard(newActiveCard);
      
      // Announce state change to screen readers
      const category = techCategories[index];
      if (newActiveCard === index) {
        setAnnouncement(`${category.title} expanded. ${category.items.length} technologies listed.`);
      } else {
        setAnnouncement(`${category.title} collapsed.`);
      }
    }
  };

  const handleClick = (index) => {
    const newActiveCard = activeCard === index ? null : index;
    setActiveCard(newActiveCard);
    
    // Announce state change to screen readers
    const category = techCategories[index];
    if (newActiveCard === index) {
      setAnnouncement(`${category.title} expanded. ${category.items.length} technologies listed.`);
    } else {
      setAnnouncement(`${category.title} collapsed.`);
    }
  };

  return (
    <div id="skills-tech-container" role="region" aria-label="Technology skills by category">
      {/* Live region for screen reader announcements */}
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>
      
      <div id="skills-tech-grid" role="group">
        {techCategories.map((category, index) => {
          const isActive = activeCard === index;
          return (
            <div
              key={index}
              className="skills-tech-list-col util-flex-col-justify-center text-center"
            >
              <FadeInWhenVisible
                y={40}
                duration={0.8}
                staggerIndex={index}>
                <div
                  className={`skills-tech-list util-overflow-hidden util-text-center ${isActive ? 'active' : ''}`}
                  tabIndex="0"
                  role="button"
                  aria-label={`${category.title} technologies. ${isActive ? 'Expanded' : 'Collapsed'}. Press Enter or Space to ${isActive ? 'collapse' : 'expand'}.`}
                  aria-expanded={isActive}
                  onClick={() => handleClick(index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                >
                <div className='skills-tech-list-header util-flex-center' aria-hidden="true">
                  <h3>{category.title}</h3>
                </div>
                <div className="skills-tech-list__overlay">
                  <ul className="skills-tech-ul" aria-label={`${category.title} technologies`}>
                    {category.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                </div>
              </FadeInWhenVisible>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SkillsTechStack;