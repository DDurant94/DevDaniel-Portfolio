import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Sky, Clouds, Cloud } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import ParallaxGroup from '../../../3D-Helpers/ParallaxGroup';
import { MountainModel } from '../../../3D-Functions/Header-Functions/Models/MountainModel';
import CodingSymbolCloud from '../../../3D-Functions/Header-Functions/Objects/OrbitingSymbols';
import CameraScrollAnimation from '../../../3D-Functions/Header-Functions/Animation/CameraScrollAnimation';
import GearEntrance from '../../../3D-Functions/Header-Functions/Animation/GearEntrance';
import useScrollProgress from '../../../3D-Hooks/Header-Hooks/useScrollProgress';
import useGearInteraction from '../../../3D-Hooks/Header-Hooks/useGearInteraction';
import { VARIANTS } from './../../../../DataSets/Hero/HeroScene';
import { useEffect, useState, useRef } from 'react';

// Cleanup component to dispose WebGL resources on unmount
function SceneCleanup() {
  const { gl, scene } = useThree();
  
  useEffect(() => {
    return () => {
      // Dispose all geometries and materials in the scene
      scene.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose();
        }
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      
      // Dispose renderer
      gl.dispose();
      gl.forceContextLoss();
    };
  }, [gl, scene]);
  
  return null;
}

// Component to detect when scene has actually rendered
function SceneReadyDetector({ onReady }) {
  const hasCalledReady = useRef(false);
  const frameCount = useRef(0);
  const startTime = useRef(Date.now());

  useFrame(() => {
    frameCount.current += 1;
    const elapsedTime = Date.now() - startTime.current;
    
    // Wait for at least 10 frames AND minimum 1 second to ensure scene is visible
    if (frameCount.current >= 10 && elapsedTime >= 1000 && !hasCalledReady.current && onReady) {
      hasCalledReady.current = true;
      // Additional small delay to ensure textures are fully rendered
      setTimeout(() => onReady(), 200);
    }
  });

  return null;
}

// Constant styles to prevent re-renders
const containerStyle = {
  width: '100%',
  height: '200vh',
  position: 'relative'
};

const canvasStyle = {
  position: 'sticky',
  top: 0,
  height: '100vh',
  pointerEvents: 'auto'
};

