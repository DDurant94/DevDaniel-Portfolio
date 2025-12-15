/**
 * Workflow Component
 * 
 * @description Displays development workflow process with alternating left/right layout.
 * Shows step-by-step approach from concept to launch with paired staggered animations.
 * 
 * Features:
 * - Alternating left/right step layout (even indices left, odd right)
 * - Paired stagger delays (steps 1&2 delay 0, 3&4 delay 1, etc.)
 * - Numbered workflow steps with titles and descriptions
 * - Scroll-triggered fade-in animations
 * - Semantic ordered list structure
 * - Full keyboard accessibility
 * - Transition text to services section
 * 
 * Layout Pattern:
 * - Step 1 (index 0): Left, delay 0
 * - Step 2 (index 1): Right, delay 0
 * - Step 3 (index 2): Left, delay 1
 * - Step 4 (index 3): Right, delay 1
 * - etc.
 * 
 * @component
 * @requires FadeInWhenVisible - Scroll-triggered animation wrapper
 * @requires Workflows dataset - Workflow step data
 * 
 * @example
 * ```jsx
 * <Workflow />
 * ```
 */

import { workflowSteps } from './../../../../DataSets/About/Workflows';
import FadeInWhenVisible from "./../../../../Components/Effects/Fade-Effect/FadeIn";
import './../../../../Styles/Page-Styles/AboutMe-Styles/Workflow-Styles/WorkflowStyles.css';

const Workflow = () => {
  // Row-paired stagger: 1&2 share delay 0, 3&4 share delay 1, etc.

  return (
    <div id="about-workflows-container" className="mx-1 p-1">
      <header className="workflow-header">
        <FadeInWhenVisible as="div">
          <h2 id="workflow-heading">Workflows</h2>
          <p id="workflow-desc">
            From concept to launch, I build and ship features through close collaboration with customers, 
            end users, and team members at every step.
          </p>
        </FadeInWhenVisible>
      </header>

      <ol id="workflow-steps-container" aria-labelledby="workflow-heading" aria-describedby="workflow-desc">
        {workflowSteps.map((item, index) => {
          const isEven = index % 2 === 0;

          return (
                  <FadeInWhenVisible
                    as="li"
                    key={index}
                    className={`workflow-step ${isEven ? 'left' : 'right'}`}
                    style={{ '--_i': Math.floor(index / 2) }}
                    tabIndex="0"
                    role="listitem"
                    aria-label={`Step ${index + 1}: ${item.title}`}
                  >
                    <div className="workflow-step-header">
                      <h3 className="workflow-step-h3">Step {index + 1}: {item.title}</h3>
                    </div>
                    <p className="workflow-step-p">{item.desc}</p>
                  </FadeInWhenVisible>
          );
        })}
      </ol>

      <FadeInWhenVisible as="div" className="workflow-transition">
        <p>
          Once the foundation is solid, I bring it to life through immersive interfaces and intelligent systems. 
          Here's what I build:
        </p>
      </FadeInWhenVisible>
    </div>
  );
};

export default Workflow;

