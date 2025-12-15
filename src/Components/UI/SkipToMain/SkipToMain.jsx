/**
 * SkipToMain Component
 * 
 * @description Accessibility component providing a skip link for keyboard and screen reader users
 * to bypass repetitive navigation and jump directly to main content. Follows WCAG 2.1 guidelines
 * for keyboard navigation.
 * 
 * Features:
 * - Hidden until focused (Tab key)
 * - Positioned at top of page for first Tab
 * - Smooth scroll to target element
 * - Customizable target and label
 * - ARIA-compliant anchor navigation
 * 
 * Accessibility:
 * - First focusable element on page
 * - Visible on :focus for keyboard users
 * - Allows skipping navigation landmarks
 * - Essential for keyboard-only users
 * 
 * @component
 * @param {Object} props
 * @param {string} [props.targetId='main-content'] - ID of main content element to skip to
 * @param {string} [props.label='Skip to main content'] - Custom link text
 * 
 * @example
 * ```jsx
 * // In page layout
 * <SkipToMain targetId="home-main-content" />
 * <Navigation />
 * <main id="home-main-content" tabIndex="-1">
 *   {// Content}
 * </main>
 * ```
 */

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
