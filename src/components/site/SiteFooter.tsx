import { Link } from "@tanstack/react-router";
import { Logo, RouteLine } from "@/components/brand/Logo";
import { useLanguage } from "@/context/LanguageContext";
import { Instagram, Twitter } from "lucide-react";

export function SiteFooter() {
  const { t } = useLanguage();
  
  return (
    <footer className="mt-20 bg-[#252A28] px-4 py-14 text-[#FAF6F0] relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-4 relative z-10">
        <div>
          <div className="rounded-2xl bg-[#FAF6F0] px-3.5 py-2 inline-block shadow-md">
            <Logo />
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#FAF6F0]/80 font-medium">
            {t("footerDesc")}
          </p>
          <p className="mt-3 text-xs text-[#FAF6F0]/60">{t("footerNote")}</p>
        </div>
        
        <div className="text-sm">
          <h3 className="mb-4 font-bold text-[#FAF6F0] text-lg">{t("navHeader")}</h3>
          <ul className="space-y-3 text-[#FAF6F0]/85 font-medium">
            <li><Link to="/quick-plan" className="hover:text-[#C96745] transition-colors">{t("quickPlan")}</Link></li>
            <li><Link to="/plans" className="hover:text-[#C96745] transition-colors">{t("readyPlans")}</Link></li>
            <li><Link to="/places" className="hover:text-[#C96745] transition-colors">{t("places")}</Link></li>
            <li><Link to="/offers" className="hover:text-[#C96745] transition-colors">{t("offers")}</Link></li>
          </ul>
        </div>
        
        <div className="text-sm">
          <h3 className="mb-4 font-bold text-[#FAF6F0] text-lg">{t("businessHeader")}</h3>
          <ul className="space-y-3 text-[#FAF6F0]/85 font-medium">
            <li><Link to="/advertise" className="hover:text-[#C96745] transition-colors">{t("advertise")}</Link></li>
            <li><Link to="/advertise" className="hover:text-[#C96745] transition-colors">{t("joinPartner")}</Link></li>
          </ul>
        </div>
        
        <div className="text-sm flex flex-col gap-6">
          <div>
            <h3 className="mb-4 font-bold text-[#FAF6F0] text-lg">{t("socialHeader")}</h3>
            <div className="flex flex-wrap gap-2.5">
              <a href="https://twitter.com/weshalkhutta" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FAF6F0]/10 hover:bg-[#C96745] hover:text-white transition-all font-semibold text-xs min-h-[40px]">
                <Twitter className="h-4 w-4" />
                <span>Twitter / X</span>
              </a>
              <a href="https://instagram.com/weshalkhutta" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FAF6F0]/10 hover:bg-[#C96745] hover:text-white transition-all font-semibold text-xs min-h-[40px]">
                <Instagram className="h-4 w-4" />
                <span>Instagram</span>
              </a>
            </div>
          </div>
          <div>
            <h3 className="mb-3 font-bold text-[#FAF6F0] text-lg">{t("newsletter")}</h3>
            <form className="flex flex-col gap-2.5" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder={t("newsletterPlaceholder")} 
                className="px-4 py-3 rounded-xl bg-[#FAF6F0]/10 border border-[#FAF6F0]/20 text-[#FAF6F0] placeholder:text-[#FAF6F0]/50 focus:outline-none focus:border-[#C96745] transition-colors text-sm"
                required
              />
              <button 
                type="submit" 
                className="px-4 py-3 rounded-xl bg-[#C96745] text-white font-bold hover:bg-[#b55837] transition-colors shadow-sm text-sm min-h-[44px]"
              >
                {t("subscribe")}
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <div className="mx-auto mt-14 max-w-6xl pt-8 relative flex flex-col items-center border-t border-[#FAF6F0]/15">
        <RouteLine className="absolute -top-3 h-1 w-full max-w-md animate-route-draw opacity-40 rounded-full" />
        <p className="text-xs text-[#FAF6F0]/60 text-center font-medium">
          © 2026 {t("brandName")} — Give us your time, and we'll plan the rest.
        </p>
      </div>
    </footer>
  );
}