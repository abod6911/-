import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
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

const kinds: { id: PlaceKind | "all"; ar: string; en: string }[] = [
  { id: "all", ar: "الكل", en: "All" },
  { id: "activity", ar: "ترفيه داخلي", en: "Indoor Activity" },
  { id: "outdoor", ar: "بحر وخارجي", en: "Sea & Outdoor" },
  { id: "food", ar: "مطاعم", en: "Restaurants" },
  { id: "cafe", ar: "مقاهي وحلى", en: "Cafes & Desserts" },
  { id: "culture", ar: "ثقافة وتاريخ", en: "Culture & History" },
  { id: "shopping", ar: "تسوق", en: "Shopping" },
];

function PlacesPage() {
  const { t, isRtl } = useLanguage();
  const [kind, setKind] = useState<PlaceKind | "all">("all");
  const [district, setDistrict] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState(500);

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
      <h1 className="text-3xl font-bold md:text-4xl">{t("placesTitle")}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">{t("placesDesc")}</p>

      {/* Filter and Search Bar */}
      <div className="surface-card mt-6 space-y-4 p-5">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("searchPlace")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-pearl ps-9 pe-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal"
          />
        </div>

        {/* Category Chips */}
        <div className="flex flex-wrap gap-2">
          {kinds.map((k) => (
            <button
              key={k.id}
              onClick={() => setKind(k.id)}
              aria-pressed={kind === k.id}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                kind === k.id ? "bg-teal text-primary-foreground" : "bg-mist text-navy hover:bg-mist/80"
              }`}
            >
              {isRtl ? k.ar : k.en}
            </button>
          ))}
        </div>

        {/* District and Price Filters */}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold">
            {isRtl ? "الحي" : "District"}
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="mt-2 block w-full rounded-xl border border-border bg-pearl px-3 py-2"
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
            {t("maxPrice")}: {maxPrice} SAR
            <input
              type="range"
              min={0}
              max={500}
              step={20}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="mt-4 block w-full accent-[var(--teal)]"
            />
          </label>
        </div>
      </div>

      {list.length === 0 ? (
        <p className="mt-10 rounded-2xl bg-pearl p-8 text-center text-muted-foreground">
          {t("noPlacesFound")}
        </p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <PlaceCard key={p.id} place={p} />
          ))}
        </div>
      )}
    </div>
  );
}