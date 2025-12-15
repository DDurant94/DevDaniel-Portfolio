/**
 * Services - Service offerings for About page
 * 
 * Defines the core technical services offered, highlighting expertise
 * across full-stack development, AI/ML, cloud infrastructure, and 3D web.
 * 
 * Service Categories:
 * 1. Full-Stack Development - Python, Node.js, Express, React - scalable applications
 * 2. AI Integration & Smart Workflows - ML, automation, data-driven systems
 * 3. Backend Architecture - APIs, real-time logic, secure server solutions
 * 4. Interactive 3D Web Experiences - React Three Fiber, Three.js - immersive visuals
 * 5. Cloud-Native Deployment - Firebase, GCP - real-time databases, authentication, scalability
 * 6. Creative Branding & UI/UX Strategy - Minimalistic design, animations, user-centric storytelling
 * 
 * Structure:
 * @typedef {Object} Service
 * @property {string} title - Service name
 * @property {string} desc - Service description with key technologies and outcomes
 * 
 * @example
 * import { services } from './Services';
 * 
 * services.map(service => (
 *   <article key={service.title}>
 *     <h3>{service.title}</h3>
 *     <p>{service.desc}</p>
 *   </article>
 * ));
 */
 export const services = [
          {
            title: 'Full-Stack Development',
            desc: 'End-to-end applications built with Python, Node.js, Express, and React designed for scalability, performance, and seamless user experience.',
          },
          {
            title: 'AI Integration & Smart Workflows',
            desc: 'Projects that leverage machine learning, automation, and data-driven logic to deliver intelligent recommendations and adaptive systems.',
          },
          {
            title: 'Backend Architecture',
            desc: 'Modular APIs, real-time logic, and secure server-side solutions that power robust web platforms.',
          },
          {
            title: 'Interactive 3D Web Experiences',
            desc: 'Immersive visuals and animated overlays using React Three Fiber and Three.js perfect for storytelling, terrain mapping, and branded UI.',
          },
          {
            title: 'Cloud-Native Deployment',
            desc: 'Firebase and Google Cloud infrastructure for real-time databases, secure authentication, and effortless scalability.',
          },
          {
            title: 'Creative Branding & UI/UX Strategy',
            desc: 'Minimalistic design, animated interfaces, and user-centric storytelling that connects and converts.',
          },
        ];