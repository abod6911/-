import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark, CheckCircle2, Clock, Heart, Lock, LogOut, MapPin, Navigation, Share2, ShieldCheck, Sparkles, Trash2, User as UserIcon, Wallet } from "lucide-react";
import { useState } from "react";
import { getPlace } from "@/data/jeddah";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { PlaceCard } from "@/components/places/PlaceCard";
import { AuthModal } from "@/components/auth/AuthModal";
import { UserBadges } from "@/components/user/UserBadges";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "حسابي والخطط المحفوظة | جِدّاو — JEDDAW" },
      {
        name: "description",
        content: "إدارة حسابك، خططك المحفوظة للويكند والأماكن المفضلة في جِدّاو.",
      },
    ],
    links: [{ rel: "canonical", href: "/account" }],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { t, isRtl } = useLanguage();
  const { user, logout, savedPlans, removeSavedPlan, favorites } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (!user || user.id === "guest") {
    return (
      <>
        <div className="mx-auto max-w-xl px-4 py-16 animate-fade-in-up">
          {/* Professional High-Tech Auth Portal Card */}
          <div className="rounded-3xl bg-gradient-to-b from-[#FAF6F0] via-white to-[#FAF6F0] dark:from-[#1C2422] dark:via-[#161B1A] dark:to-[#1C2422] p-8 md:p-10 border border-[#E2D3BE] dark:border-white/10 shadow-2xl relative overflow-hidden text-center">
            {/* Top Accent Gradient Border */}
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#C96745] via-[#E4A23B] to-[#397C78]" />

            {/* 3D Metallic Badge Icon */}
            <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-[#C96745] to-[#397C78] text-white shadow-lift ring-4 ring-[#C96745]/20">
              <Lock className="h-9 w-9" />
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-[#252A28] dark:text-[#F5F1E8]">
              {isRtl ? "تسجيل الدخول إلى جِدّاو 🔑" : "Sign In to JEDDAW 🔑"}
            </h1>
            <p className="mt-2 text-xs md:text-sm text-[#6E716C] dark:text-[#B5B8B2] font-semibold leading-relaxed max-w-md mx-auto">
              {isRtl
                ? "أنشئ حسابك الشخصي أو سجّل دخولك للاستفادة الكاملة من ميزات تخطيط وحفظ خطط الويكند!"
                : "Sign in or create an account to save your plans and favorite spots!"}
            </p>

            {/* Features Checklist */}
            <ul className="mt-6 space-y-2.5 text-xs font-bold text-[#252A28] dark:text-[#F5F1E8] text-start max-w-sm mx-auto bg-[#F4EBDD]/60 dark:bg-[#253230]/60 p-4 rounded-2xl border border-[#E2D3BE]/60 dark:border-white/10">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#397C78] dark:text-[#5EAAA5] shrink-0" />
                <span>{isRtl ? "حفظ خطط الويكند اللانهائية واسترجاعها بأي وقت" : "Save unlimited weekend outing plans"}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#397C78] dark:text-[#5EAAA5] shrink-0" />
                <span>{isRtl ? "قائمة الأماكن والمطاعم المفضلة لديك بجدة" : "Personalized favorite spots in Jeddah"}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#397C78] dark:text-[#5EAAA5] shrink-0" />
                <span>{isRtl ? "مشاركة المسارات والتكلفة مع الشلة بنقرة واحدة" : "Share routes & split costs with your group"}</span>
              </li>
            </ul>

            {/* Main Action Buttons */}
            <div className="mt-8 space-y-3">
              <button
                onClick={() => setShowAuthModal(true)}
                className="w-full rounded-full bg-[#C96745] py-4 text-sm font-black text-white shadow-lift hover:bg-[#b55837] transition-all animate-pulse-glow min-h-[52px]"
              >
                {isRtl ? "تسجيل الدخول / حساب جديد 🚀" : "Sign In / Register 🚀"}
              </button>

              <Link
                to="/quick-plan"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#E2D3BE] dark:border-white/15 bg-white dark:bg-[#253230] py-3.5 text-xs font-bold text-[#252A28] dark:text-[#F5F1E8] hover:border-[#C96745] transition-all min-h-[46px]"
              >
                <Sparkles className="h-4 w-4 text-[#C96745]" />
                {isRtl ? "سوّ لي خطة جديدة كضيف ⚡" : "Plan an Outing as Guest ⚡"}
              </Link>
            </div>

            {/* Protection Security Badge */}
            <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#397C78] dark:text-[#5EAAA5] pt-3 border-t border-[#E2D3BE]/60 dark:border-white/10">
              <ShieldCheck className="h-4 w-4" />
              <span>{isRtl ? "نظام حماية مشفر وتشفير بيانات آمن 100% SSL" : "100% SSL Secure Encrypted Portal"}</span>
            </div>
          </div>
        </div>

        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      </>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Profile Header Card */}
      <div className="surface-card p-6 md:p-8 flex flex-wrap items-center justify-between gap-4 animate-fade-in-up border border-[#E2D3BE] dark:border-white/10">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-[#C96745] to-[#397C78] text-2xl font-bold text-white shadow-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-[#252A28] dark:text-[#F5F1E8]">{user.name}</h1>
              <span className="rounded-full bg-[#397C78]/15 px-3 py-0.5 text-xs font-extrabold text-[#397C78] dark:text-[#5EAAA5]">
                {isRtl ? "عضو جِدّاو 🌟" : "JEDDAW Member 🌟"}
              </span>
            </div>
            <p className="text-xs font-semibold text-[#6E716C] dark:text-[#B5B8B2] mt-1">
              {user.email} · {isRtl ? `الحي المفضل: ${user.district || "الكورنيش"}` : `Favorite Area: ${user.district || "Corniche"}`}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-full border border-[#E2D3BE] dark:border-white/15 bg-[#FAF6F0] dark:bg-[#222826] px-5 py-2.5 text-xs font-bold text-[#252A28] dark:text-[#F5F1E8] hover:border-[#B84E4E] hover:text-[#B84E4E] transition-all min-h-[44px]"
        >
          <LogOut className="h-4 w-4" />
          {isRtl ? "تسجيل الخروج" : "Log Out"}
        </button>
      </div>

      {/* Gamification Achievements Section */}
      <div className="mt-8">
        <UserBadges />
      </div>

      {/* Saved Plans Section */}
      <section className="mt-10">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-extrabold text-[#252A28] dark:text-[#F5F1E8] flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-[#C96745]" />
            {isRtl ? `الخطط المحفوظة (${savedPlans.length})` : `Saved Plans (${savedPlans.length})`}
          </h2>

          <Link
            to="/quick-plan"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#C96745] px-4 py-2 text-xs font-bold text-white shadow-lift min-h-[40px]"
          >
            <Sparkles className="h-3.5 w-3.5" /> {isRtl ? "سوّ خطة جديدة" : "Build New Plan"}
          </Link>
        </div>

        {savedPlans.length === 0 ? (
          <div className="surface-card p-8 text-center border border-[#E2D3BE] dark:border-white/10">
            <span className="text-4xl block mb-3">📋</span>
            <p className="text-base font-bold text-[#252A28] dark:text-[#F5F1E8]">{t("emptySavedPlans")}</p>
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
            {savedPlans.map((plan) => {
              const price = "pricePerPerson" in plan ? plan.pricePerPerson : plan.stops.reduce((s, id) => s + getPlace(id).pricePerPerson, 0);

              return (
                <article
                  key={plan.id}
                  className="surface-card overflow-hidden flex flex-col justify-between p-6 border border-[#E2D3BE] dark:border-white/10 hover-lift"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="rounded-full bg-[#C96745]/15 px-3 py-1 text-xs font-extrabold text-[#C96745]">
                        {isRtl ? ("tagAr" in plan ? plan.tagAr : "خطة مخصصة ⚡") : "Saved Outing ⚡"}
                      </span>
                      <button
                        onClick={() => removeSavedPlan(plan.id)}
                        className="text-[#6E716C] hover:text-[#B84E4E] transition-colors p-1"
                        title={isRtl ? "حذف الخطة" : "Delete Plan"}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <h3 className="text-xl font-extrabold text-[#252A28] dark:text-[#F5F1E8]">
                      {isRtl ? plan.titleAr : (plan.titleAr || "Jeddah Outing")}
                    </h3>
                    <p className="text-xs text-[#6E716C] dark:text-[#B5B8B2] mt-1 line-clamp-2">
                      {isRtl ? ("subtitleAr" in plan ? plan.subtitleAr : plan.descAr) : ("subtitleAr" in plan ? plan.subtitleAr : plan.descAr)}
                    </p>

                    {/* Timeline stops preview */}
                    <ul className="mt-4 space-y-2 border-t border-[#E2D3BE] dark:border-white/10 pt-3">
                      {plan.stops.map((stop, i) => {
                        const placeId = typeof stop === "string" ? stop : stop.place.id;
                        const place = getPlace(placeId);
                        return (
                          <li key={placeId} className="flex items-center gap-2 text-xs font-semibold text-[#252A28] dark:text-[#F5F1E8]">
                            <span className="grid h-5 w-5 place-items-center rounded-full bg-[#397C78] text-[10px] font-bold text-white shrink-0">
                              {i + 1}
                            </span>
                            <span className="truncate">{isRtl ? place.nameAr : place.nameEn}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <div className="mt-5 border-t border-[#E2D3BE] dark:border-white/10 pt-3 flex items-center justify-between text-xs font-bold">
                    <span className="text-[#C96745] flex items-center gap-1">
                      <Wallet className="h-4 w-4" /> {price} {isRtl ? "ر.س / شخص" : "SAR / person"}
                    </span>
                    <button
                      onClick={() => alert(isRtl ? `رابط الخطة: https://jeddaw.sa/plans#${plan.id}` : `Plan Link: https://jeddaw.sa/plans#${plan.id}`)}
                      className="inline-flex items-center gap-1 text-[#397C78] dark:text-[#5EAAA5] hover:underline"
                    >
                      <Share2 className="h-3.5 w-3.5" /> {isRtl ? "مشاركة 📲" : "Share 📲"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Favorite Places Section */}
      <section className="mt-14">
        <h2 className="text-2xl font-extrabold text-[#252A28] dark:text-[#F5F1E8] mb-6 flex items-center gap-2">
          <Heart className="h-5 w-5 text-[#C96745]" />
          {isRtl ? `الأماكن المفضلة (${favorites.length})` : `Favorite Places (${favorites.length})`}
        </h2>

        {favorites.length === 0 ? (
          <div className="surface-card p-8 text-center border border-[#E2D3BE] dark:border-white/10">
            <p className="text-sm text-[#6E716C] dark:text-[#B5B8B2] font-semibold">
              {isRtl
                ? "لم تقم بتمييز أي مكان كمفضل بعد. تصفح الأماكن واضغط على ❤️ لإضافتها!"
                : "You haven't saved any favorites yet. Explore places and tap ❤️ to save!"}
            </p>
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