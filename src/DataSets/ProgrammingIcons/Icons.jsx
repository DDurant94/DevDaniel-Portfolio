import { 
  SiPython, SiJavascript, SiTypescript, SiR,
  SiHtml5, SiCss3, SiYaml, SiJson,
  SiMysql, SiPostgresql, SiGraphql, SiGooglecloud,
  SiGooglecloudstorage, SiFirebase, SiHuggingface, SiReact,
  SiReactbootstrap, SiReactrouter, SiVite, SiVuedotjs,
  SiNpm, SiNodedotjs, SiExpress, SiFlask,
  SiAxios, SiBootstrap, SiSqlalchemy, SiDocker,
  SiFramer, SiThreedotjs, SiPytest, SiSwagger,
  SiTensorflow, SiPytorch, SiOpencv, SiNumpy,
  SiSnowflake, SiRstudioide, SiGooglecolab, SiJupyter,
  SiAnaconda, SiFigma, SiCanva, SiInkscape,
  SiBlender, SiPostman, SiGit, SiGithub,
  SiGithubactions, SiLinux, SiGnubash,
 } from "react-icons/si";
import { TbSql, TbBrandPowershell, TbAutomation, TbDatabase } from "react-icons/tb";
import { FaAws } from "react-icons/fa";
import { VscVscode } from "react-icons/vsc";
import { GiArtificialIntelligence } from "react-icons/gi";
import { LuBrainCircuit } from "react-icons/lu";

