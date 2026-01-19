// src/components/CodingSymbolCloud.jsx

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import SymbolText from './SymbolText';

/**
 * CodingSymbolCloud - 200 orbiting code symbols in 3D space
 * 
 * Creates a spherical cloud of programming symbols (braces, operators, punctuation)
 * that orbit around the gear. Each symbol has unique position, size, phase, and speed
 * for natural variation. Symbols are generated once and animated via useFrame.
 * 
 * Features:
 * - 200 symbols with 25 unique characters
 * - Spherical distribution (radius 3.5-5.5 units)
 * - Individual orbital speeds and phases
 * - Size variation (0.0005 - 0.0405 scale)
 * - Theta and phi angle distribution for natural spread
 * - Fixed center at world origin
 * - Performance optimized (memoized generation)
 * - Optional animation toggle
 * 
 * Symbol Set:
 * { }, =, [ ], /, :, ;, </>, ( ), &, |, +, -, *, %, $, #, @, !, ?, < >, ===, !==, =>, ++, --
 * 
 * Distribution:
 * - Radius: 3.5 + (random^2.5 * 2) - power distribution for clustering near center
 * - Theta: random * PI * -1.5 - horizontal angle
 * - Phi: PI/2 + (random - 0.5) * 0.8 + theta * 0.2 - vertical angle with theta coupling
 * 
 * @component
 * @param {Object} props
 * @param {boolean} props.enableAnimations - Enable orbital animations (default: true)
 * @param {React.RefObject} props.containerRef - Container ref for scene bounds
 * @param {boolean} props.isMobile - Mobile device flag for reduced symbol count
 * 
 * @example
 * <CodingSymbolCloud
 *   enableAnimations={!prefersReducedMotion}
 *   containerRef={sceneContainerRef}
 *   isMobile={isMobile}
 * />
 */

const codeSymbols = ['{ }', '=', '[ ]', '/', ':', ';', '</>', '( )', '&', '|', '+', '-', '*', '%', '$', '#', '@', '!', '?', '< >', '===', '!==', '=>', '++', '--'];

export default function CodingSymbolCloud({ enableAnimations = true, containerRef, isMobile = false }) {
  // fixed center at world origin
  const gearCenterRef = useRef(new THREE.Vector3(0, 0, 0));
  // drives the orbital timing
  const timeRef = useRef(0);

  // generate your cloud of symbols once
  const symbols = useMemo(() => {
    const symbolCount = isMobile ? 50 : 100;
    return Array.from({ length: symbolCount }, () => {
      const radius = 3.5 + Math.pow(Math.random(), 2.5) * 2;
      const theta = Math.random() * Math.PI * -1.5;
      const phi = Math.PI / 2 + (Math.random() - 0.5) * 0.8 + theta * 0.2;

      const basePosition = new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );

      const char = codeSymbols[Math.floor(Math.random() * codeSymbols.length)];
      const scale = 0.0005 + Math.random() * 0.04;

      return {
        char,
        basePosition,
        scale,
        phase: Math.random() * Math.PI * 2,
        speed: 0.005 + Math.random() * 0.0000015,
      };
    });
  }, [isMobile]);

  // update elapsed time each frame only if animations are enabled
  useFrame(({ clock }) => {
    if (enableAnimations) {
      timeRef.current = clock.getElapsedTime();
    }
  });

  return (
    <>
      {symbols.map((symbol, i) => (
        <SymbolText
          key={i}
          symbol={symbol}
          gearCenterRef={gearCenterRef}
          timeRef={timeRef}
          enableAnimations={enableAnimations}
          containerRef={containerRef}
          isMobile={isMobile}
        />
      ))}
    </>
  );
}