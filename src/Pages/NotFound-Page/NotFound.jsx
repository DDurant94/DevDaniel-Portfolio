/**
 * 404 Page - Error page with navigation options
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
    <div id="notfound-container" className="util-flex-center">
      <main id="notfound-main-content" className="util-w-full" role="main">
        <section id="notfound-section">
          <div id="notfound-content" className="util-flex-col-center">
            <div className="notfound-error-code">
              404
            </div>

            <h1>Page Not Found</h1>

            <p className="notfound-message">
              Looks like you've ventured into uncharted territory. The page you're looking for doesn't exist or has been moved.
            </p>

            <div className="notfound-actions util-w-full">
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