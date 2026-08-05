import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Compass, Flame, MapPin, Navigation, Sparkles, Star, Users, Zap } from "lucide-react";
import { PlaceCard } from "@/components/places/PlaceCard";
import { getTrendingPlaces } from "@/data/trending";
import { places, type Mood, type Place } from "@/data/jeddah";
import { useLanguage } from "@/context/LanguageContext";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "جِدّاو | JEDDAW — مخطط طلعات ورستورانات جدة الذكي" },
      {
        name: "description",
        content: "المواقع الثانية تعطيك أماكن. جِدّاو يرتّب لك الطلعة كاملة! مطاعم، كافيهات، فنادق 5 نجوم، منتجعات الأبحر وفعاليات جدة حسب جوك وميزانيتك.",
      },
      { property: "og:title", content: "جِدّاو — جدة تبدأ من هنا" },
      { property: "og:description", content: "تخطيط فوري لطلعة الويكند في جدة بكل تفاصيلها." },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

interface VibeChip {
  id: string;
  labelAr: string;
  labelEn: string;
  emoji: string;
  mood: Mood | "free";
  accentColor: string;
}

const quickVibes: VibeChip[] = [
  { id: "v1", labelAr: "طلعة ترند 🔥", labelEn: "Trending Outing 🔥", emoji: "🔥", mood: "sea", accentColor: "from-[#C96745] to-[#E4A23B]" },
  { id: "v2", labelAr: "بعد الدوام 💼", labelEn: "After Work 💼", emoji: "💼", mood: "calm", accentColor: "from-[#397C78] to-[#295652]" },
  { id: "v3", labelAr: "بحر وغروب 🌊", labelEn: "Sea & Sunset 🌊", emoji: "🌊", mood: "sea", accentColor: "from-[#2B7A88] to-[#397C78]" },
  { id: "v4", labelAr: "طلعة مع الشلة 🥳", labelEn: "With Friends 🥳", emoji: "🥳", mood: "games", accentColor: "from-[#C96745] to-[#B84E4E]" },
  { id: "v5", labelAr: "موعد لشخصين 👩‍❤️‍👨", labelEn: "Date Night 👩‍❤️‍👨", emoji: "👩‍❤️‍👨", mood: "coffee", accentColor: "from-[#B84E4E] to-[#C96745]" },
  { id: "v6", labelAr: "يوم عائلي 👨‍👩‍👧‍👦", labelEn: "Family Day 👨‍👩‍👧‍👦", emoji: "👨‍👩‍👧‍👦", mood: "calm", accentColor: "from-[#71805B] to-[#397C78]" },
  { id: "v7", labelAr: "جدة بأقل من 100 💚", labelEn: "Under 100 SAR 💚", emoji: "💚", mood: "free", accentColor: "from-[#71805B] to-[#E4A23B]" },
  { id: "v8", labelAr: "شيء قريب مني 📍", labelEn: "Near Me 📍", emoji: "📍", mood: "games", accentColor: "from-[#397C78] to-[#C96745]" },
  { id: "v9", labelAr: "طلعة آخر الليل 🌙", labelEn: "Late Night 🌙", emoji: "🌙", mood: "food", accentColor: "from-[#252A28] to-[#397C78]" },
  { id: "v10", labelAr: "أماكن داخلية 🏢", labelEn: "Indoor AC 🏢", emoji: "🏢", mood: "games", accentColor: "from-[#295652] to-[#397C78]" },
  { id: "v11", labelAr: "بدون حجز ⚡", labelEn: "No Reservation ⚡", emoji: "⚡", mood: "coffee", accentColor: "from-[#E4A23B] to-[#C96745]" },
  { id: "v12", labelAr: "أول مرة في جدة 🧳", labelEn: "First Time in Jeddah 🧳", emoji: "🧳", mood: "culture", accentColor: "from-[#C96745] to-[#71805B]" },
];

