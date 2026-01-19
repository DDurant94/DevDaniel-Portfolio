// ContactAsideContext - Global state for contact form slide-out panel
import { createSimpleContext } from '../contextFactory.jsx';

const { Provider, useContext: useContactAsideInternal } = createSimpleContext(
  'ContactAside',
  { openContactAside: () => {} }
);

export { Provider as ContactAsideProvider };
export { useContactAsideInternal };
