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
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-pearl/95 backdrop-blur lg:hidden">
      <ul className="mx-auto flex max-w-md items-end justify-between px-3 py-2">
        {items.map(({ to, label, icon: Icon, ...rest }) => {
          const center = "center" in rest && rest.center;
          return (
            <li key={to}>
              <Link
                to={to}
                activeProps={{ className: center ? "" : "text-teal" }}
                className={
                  center
                    ? "flex -translate-y-3 flex-col items-center gap-1 rounded-full bg-coral px-4 py-3 text-[11px] font-bold text-accent-foreground shadow-lift"
                    : "flex flex-col items-center gap-1 px-3 py-1 text-[11px] font-semibold text-muted-foreground"
                }
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}