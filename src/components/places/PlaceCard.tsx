import { BadgeCheck, Clock, Heart, MapPin, Wallet } from "lucide-react";
import { getDistrict, type Place } from "@/data/jeddah";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const kindTone: Record<Place["kind"], string> = {
  activity: "from-[#C96745]/20 via-[#C96745]/10 to-[#F4EBDD]",
  food: "from-[#397C78]/25 via-[#397C78]/10 to-[#F4EBDD]",
  cafe: "from-[#E4A23B]/25 via-[#E4A23B]/10 to-[#F4EBDD]",
  culture: "from-[#71805B]/25 via-[#71805B]/10 to-[#F4EBDD]",
  outdoor: "from-[#397C78]/30 via-[#397C78]/10 to-[#F4EBDD]",
  shopping: "from-[#C96745]/15 via-[#C96745]/5 to-[#F4EBDD]",
};

const kindEmoji: Record<Place["kind"], string> = {
  activity: "🎮",
  food: "🍽️",
  cafe: "☕",
  culture: "🏛️",
  outdoor: "🌊",
  shopping: "🛍️",
};

export function PlaceCard({ place }: { place: Place }) {
  const { isRtl } = useLanguage();
  const { isFavorite, toggleFavorite } = useAuth();
  const district = getDistrict(place.districtId);
  const fav = isFavorite(place.id);
  const [justFaved, setJustFaved] = useState(false);

  const handleFav = () => {
    toggleFavorite(place.id);
    if (!fav) {
      setJustFaved(true);
      setTimeout(() => setJustFaved(false), 800);
    }
  };

  return (
    <article className="surface-card overflow-hidden hover-lift relative group">
      {/* Header gradient area */}
      <div className={`relative flex h-32 items-end justify-between bg-gradient-to-br ${kindTone[place.kind]} p-4`}>
        {/* Kind emoji badge */}
        <div className="absolute top-3 start-3 flex items-center gap-2">
          <span className="text-2xl animate-fade-in">{kindEmoji[place.kind]}</span>
          <span className="rounded-full bg-[#FAF6F0] px-3 py-1 text-xs font-bold text-[#252A28] shadow-sm backdrop-blur">
            {place.categoryAr}
          </span>
        </div>

        {/* Favorite button */}
        <button
          onClick={handleFav}
          aria-label="المفضلة"
          className={`absolute top-3 end-3 z-10 rounded-full p-2.5 shadow-sm backdrop-blur transition-all duration-300
            ${fav
              ? "bg-[#C96745]/15 text-[#C96745] scale-110"
              : "bg-[#FAF6F0] text-[#252A28] hover:bg-[#C96745]/10 hover:text-[#C96745]"
            }
            ${justFaved ? "animate-heart" : "hover-scale"}
          `}
        >
          <Heart className={`h-4.5 w-4.5 transition-all ${fav ? "fill-[#C96745] text-[#C96745]" : ""}`} />
        </button>

        {/* Decorative route trail */}
        <svg viewBox="0 0 200 40" className="absolute inset-x-0 bottom-0 h-8 w-full opacity-50" aria-hidden="true">
          <path
            d="M0 32C40 32 60 12 100 12s60 20 100 20"
            fill="none"
            stroke="#397C78"
            strokeWidth="1.5"
            strokeDasharray="5 5"
            className="animate-route-draw"
          />
        </svg>
      </div>

      {/* Body */}
      <div className="space-y-3 p-4 pt-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold leading-snug group-hover:text-[#C96745] transition-colors">
            {isRtl ? place.nameAr : place.nameEn}
          </h3>
          {place.verified && (
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#71805B]/15 px-2.5 py-0.5 text-[11px] font-bold text-[#71805B]">
              <BadgeCheck className="h-3.5 w-3.5" /> {isRtl ? "موثّق" : "Verified"}
            </span>
          )}
        </div>

        <p className="line-clamp-2 text-sm text-[#6E716C] leading-relaxed">
          {isRtl ? place.descAr : place.descEn}
        </p>

        <ul className="flex flex-wrap gap-x-3 gap-y-1.5 text-[13px] text-[#6E716C]">
          <li className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-[#397C78]" />
            {isRtl ? district.nameAr : district.nameEn}
          </li>
          <li className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-[#397C78]" />
            {place.durationMin} {isRtl ? "دقيقة" : "min"}
          </li>
          <li className="flex items-center gap-1.5">
            <Wallet className="h-3.5 w-3.5 text-[#C96745]" />
            <span className="font-semibold text-[#252A28]">
              {place.pricePerPerson === 0 ? (isRtl ? "مجاني" : "Free") : `${place.pricePerPerson} SAR`}
            </span>
          </li>
        </ul>

        {/* Tag pills */}
        <div className="flex flex-wrap gap-1.5 text-[11px]">
          <span className="rounded-full bg-[#EADECB] px-2.5 py-0.5 font-semibold text-[#252A28]">
            {place.indoor ? (isRtl ? "🏢 داخلي" : "🏢 Indoor") : (isRtl ? "🌤️ خارجي" : "🌤️ Outdoor")}
          </span>
          {place.reservation && (
            <span className="rounded-full bg-[#E4A23B]/15 px-2.5 py-0.5 font-semibold text-[#E4A23B]">
              {isRtl ? "📋 يحتاج حجزًا" : "📋 Reservation"}
            </span>
          )}
          {place.kidsFriendly && (
            <span className="rounded-full bg-[#71805B]/15 px-2.5 py-0.5 font-semibold text-[#71805B]">
              {isRtl ? "👶 مناسب للأطفال" : "👶 Kids friendly"}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}