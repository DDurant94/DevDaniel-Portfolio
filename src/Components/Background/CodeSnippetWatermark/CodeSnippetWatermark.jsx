import { useMediaQuery } from '../../../Context/MediaQueryContext.hook';
import './../../../Styles/Component-Styles/Background-Styles/CodeSnippetWatermark-Styles/CodeSnippetWatermarkStyles.css';

/** CodeSnippetWatermark - Faded code snippets as background texture (desktop only) */
const CodeSnippetWatermark = () => {
  const { isDesktop } = useMediaQuery();

  if (!isDesktop) return null;

  return (
    <div className="code-snippet-watermark">
      {/* React Component Snippet */}
      <pre className="code-snippet snippet-1">
{`const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  
  useEffect(() => {
    fetchProjects();
  }, []);
  
  return (
    <section className="portfolio">
      {projects.map(project => (
        <ProjectCard key={project.id} {...project} />
      ))}
    </section>
  );
};`}
      </pre>

      {/* CSS Snippet */}
      <pre className="code-snippet snippet-2">
{`.hero-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-4);
  padding: var(--space-8);
  background: linear-gradient(135deg, 
    var(--color-primary), 
    var(--color-accent)
  );
}`}
      </pre>

      {/* Python Snippet */}
      <pre className="code-snippet snippet-3">
{`def analyze_data(dataset):
    """Process and analyze dataset"""
    
    results = []
    for item in dataset:
        processed = transform(item)
        if processed['score'] > threshold:
            results.append(processed)
    
    return {
        'total': len(results),
        'average': sum(r['score'] for r in results) / len(results),
        'data': results
    }`}
      </pre>

      {/* Python Data Science Snippet */}
      <pre className="code-snippet snippet-4">
{`import pandas as pd
import numpy as np

df = pd.read_csv('data.csv')
df['normalized'] = (df['value'] - df['value'].mean()) / df['value'].std()

result = df.groupby('category').agg({
    'value': ['mean', 'std'],
    'count': 'sum'
}).round(2)`}
      </pre>
    </div>
  );
};

export default CodeSnippetWatermark;
