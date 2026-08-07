import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, Sparkles, Tag } from "lucide-react";
import { getPlace, offers } from "@/data/jeddah";
import { useLanguage } from "@/context/LanguageContext";
import { PlaceImage } from "@/components/common/PlaceImage";

export const Route = createFileRoute("/offers")({
  head: () => ({
    meta: [
      { title: "عروض جدة اليوم | جِدّاو — JEDDAW" },
      {
        name: "description",
        content: "عروض ومختارات على المطاعم والمقاهي والأنشطة في جدة مع الأسعار والشروط من جِدّاو.",
      },
    ],
    links: [{ rel: "canonical", href: "/offers" }],
  }),
  component: OffersPage,
});

function OffersPage() {
  const { t, isRtl } = useLanguage();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="animate-fade-in-up flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#C96745]/15 text-xl">🔥</span>
        <div>
          <h1 className="text-3xl font-extrabold text-[#252A28] dark:text-[#F5F1E8] md:text-4xl">{t("allOffers")}</h1>
          <p className="mt-1 text-sm text-[#6E716C] dark:text-[#B5B8B2] font-semibold">
            {isRtl ? "عروض ومختارات مضافة إلى جِدّاو" : "Offers and picks listed on JEDDAW"}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {offers.map((offer, index) => {
          const place = getPlace(offer.placeId);
          const discountPct = offer.discountPct;

          return (
            <article
              key={offer.id}
              className={`surface-card overflow-hidden hover-lift relative group border border-[#E2D3BE] dark:border-white/10 flex flex-col justify-between animate-fade-in-up delay-${(index % 6) + 1}`}
            >
              {/* Place Image Banner */}
              <div className="relative h-44 w-full overflow-hidden">
                <PlaceImage
                  src={place.image}
                  alt={isRtl ? place.nameAr : place.nameEn}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                {discountPct > 0 && (
                  <div className="absolute top-3 end-3 bg-[#C96745] text-white text-xs font-black px-3.5 py-1.5 rounded-full shadow-md z-10">
                    {discountPct}% {isRtl ? "خصم" : "OFF"}
                  </div>
                )}

                <span className="absolute top-3 start-3 rounded-full bg-black/60 backdrop-blur px-3 py-1 text-[11px] font-extrabold text-[#E4A23B] z-10">
                  {isRtl ? "كود:" : "Code:"} {offer.code}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-[#252A28] dark:text-[#F5F1E8]">
                    {isRtl ? offer.titleAr : (offer.titleEn || offer.titleAr)}
                  </h2>
                  <p className="mt-1 text-xs font-extrabold text-[#C96745]">
                    📍 {isRtl ? place.nameAr : place.nameEn}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-[#E2D3BE] dark:border-white/10 pt-4">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-[#C96745]">{offer.discountPct}%</span>
                    <span className="text-xs font-bold text-[#6E716C] dark:text-[#B5B8B2]">{isRtl ? "خصم" : "OFF"}</span>
                  </div>

                  <span className="flex items-center gap-1 text-[#397C78] dark:text-[#5EAAA5] text-xs font-bold">
                    <BadgeCheck className="h-4 w-4 text-[#71805B]" /> {isRtl ? "عرض متاح" : "Active Offer"}
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}