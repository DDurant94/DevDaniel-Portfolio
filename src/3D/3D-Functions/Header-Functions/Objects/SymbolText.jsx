import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { a } from '@react-spring/three';
import { Text3D } from '@react-three/drei';
import { useSymbolSpring } from './../../../3D-Hooks/Header-Hooks/useSymbolSpring';
import * as THREE from 'three';

// Shared material across all symbol instances for performance
const sharedMaterial = new THREE.MeshPhysicalMaterial({
  color: '#cfccc8',
  metalness: 0.6,
  reflectivity: 0.9,
  sheenRoughness: 0,
  sheen: 0.7,
  roughness: 0,
  sheenColor: '#000000',
  thickness: 0.1,
  transparent: true,
});

/**
 * SymbolText - Individual 3D text symbol with orbital animation
 * 
 * Renders a single code symbol as 3D text with smooth orbital motion, hover scaling,
 * and scroll-based opacity fade. Uses react-spring for position animation and
 * MeshPhysicalMaterial for metallic appearance.
 * 
 * Features:
 * - 3D text rendering (Text3D from drei)
 * - Orbital animation via useSymbolSpring
 * - Hover state with scale effect (1.06x)
 * - Scroll-based opacity fade (starts at 50% scroll)
 * - Metallic material (high reflectivity, sheen)
 * - Symbol identifier flag (userData.isSymbol)
 * - Memoized material creation
 * - Shadow casting and receiving
 * 
 * Material Properties:
 * - Color: #cfccc8 (light gray)
 * - Metalness: 0.6
 * - Reflectivity: 0.9
 * - Sheen: 0.7 (with black sheen color)
 * - Roughness: 0
 * - Transparent: true (for opacity fade)
 * 
 * Opacity Fade:
 * - 0-50% scroll: Opacity 1.0
 * - 50-100% scroll: Linear fade to 0
 * - Reads from containerRef.dataset.scrollProgress
 * 
 * Animation:
 * - Position: Spring-based orbital motion
 * - Scale: 1.0 default, 1.06 on hover
 * - Controlled by useSymbolSpring hook
 * 
 * @component
 * @param {Object} props
 * @param {Object} props.symbol - Symbol data { char, basePosition, scale, phase, speed }
 * @param {React.RefObject<THREE.Vector3>} props.gearCenterRef - Ref to gear center position
 * @param {React.RefObject<number>} props.timeRef - Ref to elapsed time
 * @param {boolean} props.enableAnimations - Enable orbital animations (default: false)
 * @param {React.RefObject} props.containerRef - Container with scroll progress data
 * @param {boolean} props.isMobile - Mobile device flag for performance mode
 * 
 * @example
 * <SymbolText
 *   symbol={{ char: '{ }', basePosition: new Vector3(2, 1, 0), scale: 0.02, phase: 1.5, speed: 0.01 }}
 *   gearCenterRef={gearCenterRef}
 *   timeRef={timeRef}
 *   enableAnimations={true}
 *   containerRef={sceneContainerRef}
 *   isMobile={false}
 * />
 */
export default function SymbolText({
  symbol,
  gearCenterRef,
  timeRef,
  enableAnimations = false,
  containerRef,
  isMobile = false,
}) {
  // Skip hover state on mobile (no hover on touch devices)
  const [hovered, setHovered] = useState(false);
  const { spring, update } = useSymbolSpring(symbol.basePosition);
  const meshRef = useRef();
  const lastOpacity = useRef(1);

  useFrame(() => {
    // Only update position if animations enabled
    if (enableAnimations) {
      update(
        gearCenterRef.current,
        timeRef.current,
        symbol.phase,
        hovered
      );
    }
    
    // Update opacity on scroll (throttled - only if changed significantly)
    if (containerRef?.current && meshRef.current) {
      const progress = parseFloat(containerRef.current.dataset.scrollProgress || 0);
      const fadeStart = 0.5;
      const opacity = progress < fadeStart ? 1 : 1 - ((progress - fadeStart) / (1 - fadeStart));
      
      // Only update if opacity changed by more than 0.05 to reduce work
      if (Math.abs(opacity - lastOpacity.current) > 0.05) {
        lastOpacity.current = opacity;
        meshRef.current.userData.isSymbol = true;
        sharedMaterial.opacity = opacity;
      }
    }
  });

  return (
    <a.mesh
      ref={meshRef}
      position={spring.position}
      scale={hovered && !isMobile ? 1.06 : 1}
      onPointerOver={!isMobile ? () => setHovered(true) : undefined}
      onPointerOut={!isMobile ? () => setHovered(false) : undefined}
    >
      <Text3D
        font="/fonts/helvetiker_regular.typeface.json"
        size={0.08}
        height={0.015}
        curveSegments={isMobile ? 2 : 4}
        receiveShadow
        castShadow
        material={sharedMaterial}
      >
        {symbol.char}
      </Text3D>
    </a.mesh>
  );
}