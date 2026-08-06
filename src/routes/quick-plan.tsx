import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, MapPin, RefreshCw, Share2, Sparkles, Star, User, Vote, Wallet } from "lucide-react";
import { PlaceCard } from "@/components/places/PlaceCard";
import { districts, getDistrict, getPlace, groupLabels, readyPlans, type DistrictId, type GroupType, type Mood } from "@/data/jeddah";
import { formatDuration, generatePlans, type GeneratedPlan, type PlanRequest } from "@/lib/planner";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { BillSplitterModal } from "@/components/plan/BillSplitterModal";
import { GroupVotingModal } from "@/components/plan/GroupVotingModal";
import { InteractiveMapModal } from "@/components/plan/InteractiveMapModal";
import { PlanShareCardModal } from "@/components/plan/PlanShareCardModal";
import { OutingTimeline } from "@/components/plan/OutingTimeline";

export const Route = createFileRoute("/quick-plan")({
  head: () => ({
    meta: [
      { title: "سوّ لي خطة | جِدّاو — مخطط طلعات جدة الذكي" },
      {
        name: "description",
        content: "اختر موقعك، وقتك، ميزانيتك ومودك، وجِدّاو يرتّب لك النشاط والمطعم والقهوة والمسار كاملاً في أقل من دقيقة.",
      },
      { property: "og:title", content: "سوّ لي خطة — جِدّاو" },
      { property: "og:description", content: "المواقع الثانية تعطيك أماكن. جِدّاو يرتّب لك الطلعة كاملة." },
      { property: "og:url", content: "/quick-plan" },
    ],
    links: [{ rel: "canonical", href: "/quick-plan" }],
  }),
  component: QuickPlanPage,
});

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
      className={`rounded-2xl border px-4 py-3.5 text-sm font-bold transition-all duration-200 min-h-[48px] ${
        active
          ? "border-[#C96745] bg-[#C96745] text-white shadow-lift scale-[1.02]"
          : "border-[#E2D3BE] bg-[#FAF6F0] text-[#252A28] hover:border-[#C96745] hover:scale-[1.01] active:scale-[0.98]"
      }`}
    >
      {children}
    </button>
  );
}

