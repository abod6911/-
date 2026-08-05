import { BadgeCheck, Clock, ExternalLink, Flame, Heart, MapPin, Star, Wallet } from "lucide-react";
import { getDistrict, type Place } from "@/data/jeddah";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { PlaceDetailModal } from "./PlaceDetailModal";

const kindTone: Record<Place["kind"], string> = {
  activity: "from-[#C96745]/20 via-[#C96745]/10 to-[#F4EBDD]",
  food: "from-[#397C78]/25 via-[#397C78]/10 to-[#F4EBDD]",
  cafe: "from-[#E4A23B]/25 via-[#E4A23B]/10 to-[#F4EBDD]",
  culture: "from-[#71805B]/25 via-[#71805B]/10 to-[#F4EBDD]",
  outdoor: "from-[#397C78]/30 via-[#397C78]/10 to-[#F4EBDD]",
  shopping: "from-[#C96745]/15 via-[#C96745]/5 to-[#F4EBDD]",
  hotel: "from-[#C96745]/25 via-[#397C78]/15 to-[#F4EBDD]",
  resort: "from-[#397C78]/35 via-[#C96745]/15 to-[#F4EBDD]",
};

const kindEmoji: Record<Place["kind"], string> = {
  activity: "🎮",
  food: "🍽️",
  cafe: "☕",
  culture: "🏛️",
  outdoor: "🌊",
  shopping: "🛍️",
  hotel: "🏨",
  resort: "🏖️",
};

export function PlaceCard({ place }: { place: Place }) {
  const { isRtl } = useLanguage();
  const { isFavorite, toggleFavorite } = useAuth();
  const district = getDistrict(place.districtId);
  const fav = isFavorite(place.id);
  const [justFaved, setJustFaved] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(place.id);
    if (!fav) {
      setJustFaved(true);
      setTimeout(() => setJustFaved(false), 800);
    }
  };

  return (
    <>
      <article
        onClick={() => setShowDetailModal(true)}
        className="surface-card overflow-hidden hover-lift relative group cursor-pointer border border-[#E2D3BE] dark:border-white/10"
      >
        {/* Header gradient area */}
        <div className={`relative flex h-32 items-end justify-between bg-gradient-to-br ${kindTone[place.kind]} p-4`}>
          {/* Kind emoji & subCategory badge */}
          <div className="absolute top-3 start-3 flex flex-wrap items-center gap-1.5">
            <span className="text-2xl animate-fade-in">{kindEmoji[place.kind]}</span>
            <span className="rounded-full bg-[#FAF6F0] dark:bg-[#161B1A] px-3 py-1 text-xs font-bold text-[#252A28] dark:text-[#F5F1E8] shadow-sm">
              {place.subCategoryAr || place.categoryAr}
            </span>
            {place.trending && (
              <span className="rounded-full bg-[#C96745] px-2.5 py-0.5 text-[11px] font-extrabold text-white">
                🔥 ترند
              </span>
            )}
          </div>

          {/* Favorite button */}
          <button
            onClick={handleFav}
            aria-label="المفضلة"
            className={`absolute top-3 end-3 z-10 rounded-full p-2.5 shadow-sm backdrop-blur transition-all duration-300
              ${fav
                ? "bg-[#C96745]/15 text-[#C96745] scale-110"
                : "bg-[#FAF6F0] dark:bg-[#222826] text-[#252A28] dark:text-[#F5F1E8] hover:bg-[#C96745]/10 hover:text-[#C96745]"
              }
              ${justFaved ? "animate-heart" : "hover-scale"}
            `}
          >
            <Heart className={`h-4.5 w-4.5 transition-all ${fav ? "fill-[#C96745] text-[#C96745]" : ""}`} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col justify-between min-h-[190px]">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-[#397C78] dark:text-[#5EAAA5]">
                📍 {isRtl ? district.nameAr : district.nameEn}
              </span>
              {place.rating && (
                <span className="flex items-center gap-1 text-xs font-bold text-[#E4A23B]">
                  <Star className="h-3.5 w-3.5 fill-[#E4A23B]" />
                  {place.rating}
                </span>
              )}
            </div>

            <h3 className="mt-2 text-xl font-extrabold text-[#252A28] dark:text-[#F5F1E8] group-hover:text-[#C96745] transition-colors">
              {isRtl ? place.nameAr : place.nameEn}
            </h3>

            <p className="mt-1.5 text-xs text-[#6E716C] dark:text-[#B5B8B2] line-clamp-2 leading-relaxed font-semibold">
              {isRtl ? place.descAr : place.descEn}
            </p>
          </div>

          <div className="mt-4 border-t border-[#E2D3BE] dark:border-white/10 pt-3.5 flex items-center justify-between text-xs font-bold text-[#252A28] dark:text-[#F5F1E8]">
            <span className="flex items-center gap-1 text-[#C96745]">
              <Wallet className="h-4 w-4" />
              {place.pricePerPerson === 0 ? "مجاني ✨" : `${place.pricePerPerson} ر.س`}
            </span>

            <span className="flex items-center gap-1 text-[#397C78] dark:text-[#5EAAA5]">
              <ExternalLink className="h-3.5 w-3.5" /> التفاصيل والخرائط
            </span>
          </div>
        </div>
      </article>

      {showDetailModal && (
        <PlaceDetailModal place={place} onClose={() => setShowDetailModal(false)} />
      )}
    </>
  );
}