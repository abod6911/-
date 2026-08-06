import React, { useState } from "react";
import { Clock, MapPin, Navigation } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getDistrict, type Place } from "@/data/jeddah";

interface OutingTimelineProps {
  stops: Place[];
}

export function OutingTimeline({ stops }: OutingTimelineProps) {
  const { isRtl } = useLanguage();
  const [startTime, setStartTime] = useState("18:30"); // 6:30 PM default

  // Helper to add minutes to HH:MM format
  const addMinutesToTime = (timeStr: string, minsToAdd: number) => {
    const [hRaw, mRaw] = timeStr.split(":");
    const h = Number(hRaw ?? 0);
    const m = Number(mRaw ?? 0);
    const date = new Date();
    date.setHours(h, m + minsToAdd, 0);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? (isRtl ? "م" : "PM") : isRtl ? "ص" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  let cumulativeMins = 0;

  return (
    <div className="surface-card p-6 rounded-3xl border border-[#E2D3BE] dark:border-white/10 shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2D3BE] dark:border-white/10 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-[#C96745]" />
          <h3 className="text-lg font-black text-[#252A28] dark:text-[#F5F1E8]">
            {isRtl ? "الجدول الزمني التفاعلي للطلعة ⏳" : "Interactive Outing Timeline ⏳"}
          </h3>
        </div>

        {/* Start Time Selector */}
        <div className="flex items-center gap-2 text-xs font-extrabold text-[#6E716C] dark:text-[#B5B8B2]">
          <span>{isRtl ? "وقت بداية الطلعة:" : "Outing Start Time:"}</span>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="rounded-xl border border-[#E2D3BE] dark:border-white/15 bg-[#FAF6F0] dark:bg-[#253230] px-3 py-1 text-xs font-bold text-[#252A28] dark:text-[#F5F1E8] focus:outline-none focus:border-[#C96745]"
          />
        </div>
      </div>

      {/* Visual Timeline Steps */}
      <div className="relative ps-6 border-s-2 border-[#C96745]/30 space-y-6">
        {stops.map((stop, index) => {
          const stopStartTime = addMinutesToTime(startTime, cumulativeMins);
          const stopDuration = stop.kind === "hotel" || stop.kind === "resort" ? 480 : stop.kind === "activity" ? 90 : 60;
          cumulativeMins += stopDuration;
          const stopEndTime = addMinutesToTime(startTime, cumulativeMins);
          cumulativeMins += 15; // 15 mins transit

          return (
            <div key={stop.id} className="relative group">
              {/* Timeline Dot */}
              <div className="absolute -start-[31px] top-0 grid h-7 w-7 place-items-center rounded-full bg-[#C96745] text-xs font-black text-white shadow-lift ring-4 ring-[#FAF6F0] dark:ring-[#1C2422]">
                {index + 1}
              </div>

              <div className="rounded-2xl bg-[#FAF6F0]/80 dark:bg-[#253230]/60 p-4 border border-[#E2D3BE]/60 dark:border-white/10 group-hover:border-[#C96745] transition-all hover-lift">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <span className="rounded-full bg-[#397C78]/15 px-3 py-0.5 text-xs font-extrabold text-[#397C78] dark:text-[#5EAAA5]">
                    ⏱️ {stopStartTime} — {stopEndTime}
                  </span>
                  <span className="text-[11px] font-bold text-[#6E716C] dark:text-[#B5B8B2]">
                    {stopDuration} {isRtl ? "دقيقة اقامة" : "mins stay"}
                  </span>
                </div>

                <h4 className="text-base font-extrabold text-[#252A28] dark:text-[#F5F1E8]">
                  {isRtl ? stop.nameAr : stop.nameEn}
                </h4>
                <p className="text-xs text-[#6E716C] dark:text-[#B5B8B2] font-semibold flex items-center gap-1 mt-1">
                  <MapPin className="h-3.5 w-3.5 text-[#C96745]" />
                  {(() => {
                    const d = getDistrict(stop.districtId);
                    const name = d ? (isRtl ? d.nameAr : d.nameEn) : "";
                    return `${name}${name ? " · " : ""}${isRtl ? "جدة" : "Jeddah"}`;
                  })()}
                </p>

                {index < stops.length - 1 && (
                  <div className="mt-3 pt-2.5 border-t border-[#E2D3BE]/40 dark:border-white/10 flex items-center gap-2 text-[11px] font-bold text-[#397C78] dark:text-[#5EAAA5]">
                    <Navigation className="h-3.5 w-3.5 animate-pulse" />
                    <span>
                      {isRtl
                        ? `تنقل بالسيارة إلى المحطة التالية (~15 دقيقة)`
                        : `Transit to next stop (~15 mins drive)`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
