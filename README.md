# My Portfolio

Hey! This is my personal portfolio site where I showcase my work as a full-stack developer. Built it from scratch with React 19 and Three.js because I wanted something that stands out and actually reflects how I like to code.

## What Makes It Different

I'm not a fan of cookie-cutter portfolio templates, so I built mine with some fun 3D elements and smooth animations that actually serve a purpose. The gear cloud hero animation isn't just for show—it's optimized to work even on ultra-budget phones like the JioPhone 2 (yes, really—240x320 screens are challenging).

**Live site:** [devdaniel.tech](https://devdaniel.tech)

## The Tech Behind It

### Core Stack

- **React 19** - Using the latest features, concurrent rendering, and all
- **Three.js + React Three Fiber** - For the 3D mountain scene and gear animations
- **Motion** - Smooth page transitions and scroll-triggered animations
- **Lenis** - Buttery smooth scrolling (makes a huge difference)
- **Vite 7** - Lightning fast builds and HMR

### UI/UX

- Custom design system with CSS variables and design tokens
- Glassmorphic contact drawer (backdrop-filter with proper fallbacks)
- Dark/light/high-contrast themes that respect system preferences
- Bento grid layout for projects (Pinterest-style masonry)
- Responsive down to 240px width (JioPhone 2 tested)

### Performance Stuff I'm Proud Of

- 3D mountain model optimized from 26MB → 8.9MB using Blender + Draco compression
- Code-split vendor chunks (Three.js, React, Motion all separated)
- Dynamic CSS imports for non-critical styles
- Lazy-loaded components with Suspense
- Conditional 3D model preloading (desktop gets it immediately, mobile waits 200ms)
- IntersectionObserver with adaptive thresholds for tiny screens

## Getting Started

```bash
# Install everything
npm install

# Run dev server (opens at localhost:5173)
npm run dev

# Production build
npm run build

# Test the production build locally
npm run preview
```

## Project Layout

The structure is pretty straightforward:

```text
src/
├── 3D/              # Three.js scenes, models, hooks
├── Components/      # UI components (buttons, navigation, effects)
├── Context/         # React contexts (theme, navigation, filters)
├── DataSets/        # Project data, skills, services
├── Functions/       # Reusable logic (portfolio filtering, grids)
├── Hooks/           # Custom hooks (effects, utilities)
├── Pages/           # Route components
├── Styles/          # CSS organized by component/page/general
└── Utils/           # Helper functions
```

## Environment Setup

You'll need an EmailJS account for the contact form. Create a `.env` file:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

Sign up at [emailjs.com](https://www.emailjs.com/) (free tier works fine), create a service and template, then drop your credentials in.

## Design Philosophy

I went with a minimalist design but added depth with 3D elements and smooth animations. The color palette is orange and blue because I like the contrast, and the whole thing adapts to dark mode automatically.

Performance was a big focus—I wanted it to load fast even on slower connections and work on devices you wouldn't normally target (hence the JioPhone 2 support). Every animation is GPU-accelerated, images are lazy-loaded, and the 3D scene won't block the initial render.

## Browser Support

Works on all modern browsers:

- Chrome/Edge 76+
- Firefox 103+
- Safari 14+
- Mobile Safari (iOS 14+)
- Even feature phones with KaiOS (JioPhone 2)

The `:has()` selector for single-project centering is progressive enhancement—older browsers just show full width, which is fine.

## Deployment

Currently hosted on Hostinger with Apache. The `.htaccess` file handles:

- React Router SPA redirects
- HTTPS enforcement
- Asset caching (1 year for static, 1 week for 3D models)
- Gzip/Brotli compression
- Security headers (CSP, HSTS, etc.)

## What I Learned

Building this taught me a ton about optimizing 3D content for the web, CSS containment strategies, and how to make complex animations performant. Also learned that `translate()` isn't as widely supported as `translateX() translateY()` (thanks, Chrome).

## Connect

- **Email:** <dannyjdurant@gmail.com>

- **LinkedIn:** [linkedin.com/in/daniel-durant-30a0252b9](https://www.linkedin.com/in/daniel-durant-30a0252b9)

---

Feel free to poke around the code. If you find something broken or have suggestions, let me know!
