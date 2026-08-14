import React, { memo, useCallback, useEffect, useRef, useState, useTransition } from "react";
import { Lock, Mail, MapPin, ShieldCheck, User, X, Zap } from "lucide-react";
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

export const AuthModal = memo(function AuthModal({ onClose }: { onClose: () => void }) {
  const { isRtl } = useLanguage();
  const { login, register } = useAuth();
  const [, startTransition] = useTransition();

  const [tab, setTab] = useState<"quick" | "login" | "signup">("quick");
  const [errorMsg, setErrorMsg] = useState("");

  // Uncontrolled input refs to prevent synchronous React re-renders on keystrokes
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const districtSelectRef = useRef<HTMLSelectElement>(null);

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

  const handleQuickLogin = useCallback((preset: QuickPreset) => {
    login(
      isRtl ? preset.nameAr : preset.nameEn,
      preset.email,
      isRtl ? preset.districtAr : preset.districtEn,
    );
    onClose();
  }, [isRtl, login, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const nameVal = nameInputRef.current?.value.trim() || "";
    const emailVal = emailInputRef.current?.value.trim().toLowerCase() || "";
    const passVal = passwordInputRef.current?.value || "";
    const distVal = districtSelectRef.current?.value || "corniche";

    if (!emailVal || !emailVal.includes("@")) {
      setErrorMsg(isRtl ? "الرجاء إدخال بريد إلكتروني صحيح." : "Please enter a valid email address.");
      return;
    }

    if (tab === "signup") {
      const res = register(nameVal || emailVal.split("@")[0] || emailVal, emailVal, passVal, distVal);
      if (!res.success) {
        setErrorMsg(res.message || (isRtl ? "فشل إنشاء الحساب." : "Registration failed."));
        return;
      }
    } else {
      login(nameVal || emailVal.split("@")[0] || emailVal, emailVal, distVal);
    }

    onClose();
  };

  const appendEmailDomain = (domain: string) => {
    if (emailInputRef.current) {
      const current = emailInputRef.current.value.split("@")[0] || "";
      emailInputRef.current.value = current + domain;
      emailInputRef.current.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Opaque Solid Backdrop (No heavy blur to prevent WebKit GPU drops) */}
      <div
        className="fixed inset-0 bg-black/80 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Stable Mobile Modal Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-md rounded-3xl bg-[#141B2D] border-2 border-[#C96745] shadow-2xl p-5 sm:p-6 text-[#F8FAFC] my-auto flex flex-col gap-4"
        style={{
          transform: "translateZ(0)",
          WebkitTransform: "translateZ(0)",
          backfaceVisibility: "hidden",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 end-4 grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white hover:bg-[#C96745] transition-colors cursor-pointer z-20"
          aria-label="إغلاق"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center pe-6">
          <div className="mx-auto mb-2 grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#C96745] to-[#E4A23B] text-white shadow-md">
            <Lock className="h-5 w-5" />
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white">
            {isRtl ? "تسجيل الدخول في جِدّاو" : "Sign In to JEDDAW"}
          </h2>
          <p className="mt-0.5 text-xs font-semibold text-[#94A3B8]">
            {isRtl
              ? "احفظ خطط الويكند المفضلة واسترجعها بنقرة واحدة"
              : "Save your favorite plans and access them anytime"}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-3 gap-1 rounded-2xl bg-[#0B0F19] p-1 text-xs font-extrabold">
          <button
            type="button"
            onClick={() => {
              startTransition(() => {
                setTab("quick");
                setErrorMsg("");
              });
            }}
            className={`rounded-xl py-2.5 flex items-center justify-center gap-1 transition-colors ${
              tab === "quick"
                ? "bg-[#C96745] text-white shadow-md font-black"
                : "text-[#94A3B8] hover:text-white"
            }`}
          >
            <Zap className="h-3.5 w-3.5 text-[#E4A23B]" />
            <span>{isRtl ? "بنقرة واحدة⚡" : "1-Tap ⚡"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              startTransition(() => {
                setTab("login");
                setErrorMsg("");
              });
            }}
            className={`rounded-xl py-2.5 transition-colors ${
              tab === "login"
                ? "bg-[#C96745] text-white shadow-md font-black"
                : "text-[#94A3B8] hover:text-white"
            }`}
          >
            {isRtl ? "تسجيل دخول" : "Sign In"}
          </button>

          <button
            type="button"
            onClick={() => {
              startTransition(() => {
                setTab("signup");
                setErrorMsg("");
              });
            }}
            className={`rounded-xl py-2.5 transition-colors ${
              tab === "signup"
                ? "bg-[#C96745] text-white shadow-md font-black"
                : "text-[#94A3B8] hover:text-white"
            }`}
          >
            {isRtl ? "حساب جديد 🎉" : "Register 🎉"}
          </button>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="rounded-2xl bg-[#EF4444]/15 border border-[#EF4444]/30 p-2.5 text-xs font-bold text-[#EF4444] text-center">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Tab 1: Instant 1-Tap Quick Profiles */}
        {tab === "quick" && (
          <div className="space-y-2 py-1 max-h-[280px] overflow-y-auto">
            <div className="text-[11px] font-extrabold text-[#94A3B8] mb-1">
              {isRtl ? "اختر بروفايلك السريع للدخول الفوري:" : "Select a profile for instant sign-in:"}
            </div>

            {quickPresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleQuickLogin(preset)}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#0B0F19] border border-[#232E4A] hover:border-[#C96745] transition-colors shadow-sm active:scale-[0.98] group cursor-pointer text-start"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-2xl bg-gradient-to-br ${preset.avatarBg} grid place-items-center text-lg text-white shadow-md shrink-0`}
                  >
                    {preset.emoji}
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-extrabold text-white group-hover:text-[#C96745] transition-colors">
                      {isRtl ? preset.nameAr : preset.nameEn}
                    </div>
                    <div className="text-[11px] font-semibold text-[#94A3B8] flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 text-[#38BDF8]" />
                      <span>{isRtl ? preset.districtAr : preset.districtEn}</span>
                    </div>
                  </div>
                </div>

                <span className="rounded-full bg-[#C96745]/20 text-[#FF9D7A] px-3 py-1 text-xs font-black group-hover:bg-[#C96745] group-hover:text-white transition-colors shrink-0">
                  {isRtl ? "دخول ⚡" : "Login ⚡"}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Tab 2 & 3: Direct Zero-Reflow Form */}
        {(tab === "login" || tab === "signup") && (
          <form onSubmit={handleSubmit} className="space-y-3 py-1">
            {tab === "signup" && (
              <div>
                <label className="block text-xs font-bold mb-1 text-[#94A3B8]">
                  {isRtl ? "الاسم الكامل" : "Full Name"}
                </label>
                <div className="relative flex items-center">
                  <User className="absolute start-3.5 h-4 w-4 text-[#94A3B8] pointer-events-none" />
                  <input
                    ref={nameInputRef}
                    type="text"
                    inputMode="text"
                    dir="auto"
                    autoComplete="one-time-code"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    placeholder={isRtl ? "محمد العتيبي" : "John Doe"}
                    className="w-full rounded-2xl border-2 border-[#232E4A] focus:border-[#C96745] bg-[#0B0F19] text-white ps-10 pe-4 py-3 text-base font-semibold focus:outline-none min-h-[48px] [touch-action:manipulation]"
                    style={{ fontSize: "16px !important" }}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold mb-1 text-[#94A3B8]">
                {isRtl ? "البريد الإلكتروني" : "Email Address"}
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute start-3.5 h-4 w-4 text-[#94A3B8] pointer-events-none" />
                <input
                  ref={emailInputRef}
                  type="text"
                  inputMode="email"
                  dir="ltr"
                  required
                  autoComplete="one-time-code"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  placeholder="name@example.com"
                  className="w-full rounded-2xl border-2 border-[#232E4A] focus:border-[#C96745] bg-[#0B0F19] text-white ps-10 pe-4 py-3 text-base font-semibold focus:outline-none min-h-[48px] [touch-action:manipulation]"
                  style={{ fontSize: "16px !important" }}
                />
              </div>
              {/* Quick Email Suggestion Pills (1-Tap Completion) */}
              <div className="flex gap-1.5 mt-1.5 overflow-x-auto pb-1">
                {["@gmail.com", "@hotmail.com", "@icloud.com"].map((domain) => (
                  <button
                    key={domain}
                    type="button"
                    onClick={() => appendEmailDomain(domain)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#C96745] text-[10px] font-bold text-[#94A3B8] hover:text-white border border-[#232E4A] transition-colors shrink-0 cursor-pointer"
                  >
                    {domain}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-[#94A3B8]">
                {isRtl ? "كلمة المرور" : "Password"}
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute start-3.5 h-4 w-4 text-[#94A3B8] pointer-events-none" />
                <input
                  ref={passwordInputRef}
                  type="password"
                  required
                  autoComplete="one-time-code"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border-2 border-[#232E4A] focus:border-[#C96745] bg-[#0B0F19] text-white ps-10 pe-4 py-3 text-base font-semibold focus:outline-none min-h-[48px] [touch-action:manipulation]"
                  style={{ fontSize: "16px !important" }}
                />
              </div>
            </div>

            {tab === "signup" && (
              <div>
                <label className="block text-xs font-bold mb-1 text-[#94A3B8]">
                  {isRtl ? "منطقتك المفضلة في جدة" : "Preferred District"}
                </label>
                <div className="relative">
                  <MapPin className="absolute start-3.5 top-3.5 h-4 w-4 text-[#94A3B8] pointer-events-none z-10" />
                  <select
                    ref={districtSelectRef}
                    defaultValue="corniche"
                    className="w-full rounded-2xl border-2 border-[#232E4A] focus:border-[#C96745] bg-[#0B0F19] text-white ps-10 pe-3 py-3 text-base font-semibold focus:outline-none min-h-[48px]"
                    style={{ fontSize: "16px !important" }}
                  >
                    {districts.map((d) => (
                      <option key={d.id} value={d.id} className="bg-[#141B2D] text-white">
                        {isRtl ? d.nameAr : d.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-[#C96745] to-[#E4A23B] py-3.5 text-xs font-extrabold text-white shadow-lg active:scale-95 transition-all min-h-[48px] mt-2 cursor-pointer"
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
        <div className="text-center flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#38BDF8] border-t border-[#232E4A] pt-3">
          <ShieldCheck className="h-4 w-4" />
          <span>{isRtl ? "تسجيل آمن 100% ومحفوظ على جهازك" : "100% Secure & Saved locally on device"}</span>
        </div>
      </div>
    </div>
  );
});
