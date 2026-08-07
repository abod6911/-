import React, { useEffect, useRef, useState } from "react";
import { Compass, MapPin, Sparkles, Utensils, Coffee, Zap, Waves, Star, Clock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { HeroPlannerState } from "./HeroQuickPlanner";

/**
 * SPLINE 3D SCENE CONFIGURATION
 * Paste your Spline 3D Scene URL here when available.
 * Example: "https://prod.spline.design/your-scene-id/scene.splinecode"
 */
export const SPLINE_SCENE_URL: string = "";

export type HeroExperienceState = "idle" | "generating" | "success";

interface JeddawHeroExperienceProps {
  state?: HeroExperienceState;
  plannerState?: HeroPlannerState;
}

export function JeddawHeroExperience({
  state = "idle",
  plannerState = { group: "friends", mood: "food", time: "4h", budget: "medium" },
}: JeddawHeroExperienceProps) {
  const { isRtl } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [splineError, setSplineError] = useState(false);

  // Damped pointer parallax for depth
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
      currentX += (targetX - currentX) * 0.04;
      currentY += (targetY - currentY) * 0.04;
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

  // Compute dynamic live route preview string based on interactive selections
  const getDynamicRoutePreview = () => {
    const { mood } = plannerState;
    if (mood === "sea") {
      return isRtl
        ? "غروب أبحر 🌅 ← مأكولات شاطئية 🍽️ ← روقان بحري 🌊"
        : "Obhur Sunset 🌅 → Beach Dining 🍽️ → Seaside Calm 🌊";
    }
    if (mood === "coffee") {
      return isRtl
        ? "كافيه روقان ☕ ← حلا حجازي 🍮 ← جلسة مطلة 🌆"
        : "Relaxing Cafe ☕ → Hijazi Dessert 🍮 → Scenic View 🌆";
    }
    if (mood === "games") {
      return isRtl
        ? "كارتينج حماس 🏎️ ← سينما 🎬 ← عشاء شبابي 🍔"
        : "Karting Action 🏎️ → Cinema 🎬 → Late Burger 🍔";
    }
    if (mood === "trend") {
      return isRtl
        ? "ترند الأسبوع 🔥 ← قهوة مختصة ☕ ← عشاء راقي 🍷"
        : "Weekly Trend 🔥 → Craft Coffee ☕ → Fine Dining 🍷";
    }
    // Default Food
    return isRtl
      ? "عشاء بحري 🍽️ ← قهوة مختصة ☕ ← جولة كورنيش 🌊"
      : "Seafood Dinner 🍽️ → Specialty Coffee ☕ → Corniche Walk 🌊";
  };

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

  // ART-DIRECTED SPATIAL ROUTE ENVIRONMENT WITH LIVE INTERACTIVE PREVIEW
  return (
    <div
      ref={containerRef}
      className="relative h-full w-full flex items-center justify-center p-2 sm:p-4 select-none pointer-events-none overflow-visible"
    >
      {/* LAYER 0: Ambient Atmospheric Glow Spotlights */}
      <div
        className="absolute h-[500px] w-[500px] rounded-full bg-radial from-[#C96745]/25 via-[#E4A23B]/15 to-transparent blur-3xl transition-transform duration-1000 ease-out"
        style={{
          transform: `translate(${mousePos.x * -25}px, ${mousePos.y * -25}px)`,
        }}
      />

      {/* LAYER 1: SVG Curved Route Lines */}
      <svg
        className="absolute inset-0 h-full w-full z-0 pointer-events-none overflow-visible"
        viewBox="0 0 680 540"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 50 500 Q 220 360, 330 270 T 640 70"
          stroke="#397C78"
          strokeWidth="1.5"
          strokeDasharray="6 12"
          className="opacity-25"
        />
        <path
          d="M 120 380 C 190 240, 300 360, 380 200 C 450 120, 540 160, 580 80"
          stroke="url(#jeddawArtRouteGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          className="animate-route-draw drop-shadow-[0_0_20px_rgba(201,103,69,0.55)]"
        />
        <defs>
          <linearGradient id="jeddawArtRouteGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C96745" />
            <stop offset="35%" stopColor="#E4A23B" />
            <stop offset="70%" stopColor="#5EAAA5" />
            <stop offset="100%" stopColor="#397C78" />
          </linearGradient>
        </defs>
      </svg>

      {/* LAYER 2: CENTRAL BRAND ANCHOR HUB */}
      <div
        className="relative z-20 flex flex-col items-center justify-center text-center transition-transform duration-500 ease-out my-auto"
        style={{
          transform: `translate(${mousePos.x * 8}px, ${mousePos.y * 8}px)`,
        }}
      >
        {/* Pulsing Outer Rings */}
        <div className="absolute h-36 w-36 rounded-full border border-[#C96745]/30 animate-ping opacity-20" />
        <div className="absolute h-28 w-28 rounded-full bg-gradient-to-r from-[#C96745]/30 to-[#397C78]/30 blur-xl" />

        {/* Central Branded Marker Hub */}
        <div className="relative grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-[#C96745] via-[#E4A23B] to-[#397C78] text-white shadow-2xl border-2 border-white/40 ring-8 ring-[#C96745]/20 backdrop-blur-2xl">
          <MapPin className="h-10 w-10 text-white drop-shadow-lg animate-bounce-gentle" />
          <span className="absolute -bottom-1 grid h-5 w-5 place-items-center rounded-full bg-white text-[#C96745] shadow-md">
            <Sparkles className="h-3 w-3" />
          </span>
        </div>

        {/* Central Hub Label Capsule */}
        <div className="mt-3.5 flex items-center gap-2 rounded-full bg-[#051413]/95 px-4.5 py-1.5 border border-white/25 shadow-2xl backdrop-blur-2xl">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-black text-white tracking-wider">
            {isRtl ? "خطتك الموزونة 📍" : "Your Curated Route 📍"}
          </span>
        </div>
      </div>

      {/* LAYER 3: LIVE INTERACTIVE PREVIEW CARD OVERLAY */}
      <div
        className="absolute bottom-4 start-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md rounded-2xl bg-[#091C1A]/95 border border-white/30 p-3 shadow-2xl backdrop-blur-2xl transition-all duration-300 animate-fade-in text-center"
        style={{
          transform: `translate(-50%, ${mousePos.y * -10}px)`,
        }}
      >
        <div className="flex items-center justify-between text-[10px] font-black text-[#FF9D7A] mb-1">
          <span className="flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-[#E4A23B]" />
            {isRtl ? "اقتراح سريع حسب اختيارك" : "Quick idea based on your picks"}
          </span>
          <span className="bg-white/10 px-2 py-0.5 rounded-full text-white/90">
            {plannerState.time === "2h" ? "2h" : plannerState.time === "4h" ? "4h" : "Evening"}
          </span>
        </div>
        <p className="text-xs font-black text-white tracking-tight leading-snug dir-auto">
          {getDynamicRoutePreview()}
        </p>
      </div>

      {/* LAYER 4: FLOATING DESTINATION MODULES */}
      {/* 1. Dining Module */}
      <div
        className="absolute top-[62%] start-[4%] sm:start-[8%] z-30 flex items-center gap-3 rounded-2xl bg-[#091C1A]/95 border border-white/25 p-2 pe-3.5 shadow-2xl backdrop-blur-2xl transition-all duration-700 animate-float"
        style={{
          transform: `translate(${mousePos.x * 18}px, ${mousePos.y * 18}px)`,
        }}
      >
        <div className="relative h-10 w-10 rounded-xl overflow-hidden border border-white/30 shrink-0 shadow-md">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=160&q=80"
            alt="عشاء"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col text-start">
          <span className="text-xs font-black text-white">{isRtl ? "عشاء فاخر" : "Fine Dining"}</span>
          <span className="text-[10px] font-bold text-[#FF9D7A]">{isRtl ? "الكورنيش · بحري" : "Corniche · Seafood"}</span>
        </div>
      </div>

      {/* 2. Coffee Module */}
      <div
        className="absolute top-[18%] start-[20%] sm:start-[24%] z-30 flex items-center gap-3 rounded-2xl bg-[#091C1A]/95 border border-white/25 p-2 pe-3.5 shadow-2xl backdrop-blur-2xl transition-all duration-700 animate-float-delayed"
        style={{
          transform: `translate(${mousePos.x * -22}px, ${mousePos.y * -14}px)`,
        }}
      >
        <div className="relative h-10 w-10 rounded-xl overflow-hidden border border-white/30 shrink-0 shadow-md">
          <img
            src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=160&q=80"
            alt="قهوة"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col text-start">
          <span className="text-xs font-black text-white">{isRtl ? "قهوة مختصة" : "Specialty Coffee"}</span>
          <span className="text-[10px] font-bold text-[#E4A23B]">{isRtl ? "الروضة · روقان" : "Rawdah · Relaxing"}</span>
        </div>
      </div>

      {/* 3. Sunset Module */}
      <div
        className="hidden sm:flex absolute top-[14%] end-[14%] sm:end-[18%] z-30 items-center gap-3 rounded-2xl bg-[#091C1A]/95 border border-white/25 p-2 pe-3.5 shadow-2xl backdrop-blur-2xl transition-all duration-700 animate-float-delayed"
        style={{
          transform: `translate(${mousePos.x * -16}px, ${mousePos.y * 16}px)`,
        }}
      >
        <div className="relative h-10 w-10 rounded-xl overflow-hidden border border-white/30 shrink-0 shadow-md">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=160&q=80"
            alt="غروب"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col text-start">
          <span className="text-xs font-black text-white">{isRtl ? "غروب البحر" : "Red Sea Sunset"}</span>
          <span className="text-[10px] font-bold text-[#5EAAA5]">{isRtl ? "أبحر · شاطئ" : "Obhur · Beach"}</span>
        </div>
      </div>
    </div>
  );
}

// Export compatibility aliases
export { JeddawHeroExperience as JeddawHeroVisual };
