import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BadgeCheck, Clock, MapPin, Sparkles, Wallet } from "lucide-react";
import heroImage from "@/assets/jeddah-route-hero.jpg";
import { RouteLine } from "@/components/brand/Logo";
import { budgetLevels, getPlace, moodLabels, offers, readyPlans, type Mood } from "@/data/jeddah";
import { useLanguage } from "@/context/LanguageContext";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "وش الخطة؟ | خطط طلعتك في جدة حسب وقتك وميزانيتك" },
      {
        name: "description",
        content:
          "محتار وين تروح في جدة؟ اختر وقتك وميزانيتك وجوّكم، ووش الخطة يرتّب لكم النشاط والمطعم والمسار كامل في أقل من دقيقة.",
      },
      { property: "og:title", content: "وش الخطة؟ — طلعتك في جدة مرتّبة" },
      {
        property: "og:description",
        content: "وقتك وميزانيتك علينا، والخطة جاهزة. خطط ترفيهية جاهزة داخل جدة.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const categories: { mood: Mood | "free"; ar: string; en: string }[] = [
  { mood: "sea", ar: "البحر", en: "Sea & Sunset" },
  { mood: "games", ar: "ألعاب داخلية", en: "Indoor Games" },
  { mood: "adventure", ar: "مغامرات", en: "Adventures" },
  { mood: "calm", ar: "عائلات وأطفال", en: "Family & Kids" },
  { mood: "culture", ar: "ثقافة وتاريخ", en: "Culture & History" },
  { mood: "food", ar: "مطاعم", en: "Restaurants" },
  { mood: "coffee", ar: "مقاهي وحلى", en: "Cafes & Sweets" },
  { mood: "shopping", ar: "تسوق", en: "Shopping" },
  { mood: "free", ar: "أماكن مجانية", en: "Free Spots" },
];

