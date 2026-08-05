import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { PlaceCard } from "@/components/places/PlaceCard";
import { districts, places, type PlaceKind } from "@/data/jeddah";
import { useLanguage } from "@/context/LanguageContext";

export const Route = createFileRoute("/places")({
  head: () => ({
    meta: [
      { title: "أماكن الترفيه والمطاعم في جدة | وش الخطة؟" },
      {
        name: "description",
        content:
          "دليل أماكن جدة: ترفيه داخلي، بحر وخارجي، مطاعم، مقاهي، وثقافة وتاريخ — مع الأسعار والمدة والأحياء.",
      },
      { property: "og:title", content: "دليل أماكن جدة — وش الخطة؟" },
      { property: "og:description", content: "تصفّح أماكن جدة حسب الحي والتصنيف والميزانية." },
      { property: "og:url", content: "/places" },
    ],
    links: [{ rel: "canonical", href: "/places" }],
  }),
  component: PlacesPage,
});

const kinds: { id: PlaceKind | "all"; ar: string; en: string; emoji: string }[] = [
  { id: "all", ar: "الكل", en: "All", emoji: "✨" },
  { id: "activity", ar: "ترفيه داخلي", en: "Indoor Activity", emoji: "🎮" },
  { id: "outdoor", ar: "بحر وخارجي", en: "Sea & Outdoor", emoji: "🌊" },
  { id: "food", ar: "مطاعم", en: "Restaurants", emoji: "🍽️" },
  { id: "cafe", ar: "مقاهي وحلى", en: "Cafes & Desserts", emoji: "☕" },
  { id: "culture", ar: "ثقافة وتاريخ", en: "Culture & History", emoji: "🏛️" },
  { id: "shopping", ar: "تسوق", en: "Shopping", emoji: "🛍️" },
];

function PlacesPage() {
  const { t, isRtl } = useLanguage();
  const [kind, setKind] = useState<PlaceKind | "all">("all");
  const [district, setDistrict] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState(500);
  const [showFilters, setShowFilters] = useState(false);

  const list = places.filter((p) => {
    const matchesKind = kind === "all" || p.kind === kind;
    const matchesDistrict = district === "all" || p.districtId === district;
    const matchesPrice = p.pricePerPerson <= maxPrice;
    const matchesQuery =
      !searchQuery.trim() ||
      p.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nameEn.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesKind && matchesDistrict && matchesPrice && matchesQuery;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold md:text-4xl">{t("placesTitle")} 📍</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">{t("placesDesc")}</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="animate-fade-in-up delay-1 surface-card mt-6 p-5 space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute start-3.5 top-3.5 h-4.5 w-4.5 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("searchPlace")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-pearl ps-10 pe-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal transition-all"
          />
        </div>

        {/* Category Chips */}
        <div className="flex flex-wrap gap-2">
          {kinds.map((k) => (
            <button
              key={k.id}
              onClick={() => setKind(k.id)}
              aria-pressed={kind === k.id}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-200 min-h-[40px] ${
                kind === k.id
                  ? "bg-teal text-primary-foreground shadow-soft scale-[1.02]"
                  : "bg-mist text-navy hover:bg-mist/80 hover:shadow-soft active:scale-[0.98]"
              }`}
            >
              <span className="text-base">{k.emoji}</span>
              {isRtl ? k.ar : k.en}
            </button>
          ))}
        </div>

        {/* Toggle filters button for mobile */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm font-semibold text-teal md:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {isRtl ? "فلاتر إضافية" : "More Filters"}
        </button>

        {/* District and Price Filters */}
        <div className={`grid gap-4 sm:grid-cols-2 ${showFilters ? "block" : "hidden md:grid"}`}>
          <label className="text-sm font-semibold">
            {isRtl ? "الحي" : "District"}
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="mt-2 block w-full rounded-xl border border-border bg-pearl px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal transition-all"
            >
              <option value="all">{isRtl ? "كل الأحياء" : "All Districts"}</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {isRtl ? d.nameAr : d.nameEn}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-semibold">
            <div className="flex items-center justify-between">
              <span>{t("maxPrice")}</span>
              <span className="rounded-full bg-teal/10 px-2.5 py-0.5 text-xs font-bold text-teal">
                {maxPrice} {isRtl ? "ر.س" : "SAR"}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={500}
              step={20}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="mt-4 block w-full accent-[var(--teal)] h-2 rounded-full"
            />
          </label>
        </div>
      </div>

      {/* Results count */}
      <div className="mt-4 text-sm text-muted-foreground">
        {list.length} {isRtl ? "مكان" : "places"}
      </div>

      {/* Places Grid */}
      {list.length === 0 ? (
        <div className="mt-10 rounded-2xl bg-pearl p-8 text-center animate-fade-in-up">
          <span className="text-4xl">🔍</span>
          <p className="mt-3 text-muted-foreground">
            {t("noPlacesFound")}
          </p>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <PlaceCard key={p.id} place={p} />
          ))}
        </div>
      )}
    </div>
  );
}