/**
 * TechCategories - Organized skill categories for Skills page
 * 
 * Defines the hierarchical skill structure displayed on the Skills page.
 * Each category groups related technologies for clear presentation.
 * 
 * Categories:
 * 1. Frontend Development - React, JavaScript/TypeScript, HTML5/CSS3, Bootstrap, Responsive Design
 * 2. Backend Development - Python/Flask, Node.js/Express, APIs (RESTful/GraphQL), WebSocket, Microservices
 * 3. Databases & Cloud - SQL (MySQL/PostgreSQL), NoSQL, Snowflake, GCP, Firebase, Cloud Computing
 * 4. AI & ML - Large Language Models, AI/ML Integration, HuggingFace, Document Processing, Assessment
 * 5. Development Tools - Git/GitHub, CI/CD, Docker, Postman, Figma, VSCode/RStudio
 * 6. Best Practices - Unit Testing (Pytest/Unittest), OOP/Data Structures, Optimization, Documentation, Agile
 * 
 * Structure:
 * @typedef {Object} TechCategory
 * @property {string} title - Category name
 * @property {string[]} items - Array of skill/technology names
 * 
 * @example
 * import { techCategories } from './TechCategories';
 * 
 * techCategories.map(cat => (
 *   <section key={cat.title}>
 *     <h3>{cat.title}</h3>
 *     <ul>{cat.items.map(item => <li>{item}</li>)}</ul>
 *   </section>
 * ));
 */
export  const techCategories = [
  {
    title: 'Frontend Development',
    items: ['React', 'JavaScript / TypeScript', 'HTML5 & CSS3', 'Bootstrap', 'Responsive Design'],
  },
  {
    title: 'Backend Development',
    items: ['Python & Flask', 'Node.js & Express', 'RESTful/GraphQL APIs', 'WebSocket', 'Microservices Architecture'],
  },
  {
    title: 'Databases & Cloud',
    items: ['SQL (MySQL, PostgreSQL)', 'NoSQL & Snowflake', 'Google Cloud Platform', 'Firebase', 'Cloud Computing'],
  },
  {
    title: 'AI & ML',
    items: ['Large Language Models', 'AI/ML Integration', 'HuggingFace', 'Document Processing', 'Intelligent Assessment'],
  },
  {
    title: 'Development Tools',
    items: ['Git & GitHub', 'CI/CD Pipelines', 'Docker', 'Postman', 'Figma', 'VSCode & RStudio'],
  },
  {
    title: 'Best Practices',
    items: ['Unit Testing (Pytest, Unittest)', 'OOP & Data Structures', 'Code Optimization', 'Documentation', 'Agile Development'],
  },
];