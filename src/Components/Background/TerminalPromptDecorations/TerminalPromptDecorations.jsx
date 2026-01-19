import React, { useState, useEffect } from 'react';
import { useMediaQuery } from '../../../Context/MediaQueryContext.hook';
import './../../../Styles/Component-Styles/Background-Styles/TerminalPromptDecorations-Styles/TerminalPromptDecorationsStyles.css';

/** TerminalPromptDecorations - Animated terminal command prompts as background decoration */
const TerminalPromptDecorations = () => {
  const { isDesktop, prefersReducedMotion } = useMediaQuery();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (prefersReducedMotion || !isDesktop) return;

    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReducedMotion, isDesktop]);

  // Desktop only for readability
  if (!isDesktop) return null;

  const prompts = [
    { id: 1, text: '$ npm run dev', position: 'top-left', depth: 0.5 },
    { id: 2, text: '> git commit -m "update"', position: 'top-right', depth: 0.3 },
    { id: 3, text: '$ npm install', position: 'mid-left', depth: 0.7 },
    { id: 4, text: '> npm test', position: 'mid-right', depth: 0.4 },
    { id: 5, text: '$ npm build', position: 'bottom-left', depth: 0.6 },
    { id: 6, text: '> git push origin main', position: 'bottom-right', depth: 0.5 }
  ];

  return (
    <div 
      className="terminal-prompt-decorations"
      style={{
        '--mouse-x': mousePosition.x,
        '--mouse-y': mousePosition.y
      }}
    >
      {prompts.map((prompt) => (
        <div 
          key={prompt.id} 
          className={`terminal-prompt prompt-${prompt.position}`}
          style={{
            '--depth': prompt.depth
          }}
        >
          <span className="prompt-symbol">{prompt.text.split(' ')[0]}</span>
          <span className="prompt-command">{prompt.text.substring(prompt.text.indexOf(' ') + 1)}</span>
        </div>
      ))}
    </div>
  );
};

export default TerminalPromptDecorations;
