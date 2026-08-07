import { Link } from "@tanstack/react-router";
import { Bookmark, Compass, Home, Sparkles, User } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function MobileTabBar() {
  const { t } = useLanguage();

  const items = [
    { to: "/", label: t("home"), icon: Home },
    { to: "/places", label: "استكشف", icon: Compass },
    { to: "/quick-plan", label: "خطتك", icon: Sparkles, center: true },
    { to: "/plans", label: "المحفوظات", icon: Bookmark },
    { to: "/account", label: t("account"), icon: User },
  ] as const;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E2D3BE] glass-tabbar safe-area-bottom lg:hidden">
      <ul className="mx-auto flex max-w-md items-end justify-between px-3 py-2">
        {items.map(({ to, label, icon: Icon, ...rest }) => {
          const center = "center" in rest && rest.center;
          return (
            <li key={to} className="flex-1 flex justify-center">
              <Link
                to={to}
                activeProps={{ className: center ? "" : "is-active text-[#C96745]" }}
                className={
                  center
                    ? "flex -translate-y-2.5 flex-col items-center justify-center gap-0.5 rounded-full bg-gradient-to-r from-[#C96745] to-[#B84E4E] h-[50px] w-[50px] text-[10px] font-black text-white shadow-lift active:scale-95 transition-transform shrink-0"
                    : "flex flex-col items-center justify-center gap-0.5 px-1.5 py-1 text-[10px] font-bold text-[#6E716C] dark:text-[#B5B8B2] active:scale-95 transition-transform relative group"
                }
              >
                <Icon className={center ? "h-4.5 w-4.5 z-10" : "h-4.5 w-4.5 z-10"} />
                <span className="z-10 tracking-tight">{label}</span>
                {!center && (
                  <span className="absolute bottom-0 left-1/2 w-1.5 h-1.5 bg-[#C96745] rounded-full -translate-x-1/2 opacity-0 transition-opacity [.is-active_&]:opacity-100" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}