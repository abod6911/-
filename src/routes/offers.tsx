import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, Sparkles, Tag } from "lucide-react";
import { getPlace, offers } from "@/data/jeddah";
import { useLanguage } from "@/context/LanguageContext";

export const Route = createFileRoute("/offers")({
  head: () => ({
    meta: [
      { title: "عروض جدة اليوم | جِدّاو — JEDDAW" },
      {
        name: "description",
        content: "عروض موثقة على المطاعم والمقاهي والأنشطة في جدة مع الأسعار والشروط وتاريخ الانتهاء من جِدّاو.",
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
          <h1 className="text-3xl font-extrabold text-[#252A28] md:text-4xl">{t("allOffers")}</h1>
          <p className="mt-1 text-sm text-[#6E716C] font-semibold">
            {isRtl ? "خصومات وعروض مميزة محدّثة وموثقة حصرياً" : "Verified offers in Jeddah"}
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
              className={`surface-card p-6 hover-lift relative overflow-hidden animate-fade-in-up delay-${(index % 6) + 1}`}
            >
              {discountPct > 0 && (
                <div className="absolute top-0 end-0 bg-[#C96745] text-white text-xs font-bold px-3.5 py-1.5 rounded-bl-2xl shadow-sm">
                  {discountPct}% {isRtl ? "خصم" : "OFF"}
                </div>
              )}

              <span className="inline-block rounded-full bg-[#252A28] px-2.5 py-1 text-[11px] font-bold text-[#FAF6F0] mb-2">
                {offer.code}
              </span>

              <h2 className="mt-2 text-xl font-extrabold text-[#252A28]">{offer.titleAr}</h2>
              <p className="mt-1 text-sm font-semibold text-[#6E716C]">
                {isRtl ? place.nameAr : place.nameEn}
              </p>

              <div className="mt-6 flex items-baseline gap-2 border-t border-[#E2D3BE] pt-4">
                <span className="text-3xl font-extrabold text-[#C96745]">{offer.discountPct}%</span>
                <span className="text-sm font-bold text-[#6E716C]">{isRtl ? "خصم" : "OFF"}</span>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-[#E2D3BE] pt-3 text-xs text-[#6E716C]">
                <span className="flex items-center gap-1 text-[#71805B] font-bold">
                  <BadgeCheck className="h-4 w-4" /> {t("verifiedAt")}
                </span>
                <span>
                  {t("expiresIn")} {offer.validUntil}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}