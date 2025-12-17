# Daniel Durant - Portfolio Website

A modern, interactive portfolio showcasing full-stack development projects and skills. Built with React 19, Three.js, and Framer Motion.

## ✨ Features

- **3D Interactive Hero** - Animated gear cloud with Three.js
- **Smooth Animations** - Framer Motion page transitions and scroll effects
- **Dark/Light Themes** - System-aware theme switching with high contrast mode
- **Responsive Design** - Mobile-first approach with glassmorphic UI
- **Contact Form** - EmailJS integration for direct messaging
- **Project Showcase** - Filterable portfolio with bento grid layout

## 🚀 Tech Stack

### Frontend
- React 19 with React Router
- Three.js & React Three Fiber
- Framer Motion
- Lenis (smooth scroll)
- Bootstrap Grid

### Styling
- Custom CSS with design tokens
- CSS Grid & Flexbox
- Glassmorphism effects
- 3D pressable button system

### Build Tools
- Vite 7
- ESLint
- PostCSS with PurgeCSS

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Configuration

### EmailJS Setup
1. Sign up at [EmailJS](https://www.emailjs.com/)
2. Create email service and templates
3. Update credentials in `src/API/emailConfig.js`

## 📁 Project Structure

```
src/
├── 3D/              # Three.js components and scenes
├── API/             # EmailJS configuration
├── Components/      # Reusable UI components
├── Context/         # React context providers
├── DataSets/        # Static data (projects, skills, icons)
├── Functions/       # Utility functions
├── Hooks/           # Custom React hooks
├── Pages/           # Route page components
├── Styles/          # Global and component styles
└── Utils/           # Helper utilities
```

## 🎨 Design System

- **Colors:** Orange primary (#FFA500) with complementary blue accents
- **Typography:** Inter (UI), JetBrains Mono (code)
- **Spacing:** 8-point grid system
- **Motion:** Unified duration and easing tokens

## 📄 License

MIT License - feel free to use this code for your own portfolio!

## 🔗 Links

- **Live Site:** [Null]
- **GitHub:** [https://github/DDurant94]
- **LinkedIn:** [www.linkedin.com/in/daniel-durant-30a0252b9]

---

Built with ❤️ by Daniel Durant
