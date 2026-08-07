import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Briefcase,
  Building,
  CheckCircle2,
  Clock,
  Compass,
  Flame,
  Heart,
  Home,
  MapPin,
  Moon,
  Navigation,
  Search,
  Sparkles,
  Users,
  Waves,
  Wallet,
  Zap,
} from "lucide-react";
import { PlaceCard } from "@/components/places/PlaceCard";
import { getTrendingPlaces } from "@/data/trending";
import { places, type Mood, type Place } from "@/data/jeddah";
import { useLanguage } from "@/context/LanguageContext";
import { FlashOffersBanner } from "@/components/home/FlashOffersBanner";
import { JeddawHeroVisual } from "@/components/home/JeddawHeroVisual";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "جِدّاو | JEDDAW — مخطط طلعات ورستورانات جدة الذكي" },
      {
        name: "description",
        content: "المواقع الثانية تعطيك أماكن. جِدّاو يرتّب لك الطلعة كاملة! مطاعم، كافيهات، منتجعات الأبحر وفعاليات جدة حسب جوك وميزانيتك.",
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
  icon: React.ComponentType<{ className?: string }>;
  mood: Mood | "free";
  accentColor: string;
}

const quickVibes: VibeChip[] = [
  { id: "v1", labelAr: "طلعة ترند", labelEn: "Trending Outing", icon: Flame, mood: "sea", accentColor: "from-[#C96745] to-[#E4A23B]" },
  { id: "v2", labelAr: "بعد الدوام", labelEn: "After Work", icon: Briefcase, mood: "calm", accentColor: "from-[#397C78] to-[#295652]" },
  { id: "v3", labelAr: "بحر وغروب", labelEn: "Sea & Sunset", icon: Waves, mood: "sea", accentColor: "from-[#2B7A88] to-[#397C78]" },
  { id: "v4", labelAr: "طلعة مع الشلة", labelEn: "With Friends", icon: Users, mood: "games", accentColor: "from-[#C96745] to-[#B84E4E]" },
  { id: "v5", labelAr: "موعد لشخصين", labelEn: "Date Night", icon: Heart, mood: "coffee", accentColor: "from-[#B84E4E] to-[#C96745]" },
  { id: "v6", labelAr: "يوم عائلي", labelEn: "Family Day", icon: Home, mood: "calm", accentColor: "from-[#71805B] to-[#397C78]" },
  { id: "v7", labelAr: "جدة بأقل من 100", labelEn: "Under 100 SAR", icon: Wallet, mood: "free", accentColor: "from-[#71805B] to-[#E4A23B]" },
  { id: "v8", labelAr: "شيء قريب مني", labelEn: "Near Me", icon: MapPin, mood: "games", accentColor: "from-[#397C78] to-[#C96745]" },
  { id: "v9", labelAr: "طلعة آخر الليل", labelEn: "Late Night", icon: Moon, mood: "food", accentColor: "from-[#252A28] to-[#397C78]" },
  { id: "v10", labelAr: "أماكن داخلية", labelEn: "Indoor AC", icon: Building, mood: "games", accentColor: "from-[#295652] to-[#397C78]" },
  { id: "v11", labelAr: "بدون حجز", labelEn: "No Reservation", icon: Zap, mood: "coffee", accentColor: "from-[#E4A23B] to-[#C96745]" },
  { id: "v12", labelAr: "أول مرة في جدة", labelEn: "First Time in Jeddah", icon: Compass, mood: "culture", accentColor: "from-[#C96745] to-[#71805B]" },
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
      {/* ===== BRAND EXPERIENTIAL JEDDAH HERO SECTION ===== */}
      <section className="relative min-h-[82vh] lg:min-h-[88vh] flex items-center overflow-hidden bg-[#051413] text-[#FAF6F0] pt-20 pb-14 lg:pt-24 lg:pb-18 shadow-2xl">
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

        {/* Hero 2-Column Asymmetric Grid Container (Right: ~45%, Left: ~55%) */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* RIGHT SIDE (Arabic Main Content ~45% / 5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-start text-start">
              
              {/* Compact Weather & Eyebrow Chip */}
              <div className="flex flex-wrap items-center gap-2.5 mb-5 animate-fade-in-up">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-extrabold text-[#FAF6F0] backdrop-blur border border-white/15 shadow-xs">
                  34° · {isRtl ? "جدة الآن" : "Jeddah Now"}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-extrabold text-[#FAF6F0] backdrop-blur border border-white/15 shadow-xs">
                  <Sparkles className="h-3.5 w-3.5 text-[#E4A23B]" />
                  <span>{isRtl ? "جدة تبدأ من هنا." : "Jeddah starts here."}</span>
                </span>
              </div>

              {/* Main Headline Stack */}
              <div className="animate-fade-in-up delay-1 space-y-1 max-w-xl">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.18] text-[#FAF6F0]">
                  <span className="block text-[#FAF6F0]/90">
                    {isRtl ? "جدة كثيرة…" : "Jeddah is endless…"}
                  </span>
                  <span className="inline-block bg-gradient-to-r from-[#FF9D7A] via-[#FAF6F0] to-[#5EAAA5] bg-clip-text text-transparent drop-shadow-md pt-1 pb-2">
                    {isRtl ? "بس خطتك وحدة." : "One plan fits you."}
                  </span>
                </h1>
                <div className="h-[3.5px] w-full max-w-[220px] sm:max-w-[320px] bg-gradient-to-r from-[#C96745] via-[#E4A23B] to-[#397C78] rounded-full opacity-90" />
              </div>

              {/* Supporting Copy */}
              <p className="animate-fade-in-up delay-2 mt-5 max-w-md text-base sm:text-lg leading-relaxed text-[#FAF6F0]/85 font-semibold">
                {isRtl
                  ? "قل لنا وقتك، مودك وميزانيتك، وجِدّاو يرتب لك طلعة كاملة."
                  : "Tell us your time, mood, and budget, and JEDDAW builds your complete outing."}
              </p>

              {/* CTAs Group */}
              <div className="animate-fade-in-up delay-3 mt-7 flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
                <Link
                  to="/quick-plan"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#C96745] to-[#B84E4E] px-8 py-4 text-base font-black text-white shadow-lift hover:scale-[1.02] hover:shadow-2xl border border-white/20 transition-all min-h-[54px] cursor-pointer group"
                >
                  <Sparkles className="h-5 w-5 text-white transition-transform duration-300 group-hover:rotate-12" />
                  <span>{isRtl ? "سوِّ لي خطة" : "Plan My Outing"}</span>
                  <ArrowLeft className={`h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1 ${isRtl ? "" : "rotate-180"}`} />
                </Link>

                <Link
                  to="/places"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-4 text-sm font-bold text-[#FAF6F0] backdrop-blur-xl transition-all min-h-[54px] cursor-pointer"
                >
                  <Navigation className="h-4.5 w-4.5" />
                  <span>{isRtl ? "استكشف جدة" : "Explore Jeddah"}</span>
                </Link>
              </div>

              {/* Small Contextual Microcopy Underneath */}
              <div className="animate-fade-in-up delay-4 mt-6 text-xs font-extrabold text-[#FAF6F0]/60 tracking-wide">
                <span>{isRtl ? "مطاعم • كافيهات • فعاليات • بحر" : "Dining • Cafes • Activities • Sea"}</span>
              </div>

            </div>

            {/* LEFT SIDE (Signature Route Spatial Visual ~55% / 7 cols) */}
            <div className="lg:col-span-7 relative h-[380px] sm:h-[460px] lg:h-[520px] w-full flex items-center justify-center">
              <JeddawHeroVisual />
            </div>

          </div>
        </div>
      </section>

      {/* ===== BELOW THE FOLD: INSTANT SEARCH & DISCOVERY ===== */}
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
        </div>

        {/* SINGLE NON-DUPLICATED FLASH OFFERS BANNER */}
        <FlashOffersBanner />
      </section>

      {/* ===== SECTION 11: WHY JEDDAW — PRODUCT DIFFERENTIATION ===== */}
      <section className="mx-auto max-w-5xl px-4 py-14">
        <div className="rounded-3xl bg-gradient-to-r from-[#091C1A] via-[#122A27] to-[#1E423E] text-[#FAF6F0] p-7 md:p-10 shadow-2xl border border-white/15 backdrop-blur-xl">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C96745]/20 px-4 py-1 text-xs font-extrabold text-[#FF9D7A] border border-[#C96745]/30 mb-3">
              💡 {isRtl ? "فرق جِدّاو عن باقي التطبيقات" : "The JEDDAW Difference"}
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
              {isRtl
                ? "المواقع الثانية تعطيك أماكن. جِدّاو يرتّب لك الطلعة كاملة."
                : "Other platforms list places. JEDDAW builds your complete outing."}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Traditional Apps Side */}
            <div className="rounded-2xl bg-black/30 p-5 border border-white/10 text-start">
              <span className="text-xs font-extrabold text-white/50 block mb-2">❌ التطبيقات العادية</span>
              <p className="text-sm font-bold text-white/70 leading-relaxed">
                تعطيك قائمة خيارات طويلة، فتضيع بين التقييمات والانستقرام وتظل محتار وين تروح أول.
              </p>
            </div>

            {/* JEDDAW Side */}
            <div className="rounded-2xl bg-[#C96745]/20 p-5 border border-[#C96745]/40 text-start">
              <span className="text-xs font-extrabold text-[#FF9D7A] block mb-2">✨ جِدّاو الذكي</span>
              <p className="text-sm font-black text-white leading-relaxed">
                يعطيك خطة متسلسلة وموزونة: مطعم مناسب 🍽️ + قهوة روقان ☕ + فعالية حماسية 🏎️ مع مسار الخريطة والوقت.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 12: MOOD / "وش جوّكم اليوم؟" (ICON SYSTEM) ===== */}
      <section className="bg-gradient-to-b from-[#F4EBDD] via-[#FAF6F0] to-[#F4EBDD] dark:from-[#121817] dark:via-[#192322] dark:to-[#121817] pt-16 pb-16 border-t border-b border-[#E2D3BE]/80 dark:border-white/10 relative">
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

          {/* 12 Interactive Vibe Cards with Icons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
            {quickVibes.map((chip) => {
              const isActive = selectedVibe.id === chip.id;
              const IconComp = chip.icon;
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => setSelectedVibe(chip)}
                  className={`group relative flex flex-col items-center justify-center p-4 text-center rounded-2xl transition-all duration-300 min-h-[105px] border cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-br from-[#C96745] to-[#397C78] text-white shadow-lift scale-105 border-white/40"
                      : "bg-white/95 dark:bg-[#1F2B2A] text-[#252A28] dark:text-[#F5F1E8] border-[#E2D3BE] dark:border-white/15 shadow-sm hover:scale-[1.02] hover:border-[#C96745]"
                  }`}
                >
                  {/* Top Indicator */}
                  {isActive && (
                    <span className="absolute top-2 end-2 grid h-4 w-4 place-items-center rounded-full bg-white text-[#C96745] shadow-xs">
                      <CheckCircle2 className="h-3 w-3" />
                    </span>
                  )}

                  {/* Icon Badge Container */}
                  <span className={`grid h-10 w-10 place-items-center rounded-xl text-lg mb-2 transition-transform duration-300 group-hover:scale-110 ${
                    isActive ? "bg-white/20 text-white" : "bg-[#FAF6F0] dark:bg-[#161B1A] text-[#C96745]"
                  }`}>
                    <IconComp className="h-5 w-5" />
                  </span>

                  <span className={`text-xs font-extrabold leading-tight ${isActive ? "text-white" : "group-hover:text-[#C96745]"}`}>
                    {isRtl ? chip.labelAr : chip.labelEn}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ===== Recommendations Box for Selected Vibe ===== */}
          <div className="mt-10 rounded-3xl bg-white dark:bg-[#1A2221] p-6 md:p-8 border border-[#E2D3BE] dark:border-white/10 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2D3BE]/60 dark:border-white/10 pb-5 mb-6">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#C96745]/15 text-[#C96745]">
                  <Sparkles className="h-5 w-5" />
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
                  {isRtl ? "سوّ لي خطة متكاملة لهذا الجو ✨" : "Build My Complete Plan for This Vibe ✨"}
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

      {/* ===== SECTION 14: TRENDING SECTION ("مختارات جِدّاو هذا الأسبوع") ===== */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#C96745]/15 px-4 py-1 text-xs font-bold text-[#C96745] mb-2">
              <Zap className="h-4 w-4" /> {isRtl ? "توصيات ومختارات الأسبوع" : "Weekly Curated Picks"}
            </div>
            <h2 className="text-3xl font-black text-[#252A28] dark:text-[#F5F1E8] md:text-4xl">
              {isRtl ? "مختارات جِدّاو هذا الأسبوع 🔥" : "JEDDAW Weekly Picks 🔥"}
            </h2>
            <p className="mt-2 text-sm text-[#6E716C] dark:text-[#B5B8B2] font-semibold max-w-xl">
              {isRtl
                ? "أبرز المطاعم والكافيهات والمواقع الأكثر طلباً في جدة لهذا الأسبوع"
                : "Top requested dining, cafes, and destinations in Jeddah this week"}
            </p>
          </div>
          <Link
            to="/places"
            className="inline-flex items-center gap-2 rounded-full border border-[#C96745] px-5 py-2.5 text-xs font-bold text-[#C96745] hover:bg-[#C96745] hover:text-white transition-all min-h-[44px]"
          >
            <span>{isRtl ? "استكشف كل الأماكن" : "Explore All Spots"}</span>
            <ArrowLeft className={`h-4 w-4 ${isRtl ? "" : "rotate-180"}`} />
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {getTrendingPlaces().map((item) => (
            <article
              key={item.place.id}
              className="surface-card p-5 hover-lift relative overflow-hidden group border border-[#E2D3BE] dark:border-white/10 flex flex-col justify-between rounded-3xl"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#FAF6F0] dark:bg-[#161B1A] text-sm font-black text-[#C96745] shrink-0 border border-[#E2D3BE]/60 dark:border-white/10">
                      #{item.rank}
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
                </div>

                <p className="text-xs text-[#6E716C] dark:text-[#B5B8B2] font-semibold leading-relaxed line-clamp-2">
                  {isRtl ? item.place.descAr : item.place.descEn}
                </p>
              </div>

              <div className="mt-5 border-t border-[#E2D3BE] dark:border-white/10 pt-4 flex items-center justify-between text-xs font-bold">
                <span className="text-[#397C78] dark:text-[#5EAAA5] flex items-center gap-1">
                  ⭐ {item.place.rating} · {item.place.districtId}
                </span>
                <Link
                  to="/places"
                  className="text-[#C96745] hover:underline flex items-center gap-1"
                >
                  {isRtl ? "التفاصيل 🗺️" : "Details 🗺️"}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ===== SECTION 15: CURATED JEDDAH DISTRICTS SHOWCASE (UNIQUE IMAGES) ===== */}
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
            {/* District Card 1: Corniche & Sunset */}
            <div className="group relative h-64 rounded-3xl overflow-hidden shadow-xl border border-white/20 hover-lift cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
                alt="الكورنيش والواجهة البحرية"
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-6 flex flex-col justify-end text-white">
                <span className="text-xs font-extrabold text-[#FF9D7A]">🏖️ 45+ {isRtl ? "وجهة" : "spots"}</span>
                <h3 className="text-xl font-black">{isRtl ? "الكورنيش والواجهة البحرية" : "Corniche & Waterfront"}</h3>
                <p className="text-xs font-semibold text-white/80 mt-1">
                  {isRtl ? "غروب، مشي، بحر وكافيهات إطلالة" : "Sunset walks, sea view cafes & dining"}
                </p>
              </div>
            </div>

            {/* District Card 2: Obhur Marinas & Resorts */}
            <div className="group relative h-64 rounded-3xl overflow-hidden shadow-xl border border-white/20 hover-lift cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80"
                alt="أبحر الشمالية والمنتجعات"
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-6 flex flex-col justify-end text-white">
                <span className="text-xs font-extrabold text-[#FF9D7A]">⛵ 30+ {isRtl ? "منتجع ونادي" : "resorts"}</span>
                <h3 className="text-xl font-black">{isRtl ? "أبحر الشمالية واليخوت" : "North Obhur & Marinas"}</h3>
                <p className="text-xs font-semibold text-white/80 mt-1">
                  {isRtl ? "شاطئ، أنشطة بحرية، شاليهات ومنتجعات" : "Private beach resorts & water sports"}
                </p>
              </div>
            </div>

            {/* District Card 3: Historic Al Balad */}
            <div className="group relative h-64 rounded-3xl overflow-hidden shadow-xl border border-white/20 hover-lift cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80"
                alt="البلد التاريخية"
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-6 flex flex-col justify-end text-white">
                <span className="text-xs font-extrabold text-[#FF9D7A]">🏛️ 25+ {isRtl ? "معلم وتراث" : "heritage spots"}</span>
                <h3 className="text-xl font-black">{isRtl ? "البلد والتراث التاريخي" : "Historic Al Balad"}</h3>
                <p className="text-xs font-semibold text-white/80 mt-1">
                  {isRtl ? "تاريخ، أسواق شعبية، ومشي وحجازيات" : "Traditional Hijazi houses & heritage walk"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 18: HOW IT WORKS ("كيف جِدّاو يرتّبها؟") ===== */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center mb-12">
          <span className="rounded-full bg-[#C96745]/15 px-4 py-1 text-xs font-extrabold text-[#C96745] mb-2 inline-block">
            ⚡ {isRtl ? "بساطة وسرعة" : "Simple & Instant"}
          </span>
          <h2 className="text-3xl font-black text-[#252A28] dark:text-[#F5F1E8] md:text-4xl">
            {isRtl ? "كيف جِدّاو يرتّبها؟" : "How JEDDAW Works?"}
          </h2>
          <p className="text-sm font-semibold text-[#6E716C] dark:text-[#B5B8B2] mt-1 max-w-md mx-auto">
            {isRtl
              ? "3 خطوات بسيطة للحصول على خطة طلعة جاهزة وموزونة بالكامل"
              : "3 simple steps to get a fully curated & tailored outing plan"}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Step 1 */}
          <div className="surface-card p-6 rounded-3xl border border-[#E2D3BE] dark:border-white/10 shadow-sm text-start relative overflow-hidden">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#C96745] text-white text-lg font-black mb-4">
              1
            </span>
            <h3 className="text-lg font-black text-[#252A28] dark:text-[#F5F1E8] mb-2">
              {isRtl ? "قل لنا جوّك" : "Tell Us Your Vibe"}
            </h3>
            <p className="text-xs font-semibold text-[#6E716C] dark:text-[#B5B8B2] leading-relaxed">
              اختر نوع الطلعة (روقان، عشاء بحري، عائلات، أو حماس مع الشلة).
            </p>
          </div>

          {/* Step 2 */}
          <div className="surface-card p-6 rounded-3xl border border-[#E2D3BE] dark:border-white/10 shadow-sm text-start relative overflow-hidden">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#397C78] text-white text-lg font-black mb-4">
              2
            </span>
            <h3 className="text-lg font-black text-[#252A28] dark:text-[#F5F1E8] mb-2">
              {isRtl ? "حدد ميزانيتك ووقتك" : "Set Time & Budget"}
            </h3>
            <p className="text-xs font-semibold text-[#6E716C] dark:text-[#B5B8B2] leading-relaxed">
              حدد الميزانية للشخص ووقت البداية والحي المفضل في جدة.
            </p>
          </div>

          {/* Step 3 */}
          <div className="surface-card p-6 rounded-3xl border border-[#E2D3BE] dark:border-white/10 shadow-sm text-start relative overflow-hidden">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#E4A23B] text-white text-lg font-black mb-4">
              3
            </span>
            <h3 className="text-lg font-black text-[#252A28] dark:text-[#F5F1E8] mb-2">
              {isRtl ? "خذ خطتك كاملة" : "Get Full Itinerary"}
            </h3>
            <p className="text-xs font-semibold text-[#6E716C] dark:text-[#B5B8B2] leading-relaxed">
              احصل على مسار متسلسل ومجهز بالخرائط وحاسبة الفاتورة ومشاركة الواتساب.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
