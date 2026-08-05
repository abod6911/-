import React from "react";
import { ExternalLink, MapPin, Navigation, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getDistrict } from "@/data/jeddah";
import type { GeneratedPlan } from "@/lib/planner";

export function RouteMapModal({
  plan,
  onClose,
}: {
  plan: GeneratedPlan;
  onClose: () => void;
}) {
  const { t, isRtl } = useLanguage();

  const googleRouteUrl = `https://www.google.com/maps/dir/${plan.stops
    .map((s) => encodeURIComponent(`${s.place.nameEn} Jeddah`))
    .join("/")}`;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content max-w-2xl animate-modal-in">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-teal" />
            <h2 className="text-xl font-bold">{t("mapTitle")}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-mist transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-2 text-sm text-muted-foreground">{t("mapDesc")}</p>

        {/* Visual Map graphic representation */}
        <div className="relative mt-5 h-64 w-full overflow-hidden rounded-2xl border border-border bg-sand/80 p-4">
          {/* Decorative Jeddah coastline SVG */}
          <svg className="absolute inset-0 h-full w-full opacity-20" aria-hidden="true">
            <path
              d="M 50 0 Q 70 100 90 200 T 120 300"
              fill="none"
              stroke="var(--teal)"
              strokeWidth="4"
            />
            <circle cx="80" cy="120" r="100" fill="var(--mist)" opacity="0.4" />
          </svg>

          {/* Connected Route Line */}
          <div className="relative z-10 flex h-full items-center justify-between px-6">
            {plan.stops.map((stop, index) => {
              const district = getDistrict(stop.place.districtId);
              return (
                <div key={stop.place.id} className="relative flex flex-col items-center group">
                  {/* Step pin */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-coral text-pearl font-bold shadow-lift transition-transform group-hover:scale-110">
                    {index + 1}
                  </div>
                  <span className="mt-2 rounded-xl bg-pearl/90 px-3 py-1 text-xs font-bold text-navy shadow-soft text-center max-w-[110px] truncate">
                    {isRtl ? stop.place.nameAr : stop.place.nameEn}
                  </span>
                  <span className="text-[11px] text-muted-foreground mt-0.5">
                    {isRtl ? district.nameAr : district.nameEn}
                  </span>

                  {/* Connector arrow */}
                  {index < plan.stops.length - 1 && (
                    <div className="absolute start-full top-6 w-16 -translate-y-1/2 border-t-2 border-dashed border-teal flex items-center justify-center">
                      <Navigation className="h-3.5 w-3.5 text-teal transform rotate-90" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Stops summary */}
        <div className="mt-5 space-y-2">
          {plan.stops.map((stop, i) => (
            <div
              key={stop.place.id}
              className="flex items-center justify-between rounded-xl bg-pearl p-3 border border-border text-sm"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-mist text-xs font-bold text-navy">
                  {i + 1}
                </span>
                <div>
                  <h4 className="font-bold">{isRtl ? stop.place.nameAr : stop.place.nameEn}</h4>
                  <p className="text-xs text-muted-foreground">
                    {getDistrict(stop.place.districtId).nameAr} · {stop.place.durationMin} دقيقة
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-teal">{stop.travelFromPrev} د تنقل</span>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div className="mt-6 flex justify-between gap-3">
          <button
            onClick={onClose}
            className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-mist"
          >
            {t("close")}
          </button>
          <a
            href={googleRouteUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-teal px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-lift hover:bg-teal/90"
          >
            <ExternalLink className="h-4 w-4" />
            {t("openRoute")}
          </a>
        </div>
      </div>
    </div>
  );
}
