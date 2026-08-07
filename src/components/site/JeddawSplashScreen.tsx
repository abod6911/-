import React, { useEffect, useState } from "react";
import logoImg from "@/assets/jeddaw-logo.png";
import { Sparkles, MapPin } from "lucide-react";

const loadingMicroMessages = [
  "نجهّز لك أفضل ما في جدة…",
  "نحمّل الأماكن والترندات…",
  "نظبّط لك مسارات الطلعة…",
  "جدة تبدأ من هنا…",
];

export function JeddawSplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [messageIdx, setMessageIdx] = useState(0);

  // Rotate micro-messages smoothly
  useEffect(() => {
    const messageTimer = setInterval(() => {
      setMessageIdx((prev) => (prev + 1) % loadingMicroMessages.length);
    }, 1800);

    return () => clearInterval(messageTimer);
  }, []);

  // Handle smooth app hydration fade out
  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      const hideTimer = setTimeout(() => {
        setVisible(false);
      }, 700);
      return () => clearTimeout(hideTimer);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#051413] text-[#FAF6F0] p-6 select-none transition-opacity duration-700 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-label="جِدّاو — جاري التحميل"
    >
      {/* Background Red Sea Ambient Glows */}
      <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-[#C96745]/20 via-[#397C78]/25 to-transparent blur-3xl pointer-events-none" />

      {/* Architectural Line Grid Detail */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="splash-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#FAF6F0" strokeWidth="0.5" strokeDasharray="3 3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#splash-grid)" />
        </svg>
      </div>

      {/* Main Centered Brand Lockup */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-sm w-full">
        {/* Logo Container with Pulsing Ring */}
        <div className="relative mb-6">
          <div className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-[#C96745] via-[#E4A23B] to-[#397C78] opacity-40 blur-lg animate-pulse" />
          <div className="relative grid h-20 w-20 place-items-center rounded-3xl bg-[#091C1A] p-3 shadow-2xl border border-white/20">
            <img
              src={logoImg}
              alt="شعار جِدّاو — JEDDAW"
              className="h-full w-full object-contain drop-shadow-md"
            />
          </div>
        </div>

        {/* Brand Name Lockup */}
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
          <span>جِدّاو</span>
          <span className="text-white/30 text-lg font-light">|</span>
          <span className="text-xs font-black tracking-widest text-[#FF9D7A] uppercase">JEDDAW</span>
        </h1>

        {/* Slogan */}
        <p className="mt-1 text-xs font-extrabold text-[#FAF6F0]/70 tracking-wide flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-[#E4A23B]" />
          <span>جدة تبدأ من هنا</span>
        </p>

        {/* BRANDED ROUTE ANIMATED LOADER */}
        <div className="mt-10 mb-4 w-full flex flex-col items-center">
          {/* Animated Route Path Line */}
          <div className="relative w-48 h-8 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 160 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M 10 15 Q 40 5, 80 15 T 150 15"
                stroke="url(#loaderRouteGrad)"
                strokeWidth="2.5"
                strokeDasharray="4 4"
                className="animate-route-draw opacity-60"
              />
              <defs>
                <linearGradient id="loaderRouteGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#C96745" />
                  <stop offset="50%" stopColor="#E4A23B" />
                  <stop offset="100%" stopColor="#5EAAA5" />
                </linearGradient>
              </defs>
            </svg>
            <MapPin className="absolute start-1/2 -translate-x-1/2 top-1 h-5 w-5 text-[#C96745] animate-bounce-gentle" />
          </div>

          {/* Smooth Progress Glow Line */}
          <div className="w-48 h-1 rounded-full bg-white/10 overflow-hidden relative mt-1">
            <div className="absolute inset-y-0 start-0 w-full bg-gradient-to-r from-[#C96745] via-[#E4A23B] to-[#397C78] rounded-full animate-pulse-glow" />
          </div>
        </div>

        {/* Rotating Microcopy */}
        <span className="text-xs font-bold text-[#FAF6F0]/80 h-5 transition-all duration-300 animate-fade-in">
          {loadingMicroMessages[messageIdx]}
        </span>
      </div>
    </div>
  );
}
