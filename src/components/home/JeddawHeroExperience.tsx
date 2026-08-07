import React, { useEffect, useRef, useState } from "react";
import { Compass, MapPin, Sparkles, Utensils, Coffee, Zap, Waves, Star, Clock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

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

  // ART-DIRECTED FLAGSHIP SPATIAL ROUTE ENVIRONMENT
  return (
    <div
      ref={containerRef}
      className="relative h-full w-full flex items-center justify-center p-2 sm:p-4 select-none pointer-events-none overflow-visible"
    >
      {/* LAYER 0: Ambient Atmospheric Glow Spotlights */}
      <div
        className="absolute h-[520px] w-[520px] rounded-full bg-radial from-[#C96745]/25 via-[#E4A23B]/15 to-transparent blur-3xl transition-transform duration-1000 ease-out"
        style={{
          transform: `translate(${mousePos.x * -25}px, ${mousePos.y * -25}px)`,
        }}
      />
      <div
        className="absolute bottom-10 start-10 h-72 w-72 rounded-full bg-[#397C78]/25 blur-3xl pointer-events-none"
        style={{
          transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`,
        }}
      />

      {/* LAYER 1: Abstract Red Sea Coastline & Layered Curved SVG Routes */}
      <svg
        className="absolute inset-0 h-full w-full z-0 pointer-events-none overflow-visible"
        viewBox="0 0 680 540"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Subtle Coastline Contour Lines */}
        <path
          d="M 50 500 Q 220 360, 330 270 T 640 70"
          stroke="#397C78"
          strokeWidth="1.5"
          strokeDasharray="6 12"
          className="opacity-25"
        />
        <path
          d="M 30 460 Q 200 320, 310 230 T 620 30"
          stroke="#C96745"
          strokeWidth="1"
          strokeDasharray="3 9"
          className="opacity-20"
        />

        {/* Primary Glowing Outing Path Connection */}
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

      {/* LAYER 2: CENTRAL BRAND ANCHOR HUB (📍 JEDDAW OUTING PIN) */}
      <div
        className="relative z-20 flex flex-col items-center justify-center text-center transition-transform duration-500 ease-out my-auto"
        style={{
          transform: `translate(${mousePos.x * 8}px, ${mousePos.y * 8}px)`,
        }}
      >
        {/* Layered Pulsing Rings */}
        <div className="absolute h-40 w-40 rounded-full border border-[#C96745]/30 animate-ping opacity-20" />
        <div className="absolute h-32 w-32 rounded-full border border-white/20 animate-pulse opacity-40" />
        <div className="absolute h-28 w-28 rounded-full bg-gradient-to-r from-[#C96745]/30 to-[#397C78]/30 blur-xl" />

        {/* Central Branded Marker Hub */}
        <div className="relative grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-[#C96745] via-[#E4A23B] to-[#397C78] text-white shadow-2xl border-2 border-white/40 ring-8 ring-[#C96745]/20 backdrop-blur-2xl">
          <MapPin className="h-10 w-10 text-white drop-shadow-lg animate-bounce-gentle" />
          <span className="absolute -bottom-1 grid h-5 w-5 place-items-center rounded-full bg-white text-[#C96745] shadow-md">
            <Sparkles className="h-3 w-3" />
          </span>
        </div>

        {/* Branded Hub Label Capsule */}
        <div className="mt-3.5 flex items-center gap-2 rounded-full bg-[#051413]/95 px-4.5 py-1.5 border border-white/25 shadow-2xl backdrop-blur-2xl">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-black text-white tracking-wider">
            {isRtl ? "خطتك الموزونة 📍" : "Your Curated Route 📍"}
          </span>
        </div>
      </div>

      {/* LAYER 3: DESTINATION MODULE 1 (DINING / عشاء فاخر - Bottom Left) */}
      <div
        className="absolute top-[64%] start-[4%] sm:start-[8%] z-30 flex items-center gap-3.5 rounded-2xl bg-[#091C1A]/95 border border-white/25 p-2.5 pe-4 shadow-2xl backdrop-blur-2xl transition-all duration-700 animate-float"
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
          <span className="absolute bottom-0 end-0 bg-black/70 text-[9px] px-1 text-white font-bold">17:30</span>
        </div>
        <div className="flex flex-col text-start">
          <div className="flex items-center gap-1.5">
            <span className="grid h-5 w-5 place-items-center rounded-md bg-[#C96745]/20 text-[#FF9D7A]">
              <Utensils className="h-3 w-3" />
            </span>
            <span className="text-xs font-black text-white">
              {isRtl ? "عشاء فاخر" : "Fine Dining"}
            </span>
          </div>
          <span className="text-[10px] font-bold text-[#FF9D7A] mt-0.5">
            {isRtl ? "الكورنيش · مأكولات بحرية" : "Corniche · Seafood"}
          </span>
        </div>
      </div>

      {/* LAYER 3: DESTINATION MODULE 2 (COFFEE / قهوة مختصة - Top Left) */}
      <div
        className="absolute top-[18%] start-[20%] sm:start-[24%] z-30 flex items-center gap-3.5 rounded-2xl bg-[#091C1A]/95 border border-white/25 p-2.5 pe-4 shadow-2xl backdrop-blur-2xl transition-all duration-700 animate-float-delayed"
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
          <span className="absolute bottom-0 end-0 bg-black/70 text-[9px] px-1 text-white font-bold">19:45</span>
        </div>
        <div className="flex flex-col text-start">
          <div className="flex items-center gap-1.5">
            <span className="grid h-5 w-5 place-items-center rounded-md bg-[#E4A23B]/20 text-[#E4A23B]">
              <Coffee className="h-3 w-3" />
            </span>
            <span className="text-xs font-black text-white">
              {isRtl ? "قهوة مختصة" : "Specialty Coffee"}
            </span>
          </div>
          <span className="text-[10px] font-bold text-[#E4A23B] mt-0.5">
            {isRtl ? "حي الروضة · روقان" : "Al Rawdah · Relaxing"}
          </span>
        </div>
      </div>

      {/* LAYER 3: DESTINATION MODULE 3 (ACTIVITY / فعالية وحركة - Mid Right) */}
      <div
        className="absolute top-[50%] end-[5%] sm:end-[9%] z-30 flex items-center gap-3.5 rounded-2xl bg-[#091C1A]/95 border border-white/25 p-2.5 pe-4 shadow-2xl backdrop-blur-2xl transition-all duration-700 animate-float"
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
          <span className="absolute bottom-0 end-0 bg-black/70 text-[9px] px-1 text-white font-bold">21:15</span>
        </div>
        <div className="flex flex-col text-start">
          <div className="flex items-center gap-1.5">
            <span className="grid h-5 w-5 place-items-center rounded-md bg-[#5EAAA5]/20 text-[#5EAAA5]">
              <Zap className="h-3 w-3" />
            </span>
            <span className="text-xs font-black text-white">
              {isRtl ? "فعالية وحركة" : "Activities & Action"}
            </span>
          </div>
          <span className="text-[10px] font-bold text-[#5EAAA5] mt-0.5">
            {isRtl ? "كارتينج سينما · حماس" : "Karting & Cinema"}
          </span>
        </div>
      </div>

      {/* LAYER 3: DESTINATION MODULE 4 (SUNSET SEA / غروب البحر - Top Right) */}
      <div
        className="hidden sm:flex absolute top-[12%] end-[14%] sm:end-[18%] z-30 items-center gap-3.5 rounded-2xl bg-[#091C1A]/95 border border-white/25 p-2.5 pe-4 shadow-2xl backdrop-blur-2xl transition-all duration-700 animate-float-delayed"
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
          <span className="absolute bottom-0 end-0 bg-black/70 text-[9px] px-1 text-white font-bold">17:00</span>
        </div>
        <div className="flex flex-col text-start">
          <div className="flex items-center gap-1.5">
            <span className="grid h-5 w-5 place-items-center rounded-md bg-[#397C78]/20 text-[#5EAAA5]">
              <Waves className="h-3 w-3" />
            </span>
            <span className="text-xs font-black text-white">
              {isRtl ? "غروب البحر" : "Red Sea Sunset"}
            </span>
          </div>
          <span className="text-[10px] font-bold text-[#5EAAA5] mt-0.5">
            {isRtl ? "أبحر الشمالية · استجمام" : "North Obhur · Beach"}
          </span>
        </div>
      </div>

      {/* LAYER 4: EDITORIAL FLOATING CAPSULES */}
      <div
        className="absolute top-6 start-4 sm:top-8 sm:start-6 z-40 flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-2xl border border-white/25 px-3.5 py-1.5 text-[11px] font-black text-white shadow-2xl transition-transform duration-700 animate-float"
        style={{
          transform: `translate(${mousePos.x * 12}px, ${mousePos.y * 12}px)`,
        }}
      >
        <Star className="h-3.5 w-3.5 text-[#E4A23B] fill-[#E4A23B]" />
        <span>{isRtl ? "اختيار ذكي وسريع" : "Smart & Fast Pick"}</span>
      </div>

      <div
        className="absolute bottom-6 end-4 sm:bottom-8 sm:end-6 z-40 flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-2xl border border-white/25 px-3.5 py-1.5 text-[11px] font-black text-white shadow-2xl transition-transform duration-700 animate-float-delayed"
        style={{
          transform: `translate(${mousePos.x * -14}px, ${mousePos.y * -14}px)`,
        }}
      >
        <Clock className="h-3.5 w-3.5 text-[#5EAAA5]" />
        <span>{isRtl ? "4.5h مسار متسلسل" : "4.5h Curated Itinerary"}</span>
      </div>
    </div>
  );
}

// Export compatibility aliases
export { JeddawHeroExperience as JeddawHeroVisual };
