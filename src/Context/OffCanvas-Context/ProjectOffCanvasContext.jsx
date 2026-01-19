/**
 * ProjectOffCanvasContext - Project detail panel state management
 * 
 * @description Context for controlling the off-canvas project detail panel.
 * Provides open/close actions that are implemented by the parent component.
 * 
 * @context
 */

import { createSimpleContext } from '../contextFactory.jsx';

const { Provider, useContext: useProjectOffCanvasInternal } = createSimpleContext(
  'ProjectOffCanvas',
  { 
    openProject: () => {},
    closeProject: () => {}
  }
);

export { Provider as ProjectOffCanvasProvider };
export { useProjectOffCanvasInternal };
