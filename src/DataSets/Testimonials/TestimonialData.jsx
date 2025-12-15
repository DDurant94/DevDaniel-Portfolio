/**
 * Testimonial Data
 * 
 * @description Contains all client testimonials displayed on the About Me page.
 * Each testimonial includes author information, role, company, full testimonial text,
 * and an optional profile image.
 * 
 * @typedef {Object} Testimonial
 * @property {number} id - Unique identifier for the testimonial
 * @property {string} name - Full name of the person providing the testimonial
 * @property {string} role - Job title or role of the testimonial author
 * @property {string} company - Company or organization name
 * @property {string} text - Full testimonial text (supports multi-paragraph with \n\n)
 * @property {string} image - Imported image path for the author's profile photo
 * 
 * @example
 * {
 *   id: 1,
 *   name: "John Doe",
 *   role: "CTO",
 *   company: "Tech Corp",
 *   text: "First paragraph.\n\nSecond paragraph.",
 *   image: ProfileImage
 * }
 */

import KangarooAi from './../../Assets/Photos/Testimonial-Photos/KangarooAi.jpg';

export const TestimonialData = [
  {
    id: 1,
    name: "Diana D'Achille",
    role: "CEO",
    company: "Kangaroos AI",
    text: "I had the pleasure of working with Daniel Durant during his internship at my AI startup, which helps teachers streamline grading through AI tools and graders. Daniel is an exceptionally skilled full-stack developer with a strong focus in backend development. He has a talent for building efficient, well-structured pipelines that directly enhance product performance and user experience.\n\nDuring his time with us, Daniel built the foundation of our AI grading tool from scratch, showing not only impressive technical expertise at what he does but also love and creativity for his craft. His professionalism and drive set him apart, and I am very confident he will be a tremendous asset and high-impact contributor to any project or company fortunate enough to work with him. I would recommend to any development team.",
    image: KangarooAi,
  }
];
