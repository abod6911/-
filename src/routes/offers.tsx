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
      <h1 className="text-3xl font-bold md:text-4xl">{t("offersTitle")}</h1>
      <p className="mt-2 text-muted-foreground">
        نعرض العروض السارية فقط. العرض غير متوفر؟ بلّغنا ونحدّثه.
      </p>

      {active.length === 0 ? (
        <p className="mt-10 rounded-2xl bg-pearl p-8 text-center text-muted-foreground">
          ما فيه عروض سارية حاليًا، لكن عندنا بدائل قريبة في صفحة الأماكن.
        </p>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {active.map((offer) => {
            const place = getPlace(offer.placeId);
            const saving = Math.round(((offer.original - offer.price) / offer.original) * 100);
            return (
              <article key={offer.id} className="surface-card p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-coral px-2.5 py-1 text-[11px] font-bold text-accent-foreground">
                    {isRtl ? `وفّر ${saving}%` : `Save ${saving}%`}
                  </span>
                  {offer.sponsored && (
                    <span className="rounded-full bg-navy px-2.5 py-1 text-[11px] font-bold text-pearl">
                      {t("sponsored")}
                    </span>
                  )}
                </div>
                <h2 className="mt-3 text-lg font-bold">{offer.titleAr}</h2>
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
                <p className="mt-3 text-xs text-muted-foreground">الشروط: {offer.termsAr}</p>
                <p className="mt-2 flex items-center gap-1 text-xs text-success">
                  <BadgeCheck className="h-4 w-4" /> {t("verifiedAt")} {offer.verifiedAt}
                </p>
                <p className="text-xs text-warning">
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