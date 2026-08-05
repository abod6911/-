import { BadgeCheck, Clock, Heart, MapPin, Wallet } from "lucide-react";
import { getDistrict, type Place } from "@/data/jeddah";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const kindTone: Record<Place["kind"], string> = {
  activity: "from-teal/25 via-teal/10 to-mist/50",
  food: "from-coral/30 via-coral/10 to-sand/50",
  cafe: "from-warning/25 via-warning/10 to-sand/50",
  culture: "from-navy/25 via-navy/10 to-mist/50",
  outdoor: "from-teal-soft/35 via-teal/10 to-mist/50",
  shopping: "from-coral/20 via-coral/5 to-mist/50",
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
      {/* Gradient header area */}
      <div className={`relative flex h-32 items-end justify-between bg-gradient-to-br ${kindTone[place.kind]} p-4`}>
        {/* Kind emoji badge */}
        <div className="absolute top-3 start-3 flex items-center gap-2">
          <span className="text-2xl animate-fade-in">{kindEmoji[place.kind]}</span>
          <span className="rounded-full bg-pearl/90 px-3 py-1 text-xs font-bold text-navy shadow-soft backdrop-blur">
            {place.categoryAr}
          </span>
        </div>

        {/* Favorite button */}
        <button
          onClick={handleFav}
          aria-label="المفضلة"
          className={`absolute top-3 end-3 z-10 rounded-full p-2.5 shadow-soft backdrop-blur transition-all duration-300
            ${fav
              ? "bg-coral/15 text-coral scale-110"
              : "bg-pearl/90 text-navy hover:bg-coral/10 hover:text-coral"
            }
            ${justFaved ? "animate-heart" : "hover-scale"}
          `}
        >
          <Heart className={`h-4.5 w-4.5 transition-all ${fav ? "fill-coral text-coral" : ""}`} />
        </button>

        {/* Decorative wave */}
        <svg viewBox="0 0 200 40" className="absolute inset-x-0 bottom-0 h-8 w-full opacity-60" aria-hidden="true">
          <path
            d="M0 32C40 32 60 12 100 12s60 20 100 20"
            fill="none"
            stroke="var(--teal-soft)"
            strokeWidth="1.5"
            strokeDasharray="5 5"
            className="animate-route-draw"
          />
        </svg>
      </div>

      {/* Card body */}
      <div className="space-y-3 p-4 pt-3">
        {/* Title and verified badge */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold leading-snug group-hover:text-teal transition-colors">
            {isRtl ? place.nameAr : place.nameEn}
          </h3>
          {place.verified && (
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-success/12 px-2.5 py-1 text-[11px] font-bold text-success">
              <BadgeCheck className="h-3.5 w-3.5" /> {isRtl ? "موثّق" : "Verified"}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
          {isRtl ? place.descAr : place.descEn}
        </p>

        {/* Info pills */}
        <ul className="flex flex-wrap gap-x-3 gap-y-1.5 text-[13px] text-muted-foreground">
          <li className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-teal" />
            {isRtl ? district.nameAr : district.nameEn}
          </li>
          <li className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-teal" />
            {place.durationMin} {isRtl ? "دقيقة" : "min"}
          </li>
          <li className="flex items-center gap-1.5">
            <Wallet className="h-3.5 w-3.5 text-coral" />
            <span className="font-semibold">
              {place.pricePerPerson === 0 ? (isRtl ? "مجاني" : "Free") : `${place.pricePerPerson} SAR`}
            </span>
          </li>
        </ul>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 text-[11px]">
          <span className="rounded-full bg-mist/80 px-2.5 py-1 font-semibold text-navy">
            {place.indoor ? (isRtl ? "🏢 داخلي" : "🏢 Indoor") : (isRtl ? "🌤️ خارجي" : "🌤️ Outdoor")}
          </span>
          {place.reservation && (
            <span className="rounded-full bg-warning/15 px-2.5 py-1 font-semibold text-warning">
              {isRtl ? "📋 يحتاج حجزًا" : "📋 Reservation"}
            </span>
          )}
          {place.kidsFriendly && (
            <span className="rounded-full bg-success/12 px-2.5 py-1 font-semibold text-success">
              {isRtl ? "👶 مناسب للأطفال" : "👶 Kids friendly"}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}