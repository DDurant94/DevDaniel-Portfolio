/**
 * Workflows - Development workflow steps for About page
 * 
 * Describes the complete software development lifecycle from consultation
 * through deployment and optimization. Emphasizes cost awareness, testing,
 * and long-term maintainability at every stage.
 * 
 * Workflow Stages:
 * 1. Consultation & Discovery - Requirements gathering, success criteria, budget constraints
 * 2. Architecture & Planning - System design, cost assessment, tool evaluation
 * 3. Prototyping & Design - Mockups, user flows, complexity validation
 * 4. Implementation - Modular components, parallel dev, integrations
 * 5. Testing & QA - Automated tests, cross-device validation
 * 6. Deployment & Monitoring - CI/CD pipelines, analytics, error tracking
 * 7. Optimization & Lifecycle - Usage review, cost management, upgrade planning
 * 
 * Structure:
 * @typedef {Object} WorkflowStep
 * @property {string} title - Stage name
 * @property {string} desc - Detailed description of activities and focus areas
 * 
 * @example
 * import { workflowSteps } from './Workflows';
 * 
 * workflowSteps.map((step, index) => (
 *   <div key={index}>
 *     <h3>{index + 1}. {step.title}</h3>
 *     <p>{step.desc}</p>
 *   </div>
 * ));
 */
export const workflowSteps = [
    {
      title: 'Consultation & Discovery',
      desc: "I kick things off by talking through requirements with the people who'll use and benefit from the software. This ensures we're solving the right problem, defines success criteria, and surfaces any budget constraints up front.",
    },
    {
      title: 'Architecture, Planning & Cost Assessment',
      desc: "I sketch out the high-level system: data models, APIs, component hierarchies, and third-party integrations. At the same time, I evaluate licensing fees, hosting costs, maintenance overhead, and the projected lifespan of each tool or library so the solution makes sense both technically and financially.",
    },
    {
      title: 'Prototyping & Design',
      desc: "Quick mockups (in Figma or live in React) let me validate user flows, responsive layouts, and animations before committing to code. These prototypes also help me flag any hidden complexity that could drive up costs or extend development time.",
    },
    {
      title: 'Implementation & Integration',
      desc: "I build modular frontend components (React, vanilla JS, etc.) and backend services (Node, Python) in parallel. Secure routes, database schemas, and external APIs all come together here using the cost-effective, reliable tools we scoped out in step 2.",
    },
    {
      title: 'Testing & QA',
      desc: "Automated tests (unit, integration, end-to-end) run alongside each commit catching regressions early and reducing manual bug-hunting time. I still perform cross-device manual checks to verify responsiveness and polish details.",
    },
    {
      title: 'Deployment & Monitoring',
      desc: "I configure CI/CD pipelines using GitHub Actions (and GitLab CI when needed) to automatically build, test, and deploy releases to staging and production. For usage analytics, I integrate Google Analytics to track traffic patterns and user engagement. On the ops side, I layer in Cloud Logging and Sentry, plus custom dashboards, to monitor performance metrics and error rates in real time.",
    },
    {
      title: 'Optimization, Cost Review & Lifecycle Planning',
      desc: "Post launch, I review actual usage and operating costs against our forecasts. If something's under utilized or running expensive, I refactor or swap it out. I also plan for version upgrades and eventual deprecation, ensuring our solution stays maintainable and cost-effective throughout its intended lifespan.",
    },
  ];