import React, { useState } from "react";
import { Calculator, Share2, Users, Wallet, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { Place } from "@/data/jeddah";

interface BillSplitterModalProps {
  stops: Place[];
  onClose: () => void;
}

export function BillSplitterModal({ stops, onClose }: BillSplitterModalProps) {
  const { isRtl } = useLanguage();
  const [peopleCount, setPeopleCount] = useState(3);
  const [includeTip, setIncludeTip] = useState(false);
  const [tipPercent, setTipPercent] = useState(10);

  const subtotal = stops.reduce((sum, s) => sum + s.pricePerPerson, 0) * peopleCount;
  const tipAmount = includeTip ? (subtotal * tipPercent) / 100 : 0;
  const totalBill = subtotal + tipAmount;
  const perPersonTotal = Math.round(totalBill / peopleCount);

  const handleShareSplit = () => {
    const summaryText = `${isRtl ? "💰 تقسيم فاتورة الطلعة — جِدّاو" : "💰 Outing Bill Split — JEDDAW"}\n\n${
      isRtl ? `عدد الأشخاص: ${peopleCount}` : `People Count: ${peopleCount}`
    }\n${isRtl ? `إجمالي الفاتورة: ${totalBill} ر.س` : `Total Bill: ${totalBill} SAR`}\n\n👉 ${
      isRtl ? `المطلوب من كل شخص: ${perPersonTotal} ر.س` : `Per Person Share: ${perPersonTotal} SAR`
    }\n\n${stops.map((s) => `• ${isRtl ? s.nameAr : s.nameEn}: ${s.pricePerPerson * peopleCount} ر.س`).join("\n")}\n\n🔗 https://jeddaw.sa`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(summaryText)}`;
    window.open(url, "_blank");
  };

  return (
    <div
      className="modal-overlay z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-content max-w-md w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 bg-[#FAF6F0] dark:bg-[#1C2422] text-[#252A28] dark:text-[#F5F1E8] border border-[#E2D3BE] dark:border-white/10 rounded-3xl shadow-2xl relative animate-modal-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 end-4 grid h-9 w-9 place-items-center rounded-full bg-[#EADECB] dark:bg-[#253230] text-[#252A28] dark:text-[#F5F1E8] hover:bg-[#C96745] hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-[#397C78] text-white text-2xl shadow-lift">
            🤝
          </div>
          <h2 className="text-xl font-black">
            {isRtl ? "تقسيم الفاتورة والحساب مع الشلة 💰" : "Bill Splitter & Calculator 💰"}
          </h2>
          <p className="text-xs text-[#6E716C] dark:text-[#B5B8B2] font-semibold mt-0.5">
            {isRtl ? "احسب ميزانية كل شخص وشارك النتيجة فوراً" : "Calculate per-person cost & share instant breakdown"}
          </p>
        </div>

        {/* Controls */}
        <div className="space-y-4 mb-6">
          {/* People Count Slider */}
          <div className="surface-card p-4 rounded-2xl border border-[#E2D3BE] dark:border-white/10">
            <div className="flex items-center justify-between gap-2 mb-2 text-xs font-extrabold">
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-[#C96745]" />
                {isRtl ? "عدد أشخاص الطلعة:" : "Number of People:"}
              </span>
              <span className="rounded-full bg-[#C96745] px-3 py-0.5 text-xs text-white">
                {peopleCount} {isRtl ? "أشخاص" : "people"}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={15}
              value={peopleCount}
              onChange={(e) => setPeopleCount(Number(e.target.value))}
              className="w-full accent-[#C96745] cursor-pointer"
            />
          </div>

          {/* Tip / Tax Toggle */}
          <div className="surface-card p-4 rounded-2xl border border-[#E2D3BE] dark:border-white/10 flex items-center justify-between gap-2 text-xs font-extrabold">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeTip}
                onChange={(e) => setIncludeTip(e.target.checked)}
                className="h-4 w-4 rounded accent-[#397C78] cursor-pointer"
              />
              <span>{isRtl ? "إضافة خفيّة (خدمة / إكرامية 10%)" : "Add Service/Tip (10%)"}</span>
            </label>
            {includeTip && <span className="text-[#397C78]">+{tipAmount} SAR</span>}
          </div>

          {/* Itemized Stops Preview */}
          <div className="surface-card p-4 rounded-2xl border border-[#E2D3BE] dark:border-white/10 space-y-2 text-xs font-bold">
            <h4 className="text-[11px] font-extrabold text-[#6E716C] dark:text-[#B5B8B2] uppercase tracking-wider mb-2">
              {isRtl ? "تفاصيل محطات الفاتورة:" : "Stops Itemized Cost:"}
            </h4>
            {stops.map((stop) => (
              <div key={stop.id} className="flex items-center justify-between text-xs">
                <span className="truncate">{isRtl ? stop.nameAr : stop.nameEn}</span>
                <span className="text-[#397C78] dark:text-[#5EAAA5]">
                  {stop.pricePerPerson * peopleCount} SAR ({stop.pricePerPerson} SAR × {peopleCount})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Grand Total Card */}
        <div className="rounded-3xl bg-gradient-to-br from-[#18423E] to-[#397C78] text-white p-5 text-center shadow-xl border border-white/20 mb-6">
          <span className="text-xs font-bold text-white/80 uppercase tracking-wider block mb-1">
            {isRtl ? "المطلوب سداده من كل شخص 💰" : "Per Person Share Required 💰"}
          </span>
          <div className="text-3xl font-black text-[#E4A23B]">
            {perPersonTotal} <span className="text-sm font-extrabold text-white">SAR / شخص</span>
          </div>
          <p className="text-[11px] font-semibold text-white/80 mt-1">
            {isRtl ? `إجمالي الفاتورة الكاملة: ${totalBill} ر.س` : `Grand Total: ${totalBill} SAR`}
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleShareSplit}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] py-3.5 text-xs font-black text-white shadow-lift hover:bg-[#20bd5a] transition-all min-h-[48px]"
        >
          <Share2 className="h-4 w-4" />
          {isRtl ? "إرسال حسبة الفاتورة للشلة على WhatsApp 📲" : "Share Bill Breakdown on WhatsApp 📲"}
        </button>
      </div>
    </div>
  );
}
