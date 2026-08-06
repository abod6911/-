import React from "react";
import { Award, Lock, Sparkles, Trophy, Zap } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export interface BadgeItem {
  id: string;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  icon: string;
  unlocked: boolean;
}

export function UserBadges() {
  const { isRtl } = useLanguage();

  const badges: BadgeItem[] = [
    {
      id: "b1",
      nameAr: "أول طلعة 🌟",
      nameEn: "First Outing 🌟",
      descAr: "أنشأت أول خطة طلعة ناجحة في جدة",
      descEn: "Created your first successful Jeddah outing plan",
      icon: "🎉",
      unlocked: true,
    },
    {
      id: "b2",
      nameAr: "مكتشف البحر الأحمر 🌊",
      nameEn: "Red Sea Explorer 🌊",
      descAr: "زرت أكثر من 3 أماكن في الكورنيش وأبحر",
      descEn: "Visited 3+ spots in Corniche & Obhur",
      icon: "⛵",
      unlocked: true,
    },
    {
      id: "b3",
      nameAr: "متذوق فاخر 🍽️",
      nameEn: "Gourmet Master 🍽️",
      descAr: "جربت أفضل المطاعم والكافيهات الترند",
      descEn: "Tried top trending dining & cafe spots",
      icon: "☕",
      unlocked: true,
    },
    {
      id: "b4",
      nameAr: "خبير جدة 🏅",
      nameEn: "Jeddah Expert 🏅",
      descAr: "أنشأت 10+ خطط متكاملة مع الشلة",
      descEn: "Created 10+ complete outing plans",
      icon: "🏆",
      unlocked: false,
    },
  ];

  const unlockedCount = badges.filter((b) => b.unlocked).length;
  const xpPercentage = (unlockedCount / badges.length) * 100;

  return (
    <div className="surface-card p-6 rounded-3xl border border-[#E2D3BE] dark:border-white/10 shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2D3BE] dark:border-white/10 pb-4 mb-5">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-[#E4A23B]" />
          <h3 className="text-lg font-black text-[#252A28] dark:text-[#F5F1E8]">
            {isRtl ? "أوسمة الإنجازات والتحديات 🏆" : "Achievement Badges & XP 🏆"}
          </h3>
        </div>

        <span className="rounded-full bg-[#E4A23B]/15 px-3 py-1 text-xs font-black text-[#E4A23B]">
          {isRtl ? `المستوى 3 · ${unlockedCount}/${badges.length} أوسمة` : `Level 3 · ${unlockedCount}/${badges.length} Badges`}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-bold text-[#6E716C] dark:text-[#B5B8B2] mb-1.5">
          <span>{isRtl ? "تقدم إنجازات جِدّاو" : "JEDDAW XP Progress"}</span>
          <span>{xpPercentage}%</span>
        </div>
        <div className="h-3 w-full rounded-full bg-[#FAF6F0] dark:bg-[#253230] overflow-hidden border border-[#E2D3BE] dark:border-white/10 p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#C96745] via-[#E4A23B] to-[#397C78] transition-all duration-1000 shadow-sm"
            style={{ width: `${xpPercentage}%` }}
          />
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`p-4 rounded-2xl border transition-all text-center relative overflow-hidden ${
              badge.unlocked
                ? "bg-white dark:bg-[#253230] border-[#397C78]/40 shadow-lift hover-scale"
                : "bg-black/5 dark:bg-white/5 border-dashed border-[#E2D3BE] dark:border-white/10 opacity-60"
            }`}
          >
            <div className="text-3xl mb-2">{badge.icon}</div>
            <h4 className="text-xs font-extrabold text-[#252A28] dark:text-[#F5F1E8]">
              {isRtl ? badge.nameAr : badge.nameEn}
            </h4>
            <p className="text-[11px] text-[#6E716C] dark:text-[#B5B8B2] font-semibold mt-1 line-clamp-2">
              {isRtl ? badge.descAr : badge.descEn}
            </p>

            {!badge.unlocked && (
              <span className="absolute top-2 end-2 grid h-5 w-5 place-items-center rounded-full bg-black/20 text-xs">
                <Lock className="h-3 w-3 text-[#6E716C]" />
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
