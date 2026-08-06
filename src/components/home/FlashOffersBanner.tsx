import React, { useEffect, useState } from "react";
import { Clock, Sparkles, Flame, ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/context/LanguageContext";

export function FlashOffersBanner() {
  const { isRtl } = useLanguage();
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 5, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="rounded-3xl bg-gradient-to-r from-[#C96745] via-[#D87856] to-[#E4A23B] text-white p-5 md:p-6 shadow-2xl border border-white/20 relative overflow-hidden flex flex-wrap items-center justify-between gap-4 animate-fade-in-up">
      {/* Glow Orbs */}
      <div className="absolute -top-12 -start-12 h-40 w-40 rounded-full bg-white/20 blur-2xl pointer-events-none" />

      <div className="flex items-center gap-4 relative z-10">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/20 text-2xl shadow-lift backdrop-blur">
          🔥
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-black/25 px-3 py-0.5 text-[11px] font-black uppercase text-white tracking-wider border border-white/20">
              ⚡ {isRtl ? "عروض الساعات الفائقة" : "Flash Deals"}
            </span>
            <span className="text-xs font-bold text-white/90">
              {isRtl ? "خصومات تبدأ من 20% إلى 40%" : "Discounts 20% to 40% OFF"}
            </span>
          </div>
          <h3 className="text-lg md:text-xl font-black mt-1">
            {isRtl ? "عروض كافيهات ومطاعم جدة المباشرة ✨" : "Live Jeddah Dining & Cafe Deals ✨"}
          </h3>
        </div>
      </div>

      {/* Countdown Clock */}
      <div className="flex items-center gap-3 relative z-10">
        <div className="flex items-center gap-1.5 font-mono text-center text-xs font-black">
          <div className="rounded-xl bg-black/35 px-2.5 py-1.5 backdrop-blur border border-white/15">
            <span className="block text-base leading-none text-[#FF9D7A]">
              {String(timeLeft.hours).padStart(2, "0")}
            </span>
            <span className="text-[9px] text-white/70">{isRtl ? "ساعة" : "hrs"}</span>
          </div>
          <span>:</span>
          <div className="rounded-xl bg-black/35 px-2.5 py-1.5 backdrop-blur border border-white/15">
            <span className="block text-base leading-none text-[#FF9D7A]">
              {String(timeLeft.minutes).padStart(2, "0")}
            </span>
            <span className="text-[9px] text-white/70">{isRtl ? "دقيقة" : "mins"}</span>
          </div>
          <span>:</span>
          <div className="rounded-xl bg-black/35 px-2.5 py-1.5 backdrop-blur border border-white/15">
            <span className="block text-base leading-none text-[#FF9D7A]">
              {String(timeLeft.seconds).padStart(2, "0")}
            </span>
            <span className="text-[9px] text-white/70">{isRtl ? "ثانية" : "secs"}</span>
          </div>
        </div>

        <Link
          to="/offers"
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-xs font-black text-[#C96745] shadow-lift hover:bg-[#FAF6F0] transition-all min-h-[44px] whitespace-nowrap"
        >
          <span>{isRtl ? "استعرض العروض" : "View All Deals"}</span>
          <ArrowLeft className={`h-3.5 w-3.5 ${isRtl ? "" : "rotate-180"}`} />
        </Link>
      </div>
    </div>
  );
}
