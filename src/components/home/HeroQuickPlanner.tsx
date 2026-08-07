import React, { useState } from "react";
import { Users, Sparkles, Clock, Wallet, Heart, Utensils, Coffee, Waves, Zap, Flame, User, Home, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export interface HeroPlannerState {
  group: string;
  mood: string;
  time: string;
  budget: string;
}

interface HeroQuickPlannerProps {
  onPlanChange: (state: HeroPlannerState) => void;
  onBuildPlan: (state: HeroPlannerState) => void;
}

export function HeroQuickPlanner({ onPlanChange, onBuildPlan }: HeroQuickPlannerProps) {
  const { isRtl } = useLanguage();
  const [plannerState, setPlannerState] = useState<HeroPlannerState>({
    group: "friends",
    mood: "food",
    time: "4h",
    budget: "medium",
  });

  const updateState = (key: keyof HeroPlannerState, val: string) => {
    const next = { ...plannerState, [key]: val };
    setPlannerState(next);
    onPlanChange(next);
  };

  const groupOptions = [
    { id: "friends", labelAr: "أصدقاء", labelEn: "Friends", icon: Users },
    { id: "family", labelAr: "عائلة", labelEn: "Family", icon: Home },
    { id: "couple", labelAr: "لشخصين", labelEn: "Couple", icon: Heart },
    { id: "solo", labelAr: "لحالي", labelEn: "Solo", icon: User },
  ];

  const moodOptions = [
    { id: "food", labelAr: "أكل", labelEn: "Food", icon: Utensils },
    { id: "coffee", labelAr: "قهوة", labelEn: "Coffee", icon: Coffee },
    { id: "sea", labelAr: "بحر", labelEn: "Sea", icon: Waves },
    { id: "games", labelAr: "فعاليات", labelEn: "Activities", icon: Zap },
    { id: "trend", labelAr: "ترند", labelEn: "Trendy", icon: Flame },
  ];

  const timeOptions = [
    { id: "2h", labelAr: "ساعتين", labelEn: "2 hours" },
    { id: "4h", labelAr: "4 ساعات", labelEn: "4 hours" },
    { id: "evening", labelAr: "مساء", labelEn: "Evening" },
    { id: "fullday", labelAr: "يوم كامل", labelEn: "Full day" },
  ];

  const budgetOptions = [
    { id: "budget", labelAr: "اقتصادي", labelEn: "Budget" },
    { id: "medium", labelAr: "متوسط", labelEn: "Medium" },
    { id: "open", labelAr: "مفتوح", labelEn: "Premium" },
  ];

  return (
    <div className="w-full max-w-xl rounded-3xl bg-[#091C1A]/95 border border-white/20 p-4 sm:p-5 shadow-2xl backdrop-blur-2xl space-y-4 text-start select-none">
      
      {/* 1. Group Type Selector */}
      <div>
        <span className="block text-[11px] font-black text-white/70 uppercase tracking-wider mb-2">
          {isRtl ? "1. مع مين؟" : "1. Who are you going with?"}
        </span>
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
          {groupOptions.map((opt) => {
            const active = plannerState.group === opt.id;
            const Icon = opt.icon;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => updateState("group", opt.id)}
                className={`flex items-center justify-center gap-1.5 rounded-xl py-2 px-2 text-xs font-black transition-all cursor-pointer border ${
                  active
                    ? "bg-[#C96745] text-white border-white/30 shadow-md scale-[1.02]"
                    : "bg-white/10 text-white/80 border-white/10 hover:bg-white/15 hover:text-white"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="truncate">{isRtl ? opt.labelAr : opt.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Mood Selector */}
      <div>
        <span className="block text-[11px] font-black text-white/70 uppercase tracking-wider mb-2">
          {isRtl ? "2. وش مودك؟" : "2. What’s your mood?"}
        </span>
        <div className="grid grid-cols-5 gap-1.5">
          {moodOptions.map((opt) => {
            const active = plannerState.mood === opt.id;
            const Icon = opt.icon;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => updateState("mood", opt.id)}
                className={`flex flex-col items-center justify-center gap-1 rounded-xl py-2 px-1 text-[11px] font-black transition-all cursor-pointer border ${
                  active
                    ? "bg-[#397C78] text-white border-white/30 shadow-md scale-[1.02]"
                    : "bg-white/10 text-white/80 border-white/10 hover:bg-white/15 hover:text-white"
                }`}
              >
                <Icon className="h-3.5 w-3.5 text-[#E4A23B]" />
                <span className="truncate">{isRtl ? opt.labelAr : opt.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Time & Budget Selectors Row */}
      <div className="grid grid-cols-2 gap-3">
        {/* Time */}
        <div>
          <span className="block text-[11px] font-black text-white/70 uppercase tracking-wider mb-2">
            {isRtl ? "3. كم وقتك؟" : "3. How much time?"}
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {timeOptions.slice(0, 2).map((opt) => {
              const active = plannerState.time === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateState("time", opt.id)}
                  className={`rounded-xl py-1.5 px-2 text-[11px] font-extrabold transition-all cursor-pointer border text-center ${
                    active
                      ? "bg-white/25 text-white border-white/40 font-black shadow-xs"
                      : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
                  }`}
                >
                  {isRtl ? opt.labelAr : opt.labelEn}
                </button>
              );
            })}
          </div>
        </div>

        {/* Budget */}
        <div>
          <span className="block text-[11px] font-black text-white/70 uppercase tracking-wider mb-2">
            {isRtl ? "4. الميزانية" : "4. Budget"}
          </span>
          <div className="grid grid-cols-3 gap-1">
            {budgetOptions.map((opt) => {
              const active = plannerState.budget === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateState("budget", opt.id)}
                  className={`rounded-xl py-1.5 px-1 text-[10px] font-extrabold transition-all cursor-pointer border text-center ${
                    active
                      ? "bg-[#E4A23B] text-white border-white/40 font-black shadow-xs"
                      : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
                  }`}
                >
                  {isRtl ? opt.labelAr : opt.labelEn}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Action Submit Button */}
      <button
        type="button"
        onClick={() => onBuildPlan(plannerState)}
        className="w-full inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#C96745] to-[#B84E4E] px-6 py-3.5 text-sm font-black text-white shadow-lift hover:scale-[1.01] hover:shadow-2xl border border-white/20 transition-all cursor-pointer group mt-2"
      >
        <Sparkles className="h-4.5 w-4.5 text-white transition-transform group-hover:rotate-12" />
        <span>{isRtl ? "سوِّ لي خطة بهذه التفاصيل ✨" : "Build My Outing Plan ✨"}</span>
        <ArrowLeft className={`h-4 w-4 ${isRtl ? "" : "rotate-180"}`} />
      </button>
    </div>
  );
}
