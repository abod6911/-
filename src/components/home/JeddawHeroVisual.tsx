import React, { useEffect, useRef, useState } from "react";
import { Clock, Compass, MapPin, Sparkles, Star } from "lucide-react";

/**
 * SPLINE 3D SCENE CONFIGURATION
 * Paste your Spline 3D Scene URL here when available.
 * Example: "https://prod.spline.design/your-scene-id/scene.splinecode"
 */
export const SPLINE_SCENE_URL: string = "";

interface OutingStation {
  id: string;
  num: number;
  time: string;
  titleAr: string;
  districtAr: string;
  categoryAr: string;
  emoji: string;
  gradient: string;
}

const featuredStations: OutingStation[] = [
  {
    id: "s1",
    num: 1,
    time: "17:30",
    titleAr: "غوص وغروب الكورنيش",
    districtAr: "الكورنيش الشمالي",
    categoryAr: "بحر واستجمام",
    emoji: "🌊",
    gradient: "from-[#2B7A88]/80 to-[#397C78]/90",
  },
  {
    id: "s2",
    num: 2,
    time: "19:45",
    titleAr: "عشاء أرميني فاخر",
    districtAr: "حي الروضة",
    categoryAr: "مطاعم راقية",
    emoji: "🍽️",
    gradient: "from-[#C96745]/80 to-[#B84E4E]/90",
  },
  {
    id: "s3",
    num: 3,
    time: "21:30",
    titleAr: "قهوة مختصة بروف البلد",
    districtAr: "جدة التاريخية",
    categoryAr: "روقان وقهوة",
    emoji: "☕",
    gradient: "from-[#E4A23B]/80 to-[#C96745]/90",
  },
];

export function JeddawHeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeStation, setActiveStation] = useState<number>(0);
  const [splineError, setSplineError] = useState(false);

  // Smooth pointer parallax
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
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
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

  // Auto cycle active station highlight
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStation((prev) => (prev + 1) % featuredStations.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  // If a Spline URL is specified, render the Spline viewer
  if (SPLINE_SCENE_URL && !splineError) {
    return (
      <div className="relative h-full w-full overflow-hidden flex items-center justify-center">
        <iframe
          src={SPLINE_SCENE_URL}
          title="JEDDAW 3D Scene"
          className="h-full w-full border-0 bg-transparent"
          onError={() => setSplineError(true)}
        />
      </div>
    );
  }

  // Editorial 3D Outing Canvas Visual
  return (
    <div
      ref={containerRef}
      className="relative h-full w-full flex items-center justify-center p-4 sm:p-6 select-none"
    >
      {/* Background Soft Glow Aura */}
      <div
        className="absolute h-[340px] w-[340px] rounded-full bg-gradient-to-br from-[#C96745]/20 via-[#397C78]/20 to-transparent blur-3xl transition-transform duration-1000 ease-out"
        style={{
          transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)`,
        }}
      />

      {/* Main Glassmorphic Outing Path Canvas */}
      <div
        className="relative z-10 w-full max-w-md rounded-3xl bg-[#091C1A]/80 border border-white/15 p-6 shadow-2xl backdrop-blur-2xl transition-transform duration-500 ease-out"
        style={{
          transform: `perspective(1000px) rotateY(${mousePos.x * 6}deg) rotateX(${mousePos.y * -6}deg)`,
        }}
      >
        {/* Canvas Header Tag */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#C96745]/20 text-[#FF9D7A] text-sm">
              <Compass className="h-4 w-4 animate-spin-slow" />
            </span>
            <div>
              <span className="block text-xs font-black text-white tracking-wide">مسار طلعة جِدّاو المقترحة</span>
              <span className="block text-[10px] font-semibold text-white/50">Jeddah Outing Itinerary Route</span>
            </div>
          </div>
          <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-[#E4A23B] border border-white/10">
            3 محطات ⏱️ 4.5h
          </span>
        </div>

        {/* Timeline Path & Station Cards */}
        <div className="relative space-y-4 ps-4">
          {/* Vertical Connecting Route Line */}
          <div className="absolute start-[27px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-[#C96745] via-[#397C78] to-[#E4A23B] opacity-60" />

          {featuredStations.map((station, idx) => {
            const isActive = activeStation === idx;
            return (
              <div
                key={station.id}
                onClick={() => setActiveStation(idx)}
                className={`relative flex items-center gap-3.5 rounded-2xl p-3.5 border transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-white/15 border-white/30 shadow-lg translate-x-1"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                {/* Station Number Node */}
                <div
                  className={`relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-black transition-all ${
                    isActive
                      ? "bg-gradient-to-br from-[#C96745] to-[#E4A23B] text-white shadow-md scale-110"
                      : "bg-[#091C1A] text-white/60 border border-white/20"
                  }`}
                >
                  {station.num}
                </div>

                {/* Station Emoji Icon */}
                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-lg bg-gradient-to-br ${station.gradient} text-white shadow-sm`}>
                  {station.emoji}
                </div>

                {/* Station Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-white truncate">{station.titleAr}</h4>
                    <span className="text-[10px] font-bold text-[#FF9D7A] bg-black/30 px-2 py-0.5 rounded-md">
                      {station.time}
                    </span>
                  </div>
                  <p className="text-[10px] font-semibold text-white/60 mt-0.5 truncate">
                    {station.districtAr} · {station.categoryAr}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Canvas Footer Summary Bar */}
        <div className="mt-5 border-t border-white/10 pt-4 flex items-center justify-between text-[11px] font-bold text-white/80">
          <span className="flex items-center gap-1.5 text-white/70">
            <MapPin className="h-3.5 w-3.5 text-[#C96745]" /> 21.5433° N, 39.1728° E
          </span>
          <span className="text-[#5EAAA5] font-extrabold flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> مسار موزون 100%
          </span>
        </div>
      </div>

      {/* Floating Accent Floating Pill 1 */}
      <div
        className="absolute top-6 start-4 sm:top-10 sm:start-8 z-20 flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-xl border border-white/25 px-4 py-2 text-xs font-extrabold text-white shadow-xl transition-transform duration-700 ease-out animate-float"
        style={{
          transform: `translate(${mousePos.x * 12}px, ${mousePos.y * 12}px)`,
        }}
      >
        <Star className="h-3.5 w-3.5 text-[#E4A23B] fill-[#E4A23B]" />
        <span>اختيار ذكي وسريع</span>
      </div>

      {/* Floating Accent Floating Pill 2 */}
      <div
        className="absolute bottom-6 end-4 sm:bottom-10 sm:end-8 z-20 flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-xl border border-white/25 px-4 py-2 text-xs font-extrabold text-white shadow-xl transition-transform duration-700 ease-out animate-float-delayed"
        style={{
          transform: `translate(${mousePos.x * -14}px, ${mousePos.y * -14}px)`,
        }}
      >
        <Clock className="h-3.5 w-3.5 text-[#5EAAA5]" />
        <span>تحديث فوري لجدة</span>
      </div>
    </div>
  );
}
