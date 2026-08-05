import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Filter, Search } from "lucide-react";
import { PlaceCard } from "@/components/places/PlaceCard";
import { districts, places, type DistrictId, type Place } from "@/data/jeddah";
import { useLanguage } from "@/context/LanguageContext";

export const Route = createFileRoute("/places")({
  head: () => ({
    meta: [
      { title: "أماكن وأنشطة في جدة | جِدّاو — JEDDAW" },
      {
        name: "description",
        content: "اكتشف أماكن الترفيه والمطاعم والمقاهي والأنشطة المناسبة للعائلات والأصدقاء والسياح في جدة مع جِدّاو.",
      },
    ],
    links: [{ rel: "canonical", href: "/places" }],
  }),
  component: PlacesPage,
});

function PlacesPage() {
  const { t, isRtl } = useLanguage();
  const [query, setQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictId | "all">("all");
  const [kindFilter, setKindFilter] = useState<Place["kind"] | "all">("all");
  const [maxPrice, setMaxPrice] = useState<number>(500);

  const filtered = useMemo(() => {
    return places.filter((p) => {
      if (selectedDistrict !== "all" && p.districtId !== selectedDistrict) return false;
      if (kindFilter !== "all" && p.kind !== kindFilter) return false;
      if (p.pricePerPerson > maxPrice) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const nameMatch = p.nameAr.toLowerCase().includes(q) || p.nameEn.toLowerCase().includes(q);
        const descMatch = p.descAr.toLowerCase().includes(q) || p.descEn.toLowerCase().includes(q);
        if (!nameMatch && !descMatch) return false;
      }
      return true;
    });
  }, [query, selectedDistrict, kindFilter, maxPrice]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="animate-fade-in-up flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#397C78]/15 text-xl">📍</span>
        <div>
          <h1 className="text-3xl font-extrabold text-[#252A28] md:text-4xl">{t("placesTitle")}</h1>
          <p className="mt-1 text-sm text-[#6E716C] font-semibold">{t("placesDesc")}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="surface-card mt-8 p-6 animate-fade-in-up delay-1">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="absolute start-3.5 top-3.5 h-4 w-4 text-[#6E716C]" />
            <input
              type="text"
              placeholder={t("searchPlace")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-2xl border border-[#E2D3BE] bg-[#FAF6F0] ps-10 pe-4 py-3 text-sm font-semibold transition-all focus:border-[#C96745] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2.5">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value as any)}
              className="rounded-2xl border border-[#E2D3BE] bg-[#FAF6F0] px-4 py-3 text-sm font-bold text-[#252A28]"
            >
              <option value="all">{t("chooseDistrict")}: الكل</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {isRtl ? d.nameAr : d.nameEn}
                </option>
              ))}
            </select>

            <select
              value={kindFilter}
              onChange={(e) => setKindFilter(e.target.value as any)}
              className="rounded-2xl border border-[#E2D3BE] bg-[#FAF6F0] px-4 py-3 text-sm font-bold text-[#252A28]"
            >
              <option value="all">التصنيف: الكل</option>
              <option value="activity">🎮 أنشطة وترفيه</option>
              <option value="food">🍽️ مطاعم</option>
              <option value="cafe">☕ مقاهي وحلى</option>
              <option value="culture">🏛️ ثقافة وتاريخ</option>
              <option value="outdoor">🌊 بحر وخارجي</option>
              <option value="shopping">🛍️ تسوق</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid Results */}
      <div className="mt-8">
        <p className="text-sm font-bold text-[#6E716C] mb-4">
          عرض {filtered.length} مكان في جدة
        </p>

        {filtered.length === 0 ? (
          <div className="surface-card p-10 text-center">
            <span className="text-5xl block mb-3">🔍</span>
            <h2 className="text-lg font-bold text-[#252A28]">{t("noPlacesFound")}</h2>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}