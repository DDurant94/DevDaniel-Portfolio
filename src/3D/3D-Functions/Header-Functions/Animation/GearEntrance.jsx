import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { CodingGear } from '../Models/CodingGearModel';

/**
 * GearEntrance - Animated gear entrance with scroll-based rotation
 * 
 * Handles the initial entrance animation (1.4s) where the gear drops in and scales up,
 * plus ongoing Z-axis rotation controlled by scroll interactions. After entrance completes,
 * maintains static position while rotation continues.
 * 
 * Features:
 * - One-time entrance animation (runs once on mount)
 * - Cubic ease-out for natural motion
 * - Position animation: Y +8, Z -6 → target position
 * - Scale animation: 0.4 → target scale
 * - Scroll-based Z rotation (damped when scrollY = 0)
 * - Smooth rotation interpolation (15% lerp)
 * - Animation completion flag (prevents re-running)
 * 
 * Entrance Timeline (1.4s):
 * - Start: Y = target + 8, Z = target - 6, scale = 0.4
 * - Easing: 1 - (1-t)^3 (cubic ease-out)
 * - End: Target position and scale
 * 
 * Rotation Behavior:
 * - At scroll top: Damped rotation (multiply by 0.85)
 * - While scrolling: Smooth interpolation to target (15% lerp)
 * - Target updated by useGearInteraction hook
 * 
 * @component
 * @param {Object} props
 * @param {number[]} props.position - Target position [x, y, z]
 * @param {number[]} props.rotation - Static rotation [x, y, z] (X and Y only)
 * @param {number} props.targetScale - Target scale value
 * @param {React.RefObject<number>} props.targetRotationRef - Ref for target Z rotation
 * @param {boolean} props.isMobile - Mobile device flag (unused but available)
 * 
 * @example
 * const targetRotationRef = useRef(0);
 * 
 * <GearEntrance
 *   position={[0, 0, 0]}
 *   rotation={[-0.2, 0, 0]}
 *   targetScale={1.0}
 *   targetRotationRef={targetRotationRef}
 *   isMobile={false}
 * />
 */
export default function GearEntrance({ position, rotation, targetScale, targetRotationRef, isMobile }) {
  const ref = useRef();
  const startRef = useRef(null);
  const duration = 1.4;
  const animationCompleteRef = useRef(false);

  useFrame(({ clock }) => {
    if (!ref.current) return;

    // Handle rotation based on scroll
    if (window.scrollY === 0) {
      targetRotationRef.current *= 0.85;
      ref.current.rotation.z *= 0.85;
    } else {
      const diff = targetRotationRef.current - ref.current.rotation.z;
      ref.current.rotation.z += diff * 0.15;
    }

    // Run entrance animation only once on mount
    if (!animationCompleteRef.current) {
      if (startRef.current === null) {
        startRef.current = clock.getElapsedTime();
      }
      
      const elapsed = clock.getElapsedTime() - startRef.current;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      
      const startY = position[1] + 8;
      const startZ = position[2] - 6;
      const currentY = startY + (position[1] - startY) * eased;
      const currentZ = startZ + (position[2] - startZ) * eased;
      
      ref.current.position.set(position[0], currentY, currentZ);
      
      const startScale = 0.4;
      const currentScale = startScale + (targetScale - startScale) * eased;
      ref.current.scale.setScalar(currentScale);
      
      // Mark animation as complete when finished
      if (t >= 1) {
        animationCompleteRef.current = true;
      }
    } else {
      // After animation completes, just set the position directly
      ref.current.position.set(position[0], position[1], position[2]);
      ref.current.scale.setScalar(targetScale);
    }
    
    ref.current.rotation.x = rotation[0];
    ref.current.rotation.y = rotation[1];
    // Z rotation is handled by scroll interaction above
  });

  return (
    <group ref={ref} castShadow receiveShadow>
      <CodingGear />
    </group>
  );
}
