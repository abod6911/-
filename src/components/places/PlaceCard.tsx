import { BadgeCheck, Clock, ExternalLink, Flame, Heart, MapPin, Star, Wallet } from "lucide-react";
import { getDistrict, type Place } from "@/data/jeddah";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { PlaceDetailModal } from "./PlaceDetailModal";

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
        className="surface-card overflow-hidden hover-lift relative group cursor-pointer border border-[#E2D3BE] dark:border-white/10 flex flex-col justify-between"
      >
        {/* Place Image with Hover Zoom */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-900">
          <img
            src={place.image}
            alt={place.nameAr}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-3 start-3 flex flex-wrap items-center gap-1.5 z-10">
            <span className="rounded-full bg-[#FAF6F0]/90 dark:bg-[#161B1A]/90 backdrop-blur px-3 py-1 text-xs font-bold text-[#252A28] dark:text-[#F5F1E8] shadow-sm">
              {kindEmoji[place.kind]} {place.subCategoryAr || place.categoryAr}
            </span>
            {place.trending && (
              <span className="rounded-full bg-[#C96745] px-2.5 py-1 text-[11px] font-extrabold text-white shadow-sm flex items-center gap-1">
                <Flame className="h-3 w-3 fill-white" /> ترند
              </span>
            )}
          </div>

          {/* Favorite button */}
          <button
            onClick={handleFav}
            aria-label="المفضلة"
            className={`absolute top-3 end-3 z-10 rounded-full p-2.5 shadow-md backdrop-blur transition-all duration-300
              ${fav
                ? "bg-[#C96745] text-white scale-110"
                : "bg-black/40 text-white hover:bg-[#C96745] hover:scale-105"
              }
              ${justFaved ? "animate-heart" : ""}
            `}
          >
            <Heart className={`h-4.5 w-4.5 transition-all ${fav ? "fill-white" : ""}`} />
          </button>

          {/* Bottom Overlay Info */}
          <div className="absolute bottom-3 start-3 end-3 flex items-center justify-between text-white text-xs font-bold z-10">
            <span className="flex items-center gap-1 bg-black/50 px-2.5 py-1 rounded-full backdrop-blur">
              📍 {isRtl ? district.nameAr : district.nameEn}
            </span>
            {place.rating && (
              <span className="flex items-center gap-1 bg-[#E4A23B] text-white px-2.5 py-1 rounded-full shadow-sm">
                <Star className="h-3.5 w-3.5 fill-white" /> {place.rating}
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col justify-between flex-1">
          <div>
            <h3 className="text-xl font-extrabold text-[#252A28] dark:text-[#F5F1E8] group-hover:text-[#C96745] transition-colors leading-tight">
              {isRtl ? place.nameAr : place.nameEn}
            </h3>

            <p className="mt-2 text-xs text-[#6E716C] dark:text-[#B5B8B2] line-clamp-2 leading-relaxed font-medium">
              {isRtl ? place.descAr : place.descEn}
            </p>
          </div>

          <div className="mt-4 border-t border-[#E2D3BE] dark:border-white/10 pt-3.5 flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1 text-[#C96745]">
              <Wallet className="h-4 w-4" />
              {place.pricePerPerson === 0 ? "مجاني ✨" : `${place.pricePerPerson} ر.س / شخص`}
            </span>

            <span className="flex items-center gap-1 text-[#397C78] dark:text-[#5EAAA5] group-hover:underline">
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