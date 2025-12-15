import { Canvas, useFrame } from '@react-three/fiber';
import { Sky, Clouds, Cloud } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * AnimatedLights - Smoothly animated directional light for scene transitions
 * 
 * Internal component that lerps light properties when variant changes.
 * Uses slower 5% lerp for gradual atmospheric transitions.
 * 
 * @param {Object} props
 * @param {Object} props.targetLight - Target light config { color, intensity, pos }
 */
function AnimatedLights({ targetLight }) {
  const directionalRef = useRef();
  const currentColor = useRef(new THREE.Color(targetLight.color));
  const currentIntensity = useRef(targetLight.intensity);
  const currentPosition = useRef(new THREE.Vector3(...targetLight.pos));

  useFrame(() => {
    if (!directionalRef.current) return;

    // Smoothly lerp color
    const targetColor = new THREE.Color(targetLight.color);
    currentColor.current.lerp(targetColor, 0.05);
    directionalRef.current.color.copy(currentColor.current);

    // Smoothly lerp intensity
    currentIntensity.current += (targetLight.intensity - currentIntensity.current) * 0.05;
    directionalRef.current.intensity = currentIntensity.current;

    // Smoothly lerp position
    const targetPosition = new THREE.Vector3(...targetLight.pos);
    currentPosition.current.lerp(targetPosition, 0.05);
    directionalRef.current.position.copy(currentPosition.current);
  });

  return (
    <>
      <ambientLight intensity={100.6} color={'#000000'}/>
      <directionalLight
        ref={directionalRef}
        position={targetLight.pos}
        color={targetLight.color}
        intensity={targetLight.intensity}
      />
    </>
  );
}

const VARIANTS = {
  home: {
    light: { color: '#edd29a', intensity: 2.2, pos: [4, 5, 6] },
    sky: { turbidity: 7, rayleigh: 1.6, mieCoefficient: 0.005, mieDirectionalG: 0.88, elevation: 16 },
    fog: { color: '#eaf2ff', near: 50, far: 420 },
  },
  skills: {
    light: { color: '#ffd6a6', intensity: 2.2, pos: [4, 5, 6] },
    sky: { turbidity: 6, rayleigh: 1.5, mieCoefficient: 0.005, mieDirectionalG: 0.9, elevation: 20 },
    fog: { color: '#eaf2ff', near: 50, far: 420 },
  },
  portfolio: {
    light: { color: '#ffd6a6', intensity: 2.4, pos: [-5, 4, 5] },
    sky: { turbidity: 10, rayleigh: 2.0, mieCoefficient: 0.006, mieDirectionalG: 0.8, elevation: 5 },
    fog: { color: '#eaf2ff', near: 50, far: 420 },
  },
  about: {
    light: { color: '#ffe2a6', intensity: 2.1, pos: [5, 5, 4] },
    sky: { turbidity: 8, rayleigh: 1.4, mieCoefficient: 0.005, mieDirectionalG: 0.85, elevation: 12 },
    fog: { color: '#eaf2ff', near: 50, far: 420 },
  },
};

/**
 * LoaderScene - Simplified cloud scene for page transitions
 * 
 * Lightweight 3D cloud scene used during page transitions. Shows animated clouds
 * with sky, fog, and bloom effects. Adapts to mobile with reduced cloud count.
 * Has 4 variants matching main hero scene moods.
 * 
 * Features:
 * - 4 scene variants (home, skills, portfolio, about)
 * - Animated sky with adjustable parameters
 * - Volumetric clouds (depth-sorted)
 * - Fog atmosphere
 * - Bloom post-processing
 * - Responsive cloud count (mobile: 8, desktop: 10)
 * - Smooth light transitions
 * - No physics or heavy geometry (performance optimized)
 * 
 * Variants:
 * - home: Warm (turbidity 7, rayleigh 1.6, elevation 16)
 * - skills: Bright (turbidity 6, rayleigh 1.5, elevation 20)
 * - portfolio: Dramatic (turbidity 10, rayleigh 2.0, elevation 5)
 * - about: Soft (turbidity 8, rayleigh 1.4, elevation 12)
 * 
 * Cloud Positions:
 * - Desktop: 10 clouds (5 foreground, 5 background)
 * - Mobile: 8 clouds (4 foreground, 4 background)
 * - Depth range: Z -2 to -12
 * 
 * Performance:
 * - No shadows
 * - No physics
 * - Simplified geometry
 * - Optimized for transition overlay
 * 
 * @component
 * @param {Object} props
 * @param {string} props.variant - Scene variant ('home'|'skills'|'portfolio'|'about')
 * 
 * @example
 * <LoaderScene variant="home" />
 * <LoaderScene variant={currentVariant} />
 */
