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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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
    <div className="modal-overlay z-50">
      <div className="modal-content max-w-2xl w-full p-6 md:p-8 animate-modal-in surface-card bg-[#FAF6F0] dark:bg-[#222826] text-[#252A28] dark:text-[#F5F1E8] border border-[#E2D3BE] dark:border-white/10 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 end-4 grid h-10 w-10 place-items-center rounded-full bg-[#EADECB] dark:bg-[#2E3633] text-[#252A28] dark:text-[#F5F1E8] hover:bg-[#C96745] hover:text-white transition-colors"
          aria-label="إغلاق"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Top Tag Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {place.trending && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#C96745] px-3 py-1 text-xs font-extrabold text-white shadow-sm">
              <Flame className="h-3.5 w-3.5 fill-white" /> ترند جدة 🔥
            </span>
          )}
          {place.subCategoryAr && (
            <span className="rounded-full bg-[#397C78] px-3 py-1 text-xs font-bold text-white">
              {place.subCategoryAr}
            </span>
          )}
          <span className="rounded-full bg-[#FAF6F0] dark:bg-[#161B1A] border border-[#E2D3BE] dark:border-white/15 px-3 py-1 text-xs font-bold text-[#6E716C] dark:text-[#B5B8B2]">
            📍 {isRtl ? district.nameAr : district.nameEn}
          </span>
        </div>

        {/* Name & Favorites */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-[#252A28] dark:text-[#F5F1E8] md:text-3xl">
              {isRtl ? place.nameAr : place.nameEn}
            </h2>
            <p className="text-sm font-bold text-[#6E716C] dark:text-[#B5B8B2] mt-1">
              {place.categoryAr} · {place.indoor ? "داخلي ومكيف 🏢" : "جلسات خارجية 🌤️"}
            </p>
          </div>

          <button
            onClick={() => toggleFavorite(place.id)}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[#E2D3BE] dark:border-white/15 bg-[#FAF6F0] dark:bg-[#161B1A] hover:scale-105 transition-transform"
            aria-label="إضافة للمفضلة"
          >
            <Heart className={`h-6 w-6 ${favorited ? "fill-[#C96745] text-[#C96745]" : "text-[#6E716C]"}`} />
          </button>
        </div>

        {/* Rating & Stats */}
        <div className="mt-4 flex flex-wrap items-center gap-4 border-y border-[#E2D3BE] dark:border-white/10 py-3 text-sm font-bold">
          <div className="flex items-center gap-1.5 text-[#E4A23B]">
            <Star className="h-4 w-4 fill-[#E4A23B]" />
            <span>{place.rating || 4.8} / 5.0</span>
          </div>
          <div className="text-[#397C78] dark:text-[#5EAAA5]">
            👁️ {(place.viewsCount || 8500).toLocaleString()} زيارة ومهمتم هذا الأسبوع
          </div>
          {place.verified && (
            <div className="flex items-center gap-1 text-[#71805B] font-bold">
              <BadgeCheck className="h-4 w-4" /> تم التحقق موثق
            </div>
          )}
        </div>

        {/* Description & Details */}
        <div className="mt-5 space-y-4 text-sm leading-relaxed">
          <div>
            <h3 className="font-bold text-[#252A28] dark:text-[#F5F1E8] mb-1">عن المكان:</h3>
            <p className="text-[#6E716C] dark:text-[#B5B8B2]">{isRtl ? place.descAr : place.descEn}</p>
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
              <span className="font-bold text-[#252A28] dark:text-[#F5F1E8] text-sm">
                من {place.opensAt}:00 إلى {place.closesAt > 24 ? place.closesAt - 24 : place.closesAt}:00
              </span>
            </div>
            <div>
              <span className="text-xs text-[#6E716C] dark:text-[#B5B8B2] block">المجموعات المناسبة</span>
              <span className="font-bold text-[#252A28] dark:text-[#F5F1E8] text-xs">
                {place.groups.map((g) => groupLabels[g]).join(" · ")}
              </span>
            </div>
            <div>
              <span className="text-xs text-[#6E716C] dark:text-[#B5B8B2] block">وضعية المواقف</span>
              <span className="font-bold text-[#397C78] dark:text-[#5EAAA5] text-xs">{place.parkingAr}</span>
            </div>
          </div>

          {/* Why Recommended */}
          <div className="rounded-xl bg-[#C96745]/10 p-3.5 border border-[#C96745]/30">
            <span className="font-bold text-[#C96745] block mb-0.5">💡 لماذا اخترنا هذا المكان في جِدّاو؟</span>
            <p className="text-xs font-semibold text-[#252A28] dark:text-[#F5F1E8]">{place.whyAr}</p>
          </div>
        </div>

        {/* Direct Actions (Maps, Plan, Reserve) */}
        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-full bg-[#397C78] px-4 py-3 text-xs font-bold text-white shadow-lift hover:bg-[#2e6562] transition-colors min-h-[48px]"
          >
            <Navigation className="h-4 w-4" />
            <span>افتح في قوقل ماب</span>
          </a>

          <Link
            to="/quick-plan"
            onClick={onClose}
            className="flex items-center justify-center gap-2 rounded-full bg-[#C96745] px-4 py-3 text-xs font-bold text-white shadow-lift hover:bg-[#b55837] transition-colors min-h-[48px]"
          >
            <Sparkles className="h-4 w-4" />
            <span>أضف لخطتي اليوم</span>
          </Link>

          <button
            onClick={() => alert(`جاري تحويلك لحجز ${place.nameAr}…`)}
            className="flex items-center justify-center gap-2 rounded-full border border-[#E2D3BE] dark:border-white/20 bg-[#FAF6F0] dark:bg-[#161B1A] px-4 py-3 text-xs font-bold text-[#252A28] dark:text-[#F5F1E8] hover:border-[#C96745] transition-colors min-h-[48px]"
          >
            <Phone className="h-4 w-4 text-[#C96745]" />
            <span>احجز / اتصل الآن</span>
          </button>
        </div>
      </div>
    </div>
  );
}
