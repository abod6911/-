import React, { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, ShieldAlert, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { Place } from "@/data/jeddah";

export function ReportModal({
  place,
  onClose,
}: {
  place: Place;
  onClose: () => void;
}) {
  const { isRtl } = useLanguage();
  const [reason, setReason] = useState("hours");
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const reportReasons = [
    { id: "hours", labelAr: "ساعات عمل خاطئة ⏱️", labelEn: "Wrong opening hours ⏱️" },
    { id: "price", labelAr: "سعر غير دقيق أو متغير 💰", labelEn: "Inaccurate pricing 💰" },
    { id: "closed", labelAr: "المكان مغلق بشكل دائم 🚪", labelEn: "Place permanently closed 🚪" },
    { id: "location", labelAr: "موقع غير دقيق على الخريطة 📍", labelEn: "Incorrect map location 📍" },
    { id: "image", labelAr: "الصورة لا تخص هذا المكان 🖼️", labelEn: "Image doesn't match 🖼️" },
    { id: "other", labelAr: "ملاحظة أخرى 📝", labelEn: "Other issue 📝" },
  ];

  return (
    <div
      className="modal-overlay z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-content max-w-md w-full p-6 bg-[#FAF6F0] dark:bg-[#1C2422] text-[#252A28] dark:text-[#F5F1E8] border border-[#E2D3BE] dark:border-white/10 rounded-3xl shadow-2xl relative animate-modal-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 end-4 grid h-8 w-8 place-items-center rounded-full bg-[#EADECB] dark:bg-[#253230] text-[#252A28] dark:text-[#F5F1E8] hover:bg-[#C96745] hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {submitted ? (
          <div className="py-8 text-center animate-fade-in">
            <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-[#397C78]/20 text-[#397C78]">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-black text-[#252A28] dark:text-[#F5F1E8]">
              {isRtl ? "شكراً لمساهمتك! 🌸" : "Thank you for reporting! 🌸"}
            </h3>
            <p className="mt-1 text-xs text-[#6E716C] dark:text-[#B5B8B2] font-semibold">
              {isRtl
                ? "تم استلام البلاغ وسيتم مراجعة وتحديث بيانات المكان فوراً."
                : "Your report has been received and will be verified promptly."}
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#C96745]/15 text-[#C96745]">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#252A28] dark:text-[#F5F1E8]">
                  {isRtl ? "إبلاغ عن معلومة غير صحيحة" : "Report Inaccurate Information"}
                </h3>
                <p className="text-xs font-semibold text-[#6E716C] dark:text-[#B5B8B2]">
                  {isRtl ? place.nameAr : place.nameEn}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-2">
                  {isRtl ? "ما هي المشكلة التي لاحظتها؟" : "What issue did you notice?"}
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {reportReasons.map((r) => (
                    <label
                      key={r.id}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                        reason === r.id
                          ? "border-[#C96745] bg-[#C96745]/10 text-[#C96745]"
                          : "border-[#E2D3BE] dark:border-white/10 bg-white dark:bg-[#253230] text-[#252A28] dark:text-[#F5F1E8]"
                      }`}
                    >
                      <span>{isRtl ? r.labelAr : r.labelEn}</span>
                      <input
                        type="radio"
                        name="reportReason"
                        value={r.id}
                        checked={reason === r.id}
                        onChange={() => setReason(r.id)}
                        className="accent-[#C96745]"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">
                  {isRtl ? "تفاصيل إضافية (اختياري)" : "Additional details (Optional)"}
                </label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder={
                    isRtl
                      ? "اكتب التوقيت الصحيح أو التكلفة الفعلية لتحديثها..."
                      : "Provide correct hours, pricing, or info..."
                  }
                  className="w-full rounded-xl border border-[#E2D3BE] dark:border-white/15 bg-white dark:bg-[#253230] p-3 text-xs font-semibold focus:outline-none focus:border-[#C96745]"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-[#C96745] py-3 text-xs font-extrabold text-white shadow-lift hover:bg-[#b55837] transition-all min-h-[44px]"
              >
                {isRtl ? "إرسال البلاغ 🚀" : "Submit Report 🚀"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
