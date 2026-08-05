import { Link } from "@tanstack/react-router";
import { Compass, Heart, Home, Sparkles, User } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function MobileTabBar() {
  const { t } = useLanguage();

  const items = [
    { to: "/", label: t("home"), icon: Home },
    { to: "/places", label: t("places"), icon: Compass },
    { to: "/quick-plan", label: t("quickPlan"), icon: Sparkles, center: true },
    { to: "/offers", label: t("offers"), icon: Heart },
    { to: "/account", label: t("account"), icon: User },
  ] as const;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border glass-tabbar safe-area-bottom lg:hidden">
      <ul className="mx-auto flex max-w-md items-end justify-between px-3 py-2">
        {items.map(({ to, label, icon: Icon, ...rest }) => {
          const center = "center" in rest && rest.center;
          return (
            <li key={to} className="flex-1 flex justify-center">
              <Link
                to={to}
                activeProps={{ className: center ? "" : "is-active text-teal" }}
                className={
                  center
                    ? "flex -translate-y-3 flex-col items-center justify-center gap-1 rounded-full bg-gradient-to-br from-coral to-[#ff8c73] h-[56px] w-[56px] min-h-[56px] min-w-[56px] text-[11px] font-bold text-accent-foreground shadow-lift animate-pulse-glow active:scale-95 transition-transform"
                    : "flex flex-col items-center justify-center gap-1 px-2 py-1 min-h-[44px] min-w-[44px] text-[11px] font-semibold text-muted-foreground active:scale-95 transition-transform relative group"
                }
              >
                <Icon className="h-5 w-5 z-10" />
                <span className="z-10">{label}</span>
                {!center && (
                  <span className="absolute bottom-0 left-1/2 w-1 h-1 bg-teal rounded-full -translate-x-1/2 opacity-0 transition-opacity [.is-active_&]:opacity-100" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}