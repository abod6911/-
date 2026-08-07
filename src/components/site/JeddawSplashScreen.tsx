import React, { useEffect, useState } from "react";
import logoImg from "@/assets/jeddaw-logo.png";
import { Sparkles } from "lucide-react";

const elegantPhrases = [
  "نحضّر لك أفضل ما في جدة…",
  "نستكشف لك الوجهات المتميزة…",
  "ننسّق لك مسار الطلعة المثالي…",
  "جدة تبدأ من هنا.",
];

export function JeddawSplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [imgFailed, setImgFailed] = useState(false);

  // Smoothly cycle through refined microcopy over the 5-second duration
  useEffect(() => {
    const timer = setInterval(() => {
      setPhraseIdx((prev) => (prev + 1) % elegantPhrases.length);
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  // Set total loading duration to exactly 5 seconds
  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 4400);

    const removeTimer = setTimeout(() => {
      setVisible(false);
    }, 5000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-between bg-[#051413] text-[#FAF6F0] p-8 sm:p-12 select-none transition-all duration-700 ease-out ${
        fadeOut ? "opacity-0 scale-98 pointer-events-none" : "opacity-100 scale-100"
      }`}
      aria-label="جِدّاو — جاري التجهيز"
    >
      {/* Background Red Sea Atmospheric Glow */}
      <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 h-[550px] w-[550px] rounded-full bg-radial from-[#C96745]/15 via-[#397C78]/15 to-transparent blur-3xl pointer-events-none" />

      {/* Subtle Fine Topography Wave Texture */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="splash-wave-grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 0 50 Q 25 30, 50 50 T 100 50" fill="none" stroke="#FAF6F0" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#splash-wave-grid)" />
        </svg>
      </div>

      {/* Top Spacer for Vertical Balance */}
      <div className="w-full h-8" />

      {/* CENTERED CINEMATIC BRAND LOCKUP */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-sm w-full">
        
        {/* Brand Mark Container with Soft Ambient Aura */}
        <div className="relative mb-7">
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-[#C96745] via-[#E4A23B] to-[#397C78] opacity-35 blur-xl animate-pulse" />
          <div className="relative grid h-20 w-20 sm:h-22 sm:w-22 place-items-center rounded-3xl bg-[#091C1A]/90 p-3.5 shadow-2xl border border-white/20 backdrop-blur-xl">
            {imgFailed ? (
              <span className="text-3xl sm:text-4xl font-black text-[#C96745]">جـ</span>
            ) : (
              <img
                src={logoImg}
                alt="شعار جِدّاو — JEDDAW"
                className="h-full w-full object-contain drop-shadow-sm"
                style={{ imageRendering: "crisp-edges" }}
                onError={() => setImgFailed(true)}
              />
            )}
          </div>
        </div>

        {/* Brand Title */}
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#FAF6F0] leading-none mb-2">
          جِدّاو
        </h1>
        <span className="text-[11px] font-extrabold tracking-[0.3em] text-[#FF9D7A] uppercase mb-3">
          J E D D A W
        </span>

        {/* Tagline */}
        <p className="text-xs font-semibold text-[#FAF6F0]/70 tracking-wide flex items-center gap-1.5 mb-10">
          <Sparkles className="h-3 w-3 text-[#E4A23B]" />
          <span>جدة تبدأ من هنا.</span>
        </p>

        {/* CINEMATIC ELEGANT ROUTE DRAW LOADER */}
        <div className="w-full max-w-[200px] flex flex-col items-center">
          <svg className="w-full h-10 overflow-visible" viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background Route Path */}
            <path
              d="M 10 20 C 60 5, 140 35, 190 20"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="2"
              strokeDasharray="4 6"
            />
            {/* Animated Glowing Active Path */}
            <path
              d="M 10 20 C 60 5, 140 35, 190 20"
              stroke="url(#splashCinematicGradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="animate-route-draw"
            />
            <defs>
              <linearGradient id="splashCinematicGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#C96745" />
                <stop offset="50%" stopColor="#E4A23B" />
                <stop offset="100%" stopColor="#5EAAA5" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Calm Microcopy */}
        <div className="mt-4 h-6 flex items-center justify-center">
          <span className="text-xs font-bold text-[#FAF6F0]/75 transition-all duration-500 animate-fade-in">
            {elegantPhrases[phraseIdx]}
          </span>
        </div>
      </div>

      {/* FOOTER BRAND FOOTPRINT */}
      <div className="relative z-10 text-[10px] font-extrabold text-[#FAF6F0]/40 tracking-widest uppercase">
        JEDDAW OUTING PLANNER
      </div>
    </div>
  );
}
