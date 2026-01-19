import './../../../Styles/Component-Styles/UI-Styles/Loader-Styles/PageTransitionStyles.css';
import { usePageTransition } from '../../../Context/PageTransition-Context/usePageTransition';

/**
 * PageTransition - Simple fade overlay for page transitions
 */
const PageTransition = () => {
  const { transitionState } = usePageTransition();

  if (transitionState === 'idle') return null;

  return (
    <div className={`page-transition-overlay ${transitionState}`} />
  );
};

export default PageTransition;
