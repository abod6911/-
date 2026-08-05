import { createFileRoute } from "@tanstack/react-router";
import { Clock, MapPin, Sparkles, Star, Wallet } from "lucide-react";
import { budgetLevels, getPlace, readyPlans } from "@/data/jeddah";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

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
          <h1 className="text-3xl font-extrabold text-[#252A28] md:text-4xl">{t("readyPlansTitle")}</h1>
          <p className="mt-1 text-sm text-[#6E716C] font-semibold">
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
              className={`surface-card flex flex-col justify-between p-6 hover-lift animate-fade-in-up delay-${(index % 6) + 1}`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-[#C96745]/15 px-3 py-1 text-xs font-bold text-[#C96745]">
                    {plan.tagAr}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold text-[#6E716C]">
                    <Star className="h-3.5 w-3.5 text-[#E4A23B] fill-[#E4A23B]" />
                    {budgetLevels[plan.budget].ar}
                  </span>
                </div>

                <h2 className="mt-4 text-2xl font-extrabold text-[#252A28]">
                  {isRtl ? plan.titleAr : plan.titleEn}
                </h2>
                <p className="mt-2 text-sm text-[#6E716C] leading-relaxed">{plan.descAr}</p>

                {/* Stop Timeline */}
                <ol className="mt-6 space-y-3 border-t border-[#E2D3BE] pt-4">
                  {plan.stops.map((id, i) => {
                    const place = getPlace(id);
                    return (
                      <li key={id} className="flex items-center gap-3">
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#397C78] text-[11px] font-bold text-white shadow-sm">
                          {i + 1}
                        </span>
                        <span className="truncate text-sm font-bold text-[#252A28]">
                          {isRtl ? place.nameAr : place.nameEn}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </div>

              <div className="mt-6 border-t border-[#E2D3BE] pt-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-semibold text-[#6E716C] mb-4">
                  <span className="flex items-center gap-1">
                    <Wallet className="h-4 w-4 text-[#C96745]" />
                    <span className="font-bold text-[#252A28]">{price} {isRtl ? "ر.س" : "SAR"}</span> {t("perPerson")}
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

                <button
                  onClick={() => savePlan(plan)}
                  className={`w-full rounded-full border px-4 py-3 text-xs font-bold transition-all min-h-[44px] ${
                    isSaved
                      ? "bg-[#C96745] text-white border-[#C96745]"
                      : "border-[#E2D3BE] bg-[#FAF6F0] text-[#252A28] hover:border-[#C96745]"
                  }`}
                >
                  <Star className={`inline h-4 w-4 me-1.5 ${isSaved ? "fill-white" : ""}`} />
                  {isSaved ? t("planSaved") : t("savePlan")}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}