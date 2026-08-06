import React, { useState } from "react";
import { Award, CheckCircle2, Heart, Share2, Star, Sparkles, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { Place } from "@/data/jeddah";

interface OutingReportModalProps {
  stops: Place[];
  totalPrice: number;
  onClose: () => void;
}

export function OutingReportModal({ stops, totalPrice, onClose }: OutingReportModalProps) {
  const { isRtl } = useLanguage();
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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

        {!submitted ? (
          <>
            <div className="text-center mb-6">
              <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-[#C96745] text-white text-2xl shadow-lift">
                📸
              </div>
              <h2 className="text-xl font-black">
                {isRtl ? "كيف كانت طلعة الويكند؟ 🌟" : "How Was Your Outing? 🌟"}
              </h2>
              <p className="text-xs text-[#6E716C] dark:text-[#B5B8B2] font-semibold mt-0.5">
                {isRtl
                  ? "قيّم تجربة الطلعة وسجّلها في أرشيف إنجازاتك بجِدّاو"
                  : "Rate your experience & save it to your JEDDAW memory archive"}
              </p>
            </div>

            {/* Star Rating Picker */}
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-125 transition-transform"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= rating
                        ? "fill-[#E4A23B] text-[#E4A23B]"
                        : "text-[#E2D3BE] dark:text-white/20"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Outing Summary Snapshot */}
            <div className="surface-card p-4 rounded-2xl border border-[#E2D3BE] dark:border-white/10 space-y-2 text-xs font-bold mb-6">
              <div className="flex justify-between">
                <span className="text-[#6E716C]">{isRtl ? "المحطات المزارة:" : "Places Visited:"}</span>
                <span>{stops.length} {isRtl ? "أماكن" : "places"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E716C]">{isRtl ? "التكلفة الكلية المقدرة:" : "Est. Total Cost:"}</span>
                <span className="text-[#C96745]">{totalPrice} SAR / person</span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full rounded-full bg-[#C96745] py-3.5 text-xs font-black text-white shadow-lift hover:bg-[#b55837] transition-all min-h-[46px]"
            >
              {isRtl ? "حفظ كرت التذكار وتقييم الطلعة 🎉" : "Save Memory Souvenir & Submit 🎉"}
            </button>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-3xl bg-[#397C78] text-white text-3xl shadow-lift">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <h3 className="text-xl font-black text-[#252A28] dark:text-[#F5F1E8]">
              {isRtl ? "تم حفظ تقرير الطلعة بنجاح! 🏆" : "Outing Memory Saved! 🏆"}
            </h3>
            <p className="text-xs font-semibold text-[#6E716C] dark:text-[#B5B8B2] mt-2 leading-relaxed">
              {isRtl
                ? "تم إضافة الوسام +50 XP إلى حسابك الشخصي في جِدّاو!"
                : "+50 XP Badge added to your JEDDAW account profile!"}
            </p>
            <button
              onClick={onClose}
              className="mt-6 w-full rounded-full bg-[#397C78] py-3 text-xs font-extrabold text-white shadow-lift hover:bg-[#2e6461] transition-all min-h-[44px]"
            >
              {isRtl ? "تم" : "Done"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
