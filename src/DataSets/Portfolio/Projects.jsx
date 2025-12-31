import Logo from './../../Assets/Photos/Logo.png';

import AiImageGrader from './../../Assets/Photos/Project-Photos/AI-Image-Grader/AiImageGrader.gif';
import AiImageGrader2 from './../../Assets/Photos/Project-Photos/AI-Image-Grader/AiImageGrader2.gif';
import CustomAiGrader from './../../Assets/Photos/Project-Photos/Custom-AI-Grader/CustomAiGrader.gif';
import CustomAiGraderSVG from './../../Assets/Photos/Project-Photos/Custom-AI-Grader/CustomAiGraderSVG.svg';
import QuickAiGrader from './../../Assets/Photos/Project-Photos/Quick-AI-Grader/QuickAiGrader.gif';
import QuickAiGraderSVG from './../../Assets/Photos/Project-Photos/Quick-AI-Grader/QuickAiGraderSVG.svg';
import EmailResponder from './../../Assets/Photos/Project-Photos/Email-Automation-Responder/EmailResponder.gif';
import EmailResponderSVG from './../../Assets/Photos/Project-Photos/Email-Automation-Responder/EmailResponderSVG.svg';
import PerformanceOptimization from './../../Assets/Photos/Project-Photos/Performance-Optimization/PerformanceOptimization.gif';
import PerformanceOptimizationSVG from './../../Assets/Photos/Project-Photos/Performance-Optimization/PerformanceOptimizationSVG.svg';
import OperationsOptimizerSVG from './../../Assets/Photos/Project-Photos/Operations-Optimizer/OperationsOptimizerSVG.svg';
import OperationsOptimizer from './../../Assets/Photos/Project-Photos/Operations-Optimizer/OperationsOptimizer.gif';
import OperationsOptimizer2 from './../../Assets/Photos/Project-Photos/Operations-Optimizer/OperationsOptimizer2.gif';

/**
 * Projects - Portfolio project data with full metadata
 * 
 * Comprehensive project dataset for portfolio display and filtering.
 * Each project includes metadata, descriptions, technologies, and links.
 * 
 * Project Types:
 * - AI/ML Engineering
 * - Cloud Deployment
 * - Full-Stack
 * - Microservices Architecture
 * - Frontend Development
 * - API Development
 * - Image/Text Analysis
 * - Subscription-Based
 * 
 * Structure:
 * @typedef {Object} Project
 * @property {string} title - Project name
 * @property {string} description - Short summary (card view)
 * @property {boolean} featured - Show in featured carousel
 * @property {string[]} type - Project categories (filterable)
 * @property {boolean} isPersonal - Personal vs client project
 * @property {boolean} isApiOnly - API-only project flag
 * @property {boolean} isFrontend - Frontend-only flag
 * @property {string} coverImage - Cover image path
 * @property {Array<{src: string, alt: string}>} media - Media gallery
 * @property {Object} body - Detailed project information
 * @property {string} body.powerTitle - Short tagline
 * @property {string} body.description - Medium-length description
 * @property {string} body.offCanvasDescription - Full detailed description
 * @property {string[]} body.techs - Technologies used (searchable)
 * @property {string[]} body.concepts - Key concepts (searchable)
 * @property {Array<{label: string, url: string}>} links - External links
 * 
 * @example
 * import { allProjects } from './Projects';
 * 
 * // Filter featured projects
 * const featured = allProjects.filter(p => p.featured);
 * 
 * // Search by tech
 * const reactProjects = allProjects.filter(p => 
 *   p.body.techs.some(tech => tech.toLowerCase().includes('react'))
 * );
 */