export default function LoaderScene({ variant = 'home' }) {
  const v = VARIANTS[variant] ?? VARIANTS.home;
  
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 768px)');
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener?.('change', onChange) || mq.addListener?.(onChange);
    return () => mq.removeEventListener?.('change', onChange) || mq.removeListener?.(onChange);
  }, []);

  return (
    <Canvas 
      dpr={Math.min(window.devicePixelRatio || 1, 2)}
      camera={{ position: [0, 0, 8], fov: 50, near: 0.5, far: 3000 }} 
      style={{ width: '100vw', height: '100vh' }}
      gl={{ 
        powerPreference: 'high-performance',
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: false
      }}
      frameloop="always"
    >
      {/* Atmosphere */}
      <Sky
        distance={450000}
        sunPosition={[10, v.sky.elevation, -30]}
        turbidity={v.sky.turbidity}
        rayleigh={v.sky.rayleigh}
        mieCoefficient={v.sky.mieCoefficient}
        mieDirectionalG={v.sky.mieDirectionalG}
      />
      {/* <fog attach="fog" args={[v.fog.color, v.fog.near, v.fog.far]} /> */}

      {/* Lights with smooth transitions */}
      <AnimatedLights targetLight={v.light} />

      {/* Foreground Clouds */}
      <group position={[0, 0.2, 2]}>
        <Clouds limit={40} range={32} fade={12}>
          <Cloud seed={1800} volume={9} position={[-1.8, 0.6, 0]}  opacity={0.45} scale={1.2} color="#ffffff" segments={20} fade={18} />
          <Cloud seed={1800} volume={9} position={[-2.2, 0.35, -0.2]}  opacity={0.38} scale={3.8} color="#ffffff" segments={20} fade={10} />
          <Cloud seed={1800} volume={9} position={[1.6, 0.55, -0.3]}  opacity={0.42} scale={3.9} color="#ffffff" segments={20} fade={19} />
          
          <Cloud seed={1800} volume={9} position={[-6.0, -2.2, -3.5]}  opacity={0.55} scale={1.4} color="#ffffff" segments={24} fade={15} />
          <Cloud seed={1800} volume={9} position={[6.2, -2.3, -3.8]} opacity={0.52} scale={1.2} color="#ffffff" segments={24} fade={14} />
          <Cloud seed={1800} volume={9} position={[0.0, -2.5, -4.2]} opacity={0.48} scale={1.8} color="#ffffff" segments={24} fade={16} />
          <Cloud seed={1800} volume={9} position={[3.6, -1.4, -1.8]} opacity={0.35} scale={1.6} color="#ffffff" segments={24} fade={12} />
          <Cloud seed={1800} volume={9} position={[-3.4, -1.6, -1.9]}  opacity={0.32} scale={2.4} color="#ffffff" segments={24} fade={11} />
        </Clouds>
      </group>

      {/* Horizon Clouds */}
      <group position={[0, isMobile ? -1.0 : -0.85, -1.5]}>
        <Clouds limit={24} range={38} fade={18}>
          <Cloud seed={1800} volume={9} position={[-8.0, -2.8, -6.5]}  opacity={isMobile ? 0.72 : 0.68} scale={[12, 3, 6]} color="#ffffff" segments={20} fade={25}/>
          <Cloud seed={1800} volume={9} position={[8.0, -2.9, -6.8]} opacity={isMobile ? 0.72 : 0.68} scale={[12, 3, 6]} color="#ffffff" segments={20} fade={25}/>
          <Cloud seed={1800} volume={9} position={[0.0, -3.1, -7.2]}  opacity={isMobile ? 0.75 : 0.70} scale={[16, 3.5, 7]} color="#ffffff" segments={22} fade={30}/>
        </Clouds>
      </group>

      {/* Mid Ring Clouds */}
      <group position={[0, 0.5, 0]}>
        <Clouds limit={14} range={30} fade={15}>
          {Array.from({ length: 14 }, (_, i) => {
            const a = (i / 10) * Math.PI * 2;
            const r = 4.5;
            const pos = [Math.cos(a) * r, 0.45 + Math.sin(a * 2) * 0.18, Math.sin(a) * r];
            const scale = 1.0 + Math.sin(a * 1.3) * 0.45;
            // const speed = 0.03 + (i % 3) * 0.015;
            const fade = 10 + (i % 4) * 3;
            
            return (
              <Cloud 
                key={i}
                seed={1800} 
                volume={9} 
                position={pos} 
               
                opacity={0.28} 
                scale={scale} 
                color="#fafafa" 
                segments={20} 
                fade={fade}
              />
            );
          })}
        </Clouds>
      </group>

      {/* Post-processing - Disabled to prevent WebGL context conflicts */}
      {/* <EffectComposer>
        <Bloom intensity={0.45} luminanceThreshold={0.3} luminanceSmoothing={0.4} />
      </EffectComposer> */}
    </Canvas>
  );
}
