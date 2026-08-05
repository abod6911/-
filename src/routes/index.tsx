import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BadgeCheck, Clock, MapPin, Sparkles, Star, Wallet, Zap } from "lucide-react";
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

const categories: { mood: Mood | "free"; ar: string; en: string; emoji: string }[] = [
  { mood: "sea", ar: "البحر", en: "Sea & Sunset", emoji: "🌊" },
  { mood: "games", ar: "ألعاب داخلية", en: "Indoor Games", emoji: "🎮" },
  { mood: "adventure", ar: "مغامرات", en: "Adventures", emoji: "🏄" },
  { mood: "calm", ar: "عائلات وأطفال", en: "Family & Kids", emoji: "👨‍👩‍👧‍👦" },
  { mood: "culture", ar: "ثقافة وتاريخ", en: "Culture & History", emoji: "🏛️" },
  { mood: "food", ar: "مطاعم", en: "Restaurants", emoji: "🍽️" },
  { mood: "coffee", ar: "مقاهي وحلى", en: "Cafes & Sweets", emoji: "☕" },
  { mood: "shopping", ar: "تسوق", en: "Shopping", emoji: "🛍️" },
  { mood: "free", ar: "أماكن مجانية", en: "Free Spots", emoji: "✨" },
];

const budgetEmojis: Record<string, string> = {
  economy: "💚",
  balanced: "💙",
  premium: "💎",
};

