import React, { useEffect, useRef, useState } from "react";
import { Compass, MapPin, Sparkles } from "lucide-react";

/**
 * SPLINE 3D SCENE CONFIGURATION
 * Paste your Spline 3D Scene URL here when available.
 * Example: "https://prod.spline.design/your-scene-id/scene.splinecode"
 */
export const SPLINE_SCENE_URL: string = "";

export type Hero3DState = "idle" | "generating" | "success";

interface JeddawHero3DProps {
  state?: Hero3DState;
}

export function JeddawHero3D({ state = "idle" }: JeddawHero3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [splineError, setSplineError] = useState(false);

  // Subtle mouse parallax
  useEffect(() => {
    let animationFrameId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      targetX = (e.clientX - centerX) / (rect.width / 2);
      targetY = (e.clientY - centerY) / (rect.height / 2);
    };

    const updateParallax = () => {
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;
      setMousePos({
        x: Math.max(-1, Math.min(1, currentX)),
        y: Math.max(-1, Math.min(1, currentY)),
      });
      animationFrameId = requestAnimationFrame(updateParallax);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animationFrameId = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // If a Spline URL is set, load Spline scene
  if (SPLINE_SCENE_URL && !splineError) {
    return (
      <div className="relative h-full w-full overflow-hidden flex items-center justify-center pointer-events-auto">
        <iframe
          src={SPLINE_SCENE_URL}
          title="JEDDAW 3D Scene"
          className="h-full w-full border-0 bg-transparent"
          onError={() => setSplineError(true)}
        />
      </div>
    );
  }

  // Signature Floating 3D Experience Nodes Canvas (No container boxes, no borders)
  return (
    <div
      ref={containerRef}
      className="relative h-full w-full flex items-center justify-center p-4 select-none pointer-events-none overflow-visible"
    >
      {/* Background Atmosphere Glow - Soft, non-distracting */}
      <div
        className="absolute h-[380px] w-[380px] rounded-full bg-gradient-to-tr from-[#C96745]/20 via-[#397C78]/25 to-transparent blur-3xl transition-transform duration-1000 ease-out"
        style={{
          transform: `translate(${mousePos.x * -25}px, ${mousePos.y * -25}px)`,
        }}
      />

      {/* SVG Connecting Dash Route: Restaurant -> Coffee -> Activity -> Sea */}
      <svg
        className="absolute inset-0 h-full w-full z-0 opacity-45 pointer-events-none"
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 110 320 Q 200 180, 260 250 T 400 160"
          stroke="url(#routeGradient)"
          strokeWidth="2.5"
          strokeDasharray="6 6"
          className="animate-route-draw"
        />
        <defs>
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C96745" />
            <stop offset="50%" stopColor="#E4A23B" />
            <stop offset="100%" stopColor="#5EAAA5" />
          </linearGradient>
        </defs>
      </svg>

      {/* Floating 3D Experience Node 1: Dining / Seafood 🍽️ */}
      <div
        className="absolute top-[28%] start-[10%] z-10 flex items-center gap-3 rounded-2xl bg-[#091C1A]/80 border border-white/20 p-3.5 shadow-2xl backdrop-blur-xl transition-transform duration-700 ease-out animate-float"
        style={{
          transform: `translate(${mousePos.x * 16}px, ${mousePos.y * 16}px)`,
        }}
      >
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-[#C96745] to-[#B84E4E] text-white text-xl shadow-md">
          🍽️
        </div>
        <div>
          <span className="block text-xs font-black text-white">مطاعم وعشاء فاخر</span>
          <span className="block text-[10px] font-bold text-[#FF9D7A]">قدورة • لوسين • خيال</span>
        </div>
      </div>

      {/* Floating 3D Experience Node 2: Specialty Coffee ☕ */}
      <div
        className="absolute top-[18%] end-[12%] z-10 flex items-center gap-3 rounded-2xl bg-[#091C1A]/80 border border-white/20 p-3.5 shadow-2xl backdrop-blur-xl transition-transform duration-700 ease-out animate-float-delayed"
        style={{
          transform: `translate(${mousePos.x * -22}px, ${mousePos.y * -14}px)`,
        }}
      >
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-[#E4A23B] to-[#C96745] text-white text-xl shadow-md">
          ☕
        </div>
        <div>
          <span className="block text-xs font-black text-white">قهوة مختصة ورايقة</span>
          <span className="block text-[10px] font-bold text-[#E4A23B]">برو 92 • ميدد البلد</span>
        </div>
      </div>

      {/* Floating 3D Experience Node 3: Entertainment & Karting 🏎️ */}
      <div
        className="absolute bottom-[26%] start-[18%] z-10 flex items-center gap-3 rounded-2xl bg-[#091C1A]/80 border border-white/20 p-3.5 shadow-2xl backdrop-blur-xl transition-transform duration-700 ease-out animate-float-delayed"
        style={{
          transform: `translate(${mousePos.x * 18}px, ${mousePos.y * -18}px)`,
        }}
      >
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-[#71805B] to-[#397C78] text-white text-xl shadow-md">
          🏎️
        </div>
        <div>
          <span className="block text-xs font-black text-white">ألعاب وحركة وشغف</span>
          <span className="block text-[10px] font-bold text-[#5EAAA5]">إن-نايت • سينما</span>
        </div>
      </div>

      {/* Floating 3D Experience Node 4: Red Sea Coast 🌊 */}
      <div
        className="absolute bottom-[20%] end-[10%] z-10 flex items-center gap-3 rounded-2xl bg-[#091C1A]/80 border border-white/20 p-3.5 shadow-2xl backdrop-blur-xl transition-transform duration-700 ease-out animate-float"
        style={{
          transform: `translate(${mousePos.x * -16}px, ${mousePos.y * 16}px)`,
        }}
      >
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-[#2B7A88] to-[#397C78] text-white text-xl shadow-md">
          🌊
        </div>
        <div>
          <span className="block text-xs font-black text-white">بحر وغروب الكورنيش</span>
          <span className="block text-[10px] font-bold text-[#5EAAA5]">أبحر • منتجعات</span>
        </div>
      </div>

      {/* Central Floating Location Hub Pin 📍 */}
      <div
        className="relative z-20 flex flex-col items-center justify-center text-center transition-transform duration-500 ease-out"
        style={{
          transform: `translate(${mousePos.x * 8}px, ${mousePos.y * 8}px)`,
        }}
      >
        <div className="relative grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-[#C96745] via-[#E4A23B] to-[#397C78] text-white shadow-2xl border border-white/30">
          <MapPin className="h-8 w-8 text-white animate-bounce-gentle" />
          <span className="absolute -bottom-1 grid h-4 w-4 place-items-center rounded-full bg-white text-[#C96745]">
            <Sparkles className="h-2.5 w-2.5" />
          </span>
        </div>
        <span className="mt-2 text-xs font-black text-white tracking-widest bg-black/40 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
          جِدّاو 📍
        </span>
      </div>
    </div>
  );
}

// Export alias for JeddawHeroVisual compatibility
export { JeddawHero3D as JeddawHeroVisual };
