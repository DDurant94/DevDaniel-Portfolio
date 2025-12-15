import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

/**
 * AnimatedLights - Smoothly animated directional light with transitions
 * 
 * Lerps light position, intensity, and color when target values change (scene variant switching).
 * Uses slower lerp factor (0.03) for gradual, atmospheric transitions between scene moods.
 * 
 * Features:
 * - Position lerp (3-axis)
 * - Intensity lerp
 * - Color lerp (THREE.Color.lerp)
 * - Smooth transitions (3% per frame)
 * - Shadow casting enabled
 * - Per-frame updates via useFrame
 * 
 * Lerp Factor:
 * - 0.03 (slow, atmospheric - takes ~100 frames to reach 95% of target)
 * - Creates gradual lighting mood changes
 * - Prevents jarring transitions between variants
 * 
 * Light Properties:
 * - Type: DirectionalLight
 * - Shadows: Enabled (castShadow)
 * - Animated: Position, intensity, color
 * - Updates: Every frame
 * 
 * @component
 * @param {Object} props
 * @param {Object} props.targetLight - Target light configuration
 * @param {string} props.targetLight.color - Hex color string (e.g., '#ffd6a6')
 * @param {number} props.targetLight.intensity - Light intensity
 * @param {number[]} props.targetLight.pos - Position [x, y, z]
 * 
 * @example
 * <AnimatedLights
 *   targetLight={{
 *     color: '#edd29a',
 *     intensity: 1.1,
 *     pos: [4, 5, 6]
 *   }}
 * />
 */
export default function AnimatedLights({ targetLight }) {
  const lightRef = useRef();
  const currentLightRef = useRef({
    color: targetLight.color,
    intensity: targetLight.intensity,
    pos: [...targetLight.pos]
  });
  
  useFrame(() => {
    if (!lightRef.current) return;
    
    const lerpFactor = 0.03;
    
    // Lerp position
    currentLightRef.current.pos[0] = THREE.MathUtils.lerp(
      currentLightRef.current.pos[0],
      targetLight.pos[0],
      lerpFactor
    );
    currentLightRef.current.pos[1] = THREE.MathUtils.lerp(
      currentLightRef.current.pos[1],
      targetLight.pos[1],
      lerpFactor
    );
    currentLightRef.current.pos[2] = THREE.MathUtils.lerp(
      currentLightRef.current.pos[2],
      targetLight.pos[2],
      lerpFactor
    );
    
    // Lerp intensity
    currentLightRef.current.intensity = THREE.MathUtils.lerp(
      currentLightRef.current.intensity,
      targetLight.intensity,
      lerpFactor
    );
    
    lightRef.current.position.set(...currentLightRef.current.pos);
    lightRef.current.intensity = currentLightRef.current.intensity;
    
    // Lerp color
    const targetColor = new THREE.Color(targetLight.color);
    lightRef.current.color.lerp(targetColor, lerpFactor);
  });
  
  return (
    <directionalLight
      ref={lightRef}
      position={targetLight.pos}
      color={targetLight.color}
      intensity={targetLight.intensity}
      castShadow
    />
  );
}
