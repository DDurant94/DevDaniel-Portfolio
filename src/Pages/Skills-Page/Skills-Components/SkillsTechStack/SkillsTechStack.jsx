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
 * @requires react-bootstrap - Grid layout (Row, Col)
 * @requires TechCategories dataset - Categorized tech skills
 * 
 * @example
 * ```jsx
 * <SkillsTechStack />
 * ```
 */

// src/Pages/Skills-Components/SkillsTechStack/SkillsTechStack.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Col, Row } from 'react-bootstrap';
import { techCategories } from './../../../../DataSets/Skills/TechCategories';
import './../../../../Styles/Page-Styles/Skills-Styles/TechStack-Styles/TechStackStyles.css';

const SkillsTechStack = () => {
  const [activeCard, setActiveCard] = useState(null);

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveCard(activeCard === index ? null : index);
    }
  };

  return (
    <div id="skills-tech-container">
      <Row id="skills-tech-grid" className="g-0">
        {techCategories.map((category, index) => {
          const isActive = activeCard === index;
          return (
            <Col
              key={index}
              xs={12}
              sm={6}
              md={6}
              lg={4}
              xl={4}
              className="skills-tech-list-col text-center"
            >
              <motion.div
                className={`skills-tech-list ${isActive ? 'active' : ''}`}
                tabIndex="0"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.1 }}
                viewport={{ once: true }}
                onKeyDown={(e) => handleKeyDown(e, index)}
              >
                <div className='skills-tech-list-header'>
                  <h3>{category.title}</h3>
                </div>
                <div className="skills-tech-list__overlay">
                  <ul className="skills-tech-ul">
                    {category.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default SkillsTechStack;