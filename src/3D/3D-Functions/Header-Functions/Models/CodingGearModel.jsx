/**
 * CodingGear Component
 * 
 * @description 3D gear model loaded from GLTF file. Displays coding-themed mechanical gear
 * with multiple materials and shadow support. Used in hero scenes across the site.
 * 
 * Model Details:
 * - Source: /models/Gear-Model/GearModelOptimized.glb
 * - Geometry: Torus-based gear teeth with layered materials
 * - Materials: PaletteMaterial001, PaletteMaterial002, PaletteMaterial003
 * - Shadows: Cast and receive (optimized for performance)
 * - Rotation: Pre-rotated 90° on X-axis for proper orientation
 * - Position: Offset -2 on Z-axis
 * 
 * Performance:
 * - Preloaded to prevent loading delays
 * - Optimized geometry (reduced polygon count)
 * - Shared materials across instances
 * - Shadow receiving disabled on one mesh for performance
 * 
 * @component
 * @param {Object} props - Standard R3F group props
 * @param {React.Ref} ref - Forwarded ref for parent control/animation
 * 
 * @example
 * ```jsx
 * const gearRef = useRef();
 * 
 * <CodingGear ref={gearRef} position={[0, 0, 0]} rotation={[0, Math.PI, 0]} />
 * 
 * // Animate in parent component
 * useFrame(() => {
 *   if (gearRef.current) {
 *     gearRef.current.rotation.z += 0.01;
 *   }
 * });
 * ```
 */

import { useGLTF } from "@react-three/drei";
import { forwardRef } from 'react';

export const CodingGear = forwardRef((props, ref) => {
  const { nodes, materials } = useGLTF('/models/Gear-Model/GearModelOptimized.glb');

  return (
    <group ref={ref} {...props} dispose={null}>
      <group rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -2]} scale={[1, 1, 1]}>
        <mesh 
          geometry={nodes.Torus012.geometry} 
          material={materials.PaletteMaterial002} 
          castShadow 
          receiveShadow 
        />
        <mesh 
          geometry={nodes.Torus012_1.geometry} 
          material={materials.PaletteMaterial003} 
          castShadow 
          receiveShadow 
        />
        <mesh 
          geometry={nodes.Torus012_2.geometry} 
          material={materials.PaletteMaterial001} 
          castShadow 
          // receiveShadow 
        />
      </group>
    </group>
  );
});

useGLTF.preload('/models/Gear-Model/GearModelOptimized.glb');