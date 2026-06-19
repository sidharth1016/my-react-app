import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Spline from '@splinetool/react-spline';

// --- Types ---
interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  tags: string[];
  link: string;
  paperType: 'lined' | 'grid' | 'yellow' | 'pink' | 'blue' | 'green';
  rotation: number; // tilt angle in degrees
  pinColor: 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange';
  pinPosition: 'left' | 'center' | 'right';
  date?: string;
  isImportant?: boolean;
}

// --- Push Pin Component ---
interface PushPinProps {
  color?: 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange' | 'silver' | 'charcoal' | 'slate' | 'carbon' | 'zinc';
  className?: string;
}

const PushPin: React.FC<PushPinProps> = ({ color = 'red', className = '' }) => {
  const pinColors = {
    // Vibrant colors
    red: { main: '#ef4444', dark: '#b91c1c', light: '#fca5a5' },
    blue: { main: '#3b82f6', dark: '#1d4ed8', light: '#93c5fd' },
    green: { main: '#10b981', dark: '#047857', light: '#6ee7b7' },
    yellow: { main: '#f59e0b', dark: '#b45309', light: '#fcd34d' },
    purple: { main: '#8b5cf6', dark: '#6d28d9', light: '#c4b5fd' },
    orange: { main: '#f97316', dark: '#c2410c', light: '#fdba74' },
    // Monochrome/Metallic colors
    silver: { main: '#9ca3af', dark: '#4b5563', light: '#f3f4f6' },
    charcoal: { main: '#374151', dark: '#111827', light: '#6b7280' },
    slate: { main: '#64748b', dark: '#334155', light: '#cbd5e1' },
    carbon: { main: '#1f2937', dark: '#030712', light: '#4b5563' },
    zinc: { main: '#71717a', dark: '#27272a', light: '#e4e4e7' },
  };

  const theme = pinColors[color] || pinColors.silver;

  return (
    <div className={`relative select-none pointer-events-none ${className}`}>
      {/* Shadow of the pin (cast offset onto the paper) */}
      <svg
        className="absolute top-1.5 left-2 w-8 h-8 opacity-35 blur-[1.5px] transform translate-x-1 translate-y-1.5 rotate-12"
        viewBox="0 0 32 32"
        fill="none"
      >
        <path
          d="M16 18 L16 28"
          stroke="black"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M10.5 8 C10.5 8 10 13 12 15 C13.5 16.5 14 17 14 18 L18 18 C18 17 18.5 16.5 20 15 C22 13 21.5 8 21.5 8 Z"
          fill="black"
        />
        <ellipse cx="16" cy="7" rx="6" ry="3" fill="black" />
      </svg>

      {/* 3D Push Pin Body */}
      <svg
        className="w-8 h-8 filter drop-shadow-[0_1px_1.5px_rgba(0,0,0,0.3)] transform -rotate-[10deg]"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Metal Pin Needle */}
        <path
          d="M16 18 L16 28"
          stroke="#9ca3af"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Metal Reflection */}
        <path
          d="M15.5 23 L15.5 28"
          stroke="#e5e7eb"
          strokeWidth="0.75"
        />
        
        {/* Top Rounded Cap of the plastic pin */}
        <ellipse cx="16" cy="7" rx="6" ry="3" fill={theme.light} />
        <ellipse cx="16" cy="8" rx="5.5" ry="2.5" fill={theme.main} />
        
        {/* Cylinder Grip Body */}
        <path
          d="M10.5 8 C10.5 8 10 13 12 15 C13.5 16.5 14 17 14 18 L18 18 C18 17 18.5 16.5 20 15 C22 13 21.5 8 21.5 8 Z"
          fill={theme.main}
        />
        
        {/* Highlights & Ridges for 3D look */}
        <path
          d="M12 11 Q16 12.5 20 11"
          stroke={theme.light}
          strokeWidth="1"
          fill="none"
          opacity="0.5"
        />
        <path
          d="M13.5 14 Q16 15.5 18.5 14"
          stroke={theme.dark}
          strokeWidth="1"
          fill="none"
          opacity="0.5"
        />
        
        {/* Bottom Collar */}
        <ellipse cx="16" cy="18" rx="4" ry="1.5" fill={theme.dark} />
        <ellipse cx="16" cy="17.5" rx="3.8" ry="1.2" fill={theme.main} />
        
        {/* Shiny side reflection */}
        <path
          d="M14 9.5 C14 9.5 13.5 12 14.5 14.5"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
    </div>
  );
};

