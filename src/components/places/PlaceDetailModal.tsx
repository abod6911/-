import { useEffect, useState } from "react";
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
  ShieldAlert,
  Sparkles,
  Star,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { getDistrict, groupLabels, type Place } from "@/data/jeddah";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { PlaceImage } from "@/components/common/PlaceImage";
import { ReportModal } from "./ReportModal";

export function PlaceDetailModal({
  place,
  onClose,
}: {
  place: Place | null;
  onClose: () => void;
}) {
  const { t, isRtl } = useLanguage();
  const { toggleFavorite, isFavorite } = useAuth();
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    // Lock background scroll & touch actions when modal is active
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.touchAction = "auto";
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

  // Pricing format with explicit unit
  const formatPrice = () => {
    if (place.pricePerPerson === 0) return isRtl ? "دخول مجاني ✨" : "Free Entry ✨";
    const unit =
      place.kind === "hotel" || place.kind === "resort"
        ? isRtl
          ? "ر.س / للغرفة"
          : "SAR / room"
        : isRtl
        ? "ر.س / للشخص"
        : "SAR / person";
    return `${place.pricePerPerson} ${unit}`;
  };

  return (
    <>
      <div
        className="modal-overlay z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="modal-content max-w-2xl w-full max-h-[90vh] overflow-y-auto p-0 rounded-3xl animate-modal-in surface-card bg-[#FAF6F0] dark:bg-[#222826] text-[#252A28] dark:text-[#F5F1E8] border border-[#E2D3BE] dark:border-white/10 relative shadow-2xl">
          {/* Place Image Hero Header */}
          <div className="relative h-48 sm:h-60 w-full overflow-hidden shrink-0">
            <PlaceImage
              src={place.image}
              alt={isRtl ? place.nameAr : place.nameEn}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 end-4 z-20 grid h-10 w-10 place-items-center rounded-full bg-black/50 text-white backdrop-blur hover:bg-[#C96745] transition-colors shadow-md"
              aria-label={isRtl ? "إغلاق" : "Close"}
            >
              <X className="h-5 w-5" />
            </button>

            {/* Floating Badges */}
            <div className="absolute bottom-4 start-4 end-4 flex items-center justify-between z-10">
              <div className="flex flex-wrap items-center gap-2">
                {place.trending && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#C96745] px-3.5 py-1 text-xs font-extrabold text-white shadow-md">
                    <Flame className="h-3.5 w-3.5 fill-white" /> {isRtl ? "ترند جدة 🔥" : "Trending 🔥"}
                  </span>
                )}
                {place.subCategoryAr && (
                  <span className="rounded-full bg-[#397C78] px-3.5 py-1 text-xs font-bold text-white shadow-md">
                    {isRtl ? place.subCategoryAr : (place.subCategoryEn || place.kind)}
                  </span>
                )}
              </div>

              <button
                onClick={() => toggleFavorite(place.id)}
                className="grid h-10 w-10 place-items-center rounded-full bg-black/40 text-white backdrop-blur hover:scale-105 transition-transform shadow-md"
                aria-label={isRtl ? "إضافة للمفضلة" : "Add to favorites"}
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
              <p className="text-xs font-bold text-[#6E716C] dark:text-[#B5B8B2] mt-1.5 flex items-center gap-2 flex-wrap">
                <span>{isRtl ? place.categoryAr : place.kind}</span>
                <span>·</span>
                <span>
                  {place.indoor
                    ? isRtl
                      ? "داخلي ومكيف 🏢"
                      : "Indoor AC 🏢"
                    : isRtl
                    ? "جلسات خارجية 🌤️"
                    : "Outdoor 🌤️"}
                </span>
                <span>·</span>
                <span>📍 {isRtl ? district.nameAr : district.nameEn}</span>
              </p>
            </div>

            {/* Rating & Trust Info */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-y border-[#E2D3BE] dark:border-white/10 py-3 text-xs md:text-sm font-bold">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-[#E4A23B]">
                  <Star className="h-4 w-4 fill-[#E4A23B]" />
                  <span>Google {place.rating || 4.8} ★</span>
                </div>
                {place.verified && (
                  <span className="flex items-center gap-1 text-[#71805B] font-bold text-xs bg-[#71805B]/15 px-2.5 py-0.5 rounded-full">
                    <BadgeCheck className="h-3.5 w-3.5" /> {isRtl ? "بيانات موثوقة" : "Verified Spot"}
                  </span>
                )}
              </div>

              {/* Report button */}
              <button
                onClick={() => setShowReportModal(true)}
                className="inline-flex items-center gap-1 text-xs text-[#B84E4E] hover:underline"
              >
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>{isRtl ? "إبلاغ عن معلومة خاطئة" : "Report Inaccurate Info"}</span>
              </button>
            </div>

            {/* Verification Metadata Footer Note */}
            <div className="mt-2 text-[11px] text-[#6E716C] dark:text-[#B5B8B2] font-medium flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-[#397C78]" />
              <span>
                {isRtl
                  ? "آخر تحديث للمعلومات: أغسطس 2026 · المصدر: خرائط Google والموقع الرسمي"
                  : "Last updated: Aug 2026 · Source: Google Maps & Official Directory"}
              </span>
            </div>

            {/* Description & Details */}
            <div className="mt-5 space-y-4 text-xs md:text-sm leading-relaxed">
              <div>
                <h3 className="font-extrabold text-[#252A28] dark:text-[#F5F1E8] mb-1">
                  {isRtl ? "عن المكان:" : "About this place:"}
                </h3>
                <p className="text-[#6E716C] dark:text-[#B5B8B2] font-semibold">
                  {isRtl ? place.descAr : place.descEn}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 rounded-2xl bg-[#F4EBDD] dark:bg-[#161B1A] p-4 border border-[#E2D3BE]/60 dark:border-white/10">
                <div>
                  <span className="text-xs text-[#6E716C] dark:text-[#B5B8B2] block">
                    {isRtl ? "متوسط السعر" : "Estimated Cost"}
                  </span>
                  <span className="font-extrabold text-[#C96745] text-base">{formatPrice()}</span>
                </div>
                <div>
                  <span className="text-xs text-[#6E716C] dark:text-[#B5B8B2] block">
                    {isRtl ? "أوقات العمل" : "Opening Hours"}
                  </span>
                  <span className="font-bold text-[#252A28] dark:text-[#F5F1E8] text-xs md:text-sm">
                    {place.opensAt}:00 – {place.closesAt > 24 ? place.closesAt - 24 : place.closesAt}:00
                  </span>
                </div>
                <div>
                  <span className="text-xs text-[#6E716C] dark:text-[#B5B8B2] block">
                    {isRtl ? "المجموعات المناسبة" : "Suitable Groups"}
                  </span>
                  <span className="font-bold text-[#252A28] dark:text-[#F5F1E8] text-xs">
                    {place.groups
                      .map((g) => (groupLabels[g] ? (isRtl ? groupLabels[g].ar : groupLabels[g].en) : g))
                      .join(" · ")}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-[#6E716C] dark:text-[#B5B8B2] block">
                    {isRtl ? "وضعية المواقف" : "Parking Availability"}
                  </span>
                  <span className="font-bold text-[#397C78] dark:text-[#5EAAA5] text-xs">
                    {isRtl ? place.parkingAr : (place.parkingEn || "Available Parking Spots")}
                  </span>
                </div>
              </div>

              {/* Why Recommended */}
              <div className="rounded-2xl bg-[#C96745]/10 p-4 border border-[#C96745]/30">
                <span className="font-bold text-[#C96745] block mb-1">
                  💡 {isRtl ? "لماذا اخترنا هذا المكان في جِدّاو؟" : "Why JEDDAW recommends this spot?"}
                </span>
                <p className="text-xs font-semibold text-[#252A28] dark:text-[#F5F1E8]">
                  {isRtl ? place.whyAr : (place.whyEn || place.descEn)}
                </p>
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
                <span>{isRtl ? "افتح في قوقل ماب" : "Open Google Maps"}</span>
              </a>

              <Link
                to="/quick-plan"
                onClick={onClose}
                className="flex items-center justify-center gap-2 rounded-full bg-[#C96745] px-4 py-3.5 text-xs font-bold text-white shadow-lift hover:bg-[#b55837] transition-colors min-h-[48px]"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isRtl ? "أضف لخطتي اليوم" : "Add to My Outing"}</span>
              </Link>

              <button
                onClick={() =>
                  alert(
                    isRtl
                      ? `جاري تحويلك للتواصل مع ${place.nameAr}…`
                      : `Connecting to ${place.nameEn}…`
                  )
                }
                className="flex items-center justify-center gap-2 rounded-full border border-[#E2D3BE] dark:border-white/20 bg-[#FAF6F0] dark:bg-[#161B1A] px-4 py-3.5 text-xs font-bold text-[#252A28] dark:text-[#F5F1E8] hover:border-[#C96745] transition-colors min-h-[48px]"
              >
                <Phone className="h-4 w-4 text-[#C96745]" />
                <span>{isRtl ? "احجز / اتصل الآن" : "Call / Book Now"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showReportModal && <ReportModal place={place} onClose={() => setShowReportModal(false)} />}
    </>
  );
}

