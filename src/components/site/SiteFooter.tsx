import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";
import { useLanguage } from "@/context/LanguageContext";

export function SiteFooter() {
  const { t } = useLanguage();
  return (
    <footer className="mt-20 bg-navy px-4 py-12 text-mist">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
        <div>
          <div className="rounded-2xl bg-pearl px-3 py-2 inline-block">
            <Logo />
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed opacity-80">
            {t("footerDesc")}
          </p>
          <p className="mt-3 text-xs opacity-60">{t("footerNote")}</p>
        </div>
        <div className="text-sm">
          <h2 className="mb-3 font-bold text-pearl">{t("navHeader")}</h2>
          <ul className="space-y-2 opacity-85">
            <li><Link to="/quick-plan">{t("quickPlan")}</Link></li>
            <li><Link to="/plans">{t("readyPlans")}</Link></li>
            <li><Link to="/places">{t("places")}</Link></li>
            <li><Link to="/offers">{t("offers")}</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <h2 className="mb-3 font-bold text-pearl">{t("businessHeader")}</h2>
          <ul className="space-y-2 opacity-85">
            <li><Link to="/advertise">{t("advertise")}</Link></li>
            <li><Link to="/advertise">{t("joinPartner")}</Link></li>
            <li dir="ltr" className="text-start">@weshalkhutta</li>
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-6xl border-t border-mist/20 pt-6 text-xs opacity-60">
        © 2026 {t("brandName")} — {t("footerNote")}
      </p>
    </footer>
  );
}