// --- Interactive Dotted Background Component ---
interface InteractiveDotsBackgroundProps {
  theme: 'dark' | 'light';
  colorMode: 'monochrome' | 'colorful';
}

const InteractiveDotsBackground: React.FC<InteractiveDotsBackgroundProps> = ({ theme, colorMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const mouse = { x: -1000, y: -1000, active: false };

    const dots: { x: number; y: number; originX: number; originY: number; radius: number }[] = [];
    const spacing = 32;

    const initDots = () => {
      dots.length = 0;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;

      for (let x = spacing / 2; x < width; x += spacing) {
        for (let y = spacing / 2; y < height; y += spacing) {
          dots.push({
            x,
            y,
            originX: x,
            originY: y,
            radius: 1.5,
          });
        }
      }
    };

    initDots();

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      dots.forEach((dot) => {
        const dx = mouse.x - dot.originX;
        const dy = mouse.y - dot.originY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 130;

        let scale = 1;
        let shiftX = 0;
        let shiftY = 0;

        if (mouse.active && dist < maxDist) {
          const force = (maxDist - dist) / maxDist;
          scale = 1 + force * 2.2;
          
          const angle = Math.atan2(dy, dx);
          const push = force * 8;
          shiftX = Math.cos(angle) * push;
          shiftY = Math.sin(angle) * push;
        }

        dot.x += (dot.originX + shiftX - dot.x) * 0.12;
        dot.y += (dot.originY + shiftY - dot.y) * 0.12;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius * scale, 0, Math.PI * 2);
        
        if (mouse.active && dist < maxDist) {
          const force = (maxDist - dist) / maxDist;
          if (colorMode === 'monochrome') {
            if (theme === 'dark') {
              ctx.fillStyle = `rgba(255, 255, 255, ${0.12 + force * 0.70})`;
            } else {
              ctx.fillStyle = `rgba(80, 80, 80, ${0.15 + force * 0.65})`;
            }
          } else {
            if (theme === 'dark') {
              ctx.fillStyle = `rgba(139, 92, 246, ${0.15 + force * 0.70})`;
            } else {
              ctx.fillStyle = `rgba(6, 182, 212, ${0.15 + force * 0.70})`;
            }
          }
        } else {
          if (theme === 'dark') {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
          } else {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
          }
        }
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleResize = () => {
      initDots();
    };

    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme, colorMode]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
};

// --- Custom Project Mockup SVG/CSS Visuals ---
const renderProjectMockup = (id: number, colorMode: 'monochrome' | 'colorful') => {
  switch (id) {
    case 1: // Blogsphere
      return (
        <div className="w-full h-full flex flex-col bg-zinc-955 rounded-lg border border-white/10 overflow-hidden text-left font-mono text-[9px] p-2 text-zinc-500 select-none">
          <div className="flex items-center gap-1.5 border-b border-white/5 pb-1.5 mb-1.5">
            <span className={`w-2 h-2 rounded-full ${colorMode === 'colorful' ? 'bg-red-500' : 'bg-zinc-700'}`}></span>
            <span className={`w-2 h-2 rounded-full ${colorMode === 'colorful' ? 'bg-yellow-500' : 'bg-zinc-650'}`}></span>
            <span className={`w-2 h-2 rounded-full ${colorMode === 'colorful' ? 'bg-green-500' : 'bg-zinc-600'}`}></span>
            <span className={`text-[8px] ml-1 ${colorMode === 'colorful' ? 'text-cyan-400 font-bold' : 'text-zinc-405'}`}>blogsphere.dev</span>
          </div>
          <div className="flex gap-2 h-full">
            <div className="w-1/4 border-r border-white/5 pr-1 space-y-1">
              <div className={`h-2 w-full rounded-sm ${colorMode === 'colorful' ? 'bg-cyan-500/10' : 'bg-white/5'}`}></div>
              <div className="h-2 w-4/5 bg-white/5 rounded-sm"></div>
              <div className="h-2 w-2/3 bg-white/5 rounded-sm"></div>
            </div>
            <div className="flex-1 space-y-2">
              <div className={`h-3 w-1/3 rounded-sm ${colorMode === 'colorful' ? 'bg-cyan-500/20' : 'bg-white/10'}`}></div>
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-white/10 rounded-sm"></div>
                <div className="h-1.5 w-full bg-white/10 rounded-sm"></div>
                <div className="h-1.5 w-3/4 bg-white/10 rounded-sm"></div>
              </div>
            </div>
          </div>
        </div>
      );
    case 2: // 3D Camera
      return (
        <div className="w-full h-full flex flex-col bg-zinc-900/40 rounded-lg border border-zinc-700 overflow-hidden relative justify-center items-center select-none">
          <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] ${
            colorMode === 'colorful' ? 'from-indigo-500/10 via-transparent to-transparent' : 'from-white/5 via-transparent to-transparent'
          }`}></div>
          <svg className={`w-16 h-16 opacity-60 transition-colors duration-300 ${colorMode === 'colorful' ? 'text-indigo-400' : 'text-zinc-400'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="12" cy="12" r="6" />
            <path d="M20 12 L18 12 M6 12 L4 12 M12 4 L12 6 M12 18 L12 20" />
            <rect x="2" y="5" width="20" height="14" rx="2" strokeDasharray="2 2" />
          </svg>
          <span className={`absolute bottom-2 right-2 text-[8px] font-mono ${colorMode === 'colorful' ? 'text-indigo-400/80 font-bold animate-pulse' : 'text-zinc-555'}`}>3D_MODEL_LIVE</span>
        </div>
      );
    case 3: // Tasky Kanban
      return (
        <div className="w-full h-full flex flex-col bg-zinc-900 rounded-lg border border-white/10 overflow-hidden text-left p-2.5 space-y-2 select-none">
          <div className="flex justify-between items-center border-b border-white/5 pb-1 text-[8px] text-zinc-400 font-mono">
            <span>KANBAN_ACTIVE</span>
            <span className={`font-bold ${colorMode === 'colorful' ? 'text-emerald-400' : 'text-white'}`}>5 Tasks</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 h-full">
            <div className="bg-white/5 p-1 rounded space-y-1">
              <span className="text-[7px] font-bold text-zinc-455">Todo</span>
              <div className={`h-3 rounded-sm ${colorMode === 'colorful' ? 'bg-orange-500/15 border border-orange-500/30' : 'bg-zinc-700/50 border border-zinc-605/50'}`}></div>
              <div className="h-3 bg-white/5 rounded-sm"></div>
            </div>
            <div className="bg-white/5 p-1 rounded space-y-1">
              <span className="text-[7px] font-bold text-zinc-350">Active</span>
              <div className={`h-3 rounded-sm animate-pulse ${colorMode === 'colorful' ? 'bg-cyan-500/20 border border-cyan-500/40' : 'bg-zinc-600/50 border border-zinc-500/50'}`}></div>
            </div>
            <div className="bg-white/5 p-1 rounded space-y-1">
              <span className="text-[7px] font-bold text-zinc-200">Done</span>
              <div className={`h-3 rounded-sm ${colorMode === 'colorful' ? 'bg-emerald-500/15 border border-emerald-500/30' : 'bg-zinc-850/50 border border-zinc-750/50'}`}></div>
              <div className="h-3 bg-zinc-850/50 border border-zinc-750/50 rounded-sm"></div>
            </div>
          </div>
        </div>
      );
    case 4: // Chat Buddy
      return (
        <div className="w-full h-full flex flex-col bg-zinc-950 rounded-lg border border-white/10 overflow-hidden p-2.5 space-y-2 select-none justify-end">
          <div className={`self-end border rounded-tl-lg rounded-tr-lg rounded-bl-lg px-2.5 py-1 max-w-[80%] text-[8px] ${
            colorMode === 'colorful' ? 'bg-violet-600/20 border-violet-500/30 text-violet-200 shadow-[0_0_8px_rgba(139,92,246,0.15)]' : 'bg-zinc-800 border-zinc-700 text-white'
          }`}>
            How does LLM API query work?
          </div>
          <div className="self-start bg-zinc-900 border border-zinc-800 rounded-tl-lg rounded-tr-lg rounded-br-lg px-2.5 py-1 max-w-[80%] text-[8px] text-zinc-300 flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full animate-bounce ${colorMode === 'colorful' ? 'bg-pink-400' : 'bg-zinc-400'}`}></span>
            <span>AI is typing responses...</span>
          </div>
        </div>
      );
    case 5: // SoundWave
      return (
        <div className="w-full h-full flex flex-col bg-zinc-950 rounded-lg border border-white/5 overflow-hidden relative justify-center items-center p-3 select-none">
          <div className="flex gap-0.5 items-end justify-center h-16 w-full opacity-75">
            <div className={`w-1.5 h-6 rounded-t-sm ${colorMode === 'colorful' ? 'bg-violet-600 shadow-[0_-2px_6px_rgba(139,92,246,0.4)]' : 'bg-zinc-600'}`}></div>
            <div className={`w-1.5 h-10 rounded-t-sm ${colorMode === 'colorful' ? 'bg-purple-500 shadow-[0_-2px_6px_rgba(168,85,247,0.4)]' : 'bg-zinc-500'}`}></div>
            <div className={`w-1.5 h-14 rounded-t-sm animate-pulse ${colorMode === 'colorful' ? 'bg-pink-500 shadow-[0_-2px_6px_rgba(236,72,153,0.4)]' : 'bg-zinc-300'}`}></div>
            <div className={`w-1.5 h-8 rounded-t-sm ${colorMode === 'colorful' ? 'bg-rose-450 shadow-[0_-2px_6px_rgba(244,63,94,0.4)]' : 'bg-zinc-400'}`}></div>
            <div className={`w-1.5 h-12 rounded-t-sm ${colorMode === 'colorful' ? 'bg-orange-450 shadow-[0_-2px_6px_rgba(249,115,22,0.4)]' : 'bg-zinc-600'}`}></div>
            <div className={`w-1.5 h-5 rounded-t-sm ${colorMode === 'colorful' ? 'bg-yellow-450 shadow-[0_-2px_6px_rgba(234,179,8,0.4)]' : 'bg-zinc-700'}`}></div>
          </div>
          <span className={`text-[8px] font-mono mt-1 ${colorMode === 'colorful' ? 'text-pink-400/80 font-bold' : 'text-zinc-555'}`}>FREQ: 44.1 KHZ</span>
        </div>
      );
    case 6: // Portfolio V1
      return (
        <div className="w-full h-full flex flex-col bg-zinc-950 rounded-lg border border-white/10 overflow-hidden text-left p-2 font-mono text-[9px] text-zinc-400 select-none">
          <div className="flex items-center gap-1.5 border-b border-white/5 pb-1 mb-2">
            <span className={`w-2 h-2 rounded-full ${colorMode === 'colorful' ? 'bg-red-500' : 'bg-zinc-700'}`}></span>
            <span className="text-[8px] text-zinc-500">terminal</span>
          </div>
          <div>siddhartha@dev ~ % <span className={colorMode === 'colorful' ? 'text-emerald-400 font-bold' : 'text-white'}>npm run build</span></div>
          <div className="text-zinc-300">✓ Bundled code in 1.1s</div>
          <div className="text-zinc-600">dist/index.html - 0.4kB</div>
        </div>
      );
    default:
      return (
        <div className="w-full h-full bg-gradient-to-tr from-zinc-800 to-zinc-950 rounded-lg flex items-center justify-center">
          <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">PROJECT PREVIEW</span>
        </div>
      );
  }
};

// --- Main App Component ---
export default function App() {
  const [boardTheme, setBoardTheme] = useState<'dark' | 'light'>('dark');
  const [colorMode, setColorMode] = useState<'monochrome' | 'colorful'>('monochrome');
  const [isRobotLoading, setIsRobotLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Pre-load SpeechSynthesis voices on mount
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        setVoices(window.speechSynthesis.getVoices());
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const playVoiceGreeting = () => {
    if ('speechSynthesis' in window) {
      // Toggle off if currently speaking
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      const text = "Hello, I am Siddhartha. Want to know about myself?";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 1.05; // Slightly higher pitch for friendly tone
      utterance.rate = 0.95;  // Natural pacing

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (e) => {
        console.error("Speech synthesis error:", e);
        setIsSpeaking(false);
      };

      // Search for high-quality English voice profiles
      const preferredVoice = voices.find(v => 
        v.lang.startsWith('en') && 
        (v.name.includes('Google US English') || 
         v.name.includes('Natural') || 
         v.name.includes('Microsoft David') ||
         v.name.includes('Microsoft Zira') ||
         v.name.includes('Samantha'))
      ) || voices.find(v => v.lang.startsWith('en'));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in this browser. Hello, I am Siddhartha!");
    }
  };

  // Helper to map colorful pins to metallic ones in monochrome mode
  const getMonochromePinColor = (colorfulColor: string) => {
    switch (colorfulColor) {
      case 'red': return 'silver';
      case 'yellow': return 'zinc';
      case 'green': return 'slate';
      case 'purple': return 'charcoal';
      case 'orange': return 'carbon';
      case 'blue': return 'silver';
      default: return 'silver';
    }
  };

  // --- Project Data ---
  const projects: Project[] = [
    {
      id: 1,
      title: "Blogspherē",
      category: "Fullstack Web App",
      description: "A sleek, content-centric blogging workspace. Designed with glassmorphic dashboards, rich text editing, interactive comment feeds, and robust user profiles.",
      tags: ["React", "Node.js", "MongoDB", "Tailwind"],
      link: "https://github.com/Siddhartha/blogsphere",
      paperType: "lined",
      rotation: 3.5,
      pinColor: "red",
      pinPosition: "left",
      date: "May 2026",
      isImportant: true,
    },
    {
      id: 2,
      title: "3D Camera Customizer",
      category: "Interactive 3D Graphics",
      description: "Customize and preview high-end DSLR cameras in real-time. Features interactive 3D camera models (gltf), material modification, and depth-of-field configuration.",
      tags: ["Three.js", "React Fiber", "Zustand", "GLSL"],
      link: "https://github.com/Siddhartha/3d-camera-web",
      paperType: "grid",
      rotation: 0.5,
      pinColor: "yellow",
      pinPosition: "center",
      date: "June 2026",
    },
    {
      id: 3,
      title: "Tasky Kanban Board",
      category: "Productivity Tool",
      description: "Supercharged drag-and-drop Kanban board for developers. Features local persistence, automatic subtask checklists, and time tracking logs.",
      tags: ["React", "Typescript", "Dnd-Kit", "Tailwind"],
      link: "#",
      paperType: "blue",
      rotation: -3.5,
      pinColor: "green",
      pinPosition: "right",
    },
    {
      id: 4,
      title: "Smart AI Chat Buddy",
      category: "AI / LLM Integration",
      description: "Conversational agent wrapper with smart contextual prompts, voice transcription, markdown formatting, code-syntax highlighting, and chat history export.",
      tags: ["Gemini API", "React", "Web Speech API"],
      link: "#",
      paperType: "pink",
      rotation: 4.0,
      pinColor: "purple",
      pinPosition: "left",
      date: "April 2026",
    },
    {
      id: 5,
      title: "SoundWave",
      category: "Audio Engineering",
      description: "Real-time web audio visualizer. Capture microphone inputs, map frequencies to customizable particle grids, and control gain/equalization filters.",
      tags: ["Web Audio", "Canvas 2D", "React Hooks"],
      link: "#",
      paperType: "green",
      rotation: -0.5,
      pinColor: "orange",
      pinPosition: "center",
    },
    {
      id: 6,
      title: "Portfolio V1",
      category: "Personal Website",
      description: "My previous portfolio featuring a terminal emulator CLI, a retro dark mode, and an interactive contact card drawer.",
      tags: ["HTML", "Vanilla JS", "CSS Grid", "Vite"],
      link: "#",
      paperType: "yellow",
      rotation: -4.0,
      pinColor: "blue",
      pinPosition: "right",
      date: "Dec 2025",
    },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-gray-100 font-sans selection:bg-white selection:text-black overflow-x-hidden">
      {/* --- Floating Navigation --- */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-4xl bg-black/55 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3.5 flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-3">
          <span className={`w-3.5 h-3.5 rounded-full animate-pulse transition-colors duration-500 ${
            colorMode === 'colorful' ? 'bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.8)]' : 'bg-white'
          }`}></span>
          <span className="font-display font-semibold tracking-wider text-sm uppercase">Siddhartha.dev</span>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium text-gray-400">
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#projects" className={`hover:text-white transition-colors font-semibold text-white underline underline-offset-4 ${
            colorMode === 'colorful' ? 'decoration-violet-500/80' : 'decoration-white/40'
          }`}>Projects Board</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </div>
      </nav>

      {/* --- Section 1: Hero --- */}
      <header id="about" className="relative min-h-[90vh] flex items-center justify-center px-6 py-20 lg:py-0 overflow-hidden">
        {/* Background Accent Gradients */}
        <div className={`absolute top-[20%] left-[10%] w-[350px] h-[350px] rounded-full blur-[120px] pointer-events-none transition-colors duration-500 ${
          colorMode === 'colorful' ? 'bg-violet-500/5' : 'bg-white/5'
        }`}></div>
        <div className={`absolute bottom-[20%] right-[10%] w-[400px] h-[400px] rounded-full blur-[130px] pointer-events-none transition-colors duration-500 ${
          colorMode === 'colorful' ? 'bg-cyan-500/5' : 'bg-zinc-500/5'
        }`}></div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
          {/* Left Column: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 text-left space-y-6 flex flex-col justify-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-semibold tracking-wider uppercase text-zinc-300 self-start">
              <span>🚀 Available for Freelance & Projects</span>
            </div>
            
            <div className="space-y-2">
              <span className="text-zinc-400 font-display font-bold tracking-widest uppercase text-sm block">
                Hello, I'm
              </span>
              <h1 className="text-6xl md:text-8xl font-display font-extrabold text-white tracking-tight leading-none">
                Siddhartha
              </h1>
            </div>

            <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl">
              A creative fullstack developer crafting high-performance, visually stunning web applications and interactive 3D interfaces that bring digital experiences to life.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href="#projects"
                className={`px-6 py-3 font-semibold rounded-full transition-all duration-300 shadow-lg text-center ${
                  colorMode === 'colorful'
                    ? 'bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-650 hover:to-indigo-650 text-white'
                    : 'bg-white text-black hover:bg-zinc-200'
                }`}
              >
                Explore Projects Board
              </a>
              <a
                href="#contact"
                className="px-6 py-3 bg-transparent border border-white/20 hover:border-white text-white font-semibold rounded-full transition-all duration-300 text-center"
              >
                Get in Touch
              </a>
            </div>
          </motion.div>

          {/* Right Column: Interactive 3D Robot */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 w-full h-[400px] md:h-[500px] lg:h-[550px] relative flex items-center justify-center"
          >
            {/* Ambient glow behind the robot container */}
            <div className={`absolute inset-0 rounded-2xl blur-xl -z-10 transition-colors duration-500 ${
              colorMode === 'colorful' ? 'bg-gradient-to-tr from-violet-500/10 to-cyan-500/10' : 'bg-gradient-to-tr from-white/5 to-white/10'
            }`}></div>
            
            {/* 3D Robot Model wrapper (Clicking it plays the introduction voice greeting) */}
            <div 
              onClick={playVoiceGreeting}
              title="Click the robot to hear my intro!"
              className="w-full h-full rounded-2xl overflow-hidden bg-black/40 border border-white/10 shadow-2xl relative flex items-center justify-center cursor-pointer group"
            >
              {isRobotLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0e0e11] z-10 space-y-4">
                  <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500 animate-pulse font-display">
                    Powering up 3D robot...
                  </span>
                </div>
              )}
              <Spline
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                onLoad={() => setIsRobotLoading(false)}
                className="w-full h-full transition-transform duration-500 group-hover:scale-102"
              />
            </div>

            {/* Play Sound Button at bottom of robot container */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                playVoiceGreeting();
              }}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 px-5 py-2.5 bg-black/90 hover:bg-zinc-900 border border-white/15 hover:border-white/30 text-white rounded-full text-xs font-semibold shadow-2xl flex items-center gap-2 cursor-pointer transition-all duration-300 hover:scale-105"
            >
              {isSpeaking ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                  <span>Stop Intro Voice</span>
                </>
              ) : (
                <>
                  <span>🔊 Play Introduction</span>
                </>
              )}
            </button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 text-gray-500 select-none">
          <span className="text-[10px] uppercase tracking-widest font-semibold animate-pulse">Scroll Down</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-gray-500 to-transparent"></div>
        </div>
      </header>

      {/* --- Section 2: Notice Board (Dotted Board type) --- */}
      <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-[#09090b]">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header & Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
                📌 Pinned Projects
              </h2>
              <p className="text-gray-400 text-sm md:text-base max-w-xl">
                Here are the updates on what I've been building. Hover or tap a card to inspect my projects!
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3.5 mt-4 md:mt-0">
              {/* Board Style Switcher */}
              <div className="flex items-center gap-1.5 bg-zinc-900/60 backdrop-blur-md border border-white/10 p-1 rounded-full text-[11px] font-semibold text-zinc-400">
                <span className="px-2.5 py-1 text-zinc-500 select-none">Board:</span>
                <button
                  onClick={() => setBoardTheme('dark')}
                  className={`px-3 py-1 rounded-full transition-all duration-200 cursor-pointer ${boardTheme === 'dark' ? 'bg-white text-black font-bold shadow-md' : 'hover:text-white'}`}
                >
                  Dark Cork
                </button>
                <button
                  onClick={() => setBoardTheme('light')}
                  className={`px-3 py-1 rounded-full transition-all duration-200 cursor-pointer ${boardTheme === 'light' ? 'bg-zinc-800 text-white font-bold shadow-md' : 'hover:text-white'}`}
                >
                  Light Pegboard
                </button>
              </div>

              {/* Color Format Switcher */}
              <div className="flex items-center gap-1.5 bg-zinc-900/60 backdrop-blur-md border border-white/10 p-1 rounded-full text-[11px] font-semibold text-zinc-400">
                <span className="px-2.5 py-1 text-zinc-500 select-none">Palette:</span>
                <button
                  onClick={() => setColorMode('monochrome')}
                  className={`px-3 py-1 rounded-full transition-all duration-200 cursor-pointer ${colorMode === 'monochrome' ? 'bg-white text-black font-bold shadow-md' : 'hover:text-white'}`}
                >
                  Monochrome
                </button>
                <button
                  onClick={() => setColorMode('colorful')}
                  className={`px-3 py-1 rounded-full transition-all duration-200 cursor-pointer ${colorMode === 'colorful' ? 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-bold shadow-md border-0' : 'hover:text-white'}`}
                >
                  Vibrant Color
                </button>
              </div>
            </div>
          </div>

          {/* Dotted Notice Board pegboard itself */}
          <div
            className={`relative w-full rounded-3xl p-8 md:p-12 overflow-hidden border transition-all duration-500 min-h-[600px] ${
              boardTheme === 'dark' 
                ? 'bg-[#0f0f12] border-white/10' 
                : 'bg-[#f8f7f4] border-zinc-200/80'
            } ${
              colorMode === 'colorful' && boardTheme === 'dark'
                ? 'shadow-[0_0_50px_rgba(139,92,246,0.05)]'
                : ''
            }`}
          >
            {/* Interactive Canvas Dots Background */}
            <InteractiveDotsBackground theme={boardTheme} colorMode={colorMode} />

            {/* Grid of Projects (The modern wide rounded containers) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-16 relative z-10 mt-6">
              {projects.map((project) => {
                // Determine the rotation angle and origin based on pin position to simulate physical drop
                let rotationAngle = 0;
                let transformOrigin = 'top center';
                let pinClass = '';

                if (project.pinPosition === 'left') {
                  rotationAngle = project.rotation || 3.5; // hangs from left corner, right drops down
                  transformOrigin = 'top left';
                  pinClass = 'absolute -top-4 left-8 z-20';
                } else if (project.pinPosition === 'right') {
                  rotationAngle = project.rotation || -3.5; // hangs from right corner, left drops down
                  transformOrigin = 'top right';
                  pinClass = 'absolute -top-4 right-8 z-20';
                } else {
                  rotationAngle = project.rotation || 0.5; // hangs straight down with minor organic tilt
                  transformOrigin = 'top center';
                  pinClass = 'absolute -top-4 left-1/2 transform -translate-x-1/2 z-20';
                }

                // Determine pin color based on active color mode
                const pinColorToUse = colorMode === 'monochrome'
                  ? getMonochromePinColor(project.pinColor)
                  : project.pinColor;

                return (
                  <motion.div
                    key={project.id}
                    className="relative group cursor-pointer"
                    style={{ 
                      transformOrigin,
                    }}
                    initial={{ rotate: rotationAngle }}
                    animate={{ rotate: rotationAngle }}
                    whileHover={{ 
                      rotate: 0, 
                      scale: 1.025, 
                      zIndex: 30,
                    }}
                    transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                  >
                    {/* Render Pushpin holding the cart */}
                    <PushPin
                      color={pinColorToUse}
                      className={pinClass}
                    />

                    {/* Wide Horizontal Card Container */}
                    <div className={`w-full backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row transition-all duration-300 min-h-[220px] ${
                      boardTheme === 'dark' 
                        ? 'bg-[#121215]/95 border border-white/10 text-white hover:border-white/30 hover:shadow-[0_15px_30px_rgba(255,255,255,0.03)]' 
                        : 'bg-white/95 border border-zinc-200/80 text-zinc-900 hover:border-zinc-350 hover:shadow-[0_15px_30px_rgba(0,0,0,0.05)]'
                    }`}>
                      {/* Left Side: Mockup Photo (upside in mobile, left in desktop) */}
                      <div className={`w-full md:w-[40%] h-48 md:h-auto relative overflow-hidden flex items-center justify-center p-4 border-b md:border-b-0 md:border-r ${
                        boardTheme === 'dark' 
                          ? 'bg-gradient-to-br from-slate-900 to-black border-white/5' 
                          : 'bg-gradient-to-br from-zinc-50 to-zinc-100 border-zinc-100'
                      }`}>
                        {renderProjectMockup(project.id, colorMode)}
                      </div>

                      {/* Right Side: Details about the project */}
                      <div className="w-full md:w-[60%] p-6 flex flex-col justify-between space-y-4">
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${
                              boardTheme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'
                            }`}>
                              {project.category}
                            </span>
                            {project.date && (
                              <span className={`text-xs font-medium ${
                                boardTheme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'
                              }`}>
                                {project.date}
                              </span>
                            )}
                          </div>
                          
                          <h3 className={`text-lg font-bold tracking-tight transition-colors ${
                            boardTheme === 'dark' ? 'text-white group-hover:text-white' : 'text-zinc-900 group-hover:text-black'
                          }`}>
                            {project.title}
                          </h3>
                          
                          <p className={`text-xs leading-relaxed line-clamp-3 ${
                            boardTheme === 'dark' ? 'text-zinc-400' : 'text-zinc-650'
                          }`}>
                            {project.description}
                          </p>
                        </div>

                        <div className="space-y-3 pt-1">
                          {/* Tech stack pills */}
                          <div className="flex flex-wrap gap-1">
                            {project.tags.map((tag, i) => {
                              const colorfulStyles = [
                                "text-cyan-400 bg-cyan-500/5 border border-cyan-500/10",
                                "text-purple-400 bg-purple-500/5 border border-purple-500/10",
                                "text-emerald-400 bg-emerald-500/5 border border-emerald-500/10",
                                "text-pink-400 bg-pink-500/5 border border-pink-500/10"
                              ];
                              const tagStyle = colorMode === 'monochrome'
                                ? (boardTheme === 'dark'
                                    ? "text-zinc-400 bg-white/5 border border-white/5"
                                    : "text-zinc-600 bg-zinc-150 border border-zinc-200")
                                : colorfulStyles[i % colorfulStyles.length];

                              return (
                                <span
                                  key={i}
                                  className={`text-[9px] font-semibold tracking-wider px-2 py-0.5 rounded ${tagStyle}`}
                                >
                                  {tag}
                                </span>
                              );
                            })}
                          </div>

                          {/* Explore link */}
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-1.5 text-xs font-bold transition-colors duration-200 underline underline-offset-4 ${
                              boardTheme === 'dark'
                                ? 'text-zinc-300 hover:text-white decoration-zinc-800 hover:decoration-white'
                                : 'text-zinc-700 hover:text-black decoration-zinc-300 hover:decoration-black'
                            }`}
                            onClick={(e) => {
                              if (project.link === '#') {
                                e.preventDefault();
                                alert("Redirecting to project demo...");
                              }
                            }}
                          >
                            Explore Project ↗
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 3: Contact/Footer --- */}
      <footer id="contact" className="bg-[#0b0b0e] py-16 border-t border-white/5 relative">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <div className="space-y-3">
            <h3 className="text-2xl font-display font-bold text-white">Let's Stick Together!</h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto">
              Want to collaborate, talk about React/Three.js, or just drop a friendly hello? Connect with me.
            </p>
          </div>

          <div className="flex justify-center gap-6 text-sm">
            <a href="mailto:gopurajitha32@gmail.com" className="text-gray-400 hover:text-white transition-colors">gopurajitha32@gmail.com</a>
            <a href="https://github.com/sidharth1016" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">GitHub</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">LinkedIn</a>
          </div>

          <div className="text-gray-600 text-xs pt-8 border-t border-white/5">
            &copy; {new Date().getFullYear()} Gopu Siddhartha. All rights reserved. Created with Vite, React and Tailwind.
          </div>
        </div>
      </footer>
    </div>
  );
}
