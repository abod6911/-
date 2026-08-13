import { BadgeCheck, Clock, ExternalLink, Flame, Heart, MapPin, Star, Wallet } from "lucide-react";
import { getDistrict, type Place } from "@/data/jeddah";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import React, { memo, useState } from "react";
import { PlaceDetailModal } from "./PlaceDetailModal";
import { PlaceImage } from "@/components/common/PlaceImage";

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

export const PlaceCard = memo(function PlaceCard({ place }: { place: Place }) {
  const { t, isRtl } = useLanguage();
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

  // Format pricing with explicit unit
  const formatPrice = () => {
    if (place.pricePerPerson === 0) {
      return isRtl ? "مجاني ✨" : "Free ✨";
    }
    const unitLabel =
      place.kind === "hotel" || place.kind === "resort"
        ? isRtl
          ? "ر.س / للغرفة"
          : "SAR / room"
        : isRtl
        ? "ر.س / للشخص"
        : "SAR / person";
    return `${place.pricePerPerson} ${unitLabel}`;
  };

  return (
    <>
      <article
        onClick={() => setShowDetailModal(true)}
        className="surface-card rounded-2xl md:rounded-3xl overflow-hidden hover-lift relative group cursor-pointer border border-[#E2D3BE]/80 dark:border-white/10 flex flex-col justify-between transition-all duration-300 hover:border-[#C96745]/40 hover:shadow-2xl"
      >
        {/* Place Image with Hover Zoom */}
        <div className="relative h-52 w-full overflow-hidden bg-slate-900">
          <PlaceImage
            src={place.image}
            alt={isRtl ? place.nameAr : place.nameEn}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

          {/* Top Badges */}
          <div className="absolute top-3 start-3 flex flex-wrap items-center gap-1.5 z-10">
            <span className="rounded-full bg-[#FAF6F0]/95 dark:bg-[#161B1A]/95 backdrop-blur-md px-3 py-1 text-xs font-extrabold text-[#252A28] dark:text-[#F5F1E8] shadow-md border border-white/20">
              {kindEmoji[place.kind]} {isRtl ? (place.subCategoryAr || place.categoryAr) : (place.subCategoryEn || place.categoryEn || place.kind.toUpperCase())}
            </span>
            {place.trending && (
              <span className="rounded-full bg-gradient-to-r from-[#C96745] to-[#E4A23B] px-3 py-1 text-[11px] font-black text-white shadow-md flex items-center gap-1 animate-pulse-glow">
                <Flame className="h-3.5 w-3.5 fill-white" /> {isRtl ? "ترند" : "Trending"}
              </span>
            )}
          </div>

          {/* Favorite button */}
          <button
            onClick={handleFav}
            aria-label={isRtl ? "المفضلة" : "Favorite"}
            className={`absolute top-3 end-3 z-10 rounded-full p-2.5 shadow-lg backdrop-blur-md transition-all duration-300
              ${fav
                ? "bg-[#C96745] text-white scale-110 shadow-[#C96745]/40"
                : "bg-black/40 text-white hover:bg-[#C96745] hover:scale-110"
              }
              ${justFaved ? "animate-heart" : ""}
            `}
          >
            <Heart className={`h-4.5 w-4.5 transition-all ${fav ? "fill-white" : ""}`} />
          </button>

          {/* Bottom Overlay Info */}
          <div className="absolute bottom-3 start-3 end-3 flex items-center justify-between text-white text-xs font-bold z-10">
            <span className="flex items-center gap-1 bg-black/60 px-3 py-1 rounded-full backdrop-blur-md border border-white/10 shadow-sm">
              📍 {isRtl ? district.nameAr : district.nameEn}
            </span>
            {place.rating && (
              <span className="flex items-center gap-1.5 bg-gradient-to-r from-[#E4A23B] to-[#C96745] text-white px-3 py-1 rounded-full shadow-md font-black">
                <Star className="h-3.5 w-3.5 fill-white" /> {place.rating} ★
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-5 md:p-6 flex flex-col justify-between flex-1">
          <div>
            <h3 className="text-lg md:text-xl font-extrabold text-[#252A28] dark:text-[#F5F1E8] group-hover:text-[#C96745] transition-colors leading-tight">
              {isRtl ? place.nameAr : place.nameEn}
            </h3>

            <p className="mt-2 text-xs md:text-sm text-[#6E716C] dark:text-[#B5B8B2] line-clamp-2 leading-relaxed font-medium">
              {isRtl ? place.descAr : place.descEn}
            </p>
          </div>

          <div className="mt-5 border-t border-[#E2D3BE]/60 dark:border-white/10 pt-3.5 flex items-center justify-between text-xs font-extrabold">
            <span className="flex items-center gap-1.5 text-[#C96745] bg-[#C96745]/10 dark:bg-[#C96745]/20 px-3 py-1.5 rounded-xl border border-[#C96745]/20">
              <Wallet className="h-3.5 w-3.5" />
              {formatPrice()}
            </span>

            <span className="flex items-center gap-1 text-[#397C78] dark:text-[#5EAAA5] group-hover:translate-x-[-2px] transition-transform">
              <span>{isRtl ? "استكشف المكان" : "Explore Place"}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </article>

      {showDetailModal && (
        <PlaceDetailModal place={place} onClose={() => setShowDetailModal(false)} />
      )}
    </>
  );
});