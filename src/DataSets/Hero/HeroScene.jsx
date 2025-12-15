/**
 * HeroScene - 3D scene configuration variants for each route
 * 
 * Defines camera, lighting, object positions, and atmospheric settings
 * for the persistent 3D hero scene across different pages. Each variant
 * creates a unique mood and visual identity per route.
 * 
 * Variants:
 * - home: Balanced composition, warm lighting, prominent gear
 * - skills: Tight composition, softer lighting, elevated view
 * - projects: Dynamic angle, dual lights, rotated gear
 * - about: Wide view, warm atmosphere, high turbidity sky
 * - notfound: Similar to skills variant
 * 
 * Configuration:
 * @typedef {Object} SceneVariant
 * @property {Object} cam - Desktop camera (position, fov)
 * @property {Object} camMobile - Mobile camera (centered)
 * @property {Object} light - Primary light (color, intensity, position)
 * @property {Object} [light2] - Optional secondary light
 * @property {Object} gear - Gear model transform (position, rotation, scale)
 * @property {Object} gearMobile - Mobile gear transform
 * @property {Object} mountain - Mountain model transform
 * @property {Object} sky - Sky shader settings (turbidity, rayleigh, mie, elevation)
 * @property {Object} clouds - Cloud layer positions and density
 * @property {Object} clouds.foreground - Foreground clouds (offset, overhead positions)
 * @property {Object} clouds.horizon - Horizon clouds (offset, lower positions)
 * @property {Object} clouds.midRing - Mid-ring clouds (offset, density)
 * 
 * @example
 * import { VARIANTS } from './HeroScene';
 * 
 * <SharedHeroScene variant={VARIANTS.home} />
 * <SharedHeroScene variant={VARIANTS[pathname.slice(1)] || VARIANTS.home} />
 */
