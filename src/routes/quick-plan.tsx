import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Compass,
  Edit3,
  MapPin,
  RefreshCw,
  Share2,
  Sparkles,
  Star,
  User,
  Vote,
  Wallet,
} from "lucide-react";
import { PlaceCard } from "@/components/places/PlaceCard";
import {
  districts,
  getDistrict,
  getPlace,
  groupLabels,
  readyPlans,
  type DistrictId,
  type GroupType,
  type Mood,
} from "@/data/jeddah";
import { formatDuration, generatePlans, type GeneratedPlan, type PlanRequest } from "@/lib/planner";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { BillSplitterModal } from "@/components/plan/BillSplitterModal";
import { GroupVotingModal } from "@/components/plan/GroupVotingModal";
import { InteractiveMapModal } from "@/components/plan/InteractiveMapModal";
import { PlanShareCardModal } from "@/components/plan/PlanShareCardModal";
import { OutingTimeline } from "@/components/plan/OutingTimeline";
import { RouteMapModal } from "@/components/planner/RouteMapModal";
import { SplitBillModal } from "@/components/planner/SplitBillModal";
import { GroupPollModal } from "@/components/planner/GroupPollModal";
import { LiveOutingModal } from "@/components/outing/LiveOutingModal";

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

function OptionChip({
  active,
  emoji,
  label,
  subLabel,
  onClick,
}: {
  active: boolean;
  emoji?: string;
  label: string;
  subLabel?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group relative flex items-center gap-3 rounded-2xl border p-4 text-start transition-all duration-200 min-h-[56px] ${
        active
          ? "border-[#C96745] bg-[#C96745] text-white shadow-lift ring-2 ring-[#C96745]/30 scale-[1.02]"
          : "border-[#E2D3BE] dark:border-white/15 bg-[#FAF6F0] dark:bg-[#1A2221] text-[#252A28] dark:text-[#F5F1E8] hover:border-[#C96745] hover:scale-[1.01] active:scale-[0.98]"
      }`}
    >
      {emoji && (
        <span
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-lg transition-transform group-hover:scale-110 ${
            active ? "bg-white/20 text-white" : "bg-[#C96745]/15 text-[#C96745]"
          }`}
        >
          {emoji}
        </span>
      )}
      <div className="flex-1 min-w-0">
        <span className="block text-xs sm:text-sm font-extrabold leading-snug break-words">{label}</span>
        {subLabel && (
          <span className={`block text-[11px] font-medium mt-0.5 break-words ${active ? "text-white/80" : "text-[#6E716C] dark:text-[#B5B8B2]"}`}>
            {subLabel}
          </span>
        )}
      </div>

      {active && <CheckCircle2 className="h-5 w-5 shrink-0 text-white" />}
    </button>
  );
}

