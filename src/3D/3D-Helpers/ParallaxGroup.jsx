/**
 * ParallaxGroup Component
 * 
 * @description R3F helper component that applies parallax effects to 3D children based on
 * mouse position and scroll progress. Creates subtle depth and interactivity.
 * 
 * Effects Applied:
 * - Mouse-based rotation (X/Y axis tilting)
 * - Mouse-based position offset
 * - Scroll-based Z-depth movement
 * - Scroll-based Y position adjustment
 * - Smooth damping for natural motion
 * - Value clamping to prevent extreme movements
 * 
 * Performance:
 * - Uses useFrame for 60fps animation
 * - Direct ref manipulation (no state updates)
 * - Passive scroll listeners
 * - Optimized clamping and damping
 * 
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - R3F components to apply parallax to
 * @param {Object} [props.mouseStrength] - Mouse influence strength
 * @param {number} [props.mouseStrength.rotateX=0.1] - X-axis rotation from mouse Y
 * @param {number} [props.mouseStrength.rotateY=0.2] - Y-axis rotation from mouse X
 * @param {number} [props.mouseStrength.moveX=0.2] - X position from mouse X
 * @param {number} [props.mouseStrength.moveY=0.15] - Y position from mouse Y
 * @param {Object} [props.scrollStrength] - Scroll influence strength
 * @param {number} [props.scrollStrength.moveZ=1.5] - Z-depth movement on scroll
 * @param {number} [props.scrollStrength.moveY=0.5] - Y position on scroll
 * @param {Array<number>} [props.positionOffset=[0,0,0]] - Base position [x, y, z]
 * 
 * @example
 * ```jsx
 * <ParallaxGroup
 *   mouseStrength={{ rotateX: 0.15, rotateY: 0.25 }}
 *   scrollStrength={{ moveZ: 2, moveY: 0.8 }}
 *   positionOffset={[0, 1, -3]}
 * >
 *   <mesh>
 *     <boxGeometry />
 *     <meshStandardMaterial />
 *   </mesh>
 * </ParallaxGroup>
 * ```
 */

import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect } from 'react';

/**
 * ParallaxGroup
 * Wraps children and applies subtle parallax based on mouse and scroll.
 * - mouseStrength: rotation/position influence from pointer (-1..1)
 * - scrollStrength: influence from scroll progress (0..1 over first viewport)
 * - positionOffset: base position for the group
 */
export default function ParallaxGroup({
  children,
  mouseStrength = { rotateX: 0.1, rotateY: 0.2, moveX: 0.2, moveY: 0.15 },
  scrollStrength = { moveZ: 1.5, moveY: 0.5 },
  positionOffset = [0, 0, 0],
}) {
  const group = useRef();
  const { mouse } = useThree();
  const scrollProgressRef = useRef(0);

  // Update scroll progress directly without causing re-renders
  useEffect(() => {
    const handleScroll = () => {
      const h = window.innerHeight || 1;
      scrollProgressRef.current = Math.min(1, Math.max(0, window.scrollY / h));
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;

    // Clamp helper to prevent extreme values
    const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

    // Target values with clamping
    const tx = clamp((mouse.y || 0) * mouseStrength.rotateX, -0.3, 0.3);
    const ty = clamp((mouse.x || 0) * mouseStrength.rotateY, -0.3, 0.3);

    const scrollProgress = scrollProgressRef.current;
    const px = clamp(positionOffset[0] + (mouse.x || 0) * mouseStrength.moveX, positionOffset[0] - 2, positionOffset[0] + 2);
    const py = clamp(positionOffset[1] + (mouse.y || 0) * mouseStrength.moveY - scrollProgress * scrollStrength.moveY, positionOffset[1] - 3, positionOffset[1] + 2);
    const pz = clamp(positionOffset[2] - scrollProgress * scrollStrength.moveZ, positionOffset[2] - 4, positionOffset[2] + 1);

    // Damp towards targets
    const damp = (cur, target, lambda) => cur + (target - cur) * Math.min(1, lambda * (dt || 0.016));

    g.rotation.x = damp(g.rotation.x, tx, 6);
    g.rotation.y = damp(g.rotation.y, ty, 6);
    g.position.x = damp(g.position.x, px, 6);
    g.position.y = damp(g.position.y, py, 6);
    g.position.z = damp(g.position.z, pz, 6);
  });

  return <group ref={group} position={positionOffset}>{children}</group>;
}
