import React, { useState } from "react";
import { CheckCircle2, Share2, Vote, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { GeneratedPlan } from "@/lib/planner";

export function GroupPollModal({
  plans,
  onClose,
}: {
  plans: GeneratedPlan[];
  onClose: () => void;
}) {
  const { t, isRtl } = useLanguage();
  const [selectedPlanId, setSelectedPlanId] = useState<string>(plans[0]?.id || "");

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || plans[0];

  const generateWhatsAppPoll = () => {
    if (!selectedPlan) return "#";
    const msg = isRtl
      ? `📊 تصويت طلعة جدة من جِدّاو؟\n\nاخترنا الخطط التالية:\n${plans
          .map((p, i) => `${i + 1}. ${p.titleAr} (${p.pricePerPerson} ر.س/شخص)`)
          .join("\n")}\n\nصوّت لخيارك المفضل ردًا على هذه الرسالة!`
      : `📊 JEDDAW Group Outing Poll!\n\nOptions:\n${plans
          .map((p, i) => `${i + 1}. ${p.subtitleAr || p.titleAr} (${p.pricePerPerson} SAR/person)`)
          .join("\n")}\n\nReply with your vote!`;

    return `https://wa.me/?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="modal-overlay z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content max-w-xl w-full p-6 sm:p-7 rounded-3xl animate-modal-in surface-card bg-[#FAF6F0] dark:bg-[#161B1A] text-[#252A28] dark:text-[#F5F1E8] border border-[#E2D3BE] dark:border-white/10 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E2D3BE] dark:border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#C96745]/15 text-xl">
              📊
            </span>
            <h2 className="text-xl font-extrabold text-[#252A28] dark:text-[#F5F1E8]">
              {t("pollTitle")}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full bg-black/5 dark:bg-white/10 hover:bg-[#C96745] hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-3 text-xs sm:text-sm font-semibold text-[#6E716C] dark:text-[#B5B8B2]">
          {t("pollDesc")}
        </p>

        <div className="mt-5 space-y-3">
          {plans.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            const planTitle = isRtl ? plan.titleAr : (plan.subtitleAr || plan.titleAr);

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`flex items-center justify-between rounded-2xl p-4 cursor-pointer transition-all border ${
                  isSelected
                    ? "border-[#397C78] bg-[#397C78]/15 ring-2 ring-[#397C78]"
                    : "border-[#E2D3BE] dark:border-white/10 bg-white dark:bg-[#1A2221] hover:border-[#397C78]"
                }`}
              >
                <div>
                  <h3 className="font-extrabold text-[#252A28] dark:text-[#F5F1E8] text-base">
                    {planTitle}
                  </h3>
                  <p className="text-xs font-semibold text-[#6E716C] dark:text-[#B5B8B2] mt-1">
                    {plan.pricePerPerson} {isRtl ? "ر.س للشخص" : "SAR per person"} · {plan.durationMin} {isRtl ? "دقيقة" : "mins"}
                  </p>
                </div>

                <CheckCircle2
                  className={`h-6 w-6 shrink-0 transition-colors ${
                    isSelected ? "text-[#397C78] dark:text-[#5EAAA5]" : "text-[#6E716C]/40"
                  }`}
                />
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#E2D3BE] dark:border-white/10 pt-5">
          <button
            onClick={onClose}
            className="rounded-full border border-[#E2D3BE] dark:border-white/15 bg-white dark:bg-[#1A2221] px-6 py-2.5 text-xs font-bold text-[#252A28] dark:text-[#F5F1E8] hover:border-[#C96745] min-h-[44px]"
          >
            {t("close")}
          </button>

          <a
            href={generateWhatsAppPoll()}
            target="_blank"
            rel="noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#71805B] px-6 py-2.5 text-xs font-black text-white shadow-lift hover:bg-[#5e6b4a] transition-all min-h-[44px]"
          >
            <Share2 className="h-4 w-4" />
            {t("sharePollWhatsApp")}
          </a>
        </div>
      </div>
    </div>
  );
}
