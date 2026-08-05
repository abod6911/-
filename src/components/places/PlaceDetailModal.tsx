import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  Clock,
  ExternalLink,
  Flame,
  Globe,
  Heart,
  MapPin,
  Navigation,
  Phone,
  Sparkles,
  Star,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { getDistrict, groupLabels, type Place } from "@/data/jeddah";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

export function PlaceDetailModal({
  place,
  onClose,
}: {
  place: Place | null;
  onClose: () => void;
}) {
  const { t, isRtl } = useLanguage();
  const { toggleFavorite, isFavorite } = useAuth();

  useEffect(() => {
    // Lock background scroll when modal is active
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!place) return null;

  const district = getDistrict(place.districtId);
  const favorited = isFavorite(place.id);

  const mapsUrl =
    place.mapsUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${place.nameAr} ${district.nameAr} جدة`
    )}`;

  return (
    <div
      className="modal-overlay z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-content max-w-2xl w-full max-h-[90vh] overflow-y-auto p-0 rounded-3xl animate-modal-in surface-card bg-[#FAF6F0] dark:bg-[#222826] text-[#252A28] dark:text-[#F5F1E8] border border-[#E2D3BE] dark:border-white/10 relative shadow-2xl">
        {/* Place Image Hero Header */}
        <div className="relative h-48 sm:h-60 w-full overflow-hidden shrink-0">
          <img
            src={place.image}
            alt={place.nameAr}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 end-4 z-20 grid h-10 w-10 place-items-center rounded-full bg-black/50 text-white backdrop-blur hover:bg-[#C96745] transition-colors shadow-md"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Floating Badges */}
          <div className="absolute bottom-4 start-4 end-4 flex items-center justify-between z-10">
            <div className="flex flex-wrap items-center gap-2">
              {place.trending && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#C96745] px-3.5 py-1 text-xs font-extrabold text-white shadow-md">
                  <Flame className="h-3.5 w-3.5 fill-white" /> ترند جدة 🔥
                </span>
              )}
              {place.subCategoryAr && (
                <span className="rounded-full bg-[#397C78] px-3.5 py-1 text-xs font-bold text-white shadow-md">
                  {place.subCategoryAr}
                </span>
              )}
            </div>

            <button
              onClick={() => toggleFavorite(place.id)}
              className="grid h-10 w-10 place-items-center rounded-full bg-black/40 text-white backdrop-blur hover:scale-105 transition-transform shadow-md"
              aria-label="إضافة للمفضلة"
            >
              <Heart className={`h-5 w-5 ${favorited ? "fill-[#C96745] text-[#C96745]" : "text-white"}`} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 md:p-8">
          {/* Name & Subtitle */}
          <div>
            <h2 className="text-2xl font-black text-[#252A28] dark:text-[#F5F1E8] md:text-3xl leading-tight">
              {isRtl ? place.nameAr : place.nameEn}
            </h2>
            <p className="text-xs font-bold text-[#6E716C] dark:text-[#B5B8B2] mt-1.5 flex items-center gap-2">
              <span>{place.categoryAr}</span>
              <span>·</span>
              <span>{place.indoor ? "داخلي ومكيف 🏢" : "جلسات خارجية 🌤️"}</span>
              <span>·</span>
              <span>📍 {isRtl ? district.nameAr : district.nameEn}</span>
            </p>
          </div>

          {/* Rating & Stats */}
          <div className="mt-4 flex flex-wrap items-center gap-4 border-y border-[#E2D3BE] dark:border-white/10 py-3 text-xs md:text-sm font-bold">
            <div className="flex items-center gap-1.5 text-[#E4A23B]">
              <Star className="h-4 w-4 fill-[#E4A23B]" />
              <span>{place.rating || 4.8} / 5.0</span>
            </div>
            <div className="text-[#397C78] dark:text-[#5EAAA5]">
              👁️ {(place.viewsCount || 8500).toLocaleString()} زيارة هذا الأسبوع
            </div>
            {place.verified && (
              <div className="flex items-center gap-1 text-[#71805B] font-bold">
                <BadgeCheck className="h-4 w-4" /> تم التحقق موثق
              </div>
            )}
          </div>

          {/* Description & Details */}
          <div className="mt-5 space-y-4 text-xs md:text-sm leading-relaxed">
            <div>
              <h3 className="font-extrabold text-[#252A28] dark:text-[#F5F1E8] mb-1">عن المكان:</h3>
              <p className="text-[#6E716C] dark:text-[#B5B8B2] font-semibold">{isRtl ? place.descAr : place.descEn}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-2xl bg-[#F4EBDD] dark:bg-[#161B1A] p-4 border border-[#E2D3BE]/60 dark:border-white/10">
              <div>
                <span className="text-xs text-[#6E716C] dark:text-[#B5B8B2] block">متوسط السعر للشخص</span>
                <span className="font-extrabold text-[#C96745] text-base">
                  {place.pricePerPerson === 0 ? "دخول مجاني ✨" : `${place.pricePerPerson} ر.س`}
                </span>
              </div>
              <div>
                <span className="text-xs text-[#6E716C] dark:text-[#B5B8B2] block">أوقات العمل</span>
                <span className="font-bold text-[#252A28] dark:text-[#F5F1E8] text-xs md:text-sm">
                  من {place.opensAt}:00 إلى {place.closesAt > 24 ? place.closesAt - 24 : place.closesAt}:00
                </span>
              </div>
              <div>
                <span className="text-xs text-[#6E716C] dark:text-[#B5B8B2] block">المجموعات المناسبة</span>
                <span className="font-bold text-[#252A28] dark:text-[#F5F1E8] text-xs">
                  {place.groups.map((g) => (groupLabels[g] ? (isRtl ? groupLabels[g].ar : groupLabels[g].en) : g)).join(" · ")}
                </span>
              </div>
              <div>
                <span className="text-xs text-[#6E716C] dark:text-[#B5B8B2] block">وضعية المواقف</span>
                <span className="font-bold text-[#397C78] dark:text-[#5EAAA5] text-xs">{place.parkingAr}</span>
              </div>
            </div>

            {/* Why Recommended */}
            <div className="rounded-2xl bg-[#C96745]/10 p-4 border border-[#C96745]/30">
              <span className="font-bold text-[#C96745] block mb-1">💡 لماذا اخترنا هذا المكان في جِدّاو؟</span>
              <p className="text-xs font-semibold text-[#252A28] dark:text-[#F5F1E8]">{place.whyAr}</p>
            </div>
          </div>

          {/* Sticky Direct Action Buttons */}
          <div className="mt-8 grid gap-3 sm:grid-cols-3 pt-2">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full bg-[#397C78] px-4 py-3.5 text-xs font-bold text-white shadow-lift hover:bg-[#2e6562] transition-colors min-h-[48px]"
            >
              <Navigation className="h-4 w-4" />
              <span>افتح في قوقل ماب</span>
            </a>

            <Link
              to="/quick-plan"
              onClick={onClose}
              className="flex items-center justify-center gap-2 rounded-full bg-[#C96745] px-4 py-3.5 text-xs font-bold text-white shadow-lift hover:bg-[#b55837] transition-colors min-h-[48px]"
            >
              <Sparkles className="h-4 w-4" />
              <span>أضف لخطتي اليوم</span>
            </Link>

            <button
              onClick={() => alert(`جاري تحويلك لحجز ${place.nameAr}…`)}
              className="flex items-center justify-center gap-2 rounded-full border border-[#E2D3BE] dark:border-white/20 bg-[#FAF6F0] dark:bg-[#161B1A] px-4 py-3.5 text-xs font-bold text-[#252A28] dark:text-[#F5F1E8] hover:border-[#C96745] transition-colors min-h-[48px]"
            >
              <Phone className="h-4 w-4 text-[#C96745]" />
              <span>احجز / اتصل الآن</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
