import { Link } from "@tanstack/react-router";
import { Logo, RouteLine } from "@/components/brand/Logo";
import { useLanguage } from "@/context/LanguageContext";
import { Instagram, Twitter } from "lucide-react";

export function SiteFooter() {
  const { t } = useLanguage();
  
  // Safe fallbacks for new translation keys
  const tSocialHeader = t("socialHeader") === "socialHeader" ? "Social Media" : t("socialHeader");
  const tNewsletter = t("newsletter") === "newsletter" ? "Newsletter" : t("newsletter");
  const tNewsletterPlaceholder = t("newsletterPlaceholder") === "newsletterPlaceholder" ? "Email Address" : t("newsletterPlaceholder");
  const tSubscribe = t("subscribe") === "subscribe" ? "Subscribe" : t("subscribe");

  return (
    <footer className="mt-20 bg-gradient-to-br from-navy to-[#1a2c4b] px-4 py-12 text-mist relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-4 relative z-10">
        <div>
          <div className="rounded-2xl bg-pearl px-3 py-2 inline-block shadow-md">
            <Logo />
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed opacity-80">
            {t("footerDesc")}
          </p>
          <p className="mt-3 text-xs opacity-60">{t("footerNote")}</p>
        </div>
        
        <div className="text-sm">
          <h2 className="mb-4 font-bold text-pearl text-lg">{t("navHeader")}</h2>
          <ul className="space-y-3 opacity-85">
            <li><Link to="/quick-plan" className="hover:text-teal transition-colors">{t("quickPlan")}</Link></li>
            <li><Link to="/plans" className="hover:text-teal transition-colors">{t("readyPlans")}</Link></li>
            <li><Link to="/places" className="hover:text-teal transition-colors">{t("places")}</Link></li>
            <li><Link to="/offers" className="hover:text-teal transition-colors">{t("offers")}</Link></li>
          </ul>
        </div>
        
        <div className="text-sm">
          <h2 className="mb-4 font-bold text-pearl text-lg">{t("businessHeader")}</h2>
          <ul className="space-y-3 opacity-85">
            <li><Link to="/advertise" className="hover:text-teal transition-colors">{t("advertise")}</Link></li>
            <li><Link to="/advertise" className="hover:text-teal transition-colors">{t("joinPartner")}</Link></li>
          </ul>
        </div>
        
        <div className="text-sm flex flex-col gap-8">
          <div>
            <h2 className="mb-4 font-bold text-pearl text-lg">{tSocialHeader}</h2>
            <div className="flex flex-wrap gap-3">
              <a href="https://twitter.com/weshalkhutta" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-full bg-mist/10 hover:bg-teal hover:text-navy transition-all font-semibold">
                <Twitter className="h-4 w-4" />
                <span>Twitter / X</span>
              </a>
              <a href="https://instagram.com/weshalkhutta" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-full bg-mist/10 hover:bg-teal hover:text-navy transition-all font-semibold">
                <Instagram className="h-4 w-4" />
                <span>Instagram</span>
              </a>
            </div>
          </div>
          <div>
            <h2 className="mb-4 font-bold text-pearl text-lg">{tNewsletter}</h2>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder={tNewsletterPlaceholder} 
                className="px-4 py-3 rounded-xl bg-mist/10 border border-mist/20 text-pearl placeholder:text-mist/50 focus:outline-none focus:border-teal transition-colors"
                required
              />
              <button 
                type="submit" 
                className="px-4 py-3 rounded-xl bg-teal text-navy font-bold hover:bg-teal/90 transition-colors shadow-sm"
              >
                {tSubscribe}
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <div className="mx-auto mt-16 max-w-6xl pt-8 relative flex flex-col items-center">
        <RouteLine className="absolute top-0 h-1 w-full max-w-md animate-route-draw opacity-40 rounded-full" />
        <p className="text-xs opacity-60 text-center">
          © 2026 {t("brandName")} — {t("footerNote")}
        </p>
      </div>
    </footer>
  );
}