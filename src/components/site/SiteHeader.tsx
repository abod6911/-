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
      const savedTheme = localStorage.getItem("jeddaw_theme") || localStorage.getItem("wesh_theme");
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
        setDarkMode(true);
      } else {
        document.documentElement.classList.remove("dark");
        setDarkMode(false);
      }
    }
  }, []);

  const toggleTheme = () => {
    if (typeof window !== "undefined") {
      const isDark = document.documentElement.classList.toggle("dark");
      setDarkMode(isDark);
      localStorage.setItem("jeddaw_theme", isDark ? "dark" : "light");
      localStorage.setItem("wesh_theme", isDark ? "dark" : "light");
    }
  };

  const nav = [
    { to: "/", label: t("home") },
    { to: "/plans", label: t("readyPlans") },
    { to: "/quick-plan", label: "خطة على السريع" },
    { to: "/places", label: "استكشف جدة 🗺️" },
    { to: "/offers", label: "عروض جدة 🔥" },
    { to: "/advertise", label: t("advertise") },
  ] as const;

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 glass-header border-b border-[#E2D3BE]/60 dark:border-white/10 ${
          scrolled ? "shadow-lg py-2.5" : "py-3.5"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="hover-scale">
            <Logo />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-6 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeProps={{ className: "text-[#C96745] font-extrabold" }}
                className="text-sm font-bold text-[#252A28] dark:text-[#F5F1E8] hover:text-[#C96745] transition-colors relative py-1"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            {/* Prominent CTA */}
            <Link
              to="/quick-plan"
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-[#C96745] px-5 py-2.5 text-xs font-extrabold text-white shadow-lift transition-all hover:bg-[#b55837] animate-pulse-glow min-h-[44px]"
            >
              <Sparkles className="h-4 w-4" />
              <span>{t("quickPlan")}</span>
            </Link>

            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#E2D3BE] dark:border-white/15 bg-[#FAF6F0] dark:bg-[#222826] px-3.5 py-2 text-xs font-bold text-[#252A28] dark:text-[#F5F1E8] hover:border-[#C96745] transition-all min-h-[44px]"
            >
              <Globe className="h-4 w-4 text-[#397C78] dark:text-[#5EAAA5]" />
              <span>{lang === "ar" ? "EN" : "عربي"}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-full border border-[#E2D3BE] dark:border-white/15 bg-[#FAF6F0] dark:bg-[#222826] p-2.5 text-[#252A28] dark:text-[#F5F1E8] hover:border-[#C96745] transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="تغيير الثيم"
            >
              {darkMode ? <Sun className="h-4 w-4 text-[#E4A23B]" /> : <Moon className="h-4 w-4 text-[#397C78]" />}
            </button>

            {/* User Button */}
            {user && user.id !== "guest" ? (
              <Link
                to="/account"
                className="inline-flex items-center gap-2 rounded-full bg-[#397C78] px-4 py-2 text-xs font-bold text-white min-h-[44px]"
              >
                <UserIcon className="h-4 w-4" />
                <span className="max-w-[100px] truncate">{user.name}</span>
              </Link>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[#C96745] px-4 py-2 text-xs font-bold text-[#C96745] hover:bg-[#C96745] hover:text-white transition-all min-h-[44px]"
              >
                <UserIcon className="h-4 w-4" />
                <span>{t("signIn")}</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setOpen(!open)}
              className="rounded-xl border border-[#E2D3BE] dark:border-white/15 bg-[#FAF6F0] dark:bg-[#222826] p-2.5 text-[#252A28] dark:text-[#F5F1E8] lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="القائمة"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {open && (
          <div className="border-t border-[#E2D3BE] dark:border-white/10 bg-[#FAF6F0] dark:bg-[#161B1A] px-4 py-4 lg:hidden animate-fade-in-down">
            <nav className="flex flex-col gap-2.5">
              {nav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-base font-bold text-[#252A28] dark:text-[#F5F1E8] hover:bg-[#F4EBDD] dark:hover:bg-[#222826]"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/quick-plan"
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 rounded-full bg-[#C96745] py-3.5 text-center text-sm font-extrabold text-white shadow-lift"
              >
                <Sparkles className="h-4 w-4" />
                {t("quickPlan")}
              </Link>
            </nav>
          </div>
        )}
      </header>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}