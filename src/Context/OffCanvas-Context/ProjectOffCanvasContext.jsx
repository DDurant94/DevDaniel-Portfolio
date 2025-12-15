import { createContext, useContext } from 'react';

/**
 * ProjectOffCanvasContext - Project detail panel state management
 * 
 * Lightweight context for controlling the off-canvas project detail panel.
 * Provides open/close actions that are implemented by the parent component.
 * 
 * Features:
 * - openProject: Function to open panel with project data
 * - closeProject: Function to close the panel
 * - Delegates implementation to parent (PortfolioLanding)
 * - Enables deep components to trigger panel without prop drilling
 * 
 * Usage Pattern:
 * Parent component manages actual panel state and passes handlers to provider.
 * Child components consume context to trigger open/close actions.
 * 
 * @context
 * @example
 * // In parent (PortfolioLanding):
 * const [selectedProject, setSelectedProject] = useState(null);
 * const openProject = (project) => setSelectedProject(project);
 * const closeProject = () => setSelectedProject(null);
 * 
 * <ProjectOffCanvasProvider openProject={openProject} closeProject={closeProject}>
 *   <ProjectGrid />
 *   <OffCanvasPanel project={selectedProject} onClose={closeProject} />
 * </ProjectOffCanvasProvider>
 * 
 * @example
 * // In child component:
 * const { openProject } = useProjectOffCanvas();
 * <button onClick={() => openProject(projectData)}>View Details</button>
 */
const ProjectOffCanvasContext = createContext({ 
  openProject: () => {},
  closeProject: () => {}
});

export const useProjectOffCanvas = () => useContext(ProjectOffCanvasContext);

export const ProjectOffCanvasProvider = ({ children, openProject, closeProject }) => (
  <ProjectOffCanvasContext.Provider value={{ openProject, closeProject }}>
    {children}
  </ProjectOffCanvasContext.Provider>
);
