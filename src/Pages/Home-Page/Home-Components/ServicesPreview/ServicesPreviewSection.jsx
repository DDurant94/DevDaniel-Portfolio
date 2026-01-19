/**
 * Home Services Preview Component
 * 
 * @description Displays preview of first 3 services with "View More" card on home page.
 * Features staggered animations, keyboard navigation, and smooth page transitions to About page.
 * 
 * Features:
 * - Displays first 3 services from full services list
 * - "+N More Services" card showing remaining count
 * - Staggered entrance animations (80ms delay between cards)
 * - Click and keyboard navigation (Enter/Space) to About page
 * - Smooth cloud transition to About page
 * - Fully accessible with ARIA labels
 * - Responsive grid layout (2 columns on MD+)
 * 
 * Interaction:
 * - Click any service card → Navigate to /about
 * - Enter/Space on focused card → Navigate to /about
 * - All cards are keyboard navigable with tabIndex="0"
 * 
 * @component
 * @requires motion/react-client - Framer Motion for staggered animations
 * @requires usePageTransition - Cloud transition hook for navigation
 * @requires Services dataset - Service offerings data
 * 
 * @example
 * ```jsx
 * <HomeServicesPreview />
 * ```
 */

import * as motion from 'motion/react-client';
import { services } from '../../../../DataSets/About/Services';

import { usePageTransition } from '../../../../Hooks/Effect-Hooks/usePageTransition';
import './../../../../Styles/Page-Styles/Home-Styles/Services-Styles/HomeServicesPreviewStyles.css';

const HomeServicesPreview = () => {
  const compactServices = services.slice(0, 3);
  const navigateWithTransition = usePageTransition();
  const totalServiceSteps = services.length - 3;
  return (
    <>
      <div className="home-services-preview-head-container" aria-labelledby="home-services-preview--heading">
        <h2 id="home-services-preview-head-heading">How I Can Help?</h2>
        <p className="home-services-preview-head-tagline">Focused delivery across architecture, intelligence, and experience is my commitment.</p>
      </div>
      <div className="home-services-grid" role="list">
        <div className="home-services-list">
        {compactServices.map((s, i) => (
          <div key={s.title} className="home-service-row">
            <motion.div
              role="listitem"
              className="home-service-card util-flex-col-center-all"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true}}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              tabIndex="0"
              onClick={() => navigateWithTransition('/about')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigateWithTransition('/about');
                }
              }}
              aria-label={`${s.title}: ${s.desc}. Press Enter to learn more.`}
              style={{ cursor: 'pointer' }}
            >
              <h3 className="home-service-title">{s.title}</h3>
              <p className="home-service-desc">{s.desc}</p>
            </motion.div>
          </div>
        ))}
          <div>
            <motion.div
              role="listitem"
              className="home-service-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 4 * 0.08 }}
              tabIndex="0"
              onClick={() => navigateWithTransition('/about')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigateWithTransition('/about');
                }
              }}
              aria-label={`View ${totalServiceSteps} more services on the About page`}
              style={{ cursor: 'pointer' }}
            >
              {totalServiceSteps > 0 ? (
                <div className="home-additional-services util-flex-col-center-all">
                  <button
                    className="home-additional-services-count"
                    onClick={() => navigateWithTransition('/about')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        navigateWithTransition('/about');
                      }
                    }}
                    aria-label={`View ${totalServiceSteps} more services on the About page`}
                  >
                    +{totalServiceSteps} More Services
                  </button>
                </div>
              ) : null}
            </motion.div>
          </div>
        </div>
      </div>


      <div className="home-services-cta">
        <a href="/about" className="base-btn btn-variant-outline">Explore process & services</a>
      </div>
    </>
  );
};

export default HomeServicesPreview;
