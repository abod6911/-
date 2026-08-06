import { createFileRoute } from "@tanstack/react-router";
import { Clock, MapPin, Sparkles, Star, Wallet } from "lucide-react";
import { budgetLevels, getPlace, readyPlans } from "@/data/jeddah";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { PlaceImage } from "@/components/common/PlaceImage";

export const Route = createFileRoute("/plans")({
  head: () => ({
    meta: [
      { title: "خطط جاهزة في جدة | جِدّاو — JEDDAW" },
      {
        name: "description",
        content: "خطط جاهزة للبحر والعائلة والأصدقاء وبعد الدوام، مع الوقت والتكلفة والمسار داخل جدة مرتبة من جِدّاو.",
      },
    ],
    links: [{ rel: "canonical", href: "/plans" }],
  }),
  component: PlansPage,
});

function PlansPage() {
  const { t, isRtl } = useLanguage();
  const { savePlan, isPlanSaved } = useAuth();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="animate-fade-in-up flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#C96745]/15 text-xl">🗓️</span>
        <div>
          <h1 className="text-3xl font-extrabold text-[#252A28] dark:text-[#F5F1E8] md:text-4xl">{t("readyPlansTitle")}</h1>
          <p className="mt-1 text-sm text-[#6E716C] dark:text-[#B5B8B2] font-semibold">
            {isRtl ? "خطط جاهزة ومجربة من جِدّاو لجميع الأوقات والميزانيات" : "Ready itineraries created by JEDDAW"}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {readyPlans.map((plan, index) => {
          const price = plan.stops.reduce((s, id) => s + getPlace(id).pricePerPerson, 0);
          const mins = plan.stops.reduce((s, id) => s + getPlace(id).durationMin, 0);
          const isSaved = isPlanSaved(plan.id);

          return (
            <article
              key={plan.id}
              className={`surface-card overflow-hidden flex flex-col justify-between hover-lift animate-fade-in-up delay-${(index % 6) + 1} border border-[#E2D3BE] dark:border-white/10`}
            >
              {/* Plan Image Header */}
              <div className="relative h-44 w-full overflow-hidden">
                <PlaceImage
                  src={plan.image}
                  alt={isRtl ? plan.titleAr : plan.titleEn}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute top-3 start-3 end-3 flex items-center justify-between z-10">
                  <span className="rounded-full bg-[#C96745] px-3 py-1 text-xs font-extrabold text-white shadow-md">
                    {plan.tagAr}
                  </span>
                  <span className="rounded-full bg-black/50 backdrop-blur px-3 py-1 text-xs font-bold text-[#E4A23B] shadow-md">
                    ⭐ {budgetLevels[plan.budget].ar}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-[#252A28] dark:text-[#F5F1E8]">
                    {isRtl ? plan.titleAr : plan.titleEn}
                  </h2>
                  <p className="mt-2 text-sm text-[#6E716C] dark:text-[#B5B8B2] leading-relaxed font-medium">{plan.descAr}</p>

                  {/* Stop Timeline with Place Images */}
                  <ol className="mt-6 space-y-3 border-t border-[#E2D3BE] dark:border-white/10 pt-4">
                    {plan.stops.map((id, i) => {
                      const place = getPlace(id);
                      return (
                        <li key={id} className="flex items-center gap-3">
                          <PlaceImage
                            src={place.image}
                            alt={isRtl ? place.nameAr : place.nameEn}
                            className="h-10 w-10 rounded-xl object-cover shrink-0 border border-[#E2D3BE] dark:border-white/10"
                          />
                          <div className="truncate">
                            <span className="truncate text-sm font-bold text-[#252A28] dark:text-[#F5F1E8] block">
                              {i + 1}. {isRtl ? place.nameAr : place.nameEn}
                            </span>
                            <span className="text-xs text-[#397C78] dark:text-[#5EAAA5] font-semibold">
                              {isRtl ? (place.subCategoryAr || place.categoryAr) : (place.subCategoryEn || place.kind)} · {place.pricePerPerson} {isRtl ? "ر.س" : "SAR"}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>

                <div className="mt-6 border-t border-[#E2D3BE] dark:border-white/10 pt-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-semibold text-[#6E716C] dark:text-[#B5B8B2] mb-4">
                    <span className="flex items-center gap-1">
                      <Wallet className="h-4 w-4 text-[#C96745]" />
                      <span className="font-bold text-[#252A28] dark:text-[#F5F1E8]">{price} {isRtl ? "ر.س" : "SAR"}</span> {t("perPerson")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-[#397C78]" />
                      {Math.round(mins / 60)} {t("hours")}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-[#6E716C]" />
                      {plan.stops.length} {t("stations")}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => alert(isRtl ? `عرض مسار ${plan.titleAr} بالكامل…` : `Viewing full route for ${plan.titleEn}…`)}
                      className="w-full rounded-full bg-[#C96745] px-4 py-3 text-xs font-extrabold text-white shadow-lift hover:bg-[#b55837] transition-all min-h-[44px]"
                    >
                      {isRtl ? "عرض الخطة كاملة والمسار 🗺️" : "View Full Plan & Route 🗺️"}
                    </button>

                    <button
                      onClick={() => savePlan(plan)}
                      className={`w-full rounded-full border px-4 py-2.5 text-xs font-bold transition-all min-h-[40px] ${
                        isSaved
                          ? "bg-[#397C78] text-white border-[#397C78]"
                          : "border-[#E2D3BE] dark:border-white/15 bg-[#FAF6F0] dark:bg-[#161B1A] text-[#252A28] dark:text-[#F5F1E8] hover:border-[#397C78]"
                      }`}
                    >
                      <Star className={`inline h-3.5 w-3.5 me-1.5 ${isSaved ? "fill-white" : ""}`} />
                      {isSaved ? t("planSaved") : t("savePlan")}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}