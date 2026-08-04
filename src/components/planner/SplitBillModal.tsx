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
    { id: "1", label: isRtl ? "تأكسي / أوبر" : "Taxi / Uber", amount: 40 },
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
    const title = `💰 قطة طلعة: ${plan.titleAr}`;
    const stopsList = plan.stops
      ? plan.stops.map((s, i) => `${i + 1}. ${isRtl ? s.place.nameAr : s.place.nameEn}`).join("\n")
      : "";
    const extrasList = extras.length
      ? `\n\n📌 المصاريف الإضافية:\n` + extras.map((e) => `• ${e.label}: ${e.amount} ر.س`).join("\n")
      : "";

    const msg = `${title}\n\n📍 المحطات:\n${stopsList}${extrasList}\n\n👥 عدد الأشخاص: ${people}\n💳 إجمالي القطة: ${grandTotal} ر.س\n👉 المطلوب من كل شخص: ${finalPerPerson} ر.س`;

    return `https://wa.me/?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4 backdrop-blur-sm">
      <div className="surface-card w-full max-w-lg overflow-hidden border border-border p-6 shadow-lift animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <Calculator className="h-6 w-6 text-coral" />
            <h2 className="text-xl font-bold">{t("splitTitle")}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-mist transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-3 text-sm text-muted-foreground">{t("splitDesc")}</p>

        <div className="mt-5 space-y-4 text-sm">
          {/* Group size adjustment */}
          <div className="flex items-center justify-between rounded-xl bg-mist/60 p-3">
            <span className="font-semibold">{t("groupCount")}</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPeople(Math.max(1, people - 1))}
                className="h-8 w-8 rounded-full bg-pearl font-bold shadow-soft"
              >
                −
              </button>
              <span className="w-6 text-center font-bold text-base">{people}</span>
              <button
                type="button"
                onClick={() => setPeople(people + 1)}
                className="h-8 w-8 rounded-full bg-pearl font-bold shadow-soft"
              >
                +
              </button>
            </div>
          </div>

          {/* Base cost breakdown */}
          <div className="rounded-xl border border-border p-4 space-y-2">
            <div className="flex justify-between text-muted-foreground">
              <span>{t("baseCostPerPerson")}</span>
              <span className="font-semibold">{basePricePerPerson} ر.س</span>
            </div>
            <div className="flex justify-between font-bold text-navy">
              <span>مجموع الأنشطة والوجبات ({people} أشخاص)</span>
              <span>{baseTotal} ر.س</span>
            </div>
          </div>

          {/* Extras list */}
          <div>
            <h3 className="font-bold text-navy mb-2">{t("extraExpenses")}</h3>
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {extras.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl bg-sand/60 px-3 py-2 text-xs"
                >
                  <span className="font-semibold">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{item.amount} ر.س</span>
                    <button
                      onClick={() => removeExtraItem(item.id)}
                      className="text-destructive hover:opacity-80"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add extra form */}
            <div className="mt-3 grid grid-cols-[1fr_80px_auto] gap-2">
              <input
                type="text"
                placeholder={t("extraLabel")}
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="rounded-xl border border-border px-3 py-1.5 text-xs bg-pearl"
              />
              <input
                type="number"
                placeholder="0"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                className="rounded-xl border border-border px-3 py-1.5 text-xs bg-pearl"
              />
              <button
                type="button"
                onClick={addExtraItem}
                className="rounded-xl bg-teal px-3 py-1.5 text-xs font-bold text-primary-foreground hover:bg-teal/90"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Final summary */}
          <div className="rounded-2xl bg-navy p-4 text-pearl shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-xs opacity-80">{t("totalBill")}</span>
              <span className="text-lg font-bold">{grandTotal} ر.س</span>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-pearl/20 pt-2">
              <span className="font-bold text-coral">نصيب الشخص الواحد</span>
              <span className="text-2xl font-bold text-coral">{finalPerPerson} ر.س</span>
            </div>
          </div>
        </div>

        {/* WhatsApp Share Action */}
        <div className="mt-6 flex justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-mist"
          >
            {t("close")}
          </button>
          <a
            href={generateWhatsAppMessage()}
            target="_blank"
            rel="noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-success px-5 py-2.5 text-sm font-bold text-white shadow-soft hover:bg-success/90"
          >
            <Share2 className="h-4 w-4" />
            {t("shareBillWhatsApp")}
          </a>
        </div>
      </div>
    </div>
  );
}