/**
 * Icons - Technology icon dataset with categorization
 * 
 * Comprehensive collection of technology icons from react-icons library.
 * Organized into logical groups for Skills page logo carousel and displays.
 * Each icon includes the React component, display title, and official link.
 * 
 * Icon Groups:
 * - languages: Programming/markup languages (9 icons)
 * - databases: Database systems (4 icons)
 * - webFrameworks: Frontend frameworks and tools (9 icons)
 * - backend: Backend frameworks and runtime (5 icons)
 * - cloud: Cloud platforms and services (4 icons)
 * - mlAi: Machine learning and AI tools (11 icons)
 * - animation3d: 3D and animation libraries (3 icons)
 * - design: Design and graphics tools (3 icons)
 * - tooling: Development tools and automation (11 icons)
 * 
 * Structure:
 * @typedef {Object} IconData
 * @property {JSX.Element} node - React icon component
 * @property {string} title - Display name (may include full name in parens)
 * @property {string} href - Official documentation/website URL
 * 
 * Helper:
 * @function make - Creates icon object from (node, title, href)
 * 
 * Exports:
 * - IconGroups: Object with categorized arrays
 * - IconList: Flat array (backward compatible) - all icons concatenated
 * 
 * @example
 * import { IconGroups, IconList } from './Icons';
 * 
 * // Use grouped icons
 * <section>
 *   <h3>Languages</h3>
 *   {IconGroups.languages.map(icon => (
 *     <a href={icon.href} title={icon.title}>
 *       {icon.node}
 *     </a>
 *   ))}
 * </section>
 * 
 * // Use flat list for carousel
 * <LogoLoop icons={IconList} />
 */

  const make = (node, title, href) => ({ node, title, href });

  export const IconGroups = {
    languages: [
      make(<SiPython />, "Python", "https://www.python.org/"),
      make(<SiJavascript />, "JavaScript", "https://developer.mozilla.org/en-US/docs/Web/JavaScript"),
      make(<SiTypescript />, "TypeScript", "https://www.typescriptlang.org/"),
      make(<SiR />, "R", "https://www.r-project.org/"),
      make(<SiHtml5 />, "HTML5 (Hypertext Markup Language)", "https://developer.mozilla.org/en-US/docs/Web/HTML"),
      make(<SiCss3 />, "CSS3 (Cascading Style Sheets)", "https://developer.mozilla.org/en-US/docs/Web/CSS"),
      make(<SiYaml />, "YAML (Yet Another Markup Language)", "https://yaml.org/"),
      make(<SiJson />, "JSON (JavaScript Object Notation)", "https://www.json.org/json-en.html"),
      make(<TbSql />, "SQL (Structured Query Language)", "https://en.wikipedia.org/wiki/SQL")
    ],
    databases: [
      make(<SiMysql />, "MySQL", "https://www.mysql.com/"),
      make(<SiPostgresql />, "PostgreSQL", "https://www.postgresql.org/"),
      make(<TbDatabase />, "NoSQL", "https://en.wikipedia.org/wiki/NoSQL"),
      make(<SiSnowflake />, "Snowflake", "https://www.snowflake.com/")
    ],
    webFrameworks: [
      make(<SiReact />, "React", "https://reactjs.org/"),
      make(<SiReactbootstrap />, "React Bootstrap", "https://react-bootstrap.github.io/"),
      make(<SiReactrouter />, "React Router", "https://reactrouter.com/"),
      make(<SiVite />, "Vite.js", "https://vitejs.dev/"),
      make(<SiVuedotjs />, "Vue.js", "https://vuejs.org/"),
      make(<SiBootstrap />, "Bootstrap", "https://getbootstrap.com/"),
      make(<SiAxios />, "Axios", "https://axios-http.com/"),
      make(<SiNpm />, "NPM (Node Package Manager)", "https://www.npmjs.com/"),
      make(<SiGraphql />, "GraphQL (Graph Query Language)", "https://graphql.org/")
    ],
    backend: [
      make(<SiNodedotjs />, "Node.js", "https://nodejs.org/"),
      make(<SiExpress />, "Express.js", "https://expressjs.com/"),
      make(<SiFlask />, "Flask", "https://flask.palletsprojects.com/"),
      make(<SiSqlalchemy />, "SQLAlchemy", "https://www.sqlalchemy.org/"),
      make(<SiDocker />, "Docker", "https://www.docker.com/")
    ],
    cloud: [
      make(<SiGooglecloud />, "Google Cloud", "https://cloud.google.com/"),
      make(<SiGooglecloudstorage />, "Google Cloud Storage", "https://cloud.google.com/storage"),
      make(<FaAws />, "Amazon Web Services", "https://aws.amazon.com/"),
      make(<SiFirebase />, "Firebase", "https://firebase.google.com/")
    ],
    mlAi: [
      make(<SiHuggingface />, "Hugging Face", "https://huggingface.co/"),
      make(<SiPytorch />, "PyTorch", "https://pytorch.org/"),
      make(<SiTensorflow />, "TensorFlow", "https://www.tensorflow.org/"),
      make(<SiOpencv />, "OpenCV", "https://opencv.org/"),
      make(<SiNumpy />, "NumPy", "https://numpy.org/"),
      make(<SiJupyter />, "Jupyter", "https://jupyter.org/"),
      make(<SiAnaconda />, "Anaconda", "https://www.anaconda.com/"),
      make(<SiGooglecolab />, "Google Colab", "https://colab.research.google.com/"),
      make(<SiRstudioide />, "RStudio", "https://posit.co/download/rstudio-desktop/"),
      make(<GiArtificialIntelligence />, "Artificial Intelligence", "https://en.wikipedia.org/wiki/Artificial_intelligence"),
      make(<LuBrainCircuit />, "Machine Learning", "https://en.wikipedia.org/wiki/Machine_learning")
    ],
    animation3d: [
      make(<SiFramer />, "Framer Motion", "https://www.framer.com/motion/"),
      make(<SiThreedotjs />, "Three.js", "https://threejs.org/"),
      make(<SiBlender />, "Blender", "https://www.blender.org/")
    ],
    design: [
      make(<SiFigma />, "Figma", "https://www.figma.com/"),
      make(<SiInkscape />, "Inkscape", "https://inkscape.org/"),
      make(<SiCanva />, "Canva", "https://www.canva.com/")
    ],
    tooling: [
      make(<SiPytest />, "Pytest", "https://docs.pytest.org/"),
      make(<SiSwagger />, "Swagger", "https://swagger.io/"),
      make(<SiPostman />, "Postman", "https://www.postman.com/"),
      make(<SiGit />, "Git", "https://git-scm.com/"),
      make(<SiGithub />, "GitHub", "https://github.com/"),
      make(<SiGithubactions />, "GitHub Actions", "https://github.com/features/actions"),
      make(<VscVscode />, "VS Code (Visual Studio Code)", "https://code.visualstudio.com/"),
      make(<SiLinux />, "Linux", "https://www.linux.org/"),
      make(<SiGnubash />, "Bash", "https://www.gnu.org/software/bash/"),
      make(<TbBrandPowershell />, "Powershell", "https://docs.microsoft.com/en-us/powershell/"),
      make(<TbAutomation />, "Automation", "https://en.wikipedia.org/wiki/Automation")
    ]
  };

  // Backward-compatible flat list used by existing components
  export const IconList = [
    ...IconGroups.languages,
    ...IconGroups.databases,
    ...IconGroups.webFrameworks,
    ...IconGroups.backend,
    ...IconGroups.cloud,
    ...IconGroups.mlAi,
    ...IconGroups.animation3d,
    ...IconGroups.design,
    ...IconGroups.tooling
  ];
