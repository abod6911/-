import React from "react";
import { ExternalLink, MapPin, Navigation, Route, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getDistrict, type Place } from "@/data/jeddah";

function placeAddress(place: Place, isRtl: boolean) {
  const district = getDistrict(place.districtId);
  const districtName = district ? (isRtl ? district.nameAr : district.nameEn) : "";
  return `${isRtl ? place.nameAr : place.nameEn}${districtName ? `, ${districtName}` : ""}, ${isRtl ? "جدة" : "Jeddah"}`;
}

interface InteractiveMapModalProps {
  stops: Place[];
  onClose: () => void;
}

export function InteractiveMapModal({ stops, onClose }: InteractiveMapModalProps) {
  const { isRtl } = useLanguage();

  // Generate multi-stop Google Maps directions URL
  const getGoogleMapsDirectionsUrl = () => {
    const first = stops[0];
    const last = stops[stops.length - 1];
    if (!first || !last) return "https://maps.google.com";
    const origin = encodeURIComponent(placeAddress(first, true));
    const destination = encodeURIComponent(placeAddress(last, true));
    const waypoints = stops
      .slice(1, -1)
      .map((s) => encodeURIComponent(placeAddress(s, true)))
      .join("|");

    let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
    if (waypoints) {
      url += `&waypoints=${waypoints}`;
    }
    return url;
  };

  return (
    <div
      className="modal-overlay z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-content max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 bg-[#FAF6F0] dark:bg-[#1C2422] text-[#252A28] dark:text-[#F5F1E8] border border-[#E2D3BE] dark:border-white/10 rounded-3xl shadow-2xl relative animate-modal-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 end-4 grid h-9 w-9 place-items-center rounded-full bg-[#EADECB] dark:bg-[#253230] text-[#252A28] dark:text-[#F5F1E8] hover:bg-[#C96745] hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#397C78] to-[#255C56] text-white shadow-lift">
            <Route className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black">
              {isRtl ? "مسار الخطة والخريطة التفاعلية 🗺️" : "Interactive Route Map 🗺️"}
            </h2>
            <p className="text-xs text-[#6E716C] dark:text-[#B5B8B2] font-semibold mt-0.5">
              {isRtl
                ? "تتبع المحطات والمسافة وقم بالربط المباشر مع خرائط قوقل"
                : "Track stops, travel distance & navigate via Google Maps"}
            </p>
          </div>
        </div>

        {/* Mock Visual Map Display */}
        <div className="relative h-64 md:h-72 w-full rounded-2xl overflow-hidden border border-[#E2D3BE] dark:border-white/10 bg-[#1E2725] mb-6 shadow-inner flex flex-col justify-between p-4 text-white">
          <img
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80"
            alt="خريطة المسار"
            className="absolute inset-0 h-full w-full object-cover opacity-35"
          />

          <div className="relative z-10 flex items-center justify-between">
            <span className="rounded-full bg-black/60 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-[#FF9D7A] border border-white/10">
              📍 {isRtl ? `جدة — ${stops.length} محطات` : `Jeddah — ${stops.length} Stops`}
            </span>
            <span className="rounded-full bg-[#397C78] px-3.5 py-1 text-xs font-extrabold text-white shadow-lift">
              ⚡ {isRtl ? "المسار الموصى به" : "Recommended Route"}
            </span>
          </div>

          {/* Connected Stop Dots Visual Overlay */}
          <div className="relative z-10 my-auto flex items-center justify-around gap-2 px-4 py-3 bg-black/40 backdrop-blur-md rounded-2xl border border-white/15">
            {stops.map((stop, i) => (
              <div key={stop.id} className="flex flex-col items-center text-center max-w-[110px]">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-[#C96745] text-xs font-black text-white shadow-lift ring-4 ring-[#C96745]/30 mb-1">
                  {i + 1}
                </div>
                <span className="text-[11px] font-extrabold truncate w-full">
                  {isRtl ? stop.nameAr : stop.nameEn}
                </span>
                <span className="text-[10px] text-white/70 font-semibold truncate w-full">
                  {isRtl ? stop.districtId : stop.districtId}
                </span>
              </div>
            ))}
          </div>

          <div className="relative z-10 flex items-center justify-between text-xs font-bold">
            <span className="text-white/80">
              ⏱️ {isRtl ? "الوقت التقديري للمسار: ~15 دقيقة تنقل" : "Estimated Transit Time: ~15 mins"}
            </span>
          </div>
        </div>

        {/* Stops List */}
        <div className="space-y-3 mb-6">
          <h3 className="text-sm font-extrabold text-[#252A28] dark:text-[#F5F1E8]">
            {isRtl ? "تفاصيل المحطات والتوجيهات:" : "Stop Details & Guidance:"}
          </h3>
          {stops.map((stop, index) => (
            <div
              key={stop.id}
              className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#253230] border border-[#E2D3BE] dark:border-white/10"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-[#397C78] text-xs font-bold text-white shrink-0">
                  {index + 1}
                </span>
                <div>
                  <h4 className="text-xs font-extrabold text-[#252A28] dark:text-[#F5F1E8]">
                    {isRtl ? stop.nameAr : stop.nameEn}
                  </h4>
                  <p className="text-[11px] text-[#6E716C] dark:text-[#B5B8B2] font-semibold flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3 text-[#C96745]" />
                    {placeAddress(stop, isRtl)}
                  </p>
                </div>
              </div>

              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(stop.nameAr + " جدة")}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-full bg-[#FAF6F0] dark:bg-[#1C2422] border border-[#E2D3BE] dark:border-white/15 px-3 py-1.5 text-[11px] font-bold text-[#397C78] dark:text-[#5EAAA5] hover:border-[#397C78] transition-colors"
              >
                <Navigation className="h-3 w-3" />
                {isRtl ? "ملاحة" : "Navigate"}
              </a>
            </div>
          ))}
        </div>

        {/* Master Google Maps Direct Action Button */}
        <a
          href={getGoogleMapsDirectionsUrl()}
          target="_blank"
          rel="noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#397C78] py-3.5 text-xs font-black text-white shadow-lift hover:bg-[#2e6461] transition-all animate-pulse-glow min-h-[48px]"
        >
          <ExternalLink className="h-4 w-4" />
          {isRtl ? "فتح المسار كامل على خرائط Google Maps 🗺️" : "Open Complete Route on Google Maps 🗺️"}
        </a>
      </div>
    </div>
  );
}
