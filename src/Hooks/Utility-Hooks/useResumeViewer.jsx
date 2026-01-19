/**
 * ResumeViewer - Global context for managing resume PDF viewer state
 */
import { createContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

// eslint-disable-next-line react-refresh/only-export-components
export const ResumeViewerContext = createContext(null);

export const ResumeViewerProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const resumeUrl = "/Resume/DanielDurantsResume.pdf";

  const openResume = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeResume = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = {
    isOpen,
    openResume,
    closeResume,
    resumeUrl
  };

  return (
    <ResumeViewerContext.Provider value={value}>
      {children}
    </ResumeViewerContext.Provider>
  );
};

ResumeViewerProvider.propTypes = {
  children: PropTypes.node.isRequired
};