export const VARIANTS = {
  home: {
    cam: { position: [0.4, 1.1, 7.2], fov: 45 },
    camMobile: { position: [0, 1.1, 7.2], fov: 45 },
    light: { color: '#edd29a', intensity: 1.1, pos: [4, 5, 6] },
    gear: { position: [-0.15, 0, 0], rotation: [-0.23, 0, 0], scale: 1.0 },
    gearMobile: { position: [0, 0, 0], rotation: [-0.23, 0, 0], scale: 1.0 },
    mountain: { position: [-8, -13, -320], rotation: [-0.23, 0, 0], scale: 500 },
    sky: { turbidity: 7, rayleigh: 1.8, mieCoefficient: 0.005, mieDirectionalG: 0.88, elevation: 14 },
    clouds: {
      foreground: { offset: [0, 0.2, 2], overhead: [[-1.8, 0.6, 0], [-2.2, 0.35, -0.2], [1.6, 0.55, -0.3]] },
      horizon: { offset: [-1.5], lower: [[-6.0, -2.2, -3.5], [6.2, -2.3, -3.8], [0.0, -2.5, -4.2]] },
      midRing: { offset: [0, 0.5, 0], density: 14 }
    },
  },
  skills: {
    cam: { position: [0.8, 1.2, 7], fov: 45 },
    camMobile: { position: [0, 1.2, 7], fov: 45 },
    light: { color: '#ffd6a6', intensity: 0.6, pos: [4, 5, 6] },
    gear: { position: [-0.25, 0, 0], rotation: [-0.21, 0, 0], scale: 1.0 },
    gearMobile: { position: [0, 0, 0], rotation: [-0.21, 0, 0], scale: 1.0 },
    mountain: { position: [-6, -1, -310], rotation: [-0.21, 0, 0], scale: 500 },
    sky: { turbidity: 6, rayleigh: 1.95, mieCoefficient: 0.005, mieDirectionalG: 0.6, elevation: 4 },
    clouds: {
      foreground: { offset: [0.5, 0.3, 2], overhead: [[-1.5, 0.7, -0.1], [-2.0, 0.4, -0.3], [1.8, 0.6, -0.2]] },
      horizon: { offset: [-1.3], lower: [[-5.5, -2.0, -3.2], [6.5, -2.1, -3.5], [0.2, -2.3, -3.9]] },
      midRing: { offset: [0.3, 0.6, 0], density: 14 }
    },
  },
  projects: {
    cam: { position: [-0.8, 1.0, 7.8], fov: 45 },
    camMobile: { position: [0, 1.0, 7.8], fov: 45 },
    light: { color: '#ffd6a6', intensity: 1.3, pos: [-5, 4, 5] },
    light2: { color: '#ffd6a6', intensity: 0.3, pos: [-8, 7, -10] },
    gear: { position: [0, 0, 0], rotation: [-0.21, -0.2, 0], scale: 1.05 },
    gearMobile: { position: [0, 0, 0], rotation: [-0.21, 0, 0], scale: 1.05 },
    mountain: { position: [-1, 0, -310], rotation: [-0.21, 0, 0], scale: 500 },
    sky: { turbidity: 10, rayleigh: 2.0, mieCoefficient: 0.006, mieDirectionalG: 0.8, elevation: 8 },
    clouds: {
      foreground: { offset: [-1.2, 0.1, 2.2], overhead: [[-2.5, 0.5, 0.1], [-2.8, 0.3, -0.1], [1.0, 0.5, -0.2]] },
      horizon: { offset: [-1.6], lower: [[0.8, -2.0, -3.6], [1.8, -2.4, -3.9], [-0.5, -2.6, -4.7]] },
      midRing: { offset: [-0.8, 0.4, 0.2], density: 12 }
    },
  },
  about: {
    cam: { position: [0.5, 1.1, 7.6], fov: 45 },
    camMobile: { position: [0, 1.1, 7.6], fov: 45 },
    light: { color: '#ffe2a6', intensity: 1.3, pos: [5, 5, 4] },
    gear: { position: [-0.5, 0, 0], rotation: [-0.2, 0.2, 0], scale: 1.0 },
    gearMobile: { position: [0, 0, 0], rotation: [-0.2, 0, 0], scale: 1.0 },
    mountain: { position: [-14, 2, -310], rotation: [-0.2, 0, 0], scale: 500 },
    sky: { turbidity: 18, rayleigh: 3.4, mieCoefficient: 0.005, mieDirectionalG: 0.85, elevation: 10 },
    clouds: {
      foreground: { offset: [1.5, 0.25, 1.8], overhead: [[-1.0, 0.65, -0.1], [-1.4, 0.4, -0.2], [2.2, 0.6, -0.25]] },
      horizon: { offset: [-1.4], lower: [[-5.8, -2.1, -3.3], [6.8, -2.2, -3.6], [0.5, -2.4, -4.0]] },
      midRing: { offset: [1.2, 0.55, -0.1], density: 14 }
    },
  },
  notfound: {
    cam: { position: [0.8, 1.2, 7], fov: 45 },
    camMobile: { position: [0, 1.2, 7], fov: 45 },
    light: { color: '#ffd6a6', intensity: 0.6, pos: [4, 5, 6] },
    gear: { position: [-0.25, 0, 0], rotation: [-0.21, 0, 0], scale: 1.0 },
    gearMobile: { position: [0, 0, 0], rotation: [-0.21, 0, 0], scale: 1.0 },
    mountain: { position: [-6, -1, -310], rotation: [-0.21, 0, 0], scale: 500 },
    sky: { turbidity: 6, rayleigh: 1.95, mieCoefficient: 0.03, mieDirectionalG: 0.9, elevation: -1 },
    clouds: {
      foreground: { offset: [0.5, 0.3, 2], overhead: [[-1.5, 0.7, -0.1], [-2.0, 0.4, -0.3], [1.8, 0.6, -0.2]] },
      horizon: { offset: [-1.3], lower: [[-5.5, -2.0, -3.2], [6.5, -2.1, -3.5], [0.2, -2.3, -3.9]] },
      midRing: { offset: [0.3, 0.6, 0], density: 14 }
    },
  },
};