function Index() {
  const { t, isRtl } = useLanguage();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy text-pearl">
        <img
          src={heroImage}
          alt="رسم توضيحي لساحل جدة وقت الغروب مع مسار يربط ثلاث محطات"
          width={1408}
          height={1104}
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24">
          <span className="inline-flex items-center gap-2 rounded-full bg-pearl/15 px-3 py-1 text-xs font-bold">
            <Sparkles className="h-3.5 w-3.5" /> {t("heroBadge")}
          </span>
          <h1 className="mt-5 max-w-2xl text-4xl font-bold leading-tight md:text-6xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed opacity-90 md:text-lg">
            {t("heroDesc")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/quick-plan"
              className="inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3 font-bold text-accent-foreground shadow-lift transition-transform hover:-translate-y-0.5"
            >
              {t("quickPlan")}
              <ArrowLeft className={`h-4 w-4 ${isRtl ? "" : "rotate-180"}`} />
            </Link>
            <Link
              to="/places"
              className="inline-flex items-center gap-2 rounded-full border border-pearl/40 px-6 py-3 font-bold text-pearl transition-colors hover:bg-pearl/10"
            >
              {t("explorePlaces")}
            </Link>
          </div>
          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-3 text-center">
            {[
              { k: "خطة", v: "٣ خطط", d: t("statPlans") },
              { k: "وقت", v: "< دقيقة", d: t("statTime") },
              { k: "أحياء", v: "١١ حي", d: t("statDistricts") },
            ].map((s) => (
              <div key={s.k} className="rounded-2xl bg-pearl/10 p-3">
                <dt className="text-xs opacity-70">{s.d}</dt>
                <dd className="text-lg font-bold">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Budgets */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-bold md:text-4xl">{t("budgetsTitle")}</h2>
        <RouteLine className="mt-3 h-6 w-48" />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {(["economy", "balanced", "premium"] as const).map((level) => (
            <Link
              key={level}
              to="/quick-plan"
              search={{ budget: level }}
              className="surface-card group p-6 transition-transform hover:-translate-y-1"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-mist px-3 py-1 text-xs font-bold text-navy">
                <Wallet className="h-3.5 w-3.5" /> {budgetLevels[level].rangeAr}
              </span>
              <h3 className="mt-4 text-2xl font-bold">{budgetLevels[level].ar}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{budgetLevels[level].subAr}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-teal">
                {t("arrangePlan")}{" "}
                <ArrowLeft
                  className={`h-4 w-4 transition-transform group-hover:-translate-x-1 ${
                    isRtl ? "" : "rotate-180"
                  }`}
                />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <h2 className="text-2xl font-bold md:text-4xl">{t("categoriesTitle")}</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {categories.map((c) => (
            <Link
              key={c.ar}
              to="/places"
              className="rounded-2xl bg-pearl px-5 py-4 text-sm font-bold shadow-soft transition-transform hover:-translate-y-1"
            >
              {isRtl ? c.ar : c.en}
              <span className="mt-1 block text-[11px] font-medium text-muted-foreground">
                {c.mood === "free" ? t("noCost") : moodLabels[c.mood]}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Ready plans */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold md:text-4xl">{t("readyPlansTitle")}</h2>
          <Link to="/plans" className="shrink-0 text-sm font-bold text-teal">
            {t("allPlans")}
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {readyPlans.slice(0, 6).map((plan) => {
            const price = plan.stops.reduce((s, id) => s + getPlace(id).pricePerPerson, 0);
            const mins = plan.stops.reduce((s, id) => s + getPlace(id).durationMin, 0);
            return (
              <article key={plan.id} className="surface-card p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-coral/12 px-3 py-1 text-xs font-bold text-coral">
                    {plan.tagAr}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {budgetLevels[plan.budget].ar}
                  </span>
                </div>
                <h3 className="mt-3 text-xl font-bold">{isRtl ? plan.titleAr : plan.titleEn}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{plan.descAr}</p>
                <ul className="mt-4 space-y-2 border-t border-border pt-3 text-sm">
                  {plan.stops.map((id, i) => (
                    <li key={id} className="flex items-center gap-2">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-mist text-xs font-bold text-navy">
                        {i + 1}
                      </span>
                      <span className="truncate">
                        {isRtl ? getPlace(id).nameAr : getPlace(id).nameEn}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Wallet className="h-3.5 w-3.5" />
                    {price} ر.س {t("perPerson")}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {Math.round(mins / 60)} {t("hours")}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {plan.stops.length} {t("stations")}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Offers */}
      <section className="bg-mist/60 py-14">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-bold md:text-4xl">{t("offersTitle")}</h2>
            <Link to="/offers" className="shrink-0 text-sm font-bold text-teal">
              {t("allOffers")}
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {offers.slice(0, 3).map((offer) => {
              const place = getPlace(offer.placeId);
              return (
                <article key={offer.id} className="surface-card p-5">
                  {offer.sponsored && (
                    <span className="rounded-full bg-navy px-2.5 py-1 text-[11px] font-bold text-pearl">
                      {t("sponsored")}
                    </span>
                  )}
                  <h3 className="mt-3 text-lg font-bold">{offer.titleAr}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {isRtl ? place.nameAr : place.nameEn}
                  </p>
                  <p className="mt-3 text-xl font-bold text-coral">
                    {offer.price === 0 ? t("free") : `${offer.price} SAR`}
                    <span className="ms-2 text-sm font-medium text-muted-foreground line-through">
                      {offer.original} SAR
                    </span>
                  </p>
                  <p className="mt-3 flex items-center gap-1 text-xs text-success">
                    <BadgeCheck className="h-4 w-4" /> {t("verifiedAt")} {offer.verifiedAt}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("expiresIn")} {offer.endAt}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-bold md:text-4xl">{t("howItWorksTitle")}</h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {[t("step1"), t("step2"), t("step3")].map((stepText, i) => (
            <li key={stepText} className="surface-card p-6">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-teal text-lg font-bold text-primary-foreground">
                {i + 1}
              </span>
              <p className="mt-4 font-semibold">{stepText}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Business CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="surface-card flex flex-col gap-4 bg-navy p-8 text-pearl md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">{t("businessTitle")}</h2>
            <p className="mt-2 max-w-xl text-sm opacity-85">{t("businessDesc")}</p>
          </div>
          <Link
            to="/advertise"
            className="shrink-0 rounded-full bg-coral px-6 py-3 text-center font-bold text-accent-foreground"
          >
            {t("joinPartner")}
          </Link>
        </div>
      </section>
    </div>
  );
}
