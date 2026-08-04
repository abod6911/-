import { Link } from "@tanstack/react-router";
import { Globe, Menu, Moon, Sparkles, Sun, User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";

export function SiteHeader() {
  const { t, toggleLang, lang } = useLanguage();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDark = document.documentElement.classList.contains("dark");
      setDarkMode(isDark);
    }
  }, []);

  const toggleTheme = () => {
    if (typeof window !== "undefined") {
      const isDark = document.documentElement.classList.toggle("dark");
      setDarkMode(isDark);
    }
  };

  const nav = [
    { to: "/", label: t("home") },
    { to: "/plans", label: t("readyPlans") },
    { to: "/places", label: t("places") },
    { to: "/offers", label: t("offers") },
    { to: "/advertise", label: t("advertise") },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-sand/85 backdrop-blur transition-colors">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 lg:flex lg:justify-between">
        <Link to="/" className="min-w-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: "bg-mist text-navy" }}
              className="rounded-full px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-navy"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {/* Language Switcher */}
          <button
            onClick={toggleLang}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-bold transition-colors hover:border-teal"
            title="Switch language / تغيير اللغة"
          >
            <Globe className="h-3.5 w-3.5" />
            {t("langToggle")}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-full border border-border p-2 text-navy hover:border-teal transition-colors"
            title={t("themeToggle")}
          >
            {darkMode ? <Sun className="h-4 w-4 text-warning" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* User Profile / Auth */}
          {user && user.id !== "guest" ? (
            <Link
              to="/account"
              className="inline-flex items-center gap-1.5 rounded-full bg-pearl border border-border px-3 py-1.5 text-xs font-bold text-navy hover:border-teal"
            >
              <UserIcon className="h-3.5 w-3.5 text-teal" />
              <span className="max-w-[80px] truncate">{user.name}</span>
            </Link>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="hidden sm:inline-flex items-center gap-1 rounded-full border border-border bg-pearl px-3 py-1.5 text-xs font-bold text-navy hover:border-teal"
            >
              <UserIcon className="h-3.5 w-3.5" />
              {t("signIn")}
            </button>
          )}

          {/* Quick Plan CTA */}
          <Link
            to="/quick-plan"
            className="inline-flex items-center gap-2 rounded-full bg-coral px-4 py-2 text-sm font-bold text-accent-foreground shadow-soft transition-transform hover:-translate-y-0.5"
          >
            <Sparkles className="h-4 w-4" />
            {t("quickPlan")}
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="القائمة"
            aria-expanded={open}
            className="rounded-full border border-border p-2 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-pearl px-4 py-3 space-y-1 lg:hidden">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-2 text-sm font-semibold text-navy hover:bg-mist"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-border flex items-center justify-between">
            <button
              onClick={() => {
                setOpen(false);
                setShowAuth(true);
              }}
              className="inline-flex items-center gap-2 text-sm font-semibold text-teal"
            >
              <UserIcon className="h-4 w-4" />
              {user && user.id !== "guest" ? user.name : t("signIn")}
            </button>
          </div>
        </nav>
      )}

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </header>
  );
}