function Index() {
  const { t, isRtl } = useLanguage();

  return (
    <div>
      {/* ===== Hero Section ===== */}
      <section className="relative overflow-hidden bg-navy text-pearl min-h-[520px] md:min-h-[600px] flex items-center">
        {/* Background image with gradient overlay */}
        <img
          src={heroImage}
          alt="رسم توضيحي لساحل جدة وقت الغروب مع مسار يربط ثلاث محطات"
          width={1408}
          height={1104}
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-navy/30" />

        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24 w-full">
          {/* Badge */}
          <span className="animate-fade-in-up inline-flex items-center gap-2 rounded-full bg-pearl/15 px-4 py-1.5 text-xs font-bold backdrop-blur-sm border border-pearl/10">
            <Sparkles className="h-3.5 w-3.5 text-coral" /> {t("heroBadge")}
          </span>

          {/* Title */}
          <h1 className="animate-fade-in-up delay-1 mt-6 max-w-2xl text-4xl font-bold leading-tight md:text-6xl md:leading-[1.1]">
            {t("heroTitle")}
          </h1>

          {/* Description */}
          <p className="animate-fade-in-up delay-2 mt-5 max-w-xl text-base leading-relaxed opacity-90 md:text-lg">
            {t("heroDesc")}
          </p>

          {/* CTA Buttons */}
          <div className="animate-fade-in-up delay-3 mt-8 flex flex-wrap gap-3">
            <Link
              to="/quick-plan"
              className="group inline-flex items-center gap-2 rounded-full bg-coral px-7 py-3.5 font-bold text-accent-foreground shadow-lift transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-15px_oklch(0.706_0.166_33.4/0.5)] animate-pulse-glow"
            >
              <Sparkles className="h-4 w-4" />
              {t("quickPlan")}
              <ArrowLeft className={`h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1 ${isRtl ? "" : "rotate-180 group-hover:translate-x-1"}`} />
            </Link>
            <Link
              to="/places"
              className="inline-flex items-center gap-2 rounded-full border border-pearl/30 px-7 py-3.5 font-bold text-pearl backdrop-blur-sm transition-all duration-300 hover:bg-pearl/15 hover:border-pearl/50"
            >
              {t("explorePlaces")}
            </Link>
          </div>

          {/* Stats */}
          <dl className="animate-fade-in-up delay-4 mt-12 grid max-w-lg grid-cols-3 gap-3 text-center">
            {[
              { k: "خطة", v: isRtl ? "٣ خطط" : "3 Plans", d: t("statPlans"), icon: "📋" },
              { k: "وقت", v: isRtl ? "< دقيقة" : "< 1 min", d: t("statTime"), icon: "⚡" },
              { k: "أحياء", v: isRtl ? "١١ حي" : "11 Areas", d: t("statDistricts"), icon: "📍" },
            ].map((s, i) => (
              <div
                key={s.k}
                className="glass-card rounded-2xl p-3.5 border border-pearl/10 hover-scale cursor-default"
                style={{ animationDelay: `${0.5 + i * 0.1}s` }}
              >
                <span className="text-lg">{s.icon}</span>
                <dd className="text-lg font-bold mt-1">{s.v}</dd>
                <dt className="text-[11px] opacity-70 mt-0.5">{s.d}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ===== Budgets Section ===== */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold md:text-4xl">{t("budgetsTitle")}</h2>
        </div>
        <RouteLine className="mt-3 h-6 w-48" />

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {(["economy", "balanced", "premium"] as const).map((level, i) => (
            <Link
              key={level}
              to="/quick-plan"
              search={{ budget: level }}
              className="surface-card group p-6 hover-lift relative overflow-hidden"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Decorative gradient corner */}
              <div className={`absolute top-0 end-0 w-24 h-24 rounded-full blur-3xl opacity-20 transition-opacity group-hover:opacity-40 ${
                level === "economy" ? "bg-success" : level === "balanced" ? "bg-teal" : "bg-coral"
              }`} />

              <span className="relative inline-flex items-center gap-2 rounded-full bg-mist px-3.5 py-1.5 text-xs font-bold text-navy">
                <span className="text-base">{budgetEmojis[level]}</span>
                <Wallet className="h-3.5 w-3.5" /> {budgetLevels[level].rangeAr}
              </span>
              <h3 className="relative mt-4 text-2xl font-bold">{isRtl ? budgetLevels[level].ar : budgetLevels[level].ar}</h3>
              <p className="relative mt-2 text-sm text-muted-foreground">{budgetLevels[level].subAr}</p>
              <span className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-teal group-hover:gap-3 transition-all">
                {t("arrangePlan")}
                <ArrowLeft
                  className={`h-4 w-4 transition-transform group-hover:-translate-x-1.5 ${
                    isRtl ? "" : "rotate-180 group-hover:translate-x-1.5"
                  }`}
                />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== Categories Section ===== */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-2xl font-bold md:text-4xl">{t("categoriesTitle")}</h2>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-3">
          {categories.map((c) => (
            <Link
              key={c.ar}
              to="/places"
              className="surface-card group flex items-center gap-3 px-5 py-4 hover-lift"
            >
              <span className="text-2xl group-hover:animate-wiggle">{c.emoji}</span>
              <div>
                <span className="text-sm font-bold block group-hover:text-teal transition-colors">
                  {isRtl ? c.ar : c.en}
                </span>
                <span className="text-[11px] font-medium text-muted-foreground">
                  {c.mood === "free" ? t("noCost") : moodLabels[c.mood]}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== Ready Plans Section ===== */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold md:text-4xl">{t("readyPlansTitle")}</h2>
          <Link to="/plans" className="shrink-0 text-sm font-bold text-teal hover:underline underline-offset-4 transition-all">
            {t("allPlans")} →
          </Link>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {readyPlans.slice(0, 6).map((plan) => {
            const price = plan.stops.reduce((s, id) => s + getPlace(id).pricePerPerson, 0);
            const mins = plan.stops.reduce((s, id) => s + getPlace(id).durationMin, 0);
            return (
              <article key={plan.id} className="surface-card p-5 hover-lift group">
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-coral/12 px-3 py-1 text-xs font-bold text-coral">
                    {plan.tagAr}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <Star className="h-3 w-3 text-warning" />
                    {budgetLevels[plan.budget].ar}
                  </span>
                </div>
                <h3 className="mt-3 text-xl font-bold group-hover:text-teal transition-colors">
                  {isRtl ? plan.titleAr : plan.titleEn}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{plan.descAr}</p>

                {/* Timeline stops */}
                <ul className="mt-4 space-y-2 border-t border-border pt-3 text-sm">
                  {plan.stops.map((id, i) => (
                    <li key={id} className="flex items-center gap-2.5">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-teal to-teal-soft text-[11px] font-bold text-primary-foreground shadow-sm">
                        {i + 1}
                      </span>
                      <span className="truncate">
                        {isRtl ? getPlace(id).nameAr : getPlace(id).nameEn}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Stats row */}
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Wallet className="h-3.5 w-3.5 text-coral" />
                    <span className="font-semibold text-foreground">{price} {isRtl ? "ر.س" : "SAR"}</span> {t("perPerson")}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-teal" />
                    {Math.round(mins / 60)} {t("hours")}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-navy-soft" />
                    {plan.stops.length} {t("stations")}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ===== Offers Section ===== */}
      <section className="bg-mist/40 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-bold md:text-4xl">{t("offersTitle")}</h2>
            <Link to="/offers" className="shrink-0 text-sm font-bold text-teal hover:underline underline-offset-4">
              {t("allOffers")} →
            </Link>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {offers.slice(0, 3).map((offer) => {
              const place = getPlace(offer.placeId);
              return (
                <article key={offer.id} className="surface-card p-5 hover-lift relative overflow-hidden">
                  {/* Discount ribbon */}
                  {offer.price < offer.original && (
                    <div className="absolute -top-0.5 -end-0.5 bg-coral text-accent-foreground text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl shadow-sm">
                      {Math.round((1 - offer.price / offer.original) * 100)}% {isRtl ? "خصم" : "OFF"}
                    </div>
                  )}
                  {offer.sponsored && (
                    <span className="rounded-full bg-navy px-2.5 py-1 text-[11px] font-bold text-pearl">
                      {t("sponsored")}
                    </span>
                  )}
                  <h3 className="mt-3 text-lg font-bold">{offer.titleAr}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {isRtl ? place.nameAr : place.nameEn}
                  </p>
                  <p className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-coral">
                      {offer.price === 0 ? t("free") : `${offer.price}`}
                    </span>
                    {offer.price > 0 && <span className="text-sm text-muted-foreground">{isRtl ? "ر.س" : "SAR"}</span>}
                    <span className="text-sm font-medium text-muted-foreground line-through">
                      {offer.original} {isRtl ? "ر.س" : "SAR"}
                    </span>
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="flex items-center gap-1 text-xs text-success">
                      <BadgeCheck className="h-4 w-4" /> {t("verifiedAt")} {offer.verifiedAt}
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("expiresIn")} {offer.endAt}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== How It Works Section ===== */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold md:text-4xl">{t("howItWorksTitle")}</h2>
        <ol className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            { text: t("step1"), emoji: "🎯", color: "from-teal to-teal-soft" },
            { text: t("step2"), emoji: "👥", color: "from-coral to-warning" },
            { text: t("step3"), emoji: "🗺️", color: "from-navy to-navy-soft" },
          ].map((step, i) => (
            <li key={step.text} className="surface-card p-6 hover-lift relative overflow-hidden group">
              {/* Step number circle */}
              <div className="flex items-center gap-4">
                <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${step.color} text-lg font-bold text-primary-foreground shadow-soft`}>
                  {i + 1}
                </span>
                <span className="text-3xl group-hover:animate-float">{step.emoji}</span>
              </div>
              <p className="mt-4 font-semibold text-base">{step.text}</p>

              {/* Connecting line for desktop */}
              {i < 2 && (
                <div className="hidden md:block absolute top-1/2 -end-3 w-6 border-t-2 border-dashed border-teal/30" />
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* ===== Business CTA Section ===== */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="surface-card relative overflow-hidden bg-gradient-to-br from-navy via-navy to-navy-soft p-8 md:p-10 text-pearl md:flex md:items-center md:justify-between md:gap-8">
          {/* Decorative blobs */}
          <div className="absolute -top-20 -end-20 w-60 h-60 rounded-full bg-coral/10 blur-3xl" />
          <div className="absolute -bottom-16 -start-16 w-48 h-48 rounded-full bg-teal/10 blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-5 w-5 text-coral" />
              <span className="text-xs font-bold text-coral uppercase tracking-wider">
                {isRtl ? "فرصة للأعمال" : "Business Opportunity"}
              </span>
            </div>
            <h2 className="text-2xl font-bold md:text-3xl">{t("businessTitle")}</h2>
            <p className="mt-2 max-w-xl text-sm opacity-85 leading-relaxed">{t("businessDesc")}</p>
          </div>
          <Link
            to="/advertise"
            className="relative shrink-0 mt-6 md:mt-0 inline-flex items-center gap-2 rounded-full bg-coral px-8 py-3.5 text-center font-bold text-accent-foreground shadow-lift transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-15px_oklch(0.706_0.166_33.4/0.5)]"
          >
            {t("joinPartner")}
            <ArrowLeft className={`h-4 w-4 ${isRtl ? "" : "rotate-180"}`} />
          </Link>
        </div>
      </section>
    </div>
  );
}
