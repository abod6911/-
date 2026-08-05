import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BadgeCheck, Clock, MapPin, Sparkles, Star, Wallet, Zap } from "lucide-react";
import heroImage from "@/assets/jeddah-route-hero.jpg";
import { RouteLine } from "@/components/brand/Logo";
import { budgetLevels, getPlace, moodLabels, offers, readyPlans, type Mood } from "@/data/jeddah";
import { useLanguage } from "@/context/LanguageContext";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "وش الخطة؟ | خطط طلعتك في جدة — وقتك علينا والتنفيذ عليك" },
      {
        name: "description",
        content:
          "مو عارف وين تروح؟ عطنا وقتك ومودك وميزانيتك، ونرتب لك خروجة كاملة في جدة: نشاط، مطعم، قهوة، والمسار بالترتيب.",
      },
      { property: "og:title", content: "وش الخطة؟ — طلعتك في جدة مرتّبة" },
      { property: "og:description", content: "أنت عطنا الوقت، والباقي علينا. خطط خروجات مرتبة داخل جدة." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const quickChips = [
  { labelAr: "بعد الدوام", labelEn: "After Work", emoji: "💼", mood: "calm" },
  { labelAr: "بحر وغروب", labelEn: "Sea & Sunset", emoji: "🌊", mood: "sea" },
  { labelAr: "طلعة عائلية", labelEn: "Family Outing", emoji: "👨‍👩‍👧‍👦", mood: "calm" },
  { labelAr: "موعد لشخصين", labelEn: "Date Night", emoji: "👩‍❤️‍👨", mood: "coffee" },
  { labelAr: "خروجة اقتصادية", labelEn: "Budget Friendly", emoji: "💚", mood: "free" },
  { labelAr: "آخر الليل", labelEn: "Late Night", emoji: "🌙", mood: "food" },
  { labelAr: "يوم كامل", labelEn: "Full Day", emoji: "☀️", mood: "adventure" },
  { labelAr: "شيء قريب مني", labelEn: "Near Me", emoji: "📍", mood: "games" },
] as const;

const categories: { mood: Mood | "free"; ar: string; en: string; emoji: string }[] = [
  { mood: "sea", ar: "البحر والغروب", en: "Sea & Sunset", emoji: "🌊" },
  { mood: "games", ar: "ألعاب داخلية", en: "Indoor Games", emoji: "🎮" },
  { mood: "adventure", ar: "مغامرات وحركة", en: "Adventures", emoji: "🏄" },
  { mood: "calm", ar: "عائلات وأطفال", en: "Family & Kids", emoji: "👨‍👩‍👧‍👦" },
  { mood: "culture", ar: "ثقافة وتاريخ البلد", en: "Culture & History", emoji: "🏛️" },
  { mood: "food", ar: "مطاعم وجبات", en: "Restaurants", emoji: "🍽️" },
  { mood: "coffee", ar: "مقاهي وحلى", en: "Cafes & Sweets", emoji: "☕" },
  { mood: "shopping", ar: "تسوق وتمشية", en: "Shopping", emoji: "🛍️" },
  { mood: "free", ar: "أماكن مجانية", en: "Free Spots", emoji: "✨" },
];

function Index() {
  const { t, isRtl } = useLanguage();

  return (
    <div>
      {/* ===== Hero Section ===== */}
      <section className="relative overflow-hidden bg-[#252A28] text-[#FAF6F0] min-h-[540px] md:min-h-[620px] flex items-center">
        {/* Background Jeddah image with gradient overlay */}
        <img
          src={heroImage}
          alt="ساحل جدة والبلد التاريخية وقت الغروب"
          width={1408}
          height={1104}
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        {/* Gradient overlays matching Terracotta & Sand tone */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#252A28] via-[#252A28]/70 to-transparent" />

        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24 w-full">
          {/* Badge */}
          <span className="animate-fade-in-up inline-flex items-center gap-2 rounded-full bg-[#C96745]/20 px-4 py-1.5 text-xs font-bold text-[#FAF6F0] backdrop-blur-md border border-[#C96745]/30">
            <Sparkles className="h-4 w-4 text-[#C96745]" /> {t("heroBadge")}
          </span>

          {/* Title */}
          <h1 className="animate-fade-in-up delay-1 mt-5 max-w-2xl text-4xl font-extrabold leading-tight md:text-6xl md:leading-[1.1] text-[#FAF6F0]">
            {t("heroTitle")}
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-in-up delay-2 mt-4 max-w-xl text-base leading-relaxed text-[#FAF6F0]/90 md:text-xl font-medium">
            {t("heroDesc")}
          </p>

          {/* CTA Buttons */}
          <div className="animate-fade-in-up delay-3 mt-8 flex flex-wrap gap-4 items-center">
            <Link
              to="/quick-plan"
              className="group inline-flex items-center gap-2.5 rounded-full bg-[#C96745] px-8 py-4 text-base font-bold text-[#FAF6F0] shadow-lift transition-all duration-300 hover:-translate-y-1 hover:bg-[#b55837] animate-pulse-glow min-h-[52px]"
            >
              <Sparkles className="h-5 w-5" />
              {t("quickPlan")}
              <ArrowLeft className={`h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1 ${isRtl ? "" : "rotate-180 group-hover:translate-x-1"}`} />
            </Link>
            <Link
              to="/places"
              className="inline-flex items-center gap-2 rounded-full border border-[#FAF6F0]/30 px-7 py-4 text-base font-semibold text-[#FAF6F0] backdrop-blur-sm transition-all duration-300 hover:bg-[#FAF6F0]/15 hover:border-[#FAF6F0]/60 min-h-[52px]"
            >
              {t("explorePlaces")}
            </Link>
          </div>

          {/* Social Proof Stats Bar */}
          <div className="animate-fade-in-up delay-4 mt-10 inline-flex items-center gap-3 rounded-2xl bg-[#FAF6F0]/10 border border-[#FAF6F0]/15 px-5 py-3 backdrop-blur-md">
            <span className="flex -space-x-2 overflow-hidden">
              <span className="inline-block h-7 w-7 rounded-full bg-[#C96745] text-center text-xs font-bold text-white leading-7">🔥</span>
              <span className="inline-block h-7 w-7 rounded-full bg-[#397C78] text-center text-xs font-bold text-white leading-7">🌊</span>
              <span className="inline-block h-7 w-7 rounded-full bg-[#E4A23B] text-center text-xs font-bold text-white leading-7">✨</span>
            </span>
            <span className="text-sm font-semibold text-[#FAF6F0]">
              {t("socialProof")}
            </span>
          </div>
        </div>
      </section>

      {/* ===== Quick Chips Section ===== */}
      <section className="bg-[#FAF6F0] py-8 border-b border-[#E2D3BE]">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-bold text-[#6E716C] uppercase tracking-wider">
              {isRtl ? "اختيارات سريعة لمودك:" : "Quick Outing Options:"}
            </span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {quickChips.map((chip) => (
              <Link
                key={chip.labelAr}
                to="/quick-plan"
                search={{ mood: chip.mood }}
                className="inline-flex items-center gap-2 rounded-full bg-[#F4EBDD] border border-[#E2D3BE] px-4 py-2.5 text-sm font-bold text-[#252A28] transition-all duration-200 hover:border-[#C96745] hover:bg-[#C96745]/10 hover-scale"
              >
                <span>{chip.emoji}</span>
                <span>{isRtl ? chip.labelAr : chip.labelEn}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== How It Works Section (3 Steps) ===== */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-[#252A28] md:text-4xl">{t("howItWorksTitle")}</h2>
          <p className="mt-3 text-[#6E716C] text-base">بدل ما تضيع وقتك بالبحث واللف والزحمة، ثلاث خطوات وبس:</p>
        </div>

        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { step: "1", text: isRtl ? "عطنا وقتك ومودك وميزانيتك" : "Share your time, vibe & budget", emoji: "⏱️", color: "bg-[#C96745] text-white" },
            { step: "2", text: isRtl ? "نرتب لك الأماكن والمسار بدون لف جدة كلها" : "We map your route with no extra drive", emoji: "🗺️", color: "bg-[#397C78] text-white" },
            { step: "3", text: isRtl ? "اطلع واستمتع بخطتك المرتّبة" : "Go out and enjoy your plan", emoji: "🎉", color: "bg-[#71805B] text-white" },
          ].map((s, i) => (
            <li key={s.step} className="surface-card p-7 hover-lift relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className={`grid h-12 w-12 place-items-center rounded-2xl ${s.color} text-xl font-bold shadow-sm`}>
                  {s.step}
                </span>
                <span className="text-4xl group-hover:animate-wiggle">{s.emoji}</span>
              </div>
              <p className="mt-5 font-bold text-lg leading-snug text-[#252A28]">{s.text}</p>
              {i < 2 && (
                <div className="hidden md:block absolute top-1/2 -end-3 w-6 border-t-2 border-dashed border-[#397C78]/40" />
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* ===== Budgets Section ===== */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-[#252A28] md:text-4xl">{t("budgetsTitle")}</h2>
        </div>
        <RouteLine className="mt-3 h-6 w-48 opacity-60" />

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {(["economy", "balanced", "premium"] as const).map((level, i) => (
            <Link
              key={level}
              to="/quick-plan"
              search={{ budget: level }}
              className="surface-card group p-7 hover-lift relative overflow-hidden"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <span className="relative inline-flex items-center gap-2 rounded-full bg-[#F4EBDD] px-4 py-1.5 text-xs font-bold text-[#252A28] border border-[#E2D3BE]">
                <Wallet className="h-4 w-4 text-[#C96745]" /> {budgetLevels[level].rangeAr}
              </span>
              <h3 className="relative mt-4 text-2xl font-bold text-[#252A28]">{isRtl ? budgetLevels[level].ar : budgetLevels[level].ar}</h3>
              <p className="relative mt-2 text-sm text-[#6E716C] leading-relaxed">{budgetLevels[level].subAr}</p>
              <span className="relative mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#C96745] group-hover:gap-3 transition-all">
                {t("arrangePlan")}
                <ArrowLeft className={`h-4 w-4 ${isRtl ? "" : "rotate-180"}`} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== Ready Plans Section ===== */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-[#252A28] md:text-4xl">{t("readyPlansTitle")}</h2>
            <p className="mt-1 text-sm text-[#6E716C]">خطط مجهزة بأدق التفاصيل والمحطات</p>
          </div>
          <Link to="/plans" className="shrink-0 text-sm font-bold text-[#397C78] hover:underline underline-offset-4">
            {t("allPlans")} →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {readyPlans.slice(0, 6).map((plan) => {
            const price = plan.stops.reduce((s, id) => s + getPlace(id).pricePerPerson, 0);
            const mins = plan.stops.reduce((s, id) => s + getPlace(id).durationMin, 0);
            return (
              <article key={plan.id} className="surface-card p-6 hover-lift group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-[#C96745]/15 px-3 py-1 text-xs font-bold text-[#C96745]">
                      {plan.tagAr}
                    </span>
                    <span className="text-xs font-bold text-[#6E716C] flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-[#E4A23B] fill-[#E4A23B]" />
                      {budgetLevels[plan.budget].ar}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-[#252A28] group-hover:text-[#C96745] transition-colors">
                    {isRtl ? plan.titleAr : plan.titleEn}
                  </h3>
                  <p className="mt-2 text-sm text-[#6E716C] line-clamp-2 leading-relaxed">{plan.descAr}</p>

                  <ul className="mt-5 space-y-2.5 border-t border-[#E2D3BE] pt-4 text-sm">
                    {plan.stops.map((id, i) => (
                      <li key={id} className="flex items-center gap-3">
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#397C78] text-[11px] font-bold text-white shadow-sm">
                          {i + 1}
                        </span>
                        <span className="truncate font-medium text-[#252A28]">
                          {isRtl ? getPlace(id).nameAr : getPlace(id).nameEn}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-[#E2D3BE] pt-4 text-[13px] text-[#6E716C]">
                  <span className="flex items-center gap-1.5">
                    <Wallet className="h-3.5 w-3.5 text-[#C96745]" />
                    <span className="font-bold text-[#252A28]">{price} {isRtl ? "ر.س" : "SAR"}</span> {t("perPerson")}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-[#397C78]" />
                    {Math.round(mins / 60)} {t("hours")}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-[#6E716C]" />
                    {plan.stops.length} {t("stations")}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ===== Categories Section ===== */}
      <section className="bg-[#FAF6F0] py-16 border-y border-[#E2D3BE]">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-extrabold text-[#252A28] md:text-4xl">{t("categoriesTitle")}</h2>
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {categories.map((c) => (
              <Link
                key={c.ar}
                to="/places"
                className="surface-card group flex items-center gap-4 p-5 hover-lift"
              >
                <span className="text-3xl group-hover:animate-wiggle">{c.emoji}</span>
                <div>
                  <span className="text-base font-bold text-[#252A28] block group-hover:text-[#C96745] transition-colors">
                    {isRtl ? c.ar : c.en}
                  </span>
                  <span className="text-xs font-semibold text-[#6E716C]">
                    {c.mood === "free" ? t("noCost") : moodLabels[c.mood]}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Offers Section ===== */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-extrabold text-[#252A28] md:text-4xl">{t("offersTitle")}</h2>
          <Link to="/offers" className="shrink-0 text-sm font-bold text-[#397C78] hover:underline underline-offset-4">
            {t("allOffers")} →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {offers.slice(0, 3).map((offer) => {
            const place = getPlace(offer.placeId);
            return (
              <article key={offer.id} className="surface-card p-6 hover-lift relative overflow-hidden">
                {offer.price < offer.original && (
                  <div className="absolute top-0 end-0 bg-[#C96745] text-white text-xs font-bold px-3 py-1.5 rounded-bl-xl shadow-sm">
                    {Math.round((1 - offer.price / offer.original) * 100)}% {isRtl ? "خصم" : "OFF"}
                  </div>
                )}
                {offer.sponsored && (
                  <span className="rounded-full bg-[#252A28] px-2.5 py-1 text-[11px] font-bold text-[#FAF6F0]">
                    {t("sponsored")}
                  </span>
                )}
                <h3 className="mt-4 text-lg font-bold text-[#252A28]">{offer.titleAr}</h3>
                <p className="mt-1 text-sm text-[#6E716C]">
                  {isRtl ? place.nameAr : place.nameEn}
                </p>
                <p className="mt-4 flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-[#C96745]">
                    {offer.price === 0 ? t("free") : `${offer.price}`}
                  </span>
                  {offer.price > 0 && <span className="text-sm font-semibold text-[#6E716C]">{isRtl ? "ر.س" : "SAR"}</span>}
                  <span className="text-sm font-medium text-[#6E716C] line-through">
                    {offer.original} {isRtl ? "ر.س" : "SAR"}
                  </span>
                </p>
                <p className="mt-3 flex items-center gap-1 text-xs text-[#71805B] font-bold">
                  <BadgeCheck className="h-4 w-4" /> {t("verifiedAt")} {offer.verifiedAt}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* ===== Business CTA Section ===== */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="surface-card relative overflow-hidden bg-[#252A28] p-8 md:p-12 text-[#FAF6F0] md:flex md:items-center md:justify-between md:gap-8 border-none">
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-5 w-5 text-[#C96745]" />
              <span className="text-xs font-bold text-[#C96745] uppercase tracking-wider">
                {isRtl ? "فرصة للأعمال" : "Business Opportunity"}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-[#FAF6F0] md:text-3xl">{t("businessTitle")}</h2>
            <p className="mt-2 max-w-xl text-sm text-[#FAF6F0]/85 leading-relaxed">{t("businessDesc")}</p>
          </div>
          <Link
            to="/advertise"
            className="relative shrink-0 mt-6 md:mt-0 inline-flex items-center gap-2 rounded-full bg-[#C96745] px-8 py-4 font-bold text-[#FAF6F0] shadow-lift transition-all hover:bg-[#b55837] min-h-[48px]"
          >
            {t("joinPartner")}
            <ArrowLeft className={`h-4 w-4 ${isRtl ? "" : "rotate-180"}`} />
          </Link>
        </div>
      </section>
    </div>
  );
}
