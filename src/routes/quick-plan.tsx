import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Calculator,
  Car,
  Clock,
  MapPin,
  Map as MapIcon,
  RefreshCw,
  Share2,
  Sparkles,
  Star,
  Vote,
  Wallet,
} from "lucide-react";
import {
  budgetLevels,
  districts,
  getDistrict,
  groupLabels,
  moodLabels,
  type BudgetLevel,
  type GroupType,
  type Mood,
  type Place,
} from "@/data/jeddah";
import {
  formatClock,
  formatDuration,
  generatePlans,
  type GeneratedPlan,
  type PlanRequest,
} from "@/lib/planner";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { SplitBillModal } from "@/components/planner/SplitBillModal";
import { RouteMapModal } from "@/components/planner/RouteMapModal";
import { GroupPollModal } from "@/components/planner/GroupPollModal";

export const Route = createFileRoute("/quick-plan")({
  validateSearch: (search: Record<string, unknown>) => {
    const raw = search["budget"] as BudgetLevel | undefined;
    const valid = raw && ["economy", "balanced", "premium"].includes(raw);
    return { budget: valid ? raw : undefined };
  },
  head: () => ({
    meta: [
      { title: "خطة على السريع | وش الخطة؟" },
      {
        name: "description",
        content: "أجب على أسئلة قصيرة ونرتّب لكم ثلاث خطط داخل جدة حسب وقتكم وميزانيتكم وجوّكم.",
      },
      { property: "og:title", content: "خطة على السريع — وش الخطة؟" },
      { property: "og:description", content: "خطتكم داخل جدة جاهزة في أقل من دقيقة." },
      { property: "og:url", content: "/quick-plan" },
    ],
    links: [{ rel: "canonical", href: "/quick-plan" }],
  }),
  component: QuickPlan,
});

const timeOptions = [
  { labelAr: "أقل من ساعتين", labelEn: "Under 2 hours", value: 110 },
  { labelAr: "2–4 ساعات", labelEn: "2–4 hours", value: 220 },
  { labelAr: "4–6 ساعات", labelEn: "4–6 hours", value: 330 },
  { labelAr: "يوم كامل", labelEn: "Full day", value: 480 },
];

