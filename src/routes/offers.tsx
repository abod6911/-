import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, Wallet } from "lucide-react";
import { getDistrict, getPlace, offers } from "@/data/jeddah";
import { useLanguage } from "@/context/LanguageContext";

export const Route = createFileRoute("/offers")({
  head: () => ({
    meta: [
      { title: "عروض جدة الترفيهية والمطاعم | وش الخطة؟" },
      {
        name: "description",
        content: "عروض جدة الموثّقة على الترفيه والمطاعم والمقاهي، مع تاريخ التحقق وتاريخ الانتهاء.",
      },
      { property: "og:title", content: "عروض جدة — وش الخطة؟" },
      { property: "og:description", content: "عروض سارية فقط، مع شروط واضحة وتاريخ انتهاء." },
      { property: "og:url", content: "/offers" },
    ],
    links: [{ rel: "canonical", href: "/offers" }],
  }),
  component: OffersPage,
});

function OffersPage() {
  const { t, isRtl } = useLanguage();
  const today = new Date().toISOString().slice(0, 10);
  const active = offers.filter((o) => o.endAt >= today);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold md:text-4xl">🔥 {t("offersTitle")}</h1>
        <p className="mt-2 text-muted-foreground">
          {isRtl
            ? "نعرض العروض السارية فقط. العرض غير متوفر؟ بلّغنا ونحدّثه."
            : "We only show active offers. Offer not available? Let us know and we will update it."}
        </p>
      </div>

      {active.length === 0 ? (
        <div className="mt-10 rounded-2xl bg-pearl p-8 text-center text-muted-foreground animate-fade-in-up delay-1 border border-border">
          <p className="text-4xl mb-3">🥺</p>
          <p>
            {isRtl
              ? "ما فيه عروض سارية حاليًا، لكن عندنا بدائل قريبة في صفحة الأماكن."
              : "No active offers currently, but we have close alternatives on the Places page."}
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {active.map((offer, index) => {
            const place = getPlace(offer.placeId);
            const saving = Math.round(((offer.original - offer.price) / offer.original) * 100);
            const delayClass = `delay-${Math.min((index % 6) + 1, 6)}`;
            
            return (
              <article key={offer.id} className={`surface-card p-5 hover-lift relative overflow-hidden animate-fade-in-up ${delayClass}`}>
                <div className="absolute -end-8 top-4 rotate-45 bg-coral px-10 py-1 text-[11px] font-bold text-accent-foreground shadow-sm">
                  {isRtl ? `وفّر ${saving}%` : `Save ${saving}%`}
                </div>
                
                <div className="flex items-center gap-2 mb-2 pr-16 rtl:pr-0 rtl:pl-16">
                  {offer.sponsored && (
                    <span className="rounded-full bg-navy px-2.5 py-1 text-[11px] font-bold text-pearl inline-block">
                      {t("sponsored")}
                    </span>
                  )}
                </div>
                <h2 className="mt-1 text-lg font-bold">{isRtl ? offer.titleAr : offer.titleEn || offer.titleAr}</h2>
                <p className="text-sm text-muted-foreground">
                  {isRtl ? place.nameAr : place.nameEn} · {getDistrict(place.districtId).nameAr}
                </p>
                <p className="mt-3 flex items-center gap-2 text-xl font-bold text-coral">
                  <Wallet className="h-4 w-4" />
                  {offer.price === 0 ? t("free") : `${offer.price} SAR`}
                  <span className="text-sm font-medium text-muted-foreground line-through">
                    {offer.original} SAR
                  </span>
                </p>
                <p className="mt-3 text-xs text-muted-foreground">{isRtl ? "الشروط:" : "Terms:"} {offer.termsAr}</p>
                <p className="mt-2 flex items-center gap-1 text-xs text-success">
                  <BadgeCheck className="h-4 w-4" /> {t("verifiedAt")} {offer.verifiedAt}
                </p>
                <p className="text-xs text-warning mt-1">
                  {t("expiresIn")} {offer.endAt}
                </p>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}