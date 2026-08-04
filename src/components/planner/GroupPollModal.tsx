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
  const [voted, setVoted] = useState(false);

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || plans[0];

  const generateWhatsAppPoll = () => {
    if (!selectedPlan) return "#";
    const msg = `📊 تصويت طلعة جدة من وش الخطة؟\n\nاخترنا الخطط التالية:\n${plans
      .map((p, i) => `${i + 1}. ${p.titleAr} (${p.pricePerPerson} ر.س/شخص)`)
      .join("\n")}\n\nصوّت لخيارك المفضل ردًا على هذا الرسالة!`;

    return `https://wa.me/?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4 backdrop-blur-sm">
      <div className="surface-card w-full max-w-xl overflow-hidden border border-border p-6 shadow-lift animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <Vote className="h-6 w-6 text-coral" />
            <h2 className="text-xl font-bold">{t("pollTitle")}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-mist transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-3 text-sm text-muted-foreground">{t("pollDesc")}</p>

        <div className="mt-5 space-y-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlanId(plan.id)}
              className={`flex items-center justify-between rounded-2xl p-4 cursor-pointer transition-all border ${
                selectedPlanId === plan.id
                  ? "border-teal bg-teal/10 shadow-soft"
                  : "border-border bg-pearl hover:border-teal/50"
              }`}
            >
              <div>
                <h3 className="font-bold text-navy text-base">{plan.titleAr}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {plan.pricePerPerson} ر.س للشخص · {plan.durationMin} دقيقة
                </p>
              </div>
              <CheckCircle2
                className={`h-6 w-6 ${
                  selectedPlanId === plan.id ? "text-teal" : "text-muted-foreground opacity-30"
                }`}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between gap-3">
          <button
            onClick={onClose}
            className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-mist"
          >
            {t("close")}
          </button>
          <a
            href={generateWhatsAppPoll()}
            target="_blank"
            rel="noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-success px-5 py-2.5 text-sm font-bold text-white shadow-soft hover:bg-success/90"
          >
            <Share2 className="h-4 w-4" />
            {t("sharePollWhatsApp")}
          </a>
        </div>
      </div>
    </div>
  );
}
