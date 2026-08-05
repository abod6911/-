import { Link } from "@tanstack/react-router";
import { Globe, Menu, Moon, Sparkles, Sun, User as UserIcon, X } from "lucide-react";
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("wesh_theme");
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
        setDarkMode(true);
      } else {
        const isDark = document.documentElement.classList.contains("dark");
        setDarkMode(isDark);
      }
    }
  }, []);

  const toggleTheme = () => {
    if (typeof window !== "undefined") {
      const isDark = document.documentElement.classList.toggle("dark");
      setDarkMode(isDark);
      localStorage.setItem("wesh_theme", isDark ? "dark" : "light");
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
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 glass-header border-b ${
          scrolled ? "shadow-md border-border/70" : "border-border/30"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="min-w-0">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeProps={{ className: "bg-mist text-navy font-bold" }}
                className="rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition-all hover:bg-mist/50 hover:text-navy"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2 lg:gap-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              className="group flex min-h-[44px] items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-bold transition-all hover-scale hover:border-teal hover:bg-teal/5 bg-pearl/50"
              title="Switch language / تغيير اللغة"
            >
              <Globe className="h-4 w-4 transition-transform duration-700 group-hover:rotate-180" />
              <span className="hidden sm:inline">{t("langToggle")}</span>
              <span className="sm:hidden">{lang === "ar" ? "EN" : "عربي"}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="group flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-border p-2 text-navy hover:border-teal bg-pearl/50 transition-all"
              title={t("themeToggle")}
            >
              <div className="transition-transform duration-500 group-hover:rotate-180 group-active:scale-90">
                {darkMode ? (
                  <Sun className="h-4 w-4 text-warning" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </div>
            </button>

            {/* User Profile / Auth */}
            {user && user.id !== "guest" ? (
              <Link
                to="/account"
                className="flex min-h-[44px] items-center rounded-full p-[2px] bg-gradient-to-r from-teal to-coral hover-scale transition-all"
              >
                <div className="flex h-full w-full items-center gap-2 rounded-full bg-pearl px-4 py-2">
                  <UserIcon className="h-4 w-4 text-teal" />
                  <span className="max-w-[80px] truncate text-sm font-bold text-navy hidden sm:inline">{user.name}</span>
                </div>
              </Link>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="hidden sm:flex min-h-[44px] items-center rounded-full p-[2px] bg-gradient-to-r from-border to-border hover:from-teal hover:to-coral transition-all"
              >
                <div className="flex h-full w-full items-center gap-2 rounded-full bg-pearl px-4 py-2">
                  <UserIcon className="h-4 w-4 text-navy" />
                  <span className="text-sm font-bold text-navy">{t("signIn")}</span>
                </div>
              </button>
            )}

            {/* Quick Plan CTA */}
            <Link
              to="/quick-plan"
              className="flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-coral px-4 sm:px-5 py-2 text-sm font-bold text-accent-foreground shadow-soft transition-all animate-pulse-glow hover-lift"
            >
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">{t("quickPlan")}</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="القائمة"
              aria-expanded={open}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-border bg-pearl/50 p-2 lg:hidden transition-colors hover:bg-mist"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Content */}
        {open && (
          <>
            <div 
              className="fixed inset-0 top-[76px] z-30 bg-navy/20 backdrop-blur-sm lg:hidden transition-opacity"
              onClick={() => setOpen(false)}
            />
            <nav className="absolute left-0 right-0 top-full z-40 flex flex-col border-b border-border bg-pearl/95 backdrop-blur-md px-4 py-4 shadow-lg lg:hidden animate-fade-in-down">
              {nav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-base font-bold text-navy transition-colors hover:bg-mist hover:text-teal"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-4 pt-4 border-t border-border/50">
                <button
                  onClick={() => {
                    setOpen(false);
                    setShowAuth(true);
                  }}
                  className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-mist/50 px-4 py-3 text-base font-bold text-teal transition-colors hover:bg-mist"
                >
                  <UserIcon className="h-5 w-5" />
                  {user && user.id !== "guest" ? user.name : t("signIn")}
                </button>
              </div>
            </nav>
          </>
        )}
      </header>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}