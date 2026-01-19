import { useRef } from 'react';
import PropTypes from 'prop-types';
import BaseButton from '../../../UI/BaseButton/BaseButton';

/** TabNavigation - Accessible tab navigation with keyboard support (Arrow keys, Home, End) */
export default function TabNavigation({ tabs, activeTab, onTabChange }) {
  const tabRefs = useRef([]);

  const handleKeyDown = (e) => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex = (currentIndex + 1) % tabs.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    e.preventDefault();
    const nextTab = tabs[nextIndex];
    onTabChange(nextTab);
    requestAnimationFrame(() => {
      tabRefs.current[nextIndex]?.focus();
    });
  };

  return (
    <ul
      className="portfolio-tabs-list"
      role="tablist"
      aria-label="Portfolio Categories"
      onKeyDown={handleKeyDown}
    >
      {tabs.map((tab, idx) => (
        <li className="project-nav-item" key={tab} role="presentation">
          <BaseButton
            ref={(el) => (tabRefs.current[idx] = el)}
            variant={activeTab === tab ? 'primary' : 'ghost'}
            className={`project-nav-link pressable-edge pressable-glow-inset ${
              activeTab === tab ? 'active' : ''
            }`}
            role="tab"
            aria-selected={activeTab === tab}
            aria-controls={`panel-${tab.toLowerCase()}`}
            id={`tab-${tab.toLowerCase()}`}
            tabIndex={0}
            onClick={() => onTabChange(tab)}
          >
            {tab}
          </BaseButton>
        </li>
      ))}
    </ul>
  );
}

TabNavigation.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired
};
