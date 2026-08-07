import React, { useEffect, useRef, useState } from "react";
import { Compass, MapPin, Sparkles, Utensils, Coffee, Activity, Waves } from "lucide-react";

/**
 * SPLINE 3D SCENE CONFIGURATION
 * Paste your Spline 3D Scene URL here when available.
 * Example: "https://prod.spline.design/your-scene-id/scene.splinecode"
 */
export const SPLINE_SCENE_URL: string = "";

export type HeroExperienceState = "idle" | "generating" | "success";

interface JeddawHeroExperienceProps {
  state?: HeroExperienceState;
  onCtaHover?: (isHovered: boolean) => void;
}

export function JeddawHeroExperience({ state = "idle", onCtaHover }: JeddawHeroExperienceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [splineError, setSplineError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Smooth pointer depth parallax
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
          title="JEDDAW 3D Route Scene"
          className="h-full w-full border-0 bg-transparent"
          onError={() => setSplineError(true)}
        />
      </div>
    );
  }

  // Open Spatial Composition: "THE JEDDAW ROUTE" (NO BOXES, NO CONTAINERS)
  return (
    <div
      ref={containerRef}
      className="relative h-full w-full flex items-center justify-center p-2 sm:p-6 select-none pointer-events-none overflow-visible"
    >
      {/* Red Sea Atmospheric Ambient Glows */}
      <div
        className={`absolute h-[420px] w-[420px] rounded-full bg-gradient-to-tr from-[#C96745]/20 via-[#397C78]/25 to-transparent blur-3xl transition-all duration-700 ${
          state === "generating" ? "scale-125 opacity-90" : "scale-100 opacity-60"
        }`}
        style={{
          transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)`,
        }}
      />

      {/* Abstract Red Sea Coastline & Animated Route Path SVG */}
      <svg
        className="absolute inset-0 h-full w-full z-0 pointer-events-none overflow-visible opacity-75"
        viewBox="0 0 600 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Subtle Abstract Coastline Wave Shape */}
        <path
          d="M 50 450 Q 180 320, 240 240 T 550 50"
          stroke="#397C78"
          strokeWidth="1.5"
          strokeDasharray="4 8"
          className="opacity-30"
        />

        {/* Primary Glowing Outing Route */}
        <path
          d="M 90 350 C 160 210, 280 340, 360 180 C 420 100, 480 140, 520 80"
          stroke="url(#jeddawRouteGradient)"
          strokeWidth={state === "generating" || isHovered ? "4" : "3"}
          strokeDasharray={state === "generating" ? "12 6" : "none"}
          className="transition-all duration-500 drop-shadow-[0_0_12px_rgba(201,103,69,0.4)]"
        />

        <defs>
          <linearGradient id="jeddawRouteGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C96745" />
            <stop offset="40%" stopColor="#E4A23B" />
            <stop offset="75%" stopColor="#5EAAA5" />
            <stop offset="100%" stopColor="#397C78" />
          </linearGradient>
        </defs>
      </svg>

      {/* DESTINATION NODE 1: DINING / RESTAURANT (عشاء) */}
      <div
        className="absolute top-[62%] start-[8%] sm:start-[12%] z-10 flex items-center gap-2.5 rounded-full bg-[#051413]/90 border border-white/20 px-3.5 py-2 shadow-2xl backdrop-blur-xl transition-all duration-700 animate-float"
        style={{
          transform: `translate(${mousePos.x * 14}px, ${mousePos.y * 14}px)`,
        }}
      >
        <div className="relative h-8 w-8 rounded-full overflow-hidden border border-white/30 shrink-0">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=120&q=80"
            alt="مطعم"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex items-center gap-1.5 pe-1">
          <Utensils className="h-3.5 w-3.5 text-[#FF9D7A]" />
          <span className="text-xs font-black text-white whitespace-nowrap">عشاء</span>
        </div>
      </div>

      {/* DESTINATION NODE 2: SPECIALTY COFFEE (قهوة) */}
      <div
        className="absolute top-[28%] start-[32%] sm:start-[36%] z-10 flex items-center gap-2.5 rounded-full bg-[#051413]/90 border border-white/20 px-3.5 py-2 shadow-2xl backdrop-blur-xl transition-all duration-700 animate-float-delayed"
        style={{
          transform: `translate(${mousePos.x * -18}px, ${mousePos.y * -12}px)`,
        }}
      >
        <div className="relative h-8 w-8 rounded-full overflow-hidden border border-white/30 shrink-0">
          <img
            src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=120&q=80"
            alt="قهوة"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex items-center gap-1.5 pe-1">
          <Coffee className="h-3.5 w-3.5 text-[#E4A23B]" />
          <span className="text-xs font-black text-white whitespace-nowrap">قهوة</span>
        </div>
      </div>

      {/* CENTRAL JEDDAW LOCATION PIN (خطتك 📍) */}
      <div
        className="relative z-20 flex flex-col items-center justify-center text-center transition-transform duration-500 ease-out my-auto"
        style={{
          transform: `translate(${mousePos.x * 6}px, ${mousePos.y * 6}px)`,
        }}
      >
        {/* Pulsing Outer Ring */}
        <div className="absolute h-24 w-24 rounded-full bg-[#C96745]/20 animate-ping opacity-30" />
        
        {/* Custom SVG Location Pin */}
        <div className="relative grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-[#C96745] via-[#E4A23B] to-[#397C78] text-white shadow-2xl border border-white/40 ring-4 ring-[#C96745]/30">
          <MapPin className="h-8 w-8 text-white drop-shadow-md animate-bounce-gentle" />
          <span className="absolute -bottom-1 grid h-4 w-4 place-items-center rounded-full bg-white text-[#C96745]">
            <Sparkles className="h-2.5 w-2.5" />
          </span>
        </div>

        {/* Pin Label */}
        <span className="mt-2.5 text-xs font-black text-white tracking-widest bg-black/60 px-3.5 py-1 rounded-full border border-white/20 backdrop-blur-md shadow-lg">
          خطتك 📍
        </span>
      </div>

      {/* DESTINATION NODE 3: ACTIVITY / ENTERTAINMENT (فعالية) */}
      <div
        className="absolute top-[48%] end-[16%] sm:end-[20%] z-10 flex items-center gap-2.5 rounded-full bg-[#051413]/90 border border-white/20 px-3.5 py-2 shadow-2xl backdrop-blur-xl transition-all duration-700 animate-float"
        style={{
          transform: `translate(${mousePos.x * 16}px, ${mousePos.y * -16}px)`,
        }}
      >
        <div className="relative h-8 w-8 rounded-full overflow-hidden border border-white/30 shrink-0">
          <img
            src="https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=120&q=80"
            alt="فعالية"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex items-center gap-1.5 pe-1">
          <Activity className="h-3.5 w-3.5 text-[#5EAAA5]" />
          <span className="text-xs font-black text-white whitespace-nowrap">فعالية</span>
        </div>
      </div>

      {/* DESTINATION NODE 4: SUNSET SEA / CORNICHE (غروب) */}
      <div
        className="hidden sm:flex absolute top-[16%] end-[8%] z-10 items-center gap-2.5 rounded-full bg-[#051413]/90 border border-white/20 px-3.5 py-2 shadow-2xl backdrop-blur-xl transition-all duration-700 animate-float-delayed"
        style={{
          transform: `translate(${mousePos.x * -14}px, ${mousePos.y * 14}px)`,
        }}
      >
        <div className="relative h-8 w-8 rounded-full overflow-hidden border border-white/30 shrink-0">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=120&q=80"
            alt="غروب"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex items-center gap-1.5 pe-1">
          <Waves className="h-3.5 w-3.5 text-[#397C78]" />
          <span className="text-xs font-black text-white whitespace-nowrap">غروب</span>
        </div>
      </div>
    </div>
  );
}

// Export compatibility alias
export { JeddawHeroExperience as JeddawHeroVisual };
