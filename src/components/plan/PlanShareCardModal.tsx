import React, { useState } from "react";
import { Check, Copy, Download, Share2, Sparkles, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { Place } from "@/data/jeddah";

interface PlanShareCardModalProps {
  titleAr: string;
  titleEn: string;
  stops: Place[];
  totalPrice: number;
  durationText: string;
  onClose: () => void;
}

export function PlanShareCardModal({
  titleAr,
  titleEn,
  stops,
  totalPrice,
  durationText,
  onClose,
}: PlanShareCardModalProps) {
  const { isRtl } = useLanguage();
  const [copied, setCopied] = useState(false);

  const shareText = `${isRtl ? "📍 خطة طلعة من جِدّاو" : "📍 JEDDAW Outing Plan"}: ${
    isRtl ? titleAr : titleEn
  }\n\n${stops
    .map((s, i) => `${i + 1}. ${isRtl ? s.nameAr : s.nameEn} (${isRtl ? s.districtId : s.districtId})`)
    .join("\n")}\n\n💰 ${isRtl ? `الميزانية المقدرة: ${totalPrice} ر.س / شخص` : `Est. Budget: ${totalPrice} SAR / person`}\n⏱️ ${durationText}\n\n🔗 ${isRtl ? "سوّ خطتك بنفسك عبر جِدّاو:" : "Build yours on JEDDAW:"} https://jeddaw.sa`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsappShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank");
  };

  return (
    <div
      className="modal-overlay z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-content max-w-md w-full max-h-[90vh] overflow-y-auto p-6 bg-[#FAF6F0] dark:bg-[#1C2422] text-[#252A28] dark:text-[#F5F1E8] border border-[#E2D3BE] dark:border-white/10 rounded-3xl shadow-2xl relative animate-modal-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 end-4 grid h-9 w-9 place-items-center rounded-full bg-[#EADECB] dark:bg-[#253230] text-[#252A28] dark:text-[#F5F1E8] hover:bg-[#C96745] hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-5">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-[#C96745] text-white text-2xl shadow-lift">
            📲
          </div>
          <h2 className="text-xl font-black">
            {isRtl ? "بطاقة مشاركة الخطة مع الشلة 🌟" : "Outing Share Card 🌟"}
          </h2>
          <p className="text-xs text-[#6E716C] dark:text-[#B5B8B2] font-semibold mt-0.5">
            {isRtl ? "شارك البطاقة المصممة على واتساب، سناب وإسنتاقرام" : "Share branded card on WhatsApp & social media"}
          </p>
        </div>

        {/* Branded Card Preview */}
        <div className="rounded-3xl bg-gradient-to-br from-[#0B2523] via-[#18423E] to-[#C96745] text-white p-6 shadow-2xl relative overflow-hidden border border-white/20 mb-6">
          <div className="flex items-center justify-between gap-2 border-b border-white/20 pb-3 mb-4">
            <span className="text-xs font-black tracking-wide text-[#E4A23B] flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" /> جِدّاو | JEDDAW
            </span>
            <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-extrabold text-white">
              {durationText}
            </span>
          </div>

          <h3 className="text-lg font-black leading-snug mb-1">
            {isRtl ? titleAr : titleEn}
          </h3>
          <p className="text-xs font-semibold text-white/80 mb-4">
            {isRtl ? "خطة طلعة مرتبة وموزونة بجدة 🌊" : "Curated Jeddah Outing Plan 🌊"}
          </p>

          <div className="space-y-2 text-xs font-bold bg-black/25 backdrop-blur p-3.5 rounded-2xl border border-white/15 mb-4">
            {stops.map((stop, i) => (
              <div key={stop.id} className="flex items-center justify-between gap-2">
                <span className="truncate flex items-center gap-1.5">
                  <span className="grid h-4 w-4 place-items-center rounded-full bg-[#C96745] text-[9px] font-black text-white shrink-0">
                    {i + 1}
                  </span>
                  {isRtl ? stop.nameAr : stop.nameEn}
                </span>
                <span className="text-[10px] text-white/70 shrink-0 font-semibold">
                  {stop.pricePerPerson > 0 ? `${stop.pricePerPerson} SAR` : isRtl ? "مجاني" : "Free"}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs font-black pt-1">
            <span>💰 {totalPrice} SAR / person</span>
            <span className="text-[10px] text-[#E4A23B]">jeddaw.sa</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          <button
            onClick={handleWhatsappShare}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] py-3.5 text-xs font-black text-white shadow-lift hover:bg-[#20bd5a] transition-all min-h-[46px]"
          >
            <Share2 className="h-4 w-4" />
            {isRtl ? "إرسال إلى الشلة عبر WhatsApp 📲" : "Send to Group via WhatsApp 📲"}
          </button>

          <button
            onClick={handleCopyLink}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-[#E2D3BE] dark:border-white/15 bg-white dark:bg-[#253230] py-3 text-xs font-extrabold text-[#252A28] dark:text-[#F5F1E8] hover:border-[#C96745] transition-all min-h-[44px]"
          >
            {copied ? <Check className="h-4 w-4 text-[#397C78]" /> : <Copy className="h-4 w-4 text-[#C96745]" />}
            {copied
              ? isRtl
                ? "تم نسخ نص الخطة بنجاح! 📋"
                : "Plan Text Copied! 📋"
              : isRtl
              ? "نسخ نص الخطة بالكامل 📋"
              : "Copy Full Plan Text 📋"}
          </button>
        </div>
      </div>
    </div>
  );
}
