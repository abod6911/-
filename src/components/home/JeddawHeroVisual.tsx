import React, { useEffect, useRef, useState } from "react";
import { Coffee, Compass, MapPin, Navigation, Sparkles, Sun, Utensils, Waves, Zap } from "lucide-react";

/**
 * SPLINE SCENE CONFIGURATION
 * Simply insert your Spline 3D Scene URL here when ready.
 * Example: "https://prod.spline.design/your-scene-id/scene.splinecode"
 */
export const SPLINE_SCENE_URL: string = "";

export function JeddawHeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [splineError, setSplineError] = useState(false);

  // Mouse parallax interaction on desktop
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const moveX = (e.clientX - centerX) / (rect.width / 2);
      const moveY = (e.clientY - centerY) / (rect.height / 2);

      setMousePos({
        x: Math.max(-1, Math.min(1, moveX)),
        y: Math.max(-1, Math.min(1, moveY)),
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // If a Spline URL is specified, render the Spline viewer
  if (SPLINE_SCENE_URL && !splineError) {
    return (
      <div className="relative h-full w-full overflow-hidden flex items-center justify-center">
        <iframe
          src={SPLINE_SCENE_URL}
          title="JEDDAW 3D Scene"
          className="h-full w-full border-0 bg-transparent"
          onLoad={() => setIsLoaded(true)}
          onError={() => setSplineError(true)}
        />
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-transparent backdrop-blur-xs">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#C96745] border-t-transparent" />
          </div>
        )}
      </div>
    );
  }

  // Intentionally designed luxury 3D Interactive Placeholder Visual
  return (
    <div
      ref={containerRef}
      className="relative h-full w-full flex items-center justify-center p-4 sm:p-8 select-none overflow-visible"
    >
      {/* Background Soft Glow Orbs */}
      <div
        className="absolute h-[380px] w-[380px] rounded-full bg-gradient-to-tr from-[#C96745]/30 via-[#E4A23B]/20 to-[#397C78]/30 blur-3xl transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${mousePos.x * -25}px, ${mousePos.y * -25}px) scale(1.05)`,
        }}
      />

      {/* Main Central Sphere / Glowing Hub */}
      <div
        className="relative z-10 flex h-64 w-64 sm:h-80 sm:w-80 items-center justify-center rounded-full bg-gradient-to-b from-white/15 via-white/5 to-transparent p-1 backdrop-blur-2xl border border-white/25 shadow-2xl transition-transform duration-500 ease-out"
        style={{
          transform: `perspective(1000px) rotateY(${mousePos.x * 12}deg) rotateX(${mousePos.y * -12}deg)`,
        }}
      >
        {/* Inner Glowing Ring */}
        <div className="relative flex h-full w-full items-center justify-center rounded-full bg-[#0B2523]/60 border border-white/10 shadow-inner overflow-hidden">
          {/* Animated Wave SVG Grid */}
          <div className="absolute inset-0 opacity-25">
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d="M0 30 Q 25 20, 50 30 T 100 30 V 100 H 0 Z"
                fill="none"
                stroke="#5EAAA5"
                strokeWidth="0.5"
                strokeDasharray="2 2"
              />
              <path
                d="M0 60 Q 25 50, 50 60 T 100 60 V 100 H 0 Z"
                fill="none"
                stroke="#C96745"
                strokeWidth="0.5"
                strokeDasharray="2 2"
              />
            </svg>
          </div>

          {/* Central JEDDAW Brand Core */}
          <div className="relative z-20 flex flex-col items-center justify-center text-center p-6">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-[#C96745] to-[#E4A23B] text-white shadow-lift animate-bounce-gentle mb-3">
              <Compass className="h-8 w-8 text-white animate-spin-slow" />
            </div>
            <span className="text-xl font-black text-white tracking-wide">جِدّاو</span>
            <span className="text-[11px] font-bold text-[#FF9D7A] uppercase tracking-wider mt-0.5">
              JEDDAH OUTING AI
            </span>
          </div>
        </div>
      </div>

      {/* Floating Stylized 3D Cards & Badges */}

      {/* Card 1: Sea & Sunset 🌊 */}
      <div
        className="absolute top-4 start-4 sm:top-8 sm:start-8 z-20 flex items-center gap-3 rounded-2xl bg-white/15 p-3.5 backdrop-blur-xl border border-white/25 shadow-2xl transition-transform duration-500 ease-out animate-float"
        style={{
          transform: `translate(${mousePos.x * 18}px, ${mousePos.y * 18}px)`,
        }}
      >
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#2B7A88] to-[#397C78] text-white text-lg">
          🌊
        </div>
        <div>
          <span className="block text-xs font-black text-white">غروب البحر الأحمر</span>
          <span className="block text-[10px] font-bold text-white/70">كورنيش جدة • أبحر</span>
        </div>
      </div>

      {/* Card 2: Specialty Coffee ☕ */}
      <div
        className="absolute top-12 end-2 sm:top-14 sm:end-6 z-20 flex items-center gap-3 rounded-2xl bg-white/15 p-3.5 backdrop-blur-xl border border-white/25 shadow-2xl transition-transform duration-500 ease-out animate-float-delayed"
        style={{
          transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -15}px)`,
        }}
      >
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#C96745] to-[#B84E4E] text-white text-lg">
          ☕
        </div>
        <div>
          <span className="block text-xs font-black text-white">قهوة مختصة ورايقة</span>
          <span className="block text-[10px] font-bold text-white/70">برو 92 • الروضة</span>
        </div>
      </div>

      {/* Card 3: Dining & Seafood 🍽️ */}
      <div
        className="absolute bottom-8 start-2 sm:bottom-12 sm:start-6 z-20 flex items-center gap-3 rounded-2xl bg-white/15 p-3.5 backdrop-blur-xl border border-white/25 shadow-2xl transition-transform duration-500 ease-out animate-float"
        style={{
          transform: `translate(${mousePos.x * 15}px, ${mousePos.y * -20}px)`,
        }}
      >
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#E4A23B] to-[#C96745] text-white text-lg">
          🍽️
        </div>
        <div>
          <span className="block text-xs font-black text-white">عشاء فاخر أو طازج</span>
          <span className="block text-[10px] font-bold text-white/70">لوسين • قدورة</span>
        </div>
      </div>

      {/* Card 4: Heritage & Al Balad 🏛️ */}
      <div
        className="absolute bottom-4 end-4 sm:bottom-8 sm:end-8 z-20 flex items-center gap-3 rounded-2xl bg-white/15 p-3.5 backdrop-blur-xl border border-white/25 shadow-2xl transition-transform duration-500 ease-out animate-float-delayed"
        style={{
          transform: `translate(${mousePos.x * -18}px, ${mousePos.y * 18}px)`,
        }}
      >
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#71805B] to-[#397C78] text-white text-lg">
          🏛️
        </div>
        <div>
          <span className="block text-xs font-black text-white">تراث جدة التاريخية</span>
          <span className="block text-[10px] font-bold text-white/70">البلد • بيت ناصيف</span>
        </div>
      </div>

      {/* Small Decorative Floating Pins */}
      <div
        className="absolute top-1/2 -start-4 sm:start-0 -translate-y-1/2 z-30 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#C96745] to-[#E4A23B] text-white shadow-lift animate-pulse"
        style={{
          transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 10}px)`,
        }}
      >
        <MapPin className="h-6 w-6" />
      </div>

      <div
        className="absolute top-1/3 -end-4 sm:end-0 z-30 grid h-10 w-10 place-items-center rounded-2xl bg-[#397C78] text-white shadow-lift"
        style={{
          transform: `translate(${mousePos.x * -12}px, ${mousePos.y * -12}px)`,
        }}
      >
        <Sparkles className="h-5 w-5 text-[#E4A23B] animate-spin-slow" />
      </div>
    </div>
  );
}
