import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark, Heart, LogOut, Sparkles, User as UserIcon } from "lucide-react";
import { getPlace } from "@/data/jeddah";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { PlaceCard } from "@/components/places/PlaceCard";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "حسابي | جِدّاو — JEDDAW" },
      {
        name: "description",
        content: "إدارة خططك المحفوظة للويكند والأماكن المفضلة في جِدّاو.",
      },
    ],
    links: [{ rel: "canonical", href: "/account" }],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { t, isRtl } = useLanguage();
  const { user, logout, savedPlans, favorites } = useAuth();

  if (!user || user.id === "guest") {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center animate-fade-in-up">
        <div className="surface-card p-8">
          <span className="text-5xl block mb-4">🔑</span>
          <h1 className="text-2xl font-extrabold text-[#252A28]">{t("authTitle")}</h1>
          <p className="mt-2 text-sm text-[#6E716C] leading-relaxed">{t("authPrompt")}</p>
          <Link
            to="/quick-plan"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#C96745] py-3.5 text-sm font-bold text-white shadow-lift hover:bg-[#b55837] min-h-[48px]"
          >
            <Sparkles className="h-4 w-4" />
            {t("createFirstPlan")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Profile Header */}
      <div className="surface-card p-6 md:p-8 flex flex-wrap items-center justify-between gap-4 animate-fade-in-up">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-[#C96745] to-[#397C78] text-2xl font-bold text-white shadow-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-[#252A28]">{user.name}</h1>
            <p className="text-xs font-semibold text-[#6E716C] mt-0.5">{user.email}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-full border border-[#E2D3BE] px-5 py-2.5 text-xs font-bold text-[#252A28] hover:border-[#B84E4E] hover:text-[#B84E4E] transition-all min-h-[44px]"
        >
          <LogOut className="h-4 w-4" />
          {t("logout")}
        </button>
      </div>

      {/* Saved Plans */}
      <section className="mt-10">
        <h2 className="text-2xl font-extrabold text-[#252A28] mb-6 flex items-center gap-2">
          <Bookmark className="h-5 w-5 text-[#C96745]" />
          {t("savedPlansCount")} ({savedPlans.length})
        </h2>

        {savedPlans.length === 0 ? (
          <div className="surface-card p-8 text-center">
            <span className="text-4xl block mb-3">📋</span>
            <p className="text-base font-bold text-[#252A28]">{t("emptySavedPlans")}</p>
            <Link
              to="/quick-plan"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#C96745] px-6 py-3 text-sm font-bold text-white shadow-lift min-h-[44px]"
            >
              <Sparkles className="h-4 w-4" />
              {t("createFirstPlan")}
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {savedPlans.map((plan) => (
              <article key={plan.id} className="surface-card p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#252A28]">{plan.titleAr}</h3>
                  <p className="text-xs text-[#6E716C] mt-1">
                    {"subtitleAr" in plan ? plan.subtitleAr : plan.descAr}
                  </p>
                </div>
                <div className="mt-4 border-t border-[#E2D3BE] pt-3 flex items-center justify-between text-xs font-bold text-[#C96745]">
                  <span>{"pricePerPerson" in plan ? `${plan.pricePerPerson} ر.س / شخص` : plan.tagAr}</span>
                  <span>{plan.stops.length} محطات</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Favorites */}
      <section className="mt-12">
        <h2 className="text-2xl font-extrabold text-[#252A28] mb-6 flex items-center gap-2">
          <Heart className="h-5 w-5 text-[#C96745]" />
          {t("favoritePlacesCount")} ({favorites.length})
        </h2>

        {favorites.length === 0 ? (
          <div className="surface-card p-8 text-center">
            <p className="text-sm text-[#6E716C] font-semibold">{t("noFavorites")}</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {favorites.map((id) => (
              <PlaceCard key={id} place={getPlace(id)} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}