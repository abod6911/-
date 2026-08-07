import React, { useState } from "react";
import { Calculator, Plus, Share2, Trash2, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { GeneratedPlan } from "@/lib/planner";

interface ExtraItem {
  id: string;
  label: string;
  amount: number;
}

export function SplitBillModal({
  plan,
  groupSize,
  onClose,
}: {
  plan: GeneratedPlan;
  groupSize: number;
  onClose: () => void;
}) {
  const { t, isRtl } = useLanguage();
  const [people, setPeople] = useState(groupSize || 2);
  const [extras, setExtras] = useState<ExtraItem[]>([
    { id: "1", label: isRtl ? "تاكسي / أوبر" : "Taxi / Uber", amount: 40 },
  ]);
  const [newLabel, setNewLabel] = useState("");
  const [newAmount, setNewAmount] = useState("");

  const basePricePerPerson = plan.pricePerPerson;
  const baseTotal = basePricePerPerson * people;
  const extrasTotal = extras.reduce((sum, item) => sum + (item.amount || 0), 0);
  const grandTotal = baseTotal + extrasTotal;
  const finalPerPerson = Math.ceil(grandTotal / (people || 1));

  const addExtraItem = () => {
    if (!newLabel.trim() || !newAmount) return;
    setExtras((prev) => [
      ...prev,
      { id: Date.now().toString(), label: newLabel.trim(), amount: Number(newAmount) || 0 },
    ]);
    setNewLabel("");
    setNewAmount("");
  };

  const removeExtraItem = (id: string) => {
    setExtras((prev) => prev.filter((item) => item.id !== id));
  };

  const generateWhatsAppMessage = () => {
    const title = isRtl ? `💰 قطة طلعة: ${plan.titleAr}` : `💰 Outing Bill Split: ${plan.subtitleAr || plan.titleAr}`;
    const stopsList = plan.stops
      ? plan.stops.map((s, i) => `${i + 1}. ${isRtl ? s.place.nameAr : s.place.nameEn}`).join("\n")
      : "";
    const extrasList = extras.length
      ? `\n\n📌 ${isRtl ? "المصاريف الإضافية" : "Extras"}:\n` + extras.map((e) => `• ${e.label}: ${e.amount} ${isRtl ? "ر.س" : "SAR"}`).join("\n")
      : "";

    const curr = isRtl ? "ر.س" : "SAR";
    const msg = `${title}\n\n📍 ${isRtl ? "المحطات" : "Stops"}:\n${stopsList}${extrasList}\n\n👥 ${isRtl ? "عدد الأشخاص" : "People"}: ${people}\n💳 ${isRtl ? "إجمالي القطة" : "Total Bill"}: ${grandTotal} ${curr}\n👉 ${isRtl ? "المطلوب من كل شخص" : "Amount per Person"}: ${finalPerPerson} ${curr}`;

    return `https://wa.me/?text=${encodeURIComponent(msg)}`;
  };

  const currencySymbol = isRtl ? "ر.س" : "SAR";

  return (
    <div className="modal-overlay z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content max-w-lg w-full p-6 sm:p-7 rounded-3xl animate-modal-in surface-card bg-[#FAF6F0] dark:bg-[#161B1A] text-[#252A28] dark:text-[#F5F1E8] border border-[#E2D3BE] dark:border-white/10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2D3BE] dark:border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#C96745]/15 text-xl">
              🧮
            </span>
            <h2 className="text-xl font-extrabold text-[#252A28] dark:text-[#F5F1E8]">
              {t("splitTitle")}
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
          {t("splitDesc")}
        </p>

        <div className="mt-5 space-y-4 text-xs sm:text-sm">
          {/* Group size adjustment */}
          <div className="flex items-center justify-between rounded-2xl bg-white dark:bg-[#1A2221] p-4 border border-[#E2D3BE] dark:border-white/10">
            <span className="font-extrabold text-[#252A28] dark:text-[#F5F1E8]">{t("groupCount")}</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPeople(Math.max(1, people - 1))}
                className="h-9 w-9 rounded-xl bg-[#FAF6F0] dark:bg-white/10 font-black text-base text-[#252A28] dark:text-[#F5F1E8] hover:bg-[#C96745] hover:text-white transition-colors shadow-sm"
              >
                −
              </button>
              <span className="w-6 text-center font-black text-base text-[#C96745]">{people}</span>
              <button
                type="button"
                onClick={() => setPeople(people + 1)}
                className="h-9 w-9 rounded-xl bg-[#FAF6F0] dark:bg-white/10 font-black text-base text-[#252A28] dark:text-[#F5F1E8] hover:bg-[#C96745] hover:text-white transition-colors shadow-sm"
              >
                +
              </button>
            </div>
          </div>

          {/* Base cost breakdown */}
          <div className="rounded-2xl border border-[#E2D3BE] dark:border-white/10 bg-white dark:bg-[#1A2221] p-4 space-y-2">
            <div className="flex justify-between text-[#6E716C] dark:text-[#B5B8B2] font-semibold text-xs">
              <span>{t("baseCostPerPerson")}</span>
              <span className="font-bold text-[#252A28] dark:text-[#F5F1E8]">{basePricePerPerson} {currencySymbol}</span>
            </div>
            <div className="flex justify-between font-extrabold text-[#252A28] dark:text-[#F5F1E8] text-sm pt-1 border-t border-[#E2D3BE]/50 dark:border-white/10">
              <span>{isRtl ? `مجموع الأنشطة والوجبات (${people} أشخاص)` : `Total Activities (${people} people)`}</span>
              <span className="text-[#397C78] dark:text-[#5EAAA5]">{baseTotal} {currencySymbol}</span>
            </div>
          </div>

          {/* Extras list */}
          <div>
            <h3 className="font-extrabold text-[#252A28] dark:text-[#F5F1E8] mb-2">{t("extraExpenses")}</h3>
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {extras.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl bg-white dark:bg-[#1A2221] px-3.5 py-2.5 text-xs font-bold border border-[#E2D3BE] dark:border-white/10"
                >
                  <span className="text-[#252A28] dark:text-[#F5F1E8]">{item.label}</span>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[#C96745] font-extrabold">{item.amount} {currencySymbol}</span>
                    <button
                      onClick={() => removeExtraItem(item.id)}
                      className="text-[#B84E4E] hover:text-red-700 transition-colors p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add extra form */}
            <div className="mt-3 grid grid-cols-[1fr_90px_auto] gap-2">
              <input
                type="text"
                placeholder={t("extraLabel")}
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="rounded-xl border border-[#E2D3BE] dark:border-white/15 bg-white dark:bg-[#1A2221] px-3 py-2 text-xs font-bold text-[#252A28] dark:text-[#F5F1E8] placeholder:text-[#6E716C]/60 focus:border-[#C96745] focus:outline-none"
              />
              <input
                type="number"
                placeholder="0"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                className="rounded-xl border border-[#E2D3BE] dark:border-white/15 bg-white dark:bg-[#1A2221] px-3 py-2 text-xs font-bold text-[#252A28] dark:text-[#F5F1E8] placeholder:text-[#6E716C]/60 focus:border-[#C96745] focus:outline-none"
              />
              <button
                type="button"
                onClick={addExtraItem}
                className="rounded-xl bg-[#397C78] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#2d6360] transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Final summary banner */}
          <div className="rounded-2xl bg-gradient-to-r from-[#255C56] to-[#397C78] p-4 text-white shadow-md">
            <div className="flex items-center justify-between text-xs font-bold text-white/80">
              <span>{t("totalBill")}</span>
              <span className="text-base font-extrabold text-white">{grandTotal} {currencySymbol}</span>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-white/20 pt-2">
              <span className="font-extrabold text-white">{isRtl ? "نصيب الشخص الواحد" : "Cost Per Person"}</span>
              <span className="text-2xl font-black text-[#FF9D7A]">{finalPerPerson} {currencySymbol}</span>
            </div>
          </div>
        </div>

        {/* WhatsApp Share Action */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#E2D3BE] dark:border-white/10 pt-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#E2D3BE] dark:border-white/15 bg-white dark:bg-[#1A2221] px-6 py-2.5 text-xs font-bold text-[#252A28] dark:text-[#F5F1E8] hover:border-[#C96745] min-h-[44px]"
          >
            {t("close")}
          </button>

          <a
            href={generateWhatsAppMessage()}
            target="_blank"
            rel="noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#71805B] px-6 py-2.5 text-xs font-black text-white shadow-lift hover:bg-[#5e6b4a] transition-all min-h-[44px]"
          >
            <Share2 className="h-4 w-4" />
            {t("shareBillWhatsApp")}
          </a>
        </div>
      </div>
    </div>
  );
}