function Index() {
  const { t, isRtl } = useLanguage();
  const [selectedVibe, setSelectedVibe] = useState<VibeChip>(quickVibes[0]);

  // Filter matching places for the selected vibe
  const getMatchingVibePlaces = (vibe: VibeChip): Place[] => {
    return places
      .filter((p) => {
        if (vibe.mood === "free") return p.pricePerPerson <= 40;
        if (vibe.mood === "sea") return p.moods.includes("sea") || p.kind === "resort" || p.districtId === "corniche" || p.districtId === "obhur";
        if (vibe.mood === "games") return p.kind === "activity" || p.moods.includes("games");
        if (vibe.mood === "culture") return p.kind === "culture" || p.districtId === "balad";
        return p.moods.includes(vibe.mood as Mood) || p.kind === vibe.mood;
      })
      .slice(0, 3);
  };

  const matchingPlaces = getMatchingVibePlaces(selectedVibe);

  return (
    <div>
      {/* ===== Vibrant Coastal Hero Section ===== */}
      <section className="relative overflow-hidden bg-[#1D3A37] text-white pt-24 pb-20 md:pt-32 md:pb-28">
        {/* Background Image with Warm Coastal Gradient */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/jeddah-route-hero-BCiUi1Qn.jpg"
            alt="جدة الكورنيش والبحر"
            className="h-full w-full object-cover object-center opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1D3A37]/80 via-[#1D3A37]/65 to-[#1D3A37]" />
        </div>

        {/* Hero Content */}
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

      {/* ===== 🌟 INTERACTIVE QUICK VIBE SECTION ("وش جوّكم اليوم؟") ===== */}
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
              اضغط على أي جوّ لاستكشاف أفضل الأماكن المقترحة فوراً!
            </p>
          </div>

          {/* 12 Interactive Vibe Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
            {quickVibes.map((chip) => {
              const isActive = selectedVibe.id === chip.id;
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => setSelectedVibe(chip)}
                  className={`group relative flex flex-col items-center justify-center p-4 text-center rounded-2xl transition-all duration-300 min-h-[105px] border cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-br from-[#C96745] to-[#397C78] text-white shadow-lift scale-105 border-white/40 ring-2 ring-[#C96745] ring-offset-2 dark:ring-offset-[#121817]"
                      : "bg-white/95 dark:bg-[#1F2B2A] text-[#252A28] dark:text-[#F5F1E8] border-[#E2D3BE] dark:border-white/15 shadow-sm hover:scale-[1.03] hover:border-[#C96745]"
                  }`}
                >
                  {/* Top Indicator */}
                  {isActive && (
                    <span className="absolute top-2 end-2 grid h-5 w-5 place-items-center rounded-full bg-white text-[#C96745] shadow-sm">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </span>
                  )}

                  {/* Emoji Badge Container */}
                  <span className={`grid h-12 w-12 place-items-center rounded-2xl text-2xl mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 ${
                    isActive ? "bg-white/20 text-white" : "bg-[#FAF6F0] dark:bg-[#161B1A]"
                  }`}>
                    {chip.emoji}
                  </span>

                  <span className={`text-xs font-extrabold leading-tight ${isActive ? "text-white" : "group-hover:text-[#C96745]"}`}>
                    {isRtl ? chip.labelAr : chip.labelEn}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ===== Live Interactive Recommendations Box for Selected Vibe ===== */}
          <div className="mt-10 rounded-3xl bg-white dark:bg-[#1A2221] p-6 md:p-8 border border-[#E2D3BE] dark:border-white/10 shadow-xl animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2D3BE]/60 dark:border-white/10 pb-5 mb-6">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#C96745]/15 text-2xl">
                  {selectedVibe.emoji}
                </span>
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-[#252A28] dark:text-[#F5F1E8]">
                    أفضل ترشيحات جِدّاو لـ ({isRtl ? selectedVibe.labelAr : selectedVibe.labelEn})
                  </h3>
                  <p className="text-xs font-bold text-[#6E716C] dark:text-[#B5B8B2] mt-0.5">
                    مختارة وموزونة لتناسب جوكم المفضل
                  </p>
                </div>
              </div>

              <Link
                to="/quick-plan"
                className="inline-flex items-center gap-2 rounded-full bg-[#C96745] px-6 py-3 text-xs font-extrabold text-white shadow-lift hover:bg-[#b55837] transition-all min-h-[44px]"
              >
                <Sparkles className="h-4 w-4" />
                <span>سوّ لي خطة متكاملة لهذا الجو ⚡</span>
              </Link>
            </div>

            {/* Places Grid */}
            <div className="grid gap-6 md:grid-cols-3">
              {matchingPlaces.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Trending Section: طلعة ترند 🔥 ===== */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#C96745]/15 px-4 py-1 text-xs font-bold text-[#C96745] mb-2">
              <Zap className="h-4 w-4" /> الأكثر تداولاً وزيارة هذا الأسبوع
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
              <div className="absolute top-4 end-4 grid h-10 w-10 place-items-center rounded-2xl bg-[#C96745] text-sm font-black text-white shadow-lift">
                #{item.rank}
              </div>

              <div className="flex items-center gap-3 mb-4">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#FAF6F0] dark:bg-[#161B1A] text-2xl">
                  {item.rank === 1 ? "🥇" : item.rank === 2 ? "🥈" : "🥉"}
                </span>
                <div>
                  <span className="text-xs font-extrabold text-[#C96745] uppercase tracking-wider block">
                    {item.place.subCategoryAr || item.place.categoryAr}
                  </span>
                  <h3 className="text-xl font-extrabold text-[#252A28] dark:text-[#F5F1E8]">
                    {isRtl ? item.place.nameAr : item.place.nameEn}
                  </h3>
                </div>
              </div>

              <p className="text-xs text-[#6E716C] dark:text-[#B5B8B2] font-semibold leading-relaxed line-clamp-2">
                {isRtl ? item.place.descAr : item.place.descEn}
              </p>

              <div className="mt-5 border-t border-[#E2D3BE] dark:border-white/10 pt-4 flex items-center justify-between text-xs font-bold">
                <span className="text-[#397C78] dark:text-[#5EAAA5] flex items-center gap-1">
                  ⭐ {item.place.rating} · 👁️ {item.place.viewsCount?.toLocaleString()} زيارة
                </span>
                <Link
                  to="/places"
                  className="text-[#C96745] hover:underline flex items-center gap-1"
                >
                  التفاصيل 🗺️
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