function QuickPlanPage() {
  const { t, isRtl } = useLanguage();
  const { savePlan, isPlanSaved } = useAuth();

  const [step, setStep] = useState(0);
  const [districtId, setDistrictId] = useState<DistrictId | "">("");
  const [group, setGroup] = useState<GroupType>("duo");
  const [groupSize, setGroupSize] = useState<number>(2);
  const [durationMin, setDurationMin] = useState<number>(240);
  const [mood, setMood] = useState<Mood | "surprise">("sea");
  const [environment, setEnvironment] = useState<"indoor" | "outdoor" | "mix" | "any">("any");
  const [budgetTier, setBudgetTier] = useState<"economy" | "balanced" | "premium" | "custom">("balanced");
  const [budgetPerPerson, setBudgetPerPerson] = useState<number>(150);

  const [prefs, setPrefs] = useState<{
    noCrowd: boolean;
    easyParking: boolean;
    noLongDrive: boolean;
    kidsFriendly: boolean;
    calm: boolean;
    indoorOnly: boolean;
    wheelchair: boolean;
    noReservation: boolean;
    vegan: boolean;
    none: boolean;
  }>({
    noCrowd: false,
    easyParking: false,
    noLongDrive: false,
    kidsFriendly: false,
    calm: false,
    indoorOnly: false,
    wheelchair: false,
    noReservation: false,
    vegan: false,
    none: false,
  });

  const [building, setBuilding] = useState(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [plans, setPlans] = useState<GeneratedPlan[] | null>(null);

  const [selectedPlanForMap, setSelectedPlanForMap] = useState<GeneratedPlan | null>(null);
  const [splitPlan, setSplitPlan] = useState<GeneratedPlan | null>(null);
  const [showPollModal, setShowPollModal] = useState(false);

  const loadingMessages = [
    t("loadMsg1"),
    t("loadMsg2"),
    t("loadMsg3"),
    t("loadMsg4"),
    t("loadMsg5"),
    t("loadMsg6"),
    t("loadMsg7"),
    t("loadMsg8"),
    t("loadMsg9"),
  ];

  const steps = [
    t("step0Title"),
    t("step1Title"),
    t("step2Title"),
    t("step3Title"),
    t("step4Title"),
    t("step5Title"),
    t("step6Title"),
  ];

  const build = (customReq?: Partial<PlanRequest>) => {
    setBuilding(true);
    setLoadingTextIndex(0);

    const interval = setInterval(() => {
      setLoadingTextIndex((prev) => {
        if (prev < loadingMessages.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 450);

    setTimeout(() => {
      const req: PlanRequest = {
        districtId: districtId || null,
        durationMin,
        group,
        groupSize,
        moods: mood === "surprise" ? ["sea", "food"] : [mood],
        environment: environment === "indoor" || prefs.indoorOnly ? "indoor" : environment === "outdoor" ? "outdoor" : "any",
        budgetLevel: budgetTier === "economy" ? "economy" : budgetTier === "premium" ? "premium" : "balanced",
        budgetPerPerson,
        prefs: [
          ...(prefs.noCrowd ? ["noCrowd"] : []),
          ...(prefs.noLongDrive ? ["noLongDrive"] : []),
          ...(prefs.easyParking ? ["easyParking"] : []),
          ...(prefs.kidsFriendly ? ["kidsFriendly"] : []),
          ...(prefs.wheelchair ? ["wheelchair"] : []),
        ],
        startHour: 17,
        ...customReq,
      };

      const res = generatePlans(req);
      setPlans(res);
      setBuilding(false);
    }, 4200);
  };

  /* Loading State Screen */
  if (building) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center animate-fade-in">
        <div className="surface-card p-10 flex flex-col items-center justify-center">
          <div className="relative mb-6">
            <span className="text-6xl animate-bounce block">🧭</span>
            <div className="absolute -inset-4 rounded-full bg-[#C96745]/20 blur-xl animate-pulse-glow" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#252A28]">{t("loadingHeader")}</h2>
          <p className="mt-3 text-base font-bold text-[#C96745]">{loadingMessages[loadingTextIndex]}</p>

          <svg viewBox="0 0 200 30" className="mt-8 h-8 w-48 opacity-70">
            <path
              d="M0 15C40 15 60 5 100 5s60 20 100 20"
              fill="none"
              stroke="#397C78"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              className="animate-route-draw"
            />
          </svg>
        </div>
      </div>
    );
  }

  /* Wizard Steps Input Screen */
  if (!plans) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        {/* Step indicator */}
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C96745]/15 px-3.5 py-1 text-sm font-bold text-[#C96745]">
            <Sparkles className="h-4 w-4" />
            {t("wizardStep")} {step + 1} {t("wizardOf")} {steps.length}
          </span>
          <span className="text-sm font-bold text-[#6E716C]">— {steps[step]}</span>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-2.5 w-full rounded-full bg-[#EADECB] overflow-hidden">
          <div
            className="h-2.5 rounded-full bg-[#C96745] transition-all duration-500 ease-out"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Step content card */}
        <div className="surface-card mt-6 p-6 md:p-8 animate-fade-in">
          {/* Step 0: Location */}
          {step === 0 && (
            <fieldset>
              <legend className="text-2xl font-extrabold text-[#252A28] mb-2">{t("step0Title")}</legend>
              <p className="text-sm text-[#6E716C] font-semibold mb-6">حدد مكانك في جدة لتصفية المسافة والمشوار</p>
              
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setDistrictId("")}
                  className={`w-full rounded-2xl border p-4 text-start font-bold transition-all min-h-[52px] ${
                    districtId === ""
                      ? "border-[#C96745] bg-[#C96745]/10 text-[#C96745]"
                      : "border-[#E2D3BE] bg-[#FAF6F0] text-[#252A28] hover:border-[#C96745]"
                  }`}
                >
                  {t("locationAny")} 🌊 (جدة كاملة)
                </button>

                <div className="grid gap-2.5 sm:grid-cols-2">
                  {districts.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDistrictId(d.id)}
                      className={`rounded-xl border px-4 py-3 text-start text-sm font-semibold transition-all min-h-[48px] ${
                        districtId === d.id
                          ? "border-[#C96745] bg-[#C96745] text-white font-bold"
                          : "border-[#E2D3BE] bg-[#FAF6F0] text-[#252A28] hover:border-[#C96745]"
                      }`}
                    >
                      📍 {isRtl ? d.nameAr : d.nameEn}
                    </button>
                  ))}
                </div>
              </div>
            </fieldset>
          )}

          {/* Step 1: Group */}
          {step === 1 && (
            <fieldset>
              <legend className="text-2xl font-extrabold text-[#252A28] mb-2">{t("step1Title")}</legend>
              <p className="text-sm text-[#6E716C] font-semibold mb-6">اختر طبيعة المجموعة لمعرفة المكان المناسب</p>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { g: "solo" as const, l: t("groupSolo") },
                  { g: "duo" as const, l: t("groupDuo") },
                  { g: "friends" as const, l: t("groupFriends") },
                  { g: "family" as const, l: t("groupFamily") },
                  { g: "kids" as const, l: t("groupKids") },
                  { g: "work" as const, l: t("groupWork") },
                  { g: "tourists" as const, l: t("groupTourists") },
                  { g: "seniors" as const, l: t("groupSeniors") },
                ].map((item) => (
                  <Chip key={item.g} active={group === item.g} onClick={() => setGroup(item.g)}>
                    {item.l}
                  </Chip>
                ))}
              </div>
            </fieldset>
          )}

          {/* Step 2: Time */}
          {step === 2 && (
            <fieldset>
              <legend className="text-2xl font-extrabold text-[#252A28] mb-2">{t("step2Title")}</legend>
              <p className="text-sm text-[#6E716C] font-semibold mb-6">كم ساعة متاحة معكم للطلعة؟</p>
              
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  { m: 100, l: t("durUnder2h") },
                  { m: 180, l: t("dur2to4h") },
                  { m: 300, l: t("dur4to6h") },
                  { m: 420, l: t("durHalfDay") },
                  { m: 600, l: t("durFullDay") },
                ].map((item) => (
                  <Chip
                    key={item.m}
                    active={durationMin === item.m}
                    onClick={() => setDurationMin(item.m)}
                  >
                    ⏱️ {item.l}
                  </Chip>
                ))}
              </div>
            </fieldset>
          )}

          {/* Step 3: Mood */}
          {step === 3 && (
            <fieldset>
              <legend className="text-2xl font-extrabold text-[#252A28] mb-2">{t("step3Title")}</legend>
              <p className="text-sm text-[#6E716C] font-semibold mb-6">اختر الجو والمود المطلوب</p>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { m: "food" as const, l: t("moodFood") },
                  { m: "coffee" as const, l: t("moodCoffee") },
                  { m: "sea" as const, l: t("moodSea") },
                  { m: "games" as const, l: t("moodGames") },
                  { m: "adventure" as const, l: t("moodAdventure") },
                  { m: "calm" as const, l: t("moodCalm") },
                  { m: "culture" as const, l: t("moodCulture") },
                  { m: "shopping" as const, l: t("moodShopping") },
                  { m: "new" as const, l: t("moodNew") },
                  { m: "surprise" as const, l: t("moodSurprise") },
                ].map((item) => (
                  <Chip key={item.m} active={mood === item.m} onClick={() => setMood(item.m)}>
                    {item.l}
                  </Chip>
                ))}
              </div>
            </fieldset>
          )}

          {/* Step 4: Environment */}
          {step === 4 && (
            <fieldset>
              <legend className="text-2xl font-extrabold text-[#252A28] mb-2">{t("step4Title")}</legend>
              <p className="text-sm text-[#6E716C] font-semibold mb-6">اختر بيئة الجو المفضلة للطلعة</p>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { env: "indoor" as const, l: t("envIndoor") },
                  { env: "outdoor" as const, l: t("envOutdoor") },
                  { env: "mix" as const, l: t("envMix") },
                  { env: "any" as const, l: t("envAny") },
                ].map((item) => (
                  <Chip key={item.env} active={environment === item.env} onClick={() => setEnvironment(item.env)}>
                    {item.l}
                  </Chip>
                ))}
              </div>
            </fieldset>
          )}

          {/* Step 5: Budget */}
          {step === 5 && (
            <fieldset>
              <legend className="text-2xl font-extrabold text-[#252A28] mb-2">{t("step5Title")}</legend>
              <p className="text-sm text-[#6E716C] font-semibold mb-6">الميزانية التقديرية للشخص الواحد</p>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { tKey: "economy" as const, title: t("budgetEconoTitle"), sub: t("budgetEconoSub"), val: 60 },
                  { tKey: "balanced" as const, title: t("budgetMidTitle"), sub: t("budgetMidSub"), val: 150 },
                  { tKey: "premium" as const, title: t("budgetOpenTitle"), sub: t("budgetOpenSub"), val: 350 },
                ].map((item) => (
                  <button
                    key={item.tKey}
                    type="button"
                    onClick={() => {
                      setBudgetTier(item.tKey);
                      setBudgetPerPerson(item.val);
                    }}
                    className={`surface-card p-4 text-start transition-all min-h-[90px] ${
                      budgetTier === item.tKey
                        ? "border-[#C96745] bg-[#C96745]/15 ring-2 ring-[#C96745]"
                        : "hover:border-[#C96745]"
                    }`}
                  >
                    <h3 className="font-extrabold text-base text-[#252A28]">{item.title}</h3>
                    <p className="text-xs text-[#6E716C] mt-1 font-medium">{item.sub}</p>
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          {/* Step 6: Preferences */}
          {step === 6 && (
            <fieldset>
              <legend className="text-2xl font-extrabold text-[#252A28] mb-2">{t("step6Title")}</legend>
              <p className="text-sm text-[#6E716C] font-semibold mb-6">حدد أي تفضيلات تشغيلية تحب نراعيها</p>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { key: "noCrowd", l: t("prefNoCrowd") },
                  { key: "easyParking", l: t("prefEasyParking") },
                  { key: "noLongDrive", l: t("prefNoLongDrive") },
                  { key: "kidsFriendly", l: t("prefKidsFriendly") },
                  { key: "calm", l: t("prefCalm") },
                  { key: "indoorOnly", l: t("prefIndoor") },
                  { key: "wheelchair", l: t("prefWheelchair") },
                  { key: "noReservation", l: t("prefNoReservation") },
                  { key: "vegan", l: t("prefVegan") },
                  { key: "none", l: t("prefNone") },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() =>
                      setPrefs((p) => ({
                        ...p,
                        [item.key as keyof typeof p]: !p[item.key as keyof typeof p],
                      }))
                    }
                    className={`rounded-2xl border p-4 text-start font-semibold transition-all min-h-[48px] ${
                      prefs[item.key as keyof typeof prefs]
                        ? "border-[#C96745] bg-[#C96745]/15 text-[#C96745] font-bold"
                        : "border-[#E2D3BE] bg-[#FAF6F0] text-[#252A28] hover:border-[#C96745]"
                    }`}
                  >
                    {prefs[item.key as keyof typeof prefs] ? "✅ " : "⚪ "}
                    {item.l}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex items-center justify-between gap-3 border-t border-[#E2D3BE] pt-6">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="inline-flex items-center gap-2 rounded-full border border-[#E2D3BE] px-6 py-3 font-bold transition-all hover:border-[#C96745] disabled:opacity-40 min-h-[48px]"
            >
              {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}{" "}
              {t("prev")}
            </button>
            {step < steps.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="inline-flex items-center gap-2 rounded-full bg-[#397C78] px-7 py-3 font-bold text-white shadow-sm transition-all hover:bg-[#2e6562] min-h-[48px]"
              >
                {t("next")} {isRtl ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => build()}
                className="inline-flex items-center gap-2 rounded-full bg-[#C96745] px-8 py-3.5 font-bold text-white shadow-lift transition-all hover:bg-[#b55837] animate-pulse-glow min-h-[48px]"
              >
                <Sparkles className="h-5 w-5" /> {t("generateFinal")}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* Results Display Screen (Section 13) */
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="animate-fade-in-up flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#252A28] md:text-4xl">{t("resultsHeader")}</h1>
          <p className="mt-2 text-[#6E716C] font-semibold max-w-2xl">
            {t("resultsSub")}
          </p>
        </div>

        <button
          onClick={() => setShowPollModal(true)}
          className="inline-flex items-center gap-2 rounded-full bg-[#C96745] px-6 py-3 font-bold text-white shadow-lift hover:bg-[#b55837] transition-all min-h-[48px]"
        >
          <Vote className="h-4 w-4" />
          {t("shareGroup")}
        </button>
      </div>

      {/* Result Quick Action Pills */}
      <div className="animate-fade-in-up delay-1 mt-6 flex flex-wrap gap-2.5">
        {[
          { label: t("makeCheaper"), fn: () => build({ budgetPerPerson: Math.max(40, budgetPerPerson - 40) }) },
          { label: t("makeNearer"), fn: () => build({ districtId: districtId || "d1" }) },
          { label: t("anotherPlan"), fn: () => build() },
          { label: t("editAnswers"), fn: () => setPlans(null) },
        ].map((a) => (
          <button
            key={a.label}
            onClick={a.fn}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#E2D3BE] bg-[#FAF6F0] px-4 py-2.5 text-sm font-bold text-[#252A28] transition-all hover:border-[#C96745] hover:shadow-sm"
          >
            <RefreshCw className="h-4 w-4 text-[#C96745]" /> {a.label}
          </button>
        ))}
      </div>

      {/* 3 Plans Grid (Section 13) */}
      <div className="animate-fade-in-up delay-2 mt-8 grid gap-6 lg:grid-cols-3">
        {plans.slice(0, 3).map((plan, idx) => {
          const isSaved = isPlanSaved(plan.id);
          const planTag = idx === 0 ? t("plan1Tag") : idx === 1 ? t("plan2Tag") : t("plan3Tag");
          const planBadge = idx === 1 ? t("plan2Badge") : idx === 2 ? t("plan3Badge") : null;

          return (
            <article
              key={plan.id}
              className={`surface-card flex flex-col justify-between p-6 hover-lift ${
                idx === 1 ? "ring-2 ring-[#C96745]" : ""
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-[#C96745]/15 px-3 py-1 text-xs font-bold text-[#C96745]">
                    {planTag}
                  </span>
                  {planBadge && (
                    <span className="rounded-full bg-[#397C78] px-3 py-1 text-xs font-bold text-white">
                      {planBadge}
                    </span>
                  )}
                </div>

                <h2 className="mt-4 text-2xl font-extrabold text-[#252A28]">{plan.titleAr}</h2>
                <p className="mt-1 text-sm text-[#6E716C] font-semibold">{plan.subtitleAr}</p>

                {/* Timeline stops */}
                <ol className="mt-6 space-y-4 border-t border-[#E2D3BE] pt-4">
                  {plan.stops.map((stop, i) => (
                    <li key={stop.place.id} className="relative ps-7">
                      <span className="absolute start-0 top-1 grid h-5 w-5 place-items-center rounded-full bg-[#397C78] text-[11px] font-bold text-white">
                        {i + 1}
                      </span>
                      {i < plan.stops.length - 1 && (
                        <span className="route-dashed absolute start-[9px] top-7 bottom-[-14px]" />
                      )}
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-[#252A28]">{isRtl ? stop.place.nameAr : stop.place.nameEn}</p>
                        <button
                          onClick={() => build()}
                          className="text-xs font-bold text-[#C96745] hover:underline"
                        >
                          {t("swapPlace")}
                        </button>
                      </div>
                      <p className="text-xs text-[#6E716C] mt-0.5 font-medium">
                        {getDistrict(stop.place.districtId).nameAr} · {stop.place.durationMin} دقيقة
                      </p>
                      {/* Reason for selection (Section 15) */}
                      <p className="mt-1 text-[11px] text-[#71805B] font-semibold">
                        💡 اخترناه لأنه قريب وفي مسار الخطة ومناسب لميزانيتكم
                      </p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-6 border-t border-[#E2D3BE] pt-4">
                <div className="flex items-center justify-between text-sm font-bold text-[#252A28] dark:text-[#F5F1E8] mb-4">
                  <span className="text-[#C96745] font-black">
                    {plan.pricePerPerson} {isRtl ? "ر.س / للشخص" : "SAR / person"}
                  </span>
                  <span className="text-[#6E716C] dark:text-[#B5B8B2] text-xs font-semibold">
                    ⏱️ {formatDuration(plan.durationMin, isRtl)}
                  </span>
                </div>

                {/* Secondary Actions */}
                <div className="grid grid-cols-3 gap-1.5 mt-2">
                  <button
                    onClick={() => savePlan(plan)}
                    className={`rounded-full border px-2.5 py-2 text-center text-[11px] font-bold transition-all ${
                      isSaved
                        ? "bg-[#397C78] text-white border-[#397C78]"
                        : "border-[#E2D3BE] bg-[#FAF6F0] dark:bg-[#161B1A] text-[#252A28] dark:text-[#F5F1E8] hover:border-[#397C78]"
                    }`}
                  >
                    <Star className={`inline h-3 w-3 me-1 ${isSaved ? "fill-white" : ""}`} />
                    {isSaved ? (isRtl ? "محفوظة 🎉" : "Saved 🎉") : (isRtl ? "حفظ ⭐" : "Save ⭐")}
                  </button>

                  <button
                    onClick={() => setSplitPlan(plan)}
                    className="rounded-full border border-[#E2D3BE] dark:border-white/15 bg-[#FAF6F0] dark:bg-[#161B1A] px-2.5 py-2 text-center text-[11px] font-bold text-[#252A28] dark:text-[#F5F1E8] hover:border-[#C96745]"
                  >
                    💰 {isRtl ? "الفاتورة" : "Split"}
                  </button>

                  <button
                    onClick={() => setShowPollModal(true)}
                    className="rounded-full border border-[#E2D3BE] dark:border-white/15 bg-[#FAF6F0] dark:bg-[#161B1A] px-2.5 py-2 text-center text-[11px] font-bold text-[#252A28] dark:text-[#F5F1E8] hover:border-[#C96745]"
                  >
                    📲 {isRtl ? "مشاركة" : "Share"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Modals */}
      {selectedPlanForMap && (
        <RouteMapModal plan={selectedPlanForMap} onClose={() => setSelectedPlanForMap(null)} />
      )}
      {splitPlan && (
        <SplitBillModal plan={splitPlan} groupSize={groupSize} onClose={() => setSplitPlan(null)} />
      )}
      {showPollModal && (
        <GroupPollModal plans={plans} onClose={() => setShowPollModal(false)} />
      )}
    </div>
  );
}