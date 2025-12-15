/**
 * useSymbolSpring Hook
 * 
 * @description Custom hook for animating 3D coding symbols with orbital motion, organic drift,
 * and hover interactions using react-spring physics-based animations.
 * 
 * Features:
 * - Orbital rotation around center point
 * - Organic drift with sine wave variations
 * - Smooth physics-based transitions (react-spring)
 * - Hover push effect (radial outward movement)
 * - Phase offset for staggered animations
 * - Configurable rotation speed and drift amount
 * 
 * Animation Components:
 * 1. Orbital: Circular rotation around center at rotationSpeed
 * 2. Drift X: sin(t + phase) * drift
 * 3. Drift Y: cos(t + phase * 1.5) * drift * 0.5 (vertical bobbing)
 * 4. Drift Z: sin(t + phase * 0.7) * drift
 * 5. Hover Push: Radial displacement outward by hoverPush units
 * 
 * Spring Config:
 * - mass: 0.6 (light, responsive)
 * - tension: 5 (gentle pull)
 * - friction: 8 (smooth damping)
 * 
 * @param {THREE.Vector3} basePosition - Initial position in 3D space
 * @param {Object} options - Configuration options
 * @param {number} [options.rotationSpeed=0.009] - Angular velocity for orbital rotation
 * @param {number} [options.drift=0.12] - Amplitude of organic drift motion
 * @param {number} [options.hoverPush=0.5] - Distance to push outward on hover
 * 
 * @returns {Object} Animation controls
 * @returns {Object} returns.spring - Spring animated values (position)
 * @returns {Function} returns.update - Update function(center, time, phase, isHovered)
 * 
 * @example
 * ```jsx
 * const { spring, update } = useSymbolSpring(
 *   new THREE.Vector3(5, 0, 0),
 *   { rotationSpeed: 0.01, drift: 0.15, hoverPush: 0.8 }
 * );
 * 
 * // In animation loop:
 * update(centerPoint, elapsedTime, symbolPhase, isHovered);
 * 
 * // In JSX:
 * <animated.mesh position={spring.position}>
 *   <Text3D>CODE</Text3D>
 * </animated.mesh>
 * ```
 */

import { useSpring } from '@react-spring/three';
import { useRef } from 'react';
import * as THREE from 'three';

export function useSymbolSpring(
  basePosition,
  {
    rotationSpeed = 0.009,
    drift = 0.12,
    hoverPush = 0.5,
  } = {}
) {
  // initial rest position
  const origin = useRef(basePosition.clone());

  const [spring, api] = useSpring(() => ({
    position: origin.current.toArray(),
    config: { mass: 0.6, tension: 5, friction: 8 },
  }));

  const update = (center, t, phase, isHovered) => {
    // 1) orbit + organic drift
    const angle = t * rotationSpeed + phase;
    const rotatedX =
      basePosition.x * Math.cos(angle) -
      basePosition.z * Math.sin(angle);
    const rotatedZ =
      basePosition.x * Math.sin(angle) +
      basePosition.z * Math.cos(angle);

    const x =
      center.x +
      rotatedX +
      Math.sin(t + phase) * drift;
    const y =
      center.y +
      basePosition.y +
      Math.cos(t + phase * 1.5) * drift * 0.5;
    const z =
      center.z +
      rotatedZ +
      Math.sin(t + phase * 0.7) * drift;

    const newPos = new THREE.Vector3(x, y, z);

    // 2) if hovered, push outward along the radial
    if (isHovered) {
      const dir = new THREE.Vector3()
        .subVectors(newPos, center)
        .normalize()
        .multiplyScalar(hoverPush);
      newPos.add(dir);
    }

    api.start({ position: newPos.toArray() });
  };

  return { spring, update };
}