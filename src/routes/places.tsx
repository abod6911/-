import { createFileRoute } from "@tanstack/react-router";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Filter, Search, X } from "lucide-react";
import { PlaceCard } from "@/components/places/PlaceCard";
import { districts, places, type DistrictId, type Place } from "@/data/jeddah";
import { useLanguage } from "@/context/LanguageContext";

export const Route = createFileRoute("/places")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      q: (search.q as string) || "",
    };
  },
  head: () => ({
    meta: [
      { title: "استكشف جدة على راحتك | جِدّاو — مطاعم، كافيهات، فنادق، ومنتجعات" },
      {
        name: "description",
        content: "دليلك الشامل لتصفح واستكشاف مطاعم، كافيهات، فنادق، منتجعات، وفعاليات جدة حسب التصنيف والتخصص والترند والموقع على الخريطة.",
      },
      { property: "og:title", content: "استكشف جدة على راحتك — جِدّاو" },
      { property: "og:description", content: "مطاعم شامية، مصري، وجبات سريعة، سعودية قديمة، فنادق 5 نجوم ومنتجعات على البحر." },
    ],
    links: [{ rel: "canonical", href: "/places" }],
  }),
  component: PlacesPage,
});

type MainCategory = "all" | "food" | "cafe" | "hotel" | "resort" | "activity" | "shopping";
type SortOption = "topRated" | "trending" | "mostVisited" | "cheapest" | "priceDesc";

const subCategoryChips = [
  { id: "all", labelAr: "الكل 🌟", labelEn: "All 🌟" },
  { id: "مطاعم شامية", labelAr: "🥙 مطاعم شامية", labelEn: "🥙 Levantine Dining" },
  { id: "وجبات سريعة", labelAr: "🍔 وجبات سريعة", labelEn: "🍔 Fast Food & Burgers" },
  { id: "مطاعم سعودية قديمة", labelAr: "🇸🇦 مطاعم سعودية قديمة", labelEn: "🇸🇦 Traditional Saudi" },
  { id: "مطاعم مصرية", labelAr: "🇪🇬 مطاعم مصرية", labelEn: "🇪🇬 Egyptian Cuisine" },
  { id: "مشاوي ومأكولات بحرية", labelAr: "🐟 مشاوي ومأكولات بحرية", labelEn: "🐟 Seafood & Grills" },
  { id: "كافيهات مختصة ورائية", labelAr: "☕ كافيهات مختصة ورائية", labelEn: "☕ Specialty Cafes" },
  { id: "مولات ومراكز تجارية", labelAr: "🛍️ مولات ومراكز تجارية", labelEn: "🛍️ Malls & Shopping" },
  { id: "أسواق شعبية وتراثية", labelAr: "🏺 أسواق شعبية وتراثية", labelEn: "🏺 Heritage Souqs" },
  { id: "فنادق 5 نجوم وفاخرة", labelAr: "🏨 فنادق 5 نجوم وفاخرة", labelEn: "🏨 5-Star Luxury Hotels" },
  { id: "منتجعات البحر الأحمر وأبحر", labelAr: "🏖️ منتجعات أبحر والبحر", labelEn: "🏖️ Obhur Beach Resorts" },
];

