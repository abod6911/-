import React, { memo, useCallback, useState } from "react";
import { Search, MapPin, Sparkles, Filter, X } from "lucide-react";
import { places, districts, type Place } from "@/data/jeddah";
import { useLanguage } from "@/context/LanguageContext";
import { MobileInput } from "@/components/common/MobileInput";
import { PlaceCard } from "@/components/places/PlaceCard";

export const MobileSearchEngine = memo(function MobileSearchEngine() {
  const { isRtl } = useLanguage();
  const [query, setQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [selectedKind, setSelectedKind] = useState<string>("all");

  const categories = [
    { id: "all", labelAr: "الكل 🌟", labelEn: "All 🌟" },
    { id: "restaurant", labelAr: "🍽️ مطاعم", labelEn: "🍽️ Restaurants" },
    { id: "cafe", labelAr: "☕ كافيهات", labelEn: "☕ Cafes" },
    { id: "resort", labelAr: "🏖️ منتجعات أبحر", labelEn: "🏖️ Resorts" },
    { id: "hotel", labelAr: "🏨 فنادق فاخرة", labelEn: "🏨 Hotels" },
    { id: "activity", labelAr: "🎮 أنشطة وفعاليات", labelEn: "🎮 Activities" },
  ];

  const filteredPlaces = places.filter((place) => {
    // District Filter
    if (selectedDistrict !== "all" && place.districtId !== selectedDistrict) {
      return false;
    }
    // Kind Filter
    if (selectedKind !== "all" && place.kind !== selectedKind) {
      return false;
    }
    // Search Query Filter
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      const matchName = (place.nameAr + place.nameEn).toLowerCase().includes(q);
      const matchDistrict = (place.districtAr + place.districtEn).toLowerCase().includes(q);
      const matchSub = (place.subCategoryAr + place.subCategoryEn).toLowerCase().includes(q);
      return matchName || matchDistrict || matchSub;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Search Input Bar */}
      <div className="relative">
        <MobileInput
          type="search"
          dir="auto"
          onValueChange={setQuery}
          debounceMs={150}
          placeholder={
            isRtl
              ? "ابحث عن مطعم، كافيه، أو منطقة في جدة..."
              : "Search restaurants, cafes, or districts..."
          }
          icon={<Search className="h-5 w-5 text-[#C96745]" />}
          className="bg-white dark:bg-[#1C2422] border-[#E2D3BE] dark:border-white/10 shadow-sm text-base min-h-[50px]"
        />
      </div>

      {/* Horizontal Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-0.5">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedKind(cat.id)}
            className={`shrink-0 rounded-2xl px-4 py-2 text-xs font-black transition-all active:scale-95 cursor-pointer border ${
              selectedKind === cat.id
                ? "bg-[#C96745] text-white border-[#C96745] shadow-md"
                : "bg-white dark:bg-[#1C2422] text-[#252A28] dark:text-[#F5F1E8] border-[#E2D3BE] dark:border-white/10 hover:border-[#C96745]"
            }`}
          >
            {isRtl ? cat.labelAr : cat.labelEn}
          </button>
        ))}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs font-extrabold text-[#6E716C] dark:text-[#B5B8B2] px-1 pt-1">
        <span>
          {isRtl
            ? `تم العثور على ${filteredPlaces.length} مكان في جدة`
            : `Found ${filteredPlaces.length} places in Jeddah`}
        </span>
        {(selectedKind !== "all" || selectedDistrict !== "all" || query) && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSelectedKind("all");
              setSelectedDistrict("all");
            }}
            className="text-[#C96745] hover:underline cursor-pointer"
          >
            {isRtl ? "إعادة ضبط ↺" : "Reset ↺"}
          </button>
        )}
      </div>

      {/* Places Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredPlaces.slice(0, 20).map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </div>
    </div>
  );
});