function QuickPlanPage() {
  const { t, isRtl } = useLanguage();
  const { savePlan, isPlanSaved } = useAuth();

  const [step, setStep] = useState(0);
  const [districtId, setDistrictId] = useState<DistrictId | "">("");
  const [locationMode, setLocationMode] = useState<"any" | "preset" | "manual">("any");
  const [manualLocation, setManualLocation] = useState<string>("");

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
  const [activeLivePlan, setActiveLivePlan] = useState<{ placeIds: string[]; titleAr: string; titleEn: string } | null>(null);

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
      const selectedDistrict = locationMode === "preset" ? districtId || null : null;
      const req: PlanRequest = {
        districtId: selectedDistrict,
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
        <div className="surface-card p-10 flex flex-col items-center justify-center rounded-3xl border border-[#E2D3BE] dark:border-white/10 shadow-2xl">
          <div className="relative mb-6">
            <span className="text-6xl animate-bounce block">🧭</span>
            <div className="absolute -inset-4 rounded-full bg-[#C96745]/20 blur-xl animate-pulse-glow" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#252A28] dark:text-[#F5F1E8]">{t("loadingHeader")}</h2>
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
        {/* Step Header Badge */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C96745] px-4 py-1.5 text-xs font-black text-white shadow-md">
              <Sparkles className="h-4 w-4" />
              {t("wizardStep")} {step + 1} {t("wizardOf")} {steps.length}
            </span>
            <span className="text-sm font-extrabold text-[#252A28] dark:text-[#F5F1E8]">
              — {steps[step]}
            </span>
          </div>

          <span className="text-xs font-extrabold text-[#397C78] dark:text-[#5EAAA5]">
            {Math.round(((step + 1) / steps.length) * 100)}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-3.5 h-3 w-full rounded-full bg-[#EADECB] dark:bg-white/10 overflow-hidden p-0.5 shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#C96745] to-[#397C78] transition-all duration-500 ease-out"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Wizard Card Box */}
        <div className="surface-card mt-6 p-6 sm:p-8 rounded-3xl border border-[#E2D3BE] dark:border-white/10 shadow-xl bg-[#FAF6F0] dark:bg-[#161B1A] animate-fade-in">
          {/* Step 0: Location */}
          {step === 0 && (
            <fieldset className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#C96745]/15 text-xl">📍</span>
                  <legend className="text-2xl font-black text-[#252A28] dark:text-[#F5F1E8]">
                    {t("step0Title")}
                  </legend>
                </div>
                <p className="text-xs sm:text-sm text-[#6E716C] dark:text-[#B5B8B2] font-semibold">
                  {isRtl
                    ? "حدد مكانك الحالي أو اختر الحي المناسب لتصفية المسافات وتنظيم مشوار الطلعة"
                    : "Select your location in Jeddah to filter distance and optimize your route"}
                </p>
              </div>

              {/* Location Mode Option Selector */}
              <div className="grid gap-3 sm:grid-cols-3">
                <OptionChip
                  active={locationMode === "any"}
                  emoji="🌊"
                  label={t("locationAny")}
                  subLabel={isRtl ? "جدة كاملة بدون تقييد" : "All Jeddah with no limits"}
                  onClick={() => {
                    setLocationMode("any");
                    setDistrictId("");
                  }}
                />

                <OptionChip
                  active={locationMode === "preset"}
                  emoji="🏙️"
                  label={isRtl ? "اختيار حي محدد" : "Select District"}
                  subLabel={isRtl ? "قائمة الأحياء الرئيسية" : "Main neighborhoods"}
                  onClick={() => setLocationMode("preset")}
                />

                <OptionChip
                  active={locationMode === "manual"}
                  emoji="✏️"
                  label={isRtl ? "تحديد يدوي خاص" : "Manual Custom Location"}
                  subLabel={isRtl ? "حي، شارع، أو معلم خاص" : "Custom street or landmark"}
                  onClick={() => setLocationMode("manual")}
                />
              </div>

              {/* Preset Districts Grid */}
              {locationMode === "preset" && (
                <div className="animate-fade-in space-y-3 pt-2">
                  <span className="text-xs font-extrabold text-[#6E716C] dark:text-[#B5B8B2] block">
                    {isRtl ? "اختر الحي الأقرب لكم:" : "Select your nearest district:"}
                  </span>
                  <div className="grid gap-2.5 grid-cols-2 sm:grid-cols-3">
                    {districts.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setDistrictId(d.id)}
                        className={`rounded-2xl border px-4 py-3.5 text-start text-xs sm:text-sm font-bold transition-all min-h-[50px] flex items-center justify-between ${
                          districtId === d.id
                            ? "border-[#C96745] bg-[#C96745] text-white shadow-md scale-[1.02]"
                            : "border-[#E2D3BE] dark:border-white/15 bg-white dark:bg-[#1A2221] text-[#252A28] dark:text-[#F5F1E8] hover:border-[#C96745]"
                        }`}
                      >
                        <span className="truncate">📍 {isRtl ? d.nameAr : d.nameEn}</span>
                        {districtId === d.id && <CheckCircle2 className="h-4 w-4 shrink-0 text-white" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Manual Input Mode */}
              {locationMode === "manual" && (
                <div className="animate-fade-in space-y-3 pt-2">
                  <label className="text-xs font-extrabold text-[#6E716C] dark:text-[#B5B8B2] block">
                    {isRtl
                      ? "أدخل اسم الحي، الشارع، أو نقطة الانطلاق يدويًا:"
                      : "Enter district, street, or landmark manually:"}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={manualLocation}
                      onChange={(e) => setManualLocation(e.target.value)}
                      placeholder={
                        isRtl
                          ? "مثال: حي الشاطئ، كورنيش النورس، شارع التحلية..."
                          : "e.g. Al Shati, North Corniche, Tahlia Street..."
                      }
                      className="w-full rounded-2xl border border-[#E2D3BE] dark:border-white/15 bg-white dark:bg-[#1A2221] p-4 pe-12 text-sm font-bold text-[#252A28] dark:text-[#F5F1E8] placeholder:text-[#6E716C]/60 focus:border-[#C96745] focus:outline-none focus:ring-2 focus:ring-[#C96745]/30 min-h-[54px]"
                    />
                    <Edit3 className="absolute end-4 top-4 h-5 w-5 text-[#C96745]" />
                  </div>
                  <p className="text-[11px] text-[#71805B] font-semibold">
                    {isRtl
                      ? "💡 سيقوم ذكاء جِدّاو بتخصيص خطة الطلعة حول موقعك المدخل بكل دقة!"
                      : "💡 JEDDAW AI will customize your outing around your input location!"}
                  </p>
                </div>
              )}
            </fieldset>
          )}

          {/* Step 1: Group */}
          {step === 1 && (
            <fieldset className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#C96745]/15 text-xl">👥</span>
                  <legend className="text-2xl font-black text-[#252A28] dark:text-[#F5F1E8]">{t("step1Title")}</legend>
                </div>
                <p className="text-xs sm:text-sm text-[#6E716C] dark:text-[#B5B8B2] font-semibold">
                  {isRtl
                    ? "اختر طبيعة المجموعة لترشيح الأماكن المتواكبة مع الخصوصية والأجواء"
                    : "Choose your group type to recommend matching privacy & vibe"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { g: "solo" as const, l: t("groupSolo"), e: "👤" },
                  { g: "duo" as const, l: t("groupDuo"), e: "👩‍❤️‍👨" },
                  { g: "friends" as const, l: t("groupFriends"), e: "👯‍♂️" },
                  { g: "family" as const, l: t("groupFamily"), e: "👨‍👩‍👧‍👦" },
                  { g: "kids" as const, l: t("groupKids"), e: "🎈" },
                  { g: "work" as const, l: t("groupWork"), e: "💼" },
                  { g: "tourists" as const, l: t("groupTourists"), e: "🧳" },
                  { g: "seniors" as const, l: t("groupSeniors"), e: "☕" },
                ].map((item) => (
                  <OptionChip
                    key={item.g}
                    active={group === item.g}
                    emoji={item.e}
                    label={item.l}
                    onClick={() => setGroup(item.g)}
                  />
                ))}
              </div>
            </fieldset>
          )}

          {/* Step 2: Time */}
          {step === 2 && (
            <fieldset className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#C96745]/15 text-xl">⏱️</span>
                  <legend className="text-2xl font-black text-[#252A28] dark:text-[#F5F1E8]">{t("step2Title")}</legend>
                </div>
                <p className="text-xs sm:text-sm text-[#6E716C] dark:text-[#B5B8B2] font-semibold">
                  {isRtl
                    ? "كم ساعة متاحة معكم للطلعة لتحديد عدد المحطات والمسافات؟"
                    : "How many hours do you have for this outing?"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  { m: 100, l: t("durUnder2h"), e: "⚡" },
                  { m: 180, l: t("dur2to4h"), e: "☕" },
                  { m: 300, l: t("dur4to6h"), e: "🌆" },
                  { m: 420, l: t("durHalfDay"), e: "🌙" },
                  { m: 600, l: t("durFullDay"), e: "🚀" },
                ].map((item) => (
                  <OptionChip
                    key={item.m}
                    active={durationMin === item.m}
                    emoji={item.e}
                    label={item.l}
                    onClick={() => setDurationMin(item.m)}
                  />
                ))}
              </div>
            </fieldset>
          )}

          {/* Step 3: Mood */}
          {step === 3 && (
            <fieldset className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#C96745]/15 text-xl">🎭</span>
                  <legend className="text-2xl font-black text-[#252A28] dark:text-[#F5F1E8]">{t("step3Title")}</legend>
                </div>
                <p className="text-xs sm:text-sm text-[#6E716C] dark:text-[#B5B8B2] font-semibold">
                  {isRtl
                    ? "اختر المود والطابع الرئيسي المطلوبة طلعتكم عليه"
                    : "Select the main vibe & mood for your outing"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { m: "food" as const, l: t("moodFood"), e: "🍽️" },
                  { m: "coffee" as const, l: t("moodCoffee"), e: "☕" },
                  { m: "sea" as const, l: t("moodSea"), e: "🌊" },
                  { m: "games" as const, l: t("moodGames"), e: "🎯" },
                  { m: "adventure" as const, l: t("moodAdventure"), e: "🏎️" },
                  { m: "calm" as const, l: t("moodCalm"), e: "🌿" },
                  { m: "culture" as const, l: t("moodCulture"), e: "🏛️" },
                  { m: "shopping" as const, l: t("moodShopping"), e: "🛍️" },
                  { m: "new" as const, l: t("moodNew"), e: "✨" },
                  { m: "surprise" as const, l: t("moodSurprise"), e: "🎁" },
                ].map((item) => (
                  <OptionChip
                    key={item.m}
                    active={mood === item.m}
                    emoji={item.e}
                    label={item.l}
                    onClick={() => setMood(item.m)}
                  />
                ))}
              </div>
            </fieldset>
          )}

          {/* Step 4: Environment */}
          {step === 4 && (
            <fieldset className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#C96745]/15 text-xl">🌿</span>
                  <legend className="text-2xl font-black text-[#252A28] dark:text-[#F5F1E8]">{t("step4Title")}</legend>
                </div>
                <p className="text-xs sm:text-sm text-[#6E716C] dark:text-[#B5B8B2] font-semibold">
                  {isRtl
                    ? "حدد البيئة المناسبة لأجواء الطقس الحالية في جدة"
                    : "Select indoor or outdoor environment preference"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { env: "indoor" as const, l: t("envIndoor"), e: "🏛️" },
                  { env: "outdoor" as const, l: t("envOutdoor"), e: "🌴" },
                  { env: "mix" as const, l: t("envMix"), e: "🔄" },
                  { env: "any" as const, l: t("envAny"), e: "✨" },
                ].map((item) => (
                  <OptionChip
                    key={item.env}
                    active={environment === item.env}
                    emoji={item.e}
                    label={item.l}
                    onClick={() => setEnvironment(item.env)}
                  />
                ))}
              </div>
            </fieldset>
          )}

          {/* Step 5: Budget */}
          {step === 5 && (
            <fieldset className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#C96745]/15 text-xl">💰</span>
                  <legend className="text-2xl font-black text-[#252A28] dark:text-[#F5F1E8]">{t("step5Title")}</legend>
                </div>
                <p className="text-xs sm:text-sm text-[#6E716C] dark:text-[#B5B8B2] font-semibold">
                  {isRtl
                    ? "الميزانية التقديرية للشخص الواحد للطلعة كاملة"
                    : "Estimated budget per person for the complete outing"}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { tKey: "economy" as const, title: t("budgetEconoTitle"), sub: t("budgetEconoSub"), val: 60, e: "💸" },
                  { tKey: "balanced" as const, title: t("budgetMidTitle"), sub: t("budgetMidSub"), val: 150, e: "💰" },
                  { tKey: "premium" as const, title: t("budgetOpenTitle"), sub: t("budgetOpenSub"), val: 350, e: "👑" },
                ].map((item) => (
                  <OptionChip
                    key={item.tKey}
                    active={budgetTier === item.tKey}
                    emoji={item.e}
                    label={item.title}
                    subLabel={item.sub}
                    onClick={() => {
                      setBudgetTier(item.tKey);
                      setBudgetPerPerson(item.val);
                    }}
                  />
                ))}
              </div>
            </fieldset>
          )}

          {/* Step 6: Preferences */}
          {step === 6 && (
            <fieldset className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#C96745]/15 text-xl">⚙️</span>
                  <legend className="text-2xl font-black text-[#252A28] dark:text-[#F5F1E8]">{t("step6Title")}</legend>
                </div>
                <p className="text-xs sm:text-sm text-[#6E716C] dark:text-[#B5B8B2] font-semibold">
                  {isRtl
                    ? "حدد أي تفضيلات تشغيلية تحب نراعيها عند ابتكار الخطة"
                    : "Select operational preferences to include in your plan"}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { key: "noCrowd", l: t("prefNoCrowd"), e: "🤫" },
                  { key: "easyParking", l: t("prefEasyParking"), e: "🅿️" },
                  { key: "noLongDrive", l: t("prefNoLongDrive"), e: "🚗" },
                  { key: "kidsFriendly", l: t("prefKidsFriendly"), e: "👶" },
                  { key: "calm", l: t("prefCalm"), e: "🌿" },
                  { key: "indoorOnly", l: t("prefIndoor"), e: "❄️" },
                  { key: "wheelchair", l: t("prefWheelchair"), e: "♿" },
                  { key: "noReservation", l: t("prefNoReservation"), e: "🎟️" },
                  { key: "vegan", l: t("prefVegan"), e: "🥗" },
                  { key: "none", l: t("prefNone"), e: "✨" },
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
                    className={`flex items-center justify-between rounded-2xl border p-4 text-start font-bold transition-all min-h-[54px] ${
                      prefs[item.key as keyof typeof prefs]
                        ? "border-[#C96745] bg-[#C96745] text-white shadow-lift scale-[1.01]"
                        : "border-[#E2D3BE] dark:border-white/15 bg-white dark:bg-[#1A2221] text-[#252A28] dark:text-[#F5F1E8] hover:border-[#C96745]"
                    }`}
                  >
                    <span className="flex items-center gap-2.5 text-xs sm:text-sm">
                      <span className="text-lg">{item.e}</span>
                      <span>{item.l}</span>
                    </span>
                    {prefs[item.key as keyof typeof prefs] ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-white" />
                    ) : (
                      <span className="h-5 w-5 rounded-full border-2 border-[#E2D3BE] dark:border-white/20" />
                    )}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          {/* Navigation Controls */}
          <div className="mt-8 flex items-center justify-between gap-3 border-t border-[#E2D3BE] dark:border-white/10 pt-6">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="inline-flex items-center gap-2 rounded-full border border-[#E2D3BE] dark:border-white/15 bg-white dark:bg-[#1A2221] px-6 py-3 text-xs sm:text-sm font-extrabold text-[#252A28] dark:text-[#F5F1E8] transition-all hover:border-[#C96745] disabled:opacity-40 min-h-[48px]"
            >
              {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
              {t("prev")}
            </button>

            {step < steps.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="inline-flex items-center gap-2 rounded-full bg-[#397C78] px-8 py-3.5 text-xs sm:text-sm font-extrabold text-white shadow-lift transition-all hover:bg-[#2e6562] min-h-[48px]"
              >
                {t("next")} {isRtl ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => build()}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#C96745] to-[#397C78] px-9 py-3.5 text-xs sm:text-sm font-black text-white shadow-lift transition-all hover:opacity-95 animate-pulse-glow min-h-[48px]"
              >
                <Sparkles className="h-5 w-5" /> {t("generateFinal")}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* Generated Results Screen */
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="animate-fade-in-up flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#252A28] dark:text-[#F5F1E8] md:text-4xl">{t("resultsHeader")}</h1>
          <p className="mt-2 text-[#6E716C] dark:text-[#B5B8B2] font-semibold max-w-2xl">
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
            className="inline-flex items-center gap-1.5 rounded-full border border-[#E2D3BE] dark:border-white/15 bg-[#FAF6F0] dark:bg-[#161B1A] px-4 py-2.5 text-sm font-bold text-[#252A28] dark:text-[#F5F1E8] transition-all hover:border-[#C96745] hover:shadow-sm"
          >
            <RefreshCw className="h-4 w-4 text-[#C96745]" /> {a.label}
          </button>
        ))}
      </div>

      {/* 3 Generated Plans Grid */}
      <div className="animate-fade-in-up delay-2 mt-8 grid gap-6 lg:grid-cols-3">
        {plans.slice(0, 3).map((plan, idx) => {
          const isSaved = isPlanSaved(plan.id);
          const planTag = idx === 0 ? t("plan1Tag") : idx === 1 ? t("plan2Tag") : t("plan3Tag");
          const planBadge = idx === 1 ? t("plan2Badge") : idx === 2 ? t("plan3Badge") : null;

          return (
            <article
              key={plan.id}
              className={`surface-card flex flex-col justify-between p-6 hover-lift border border-[#E2D3BE] dark:border-white/10 ${
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

                <h2 className="mt-4 text-2xl font-extrabold text-[#252A28] dark:text-[#F5F1E8]">
                  {isRtl ? plan.titleAr : (plan.subtitleAr || plan.titleAr)}
                </h2>
                <p className="mt-1 text-sm text-[#6E716C] dark:text-[#B5B8B2] font-semibold">
                  {isRtl ? plan.subtitleAr : "Curated Jeddah outing with optimal route & budget"}
                </p>

                {/* Timeline stops */}
                <ol className="mt-6 space-y-4 border-t border-[#E2D3BE] dark:border-white/10 pt-4">
                  {plan.stops.map((stop, i) => (
                    <li key={stop.place.id} className="relative ps-7">
                      <span className="absolute start-0 top-1 grid h-5 w-5 place-items-center rounded-full bg-[#397C78] text-[11px] font-bold text-white">
                        {i + 1}
                      </span>
                      {i < plan.stops.length - 1 && (
                        <span className="route-dashed absolute start-[9px] top-7 bottom-[-14px]" />
                      )}
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-[#252A28] dark:text-[#F5F1E8]">{isRtl ? stop.place.nameAr : stop.place.nameEn}</p>
                        <button
                          onClick={() => build()}
                          className="text-xs font-bold text-[#C96745] hover:underline"
                        >
                          {t("swapPlace")}
                        </button>
                      </div>
                      <p className="text-xs text-[#6E716C] dark:text-[#B5B8B2] mt-0.5 font-medium">
                        {isRtl ? getDistrict(stop.place.districtId).nameAr : getDistrict(stop.place.districtId).nameEn} · {stop.place.durationMin} {isRtl ? "دقيقة" : "mins"}
                      </p>
                      <p className="mt-1 text-[11px] text-[#71805B] font-semibold">
                        {isRtl ? "💡 اخترناه لأنه قريب وفي مسار الخطة ومناسب لميزانيتكم" : "💡 Selected: Nearby, budget-friendly & optimal route"}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-6 border-t border-[#E2D3BE] dark:border-white/10 pt-4">
                <div className="flex items-center justify-between text-sm font-bold text-[#252A28] dark:text-[#F5F1E8] mb-4">
                  <span className="text-[#C96745] font-black">
                    {plan.pricePerPerson} {isRtl ? "ر.س / للشخص" : "SAR / person"}
                  </span>
                  <span className="text-[#6E716C] dark:text-[#B5B8B2] text-xs font-semibold">
                    ⏱️ {formatDuration(plan.durationMin, isRtl)}
                  </span>
                </div>

                {/* Primary Action Button: Start Live Outing */}
                <button
                  onClick={() => setActiveLivePlan({ placeIds: plan.stops.map((s) => s.place.id), titleAr: plan.titleAr, titleEn: plan.subtitleAr })}
                  className="w-full rounded-full bg-gradient-to-r from-[#C96745] to-[#397C78] px-4 py-3 text-xs font-black text-white shadow-lift hover:opacity-95 transition-all min-h-[44px] flex items-center justify-center gap-2 mb-2 animate-pulse-glow"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{isRtl ? "🚀 ابدأ الطلعة الآن (الوضع المباشر)" : "🚀 Start Live Outing Now"}</span>
                </button>

                {/* Secondary Actions */}
                <div className="grid grid-cols-3 gap-1.5 mt-2">
                  <button
                    onClick={() => savePlan(plan)}
                    className={`rounded-full border px-2.5 py-2 text-center text-[11px] font-bold transition-all ${
                      isSaved
                        ? "bg-[#397C78] text-white border-[#397C78]"
                        : "border-[#E2D3BE] dark:border-white/15 bg-[#FAF6F0] dark:bg-[#161B1A] text-[#252A28] dark:text-[#F5F1E8] hover:border-[#397C78]"
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

      {activeLivePlan && (
        <LiveOutingModal
          initialPlaceIds={activeLivePlan.placeIds}
          titleAr={activeLivePlan.titleAr}
          titleEn={activeLivePlan.titleEn}
          onClose={() => setActiveLivePlan(null)}
        />
      )}

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