# Premium Notice Board Portfolio 📌

A high-performance, visually stunning, and highly interactive developer portfolio built with **React**, **Vite**, **TypeScript**, **Tailwind CSS v4**, and **Framer Motion**. It features an interactive 3D Spline robot companion, voice greeting integration, a physics-based notice board project showcase, and dynamic color/theme switchers.

---

## 🌟 Core Features

### 1. Interactive 3D Robot Companion & Voice Introduction
- Displays an interactive **3D Spline robot** that follows cursor movements and waves on hover.
- Integrates the browser's native **Web Speech Synthesis API** to play a spoken voice greeting: *"Hello, I am Siddhartha. Want to know about myself?"*.
- Features a bottom playback control overlay (`🔊 Play Introduction`) to play, stop, or pause the voice introduction.

### 2. Dotted Pegboard Showcase
- Styled like a real pegboard or notice board, allowing users to toggle between two base designs:
  - **Dark Cork Board**: A deep charcoal pegboard background.
  - **Light Pegboard Board**: A bright, clean white pegboard background.
- Employs a custom, lightweight **HTML5 Canvas interactive dots background** that scales up and glows in vibrant colors when hovered by the cursor, creating a fluid magnetic ripple effect.

### 3. Pinned Cards with Gravitational Hanging Physics
- Projects are presented as wide horizontal landscape cards dynamically pinned to the board.
- Cards hang organically under simulated gravity depending on their pin position:
  - **Left-pinned**: Tilts clockwise (`transform-origin: top left`).
  - **Right-pinned**: Tilts counter-clockwise (`transform-origin: top right`).
  - **Center-pinned**: Hangs straight down with minor natural sway.
- **Hover Micro-animations**: When hovered, cards use Framer Motion springs to smoothly scale up, straighten (`0deg`), and deepen their drop shadows, simulating lifting the paper to read it.

### 4. Adaptive Color Palettes
- The projects board supports dynamic theme switching:
  - **Monochrome Mode**: Minimalist grayscale styling with silver, slate, charcoal, and carbon metallic pushpins.
  - **Vibrant Color Mode**: Rich violet, pink, and cyan tag badges, colored mockups, and glowing neon-cyan/violet canvas dots.
- Cards automatically swap themes (dark charcoal background with white text vs white background with dark text) to blend with the corkboard brightness.

---

## 🛠️ Technical Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **3D Graphics**: [Spline 3D Viewer](https://spline.design/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Voice Engine**: Browser Native [SpeechSynthesis API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)
- **Canvas Rendering**: HTML5 Canvas 2D Context

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18+) installed.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sidharth1016/my-react-app.git
   cd my-react-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```
my-react-app/
├── public/                 # Static assets
├── src/
│   ├── App.tsx             # Main component (layouts, canvas dots, Speech Synthesis, project cards)
│   ├── index.css           # Global stylesheet (Tailwind v4 imports, board grids, soundwaves)
│   ├── main.tsx            # React application entry point
│   └── vite-env.d.ts       # Vite environment types
├── index.html              # HTML shell
├── tailwind.config.js      # Custom theme settings
├── vite.config.ts          # Vite build configurations
└── package.json            # Script targets and dependencies
```
