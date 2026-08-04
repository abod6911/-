import { BadgeCheck, Clock, Heart, MapPin, Wallet } from "lucide-react";
import { getDistrict, type Place } from "@/data/jeddah";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

const kindTone: Record<Place["kind"], string> = {
  activity: "from-teal/20 to-mist",
  food: "from-coral/25 to-sand",
  cafe: "from-warning/20 to-sand",
  culture: "from-navy/20 to-mist",
  outdoor: "from-teal-soft/30 to-mist",
  shopping: "from-coral/15 to-mist",
};

export function PlaceCard({ place }: { place: Place }) {
  const { isRtl } = useLanguage();
  const { isFavorite, toggleFavorite } = useAuth();
  const district = getDistrict(place.districtId);
  const fav = isFavorite(place.id);

  return (
    <article className="surface-card overflow-hidden transition-transform hover:-translate-y-1 relative">
      <div className={`relative flex h-28 items-end justify-between bg-gradient-to-tr ${kindTone[place.kind]} p-4`}>
        <span className="rounded-full bg-pearl/90 px-3 py-1 text-xs font-bold text-navy">
          {place.categoryAr}
        </span>

        <button
          onClick={() => toggleFavorite(place.id)}
          aria-label="المفضلة"
          className="z-10 rounded-full bg-pearl/90 p-2 text-navy shadow-soft hover:scale-110 transition-transform"
        >
          <Heart className={`h-4 w-4 ${fav ? "fill-coral text-coral" : "text-navy"}`} />
        </button>

        <svg viewBox="0 0 200 40" className="absolute inset-x-0 bottom-0 h-6 w-full" aria-hidden="true">
          <path d="M0 32C40 32 60 12 100 12s60 20 100 20" fill="none" stroke="var(--teal-soft)" strokeWidth="1.5" strokeDasharray="5 5" />
        </svg>
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold leading-snug">{isRtl ? place.nameAr : place.nameEn}</h3>
          {place.verified && (
            <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-success">
              <BadgeCheck className="h-4 w-4" /> {isRtl ? "موثّق" : "Verified"}
            </span>
          )}
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {isRtl ? place.descAr : place.descEn}
        </p>
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-muted-foreground">
          <li className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{isRtl ? district.nameAr : district.nameEn}</li>
          <li className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{place.durationMin} {isRtl ? "دقيقة" : "min"}</li>
          <li className="flex items-center gap-1">
            <Wallet className="h-3.5 w-3.5" />
            {place.pricePerPerson === 0 ? (isRtl ? "مجاني" : "Free") : `${place.pricePerPerson} SAR`}
          </li>
        </ul>
        <div className="flex flex-wrap gap-2 text-[12px]">
          <span className="rounded-full bg-mist px-2.5 py-1 font-semibold text-navy">
            {place.indoor ? (isRtl ? "داخلي" : "Indoor") : (isRtl ? "خارجي" : "Outdoor")}
          </span>
          {place.reservation && (
            <span className="rounded-full bg-warning/15 px-2.5 py-1 font-semibold text-warning">
              {isRtl ? "يحتاج حجزًا" : "Reservation required"}
            </span>
          )}
          {place.kidsFriendly && (
            <span className="rounded-full bg-success/12 px-2.5 py-1 font-semibold text-success">
              {isRtl ? "مناسب للأطفال" : "Kids friendly"}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}