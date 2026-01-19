/**
 * MountainModel Component
 * 
 * @description Loads and renders 3D mountain model with custom material overrides.
 * Clones GLTF scene to allow multiple instances and applies consistent styling.
 * 
 * Features:
 * - GLTF model loading with useGLTF
 * - Scene cloning for reusability
 * - Material override (custom color: #D9B37F gold/tan)
 * - Texture removal for solid color rendering
 * - Shadow casting and receiving
 * - Selective shadow casting (excludes 'Object_5')
 * - Forward ref support for external control
 * - Preloaded for performance
 * 
 * Material Modifications:
 * - Clones all materials to avoid shared state
 * - Removes texture maps (map = null)
 * - Sets uniform color (#D9B37F)
 * - Enables needsUpdate flag
 * 
 * Shadow Configuration:
 * - All meshes receive shadows
 * - All meshes cast shadows except 'Object_5'
 * - Requires scene lights with castShadow enabled
 * 
 * @component
 * @param {Object} props - All props forwarded to primitive
 * @param {React.Ref} ref - Forward ref to access mesh group
 * 
 * @example
 * ```jsx
 * import { MountainModel } from './Models/MountainModel';
 * 
 * function Scene() {
 *   const mountainRef = useRef();
 *   
 *   return (
 *     <MountainModel
 *       ref={mountainRef}
 *       position={[0, -2, -10]}
 *       scale={1.5}
 *       rotation={[0, Math.PI / 4, 0]}
 *     />
 *   );
 * }
 * ```
 */

import { useGLTF } from "@react-three/drei";
import { forwardRef } from 'react';

export const MountainModel = forwardRef((props, ref) => {
  const { scene } = useGLTF('/models/Mountain-Model/MountainScene.glb');
  
  const clonedScene = scene.clone();
  
  clonedScene.traverse((obj) => {
    if (obj.isMesh && obj.material) {
      obj.material = obj.material.clone();
      obj.material.map = null;
      obj.material.color.set('#3e2804');
      
      obj.material.needsUpdate = true;
      
      if (obj.name !== 'Object_5') {
        obj.castShadow = true;
      }
      obj.receiveShadow = true;
    }
  });

  return <primitive
    ref={ref}
    object={clonedScene}
    dispose={null}
    castShadow
    receiveShadow
    {...props}
  />
});

// Only preload on desktop (avoid mobile bandwidth waste)
if (typeof window !== 'undefined' && window.innerWidth >= 768) {
  useGLTF.preload('/models/Mountain-Model/MountainScene.glb');
}
