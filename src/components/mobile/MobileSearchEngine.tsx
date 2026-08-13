import React, { memo, useState, useTransition, useDeferredValue } from "react";
import { Search, MapPin, Sparkles, Filter, X, ChevronDown } from "lucide-react";
import { places, districts, type Place } from "@/data/jeddah";
import { useLanguage } from "@/context/LanguageContext";
import { MobileInput } from "@/components/common/MobileInput";
import { PlaceCard } from "@/components/places/PlaceCard";

export const MobileSearchEngine = memo(function MobileSearchEngine() {
  const { isRtl } = useLanguage();
  const [query, setQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [selectedKind, setSelectedKind] = useState<string>("all");

  const [isPending, startTransition] = useTransition();
  const deferredQuery = useDeferredValue(query);

  const categories = [
    { id: "all", labelAr: "الكل 🌟", labelEn: "All 🌟" },
    { id: "restaurant", labelAr: "🍽️ مطاعم", labelEn: "🍽️ Restaurants" },
    { id: "cafe", labelAr: "☕ كافيهات", labelEn: "☕ Cafes" },
    { id: "resort", labelAr: "🏖️ منتجعات أبحر", labelEn: "🏖️ Resorts" },
    { id: "hotel", labelAr: "🏨 فنادق فاخرة", labelEn: "🏨 Hotels" },
    { id: "activity", labelAr: "🎮 أنشطة وفعاليات", labelEn: "🎮 Activities" },
  ];

  const quickDistricts = [
    { id: "all", labelAr: "كل الأحياء 📍", labelEn: "All Districts 📍" },
    { id: "corniche", labelAr: "🌊 الكورنيش", labelEn: "🌊 Corniche" },
    { id: "obhur", labelAr: "🏖️ أبحر الشمالية", labelEn: "🏖️ Obhur" },
    { id: "rawdah", labelAr: "☕ الروضة", labelEn: "☕ Al Rawdah" },
    { id: "shati", labelAr: "🌴 الشاطئ", labelEn: "🌴 Al Shati" },
    { id: "balad", labelAr: "🏛️ البلد التاريخية", labelEn: "🏛️ Al Balad" },
    { id: "hamra", labelAr: "🌇 الحمراء", labelEn: "🌇 Al Hamra" },
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
    if (deferredQuery.trim()) {
      const q = deferredQuery.trim().toLowerCase();
      const matchName = (place.nameAr + place.nameEn).toLowerCase().includes(q);
      const matchDistrict = (place.districtAr + place.districtEn).toLowerCase().includes(q);
      const matchSub = (place.subCategoryAr + place.subCategoryEn).toLowerCase().includes(q);
      return matchName || matchDistrict || matchSub;
    }
    return true;
  });

  const handleQueryChange = (val: string) => {
    startTransition(() => {
      setQuery(val);
    });
  };

  return (
    <div className="space-y-4">
      {/* 1-Tap Category Filter Chips */}
      <div className="space-y-2">
        <div className="text-[11px] font-black text-[#6E716C] dark:text-[#B5B8B2] flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-[#E4A23B]" />
          <span>{isRtl ? "تصفية سريعة بنقرة واحدة (بدون كتابة):" : "1-Tap Instant Filters (No Typing):"}</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-0.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedKind(cat.id)}
              className={`shrink-0 rounded-2xl px-4 py-2.5 text-xs font-black transition-all active:scale-95 cursor-pointer border ${
                selectedKind === cat.id
                  ? "bg-[#C96745] text-white border-[#C96745] shadow-md"
                  : "bg-white dark:bg-[#1C2422] text-[#252A28] dark:text-[#F5F1E8] border-[#E2D3BE] dark:border-white/10 hover:border-[#C96745]"
              }`}
            >
              {isRtl ? cat.labelAr : cat.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* 1-Tap District Selector Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-0.5">
        {quickDistricts.map((dist) => (
          <button
            key={dist.id}
            type="button"
            onClick={() => setSelectedDistrict(dist.id)}
            className={`shrink-0 rounded-2xl px-3.5 py-2 text-xs font-extrabold transition-all active:scale-95 cursor-pointer border ${
              selectedDistrict === dist.id
                ? "bg-[#397C78] text-white border-[#397C78] shadow-md"
                : "bg-[#FAF6F0] dark:bg-[#222826] text-[#252A28] dark:text-[#F5F1E8] border-[#E2D3BE] dark:border-white/10"
            }`}
          >
            {isRtl ? dist.labelAr : dist.labelEn}
          </button>
        ))}
      </div>

      {/* Touch Dropdown Selectors (Zero Keyboard Required) */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[11px] font-bold text-[#6E716C] dark:text-[#B5B8B2] mb-1">
            {isRtl ? "اختر الحي 📍" : "Select District 📍"}
          </label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full rounded-2xl border border-[#E2D3BE] dark:border-white/15 bg-white dark:bg-[#1C2422] px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#C96745] min-h-[44px]"
          >
            <option value="all">{isRtl ? "كل الأحياء 🌟" : "All Districts 🌟"}</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {isRtl ? d.nameAr : d.nameEn}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-[#6E716C] dark:text-[#B5B8B2] mb-1">
            {isRtl ? "اختر النوع 🍽️" : "Select Type 🍽️"}
          </label>
          <select
            value={selectedKind}
            onChange={(e) => setSelectedKind(e.target.value)}
            className="w-full rounded-2xl border border-[#E2D3BE] dark:border-white/15 bg-white dark:bg-[#1C2422] px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#C96745] min-h-[44px]"
          >
            <option value="all">{isRtl ? "كل الأنواع 🌟" : "All Types 🌟"}</option>
            <option value="restaurant">{isRtl ? "مطاعم 🍽️" : "Restaurants 🍽️"}</option>
            <option value="cafe">{isRtl ? "كافيهات ☕" : "Cafes ☕"}</option>
            <option value="resort">{isRtl ? "منتجعات 🏖️" : "Resorts 🏖️"}</option>
            <option value="hotel">{isRtl ? "فنادق 🏨" : "Hotels 🏨"}</option>
            <option value="activity">{isRtl ? "أنشطة 🎮" : "Activities 🎮"}</option>
          </select>
        </div>
      </div>

      {/* Non-Blocking Search Input Bar */}
      <div className="relative pt-1">
        <MobileInput
          type="search"
          dir="auto"
          onValueChange={handleQueryChange}
          debounceMs={200}
          placeholder={
            isRtl
              ? "ابحث هنا بالتأثير غير الحاصر..."
              : "Search here non-blockingly..."
          }
          icon={<Search className="h-4 w-4 text-[#C96745]" />}
          className="bg-white dark:bg-[#1C2422] border-[#E2D3BE] dark:border-white/10 text-xs min-h-[44px]"
        />
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

      {/* Places Cards Grid (Paginated to 8 cards max initially) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredPlaces.slice(0, 8).map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </div>
    </div>
  );
});
