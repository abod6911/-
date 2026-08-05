import { Link } from "@tanstack/react-router";
import { Logo, RouteLine } from "@/components/brand/Logo";
import { useLanguage } from "@/context/LanguageContext";
import { Instagram, Mail, Send, ShieldCheck, Sparkles, Twitter } from "lucide-react";

export function SiteFooter() {
  const { t, isRtl } = useLanguage();

  return (
    <footer className="mt-24 bg-gradient-to-b from-[#1A2220] via-[#151C1A] to-[#0E1312] text-[#FAF6F0] relative overflow-hidden border-t border-[#E2D3BE]/15">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 end-1/4 h-72 w-72 rounded-full bg-[#C96745]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 start-1/4 h-72 w-72 rounded-full bg-[#397C78]/15 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 pt-16 pb-12 relative z-10">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="inline-block hover-scale">
              <Logo />
            </Link>

            <p className="text-xs md:text-sm leading-relaxed text-[#FAF6F0]/80 font-medium max-w-xs">
              {t("footerDesc")}
            </p>

            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3.5 py-1.5 border border-white/10 text-xs font-semibold text-[#5EAAA5]">
              <ShieldCheck className="h-4 w-4 text-[#397C78]" />
              <span>جميع الأماكن موثوقة ومحدّثة 100%</span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h3 className="mb-4 text-base font-extrabold text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#C96745]" />
              {t("navHeader")}
            </h3>
            <ul className="space-y-2.5 text-xs md:text-sm font-semibold text-[#FAF6F0]/80">
              <li>
                <Link to="/quick-plan" className="hover:text-[#FF9D7A] transition-colors flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-[#C96745]" />
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
                  استكشف جدة 🗺️
                </Link>
              </li>
              <li>
                <Link to="/offers" className="hover:text-[#FF9D7A] transition-colors">
                  عروض جدة 🔥
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: For Business */}
          <div>
            <h3 className="mb-4 text-base font-extrabold text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#397C78]" />
              {t("businessHeader")}
            </h3>
            <ul className="space-y-2.5 text-xs md:text-sm font-semibold text-[#FAF6F0]/80">
              <li>
                <Link to="/advertise" className="hover:text-[#5EAAA5] transition-colors">
                  {t("advertise")}
                </Link>
              </li>
              <li>
                <Link to="/advertise" className="hover:text-[#5EAAA5] transition-colors">
                  {t("joinPartner")}
                </Link>
              </li>
              <li>
                <Link to="/advertise" className="hover:text-[#5EAAA5] transition-colors">
                  أضف مكانك في جدة 📍
                </Link>
              </li>
              <li>
                <Link to="/advertise" className="hover:text-[#5EAAA5] transition-colors">
                  باقات الرعاية والإعلانات 💎
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Social Handles */}
          <div className="space-y-5">
            <div>
              <h3 className="mb-3 text-base font-extrabold text-white">
                {t("socialHeader")}
              </h3>
              <div className="flex items-center gap-3">
                <a
                  href="https://twitter.com/jeddaw"
                  target="_blank"
                  rel="noreferrer"
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-[#C96745] hover:scale-110 transition-all shadow-sm"
                  aria-label="Twitter / X"
                >
                  <Twitter className="h-4 w-4" />
                </a>
                <a
                  href="https://instagram.com/jeddaw"
                  target="_blank"
                  rel="noreferrer"
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-[#C96745] hover:scale-110 transition-all shadow-sm"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <span className="text-xs font-extrabold text-[#FAF6F0]/70 dir-ltr font-mono">
                  @jeddaw
                </span>
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-xs font-bold text-[#FAF6F0]/90">
                {t("newsletter")}
              </h3>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="relative flex items-center"
              >
                <input
                  type="email"
                  placeholder={t("newsletterPlaceholder")}
                  className="w-full rounded-full bg-white/10 border border-white/15 px-4 py-2.5 pe-24 text-xs font-semibold text-white placeholder:text-white/40 focus:outline-none focus:border-[#C96745] transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="absolute end-1 rounded-full bg-[#C96745] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#b55837] transition-colors shadow-sm"
                >
                  {t("subscribe")}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Route Divider */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col items-center justify-between gap-4 text-center md:flex-row relative">
          <RouteLine className="absolute -top-3 inset-x-0 mx-auto h-1 w-full max-w-md opacity-30 pointer-events-none" />
          
          <p className="text-xs font-semibold text-[#FAF6F0]/60">
            © 2026 {t("brandName")} (JEDDAW) — {t("slogan")}
          </p>

          <div className="flex items-center gap-4 text-xs font-semibold text-[#FAF6F0]/60">
            <Link to="/plans" className="hover:text-white transition-colors">الخطط الجاهزة</Link>
            <span>·</span>
            <Link to="/places" className="hover:text-white transition-colors">استكشف جدة</Link>
            <span>·</span>
            <Link to="/advertise" className="hover:text-white transition-colors">أعلن معنا</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}