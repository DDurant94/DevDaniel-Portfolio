import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * CameraScrollAnimation - Smooth camera transitions and scroll-based movement
 * 
 * Manages camera position and FOV transitions between scene variants with smooth lerping.
 * Also pulls camera backward based on scroll progress to create parallax depth effect
 * where clouds move toward the viewer.
 * 
 * Features:
 * - Smooth camera lerping (position + FOV)
 * - Threshold-based snapping (prevents infinite micro-adjustments)
 * - Scroll-based camera pullback (12 units max)
 * - Per-axis distance checking
 * - Variant-based target updates
 * - Data attribute scroll progress reading
 * 
 * Lerp Settings:
 * - Factor: 0.08 (smooth but responsive)
 * - Threshold: 0.001 (snap when very close)
 * - Scroll distance: 12 units backward (Z-axis)
 * 
 * Behavior:
 * - Reads scroll progress from containerRef.dataset.scrollProgress
 * - Lerps camera to target position/FOV from variant
 * - Adds scroll-based Z offset (progress * 12)
 * - Snaps to target when within threshold
 * - Updates every frame via useFrame
 * 
 * @component
 * @param {Object} props
 * @param {React.RefObject} props.containerRef - Canvas container with data-scroll-progress
 * @param {Object} props.initialCam - Target camera config { position: [x,y,z], fov: number }
 * @param {string} props.variant - Current scene variant name (for logging/debugging)
 * 
 * @example
 * <CameraScrollAnimation
 *   containerRef={canvasContainerRef}
 *   initialCam={VARIANTS.home.cam}
 *   variant="home"
 * />
 */
export default function CameraScrollAnimation({ containerRef, initialCam, variant }) {
  const { camera, scene } = useThree();
  const scrollProgressRef = useRef(0);
  const targetCamRef = useRef(initialCam);
  const currentCamRef = useRef({
    position: [...initialCam.position],
    fov: initialCam.fov
  });
  
  // Update target camera when variant changes
  useEffect(() => {
    targetCamRef.current = initialCam;
  }, [initialCam]);
  
  useFrame(() => {
    if (!containerRef.current) return;
    
    const progress = parseFloat(containerRef.current.dataset.scrollProgress || 0);
    scrollProgressRef.current = progress;
  
    const lerpFactor = 0.15; // Faster lerping for smoother transitions
    const threshold = 0.001;
    
    // Check distance to target for each axis
    const xDiff = Math.abs(currentCamRef.current.position[0] - targetCamRef.current.position[0]);
    const yDiff = Math.abs(currentCamRef.current.position[1] - targetCamRef.current.position[1]);
    const zDiff = Math.abs(currentCamRef.current.position[2] - targetCamRef.current.position[2]);
    const fovDiff = Math.abs(currentCamRef.current.fov - targetCamRef.current.fov);

    if (xDiff > threshold) {
      currentCamRef.current.position[0] = THREE.MathUtils.lerp(
        currentCamRef.current.position[0],
        targetCamRef.current.position[0],
        lerpFactor
      );
    } else {
      currentCamRef.current.position[0] = targetCamRef.current.position[0];
    }
    
    if (yDiff > threshold) {
      currentCamRef.current.position[1] = THREE.MathUtils.lerp(
        currentCamRef.current.position[1],
        targetCamRef.current.position[1],
        lerpFactor
      );
    } else {
      currentCamRef.current.position[1] = targetCamRef.current.position[1];
    }
    
    if (zDiff > threshold) {
      currentCamRef.current.position[2] = THREE.MathUtils.lerp(
        currentCamRef.current.position[2],
        targetCamRef.current.position[2],
        lerpFactor
      );
    } else {
      currentCamRef.current.position[2] = targetCamRef.current.position[2];
    }
    
    if (fovDiff > threshold) {
      currentCamRef.current.fov = THREE.MathUtils.lerp(
        currentCamRef.current.fov,
        targetCamRef.current.fov,
        lerpFactor
      );
    } else {
      currentCamRef.current.fov = targetCamRef.current.fov;
    }
    
    // Move camera backward based on scroll so clouds come toward the viewer
    const moveDistance = 12;
    const scrollOffset = progress * moveDistance;
    camera.position.set(
      currentCamRef.current.position[0],
      currentCamRef.current.position[1],
      currentCamRef.current.position[2] + scrollOffset
    );
    
    // For projects variant, also move camera to the right to avoid clipping
    if (variant === 'projects') {
      camera.position.x += progress * 3;
    }
    
    camera.fov = currentCamRef.current.fov;
    camera.updateProjectionMatrix();
    
    // Fade entire scene opacity as we scroll
    // Start fading after 50% scroll, fully transparent by 100%
    const fadeStart = 0.5;
    const opacity = progress < fadeStart ? 1 : 1 - ((progress - fadeStart) / (1 - fadeStart));
    
    // Apply opacity to the entire scene (except symbols which handle their own opacity)
    scene.traverse((obj) => {
      if (obj.material && obj.userData?.isSymbol !== true) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(mat => {
            mat.transparent = true;
            mat.opacity = opacity;
          });
        } else {
          obj.material.transparent = true;
          obj.material.opacity = opacity;
        }
      }
    });
  });
  
  return null;
}
