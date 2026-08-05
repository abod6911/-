import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BadgeCheck, Clock, MapPin, Sparkles, Star, Wallet, Zap } from "lucide-react";
import heroImage from "@/assets/jeddah-route-hero.jpg";
import { RouteLine } from "@/components/brand/Logo";
import { budgetLevels, getPlace, moodLabels, offers, readyPlans, type Mood } from "@/data/jeddah";
import { getTrendingPlaces } from "@/data/trending";
import { PlaceCard } from "@/components/places/PlaceCard";
import { useLanguage } from "@/context/LanguageContext";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "جِدّاو | JEDDAW — خطط طلعات ذكية في جدة حسب وقتك وميزانيتك" },
      {
        name: "description",
        content:
          "محتار وين تروح اليوم في جدة؟ اختر وقتك وميزانيتك ومودك، وجِدّاو يرتّب لك النشاط والمطعم والقهوة والمسار كاملًا.",
      },
      { property: "og:title", content: "جِدّاو — جدة تبدأ من هنا" },
      { property: "og:description", content: "المواقع الثانية تعطيك أماكن. جِدّاو يرتّب لك الطلعة كاملة." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const quickVibes = [
  { labelAr: "طلعة ترند 🔥", labelEn: "Trending Outing 🔥", emoji: "🔥", mood: "sea" },
  { labelAr: "بعد الدوام", labelEn: "After Work", emoji: "💼", mood: "calm" },
  { labelAr: "بحر وغروب", labelEn: "Sea & Sunset", emoji: "🌊", mood: "sea" },
  { labelAr: "طلعة مع الشلة", labelEn: "With Friends", emoji: "🥳", mood: "games" },
  { labelAr: "موعد لشخصين", labelEn: "Date Night", emoji: "👩‍❤️‍👨", mood: "coffee" },
  { labelAr: "يوم عائلي", labelEn: "Family Day", emoji: "👨‍👩‍👧‍👦", mood: "calm" },
  { labelAr: "جدة بأقل من 100", labelEn: "Under 100 SAR", emoji: "💚", mood: "free" },
  { labelAr: "شيء قريب مني", labelEn: "Near Me", emoji: "📍", mood: "games" },
  { labelAr: "طلعة آخر الليل", labelEn: "Late Night", emoji: "🌙", mood: "food" },
  { labelAr: "أماكن داخلية", labelEn: "Indoor AC", emoji: "🏢", mood: "games" },
  { labelAr: "بدون حجز", labelEn: "No Reservation", emoji: "⚡", mood: "coffee" },
  { labelAr: "أول مرة في جدة", labelEn: "First Time in Jeddah", emoji: "🧳", mood: "culture" },
] as const;

const categories: { mood: Mood | "free"; ar: string; en: string; emoji: string }[] = [
  { mood: "sea", ar: "البحر والغروب", en: "Sea & Sunset", emoji: "🌊" },
  { mood: "games", ar: "ألعاب وترفيه", en: "Games & Action", emoji: "🎮" },
  { mood: "adventure", ar: "مغامرة وتجارب", en: "Adventures", emoji: "🏄" },
  { mood: "calm", ar: "عائلات وأطفال", en: "Family & Kids", emoji: "👨‍👩‍👧‍👦" },
  { mood: "culture", ar: "جدة التاريخية والبلد", en: "Culture & History", emoji: "🏛️" },
  { mood: "food", ar: "مطاعم متميزة", en: "Restaurants", emoji: "🍽️" },
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
          alt="ساحل جدة والبلد التاريخية"
          width={1408}
          height={1104}
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#252A28] via-[#252A28]/70 to-transparent" />

        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24 w-full">
          {/* Small Brand Line */}
          <span className="animate-fade-in-up inline-flex items-center gap-2 rounded-full bg-[#C96745]/20 px-4 py-1.5 text-xs font-bold text-[#FAF6F0] backdrop-blur-md border border-[#C96745]/30">
            <Sparkles className="h-4 w-4 text-[#C96745]" /> {t("slogan")}
          </span>

          {/* Main Headline */}
          <h1 className="animate-fade-in-up delay-1 mt-5 max-w-2xl text-4xl font-extrabold leading-tight md:text-6xl md:leading-[1.1] text-[#FAF6F0]">
            {t("heroTitle")}
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-in-up delay-2 mt-4 max-w-xl text-base leading-relaxed text-[#FAF6F0]/90 md:text-xl font-medium">
            {t("heroDesc")}
          </p>

          {/* Primary & Secondary Buttons */}
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

          {/* Social Proof */}
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

      {/* ===== Core Value Proposition Banner ===== */}
      <section className="bg-[#397C78] text-white py-6">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <p className="text-base md:text-lg font-bold">
            {t("valueProp")}
          </p>
        </div>
      </section>

      {/* ===== Quick Vibe Section (Section 9) ===== */}
      <section className="bg-[#FAF6F0] py-12 border-b border-[#E2D3BE]">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-[#252A28] md:text-3xl">{t("quickVibeTitle")}</h2>
            <p className="text-sm text-[#6E716C] font-semibold mt-1">{t("quickVibeSub")}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {quickVibes.map((chip) => (
              <Link
                key={chip.labelAr}
                to="/quick-plan"
                search={{ mood: chip.mood }}
                className="surface-card group flex flex-col items-center justify-center p-4 text-center hover-lift min-h-[90px]"
              >
                <span className="text-2xl mb-1.5 group-hover:animate-wiggle">{chip.emoji}</span>
                <span className="text-xs font-bold text-[#252A28] group-hover:text-[#C96745] transition-colors">
                  {isRtl ? chip.labelAr : chip.labelEn}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Trending Section: طلعة ترند 🔥 ===== */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#C96745]/15 px-4 py-1 text-xs font-bold text-[#C96745] mb-2">
              <Zap className="h-4 w-4" /> الأثر والأعلى تداولاً
            </div>
            <h2 className="text-3xl font-extrabold text-[#252A28] dark:text-[#F5F1E8] md:text-4xl">
              {t("trendingTitle")}
            </h2>
            <p className="mt-2 text-sm text-[#6E716C] dark:text-[#B5B8B2] font-semibold max-w-xl">
              {t("trendingSub")}
            </p>
          </div>
          <Link
            to="/places"
            className="inline-flex items-center gap-2 rounded-full border border-[#C96745] px-5 py-2.5 text-xs font-bold text-[#C96745] hover:bg-[#C96745] hover:text-white transition-all min-h-[44px]"
          >
            <span>استكشف كل ترندات جدة</span>
            <ArrowLeft className={`h-4 w-4 ${isRtl ? "" : "rotate-180"}`} />
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {getTrendingPlaces().map((item) => (
            <article
              key={item.place.id}
              className="surface-card p-6 hover-lift relative overflow-hidden group border border-[#E2D3BE] dark:border-white/10"
            >
              {/* Rank Badge */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C96745] text-white px-3.5 py-1 text-xs font-extrabold shadow-sm">
                  #{item.rank} {item.badgeAr}
                </span>
                <span className="text-xs font-bold text-[#397C78] dark:text-[#5EAAA5]">
                  🔥 {item.weeklyViews.toLocaleString()} {t("weeklyViewsLabel")}
                </span>
              </div>

              {/* Main Place Card Content */}
              <PlaceCard place={item.place} />

              {/* Trend Reason Box */}
              <div className="mt-3 rounded-xl bg-[#FAF6F0] dark:bg-[#161B1A] p-3 border border-[#E2D3BE]/60 text-xs font-semibold text-[#252A28] dark:text-[#F5F1E8]">
                <span className="text-[#C96745] font-bold me-1">سبب الترند:</span>
                {item.reasonAr}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ===== How It Works Section (Section 10) ===== */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-[#252A28] md:text-4xl">{t("howItWorksTitle")}</h2>
          <p className="mt-3 text-[#6E716C] text-base font-semibold">بدل ما تضيع وقتك بين مئات الأماكن، ثلاث خطوات وبس:</p>
        </div>

        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { step: "1", title: t("step1Title"), desc: t("step1Desc"), emoji: "🎭", color: "bg-[#C96745] text-white" },
            { step: "2", title: t("step2Title"), desc: t("step2Desc"), emoji: "🗺️", color: "bg-[#397C78] text-white" },
            { step: "3", title: t("step3Title"), desc: t("step3Desc"), emoji: "🎉", color: "bg-[#71805B] text-white" },
          ].map((s, i) => (
            <li key={s.step} className="surface-card p-7 hover-lift relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className={`grid h-12 w-12 place-items-center rounded-2xl ${s.color} text-xl font-bold shadow-sm`}>
                  {s.step}
                </span>
                <span className="text-4xl group-hover:animate-wiggle">{s.emoji}</span>
              </div>
              <h3 className="mt-5 font-bold text-xl text-[#252A28]">{s.title}</h3>
              <p className="mt-2 text-sm text-[#6E716C] leading-relaxed">{s.desc}</p>
              {i < 2 && (
                <div className="hidden md:block absolute top-1/2 -end-3 w-6 border-t-2 border-dashed border-[#397C78]/40" />
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* ===== Ready Plans Section ===== */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-[#252A28] md:text-4xl">{t("readyPlansTitle")}</h2>
            <p className="mt-1 text-sm text-[#6E716C]">خطط مجهزة بأسماء وأجواء شبابية</p>
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
          <h2 className="text-2xl font-extrabold text-[#252A28] md:text-4xl">{t("placesTitle")}</h2>
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

      {/* ===== Business CTA Section (Section 21) ===== */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="surface-card relative overflow-hidden bg-[#252A28] p-8 md:p-12 text-[#FAF6F0] md:flex md:items-center md:justify-between md:gap-8 border-none">
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-5 w-5 text-[#C96745]" />
              <span className="text-xs font-bold text-[#C96745] uppercase tracking-wider">
                {isRtl ? "لأصحاب الأماكن والفعاليات" : "For Business Owners"}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-[#FAF6F0] md:text-3xl">{t("businessTitle")}</h2>
            <p className="mt-2 max-w-xl text-sm text-[#FAF6F0]/85 leading-relaxed">{t("businessDesc")}</p>
          </div>
          <Link
            to="/advertise"
            className="relative shrink-0 mt-6 md:mt-0 inline-flex items-center gap-2 rounded-full bg-[#C96745] px-8 py-4 font-bold text-[#FAF6F0] shadow-lift transition-all hover:bg-[#b55837] min-h-[48px]"
          >
            {t("addPlace")}
            <ArrowLeft className={`h-4 w-4 ${isRtl ? "" : "rotate-180"}`} />
          </Link>
        </div>
      </section>
    </div>
  );
}
