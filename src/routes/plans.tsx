import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Calculator, Clock, MapPin, Star, Wallet } from "lucide-react";
import { budgetLevels, getDistrict, getPlace, groupLabels, readyPlans } from "@/data/jeddah";
import { formatDuration } from "@/lib/planner";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { SplitBillModal } from "@/components/planner/SplitBillModal";

export const Route = createFileRoute("/plans")({
  head: () => ({
    meta: [
      { title: "خطط جاهزة في جدة | وش الخطة؟" },
      {
        name: "description",
        content:
          "خطط جدة الجاهزة: جدة بأقل من 100 ريال، طلعة بعد الدوام، بحر وغروب، يوم عائلي داخلي، وجولة البلد التاريخية.",
      },
      { property: "og:title", content: "خطط جاهزة في جدة — وش الخطة؟" },
      { property: "og:description", content: "خطط مرتّبة بمحطات وأسعار ومدة لكل طلعة في جدة." },
      { property: "og:url", content: "/plans" },
    ],
    links: [{ rel: "canonical", href: "/plans" }],
  }),
  component: PlansPage,
});

function PlansPage() {
  const { t, isRtl } = useLanguage();
  const { savePlan, isPlanSaved } = useAuth();
  const [splitPlanData, setSplitPlanData] = useState<{
    title: string;
    price: number;
    stops: Array<{ place: ReturnType<typeof getPlace> }>;
  } | null>(null);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold md:text-4xl">{t("readyPlansTitle")}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        خطط رتّبناها لك مسبقًا حسب الميزانية والمناسبة. تبغى شيء مخصص لكم؟{" "}
        <Link to="/quick-plan" className="font-semibold text-teal">
          {t("quickPlan")}
        </Link>
        .
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {readyPlans.map((plan) => {
          const stops = plan.stops.map(getPlace);
          const price = stops.reduce((s, p) => s + p.pricePerPerson, 0);
          const mins = stops.reduce((s, p) => s + p.durationMin, 0);

          const generatedPlanMock = {
            id: plan.id,
            flavor: "balanced" as const,
            titleAr: plan.titleAr,
            subtitleAr: plan.descAr,
            stops: stops.map((place) => ({
              place,
              startMinutes: 1020,
              travelFromPrev: 15,
            })),
            pricePerPerson: price,
            totalPrice: price * 2,
            durationMin: mins,
            travelMin: 30,
            distanceKm: 12,
            indoorOnly: false,
            needsReservation: false,
            verified: true,
            confidence: 90,
          };

          const isSaved = isPlanSaved(plan.id);

          return (
            <article key={plan.id} className="surface-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-coral/12 px-3 py-1 text-xs font-bold text-coral">
                    {plan.tagAr}
                  </span>
                  <span className="rounded-full bg-mist px-3 py-1 text-xs font-bold text-navy">
                    {budgetLevels[plan.budget].ar}
                  </span>
                  {plan.groups.map((g) => (
                    <span key={g} className="text-xs font-semibold text-muted-foreground">
                      {groupLabels[g]}
                    </span>
                  ))}
                </div>
                <h2 className="mt-3 text-2xl font-bold">{isRtl ? plan.titleAr : plan.titleEn}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{plan.descAr}</p>

                <ol className="mt-5 space-y-4">
                  {stops.map((place, i) => (
                    <li key={place.id} className="relative ps-7">
                      <span className="absolute start-0 top-1 grid h-5 w-5 place-items-center rounded-full bg-teal text-[11px] font-bold text-primary-foreground">
                        {i + 1}
                      </span>
                      {i < stops.length - 1 && (
                        <span className="route-dashed absolute start-[9px] top-7 bottom-[-14px]" />
                      )}
                      <p className="font-bold">{isRtl ? place.nameAr : place.nameEn}</p>
                      <p className="text-[13px] text-muted-foreground">
                        {getDistrict(place.districtId).nameAr} · {place.categoryAr} ·{" "}
                        {place.pricePerPerson === 0 ? "مجاني" : `${place.pricePerPerson} ر.س`}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 border-t border-border pt-4 text-[13px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Wallet className="h-3.5 w-3.5" />
                    {price} ر.س {t("perPerson")}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {formatDuration(mins)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {stops.length} {t("stations")}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={`https://www.google.com/maps/dir/${stops
                      .map((s) => encodeURIComponent(`${s.nameEn} Jeddah`))
                      .join("/")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 rounded-full bg-teal px-5 py-2.5 text-center text-sm font-bold text-primary-foreground hover:bg-teal/90"
                  >
                    {t("openRoute")}
                  </a>

                  <button
                    onClick={() => setSplitPlanData(generatedPlanMock)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2.5 text-sm font-semibold hover:border-teal"
                  >
                    <Calculator className="h-4 w-4 text-coral" />
                    {t("calculateSplit")}
                  </button>

                  <button
                    onClick={() => savePlan(generatedPlanMock)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold border ${
                      isSaved ? "bg-coral text-accent-foreground border-coral font-bold" : "border-border hover:border-teal"
                    }`}
                  >
                    <Star className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                    {isSaved ? t("planSaved") : t("savePlan")}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {splitPlanData && (
        <SplitBillModal
          plan={splitPlanData as unknown as GeneratedPlan}
          groupSize={2}
          onClose={() => setSplitPlanData(null)}
        />
      )}
    </div>
  );
}