import React, { useEffect, useRef, useState, useCallback } from "react";
import { MapPin, Sparkles, Utensils, Coffee, Waves, Landmark, Flame, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

/**
 * SPLINE 3D SCENE CONFIGURATION
 * Paste your Spline 3D Scene URL here when available.
 * Example: "https://prod.spline.design/your-scene-id/scene.splinecode"
 */
export const SPLINE_SCENE_URL: string = "";

export type HeroExperienceState = "idle" | "generating" | "success";

/* ──────────────────────────────────────────────────────────────
   DISCOVERY HOTSPOT DATA
   ────────────────────────────────────────────────────────────── */

interface DiscoveryHotspot {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  labelAr: string;
  labelEn: string;
  captionAr: string;
  captionEn: string;
  detailAr: string;
  detailEn: string;
  accentColor: string;
  accentBg: string;
  image: string;
  position: { top: string; left: string };
  parallaxMultiplier: { x: number; y: number };
}

const hotspots: DiscoveryHotspot[] = [
  {
    id: "sea",
    icon: Waves,
    labelAr: "البحر الأحمر",
    labelEn: "Red Sea",
    captionAr: "غروب · كورنيش · استجمام",
    captionEn: "Sunset · Corniche · Beach",
    detailAr: "من أبحر الشمالية إلى الكورنيش الجنوبي، البحر هو روح جدة.",
    detailEn: "From North Obhur to the Southern Corniche, the sea is Jeddah's soul.",
    accentColor: "#5EAAA5",
    accentBg: "rgba(94, 170, 165, 0.15)",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=480&q=80",
    position: { top: "12%", left: "72%" },
    parallaxMultiplier: { x: -18, y: 14 },
  },
  {
    id: "coffee",
    icon: Coffee,
    labelAr: "قهوة مختصة",
    labelEn: "Specialty Coffee",
    captionAr: "روقان · حي الروضة · طعم",
    captionEn: "Chill · Al Rawdah · Flavor",
    detailAr: "محمصات ومقاهي مختصة تعكس ثقافة القهوة الجداوية.",
    detailEn: "Roasteries and specialty cafes reflecting Jeddah's coffee culture.",
    accentColor: "#E4A23B",
    accentBg: "rgba(228, 162, 59, 0.15)",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=480&q=80",
    position: { top: "48%", left: "16%" },
    parallaxMultiplier: { x: 18, y: 14 },
  },
  {
    id: "balad",
    icon: Landmark,
    labelAr: "البلد التاريخية",
    labelEn: "Historic Al-Balad",
    captionAr: "تراث · رواشين · فن",
    captionEn: "Heritage · Rawasheen · Art",
    detailAr: "أزقة التاريخ، رواشين الحجاز، وعبق الماضي في قلب جدة.",
    detailEn: "Historic alleys, Hejazi architecture, and old-world charm in Jeddah's heart.",
    accentColor: "#C96745",
    accentBg: "rgba(201, 103, 69, 0.15)",
    image: "https://images.unsplash.com/photo-1578895101408-1a36b834405b?auto=format&fit=crop&w=480&q=80",
    position: { top: "24%", left: "18%" },
    parallaxMultiplier: { x: -14, y: -18 },
  },
  {
    id: "food",
    icon: Utensils,
    labelAr: "مطاعم جدة",
    labelEn: "Jeddah Dining",
    captionAr: "بحري · شامي · عالمي",
    captionEn: "Seafood · Levantine · Global",
    detailAr: "من المأكولات البحرية على الكورنيش إلى المطابخ العالمية.",
    detailEn: "From Corniche seafood to world-class international kitchens.",
    accentColor: "#FF9D7A",
    accentBg: "rgba(255, 157, 122, 0.15)",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=480&q=80",
    position: { top: "68%", left: "65%" },
    parallaxMultiplier: { x: 16, y: -14 },
  },
  {
    id: "activities",
    icon: Flame,
    labelAr: "فعاليات وحركة",
    labelEn: "Action & Fun",
    captionAr: "كارتينج · سينما · ألعاب",
    captionEn: "Karting · Cinema · Games",
    detailAr: "ترفيه وإثارة لكل الأعمار — من الكارتينج إلى الواقع الافتراضي.",
    detailEn: "Thrills for all ages — from karting to VR experiences.",
    accentColor: "#B84E4E",
    accentBg: "rgba(184, 78, 78, 0.15)",
    image: "https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=480&q=80",
    position: { top: "42%", left: "82%" },
    parallaxMultiplier: { x: -22, y: -10 },
  },
];

/* ──────────────────────────────────────────────────────────────
   MAIN COMPONENT
   ────────────────────────────────────────────────────────────── */

interface JeddawHeroExperienceProps {
  state?: HeroExperienceState;
}

export function JeddawHeroExperience({ state = "idle" }: JeddawHeroExperienceProps) {
  const { isRtl } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [splineError, setSplineError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Entrance animation trigger
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Damped pointer parallax for depth (Desktop fine-pointer only)
  useEffect(() => {
    // Disable RAF parallax on mobile coarse touchscreens or reduced motion
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isCoarse || isReducedMotion) return;

    let animationFrameId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let isIntersecting = true;

    // IntersectionObserver to pause RAF when offscreen
    const observer = new IntersectionObserver(([entry]) => {
      isIntersecting = entry?.isIntersecting ?? true;
    }, { threshold: 0.1 });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !isIntersecting) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      targetX = (e.clientX - centerX) / (rect.width / 2);
      targetY = (e.clientY - centerY) / (rect.height / 2);
    };

    const updateParallax = () => {
      if (isIntersecting && document.visibilityState === "visible" && document.documentElement.dataset.keyboardOpen !== "true") {
        currentX += (targetX - currentX) * 0.035;
        currentY += (targetY - currentY) * 0.035;
        setMousePos({
          x: Math.max(-1, Math.min(1, currentX)),
          y: Math.max(-1, Math.min(1, currentY)),
        });
      }
      animationFrameId = requestAnimationFrame(updateParallax);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animationFrameId = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, []);

  // Auto-cycle hotspots when idle
  useEffect(() => {
    if (activeHotspot) return;
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % hotspots.length;
      setActiveHotspot(hotspots[idx]!.id);
      setTimeout(() => setActiveHotspot(null), 2800);
    }, 4200);
    return () => clearInterval(interval);
  }, [activeHotspot]);

  const handleHotspotEnter = useCallback((id: string) => {
    setActiveHotspot(id);
  }, []);

  const handleHotspotLeave = useCallback(() => {
    setActiveHotspot(null);
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

  const activeData = hotspots.find((h) => h.id === activeHotspot);

  /* ── LIVING JEDDAH — CINEMATIC VISUAL COMPOSITION ── */
  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full flex items-center justify-center select-none overflow-visible transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      {/* ═══════════════════════════════════════════════════
          LAYER 0 — ATMOSPHERIC DEPTH GRADIENTS
          ═══════════════════════════════════════════════════ */}
      
      {/* Primary warm glow — follows mouse */}
      <div
        className="absolute h-[600px] w-[600px] rounded-full bg-radial from-[#C96745]/20 via-[#E4A23B]/10 to-transparent blur-[100px] pointer-events-none animate-horizon-glow"
        style={{
          top: "10%",
          left: "30%",
          transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -25}px)`,
        }}
      />
      
      {/* Cool teal counter-glow */}
      <div
        className="absolute h-[450px] w-[450px] rounded-full bg-radial from-[#397C78]/25 via-[#5EAAA5]/10 to-transparent blur-[80px] pointer-events-none"
        style={{
          bottom: "5%",
          right: "15%",
          transform: `translate(${mousePos.x * 22}px, ${mousePos.y * 18}px)`,
        }}
      />

      {/* Subtle golden accent */}
      <div
        className="absolute h-[200px] w-[200px] rounded-full bg-[#E4A23B]/12 blur-[60px] pointer-events-none animate-horizon-glow"
        style={{
          top: "55%",
          left: "55%",
          animationDelay: "2s",
        }}
      />

      {/* ═══════════════════════════════════════════════════
          LAYER 1 — JEDDAH COASTLINE CONTOURS
          Abstract SVG representing the Red Sea coast
          ═══════════════════════════════════════════════════ */}
      <svg
        className="absolute inset-0 h-full w-full z-[1] pointer-events-none overflow-visible"
        viewBox="0 0 700 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          transform: `translate(${mousePos.x * 4}px, ${mousePos.y * 3}px)`,
        }}
      >
        <defs>
          <linearGradient id="livingRouteGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C96745" stopOpacity="0.8" />
            <stop offset="30%" stopColor="#E4A23B" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#5EAAA5" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#397C78" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="coastGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#397C78" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#397C78" stopOpacity="0.05" />
          </linearGradient>
          <filter id="routeGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer coastline contour — very subtle */}
        <path
          d="M 20 520 Q 120 420, 200 380 C 280 340, 320 290, 380 240 Q 440 190, 520 140 T 680 40"
          stroke="url(#coastGrad1)"
          strokeWidth="1.2"
          strokeDasharray="4 10"
          className="animate-coastline-drift"
        />
        
        {/* Inner coastline contour */}
        <path
          d="M 40 490 Q 140 390, 220 350 C 300 310, 340 260, 400 210 Q 460 160, 540 110 T 670 20"
          stroke="#397C78"
          strokeWidth="0.8"
          strokeDasharray="3 8"
          className="opacity-20"
          style={{ animationDelay: "1s" }}
        />

        {/* Primary animated route — the "plan path" */}
        <path
          d="M 90 440 C 160 360, 220 380, 280 300 C 340 220, 380 260, 440 180 C 500 100, 560 140, 620 70"
          stroke="url(#livingRouteGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#routeGlow)"
          className="animate-route-draw"
          style={{ strokeDasharray: "8 6" }}
        />

        {/* Secondary route echo — fainter */}
        <path
          d="M 110 460 C 180 380, 240 400, 300 320 C 360 240, 400 280, 460 200 C 520 120, 580 160, 640 90"
          stroke="#C96745"
          strokeWidth="0.6"
          strokeDasharray="2 6"
          className="opacity-15"
        />

        {/* Hotspot connection dots along route */}
        {[
          { cx: 90, cy: 440 },
          { cx: 280, cy: 300 },
          { cx: 440, cy: 180 },
          { cx: 620, cy: 70 },
        ].map((dot, i) => (
          <g key={i}>
            <circle
              cx={dot.cx}
              cy={dot.cy}
              r="3"
              fill="#C96745"
              opacity="0.5"
              className="animate-pulse"
              style={{ animationDelay: `${i * 0.6}s` }}
            />
            <circle
              cx={dot.cx}
              cy={dot.cy}
              r="8"
              fill="none"
              stroke="#C96745"
              strokeWidth="0.5"
              opacity="0.25"
              className="animate-ping"
              style={{ animationDelay: `${i * 0.6}s` }}
            />
          </g>
        ))}
      </svg>

      {/* ═══════════════════════════════════════════════════
          LAYER 2 — CENTRAL BRAND ANCHOR
          The "JEDDAW pin" at the conceptual center
          ═══════════════════════════════════════════════════ */}
      <div
        className="relative z-20 flex flex-col items-center justify-center transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${mousePos.x * 6}px, ${mousePos.y * 6}px)`,
        }}
      >
        {/* Outer ring pulse */}
        <div className="absolute h-36 w-36 rounded-full border border-[#C96745]/20 animate-ping opacity-15" style={{ animationDuration: "3s" }} />
        <div className="absolute h-28 w-28 rounded-full border border-white/10 animate-pulse opacity-30" style={{ animationDuration: "2.5s" }} />
        <div className="absolute h-24 w-24 rounded-full bg-gradient-to-br from-[#C96745]/15 to-[#397C78]/15 blur-2xl" />

        {/* The pin itself */}
        <div className="relative grid h-[72px] w-[72px] place-items-center rounded-[22px] bg-gradient-to-br from-[#C96745] via-[#D47855] to-[#E4A23B] text-white shadow-[0_8px_40px_-8px_rgba(201,103,69,0.6)] border border-white/30 ring-[6px] ring-[#C96745]/15">
          <MapPin className="h-8 w-8 text-white drop-shadow-md" />
          <span className="absolute -bottom-1.5 grid h-5 w-5 place-items-center rounded-full bg-white text-[#C96745] shadow-lg ring-2 ring-white/50">
            <Sparkles className="h-3 w-3" />
          </span>
        </div>

        {/* Label capsule below pin */}
        <div className="mt-4 flex items-center gap-2 rounded-full bg-[#051413]/90 px-4 py-1.5 border border-white/20 shadow-xl backdrop-blur-xl">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-extrabold text-white/90 tracking-wide">
            {isRtl ? "خطتك تبدأ هنا" : "Your plan starts here"}
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          LAYER 3 — DISCOVERY HOTSPOTS
          5 elegant interactive nodes around the map
          ═══════════════════════════════════════════════════ */}
      {hotspots.map((spot, index) => {
        const isActive = activeHotspot === spot.id;
        const Icon = spot.icon;

        return (
          <div
            key={spot.id}
            className="absolute z-30 group pointer-events-auto"
            style={{
              top: spot.position.top,
              left: spot.position.left,
              transform: `translate(${mousePos.x * spot.parallaxMultiplier.x}px, ${mousePos.y * spot.parallaxMultiplier.y}px)`,
              transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
              animationDelay: `${index * 0.15}s`,
            }}
            onMouseEnter={() => handleHotspotEnter(spot.id)}
            onMouseLeave={handleHotspotLeave}
          >
            {/* Hotspot node (dot) */}
            <div
              className={`relative flex items-center justify-center transition-all duration-500 cursor-pointer ${
                isActive ? "scale-110" : "scale-100 hover:scale-105"
              }`}
            >
              {/* Glow ring */}
              <div
                className={`absolute rounded-full transition-all duration-700 ${
                  isActive
                    ? "h-16 w-16 opacity-100"
                    : "h-12 w-12 opacity-40"
                }`}
                style={{
                  background: `radial-gradient(circle, ${spot.accentBg} 0%, transparent 70%)`,
                }}
              />

              {/* Icon circle */}
              <div
                className={`relative grid place-items-center rounded-2xl border backdrop-blur-xl transition-all duration-500 shadow-lg ${
                  isActive
                    ? "h-12 w-12 border-white/40 bg-[#091C1A]/95"
                    : "h-10 w-10 border-white/20 bg-[#091C1A]/80"
                }`}
              >
                <Icon
                  className="h-4.5 w-4.5 transition-colors duration-300"
                  style={{ color: spot.accentColor }}
                />
              </div>

              {/* Label pill — shows on hover/active */}
              <div
                className={`absolute top-full mt-2 whitespace-nowrap transition-all duration-400 ${
                  isActive
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 translate-y-2 pointer-events-none"
                }`}
              >
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-extrabold text-white border border-white/15 backdrop-blur-xl shadow-xl"
                  style={{ backgroundColor: "rgba(9, 28, 26, 0.95)" }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: spot.accentColor }}
                  />
                  {isRtl ? spot.labelAr : spot.labelEn}
                </span>
              </div>
            </div>
          </div>
        );
      })}

      {/* ═══════════════════════════════════════════════════
          LAYER 4 — EDITORIAL REVEAL CARD
          Shows detail when a hotspot is active
          ═══════════════════════════════════════════════════ */}
      <div
        className={`absolute z-40 transition-all duration-600 ${
          isRtl ? "left-4 sm:left-6" : "right-4 sm:right-6"
        } bottom-6 sm:bottom-8 ${
          activeData
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-4 scale-95 pointer-events-none"
        }`}
      >
        {activeData && (
          <div className="flex items-stretch gap-0 rounded-2xl bg-[#091C1A]/95 border border-white/20 shadow-2xl backdrop-blur-2xl overflow-hidden max-w-[280px]">
            {/* Image thumbnail */}
            <div className="relative w-[72px] shrink-0 overflow-hidden">
              <img
                src={activeData.image}
                alt={isRtl ? activeData.labelAr : activeData.labelEn}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#091C1A]/60" />
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center px-3.5 py-3 text-start min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span
                  className="h-1.5 w-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: activeData.accentColor }}
                />
                <span className="text-xs font-black text-white truncate">
                  {isRtl ? activeData.labelAr : activeData.labelEn}
                </span>
              </div>
              <span
                className="text-[10px] font-bold leading-relaxed"
                style={{ color: activeData.accentColor }}
              >
                {isRtl ? activeData.captionAr : activeData.captionEn}
              </span>
              <p className="text-[9px] font-semibold text-white/55 mt-1 leading-snug line-clamp-2">
                {isRtl ? activeData.detailAr : activeData.detailEn}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════
          LAYER 5 — FLOATING EDITORIAL BADGES
          ═══════════════════════════════════════════════════ */}

      {/* Top badge — Brand intelligence */}
      <div
        className="absolute top-4 start-3 sm:top-6 sm:start-5 z-40 flex items-center gap-2 rounded-full bg-[#091C1A]/85 backdrop-blur-xl border border-white/15 px-3.5 py-1.5 shadow-xl animate-float-gentle"
        style={{
          transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 10}px)`,
        }}
      >
        <Sparkles className="h-3 w-3 text-[#E4A23B] shrink-0" />
        <span className="text-[10px] font-extrabold text-white/85 tracking-wide">
          {isRtl ? "اكتشاف ذكي" : "Smart Discovery"}
        </span>
      </div>

      {/* Bottom badge — Route indicator */}
      <div
        className="absolute bottom-3 start-3 sm:bottom-4 sm:start-4 z-30 flex items-center gap-2 rounded-full bg-[#091C1A]/90 backdrop-blur-xl border border-white/20 px-3 py-1.5 shadow-xl animate-float-delayed pointer-events-none"
        style={{
          transform: `translate(${mousePos.x * -10}px, ${mousePos.y * -6}px)`,
        }}
      >
        <MapPin className="h-3 w-3 text-[#5EAAA5] shrink-0" />
        <span className="text-[10px] font-extrabold text-white/90 tracking-wide">
          {isRtl ? "مسارات استكشاف جدة" : "Jeddah Outing Routes"}
        </span>
      </div>

      {/* Hotspot count indicator — top right area */}
      <div
        className="hidden sm:flex absolute top-4 end-3 sm:top-6 sm:end-5 z-40 items-center gap-1.5 rounded-full bg-[#091C1A]/85 backdrop-blur-xl border border-white/15 px-3 py-1 shadow-xl"
        style={{
          transform: `translate(${mousePos.x * -8}px, ${mousePos.y * 6}px)`,
        }}
      >
        {hotspots.map((h) => (
          <span
            key={h.id}
            className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
              activeHotspot === h.id ? "scale-150" : "scale-100 opacity-50"
            }`}
            style={{ backgroundColor: h.accentColor }}
          />
        ))}
      </div>
    </div>
  );
}

// Export compatibility aliases
export { JeddawHeroExperience as JeddawHeroVisual };