export const allProjects = [
  {
    title: 'AI Image Grader',
    description: 'Upload. Analyze. Grade. This intelligent system extracts handwritten text and delivers instant quality assessments using proprietary logic and ML models - all through a sleek web interface.',
    featured: true,
    type: [
      'AI/ML Engineering',
      'Cloud Deployment',
      'Full-Stack',
      'Microservices Architecture',
      'Image Analysis',
      'Operational Efficiency',
      'Subscription-Based'
    ],
    isPersonal: false,
    isApiOnly: false,
    isFrontend: false,
    coverImage: AiImageGrader2,
    media: [
      { src: AiImageGrader, alt: 'AI Image Grader GIF' }
      // Add screenshots/GIFs here
    ],
    body: {
      powerTitle: 'Turning analog input into digital precision.',
      description: 'Designed for production, optimized for performance, and powered by proprietary logic and user data.',
      offCanvasDescription: `This production grade solution was developed to automate the evaluation of handwritten document images using a proprietary grading methodology owned by the company. Built with HuggingFace models and deployed on Google Cloud Virtual Machines, the system processes image files (.JPG, .JPEG, .PNG) through a secure, scalable API that extracts handwritten text, assesses document quality, and applies internal grading logic informed by user submitted data.

      Users interact through a responsive web interface, uploading documents that are processed in real time with over 95% accuracy. The back-End architecture is optimized for performance, fault tolerance, and scalability supporting high-volume workflows while maintaining consistent output quality. While the grading framework remains proprietary, the system dynamically incorporates user inputs to tailor evaluations and deliver actionable feedback.

      This project demonstrates my ability to deliver intelligent, production ready systems that integrate machine learning, cloud infrastructure, and business specific logic. It reflects expertise in full-stack development, secure API design, and real-time data processing while maintaining a strong focus on usability, scalability, and operational impact.`,
      techs: [
        'Figma', 'React', 'TypeScript',
        'Express.js', 'SQL', 'NoSQL',
        'Encryption', 'User Authentication',
        'Google Cloud VM', 'Firebase', 'Google Cloud', 'HuggingFace', 'RESTful APIs', 'Microservices',
        'YAML', 'JSON', 'CORS'
      ],
      concepts: [
        'AI/ML', 'Scalability', 'Cost Analysis', 'Performance Optimization', 'Payment Integration'
      ]
    },
    links: [
      { label: 'Kangaroos AI', url: 'https://www.kangaroos.ai/' },
    ]
  },
  {
    title: 'Custom AI Grader',
    description: 'Upload. Analyze. Improve. This system extracts text, evaluates quality, and delivers actionable grading feedback - all through a responsive interface backed by robust cloud infrastructure.',
    featured: false, // Mark as featured
    type: [
      'AI/ML Engineering',
      'Cloud Deployment',
      'Full-Stack',
      'Microservices Architecture',
      'Text Document Analysis',
      'Performance Optimization',
      'Subscription-Based'
    ],
    isPersonal: false,
    isApiOnly: false,
    isFrontend: false,
    coverImage: CustomAiGraderSVG,
    media: [
      { src: CustomAiGrader, alt: 'Custom AI Grader GIF' }
      // Add screenshots/GIFs here
    ],
    body: {
      powerTitle: 'Custom intelligence for document workflows.',
      description: 'A scalable solution that transforms user submitted files into actionable insights using proprietary evaluation logic.',
      offCanvasDescription: `This production grade tool was built to automate the analysis and grading of digital documents using AI/ML models. Designed for real-world deployment, the system processes a wide range of file types—including .PDF, .DOCX, and .TXT—through a secure back-End pipeline that extracts text, evaluates content quality, and applies a proprietary grading methodology developed by the company. User-submitted documents are scored based on predefined criteria, with feedback tailored to enhance accuracy, consistency, and productivity in document review workflows.

      Users interact through a responsive web interface, uploading files that are processed in real time. The system dynamically incorporates user inputs to inform grading logic, while maintaining strict adherence to internal standards. Built for scalability and performance, the architecture supports high volume usage across diverse applications such as education, business operations, and content management.

      This project reflects my ability to deliver intelligent, production ready systems that combine machine learning, cloud infrastructure, and business specific logic. It demonstrates expertise in full-stack development, secure API design, and real-time data processing while maintaining a strong focus on usability, operational efficiency, and measurable impact.`,
      techs: [
        'Figma', 'React', 'TypeScript',
        'Express.js', 'SQL', 'NoSQL',
        'Encryption', 'User Authentication',
        'Google Cloud VM', 'Firebase', 'Google Cloud', 'HuggingFace', 'RESTful APIs', 'Microservices',
        'YAML', 'JSON', 'CORS'
      ],
      concepts: [
        'AI/ML', 'Scalability', 'Performance Optimization', 'Payment Integration'
      ]
    },
    links: [
      { label: 'Kangaroos AI', url: 'https://www.kangaroos.ai/' },
    ]
  },
  {
    title: 'Quick AI Grader',
    description: 'From handwritten notes to structured text, this high-speed platform delivers real-time grading across images and documents - powered by dual AI pipelines and scalable cloud infrastructure.',
    featured: false, // Mark as featured
    type: [
      'AI/ML Engineering',
      'Cloud Deployment',
      'Full-Stack',
      'Microservices Architecture',
      'Multi-Format Analysis',
      'High-Throughput Processing',
      'Subscription-Based'
    ],
    isPersonal: false,
    isApiOnly: false,
    isFrontend: false,
    coverImage: QuickAiGraderSVG,
    media: [
      { src: QuickAiGrader, alt: 'Quick AI Grader GIF' }
      // Add screenshots/GIFs here
    ],
    body: {
      powerTitle: 'One engine, all formats.',
      description: 'A high-performance system that merges handwritten and text document analysis into one seamless workflow.',
      offCanvasDescription: `This production grade solution combines the capabilities of two proprietary grading engines, one for handwritten image files and one for digital text documents into a unified, high-speed platform. Built with AI/ML models and deployed on scalable cloud infrastructure, the system processes a wide range of file types (.JPG, .JPEG, .PNG, .PDF, .DOCX, .TXT) through a streamlined back-End that extracts content, evaluates quality, and applies predefined grading logic informed by user inputs.

      Designed for instant feedback and optimized throughput, the Quick AI Grader delivers real-time scoring and analysis across diverse document formats. Whether reviewing handwritten notes or structured text files, the system enhances productivity and consistency in document evaluation workflows. Its modular architecture supports high volume usage and adapts easily to applications in education, business operations, and content management.

      This project demonstrates my ability to architect and deploy intelligent systems that integrate multiple AI pipelines into a cohesive, production-ready solution. It reflects expertise in full-stack development, real-time data processing, and scalable API design while maintaining a strong focus on speed, usability, and operational impact.`,
      techs: [
        'Figma', 'React', 'TypeScript',
        'Express.js', 'SQL', 'NoSQL',
        'Encryption', 'User Authentication',
        'Google Cloud VM', 'Firebase', 'HuggingFace', 'RESTful APIs', 'Microservices',
        'YAML', 'JSON', 'CORS'
      ],
      concepts: [
        'AI/ML', 'Scalability', 'Cost Analysis', 'Performance Optimization', 'Payment Integration'
      ]
    },
    links: [
      { label: 'Kangaroos AI', url: 'https://www.kangaroos.ai/' },
    ]
  },
  {
    title: 'Email Automation Responder',
    description: 'No more missed follow-ups. This system sends professional replies within 23 hours of unresolved issues, streamlining communication and reinforcing accountability.',
    featured: false,
    type: [
      'Automation Engineering',
      'Email Workflow Automation',
      'Customer Support Tech'
    ],
    isPersonal: false,
    isApiOnly: true,
    isFrontend: false,
    coverImage: EmailResponderSVG,
    media: [
      { src: EmailResponder, alt: 'Email Automation Responder GIF' }
      // Add screenshots/GIFs here
    ],
    body: {
      powerTitle: 'Never miss a follow-up.',
      description: 'Designed to catch silence before it becomes a problem, this automation keeps support loops active and transparent.',
      offCanvasDescription: `This production ready automation tool was built to streamline customer communication by ensuring timely follow-up on unresolved discrepancies. Developed in R, the system monitors incoming correspondence and automatically triggers a response if no company action has been taken within 23 hours. When triggered, it sends a professionally worded message to the customer acknowledging the issue and assuring them that a resolution is underway.

      Designed for reliability and minimal overhead, the tool integrates seamlessly into existing workflows, reducing manual oversight and improving customer experience. By enforcing a consistent response window, it helps maintain trust, accountability, and operational transparency especially in high-volume environments where delays can impact satisfaction.

      This project reflects my ability to build lightweight, purpose driven automation using R for real world business operations. It demonstrates proficiency in time-based logic, email handling, and customer experience optimization, while showcasing a practical approach to solving communication bottlenecks with clean, maintainable code.`,
      techs: [
        'R', 'PostgreSQL',
        'RESTful APIs', 'Postman', 'JSON'
      ],
      concepts: [
        'Email Handling', 'Time-based Logic', 'Customer Experience', 'Operational Efficiency', 'Workflow Optimization'
      ]
    },
    links: [
      { label: 'Real Men Apparel Company', url: 'https://rmac.store' },
    ]
  },
  {
    title: 'Operations Optimizer',
    description: 'From fragmented data to unified insight, this tool solves a critical logistics challenge with smart automation and scalable architecture - built for high-volume e-commerce.',
    featured: true,
    type: [
      'API Orchestration',
      'Data Integration',
      'Logistics Tech',
      'Order Tracking Systems'
    ],
    isPersonal: false,
    isApiOnly: true,
    isFrontend: false,
    coverImage: OperationsOptimizer,
    media: [
      { src: OperationsOptimizerSVG, alt: 'Operations Optimizer GIF' }
      // Add screenshots/GIFs here
    ],
    body: {
      powerTitle: 'Three APIs, one clear path.',
      description: 'Built to unify logistics data and eliminate tracking inconsistencies.',
      offCanvasDescription: `This project focused on streamlining a live e-commerce operation by resolving a critical bottleneck in order tracking. I developed a back-End solution that merged data from three distinct APIs, each representing different logistics or fulfillment systems to create a unified tracking pipeline. The system automatically identified and resolved missing tracking numbers, ensuring accurate shipment visibility and reducing customer service overhead.

      By integrating disparate data sources and automating reconciliation logic, the solution improved operational efficiency and reduced delays in order fulfillment. It was designed for reliability and scalability, supporting real-time updates and seamless integration with existing workflows.

      This project highlights my ability to solve real world logistics challenges through API orchestration, back-End automation, and data normalization. It reflects a practical understanding of e-commerce infrastructure and showcases my skills in building systems that improve transparency, reduce friction, and enhance customer experience.`,
      techs: [
        'R', 'PostgreSQL', 'Snowflake',
        'RESTful APIs', 'JSON', 'Data Reconciliation'
      ],
      concepts: [
        'Data Normalization', 'Real-time Updates', 'E-Commerce', 'Logistics', 'Customer Experience', 'Operational Efficiency'
      ]
    },
    links: [
      { label: 'Real Men Apparel Company', url: 'https://rmac.store' },
    ]
  },
  {
    title: 'Performance Optimization',
    description: 'Refactored query and insert logic to dramatically boost speed and reduce latency. Clean code, smart indexing, and batch processing - built for scale and reliability.',
    featured: false,
    type: [
      'Performance Tuning',
      'Database Optimization',
      'High-Throughput Systems'
    ],
    isPersonal: false,
    isApiOnly: true,
    isFrontend: false,
    coverImage: PerformanceOptimizationSVG,
    media: [
      { src: PerformanceOptimization, alt: 'Performance Optimization GIF' }
      // Add screenshots/GIFs here
    ],
    body: {
      powerTitle: 'Speed meets precision.',
      description: 'Optimized query and insert operations for scalable, high throughput systems.',
      offCanvasDescription: `In this project, I optimized existing back-End logic for database queries and insert operations, achieving a 75% performance improvement. By applying best practices in query structuring, indexing, and batch processing, I reduced latency and improved throughput across critical data workflows.

      The refactor involved analyzing query execution plans, minimizing redundant operations, and restructuring insert logic to handle high-volume data more efficiently. These changes resulted in faster response times, reduced server load, and a smoother experience for downstream systems and users.

      This project reflects my ability to diagnose performance bottlenecks and implement scalable solutions that directly impact system reliability and speed. It showcases my back-End engineering skills, my understanding of database architecture, and my commitment to writing clean, efficient, and maintainable code.`,
      techs: [
        'R', 'PostgreSQL', 'Snowflake',
        'Query Optimization', 'Performance Tuning', 'Latency Reduction', 'Data Normalization',
        'RESTful APIs', 'JSON'
      ],
      concepts: [
        'E-Commerce', 'Logistics', 'Operational Efficiency', 'Scalability'
      ]
    },
    links: [
      { label: 'Real Men Apparel Company', url: 'https://rmac.store' },
    ]
  },
  {
    title: 'Password Keeper',
    description: 'Built for privacy and accountability, this tool encrypts sensitive data, enforces user isolation, and organizes credentials with parent-child relationships - all in a lightweight file-based system',
    featured: true,
    type: [
      'Security Tool',
      'Credential Management',
      'Encrypted Storage',
      'Microservices Architecture',
      'CI/CD'
    ],
    isPersonal: true,
    isApiOnly: true,
    isFrontend: false,
    coverImage: Logo,
    media: [
      { src: Logo, alt: 'Password Keeper Logo' }
      // Add more screenshots or GIFs here
    ],
    body: {
      powerTitle: 'Encrypted, organized, accountable.',
      description: 'A file-based password manager that encrypts data and enforces user-only access.',
      offCanvasDescription: `This personal project was built to securely store and manage user credentials using a file based architecture with enforced parent child relationships. Designed with privacy and accountability in mind, the system tracks user login and logout activity, encrypts all sensitive data, and ensures that only the authenticated user can access their stored information.

      Each password entry is organized within a structured hierarchy, allowing for logical grouping and inheritance where needed. The encryption layer protects all stored data at rest, and access control is strictly enforced — no shared visibility, no exposed plaintext. The system also logs session activity to provide traceability and reinforce secure usage patterns.

      This project reflects my ability to build lightweight, privacy-focused tools with strong attention to data security and user isolation. It demonstrates proficiency in file based storage design, encryption handling, and session tracking, while showcasing a practical approach to personal data protection and secure UX.

      Key features include:
      - File-based storage with parent-child relationships for organized data management
      - Strong encryption to protect all sensitive information at rest
      - User authentication to ensure exclusive access to personal credentials
      - Session logging to track login/logout activity for accountability

      Password Keeper frontend is currently unavailable and under development.`,
      techs: [
        'Python', 'Flask', 'Node.js', 'MySQL', 'PostgreSQL', 'SQLAlchemy',
        'JWT', 'Hashing', 'Encryption', 'User Authentication',
        'Microservices', 'RESTful APIs', 'CI/CD', 'Unit Testing', 'Tree Data Structure', 'GitHub Actions',
        'Postman', 'YAML', 'CORS', 'Draw.io', 'Figma'
      ],
      concepts: [
        'Credential Management', 'Encrypted Storage'
      ]
    },
    links: [
      { label: 'GitHub', url: 'https://github.com/DDurant94/Password-Storage-Application' },
      { label: 'YouTube', url: 'https://www.youtube.com/@CodingWithDevDaniel' },
      { label: 'Frontend (Coming Soon)', url: null, isDisabled: true },
      { label: 'Live Demo (Unavailable)', url: null, isDisabled: true }
    ]
  },
  {
    title: 'Advanced E-Commerce API',
    description: 'Built with microservices and JWT-secured APIs, this system handles transactions, inventory, and customer data - showcasing backend engineering and orchestration expertise.',
    featured: false,
    type: [
      'E-Commerce',
      'Transaction Processing',
      'Microservices Architecture',
      'CI/CD'
    ],
    isPersonal: true,
    isApiOnly: true,
    isFrontend: false,
    coverImage: Logo,
    media: [
      { src: Logo, alt: 'Advanced E-Commerce API Logo' }
      // Add more screenshots or GIFs here
    ],
    body: {
      powerTitle: 'Secure, scalable, and service driven.',
      description: 'Microservices architecture designed to support real-time operations and secure access.',
      offCanvasDescription: `This personal project was built to simulate a scalable e-commerce back-End using a modular microservices architecture in Python. The system handles core operations such as transactions, customer profiles, product listings, and inventory management — each service designed to operate independently while communicating through secure, well defined interfaces.

      Authentication is managed via JSON Web Tokens (JWT), ensuring secure access control across services. SQLAlchemy powers the data layer, enabling efficient ORM-based interactions with a relational database. The architecture supports clean separation of concerns, real-time updates, and future scalability, making it a strong foundation for production level deployment.

      This project reflects my ability to design and implement distributed systems that balance performance, maintainability, and security. It demonstrates proficiency in Python-based API development, microservice orchestration, and secure authentication workflows, while showcasing a practical understanding of e-commerce infrastructure and back-End engineering.`,
      techs: [
        'Python', 'Flask', 'Node.js', 'MySQL', 'PostgreSQL', 'SQLAlchemy',
        'JWT', 'Hashing', 'Encryption', 'User Authentication',
        'Microservices', 'RESTful APIs', 'CI/CD', 'Unit Testing', 'GitHub Actions',
        'Postman', 'YAML', 'CORS', 'Draw.io', 'Figma'
      ],
      concepts: [
        'Transaction Processing'
      ]
    },
    links: [
      { label: 'Live Demo', url: 'https://advanced-api-deployment.onrender.com/api/docs/' },
      { label: 'GitHub', url: 'https://github.com/DDurant94/Advanced-API-Deployment' },
      { label: 'Frontend (Coming Soon)', url: 'https://github.com/DDurant94/E-Commerce-React' }
    ]
  },
  {
    title: 'E-Commerce Application',
    description: 'This full-stack app simulates a live e-commerce workflow with secure authentication, modular APIs, and a responsive UI - built for scalability and clean separation of concerns.',
    featured: true,
    type: [
      'E-Commerce',
      'Full-Stack',
      'Retail Platform'
    ],
    isPersonal: true,
    isApiOnly: false,
    isFrontend: false,
    coverImage: Logo,
    media: [
      { src: Logo, alt: 'E-Commerce Application Logo' }
      // Add more screenshots or GIFs here
    ],
    body: {
      powerTitle: 'Full-stack infrastructure for digital retail.',
      description: 'A full-stack e-commerce platform that blends React, Node.js, and Python for seamless shopping workflows.',
      offCanvasDescription: `This project marked my first full-stack web application, built from the ground up to simulate a complete e-commerce experience. It combines a responsive React frontend — styled with Bootstrap and navigated using React Router DOM — with a modular back-End powered by Node.js, Python, and SQLAlchemy. The system handles product listings, customer data, inventory management, and transaction workflows, all designed for scalability and clean separation of concerns.

      On the back-End, the application combines Node.js and Python to handle business logic, API routing, and database operations. SQLAlchemy powers the data layer, enabling efficient ORM-based interactions with a relational database. The architecture supports user authentication, product management, inventory tracking, and transaction handling — all designed for scalability and modularity.

      This project reflects my ability to deliver end-to-end solutions that integrate modern frontend frameworks with secure, scalable back-End systems. It demonstrates proficiency in full-stack development, API design, and database modeling, while showcasing a practical understanding of e-commerce infrastructure and user-centric design.`,
      techs: [
        'React', 'JavaScript', 'HTML5', 'CSS3', 'Bootstrap', 'Vite.js', 'Figma',
        'Node.js', 'Python', 'Flask', 'MySQL', 'SQLAlchemy',
        'RESTful APIs', 'CORS', 'Postman', 'JSON', 'Draw.io'
      ],
      concepts: [
        'Retail Platform'
      ]
    },
    links: [
      { label: 'GitHub', url: 'https://github.com/DDurant94/E-Commerce-React' },
      { label: 'Live Demo (Unavailable)', url: null, isDisabled: true }
    ]
  },
  {
    title: 'Factory Management',
    description: 'A production-grade API that simulates real-world manufacturing workflows with modular microservices, automated testing, and secure access control.',
    featured: false, // Mark as featured
    type: [
      'Logistics',
      'Manufacturing Systems',
      'Production Tracking',
      'Microservices Architecture',
      'CI/CD'
    ],
    isPersonal: true,
    isApiOnly: true,
    isFrontend: false,
    coverImage: Logo,
    media: [
      { src: Logo, alt: 'Factory Management Logo' }
      // Add more screenshots or GIFs here
    ],
    body: {
      powerTitle: 'Manufacturing meets microservices.',
      description: 'A microservices API that manages people, machines, and production with secure, test driven architecture.',
      offCanvasDescription: `This personal project is a production-grade API designed to manage factory operations using a modular microservices architecture. Built in Python, the system handles employee activity, machine usage, production tracking, and inventory management — each service operating independently and communicating through secure, token authenticated interfaces.

      Authentication is enforced via JSON Web Tokens (JWT), ensuring secure access across services. The back-End tracks who produced what, when, and on which machine, creating a detailed audit trail of factory output. Inventory is dynamically updated based on production events, and employee time logs are recorded to support accountability and operational insights.

      Unit testing is integrated throughout the codebase, supporting a CI/CD pipeline that ensures reliability and smooth deployment. The architecture is designed for scalability, fault isolation, and real-time updates, making it suitable for complex industrial environments.

      This project reflects my ability to build domain specific systems using modern back-End principles. It demonstrates proficiency in microservice orchestration, secure authentication, and automated testing pipelines, while showcasing a practical understanding of manufacturing workflows and data integrity.`,
      techs: [
        'Python', 'Flask', 'MySQL', 'SQLAlchemy',
        'Hashing', 'Encryption', 'JWT', 'User Authentication',
        'Microservices', 'RESTful APIs', 'CI/CD', 'GitHub Actions',
        'CORS', 'YAML', 'Postman', 'JSON', 'Draw.io', 'Figma'
      ],
      concepts: [
        'Manufacturing Systems', 'Production Tracking'
      ]
    },
    links: [
      { label: 'GitHub', url: 'https://github.com/DDurant94/Factory-Management-Documentation' },
      { label: 'Live Demo (Unavailable)', url: null, isDisabled: true }
    ]
  },
  {
    title: 'Poké Catcher',
    description: 'Search your favorites and dive into their stats, types, and imagery. This project blends API integration, responsive design, and playful UI in a pure JS experience.',
    featured: false,
    type: [
      'Front-End',
      'API Integration',
      'Game Data Explorer'
    ],
    isPersonal: true,
    isApiOnly: false,
    isFrontend: true,
    coverImage: Logo,
    media: [
      { src: Logo, alt: 'Poké Catcher Logo' }
      // Add more screenshots or GIFs here
    ],
    body: {
      powerTitle: "Catch'em all—with code.",
      description: 'A frontend Pokémon search tool built with HTML, CSS, and JavaScript.',
      offCanvasDescription: `Poké Catcher is a personal frontend project built with HTML, CSS, and JavaScript that allows users to search for Pokémon and explore detailed facts about each one. The site connects to a public Pokémon API to retrieve real-time data, including stats, types, abilities, and imagery presented in a clean, responsive interface designed for quick interaction and visual appeal.

      The application emphasizes intuitive UX, dynamic content rendering, and API integration using vanilla JavaScript. It showcases my ability to build interactive web experiences from scratch, handle asynchronous data fetching, and style components with precision using CSS and layout frameworks.

      This project reflects my foundational frontend skills and passion for creating engaging, data driven interfaces. It demonstrates proficiency in DOM manipulation, API consumption, and responsive design, while adding a fun, nostalgic twist to my portfolio.`,
      techs: [
        'HTML5', 'CSS3', 'JavaScript', 'Bootstrap', 'Figma',
        'RESTful APIs', 'JSON', 'Hashing'
      ],
      concepts: [
        'Game Data Explorer'
      ]
    },
    links: [
      { label: 'GitHub', url: 'https://github.com/DDurant94/Pokemon-API-JavaScript' },
      { label: 'Live Demo (Unavailable)', url: null, isDisabled: true }
    ]
  },
  {
    title: 'One Stop Marvel',
    description: "Search and discover Marvel characters with real-time data, dynamic routing, and secure API access - all wrapped in a clean, responsive interface.",
    featured: false,
    type: [
      'Front-End',
      'API Integration',
      'Comic Universe Explorer'
    ],
    isPersonal: true,
    isApiOnly: false,
    isFrontend: true,
    coverImage: Logo,
    media: [
      { src: Logo, alt: 'One Stop Marvel Logo' }
      // Add more screenshots or GIFs here
    ],
    body: {
      powerTitle: 'Superheroes meet React.',
      description: "A React-based character explorer that integrates Bootstrap styling and Marvel's API logic.",
      offCanvasDescription: `This personal project was my first React based web application, built to explore and display Marvel characters using the official Marvel API. Developed with React, Bootstrap, React Router DOM, HTML, CSS, and JavaScript, the site allows users to search for characters and view detailed information including names, descriptions, and official imagery.

      To securely access the Marvel API, I implemented a hash-based authentication system using timestamp, public key, and MD5 encryption — meeting Marvel's developer requirements for secure requests. The frontend features dynamic routing, responsive design, and real-time data rendering, all wrapped in a clean, user friendly interface.

      This project reflects my foundational skills in React development, API consumption, and frontend architecture. It demonstrates my ability to work with third-party APIs, handle authentication logic, and build interactive, visually engaging web experiences from scratch.`,
      techs: [
        'React', 'JavaScript', 'HTML5', 'CSS3', 'Bootstrap', 'Vite.js', 'Figma',
        'RESTful APIs', 'JSON', 'Hashing'
      ],
      concepts: [
        'Comic Universe Explorer', 'Data Visualization', 'Dynamic Sizing'
      ]
    },
    links: [
      { label: 'GitHub', url: 'https://github.com/DDurant94/React-BootStrap' },
      { label: 'Live Demo (Unavailable)', url: null, isDisabled: true }
    ]
  },
  {
    title: "Daniel's Portfolio",
    description: 'A clean, animated interface showcasing projects, skills, and contact info - featuring dynamic routing, Framer Motion transitions, and full mobile responsiveness.',
    featured: false,
    type: [
      'Front-End',
      'Portfolio Website',
      'CI/CD'
    ],
    isPersonal: true,
    isApiOnly: false,
    isFrontend: true,
    coverImage: Logo,
    media: [
      { src: Logo, alt: 'Daniels Portfolio Logo' }
      // Add more screenshots or GIFs here
    ],
    body: {
      powerTitle: 'Where it all began-animated, responsive, and modular.',
      description: 'My first React portfolio, built with Framer Motion, Bootstrap, and icon libraries for a polished UX.',
      offCanvasDescription: `This personal project was my first live portfolio website, built using React and designed to showcase projects, skills, and contact information in a clean, animated interface. The frontend architecture leverages React Router DOM for dynamic navigation and Framer Motion for smooth, component level transitions. Styling was handled with HTML, CSS, and Bootstrap, while third-party icon libraries were used to enhance visual clarity and branding.

      The site was built with scalability in mind, ensuring full responsiveness across device sizes, from mobile to desktop. Layouts adapt fluidly, and animations remain consistent regardless of screen resolution, providing a polished user experience across platforms.

      This project reflects my foundational skills in frontend development, component based architecture, and responsive design. It demonstrates my ability to integrate third-party libraries, manage client-side routing, and create engaging, mobile friendly interfaces, all while laying the groundwork for my current portfolio evolution.`,
      techs: [
        'React', 'JavaScript', 'HTML5', 'CSS3', 'Bootstrap', 'Vite.js', 'Figma', 'InkScape',
        'Framer Motion', 'React Router DOM',
        'CI/CD', 'GitHub Actions'
      ],
      concepts: [
        'Portfolio Website'
      ]
    },
    links: [
      { label: 'GitHub', url: 'https://github.com/DDurant94/Daniels-Website' },
      { label: 'Live Demo', url: 'https://daniel-durant.onrender.com/' }
    ]
  }
  ];