function PlacesPage() {
  const { isRtl } = useLanguage();
  const searchParams = Route.useSearch();

  // Local immediate input state for 0ms visual typing feedback
  const [inputValue, setInputValue] = useState(searchParams.q || "");

  // Debounced search query state to decouple typing from dataset filtering
  const [debouncedQuery, setDebouncedQuery] = useState(searchParams.q || "");

  const [mainCat, setMainCat] = useState<MainCategory>("all");
  const [subCat, setSubCat] = useState<string>("all");
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictId | "all">("all");
  const [sortBy, setSortBy] = useState<SortOption>("trending");

  // Sync initial searchParams.q if provided via navigation
  useEffect(() => {
    if (searchParams.q) {
      setInputValue(searchParams.q);
      setDebouncedQuery(searchParams.q);
    }
  }, [searchParams.q]);

  // 250ms Debounce Timer to isolate keystrokes from dataset recalculations
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(inputValue);
    }, 250);
    return () => clearTimeout(timer);
  }, [inputValue]);

  // Concurrent React Deferred Value for smooth background list updates
  const deferredQuery = useDeferredValue(debouncedQuery);

  const filteredAndSorted = useMemo(() => {
    let list = places.filter((p) => {
      // Main category filter
      if (mainCat !== "all") {
        if (mainCat === "activity" && !(p.kind === "activity" || p.kind === "outdoor" || p.kind === "culture" || p.kind === "shopping")) return false;
        if (mainCat !== "activity" && p.kind !== mainCat) return false;
      }

      // Sub category filter
      if (subCat !== "all" && p.subCategoryAr !== subCat.trim() && !p.subCategoryAr?.includes(subCat.trim())) {
        return false;
      }

      // District filter
      if (selectedDistrict !== "all" && p.districtId !== selectedDistrict) return false;

      // Deferred Search Query filtering
      if (deferredQuery.trim()) {
        const q = deferredQuery.trim().toLowerCase();
        const nameMatch = p.nameAr.toLowerCase().includes(q) || p.nameEn.toLowerCase().includes(q);
        const descMatch = p.descAr.toLowerCase().includes(q) || p.descEn.toLowerCase().includes(q);
        const catMatch = p.categoryAr.toLowerCase().includes(q) || (p.subCategoryAr && p.subCategoryAr.toLowerCase().includes(q));
        if (!nameMatch && !descMatch && !catMatch) return false;
      }

      return true;
    });

    // Sorting
    return list.sort((a, b) => {
      if (sortBy === "trending") {
        return (b.trending ? 1 : 0) - (a.trending ? 1 : 0) || (b.viewsCount || 0) - (a.viewsCount || 0);
      }
      if (sortBy === "topRated") {
        return (b.rating || 0) - (a.rating || 0);
      }
      if (sortBy === "mostVisited") {
        return (b.viewsCount || 0) - (a.viewsCount || 0);
      }
      if (sortBy === "cheapest") {
        return a.pricePerPerson - b.pricePerPerson;
      }
      if (sortBy === "priceDesc") {
        return b.pricePerPerson - a.pricePerPerson;
      }
      return 0;
    });
  }, [deferredQuery, mainCat, subCat, selectedDistrict, sortBy]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
      {/* Header Banner & Flagship Search Input */}
      <div className="animate-fade-in-up rounded-3xl bg-gradient-to-r from-[#091C1A] via-[#122A27] to-[#1E423E] p-6 md:p-8 text-[#FAF6F0] shadow-2xl border border-white/15 relative overflow-hidden">
        <div className="absolute top-0 end-0 h-64 w-64 rounded-full bg-[#C96745]/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-start md:items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[#C96745] to-[#E4A23B] text-white text-2xl shadow-lg shrink-0">
              🗺️
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="rounded-full bg-[#C96745]/20 px-3 py-0.5 text-[11px] font-extrabold text-[#FF9D7A] border border-[#C96745]/30">
                  {isRtl ? "دليل جدة الشامل 2026" : "Jeddah 2026 Master Guide"}
                </span>
                <span className="rounded-full bg-[#5EAAA5]/20 px-3 py-0.5 text-[11px] font-extrabold text-[#5EAAA5] border border-[#5EAAA5]/30">
                  {isRtl ? "+150 وجهة ومكان" : "+150 Destinations"}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
                {isRtl ? "استكشف جدة على راحتك" : "Explore Jeddah Your Way"}
              </h1>
              <p className="mt-1 text-xs md:text-sm text-[#FAF6F0]/80 font-medium max-w-xl">
                {isRtl
                  ? "دليلك التفاعلي لجميع مطاعم، كافيهات، فنادق، منتجعات وفعاليات جدة مع تفاصيل الموقع والخرائط"
                  : "Your interactive guide to restaurants, cafes, hotels, resorts & activities in Jeddah."}
              </p>
            </div>
          </div>

          {/* FLAGSHIP ISOLATED ZERO-LAG SEARCH INPUT (100% Mobile Safe) */}
          <div className="relative pt-2">
            <div className="relative flex items-center">
              <Search className="absolute start-4 h-5 w-5 text-[#C96745] pointer-events-none z-10" />
              <input
                type="text"
                inputMode="search"
                autoCapitalize="none"
                autoCorrect="off"
                placeholder={
                  isRtl
                    ? "ابحث باسم المكان، الحي، أو نوع الأكل (مثال: كافيه الروضة، الشاطئ، مشاوي)..."
                    : "Search by place name, district, or food category..."
                }
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full rounded-2xl border border-white/20 bg-white/10 dark:bg-black/30 backdrop-blur-xl ps-12 pe-10 py-3.5 text-base font-bold text-white placeholder:text-white/60 focus:border-[#C96745] focus:bg-black/40 focus:outline-none focus:ring-2 focus:ring-[#C96745]/50 shadow-inner transition-all min-h-[52px]"
              />
              {inputValue.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setInputValue("");
                    setDebouncedQuery("");
                  }}
                  className="absolute end-3 grid h-7 w-7 place-items-center rounded-full bg-white/20 hover:bg-[#C96745] text-white transition-all cursor-pointer z-10"
                  aria-label="مسح البحث"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Categories Tabs */}
      <div className="mt-8 flex items-center gap-2.5 overflow-x-auto pb-3 sm:pb-4 sm:flex-wrap border-b border-[#E2D3BE] dark:border-white/10 no-scrollbar">
        {[
          { id: "all", label: isRtl ? "الكل 🌟" : "All 🌟" },
          { id: "food", label: isRtl ? "🍽️ مطاعم" : "🍽️ Dining" },
          { id: "cafe", label: isRtl ? "☕ كافيهات وحلى" : "☕ Cafes & Sweets" },
          { id: "shopping", label: isRtl ? "🛍️ تسوق ومولات" : "🛍️ Shopping & Malls" },
          { id: "hotel", label: isRtl ? "🏨 فنادق" : "🏨 Hotels" },
          { id: "resort", label: isRtl ? "🏖️ منتجعات" : "🏖️ Resorts" },
          { id: "activity", label: isRtl ? "🎮 أنشطة وفعاليات" : "🎮 Activities & Events" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setMainCat(tab.id as MainCategory);
              setSubCat("all");
            }}
            className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-extrabold transition-all min-h-[44px] shrink-0 active:scale-95 cursor-pointer ${
              mainCat === tab.id
                ? "bg-gradient-to-r from-[#C96745] to-[#E4A23B] text-white shadow-lift scale-[1.02] border border-white/20"
                : "bg-[#FAF6F0] dark:bg-[#222826] text-[#252A28] dark:text-[#F5F1E8] border border-[#E2D3BE] dark:border-white/10 hover:border-[#C96745]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sub-Category Filter Chips */}
      <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 sm:flex-wrap [webkit-overflow-scrolling:touch]">
        {subCategoryChips.map((chip) => (
          <button
            key={chip.id}
            onClick={() => setSubCat(chip.id)}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all min-h-[38px] shrink-0 ${
              subCat === chip.id
                ? "bg-[#397C78] text-white shadow-sm"
                : "bg-[#F4EBDD] dark:bg-[#161B1A] text-[#252A28] dark:text-[#F5F1E8] border border-[#E2D3BE]/60 dark:border-white/10 hover:border-[#397C78]"
            }`}
          >
            {isRtl ? chip.labelAr : chip.labelEn}
          </button>
        ))}
      </div>

      {/* Interactive Filters Bar (Zero Keyboard Needed) */}
      <div className="surface-card mt-6 p-5 animate-fade-in-up delay-1 border border-[#E2D3BE] dark:border-white/10 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-black text-[#397C78] dark:text-[#5EAAA5]">
            <Filter className="h-4 w-4" />
            <span>{isRtl ? "تصفية سريعة بالحي والميزانية والترتيب:" : "Quick Filter by District, Budget & Sort:"}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* District Selector */}
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value as any)}
              className="rounded-2xl border border-[#E2D3BE] dark:border-white/15 bg-[#FAF6F0] dark:bg-[#161B1A] px-4 py-2.5 text-xs font-bold text-[#252A28] dark:text-[#F5F1E8] min-h-[44px] cursor-pointer"
            >
              <option value="all">{isRtl ? "📍 الحي: كل جدة" : "📍 District: All Jeddah"}</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {isRtl ? d.nameAr : d.nameEn}
                </option>
              ))}
            </select>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-2xl border border-[#C96745] bg-[#C96745]/10 px-4 py-2.5 text-xs font-extrabold text-[#C96745] min-h-[44px] cursor-pointer"
            >
              <option value="trending">{isRtl ? "🔥 الترتيب: الترند أولاً" : "🔥 Sort: Trending First"}</option>
              <option value="topRated">{isRtl ? "⭐ الترتيب: الأفضل تقييماً" : "⭐ Sort: Top Rated"}</option>
              <option value="mostVisited">{isRtl ? "👁️ الترتيب: الأكثر زيارة" : "👁️ Sort: Most Popular"}</option>
              <option value="cheapest">{isRtl ? "💰 الترتيب: الأقل سعراً" : "💰 Sort: Lowest Price"}</option>
              <option value="priceDesc">{isRtl ? "💎 الترتيب: الأكثر فخامة" : "💎 Sort: Luxury First"}</option>
            </select>

            {/* Reset Filters Button */}
            {(mainCat !== "all" || subCat !== "all" || selectedDistrict !== "all" || sortBy !== "trending" || inputValue !== "") && (
              <button
                type="button"
                onClick={() => {
                  setInputValue("");
                  setDebouncedQuery("");
                  setMainCat("all");
                  setSubCat("all");
                  setSelectedDistrict("all");
                  setSortBy("trending");
                }}
                className="rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 px-3.5 py-2.5 text-xs font-extrabold hover:bg-rose-500 hover:text-white transition-all active:scale-95 min-h-[44px] cursor-pointer"
              >
                🔄 {isRtl ? "إعادة ضبط الفلاتر والبحث" : "Reset Filters & Search"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid Results */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-[#6E716C] dark:text-[#B5B8B2]">
            {isRtl
              ? `تم العثور على ${filteredAndSorted.length} مكان في جدة`
              : `Found ${filteredAndSorted.length} places in Jeddah`}
          </p>
          <span className="text-xs text-[#397C78] dark:text-[#5EAAA5] font-bold">
            💡 {isRtl ? "اضغط على أي مكان لمعاينة تفاصيل الموقع والخرائط والتقييمات" : "Click any place for location details, maps & reviews"}
          </span>
        </div>

        {filteredAndSorted.length === 0 ? (
          <div className="surface-card p-12 text-center border border-[#E2D3BE] dark:border-white/10">
            <span className="text-5xl block mb-3">🔍</span>
            <h2 className="text-xl font-bold text-[#252A28] dark:text-[#F5F1E8]">
              {isRtl ? "ما لقينا أماكن تطابق الفلتر المدخل" : "No places match your input query"}
            </h2>
            <p className="text-sm text-[#6E716C] dark:text-[#B5B8B2] mt-2">
              {isRtl
                ? "جرّب تغيير كلمة البحث أو اختيار تصنيف آخر لتظهر باقي خيارات جدة"
                : "Try clearing search keywords or choosing another category."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAndSorted.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}