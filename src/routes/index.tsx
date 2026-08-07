import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Compass, Flame, MapPin, Navigation, Search, Sparkles, Star, Users, Zap } from "lucide-react";
import { PlaceCard } from "@/components/places/PlaceCard";
import { getTrendingPlaces } from "@/data/trending";
import { places, type Mood, type Place } from "@/data/jeddah";
import { useLanguage } from "@/context/LanguageContext";
import { JeddahWeatherWidget } from "@/components/common/JeddahWeatherWidget";
import { FlashOffersBanner } from "@/components/home/FlashOffersBanner";
import { JeddawHeroVisual } from "@/components/home/JeddawHeroVisual";

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
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVibe, setSelectedVibe] = useState<VibeChip>(quickVibes[0]!);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: "/places" });
    }
  };

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
      {/* ===== CINEMATIC & EMBEDDED FLAGSHIP JEDDAH HERO SECTION ===== */}
      <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center overflow-hidden bg-[#051413] text-[#FAF6F0] pt-24 pb-16 lg:pt-28 lg:pb-20 shadow-2xl">
        {/* Subtle Red Sea Atmospheric Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=90"
            alt="جدة الكورنيش والبحر الأحمر"
            className="h-full w-full object-cover object-center opacity-15 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#051413]/95 via-[#0A1F1D]/80 to-[#051413]" />
        </div>

        {/* Minimal Subtle Topography Line Accent */}
        <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-subtle" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#FAF6F0" strokeWidth="0.5" strokeDasharray="4 4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-subtle)" />
          </svg>
        </div>

        {/* Soft Ambient Light Glows */}
        <div className="absolute -top-32 -start-32 h-[500px] w-[500px] rounded-full bg-[#C96745]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 end-0 h-[550px] w-[550px] rounded-full bg-[#397C78]/20 blur-3xl pointer-events-none" />

        {/* Hero 2-Zone Container */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* LEFT ZONE: Compact Eyebrow, Stacked Headline, Subtitle, CTAs */}
            <div className="lg:col-span-7 flex flex-col items-start text-start">
              
              {/* Compact Weather & Eyebrow Chip */}
              <div className="flex flex-wrap items-center gap-2.5 mb-6 animate-fade-in-up">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-extrabold text-[#FAF6F0] backdrop-blur border border-white/15 shadow-xs">
                  ☀️ 34°C · {isRtl ? "جدة الآن" : "Jeddah Now"}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-extrabold text-[#FAF6F0] backdrop-blur border border-white/15 shadow-xs">
                  <Sparkles className="h-3.5 w-3.5 text-[#E4A23B]" />
                  <span>{isRtl ? "جدة تبدأ من هنا." : "Jeddah starts here."}</span>
                </span>
              </div>

              {/* Main Headline Stack — Prominent & Clean */}
              <div className="animate-fade-in-up delay-1 space-y-1 max-w-2xl">
                <span className="block text-[#FAF6F0]/90 font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-tight">
                  {isRtl ? "محتار وين تروح اليوم؟" : "Wondering where to go today?"}
                </span>
                <div className="pt-2">
                  <span className="relative inline-block bg-gradient-to-r from-[#FF9D7A] via-[#FAF6F0] to-[#5EAAA5] bg-clip-text text-transparent font-black text-4xl sm:text-6xl lg:text-7xl drop-shadow-md">
                    {isRtl ? "جِدّاو يرتّبها." : "JEDDAW plans it."}
                    <span className="absolute bottom-0 start-0 w-full h-[3px] bg-gradient-to-r from-[#C96745] to-[#397C78] rounded-full opacity-80" />
                  </span>
                </div>
              </div>

              {/* Supporting Copy */}
              <p className="animate-fade-in-up delay-2 mt-6 max-w-lg text-base sm:text-lg leading-relaxed text-[#FAF6F0]/80 font-semibold">
                {isRtl
                  ? "وقتِك، مودك، وميزانيتك… وعلينا نرتب لك طلعة تناسبك في جدة."
                  : "Your time, mood, and budget… We’ll arrange an outing that perfectly suits you in Jeddah."}
              </p>

              {/* CTAs Row */}
              <div className="animate-fade-in-up delay-3 mt-8 flex flex-wrap items-center gap-4 w-full sm:w-auto">
                <Link
                  to="/quick-plan"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#C96745] to-[#B84E4E] px-9 py-4 text-base font-black text-white shadow-lift hover:scale-[1.02] hover:shadow-2xl border border-white/20 transition-all min-h-[54px] cursor-pointer"
                >
                  <Sparkles className="h-5 w-5 text-white" />
                  <span>{isRtl ? "سوِّ لي خطة ✨" : "Plan My Outing ✨"}</span>
                  <ArrowLeft className={`h-5 w-5 ${isRtl ? "" : "rotate-180"}`} />
                </Link>

                <Link
                  to="/places"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 px-7 py-4 text-sm font-bold text-[#FAF6F0] backdrop-blur-xl transition-all min-h-[54px] cursor-pointer"
                >
                  <Navigation className="h-4.5 w-4.5" />
                  <span>{isRtl ? "استكشف الأماكن" : "Explore Places"}</span>
                </Link>
              </div>

            </div>

            {/* RIGHT ZONE: Signature Floating 3D Experience Canvas (No Container Box) */}
            <div className="lg:col-span-5 relative h-[380px] sm:h-[460px] lg:h-[500px] w-full flex items-center justify-center">
              <JeddawHeroVisual />
            </div>

          </div>
        </div>
      </section>

      {/* ===== BELOW THE FOLD: SEARCH & DISCOVERY BAR ===== */}
      <section className="relative z-30 -mt-8 mx-auto max-w-5xl px-4 space-y-6">
        {/* Instant Search Bar */}
        <div className="rounded-3xl bg-white dark:bg-[#1A2221] p-4 sm:p-5 border border-[#E2D3BE] dark:border-white/10 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleHeroSearch} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute start-4 top-3.5 h-5 w-5 text-[#6E716C] dark:text-[#B5B8B2]" />
              <input
                type="text"
                placeholder={
                  isRtl
                    ? "ابحث عن مكان في جدة (مطعم شامي، كافيه هادي، رد سي مول)..."
                    : "Search Jeddah places (Red Sea Mall, Rosewood, Cafe)..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-[#E2D3BE] dark:border-white/15 bg-[#FAF6F0] dark:bg-[#161B1A] ps-12 pe-4 py-3 text-sm font-bold text-[#252A28] dark:text-[#F5F1E8] placeholder:text-[#6E716C]/60 focus:border-[#C96745] focus:outline-none min-h-[48px]"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto rounded-2xl bg-[#397C78] px-7 py-3 text-sm font-black text-white hover:bg-[#2d6360] transition-colors min-h-[48px]"
            >
              {isRtl ? "بحث فوري" : "Search"}
            </button>
          </form>

          {/* Trust Feature Pills below search */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-[#6E716C] dark:text-[#B5B8B2]">
            <span className="me-1">{isRtl ? "تغطية شاملة:" : "Includes:"}</span>
            <span className="rounded-full bg-[#FAF6F0] dark:bg-white/10 px-3 py-1 border border-[#E2D3BE] dark:border-white/10">🍽️ مطاعم</span>
            <span>•</span>
            <span className="rounded-full bg-[#FAF6F0] dark:bg-white/10 px-3 py-1 border border-[#E2D3BE] dark:border-white/10">☕ كافيهات</span>
            <span>•</span>
            <span className="rounded-full bg-[#FAF6F0] dark:bg-white/10 px-3 py-1 border border-[#E2D3BE] dark:border-white/10">🌊 بحر</span>
            <span>•</span>
            <span className="rounded-full bg-[#FAF6F0] dark:bg-white/10 px-3 py-1 border border-[#E2D3BE] dark:border-white/10">🎯 فعاليات</span>
            <span>•</span>
            <span className="rounded-full bg-[#FAF6F0] dark:bg-white/10 px-3 py-1 border border-[#E2D3BE] dark:border-white/10">👨‍👩‍👧‍👦 عائلات</span>
            <span>•</span>
            <span className="rounded-full bg-[#FAF6F0] dark:bg-white/10 px-3 py-1 border border-[#E2D3BE] dark:border-white/10">🥳 أصدقاء</span>
          </div>
        </div>

        <FlashOffersBanner />
      </section>

      {/* ===== Floating Core Value Proposition Banner ===== */}
      <div className="relative z-30 -mt-12 mx-auto max-w-5xl px-4 space-y-6">
        <FlashOffersBanner />

        <div className="rounded-3xl bg-gradient-to-r from-[#295652] via-[#397C78] to-[#C96745] text-white p-6 md:p-8 shadow-2xl border border-white/25 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-xl">
          <div className="text-center md:text-start">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF9D7A] block mb-2">
              💡 {isRtl ? "ليش اختاروا جِدّاو؟" : "Why JEDDAW?"}
            </span>
            <p className="text-base md:text-lg font-extrabold text-white leading-relaxed">
              {isRtl ? (
                <>
                  المواقع الثانية تعطيك أماكن. <span className="underline underline-offset-6 decoration-[#FF9D7A]">جِدّاو يرتّب لك الطلعة كاملة.</span>
                </>
              ) : (
                <>
                  Other platforms show you places. <span className="underline underline-offset-6 decoration-[#FF9D7A]">JEDDAW builds the complete outing.</span>
                </>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold mt-2 md:mt-0">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/25 px-4 py-2 border border-white/15 shadow-sm">
              ⚡ {isRtl ? "تخطيط فوري" : "Instant Planning"}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/25 px-4 py-2 border border-white/15 shadow-sm">
              💰 {isRtl ? "موزون على ميزانيتك" : "Budget Tailored"}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/25 px-4 py-2 border border-white/15 shadow-sm">
              📍 {isRtl ? "مسار وخرائط مجهزة" : "Complete Route Maps"}
            </span>
          </div>
        </div>
      </div>

      {/* ===== 🌟 INTERACTIVE QUICK VIBE SECTION ("وش جوّكم اليوم؟") ===== */}
      <section className="bg-gradient-to-b from-[#F4EBDD] via-[#FAF6F0] to-[#F4EBDD] dark:from-[#121817] dark:via-[#192322] dark:to-[#121817] pt-20 pb-16 border-b border-[#E2D3BE]/80 dark:border-white/10 relative">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 flex flex-col items-center text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C96745]/15 dark:bg-[#C96745]/25 px-4 py-1 text-xs font-extrabold text-[#C96745] dark:text-[#FF9D7A] mb-2 border border-[#C96745]/20">
              ✨ {isRtl ? "اختاروا جوّكم السريع" : "Quick Vibe Selector"}
            </span>
            <h2 className="text-3xl font-black text-[#252A28] dark:text-[#F5F1E8] md:text-4xl">
              {t("quickVibeTitle")}
            </h2>
            <p className="text-sm text-[#6E716C] dark:text-[#B5B8B2] font-semibold mt-1.5 max-w-md">
              {isRtl
                ? "اضغط على أي جوّ لاستكشاف أفضل الأماكن المقترحة فوراً!"
                : "Click any vibe to see instant top recommendations!"}
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
                    {isRtl
                      ? `أفضل ترشيحات جِدّاو لـ (${selectedVibe.labelAr})`
                      : `Top JEDDAW Picks for (${selectedVibe.labelEn})`}
                  </h3>
                  <p className="text-xs font-bold text-[#6E716C] dark:text-[#B5B8B2] mt-0.5">
                    {isRtl
                      ? "مختارة وموزونة لتناسب جوكم المفضل"
                      : "Handpicked & curated for your selected vibe"}
                  </p>
                </div>
              </div>

              <Link
                to="/quick-plan"
                className="inline-flex items-center gap-2 rounded-full bg-[#C96745] px-6 py-3 text-xs font-extrabold text-white shadow-lift hover:bg-[#b55837] transition-all min-h-[44px]"
              >
                <Sparkles className="h-4 w-4" />
                <span>
                  {isRtl ? "سوّ لي خطة متكاملة لهذا الجو ⚡" : "Build My Complete Plan for This Vibe ⚡"}
                </span>
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
              <Zap className="h-4 w-4" /> {isRtl ? "الأكثر تداولاً وزيارة هذا الأسبوع" : "Most popular spots this week"}
            </div>
            <h2 className="text-3xl font-black text-[#252A28] dark:text-[#F5F1E8] md:text-4xl">
              {isRtl ? "طلعة ترند 🔥" : "Trending Outings 🔥"}
            </h2>
            <p className="mt-2 text-sm text-[#6E716C] dark:text-[#B5B8B2] font-semibold max-w-xl">
              {isRtl
                ? "أكثر الأماكن والكافيهات والمطاعم طلباً وتداولاً في جدة هذا الأسبوع"
                : "Most requested & trending spots, cafes, and dining in Jeddah this week"}
            </p>
          </div>
          <Link
            to="/places"
            className="inline-flex items-center gap-2 rounded-full border border-[#C96745] px-5 py-2.5 text-xs font-bold text-[#C96745] hover:bg-[#C96745] hover:text-white transition-all min-h-[44px]"
          >
            <span>{isRtl ? "استكشف كل ترندات جدة" : "Explore All Trending Spots"}</span>
            <ArrowLeft className={`h-4 w-4 ${isRtl ? "" : "rotate-180"}`} />
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {getTrendingPlaces().map((item) => (
            <article
              key={item.place.id}
              className="surface-card p-6 hover-lift relative overflow-hidden group border border-[#E2D3BE] dark:border-white/10 flex flex-col justify-between"
            >
              <div>
                {/* Header Row: Category, Title & Rank Badge (No Overlap) */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#FAF6F0] dark:bg-[#161B1A] text-2xl shrink-0">
                      {item.rank === 1 ? "🥇" : item.rank === 2 ? "🥈" : item.rank === 3 ? "🥉" : "📍"}
                    </span>
                    <div>
                      <span className="text-[11px] font-extrabold text-[#C96745] uppercase tracking-wider block">
                        {isRtl ? (item.place.subCategoryAr || item.place.categoryAr) : (item.place.subCategoryEn || item.place.kind)}
                      </span>
                      <h3 className="text-base md:text-lg font-black text-[#252A28] dark:text-[#F5F1E8] leading-snug">
                        {isRtl ? item.place.nameAr : item.place.nameEn}
                      </h3>
                    </div>
                  </div>

                  <span className="grid h-9 w-9 place-items-center rounded-2xl bg-[#C96745] text-xs font-black text-white shadow-lift shrink-0">
                    #{item.rank}
                  </span>
                </div>

                <p className="text-xs text-[#6E716C] dark:text-[#B5B8B2] font-semibold leading-relaxed line-clamp-2">
                  {isRtl ? item.place.descAr : item.place.descEn}
                </p>
              </div>

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

      {/* ===== Curated Jeddah Districts Showcase ===== */}
      <section className="bg-[#FAF6F0] dark:bg-[#161B1A] py-16 border-t border-b border-[#E2D3BE]/60 dark:border-white/10">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-10">
            <span className="rounded-full bg-[#397C78]/15 px-4 py-1 text-xs font-extrabold text-[#397C78] dark:text-[#5EAAA5] mb-2 inline-block">
              🗺️ {isRtl ? "استكشف أحياء جدة البارزة" : "Featured Jeddah Neighborhoods"}
            </span>
            <h2 className="text-3xl font-black text-[#252A28] dark:text-[#F5F1E8]">
              {isRtl ? "لكل حي بجدة نكهة وطلعة خاصة 🌊" : "Every District Has a Unique Vibe 🌊"}
            </h2>
            <p className="text-sm font-semibold text-[#6E716C] dark:text-[#B5B8B2] mt-1">
              {isRtl
                ? "من بحر أبحر الساحر إلى عراقة حارات البلد التاريخية"
                : "From Obhur's turquoise beaches to historic Al Balad heritage"}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* District Card 1: Corniche */}
            <div className="group relative h-64 rounded-3xl overflow-hidden shadow-xl border border-white/20 hover-lift cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
                alt="الكورنيش والبحر"
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 flex flex-col justify-end text-white">
                <span className="text-xs font-extrabold text-[#FF9D7A]">🏖️ 45+ {isRtl ? "وجهة" : "spots"}</span>
                <h3 className="text-xl font-black">{isRtl ? "الكورنيش والشاطئ" : "Corniche & Waterfront"}</h3>
                <p className="text-xs font-semibold text-white/80 mt-1">
                  {isRtl ? "جلسات بحرية، كافيهات إطلالة، ومشي غروب" : "Seaside cafes, sunset walks & luxury dining"}
                </p>
              </div>
            </div>

            {/* District Card 2: Obhur */}
            <div className="group relative h-64 rounded-3xl overflow-hidden shadow-xl border border-white/20 hover-lift cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
                alt="أبحر الشمالية والمنتجعات"
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 flex flex-col justify-end text-white">
                <span className="text-xs font-extrabold text-[#FF9D7A]">⛵ 30+ {isRtl ? "منتجع ونادي" : "resorts"}</span>
                <h3 className="text-xl font-black">{isRtl ? "أبحر الشمالية واليخوت" : "North Obhur & Marinas"}</h3>
                <p className="text-xs font-semibold text-white/80 mt-1">
                  {isRtl ? "منتجعات مسبح خاص، شاليهات، وفعاليات بحرية" : "Private beach resorts & water sports"}
                </p>
              </div>
            </div>

            {/* District Card 3: Al Balad */}
            <div className="group relative h-64 rounded-3xl overflow-hidden shadow-xl border border-white/20 hover-lift cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80"
                alt="البلد التاريخية"
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 flex flex-col justify-end text-white">
                <span className="text-xs font-extrabold text-[#FF9D7A]">🏛️ 25+ {isRtl ? "معلم وتراث" : "heritage spots"}</span>
                <h3 className="text-xl font-black">{isRtl ? "البلد والتراث التاريخي" : "Historic Al Balad"}</h3>
                <p className="text-xs font-semibold text-white/80 mt-1">
                  {isRtl ? "بيوت حجازية عريقة، كافيهات انتيك، وشاهي جمر" : "Traditional Hijazi houses & antique cafes"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Authentic Human Reviews & Community Testimonials ===== */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center mb-10">
          <span className="rounded-full bg-[#C96745]/15 px-4 py-1 text-xs font-extrabold text-[#C96745] mb-2 inline-block">
            💬 {isRtl ? "تجارب مجتمع جِدّاو الحقيقية" : "Authentic Community Experiences"}
          </span>
          <h2 className="text-3xl font-black text-[#252A28] dark:text-[#F5F1E8]">
            {isRtl ? "ماذا يقول أهل جدة وزوارها عن جِدّاو؟ ❤️" : "What Jeddah Locals & Visitors Say ❤️"}
          </h2>
          <p className="text-sm font-semibold text-[#6E716C] dark:text-[#B5B8B2] mt-1">
            {isRtl
              ? "أكثر من 15,000 خطة طلعة تم تنظيمها ومشاركتها هذا الشهر"
              : "Over 15,000 outing plans curated and enjoyed this month"}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Review 1 */}
          <div className="surface-card p-6 rounded-3xl border border-[#E2D3BE] dark:border-white/10 shadow-md hover-lift">
            <div className="flex items-center gap-1 text-[#E4A23B] mb-3">
              {"★".repeat(5)}
            </div>
            <p className="text-xs font-semibold text-[#252A28] dark:text-[#F5F1E8] leading-relaxed italic">
              "{isRtl
                ? "جِدّاو وفر علي ساعتين تدوير بإنستقرام للطلعات! اخترت الجو والميزانية وعطاني مسار كامل بالمطعم والقهوة والمسار بالخريطة."
                : "JEDDAW saved me 2 hours of searching Instagram! Selected my vibe & budget, and it built the complete route in seconds."}"
            </p>
            <div className="mt-5 pt-3 border-t border-[#E2D3BE]/60 dark:border-white/10 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-[#C96745] text-xs font-bold text-white">
                د.ع
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-[#252A28] dark:text-[#F5F1E8]">
                  {isRtl ? "دانة العمودي" : "Dana Al-Amoudi"}
                </h4>
                <span className="text-[11px] text-[#6E716C] dark:text-[#B5B8B2] font-semibold">
                  {isRtl ? "حي الشاطئ · جدة" : "Al Shati · Jeddah"}
                </span>
              </div>
            </div>
          </div>

          {/* Review 2 */}
          <div className="surface-card p-6 rounded-3xl border border-[#E2D3BE] dark:border-white/10 shadow-md hover-lift">
            <div className="flex items-center gap-1 text-[#E4A23B] mb-3">
              {"★".repeat(5)}
            </div>
            <p className="text-xs font-semibold text-[#252A28] dark:text-[#F5F1E8] leading-relaxed italic">
              "{isRtl
                ? "خاصية تقسيم الفاتورة ومشاركة الكرت على الواتساب مع الشلة فكّت أزمة! الكل صار يصوت ويعرف حصته بدون أي أحراج."
                : "The WhatsApp bill splitter and share card features solved all group planning issues! Everyone votes and knows their exact share."}"
            </p>
            <div className="mt-5 pt-3 border-t border-[#E2D3BE]/60 dark:border-white/10 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-[#397C78] text-xs font-bold text-white">
                س.غ
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-[#252A28] dark:text-[#F5F1E8]">
                  {isRtl ? "سعود الغامدي" : "Saud Al-Ghamdi"}
                </h4>
                <span className="text-[11px] text-[#6E716C] dark:text-[#B5B8B2] font-semibold">
                  {isRtl ? "حي الخالدية · جدة" : "Al Khalidiyyah · Jeddah"}
                </span>
              </div>
            </div>
          </div>

          {/* Review 3 */}
          <div className="surface-card p-6 rounded-3xl border border-[#E2D3BE] dark:border-white/10 shadow-md hover-lift">
            <div className="flex items-center gap-1 text-[#E4A23B] mb-3">
              {"★".repeat(5)}
            </div>
            <p className="text-xs font-semibold text-[#252A28] dark:text-[#F5F1E8] leading-relaxed italic">
              "{isRtl
                ? "كنت زائر لجدة لأول مرة وما أعرف الأماكن، جِدّاو سوى لي برنامج 3 أيام من منتجعات أبحر لمطاعم الكورنيش والبلد وكله بالدقيقة!"
                : "Visited Jeddah for the first time; JEDDAW gave me a 3-day complete itinerary from Obhur resorts to Corniche cafes!"}"
            </p>
            <div className="mt-5 pt-3 border-t border-[#E2D3BE]/60 dark:border-white/10 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-[#E4A23B] text-xs font-bold text-white">
                ف.ش
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-[#252A28] dark:text-[#F5F1E8]">
                  {isRtl ? "فهد الشهري" : "Fahad Al-Shehri"}
                </h4>
                <span className="text-[11px] text-[#6E716C] dark:text-[#B5B8B2] font-semibold">
                  {isRtl ? "زائر من الرياض 🇸🇦" : "Visitor from Riyadh 🇸🇦"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