const prefOptions = [
  { id: "kids", labelAr: "يوجد أطفال", labelEn: "Kids friendly" },
  { id: "quiet", labelAr: "مكان هادئ", labelEn: "Quiet spot" },
  { id: "accessible", labelAr: "مناسب لذوي الإعاقة", labelEn: "Accessible" },
  { id: "noReservation", labelAr: "لا يحتاج حجزًا", labelEn: "No reservation needed" },
  { id: "noOutdoor", labelAr: "بدون أماكن خارجية", labelEn: "No outdoors" },
  { id: "nearby", labelAr: "قريب فقط", labelEn: "Nearby only" },
];

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors ${
        active
          ? "border-teal bg-teal text-primary-foreground"
          : "border-border bg-pearl text-navy hover:border-teal"
      }`}
    >
      {children}
    </button>
  );
}

function QuickPlan() {
  const { budget } = Route.useSearch();
  const { t, isRtl } = useLanguage();
  const [step, setStep] = useState(0);
  const [req, setReq] = useState<PlanRequest>({
    districtId: null,
    group: "friends",
    groupSize: 2,
    durationMin: 220,
    moods: [],
    environment: "any",
    budgetLevel: budget ?? "balanced",
    budgetPerPerson: null,
    prefs: [],
    startHour: 17,
  });
  const [results, setResults] = useState<GeneratedPlan[] | null>(null);
  const [swaps, setSwaps] = useState<Record<string, string>>({});

  const steps = [
    t("step0Title"),
    t("step1Title"),
    t("step2Title"),
    t("step3Title"),
    t("step4Title"),
    t("step5Title"),
    t("step6Title"),
  ];

  const plans = useMemo(() => {
    if (!results) return null;
    return results.map((plan) => ({
      ...plan,
      stops: plan.stops.map((stop) => {
        const swapId = swaps[`${plan.id}-${stop.place.id}`];
        if (swapId && stop.alternative && stop.alternative.id === swapId) {
          return { ...stop, place: stop.alternative, alternative: stop.place };
        }
        return stop;
      }),
    }));
  }, [results, swaps]);

  const set = (patch: Partial<PlanRequest>) => setReq((r) => ({ ...r, ...patch }));
  const toggleMood = (m: Mood) =>
    set({ moods: req.moods.includes(m) ? req.moods.filter((x) => x !== m) : [...req.moods, m] });
  const togglePref = (p: string) =>
    set({ prefs: req.prefs.includes(p) ? req.prefs.filter((x) => x !== p) : [...req.prefs, p] });

  const build = (override: Partial<PlanRequest> = {}) => {
    const next = { ...req, ...override };
    setReq(next);
    setSwaps({});
    setResults(generatePlans(next));
  };

  if (plans) {
    return (
      <Results
        plans={plans}
        req={req}
        onIncreaseBudget={() =>
          build({
            budgetLevel: req.budgetLevel === "economy" ? "balanced" : "premium",
            budgetPerPerson: null,
          })
        }
        onNearer={() => build({ prefs: [...new Set([...req.prefs, "nearby"])] })}
        onRegenerate={() => build({ startHour: req.startHour === 17 ? 18 : 17 })}
        onRestart={() => {
          setResults(null);
          setStep(0);
        }}
        onSwap={(planId, place, alt) =>
          setSwaps((s) => ({ ...s, [`${planId}-${place.id}`]: alt.id }))
        }
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-sm font-semibold text-teal">
        {t("wizardStep")} {step + 1} {t("wizardOf")} {steps.length} — {steps[step]}
      </p>
      <div className="mt-3 h-1.5 w-full rounded-full bg-mist">
        <div
          className="h-1.5 rounded-full bg-coral transition-all"
          style={{ width: `${((step + 1) / steps.length) * 100}%` }}
        />
      </div>

      <div className="surface-card mt-6 p-6">
        {step === 0 && (
          <fieldset>
            <legend className="text-2xl font-bold">{t("step0Title")}</legend>
            <p className="mt-2 text-sm text-muted-foreground">{t("step0Desc")}</p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <Chip active={req.districtId === null} onClick={() => set({ districtId: null })}>
                {t("anyDistrict")}
              </Chip>
              {districts.map((d) => (
                <Chip
                  key={d.id}
                  active={req.districtId === d.id}
                  onClick={() => set({ districtId: d.id })}
                >
                  {isRtl ? d.nameAr : d.nameEn}
                </Chip>
              ))}
            </div>
          </fieldset>
        )}

        {step === 1 && (
          <fieldset>
            <legend className="text-2xl font-bold">{t("step1Title")}</legend>
            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              {(Object.keys(groupLabels) as GroupType[]).map((g) => (
                <Chip key={g} active={req.group === g} onClick={() => set({ group: g })}>
                  {groupLabels[g]}
                </Chip>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-4">
              <span className="font-semibold">{t("groupSize")}</span>
              <div className="flex items-center gap-3 rounded-full border border-border bg-pearl px-3 py-2">
                <button
                  type="button"
                  aria-label="تقليل العدد"
                  onClick={() => set({ groupSize: Math.max(1, req.groupSize - 1) })}
                  className="h-7 w-7 rounded-full bg-mist font-bold"
                >
                  −
                </button>
                <span className="w-6 text-center font-bold">{req.groupSize}</span>
                <button
                  type="button"
                  aria-label="زيادة العدد"
                  onClick={() => set({ groupSize: Math.min(20, req.groupSize + 1) })}
                  className="h-7 w-7 rounded-full bg-mist font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </fieldset>
        )}

        {step === 2 && (
          <fieldset>
            <legend className="text-2xl font-bold">{t("step2Title")}</legend>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {timeOptions.map((tOpt) => (
                <Chip
                  key={tOpt.value}
                  active={req.durationMin === tOpt.value}
                  onClick={() => set({ durationMin: tOpt.value })}
                >
                  {isRtl ? tOpt.labelAr : tOpt.labelEn}
                </Chip>
              ))}
            </div>
            <label className="mt-6 block text-sm font-semibold">
              {t("startTime")}
              <select
                value={req.startHour}
                onChange={(e) => set({ startHour: Number(e.target.value) })}
                className="mt-2 block w-full rounded-xl border border-border bg-pearl px-3 py-2"
              >
                {[8, 10, 12, 14, 16, 17, 18, 20, 21].map((h) => (
                  <option key={h} value={h}>
                    {formatClock(h * 60)}
                  </option>
                ))}
              </select>
            </label>
          </fieldset>
        )}

        {step === 3 && (
          <fieldset>
            <legend className="text-2xl font-bold">{t("step3Title")}</legend>
            <p className="mt-2 text-sm text-muted-foreground">{t("step3Desc")}</p>
            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              {(Object.keys(moodLabels) as Mood[]).map((m) => (
                <Chip key={m} active={req.moods.includes(m)} onClick={() => toggleMood(m)}>
                  {moodLabels[m]}
                </Chip>
              ))}
            </div>
          </fieldset>
        )}

        {step === 4 && (
          <fieldset>
            <legend className="text-2xl font-bold">{t("step4Title")}</legend>
            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              {(
                [
                  ["indoor", t("indoor")],
                  ["outdoor", t("outdoor")],
                  ["any", t("anyEnv")],
                ] as const
              ).map(([v, label]) => (
                <Chip key={v} active={req.environment === v} onClick={() => set({ environment: v })}>
                  {label}
                </Chip>
              ))}
            </div>
          </fieldset>
        )}

        {step === 5 && (
          <fieldset>
            <legend className="text-2xl font-bold">{t("step5Title")}</legend>
            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              {(["economy", "balanced", "premium"] as BudgetLevel[]).map((b) => (
                <Chip
                  key={b}
                  active={req.budgetLevel === b && !req.budgetPerPerson}
                  onClick={() => set({ budgetLevel: b, budgetPerPerson: null })}
                >
                  {budgetLevels[b].ar}
                  <span className="mt-1 block text-[11px] font-medium opacity-80">
                    {budgetLevels[b].rangeAr}
                  </span>
                </Chip>
              ))}
            </div>
            <label className="mt-6 block text-sm font-semibold">
              {t("customBudget")}
              <input
                type="number"
                min={0}
                inputMode="numeric"
                value={req.budgetPerPerson ?? ""}
                onChange={(e) =>
                  set({ budgetPerPerson: e.target.value === "" ? null : Number(e.target.value) })
                }
                placeholder={t("customBudgetPlaceholder")}
                className="mt-2 block w-full rounded-xl border border-border bg-pearl px-3 py-2"
              />
            </label>
          </fieldset>
        )}

        {step === 6 && (
          <fieldset>
            <legend className="text-2xl font-bold">{t("step6Title")}</legend>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {prefOptions.map((p) => (
                <Chip key={p.id} active={req.prefs.includes(p.id)} onClick={() => togglePref(p.id)}>
                  {isRtl ? p.labelAr : p.labelEn}
                </Chip>
              ))}
            </div>
          </fieldset>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 font-semibold disabled:opacity-40"
        >
          {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}{" "}
          {t("prev")}
        </button>
        {step < steps.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            className="inline-flex items-center gap-2 rounded-full bg-teal px-6 py-3 font-bold text-primary-foreground"
          >
            {t("next")} {isRtl ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => build()}
            className="inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3 font-bold text-accent-foreground shadow-lift"
          >
            <Sparkles className="h-4 w-4" /> {t("generate")}
          </button>
        )}
      </div>
    </div>
  );
}

function Results({
  plans,
  req,
  onIncreaseBudget,
  onNearer,
  onRegenerate,
  onRestart,
  onSwap,
}: {
  plans: GeneratedPlan[];
  req: PlanRequest;
  onIncreaseBudget: () => void;
  onNearer: () => void;
  onRegenerate: () => void;
  onRestart: () => void;
  onSwap: (planId: string, place: Place, alt: Place) => void;
}) {
  const { t, isRtl } = useLanguage();
  const { savePlan, isPlanSaved } = useAuth();
  const [openPlan, setOpenPlan] = useState<string | null>(plans[1]?.id ?? plans[0]?.id ?? null);
  const [splitPlan, setSplitPlan] = useState<GeneratedPlan | null>(null);
  const [mapPlan, setMapPlan] = useState<GeneratedPlan | null>(null);
  const [showPollModal, setShowPollModal] = useState(false);

  if (!plans.length) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">ما لقينا خطة مطابقة 100%</h1>
        <p className="mt-3 text-muted-foreground">
          لكن نقدر نوسّع المسافة أو الميزانية شوي وترتّب لكم الطلعة.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={onIncreaseBudget}
            className="rounded-full bg-teal px-5 py-3 font-bold text-primary-foreground"
          >
            {t("makeCheaper")}
          </button>
          <button onClick={onRestart} className="rounded-full border border-border px-5 py-3 font-bold">
            جرّب جو ثاني
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold md:text-4xl">{t("resultsTitle")}</h1>
          <p className="mt-2 text-muted-foreground">
            {req.districtId ? getDistrict(req.districtId).nameAr : t("allJeddah")} ·{" "}
            {groupLabels[req.group]} · {req.groupSize} {isRtl ? "أشخاص" : "people"} ·{" "}
            {formatDuration(req.durationMin)}
          </p>
        </div>

        <button
          onClick={() => setShowPollModal(true)}
          className="inline-flex items-center gap-2 rounded-full bg-coral px-5 py-2.5 text-sm font-bold text-accent-foreground shadow-lift hover:opacity-90 transition-opacity"
        >
          <Vote className="h-4 w-4" />
          {t("groupPoll")}
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {[
          { label: t("makeCheaper"), fn: onIncreaseBudget },
          { label: t("makeNearer"), fn: onNearer },
          { label: t("anotherPlan"), fn: onRegenerate },
          { label: t("editAnswers"), fn: onRestart },
        ].map((a) => (
          <button
            key={a.label}
            onClick={a.fn}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-pearl px-4 py-2 text-sm font-semibold hover:border-teal"
          >
            <RefreshCw className="h-3.5 w-3.5" /> {a.label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {plans.map((plan) => {
          const isSaved = isPlanSaved(plan.id);
          return (
            <article
              key={plan.id}
              className={`surface-card flex flex-col p-5 ${
                plan.flavor === "balanced" ? "ring-2 ring-coral" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-xl font-bold">{plan.titleAr}</h2>
                {plan.flavor === "balanced" && (
                  <span className="shrink-0 rounded-full bg-coral px-3 py-1 text-[11px] font-bold text-accent-foreground">
                    {t("ourPick")}
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{plan.subtitleAr}</p>

              <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-xl bg-mist/70 p-3">
                  <dt className="text-xs text-muted-foreground">{t("perPerson")}</dt>
                  <dd className="font-bold">{plan.pricePerPerson} ر.س</dd>
                </div>
                <div className="rounded-xl bg-mist/70 p-3">
                  <dt className="text-xs text-muted-foreground">{t("totalPrice")}</dt>
                  <dd className="font-bold">{plan.totalPrice} ر.س</dd>
                </div>
                <div className="rounded-xl bg-mist/70 p-3">
                  <dt className="text-xs text-muted-foreground">{t("duration")}</dt>
                  <dd className="font-bold">{formatDuration(plan.durationMin)}</dd>
                </div>
                <div className="rounded-xl bg-mist/70 p-3">
                  <dt className="text-xs text-muted-foreground">{t("travel")}</dt>
                  <dd className="font-bold">
                    {plan.travelMin} {isRtl ? "دقيقة" : "min"} · {plan.distanceKm} km
                  </dd>
                </div>
              </dl>

              <ul className="mt-4 flex flex-wrap gap-2 text-[12px]">
                <span className="rounded-full bg-sand px-2.5 py-1 font-semibold">
                  {plan.indoorOnly ? t("allIndoor") : t("indoorAndOutdoor")}
                </span>
                {plan.needsReservation && (
                  <span className="rounded-full bg-warning/15 px-2.5 py-1 font-semibold text-warning">
                    {t("needsReservation")}
                  </span>
                )}
                {plan.verified ? (
                  <span className="flex items-center gap-1 rounded-full bg-success/12 px-2.5 py-1 font-semibold text-success">
                    <BadgeCheck className="h-3.5 w-3.5" /> {t("verifiedInfo")}
                  </span>
                ) : (
                  <span className="rounded-full bg-warning/15 px-2.5 py-1 font-semibold text-warning">
                    {t("needsVerification")}
                  </span>
                )}
              </ul>

              {/* Special Plan Action Toolbar */}
              <div className="mt-4 grid grid-cols-3 gap-2 text-xs font-semibold">
                <button
                  onClick={() => setSplitPlan(plan)}
                  className="inline-flex items-center justify-center gap-1 rounded-xl bg-mist p-2 text-navy hover:bg-mist/80 transition-colors"
                >
                  <Calculator className="h-3.5 w-3.5 text-coral" />
                  {t("calculateSplit")}
                </button>

                <button
                  onClick={() => setMapPlan(plan)}
                  className="inline-flex items-center justify-center gap-1 rounded-xl bg-mist p-2 text-navy hover:bg-mist/80 transition-colors"
                >
                  <MapIcon className="h-3.5 w-3.5 text-teal" />
                  {t("showMap")}
                </button>

                <button
                  onClick={() => savePlan(plan)}
                  className={`inline-flex items-center justify-center gap-1 rounded-xl p-2 transition-colors ${
                    isSaved ? "bg-coral text-accent-foreground font-bold" : "bg-mist text-navy hover:bg-mist/80"
                  }`}
                >
                  <Star className={`h-3.5 w-3.5 ${isSaved ? "fill-current" : ""}`} />
                  {isSaved ? t("planSaved") : t("savePlan")}
                </button>
              </div>

              <button
                onClick={() => setOpenPlan(openPlan === plan.id ? null : plan.id)}
                className="mt-4 rounded-full bg-teal px-5 py-3 font-bold text-primary-foreground"
              >
                {openPlan === plan.id ? t("hideDetails") : t("showDetails")}
              </button>

              {openPlan === plan.id && (
                <ol className="mt-5 space-y-4 border-t border-border pt-4">
                  {plan.stops.map((stop, i) => (
                    <li key={stop.place.id} className="relative ps-6">
                      <span className="absolute end-auto start-0 top-1 grid h-5 w-5 place-items-center rounded-full bg-coral text-[11px] font-bold text-accent-foreground">
                        {i + 1}
                      </span>
                      {i < plan.stops.length - 1 && (
                        <span className="route-dashed absolute start-[9px] top-7 bottom-[-14px]" />
                      )}
                      <p className="text-sm font-bold text-teal">{formatClock(stop.startMinutes)}</p>
                      <h3 className="font-bold">{isRtl ? stop.place.nameAr : stop.place.nameEn}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {isRtl ? stop.place.whyAr : stop.place.descEn}
                      </p>
                      <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-muted-foreground">
                        <li className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {getDistrict(stop.place.districtId).nameAr}
                        </li>
                        <li className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {stop.place.durationMin} د
                        </li>
                        <li className="flex items-center gap-1">
                          <Wallet className="h-3.5 w-3.5" />
                          {stop.place.pricePerPerson === 0 ? "مجاني" : `${stop.place.pricePerPerson} ر.س`}
                        </li>
                        <li className="flex items-center gap-1">
                          <Car className="h-3.5 w-3.5" />
                          {stop.travelFromPrev} د تنقل · {stop.place.parkingAr}
                        </li>
                      </ul>
                      {stop.alternative && (
                        <button
                          onClick={() => onSwap(plan.id, stop.place, stop.alternative!)}
                          className="mt-2 rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:border-teal"
                        >
                          {t("changePlace")} → {isRtl ? stop.alternative.nameAr : stop.alternative.nameEn}
                        </button>
                      )}
                    </li>
                  ))}
                </ol>
              )}

              <div className="mt-5 flex gap-2">
                <a
                  href={`https://www.google.com/maps/dir/${plan.stops
                    .map((s) => encodeURIComponent(`${s.place.nameEn} Jeddah`))
                    .join("/")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 rounded-full border border-border px-4 py-2 text-center text-sm font-semibold"
                >
                  {t("openRoute")}
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `خطتنا من وش الخطة؟\n${plan.titleAr}\n${plan.stops
                      .map((s) => `• ${s.place.nameAr}`)
                      .join("\n")}\n${plan.pricePerPerson} ر.س للشخص`,
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="شارك الخطة على واتساب"
                  className="rounded-full border border-border px-4 py-2 text-sm font-semibold"
                >
                  <Share2 className="h-4 w-4" />
                </a>
              </div>
            </article>
          );
        })}
      </div>

      <p className="mt-8 text-xs text-muted-foreground">
        كل الأماكن الظاهرة بيانات تجريبية. لحفظ الخطط وسجلها بشكل دائم —{" "}
        <Link to="/account" className="font-semibold text-teal">
          تعرف على حسابك
        </Link>
        .
      </p>

      {/* Modals */}
      {splitPlan && (
        <SplitBillModal
          plan={splitPlan}
          groupSize={req.groupSize}
          onClose={() => setSplitPlan(null)}
        />
      )}

      {mapPlan && <RouteMapModal plan={mapPlan} onClose={() => setMapPlan(null)} />}

      {showPollModal && <GroupPollModal plans={plans} onClose={() => setShowPollModal(false)} />}
    </div>
  );
}