import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Calculator, Heart, LogOut, MapPin, Star, Trash2, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { getPlace } from "@/data/jeddah";
import { PlaceCard } from "@/components/places/PlaceCard";
import { SplitBillModal } from "@/components/planner/SplitBillModal";
import { AuthModal } from "@/components/auth/AuthModal";
import type { GeneratedPlan } from "@/lib/planner";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "حسابي | وش الخطة؟" },
      {
        name: "description",
        content: "حسابك في وش الخطة؟ لحفظ الخطط والأماكن المفضلة ومتابعة العروض داخل جدة.",
      },
      { property: "og:title", content: "حسابي — وش الخطة؟" },
      { property: "og:description", content: "احفظ خططك وأماكنك المفضلة في جدة." },
      { property: "og:url", content: "/account" },
    ],
    links: [{ rel: "canonical", href: "/account" }],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { t, isRtl } = useLanguage();
  const { user, savedPlans, favorites, logout, removeSavedPlan } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [splitPlan, setSplitPlan] = useState<GeneratedPlan | null>(null);

  const favoritePlacesList = favorites.map((id) => getPlace(id)).filter(Boolean);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* Account Profile Header */}
      <div className="surface-card flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 gap-4">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-teal text-primary-foreground font-bold text-xl shadow-soft">
            <UserIcon className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {t("welcomeUser")} {user ? user.name : t("guestBadge")}
            </h1>
            <p className="text-sm text-muted-foreground">{user ? user.email : "guest@weshalkhutta.sa"}</p>
          </div>
        </div>

        {user && user.id !== "guest" ? (
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            {t("logout")}
          </button>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="rounded-full bg-coral px-6 py-2.5 text-sm font-bold text-accent-foreground shadow-soft hover:opacity-90 transition-opacity"
          >
            {t("signIn")} / {t("signUp")}
          </button>
        )}
      </div>

      {/* Stats bar */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="surface-card p-5 text-center">
          <div className="inline-flex p-3 rounded-full bg-coral/10 text-coral mb-2">
            <Star className="h-6 w-6 fill-current" />
          </div>
          <p className="text-2xl font-bold">{savedPlans.length}</p>
          <p className="text-xs text-muted-foreground font-semibold">{t("savedPlansCount")}</p>
        </div>

        <div className="surface-card p-5 text-center">
          <div className="inline-flex p-3 rounded-full bg-teal/10 text-teal mb-2">
            <Heart className="h-6 w-6 fill-current" />
          </div>
          <p className="text-2xl font-bold">{favoritePlacesList.length}</p>
          <p className="text-xs text-muted-foreground font-semibold">{t("favoritePlacesCount")}</p>
        </div>
      </div>

      {/* Saved Plans Section */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-4">{t("savedPlansCount")}</h2>

        {savedPlans.length === 0 ? (
          <div className="surface-card p-8 text-center text-muted-foreground">
            <p>{t("noSavedPlans")}</p>
            <Link
              to="/quick-plan"
              className="mt-4 inline-block rounded-full bg-teal px-6 py-2.5 text-sm font-bold text-primary-foreground"
            >
              {t("quickPlan")}
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {savedPlans.map((plan) => (
              <article key={plan.id} className="surface-card p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">{plan.titleAr}</h3>
                    <button
                      onClick={() => removeSavedPlan(plan.id)}
                      className="text-destructive hover:opacity-80 p-1"
                      title="حذف"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{plan.subtitleAr}</p>

                  <ul className="mt-4 space-y-2 text-sm border-t border-border pt-3">
                    {plan.stops?.map((stop, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="grid h-5 w-5 place-items-center rounded-full bg-mist text-xs font-bold text-navy">
                          {i + 1}
                        </span>
                        <span>{isRtl ? stop.place?.nameAr : stop.place?.nameEn}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 pt-3 border-t border-border flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-coral">{plan.pricePerPerson} ر.س/شخص</span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSplitPlan(plan)}
                      className="inline-flex items-center gap-1 rounded-full bg-mist px-3 py-1.5 text-xs font-bold text-navy hover:bg-mist/80"
                    >
                      <Calculator className="h-3.5 w-3.5 text-coral" />
                      {t("calculateSplit")}
                    </button>

                    <a
                      href={`https://www.google.com/maps/dir/${plan.stops
                        ?.map((s) => encodeURIComponent(`${s.place?.nameEn} Jeddah`))
                        .join("/")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-full bg-teal px-3 py-1.5 text-xs font-bold text-primary-foreground"
                    >
                      <MapPin className="h-3.5 w-3.5" />
                      {t("openRoute")}
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Favorite Places Section */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">{t("favoritePlacesCount")}</h2>

        {favoritePlacesList.length === 0 ? (
          <div className="surface-card p-8 text-center text-muted-foreground">
            <p>{t("noFavorites")}</p>
            <Link
              to="/places"
              className="mt-4 inline-block rounded-full border border-border px-6 py-2.5 text-sm font-bold text-navy"
            >
              {t("explorePlaces")}
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favoritePlacesList.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        )}
      </section>

      {/* Modals */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      {splitPlan && (
        <SplitBillModal
          plan={splitPlan}
          groupSize={2}
          onClose={() => setSplitPlan(null)}
        />
      )}
    </div>
  );
}