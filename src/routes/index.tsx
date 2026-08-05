import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BadgeCheck, Clock, MapPin, Navigation, Sparkles, Star, Wallet, Zap } from "lucide-react";
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
      {/* ===== Vibrant Coastal Hero Section ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1A3330] via-[#244A47] to-[#5C3224] text-white min-h-[580px] md:min-h-[640px] flex items-center pt-8 pb-16">
        {/* Background Image with Warm Coastal Blend */}
        <img
          src={heroImage}
          alt="غروب ساحل جدة والبلد"
          width={1408}
          height={1104}
          className="absolute inset-0 h-full w-full object-cover opacity-50 mix-blend-overlay"
        />
        
        {/* Coastal Sunset Radial Glows */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#161B1A] via-transparent to-black/20" />
        <div className="absolute -top-32 end-0 h-[450px] w-[450px] rounded-full bg-[#C96745]/30 blur-3xl" />
        <div className="absolute -bottom-32 start-0 h-[450px] w-[450px] rounded-full bg-[#397C78]/40 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-4 text-center w-full">
          {/* Small Brand Tagline Badge */}
          <div className="animate-fade-in-up inline-flex items-center gap-2 rounded-full bg-[#FAF6F0]/15 px-5 py-2 text-xs font-extrabold text-white backdrop-blur-md border border-white/25 shadow-lg">
            <Sparkles className="h-4 w-4 text-[#E4A23B] animate-pulse" />
            <span>{t("slogan")}</span>
          </div>

          {/* Main Headline */}
          <h1 className="animate-fade-in-up delay-1 mt-6 text-3xl font-black leading-relaxed md:text-5xl md:leading-[1.4] text-white">
            {isRtl ? "محتار وين تروح اليوم؟" : "Wondering Where to Go Today?"} <br className="hidden md:inline" />
            <span className="bg-gradient-to-r from-[#FF9D7A] via-[#F4EBDD] to-[#5EAAA5] bg-clip-text text-transparent block mt-2">
              {isRtl ? "جِدّاو يرتّب لك الطلعة كاملة" : "JEDDAW Plans Your Complete Outing"}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-in-up delay-2 mt-5 mx-auto max-w-2xl text-base leading-relaxed text-white/90 md:text-lg font-semibold">
            {t("heroDesc")}
          </p>

          {/* Primary & Secondary Buttons */}
          <div className="animate-fade-in-up delay-3 mt-9 flex flex-wrap gap-4 items-center justify-center">
            <Link
              to="/quick-plan"
              className="group inline-flex items-center gap-3 rounded-full bg-[#C96745] px-9 py-4 text-base font-black text-white shadow-lift transition-all duration-300 hover:-translate-y-1 hover:bg-[#b55837] animate-pulse-glow min-h-[56px]"
            >
              <Sparkles className="h-5 w-5" />
              <span>{t("quickPlan")}</span>
              <ArrowLeft className={`h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1 ${isRtl ? "" : "rotate-180 group-hover:translate-x-1"}`} />
            </Link>
            <Link
              to="/places"
              className="inline-flex items-center gap-2.5 rounded-full bg-white/10 border border-white/30 px-8 py-4 text-base font-bold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:border-white/60 min-h-[56px]"
            >
              <Navigation className="h-4 w-4" />
              <span>{t("explorePlaces")}</span>
            </Link>
          </div>

          {/* Social Proof Floating Pill */}
          <div className="animate-fade-in-up delay-4 mt-10 inline-flex items-center gap-3 rounded-full bg-black/40 border border-white/20 px-6 py-2.5 backdrop-blur-md shadow-md">
            <span className="flex -space-x-2 overflow-hidden">
              <span className="inline-block h-6 w-6 rounded-full bg-[#C96745] text-center text-xs font-bold text-white leading-6 shadow-sm">🔥</span>
              <span className="inline-block h-6 w-6 rounded-full bg-[#397C78] text-center text-xs font-bold text-white leading-6 shadow-sm">🌊</span>
              <span className="inline-block h-6 w-6 rounded-full bg-[#E4A23B] text-center text-xs font-bold text-white leading-6 shadow-sm">✨</span>
            </span>
            <span className="text-xs md:text-sm font-bold text-white/95">
              {t("socialProof")}
            </span>
          </div>
        </div>
      </section>

      {/* ===== Floating Core Value Proposition Banner ===== */}
      <div className="relative z-30 -mt-10 mx-auto max-w-5xl px-4">
        <div className="rounded-3xl bg-gradient-to-r from-[#295652] via-[#397C78] to-[#C96745] text-white p-6 md:p-8 shadow-2xl border border-white/20 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-lg">
          <div className="text-center md:text-start">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF9D7A] block mb-2">
              {isRtl ? "💡 ليش اختاروا جِدّاو؟" : "💡 Why Choose JEDDAW?"}
            </span>
            <p className="text-base md:text-lg font-extrabold text-white leading-relaxed">
              {isRtl ? (
                <>
                  المواقع الثانية تعطيك أماكن. <span className="underline underline-offset-6 decoration-[#FF9D7A]">جِدّاو يرتّب لك الطلعة كاملة.</span>
                </>
              ) : (
                <>
                  Other sites give you locations. <span className="underline underline-offset-6 decoration-[#FF9D7A]">JEDDAW plans your complete outing.</span>
                </>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold mt-2 md:mt-0">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/25 px-4 py-2 border border-white/15">
              {isRtl ? "⚡ تخطيط فوري" : "⚡ Instant Planning"}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/25 px-4 py-2 border border-white/15">
              {isRtl ? "💰 موزون على ميزانيتك" : "💰 Budget-Friendly"}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/25 px-4 py-2 border border-white/15">
              {isRtl ? "📍 مسار وخرائط مجهزة" : "📍 Turn-by-Turn Route"}
            </span>
          </div>
        </div>
      </div>

      {/* ===== Coastal Warm Quick Vibe Section ===== */}
      <section className="bg-gradient-to-b from-[#F4EBDD] via-[#FAF6F0] to-[#F4EBDD] dark:from-[#121817] dark:via-[#192322] dark:to-[#121817] pt-20 pb-16 border-b border-[#E2D3BE]/80 dark:border-white/10 relative">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 flex flex-col items-center text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C96745]/15 dark:bg-[#C96745]/25 px-4 py-1 text-xs font-extrabold text-[#C96745] dark:text-[#FF9D7A] mb-2 border border-[#C96745]/20">
              ✨ اختاروا جوّكم السريع
            </span>
            <h2 className="text-3xl font-black text-[#252A28] dark:text-[#F5F1E8] md:text-4xl">
              {t("quickVibeTitle")}
            </h2>
            <p className="text-sm text-[#6E716C] dark:text-[#B5B8B2] font-semibold mt-1.5 max-w-md">
              {t("quickVibeSub")}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
            {quickVibes.map((chip) => (
              <Link
                key={chip.labelAr}
                to="/quick-plan"
                search={{ mood: chip.mood }}
                className="group relative flex flex-col items-center justify-center p-4 text-center rounded-2xl bg-white/90 dark:bg-[#1F2B2A] border border-[#E2D3BE] dark:border-white/15 shadow-sm hover-lift min-h-[96px] transition-all hover:border-[#C96745] dark:hover:border-[#C96745] hover:shadow-lift"
              >
                {/* Accent top gradient on hover */}
                <div className="absolute top-0 inset-x-0 h-1 rounded-t-2xl bg-gradient-to-r from-[#C96745] via-[#E4A23B] to-[#397C78] opacity-0 group-hover:opacity-100 transition-opacity" />

                <span className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                  {chip.emoji}
                </span>
                <span className="text-xs font-bold text-[#252A28] dark:text-[#F5F1E8] group-hover:text-[#C96745] dark:group-hover:text-[#FF9D7A] transition-colors leading-tight">
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

      {/* ===== How It Works Section ===== */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-[#252A28] dark:text-[#F5F1E8] md:text-4xl">{t("howItWorksTitle")}</h2>
          <p className="mt-3 text-[#6E716C] dark:text-[#B5B8B2] text-base font-semibold">بدل ما تضيع وقتك بين مئات الأماكن، ثلاث خطوات وبس:</p>
        </div>

        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { step: "1", title: t("howStep1Title"), desc: t("howStep1Desc"), emoji: "🎭", color: "bg-[#C96745] text-white" },
            { step: "2", title: t("howStep2Title"), desc: t("howStep2Desc"), emoji: "🗺️", color: "bg-[#397C78] text-white" },
            { step: "3", title: t("howStep3Title"), desc: t("howStep3Desc"), emoji: "🎉", color: "bg-[#71805B] text-white" },
          ].map((s, i) => (
            <li key={s.step} className="surface-card p-7 hover-lift relative overflow-hidden group border border-[#E2D3BE] dark:border-white/10">
              <div className="flex items-center justify-between">
                <span className={`grid h-12 w-12 place-items-center rounded-2xl ${s.color} text-xl font-bold shadow-sm`}>
                  {s.step}
                </span>
                <span className="text-4xl group-hover:animate-wiggle">{s.emoji}</span>
              </div>
              <h3 className="mt-5 font-bold text-xl text-[#252A28] dark:text-[#F5F1E8]">{s.title}</h3>
              <p className="mt-2 text-sm text-[#6E716C] dark:text-[#B5B8B2] leading-relaxed">{s.desc}</p>
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
            <h2 className="text-2xl font-extrabold text-[#252A28] dark:text-[#F5F1E8] md:text-4xl">{t("readyPlansTitle")}</h2>
            <p className="mt-1 text-sm text-[#6E716C] dark:text-[#B5B8B2]">خطط مجهزة بأسماء وأجواء شبابية</p>
          </div>
          <Link to="/plans" className="shrink-0 text-sm font-bold text-[#397C78] dark:text-[#5EAAA5] hover:underline underline-offset-4">
            {t("allPlans")} →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {readyPlans.slice(0, 6).map((plan) => {
            const price = plan.stops.reduce((s, id) => s + getPlace(id).pricePerPerson, 0);
            const mins = plan.stops.reduce((s, id) => s + getPlace(id).durationMin, 0);
            return (
              <article key={plan.id} className="surface-card overflow-hidden hover-lift group flex flex-col justify-between border border-[#E2D3BE] dark:border-white/10">
                <div className="relative h-40 w-full overflow-hidden">
                  <img src={plan.image} alt={plan.titleAr} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-3 start-3 end-3 flex items-center justify-between z-10">
                    <span className="rounded-full bg-[#C96745] px-3 py-1 text-xs font-bold text-white">
                      {plan.tagAr}
                    </span>
                    <span className="rounded-full bg-black/50 backdrop-blur px-3 py-1 text-xs font-bold text-[#E4A23B]">
                      ⭐ {budgetLevels[plan.budget].ar}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-extrabold text-[#252A28] dark:text-[#F5F1E8] group-hover:text-[#C96745] transition-colors">
                      {isRtl ? plan.titleAr : plan.titleEn}
                    </h3>
                    <p className="mt-2 text-sm text-[#6E716C] dark:text-[#B5B8B2] line-clamp-2 leading-relaxed">{plan.descAr}</p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-[#E2D3BE] dark:border-white/10 pt-4 text-[13px] text-[#6E716C] dark:text-[#B5B8B2]">
                    <span className="flex items-center gap-1.5">
                      <Wallet className="h-3.5 w-3.5 text-[#C96745]" />
                      <span className="font-bold text-[#252A28] dark:text-[#F5F1E8]">{price} {isRtl ? "ر.س" : "SAR"}</span> {t("perPerson")}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-[#397C78]" />
                      {Math.round(mins / 60)} {t("hours")}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
