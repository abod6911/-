import React, { useEffect, useRef, useState } from "react";
import { Compass, MapPin, Sparkles, Utensils, Coffee, Zap, Waves, Star, Clock, Navigation } from "lucide-react";

/**
 * SPLINE 3D SCENE CONFIGURATION
 * Paste your Spline 3D Scene URL here when available.
 * Example: "https://prod.spline.design/your-scene-id/scene.splinecode"
 */
export const SPLINE_SCENE_URL: string = "";

export type HeroExperienceState = "idle" | "generating" | "success";

interface JeddawHeroExperienceProps {
  state?: HeroExperienceState;
}

export function JeddawHeroExperience({ state = "idle" }: JeddawHeroExperienceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [splineError, setSplineError] = useState(false);

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

  // RICH, LAYERED 3D OUTING SCENE (NO OUTER CONTAINER BOX)
  return (
    <div
      ref={containerRef}
      className="relative h-full w-full flex items-center justify-center p-2 sm:p-4 select-none pointer-events-none overflow-visible"
    >
      {/* Layer 0: Multi-Tone Atmospheric Background Glow Orbs */}
      <div
        className="absolute h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-[#C96745]/25 via-[#E4A23B]/20 to-[#397C78]/25 blur-3xl transition-transform duration-1000 ease-out"
        style={{
          transform: `translate(${mousePos.x * -25}px, ${mousePos.y * -25}px)`,
        }}
      />
      <div className="absolute top-10 end-10 h-64 w-64 rounded-full bg-[#5EAAA5]/20 blur-2xl pointer-events-none" />

      {/* Layer 1: Abstract Red Sea Coastline & Layered Curved SVG Routes */}
      <svg
        className="absolute inset-0 h-full w-full z-0 pointer-events-none overflow-visible"
        viewBox="0 0 650 520"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Subtle Coastline Contour Lines */}
        <path
          d="M 40 480 Q 200 350, 310 260 T 610 60"
          stroke="#397C78"
          strokeWidth="1.5"
          strokeDasharray="6 12"
          className="opacity-25"
        />
        <path
          d="M 20 440 Q 180 310, 290 220 T 590 20"
          stroke="#C96745"
          strokeWidth="1"
          strokeDasharray="3 9"
          className="opacity-20"
        />

        {/* Primary Glowing Outing Path Connection */}
        <path
          d="M 110 370 C 180 230, 290 350, 370 190 C 440 110, 520 150, 560 70"
          stroke="url(#jeddawRichRouteGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          className="animate-route-draw drop-shadow-[0_0_16px_rgba(201,103,69,0.5)]"
        />

        {/* Dynamic Route Gradient Definition */}
        <defs>
          <linearGradient id="jeddawRichRouteGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C96745" />
            <stop offset="35%" stopColor="#E4A23B" />
            <stop offset="70%" stopColor="#5EAAA5" />
            <stop offset="100%" stopColor="#397C78" />
          </linearGradient>
        </defs>
      </svg>

      {/* Layer 2: SIGNATURE CENTRAL ANCHOR ELEMENT (Branded Route Hub & Pin) */}
      <div
        className="relative z-20 flex flex-col items-center justify-center text-center transition-transform duration-500 ease-out my-auto"
        style={{
          transform: `translate(${mousePos.x * 8}px, ${mousePos.y * 8}px)`,
        }}
      >
        {/* Pulsing Outer Rings */}
        <div className="absolute h-36 w-36 rounded-full border border-[#C96745]/30 animate-ping opacity-25" />
        <div className="absolute h-28 w-28 rounded-full bg-gradient-to-r from-[#C96745]/20 to-[#397C78]/20 blur-lg" />

        {/* Central Branded Marker Hub */}
        <div className="relative grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-[#C96745] via-[#E4A23B] to-[#397C78] text-white shadow-2xl border-2 border-white/40 ring-8 ring-[#C96745]/20">
          <MapPin className="h-10 w-10 text-white drop-shadow-lg animate-bounce-gentle" />
          <span className="absolute -bottom-1 grid h-5 w-5 place-items-center rounded-full bg-white text-[#C96745] shadow-md">
            <Sparkles className="h-3 w-3" />
          </span>
        </div>

        {/* Central Hub Label Pill */}
        <div className="mt-3 flex items-center gap-2 rounded-full bg-[#051413]/90 px-4 py-1.5 border border-white/20 shadow-2xl backdrop-blur-xl">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-black text-white tracking-widest">خطتك الموزونة 📍</span>
        </div>
      </div>

      {/* Layer 3: DESTINATION MODULE 1 (DINING / عشاء فاخر - Bottom Left) */}
      <div
        className="absolute top-[65%] start-[4%] sm:start-[8%] z-30 flex items-center gap-3.5 rounded-2xl bg-[#091C1A]/95 border border-white/25 p-2.5 pe-4 shadow-2xl backdrop-blur-2xl transition-all duration-700 animate-float"
        style={{
          transform: `translate(${mousePos.x * 18}px, ${mousePos.y * 18}px)`,
        }}
      >
        <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-white/30 shrink-0 shadow-md">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=160&q=80"
            alt="عشاء"
            className="h-full w-full object-cover"
          />
          <span className="absolute bottom-0 end-0 bg-black/60 text-[9px] px-1 text-white font-bold">17:30</span>
        </div>
        <div className="flex flex-col text-start">
          <div className="flex items-center gap-1.5">
            <span className="grid h-5 w-5 place-items-center rounded-md bg-[#C96745]/20 text-[#FF9D7A]">
              <Utensils className="h-3 w-3" />
            </span>
            <span className="text-xs font-black text-white">عشاء فاخر</span>
          </div>
          <span className="text-[10px] font-bold text-[#FF9D7A] mt-0.5">الكورنيش · مأكولات بحرية</span>
        </div>
      </div>

      {/* Layer 3: DESTINATION MODULE 2 (COFFEE / قهوة مختصة - Top Left) */}
      <div
        className="absolute top-[20%] start-[22%] sm:start-[26%] z-30 flex items-center gap-3.5 rounded-2xl bg-[#091C1A]/95 border border-white/25 p-2.5 pe-4 shadow-2xl backdrop-blur-2xl transition-all duration-700 animate-float-delayed"
        style={{
          transform: `translate(${mousePos.x * -22}px, ${mousePos.y * -14}px)`,
        }}
      >
        <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-white/30 shrink-0 shadow-md">
          <img
            src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=160&q=80"
            alt="قهوة"
            className="h-full w-full object-cover"
          />
          <span className="absolute bottom-0 end-0 bg-black/60 text-[9px] px-1 text-white font-bold">19:45</span>
        </div>
        <div className="flex flex-col text-start">
          <div className="flex items-center gap-1.5">
            <span className="grid h-5 w-5 place-items-center rounded-md bg-[#E4A23B]/20 text-[#E4A23B]">
              <Coffee className="h-3 w-3" />
            </span>
            <span className="text-xs font-black text-white">قهوة مختصة</span>
          </div>
          <span className="text-[10px] font-bold text-[#E4A23B] mt-0.5">حي الروضة · روقان</span>
        </div>
      </div>

      {/* Layer 3: DESTINATION MODULE 3 (ACTIVITY / فعالية وحركة - Mid Right) */}
      <div
        className="absolute top-[52%] end-[6%] sm:end-[10%] z-30 flex items-center gap-3.5 rounded-2xl bg-[#091C1A]/95 border border-white/25 p-2.5 pe-4 shadow-2xl backdrop-blur-2xl transition-all duration-700 animate-float"
        style={{
          transform: `translate(${mousePos.x * 20}px, ${mousePos.y * -20}px)`,
        }}
      >
        <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-white/30 shrink-0 shadow-md">
          <img
            src="https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=160&q=80"
            alt="فعالية"
            className="h-full w-full object-cover"
          />
          <span className="absolute bottom-0 end-0 bg-black/60 text-[9px] px-1 text-white font-bold">21:15</span>
        </div>
        <div className="flex flex-col text-start">
          <div className="flex items-center gap-1.5">
            <span className="grid h-5 w-5 place-items-center rounded-md bg-[#5EAAA5]/20 text-[#5EAAA5]">
              <Zap className="h-3 w-3" />
            </span>
            <span className="text-xs font-black text-white">فعالية وحركة</span>
          </div>
          <span className="text-[10px] font-bold text-[#5EAAA5] mt-0.5">كارتينج سينما · حماس</span>
        </div>
      </div>

      {/* Layer 3: DESTINATION MODULE 4 (SUNSET SEA / غروب البحر - Top Right) */}
      <div
        className="hidden sm:flex absolute top-[14%] end-[16%] sm:end-[20%] z-30 items-center gap-3.5 rounded-2xl bg-[#091C1A]/95 border border-white/25 p-2.5 pe-4 shadow-2xl backdrop-blur-2xl transition-all duration-700 animate-float-delayed"
        style={{
          transform: `translate(${mousePos.x * -16}px, ${mousePos.y * 16}px)`,
        }}
      >
        <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-white/30 shrink-0 shadow-md">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=160&q=80"
            alt="غروب"
            className="h-full w-full object-cover"
          />
          <span className="absolute bottom-0 end-0 bg-black/60 text-[9px] px-1 text-white font-bold">17:00</span>
        </div>
        <div className="flex flex-col text-start">
          <div className="flex items-center gap-1.5">
            <span className="grid h-5 w-5 place-items-center rounded-md bg-[#397C78]/20 text-[#5EAAA5]">
              <Waves className="h-3 w-3" />
            </span>
            <span className="text-xs font-black text-white">غروب البحر</span>
          </div>
          <span className="text-[10px] font-bold text-[#5EAAA5] mt-0.5">أبحر الشمالية · استجمام</span>
        </div>
      </div>

      {/* Layer 4: FLOATING EDITORIAL MICRO-BADGES */}
      <div
        className="absolute top-6 start-4 sm:top-10 sm:start-8 z-40 flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-xl border border-white/25 px-3.5 py-1.5 text-[11px] font-black text-white shadow-xl transition-transform duration-700 animate-float"
        style={{
          transform: `translate(${mousePos.x * 12}px, ${mousePos.y * 12}px)`,
        }}
      >
        <Star className="h-3.5 w-3.5 text-[#E4A23B] fill-[#E4A23B]" />
        <span>اختيار ذكي وسريع</span>
      </div>

      <div
        className="absolute bottom-6 end-4 sm:bottom-10 sm:end-8 z-40 flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-xl border border-white/25 px-3.5 py-1.5 text-[11px] font-black text-white shadow-xl transition-transform duration-700 animate-float-delayed"
        style={{
          transform: `translate(${mousePos.x * -14}px, ${mousePos.y * -14}px)`,
        }}
      >
        <Clock className="h-3.5 w-3.5 text-[#5EAAA5]" />
        <span>4.5h مسار متسلسل</span>
      </div>
    </div>
  );
}

// Export compatibility aliases
export { JeddawHeroExperience as JeddawHeroVisual };
