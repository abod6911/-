import { Link } from "@tanstack/react-router";
import { Logo, RouteLine } from "@/components/brand/Logo";
import { useLanguage } from "@/context/LanguageContext";
import { Instagram, Mail, Send, ShieldCheck, Sparkles, Twitter } from "lucide-react";

export function SiteFooter() {
  const { t, isRtl } = useLanguage();

  return (
    <footer className="mt-24 bg-gradient-to-b from-[#1A2220] via-[#151C1A] to-[#0E1312] text-[#FAF6F0] relative overflow-hidden border-t border-[#E2D3BE]/15">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 end-1/4 h-80 w-80 rounded-full bg-[#C96745]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 start-1/4 h-80 w-80 rounded-full bg-[#397C78]/15 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-16 pb-12 relative z-10">
        <div className="grid gap-10 sm:gap-12 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Column 1: Brand Info & Premium Emblem Badge */}
          <div className="space-y-4">
            <Link to="/" className="inline-block hover:scale-105 transition-transform">
              <div className="bg-white/95 backdrop-blur-md p-2 px-3 rounded-2xl border border-white/20 shadow-xl inline-flex items-center">
                <Logo className="h-9 md:h-10" />
              </div>
            </Link>

            <p className="text-xs md:text-sm leading-relaxed text-[#FAF6F0]/85 font-medium max-w-xs">
              {t("footerDesc")}
            </p>

            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3.5 py-1.5 border border-emerald-500/20 text-xs font-bold text-emerald-400">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>{isRtl ? "جميع الأماكن موثوقة ومحدّثة 100%" : "100% Verified Place Listings"}</span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h3 className="mb-4 text-base font-black text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#C96745]" />
              {t("navHeader")}
            </h3>
            <ul className="space-y-3 text-xs md:text-sm font-bold text-[#FAF6F0]/80">
              <li>
                <Link to="/quick-plan" className="hover:text-[#FF9D7A] transition-colors flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-[#C96745] animate-pulse" />
                  <span>{t("quickPlan")}</span>
                </Link>
              </li>
              <li>
                <Link to="/plans" className="hover:text-[#FF9D7A] transition-colors">
                  {t("readyPlans")}
                </Link>
              </li>
              <li>
                <Link to="/places" className="hover:text-[#FF9D7A] transition-colors">
                  {t("places")}
                </Link>
              </li>
              <li>
                <Link to="/offers" className="hover:text-[#FF9D7A] transition-colors">
                  {t("offers")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: For Business */}
          <div>
            <h3 className="mb-4 text-base font-black text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#397C78]" />
              {t("businessHeader")}
            </h3>
            <ul className="space-y-3 text-xs md:text-sm font-bold text-[#FAF6F0]/80">
              <li>
                <Link to="/advertise" className="hover:text-[#5EAAA5] transition-colors">
                  {isRtl ? "للأعمال والشراكات" : "For Businesses"}
                </Link>
              </li>
              <li>
                <Link to="/advertise" className="hover:text-[#5EAAA5] transition-colors">
                  {t("joinPartner")}
                </Link>
              </li>
              <li>
                <Link to="/advertise" className="hover:text-[#5EAAA5] transition-colors">
                  {isRtl ? "أضف مكانك في جدة 📍" : "Add Your Place 📍"}
                </Link>
              </li>
              <li>
                <Link to="/advertise" className="hover:text-[#5EAAA5] transition-colors">
                  {isRtl ? "باقات الرعاية والإعلانات 💎" : "Sponsorship Packages 💎"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Social Handles */}
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-base font-black text-white flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#E4A23B]" />
                {t("socialHeader")}
              </h3>
              <div className="flex items-center gap-3">
                <a
                  href="https://twitter.com/jeddaw"
                  target="_blank"
                  rel="noreferrer"
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-[#C96745] hover:scale-110 transition-all shadow-md cursor-pointer"
                  aria-label="Twitter / X"
                >
                  <Twitter className="h-4 w-4" />
                </a>
                <a
                  href="https://instagram.com/jeddaw"
                  target="_blank"
                  rel="noreferrer"
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-[#C96745] hover:scale-110 transition-all shadow-md cursor-pointer"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <span className="text-xs font-black text-[#FAF6F0]/80 dir-ltr font-mono bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                  @jeddaw
                </span>
              </div>
            </div>

            <div>
              <h3 className="mb-2.5 text-xs font-bold text-[#FAF6F0]/90 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-[#C96745]" />
                <span>{t("newsletter")}</span>
              </h3>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="relative flex items-center"
              >
                <input
                  type="email"
                  placeholder={t("newsletterPlaceholder")}
                  className="w-full rounded-full bg-white/10 border border-white/15 px-4 py-3 pe-28 text-xs font-semibold text-white placeholder:text-white/40 focus:outline-none focus:border-[#C96745] focus:ring-2 focus:ring-[#C96745]/20 transition-all"
                  required
                />
                <button
                  type="submit"
                  className="absolute end-1.5 top-1.5 bottom-1.5 rounded-full bg-gradient-to-r from-[#C96745] to-[#E4A23B] px-4 text-xs font-black text-white hover:opacity-95 hover:scale-105 active:scale-95 transition-all shadow-md flex items-center gap-1 cursor-pointer"
                >
                  <span>{t("subscribe")}</span>
                  <Sparkles className="h-3 w-3" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Route Line Divider */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col items-center justify-between gap-4 text-center md:flex-row relative">
          <RouteLine className="absolute -top-3 inset-x-0 mx-auto h-1 w-full max-w-md opacity-30 pointer-events-none" />
          
          <p className="text-xs font-bold text-[#FAF6F0]/70">
            © 2026 {t("brandName")} (JEDDAW) — {t("slogan")}
          </p>

          <div className="flex items-center gap-4 text-xs font-bold text-[#FAF6F0]/70">
            <Link to="/plans" className="hover:text-white transition-colors">
              {t("readyPlans")}
            </Link>
            <span>·</span>
            <Link to="/places" className="hover:text-white transition-colors">
              {t("places")}
            </Link>
            <span>·</span>
            <Link to="/advertise" className="hover:text-white transition-colors">
              {isRtl ? "أعلن معنا" : "For Businesses"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}