import React, { useEffect, useState } from "react";
import { CheckCircle2, Lock, Mail, MapPin, ShieldCheck, Sparkles, User, X, Zap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { districts } from "@/data/jeddah";

interface QuickPreset {
  id: string;
  nameAr: string;
  nameEn: string;
  email: string;
  districtAr: string;
  districtEn: string;
  emoji: string;
  avatarBg: string;
}

const quickPresets: QuickPreset[] = [
  {
    id: "p1",
    nameAr: "ابن جدة البحرية",
    nameEn: "Jeddah Local",
    email: "local@jeddaw.sa",
    districtAr: "الكورنيش",
    districtEn: "Corniche",
    emoji: "🌊",
    avatarBg: "from-[#397C78] to-[#5EAAA5]",
  },
  {
    id: "p2",
    nameAr: "عاشق القهوة والروقان",
    nameEn: "Coffee Enthusiast",
    email: "coffee@jeddaw.sa",
    districtAr: "الروضة",
    districtEn: "Al-Rawdah",
    emoji: "☕",
    avatarBg: "from-[#C96745] to-[#E4A23B]",
  },
  {
    id: "p3",
    nameAr: "مستكشف أبحر والشواطئ",
    nameEn: "Obhur Beach Lover",
    email: "obhur@jeddaw.sa",
    districtAr: "أبحر الشمالية",
    districtEn: "North Obhur",
    emoji: "🏖️",
    avatarBg: "from-[#E4A23B] to-[#C96745]",
  },
  {
    id: "p4",
    nameAr: "محب تاريخ البلد",
    nameEn: "Balad Heritage Fan",
    email: "balad@jeddaw.sa",
    districtAr: "البلد التاريخية",
    districtEn: "Al-Balad",
    emoji: "🏛️",
    avatarBg: "from-[#71805B] to-[#397C78]",
  },
];

export function AuthModal({ onClose }: { onClose: () => void }) {
  const { isRtl } = useLanguage();
  const { login, register } = useAuth();

  const [tab, setTab] = useState<"quick" | "login" | "signup">("quick");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [district, setDistrict] = useState("corniche");
  const [errorMsg, setErrorMsg] = useState("");

  // ESC key handler for backdrop dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleQuickLogin = (preset: QuickPreset) => {
    login(
      isRtl ? preset.nameAr : preset.nameEn,
      preset.email,
      isRtl ? preset.districtAr : preset.districtEn,
    );
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !email.includes("@")) {
      setErrorMsg(isRtl ? "الرجاء إدخال بريد إلكتروني صحيح." : "Please enter a valid email address.");
      return;
    }

    if (tab === "signup") {
      const res = register(name || email.split("@")[0] || email, email, password, district);
      if (!res.success) {
        setErrorMsg(res.message || (isRtl ? "فشل إنشاء الحساب." : "Registration failed."));
        return;
      }
    } else {
      login(name || email.split("@")[0] || email, email, district);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal / Sheet Container - 100% Mobile Safe with zero Radix locking */}
      <div className="relative z-10 w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-[#FAF6F0] dark:bg-[#161B1A] border border-[#E2D3BE] dark:border-white/10 shadow-2xl p-5 sm:p-7 text-[#252A28] dark:text-[#F5F1E8] max-h-[90vh] flex flex-col overflow-hidden animate-modal-in">
        
        {/* Top Handle Bar for Mobile Touch Visual */}
        <div className="w-12 h-1.5 bg-[#E2D3BE] dark:bg-white/20 rounded-full mx-auto mb-3 sm:hidden" />

        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 end-4 grid h-9 w-9 place-items-center rounded-full bg-[#F4EBDD] dark:bg-[#222826] text-[#252A28] dark:text-[#F5F1E8] hover:bg-[#C96745] hover:text-white transition-all cursor-pointer z-20 shrink-0"
          aria-label="إغلاق"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-4 pe-8">
          <div className="mx-auto mb-2 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#C96745] to-[#E4A23B] text-white shadow-md">
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#252A28] dark:text-[#F5F1E8]">
            {isRtl ? "تسجيل الدخول في جِدّاو" : "Sign In to JEDDAW"}
          </h2>
          <p className="mt-1 text-xs font-semibold text-[#6E716C] dark:text-[#B5B8B2]">
            {isRtl
              ? "احفظ خطط الويكند المفضلة واسترجعها بنقرة واحدة من أي جهاز"
              : "Save your favorite weekend plans and access them anytime"}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-3 gap-1 rounded-2xl bg-[#EADECB] dark:bg-[#222826] p-1 mb-4 text-xs font-extrabold flex-none">
          <button
            type="button"
            onClick={() => {
              setTab("quick");
              setErrorMsg("");
            }}
            className={`rounded-xl py-2.5 flex items-center justify-center gap-1 transition-all ${
              tab === "quick"
                ? "bg-white dark:bg-[#161B1A] text-[#C96745] shadow-sm font-black"
                : "text-[#6E716C] dark:text-[#B5B8B2] hover:text-[#252A28]"
            }`}
          >
            <Zap className="h-3.5 w-3.5 text-[#E4A23B]" />
            <span>{isRtl ? "بنقرة واحدة⚡" : "1-Tap ⚡"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTab("login");
              setErrorMsg("");
            }}
            className={`rounded-xl py-2.5 transition-all ${
              tab === "login"
                ? "bg-white dark:bg-[#161B1A] text-[#C96745] shadow-sm font-black"
                : "text-[#6E716C] dark:text-[#B5B8B2] hover:text-[#252A28]"
            }`}
          >
            {isRtl ? "تسجيل دخول" : "Sign In"}
          </button>

          <button
            type="button"
            onClick={() => {
              setTab("signup");
              setErrorMsg("");
            }}
            className={`rounded-xl py-2.5 transition-all ${
              tab === "signup"
                ? "bg-white dark:bg-[#161B1A] text-[#C96745] shadow-sm font-black"
                : "text-[#6E716C] dark:text-[#B5B8B2] hover:text-[#252A28]"
            }`}
          >
            {isRtl ? "حساب جديد 🎉" : "Register 🎉"}
          </button>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="mb-3 rounded-2xl bg-[#B84E4E]/15 border border-[#B84E4E]/30 p-2.5 text-xs font-bold text-[#B84E4E] text-center animate-fade-in flex-none">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Tab 1: Instant 1-Tap Quick Profiles (ZERO TYPING NEEDED FOR MOBILE) */}
        {tab === "quick" && (
          <div className="flex-1 overflow-y-auto space-y-2.5 pe-1 py-1">
            <div className="text-[11px] font-extrabold text-[#6E716C] dark:text-[#B5B8B2] mb-1">
              {isRtl ? "اختر بروفايلك السريع للدخول الفوري:" : "Select a profile for instant sign-in:"}
            </div>

            {quickPresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleQuickLogin(preset)}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-[#222826] border border-[#E2D3BE] dark:border-white/10 hover:border-[#C96745] transition-all shadow-sm active:scale-[0.98] group cursor-pointer text-start"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-11 w-11 rounded-2xl bg-gradient-to-br ${preset.avatarBg} grid place-items-center text-xl text-white shadow-md shrink-0`}
                  >
                    {preset.emoji}
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-[#252A28] dark:text-[#F5F1E8] group-hover:text-[#C96745] transition-colors">
                      {isRtl ? preset.nameAr : preset.nameEn}
                    </div>
                    <div className="text-xs font-semibold text-[#6E716C] dark:text-[#B5B8B2] flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 text-[#397C78]" />
                      <span>{isRtl ? preset.districtAr : preset.districtEn}</span>
                    </div>
                  </div>
                </div>

                <span className="rounded-full bg-[#C96745]/10 text-[#C96745] px-3 py-1 text-xs font-black group-hover:bg-[#C96745] group-hover:text-white transition-all shrink-0">
                  {isRtl ? "دخول ⚡" : "Login ⚡"}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Tab 2 & 3: Standard Custom Form */}
        {(tab === "login" || tab === "signup") && (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-3.5 pe-1 py-1">
            {tab === "signup" && (
              <div>
                <label className="block text-xs font-bold mb-1">
                  {isRtl ? "الاسم الكامل" : "Full Name"}
                </label>
                <div className="relative">
                  <User className="absolute start-3.5 top-3.5 h-4 w-4 text-[#6E716C]" />
                  <input
                    type="text"
                    inputMode="text"
                    autoComplete="name"
                    required
                    placeholder={isRtl ? "محمد العتيبي" : "John Doe"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-2xl border border-[#E2D3BE] dark:border-white/15 bg-white dark:bg-[#222826] ps-10 pe-3 py-3 text-base sm:text-xs font-semibold focus:outline-none focus:border-[#C96745]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold mb-1">
                {isRtl ? "البريد الإلكتروني" : "Email Address"}
              </label>
              <div className="relative">
                <Mail className="absolute start-3.5 top-3.5 h-4 w-4 text-[#6E716C]" />
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  dir="ltr"
                  className="w-full rounded-2xl border border-[#E2D3BE] dark:border-white/15 bg-white dark:bg-[#222826] ps-10 pe-3 py-3 text-base sm:text-xs font-semibold focus:outline-none focus:border-[#C96745] text-start"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">
                {isRtl ? "كلمة المرور" : "Password"}
              </label>
              <div className="relative">
                <Lock className="absolute start-3.5 top-3.5 h-4 w-4 text-[#6E716C]" />
                <input
                  type="password"
                  autoComplete={tab === "signup" ? "new-password" : "current-password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-[#E2D3BE] dark:border-white/15 bg-white dark:bg-[#222826] ps-10 pe-3 py-3 text-base sm:text-xs font-semibold focus:outline-none focus:border-[#C96745]"
                />
              </div>
            </div>

            {tab === "signup" && (
              <div>
                <label className="block text-xs font-bold mb-1">
                  {isRtl ? "منطقتك المفضلة في جدة" : "Preferred District"}
                </label>
                <div className="relative">
                  <MapPin className="absolute start-3.5 top-3.5 h-4 w-4 text-[#6E716C]" />
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full rounded-2xl border border-[#E2D3BE] dark:border-white/15 bg-white dark:bg-[#222826] ps-10 pe-3 py-3 text-base sm:text-xs font-semibold focus:outline-none focus:border-[#C96745]"
                  >
                    {districts.map((d) => (
                      <option key={d.id} value={d.id}>
                        {isRtl ? d.nameAr : d.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-full bg-[#C96745] py-3.5 text-xs font-extrabold text-white shadow-lift hover:bg-[#b55837] active:scale-95 transition-all min-h-[48px] mt-2 cursor-pointer"
            >
              {tab === "signup"
                ? isRtl
                  ? "إنشاء حسابي الآن 🚀"
                  : "Create Account 🚀"
                : isRtl
                ? "دخول الحساب 🔑"
                : "Sign In 🔑"}
            </button>
          </form>
        )}

        {/* Footer Security Badge */}
        <div className="mt-3 text-center flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#397C78] dark:text-[#5EAAA5] border-t border-[#E2D3BE]/60 dark:border-white/10 pt-2.5 flex-none">
          <ShieldCheck className="h-4 w-4" />
          <span>{isRtl ? "تسجيل آمن 100% ومحفوظ على جهازك" : "100% Secure & Saved locally on device"}</span>
        </div>

      </div>
    </div>
  );
}
