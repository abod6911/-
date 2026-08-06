import React, { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Compass,
  ExternalLink,
  Flame,
  MapPin,
  Navigation,
  RefreshCw,
  RotateCcw,
  SkipForward,
  Sparkles,
  Users,
  Wallet,
  X,
  XCircle,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { PlaceImage } from "@/components/common/PlaceImage";
import {
  createLiveOuting,
  handleClosedPlace,
  handleCrowdedPlace,
  LiveOutingState,
  markStopArrived,
  skipCurrentStop,
} from "@/lib/live-outing-engine";
import { places, type Place } from "@/data/jeddah";

interface LiveOutingModalProps {
  initialPlaceIds: string[];
  titleAr?: string;
  titleEn?: string;
  onClose: () => void;
}

export const LiveOutingModal: React.FC<LiveOutingModalProps> = ({
  initialPlaceIds,
  titleAr = "طلعة جدة المباشرة 🚀",
  titleEn = "Live Jeddah Outing 🚀",
  onClose,
}) => {
  const { t, isRtl } = useLanguage();
  const [outingState, setOutingState] = useState<LiveOutingState>(() =>
    createLiveOuting(titleAr, titleEn, initialPlaceIds.length > 0 ? initialPlaceIds : ["r1", "c1", "p3"])
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const currentStop = outingState.stops[outingState.currentStopIndex];
  const nextStop = outingState.stops[outingState.currentStopIndex + 1];

  const handleArrivedAction = () => {
    const newState = markStopArrived(outingState);
    setOutingState(newState);
    if (newState.lastNotificationMessageAr) {
      triggerToast(isRtl ? newState.lastNotificationMessageAr : (newState.lastNotificationMessageEn || newState.lastNotificationMessageAr));
    }
  };

  const handleSkipAction = () => {
    const newState = skipCurrentStop(outingState);
    setOutingState(newState);
    triggerToast(
      isRtl
        ? `تم تخطي المحطة الحالية وتحديث توقيت باقي الخطة.`
        : `Skipped current stop and updated schedule.`
    );
  };

  const handleClosedAction = () => {
    const newState = handleClosedPlace(outingState);
    setOutingState(newState);
    triggerToast(
      isRtl
        ? newState.lastNotificationMessageAr || "المكان مغلق؟ اخترنا لكم بديل ممتاز بنفس التكلفة والمود!"
        : newState.lastNotificationMessageEn || "Spot closed? Swapped with a nearby top match!"
    );
  };

  const handleCrowdedAction = () => {
    const newState = handleCrowdedPlace(outingState);
    setOutingState(newState);
    triggerToast(
      isRtl
        ? newState.lastNotificationMessageAr || "لتجنب الزحمة: اخترنا مكان رايق وهادئ قريب!"
        : newState.lastNotificationMessageEn || "Avoided crowd! Switched to a calm spot nearby."
    );
  };

  const handleOpenMaps = () => {
    if (!currentStop) return;
    const mapsUrl =
      currentStop.place.mapsUrl ||
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${currentStop.place.nameAr} جدة`
      )}`;
    window.open(mapsUrl, "_blank");
  };

  return (
    <div className="modal-overlay z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="modal-content max-w-2xl w-full max-h-[92vh] overflow-y-auto p-0 rounded-3xl animate-modal-in surface-card bg-[#FAF6F0] dark:bg-[#1A2221] text-[#252A28] dark:text-[#F5F1E8] border border-[#E2D3BE] dark:border-white/10 relative shadow-2xl">
        {/* Header Bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between p-4 md:px-6 bg-[#255C56] text-white rounded-t-3xl shadow-md border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/15 text-lg backdrop-blur">
              🚀
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#C96745] px-2 py-0.5 rounded-full text-white">
                  {isRtl ? "الوضع المباشر أثناء الطلعة" : "Live Outing Mode"}
                </span>
                <span className="h-2 w-2 rounded-full bg-[#5EAAA5] animate-ping" />
              </div>
              <h2 className="text-lg md:text-xl font-black text-white leading-tight mt-0.5">
                {isRtl ? outingState.titleAr : outingState.titleEn}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white hover:bg-[#C96745] transition-colors"
            aria-label={isRtl ? "إغلاق" : "Close"}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Live Notification Toast Banner */}
        {toastMessage && (
          <div className="bg-[#C96745] text-white p-3.5 px-6 text-xs md:text-sm font-extrabold flex items-center justify-between gap-3 animate-fade-in shadow-inner">
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 shrink-0 animate-pulse" />
              <span>{toastMessage}</span>
            </span>
            <button onClick={() => setToastMessage(null)} className="text-white/80 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="p-5 md:p-7 space-y-6">
          {/* Outing Complete State */}
          {outingState.status === "completed" ? (
            <div className="text-center py-10 space-y-4">
              <span className="text-6xl block">🎉</span>
              <h3 className="text-2xl font-black text-[#252A28] dark:text-[#F5F1E8]">
                {isRtl ? "اكتملت طلعتكم بنجاح!" : "Outing Completed!"}
              </h3>
              <p className="text-sm font-semibold text-[#6E716C] dark:text-[#B5B8B2] max-w-md mx-auto">
                {isRtl
                  ? "نتمنى أن تكون طلعتكم بجدة اليوم ساحرة وممتعة. يسعدنا تقييم تجربتكم واستخدام جِدّاو للطلعة الجاية!"
                  : "We hope you had a fantastic Jeddah outing. See you on your next trip!"}
              </p>
              <button
                onClick={onClose}
                className="mt-4 rounded-full bg-[#C96745] px-8 py-3.5 text-sm font-bold text-white shadow-lift hover:bg-[#b55837] transition-all"
              >
                {isRtl ? "إغلاق العرض المباشر" : "Close Live Outing"}
              </button>
            </div>
          ) : currentStop ? (
            <>
              {/* Top Metrics Cards Grid */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl bg-[#F4EBDD] dark:bg-[#161B1A] p-3 border border-[#E2D3BE]/60 dark:border-white/10">
                  <span className="text-[11px] font-bold text-[#6E716C] dark:text-[#B5B8B2] block">
                    {isRtl ? "وقت الوصول المتوقع" : "Estimated ETA"}
                  </span>
                  <span className="font-extrabold text-[#397C78] dark:text-[#5EAAA5] text-sm md:text-base mt-0.5 block">
                    ⏱️ {currentStop.estimatedArrival}
                  </span>
                </div>

                <div className="rounded-2xl bg-[#F4EBDD] dark:bg-[#161B1A] p-3 border border-[#E2D3BE]/60 dark:border-white/10">
                  <span className="text-[11px] font-bold text-[#6E716C] dark:text-[#B5B8B2] block">
                    {isRtl ? "الميزانية المستخدمة" : "Spent Budget"}
                  </span>
                  <span className="font-extrabold text-[#C96745] text-sm md:text-base mt-0.5 block">
                    💰 {outingState.spentBudget} {isRtl ? "ر.س" : "SAR"}
                  </span>
                </div>

                <div className="rounded-2xl bg-[#F4EBDD] dark:bg-[#161B1A] p-3 border border-[#E2D3BE]/60 dark:border-white/10">
                  <span className="text-[11px] font-bold text-[#6E716C] dark:text-[#B5B8B2] block">
                    {isRtl ? "المحطة التالية" : "Next Stop"}
                  </span>
                  <span className="font-bold text-[#252A28] dark:text-[#F5F1E8] text-xs md:text-sm mt-0.5 block truncate">
                    {nextStop ? (isRtl ? nextStop.place.nameAr : nextStop.place.nameEn) : isRtl ? "آخر محطة 🏁" : "Final Stop 🏁"}
                  </span>
                </div>
              </div>

              {/* Current Active Stop Hero Showcase Card */}
              <div className="surface-card rounded-3xl overflow-hidden border-2 border-[#397C78] dark:border-[#5EAAA5] shadow-xl relative">
                <div className="relative h-44 sm:h-52 w-full overflow-hidden">
                  <PlaceImage
                    src={currentStop.place.image}
                    alt={isRtl ? currentStop.place.nameAr : currentStop.place.nameEn}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

                  <div className="absolute top-3 start-3 z-10">
                    <span className="rounded-full bg-[#C96745] px-3.5 py-1 text-xs font-extrabold text-white shadow-md">
                      📍 {isRtl ? "المحطة الحالية الآن" : "Current Active Stop"}
                    </span>
                  </div>

                  <div className="absolute bottom-3 start-4 end-4 text-white z-10 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#FF9D7A]">
                        {isRtl ? currentStop.place.categoryAr : currentStop.place.kind}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black leading-tight text-white">
                        {isRtl ? currentStop.place.nameAr : currentStop.place.nameEn}
                      </h3>
                    </div>

                    <span className="rounded-full bg-black/60 backdrop-blur px-3 py-1 text-xs font-bold text-[#E4A23B]">
                      ★ {currentStop.place.rating || 4.8}
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 space-y-3">
                  <p className="text-xs sm:text-sm font-semibold text-[#6E716C] dark:text-[#B5B8B2]">
                    {isRtl ? currentStop.place.descAr : currentStop.place.descEn}
                  </p>

                  {currentStop.replacementReason && (
                    <div className="rounded-xl bg-[#C96745]/15 p-3 text-xs font-bold text-[#C96745] border border-[#C96745]/30">
                      💡 {currentStop.replacementReason}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold pt-1">
                    <span className="rounded-full bg-[#397C78]/15 text-[#397C78] dark:text-[#5EAAA5] px-3 py-1">
                      ⏱️ {currentStop.durationMin} {isRtl ? "دقيقة زيارة" : "mins stay"}
                    </span>
                    <span className="rounded-full bg-[#C96745]/15 text-[#C96745] px-3 py-1">
                      💰 {currentStop.cost} {isRtl ? "ر.س / للشخص" : "SAR / person"}
                    </span>
                    <span className="rounded-full bg-black/10 dark:bg-white/10 px-3 py-1 text-[#252A28] dark:text-[#F5F1E8]">
                      🚗 {currentStop.place.parkingAr}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Panel */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-extrabold text-[#6E716C] dark:text-[#B5B8B2] uppercase tracking-wider block">
                  ⚙️ {isRtl ? "إجراءات الوضع المباشر للطلعة:" : "Live Outing Direct Actions:"}
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {/* Open Map */}
                  <button
                    onClick={handleOpenMaps}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-[#397C78] p-3 text-xs font-bold text-white shadow-md hover:bg-[#2d6360] transition-all min-h-[44px]"
                  >
                    <Navigation className="h-4 w-4" />
                    <span>{isRtl ? "فتح الخريطة" : "Open Map"}</span>
                  </button>

                  {/* Arrived */}
                  <button
                    onClick={handleArrivedAction}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-[#71805B] p-3 text-xs font-extrabold text-white shadow-md hover:bg-[#5b6849] transition-all min-h-[44px]"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{isRtl ? "تم الوصول ✅" : "Arrived ✅"}</span>
                  </button>

                  {/* Skip */}
                  <button
                    onClick={handleSkipAction}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-[#FAF6F0] dark:bg-[#253230] border border-[#E2D3BE] dark:border-white/15 p-3 text-xs font-bold text-[#252A28] dark:text-[#F5F1E8] hover:border-[#C96745] transition-all min-h-[44px]"
                  >
                    <SkipForward className="h-4 w-4 text-[#C96745]" />
                    <span>{isRtl ? "تخطي المكان" : "Skip Stop"}</span>
                  </button>

                  {/* Closed */}
                  <button
                    onClick={handleClosedAction}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-[#B84E4E]/15 border border-[#B84E4E]/30 p-3 text-xs font-bold text-[#B84E4E] hover:bg-[#B84E4E] hover:text-white transition-all min-h-[44px]"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>{isRtl ? "المكان مغلق 🚫" : "Spot Closed 🚫"}</span>
                  </button>

                  {/* Crowded */}
                  <button
                    onClick={handleCrowdedAction}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-[#E4A23B]/15 border border-[#E4A23B]/30 p-3 text-xs font-bold text-[#E4A23B] dark:text-[#F5D08B] hover:bg-[#E4A23B] hover:text-white transition-all min-h-[44px]"
                  >
                    <Users className="h-4 w-4" />
                    <span>{isRtl ? "المكان مزدحم 👥" : "Crowded 👥"}</span>
                  </button>

                  {/* Change Plan */}
                  <button
                    onClick={() =>
                      triggerToast(
                        isRtl
                          ? "تم تفعيل محرك إعادة ترتيب الخطة! يمكنك اختيار بديل مباشر."
                          : "Re-calculation engine active! Select a new spot."
                      )
                    }
                    className="flex items-center justify-center gap-2 rounded-2xl bg-[#C96745]/15 border border-[#C96745]/30 p-3 text-xs font-bold text-[#C96745] hover:bg-[#C96745] hover:text-white transition-all min-h-[44px]"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>{isRtl ? "نريد تغيير الخطة 🔄" : "Change Plan 🔄"}</span>
                  </button>
                </div>
              </div>

              {/* Remaining Stops Timeline */}
              <div className="border-t border-[#E2D3BE] dark:border-white/10 pt-4">
                <span className="text-xs font-extrabold text-[#6E716C] dark:text-[#B5B8B2] uppercase tracking-wider block mb-3">
                  📍 {isRtl ? "مسار الخطة الكامل بالترتيب:" : "Full Outing Itinerary:"}
                </span>

                <div className="space-y-2.5">
                  {outingState.stops.map((stop, i) => (
                    <div
                      key={stop.placeId}
                      className={`flex items-center justify-between p-3 rounded-2xl border text-xs font-bold transition-all ${
                        stop.status === "current"
                          ? "bg-[#397C78]/15 border-[#397C78] text-[#397C78] dark:text-[#5EAAA5]"
                          : stop.status === "arrived"
                          ? "bg-[#71805B]/15 border-[#71805B] text-[#71805B] line-through"
                          : stop.status === "skipped"
                          ? "bg-black/5 dark:bg-white/5 border-transparent text-[#6E716C] line-through"
                          : "bg-white dark:bg-[#161B1A] border-[#E2D3BE] dark:border-white/10 text-[#252A28] dark:text-[#F5F1E8]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-[#C96745] text-white text-[11px] font-black shrink-0">
                          {i + 1}
                        </span>
                        <span className="truncate">{isRtl ? stop.place.nameAr : stop.place.nameEn}</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] font-semibold opacity-80">⏱️ {stop.estimatedArrival}</span>
                        {stop.status === "arrived" && <CheckCircle2 className="h-4 w-4 text-[#71805B]" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
