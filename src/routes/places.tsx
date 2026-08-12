import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpDown, Compass, Filter, Flame, Hotel, MapPin, Search, Star, Utensils } from "lucide-react";
import { PlaceCard } from "@/components/places/PlaceCard";
import { districts, places, type DistrictId, type Place, type PlaceKind } from "@/data/jeddah";
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
  const { t, isRtl } = useLanguage();
  const searchParams = Route.useSearch();
  const [query, setQuery] = useState(searchParams.q || "");
  const [mainCat, setMainCat] = useState<MainCategory>("all");
  const [subCat, setSubCat] = useState<string>("all");
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictId | "all">("all");
  const [sortBy, setSortBy] = useState<SortOption>("trending");

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

      // Search query
      if (query.trim()) {
        const q = query.toLowerCase();
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
  }, [query, mainCat, subCat, selectedDistrict, sortBy]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Header Banner */}
      <div className="animate-fade-in-up flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#C96745]/15 text-2xl">🗺️</span>
        <div>
          <h1 className="text-3xl font-extrabold text-[#252A28] dark:text-[#F5F1E8] md:text-4xl">
            {isRtl ? "استكشف جدة على راحتك" : "Explore Jeddah Your Way"}
          </h1>
          <p className="mt-1 text-sm text-[#6E716C] dark:text-[#B5B8B2] font-semibold">
            {isRtl
              ? "دليلك الشامل لجميع مطاعم، كافيهات، فنادق، منتجعات وفعاليات جدة مع تفاصيل الموقع والخرائط"
              : "Your complete guide to restaurants, cafes, hotels, resorts & activities in Jeddah."}
          </p>
        </div>
      </div>

      {/* Main Categories Tabs */}
      <div className="mt-8 flex items-center gap-2.5 overflow-x-auto pb-3 sm:pb-4 sm:flex-wrap border-b border-[#E2D3BE] dark:border-white/10 [webkit-overflow-scrolling:touch]">
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
            className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold transition-all min-h-[44px] shrink-0 ${
              mainCat === tab.id
                ? "bg-[#C96745] text-white shadow-lift scale-[1.02]"
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

      {/* Search and Filters Bar */}
      <div className="surface-card mt-6 p-6 animate-fade-in-up delay-1 border border-[#E2D3BE] dark:border-white/10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute start-3.5 top-3.5 h-4 w-4 text-[#6E716C]" />
            <input
              type="text"
              placeholder={
                isRtl
                  ? "ابحث عن اسم المطعم، الكافيه، الفندق، أو نوع الأكل..."
                  : "Search place name, cafe, hotel, or cuisine type..."
              }
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-2xl border border-[#E2D3BE] dark:border-white/15 bg-[#FAF6F0] dark:bg-[#161B1A] ps-10 pe-4 py-3 text-base sm:text-sm font-semibold text-[#252A28] dark:text-[#F5F1E8] transition-all focus:border-[#C96745] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2.5">
            {/* District Selector */}
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value as any)}
              className="rounded-2xl border border-[#E2D3BE] dark:border-white/15 bg-[#FAF6F0] dark:bg-[#161B1A] px-4 py-3 text-sm font-bold text-[#252A28] dark:text-[#F5F1E8]"
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
              className="rounded-2xl border border-[#C96745] bg-[#C96745]/10 px-4 py-3 text-sm font-extrabold text-[#C96745]"
            >
              <option value="trending">{isRtl ? "🔥 الترتيب: الترند أولاً" : "🔥 Sort: Trending First"}</option>
              <option value="topRated">{isRtl ? "⭐ الترتيب: الأفضل تقييماً" : "⭐ Sort: Top Rated"}</option>
              <option value="mostVisited">{isRtl ? "👁️ الترتيب: الأكثر زيارة" : "👁️ Sort: Most Popular"}</option>
              <option value="cheapest">{isRtl ? "💰 الترتيب: الأقل سعراً" : "💰 Sort: Lowest Price"}</option>
              <option value="priceDesc">{isRtl ? "💎 الترتيب: الأكثر فخامة" : "💎 Sort: Luxury First"}</option>
            </select>
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
              {isRtl ? "ما لقينا أماكن تطابق الفلتر المحدد" : "No places match your filters"}
            </h2>
            <p className="text-sm text-[#6E716C] dark:text-[#B5B8B2] mt-2">
              {isRtl
                ? "جرّب تغيير التصنيف أو مسح كلمة البحث لتظهر باقي خيارات جدة"
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