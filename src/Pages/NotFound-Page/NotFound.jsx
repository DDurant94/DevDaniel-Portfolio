/**
 * NotFound (404) Page Component
 * 
 * @description User-friendly 404 error page with navigation options and helpful links.
 * Provides clear messaging and multiple pathways to navigate back to valid pages.
 * 
 * Features:
 * - Clear 404 error messaging with visual error code
 * - "Take Me Home" primary action button
 * - Quick navigation links to key pages (About, Projects, Skills)
 * - Router-based navigation using useNavigate
 * - Accessibility support with ARIA labels
 * - Responsive layout
 * 
 * @component
 * @requires react-router-dom - For programmatic navigation
 * @requires BaseButton - For consistent button styling and navigation
 * 
 * @example
 * ```jsx
 * // Automatically rendered by React Router for unmatched routes
 * <Route path="*" element={<NotFound />} />
 * ```
 */

import { useNavigate } from 'react-router-dom';
import BaseButton from '../../Components/UI/BaseButton/BaseButton.jsx';
import './../../Styles/Page-Styles/NotFound-Styles/NotFoundStyles.css';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div id="notfound-container" className="container-fluid-center">
      <main id="notfound-main-content" role="main">
        <section id="notfound-section">
          <div id="notfound-content">
            <div className="notfound-error-code">
              404
            </div>

            <h1>Page Not Found</h1>

            <p className="notfound-message">
              Looks like you've ventured into uncharted territory. The page you're looking for doesn't exist or has been moved.
            </p>

            <div className="notfound-actions">
              <BaseButton
                variant="primary"
                size="lg"
                onClick={handleGoHome}
                ariaLabel="Return to home page"
              >
                Take Me Home
              </BaseButton>
            </div>

            <div className="notfound-suggestions">
              <p className="notfound-suggestions-title">Looking for something?</p>
              <ul className="notfound-links">
                <li><BaseButton variant="link" to="/about">About Me</BaseButton></li>
                <li><BaseButton variant="link" to="/projects">Projects</BaseButton></li>
                <li><BaseButton variant="link" to="/skills">Skills</BaseButton></li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default NotFound;