/** SkipToMain - Accessibility skip link for keyboard users to bypass navigation */

import PropTypes from 'prop-types';
import './../../../Styles/Component-Styles/UI-Styles/SkipToMain-Styles/SkipToMainStyles.css';

/**
 * SkipToMain
 * Accessibility component that provides a skip link for keyboard users
 * to bypass navigation and jump directly to main content.
 * 
 * @param {string} targetId - The ID of the main content element to skip to
 * @param {string} label - Optional custom label text (defaults to "Skip to main content")
 */
const SkipToMain = ({ targetId = 'main-content', label = 'Skip to main content' }) => {
  return (
    <a href={`#${targetId}`} className="skip-to-main">
      {label}
    </a>
  );
};

SkipToMain.propTypes = {
  targetId: PropTypes.string,
  label: PropTypes.string,
};

export default SkipToMain;
