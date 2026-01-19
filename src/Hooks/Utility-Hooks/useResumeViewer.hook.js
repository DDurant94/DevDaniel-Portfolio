/**
 * useResumeViewer Hook - Access resume viewer state
 * 
 * @hook
 * @example
 * import useResumeViewer from './useResumeViewer.hook';
 * 
 * const { isOpen, openResume, closeResume, resumeUrl } = useResumeViewer();
 */
import { useContext } from 'react';
import { ResumeViewerContext } from './useResumeViewer';

export const useResumeViewer = () => {
  const context = useContext(ResumeViewerContext);
  if (!context) {
    throw new Error('useResumeViewer must be used within a ResumeViewerProvider');
  }
  return context;
};

export default useResumeViewer;