export default function GearCloudScene({ 
  variant = 'home', 
  containerRef: externalContainerRef, 
  showGear = true,
  performanceLevel = 'full',
  onSceneReady,
  isMobile: isMobileProp
}) {
  const v = VARIANTS[variant] ?? VARIANTS.home;
  
  // State - use prop if provided, otherwise detect
  const [isMobile, setIsMobile] = useState(() =>
    isMobileProp !== undefined ? isMobileProp : 
    (typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches)
  );
  const [isUltraWide, setIsUltraWide] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth / window.innerHeight >= 2.3
  );
  // Mobile uses 'demand' frameloop (only renders when needed) for better performance
  const [frameloop, setFrameloop] = useState(isMobile ? 'demand' : 'always');
  
  // Refs
  const internalContainerRef = useRef(null);
  const containerRef = externalContainerRef || internalContainerRef;
  const targetRotationRef = useRef(0);
  const touchStartRef = useRef({ x: 0, dragging: false });

  // Responsive layout calculations
  const horizonOffsetY = isMobile ? -1.0 : -0.85;
  const centerHorizonScaleX = isUltraWide ? 22 : 16;

  // Device detection and resize handling
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mq = window.matchMedia('(max-width: 768px)');
    const onChange = (e) => {
      setIsMobile(e.matches);
      // Update frameloop based on device type
      setFrameloop(e.matches ? 'demand' : 'always');
    };
    
    mq.addEventListener?.('change', onChange) || mq.addListener?.(onChange);
    
    const resizeHandler = () => {
      setIsUltraWide(window.innerWidth / window.innerHeight >= 2.3);
    };
    window.addEventListener('resize', resizeHandler);
    
    return () => {
      mq.removeEventListener?.('change', onChange) || mq.removeListener?.(onChange);
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  // Intersection observer to pause rendering when out of view
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => setFrameloop(entry.isIntersecting ? 'always' : 'never'),
      { threshold: 0, rootMargin: '50px' }
    );
    
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [containerRef]);

  // Custom hooks for scroll and gear interaction
  useScrollProgress(containerRef);
  // Enable gear interaction only on desktop to reduce mobile CPU usage
  useGearInteraction(targetRotationRef, touchStartRef, !isMobile);

  return (
    <div ref={containerRef} style={containerStyle} data-scroll-progress="0">
      <Canvas 
        shadows
        dpr={Math.min(window.devicePixelRatio || 1, 2)}
        camera={{ ...(isMobile ? v.camMobile : v.cam), near: 0.5, far: 3000 }} 
        frameloop={frameloop}
        style={canvasStyle}
        gl={{ 
          powerPreference: 'high-performance',
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: false,
          failIfMajorPerformanceCaveat: false
        }}
        onCreated={({ gl }) => {
          // Suppress KHR_materials_pbrSpecularGlossiness warning
          gl.debug.checkShaderErrors = false;
        }}
      >
        {/* Cleanup handler */}
        <SceneCleanup />
        
        {/* Scene ready detector - waits for actual frames to render */}
        {onSceneReady && <SceneReadyDetector onReady={onSceneReady} />}
        
        {/* Camera scroll animation */}
        <CameraScrollAnimation containerRef={containerRef} initialCam={isMobile ? v.camMobile : v.cam} variant={variant} />

        {/* Atmosphere */}
        <Sky
          distance={450000}
          sunPosition={[10, v.sky.elevation, -30]}
          turbidity={v.sky.turbidity}
          rayleigh={v.sky.rayleigh}
          mieCoefficient={v.sky.mieCoefficient}
          mieDirectionalG={v.sky.mieDirectionalG}
        />
        {variant !== 'notfound' && <fog attach="fog" args={["#eaf2ff", 50, 420]} />}

        {/* Lighting */}
        <ambientLight intensity={1.2} />
        <directionalLight
          position={v.light.pos}
          intensity={v.light.intensity}
          color={v.light.color}
          castShadow
        />

        {/* Mountain */}
        <ParallaxGroup
          positionOffset={[0, 0, 0]}
          mouseStrength={{ rotateX: 0.005, rotateY: 0.01, moveX: 0.025, moveY: 0.02 }}
          scrollStrength={{ moveZ: 0.5, moveY: 0.2 }}
        >
          <MountainModel 
            position={v.mountain.position} 
            rotation={v.mountain.rotation} 
            scale={v.mountain.scale} 
          />
        </ParallaxGroup>

        {/* Gear + Symbols (conditionally rendered) */}
        {showGear && (
          <ParallaxGroup
            positionOffset={[0, 0, 0]}
            mouseStrength={isMobile ? { rotateX: 0, rotateY: 0, moveX: 0, moveY: 0 } : { rotateX: 0.003, rotateY: 0.006, moveX: 0.015, moveY: 0.05 }}
            scrollStrength={{ moveZ: 1.6, moveY: 0.7 }}
          >
            <GearEntrance 
              position={isMobile ? v.gearMobile.position : v.gear.position} 
              rotation={isMobile ? v.gearMobile.rotation : v.gear.rotation} 
              targetScale={isMobile ? v.gearMobile.scale : v.gear.scale}
              targetRotationRef={targetRotationRef}
              isMobile={isMobile}
              enableAnimations={performanceLevel === 'full'}
            />
            <CodingSymbolCloud 
              enableAnimations={performanceLevel === 'full'} 
              containerRef={containerRef}
              isMobile={isMobile}
            />
          </ParallaxGroup>
        )}

        {/* Foreground Clouds */}
        <ParallaxGroup
          positionOffset={v.clouds.foreground.offset}
          frustumCulled={false}
          mouseStrength={{ rotateX: 0.000002, rotateY: 0.00004, moveX: 0.0001, moveY: 0.000008 }}
          scrollStrength={{ moveZ: 0.5, moveY: 0.4 }}
        >
          <Clouds limit={40} range={32} fade={12} >
            <group frustumCulled={false} >
              {v.clouds.foreground.overhead.map((pos, i) => (
                <Cloud 
                  key={i}
                  seed={1800} 
                  volume={9} 
                  frustumCulled={false} 
                  position={pos} 
                  speed={[0.08, 0.06, 0.07][i]} 
                  opacity={[0.45, 0.38, 0.42][i]} 
                  scale={[1.2, 0.8, 0.9][i]} 
                  color="#ffffff" 
                  segments={20} 
                  fade={[8, 10, 9][i]} 
                />
              ))}
            </group>
            <group frustumCulled={false}>
              {v.clouds.horizon.lower.map((pos, i) => (
                <Cloud 
                  key={i}
                  seed={1800} 
                  volume={12} 
                  frustumCulled={false} 
                  position={pos} 
                  speed={[0.05, 0.055, 0.065][i]} 
                  opacity={[0.35, 0.52, 0.48][i]} 
                  scale={[2.4, 2.2, 2.8][i]} 
                  color="#ffffff" 
                  segments={24} 
                  fade={[15, 14, 16][i]} 
                />
              ))}
              <Cloud seed={1800} volume={9} frustumCulled={false} position={[2.6, -1.4, -1.8]} speed={0.075} opacity={0.35} scale={2.6} color="#ffffff" segments={24} fade={12} />
              <Cloud seed={1800} volume={9} frustumCulled={false} position={[-3.4, -1.6, -1.9]} speed={0.06} opacity={0.32} scale={2.4} color="#ffffff" segments={24} fade={11} />
            </group>
          </Clouds>
        </ParallaxGroup>

        {/* Horizon Clouds */}
        <ParallaxGroup
          positionOffset={[0, horizonOffsetY, v.clouds.horizon.offset[0]]}
          frustumCulled={false}
          mouseStrength={{ rotateX: 0.003, rotateY: 0.006, moveX: 0.02, moveY: 0.02 }}
          scrollStrength={{ moveZ: 0.2, moveY: 0.1 }}
        >
          <Clouds limit={24} range={38} fade={18}>
            <group frustumCulled={false}>
              <Cloud seed={1800} volume={9} frustumCulled={false} position={[-8.0, -2.8, -6.5]} speed={0.04} opacity={isMobile ? 0.72 : 0.68} scale={[12, 3, 6]} color="#ffffff" segments={20} fade={25}/>
              <Cloud seed={1800} volume={9} frustumCulled={false} position={[8.0, -2.9, -6.8]} speed={0.045} opacity={isMobile ? 0.72 : 0.68} scale={[12, 3, 6]} color="#ffffff" segments={20} fade={25}/>
              <Cloud seed={1800} volume={9} frustumCulled={false} position={[0.0, -3.1, -7.2]} speed={0.05} opacity={isMobile ? 0.75 : 0.70} scale={[centerHorizonScaleX, 3.5, 7]} color="#ffffff" segments={22} fade={30}/>
            </group>
          </Clouds>
        </ParallaxGroup>

        {/* Mid Ring Clouds */}
        <ParallaxGroup
          positionOffset={v.clouds.midRing.offset}
          frustumCulled={false}
          mouseStrength={{ rotateX: 0.008, rotateY: 0.015, moveX: 0.04, moveY: 0.03 }}
          scrollStrength={{ moveZ: 0.3, moveY: 0.15 }}
        >
          <Clouds limit={v.clouds.midRing.density} range={30} fade={15}>
            <group frustumCulled={false}>
              {Array.from({ length: v.clouds.midRing.density }, (_, i) => {
                const a = (i / 10) * Math.PI * 2;
                const r = 4.5;
                const pos = [Math.cos(a) * r, 0.45 + Math.sin(a * 2) * 0.18, Math.sin(a) * r];
                const scale = 1.0 + Math.sin(a * 1.3) * 0.45;
                const speed = 0.03 + (i % 3) * 0.015;
                const fade = 10 + (i % 4) * 3;
                
                return (
                  <Cloud 
                    key={i}
                    seed={1800} 
                    volume={9} 
                    frustumCulled={false} 
                    position={pos} 
                    speed={speed} 
                    opacity={0.28} 
                    scale={scale} 
                    color="#fafafa" 
                    segments={20} 
                    fade={fade}
                  />
                );
              })}
            </group>
          </Clouds>
        </ParallaxGroup>

        {/* Post-processing */}
        <EffectComposer>
          <Bloom intensity={0.45} luminanceThreshold={0.3} luminanceSmoothing={0.4} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
