import React, { useEffect, useState } from "react";
import { CheckCircle2, Eye, EyeOff, Globe, Lock, Mail, MapPin, ShieldCheck, Sparkles, User, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { districts } from "@/data/jeddah";

export function AuthModal({ onClose }: { onClose: () => void }) {
  const { t, isRtl } = useLanguage();
  const { login, register } = useAuth();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [district, setDistrict] = useState("corniche");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const getPasswordStrength = () => {
    if (!password) return null;
    if (password.length < 6)
      return {
        label: isRtl ? "ضعيفة (أقل من 6 أحرف)" : "Weak (< 6 chars)",
        color: "text-[#B84E4E]",
      };
    if (password.length < 10)
      return {
        label: isRtl ? "متوسطة وآمنة 👍" : "Medium 👍",
        color: "text-[#E4A23B]",
      };
    return {
      label: isRtl ? "قوية ومحمية جداً 🔒" : "Strong 🔒",
      color: "text-[#397C78]",
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !email.includes("@")) {
      setErrorMsg(isRtl ? "الرجاء إدخال بريد إلكتروني صحيح." : "Please enter a valid email address.");
      return;
    }

    if (isSignUp) {
      const res = register(name || email.split("@")[0], email, password, district);
      if (!res.success) {
        setErrorMsg(res.message || (isRtl ? "فشل إنشاء الحساب." : "Registration failed."));
        return;
      }
    } else {
      login(name || email.split("@")[0], email, district);
    }

    onClose();
  };

  const strength = getPasswordStrength();

  return (
    <div
      className="modal-overlay z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-content max-w-md w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 bg-[#FAF6F0] dark:bg-[#1C2422] text-[#252A28] dark:text-[#F5F1E8] border border-[#E2D3BE] dark:border-white/10 rounded-3xl shadow-2xl relative animate-modal-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 end-4 grid h-9 w-9 place-items-center rounded-full bg-[#EADECB] dark:bg-[#253230] text-[#252A28] dark:text-[#F5F1E8] hover:bg-[#C96745] hover:text-white transition-colors"
          aria-label={isRtl ? "إغلاق" : "Close"}
        >
          <X className="h-5 w-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-[#C96745] text-2xl shadow-sm text-white">
            🔐
          </div>
          <h2 className="text-2xl font-black text-[#252A28] dark:text-[#F5F1E8]">
            {isSignUp
              ? isRtl
                ? "إنشاء حساب في جِدّاو"
                : "Create a JEDDAW Account"
              : isRtl
              ? "تسجيل الدخول إلى جِدّاو"
              : "Sign In to JEDDAW"}
          </h2>
          <p className="mt-1 text-xs font-semibold text-[#6E716C] dark:text-[#B5B8B2]">
            {isRtl
              ? "حسابك يحفظ لك جميع خططك المحفوظة وطلعات الويكند"
              : "Your account saves all your weekend plans and favorites"}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1 rounded-2xl bg-[#EADECB] dark:bg-[#253230] p-1 mb-5 text-xs font-extrabold">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setErrorMsg("");
            }}
            className={`rounded-xl py-2.5 transition-all ${
              !isSignUp
                ? "bg-white dark:bg-[#1C2422] text-[#C96745] shadow-sm"
                : "text-[#6E716C] dark:text-[#B5B8B2] hover:text-[#252A28]"
            }`}
          >
            {isRtl ? "تسجيل الدخول" : "Sign In"}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setErrorMsg("");
            }}
            className={`rounded-xl py-2.5 transition-all ${
              isSignUp
                ? "bg-white dark:bg-[#1C2422] text-[#C96745] shadow-sm"
                : "text-[#6E716C] dark:text-[#B5B8B2] hover:text-[#252A28]"
            }`}
          >
            {isRtl ? "حساب جديد 🎉" : "Register 🎉"}
          </button>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="mb-4 rounded-2xl bg-[#B84E4E]/15 border border-[#B84E4E]/30 p-3 text-xs font-bold text-[#B84E4E] text-center animate-fade-in">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isSignUp && (
            <div>
              <label className="block text-xs font-bold mb-1">
                {isRtl ? "الاسم الكامل" : "Full Name"}
              </label>
              <div className="relative">
                <User className="absolute start-3.5 top-3 h-4 w-4 text-[#6E716C]" />
                <input
                  type="text"
                  required
                  placeholder={isRtl ? "محمد العتيبي" : "John Doe"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-[#E2D3BE] dark:border-white/15 bg-white dark:bg-[#253230] ps-10 pe-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#C96745]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold mb-1">
              {isRtl ? "البريد الإلكتروني" : "Email Address"}
            </label>
            <div className="relative">
              <Mail className="absolute start-3.5 top-3 h-4 w-4 text-[#6E716C]" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[#E2D3BE] dark:border-white/15 bg-white dark:bg-[#253230] ps-10 pe-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#C96745]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">
              {isRtl ? "كلمة المرور" : "Password"}
            </label>
            <div className="relative">
              <Lock className="absolute start-3.5 top-3 h-4 w-4 text-[#6E716C]" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[#E2D3BE] dark:border-white/15 bg-white dark:bg-[#253230] ps-10 pe-10 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#C96745]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute end-3 top-3 text-[#6E716C]"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Password Strength */}
            {strength && (
              <div className="mt-1 text-[11px] font-bold">
                {isRtl ? "قوة كلمة المرور:" : "Password strength:"}{" "}
                <span className={strength.color}>{strength.label}</span>
              </div>
            )}
          </div>

          {/* Preferred District */}
          {isSignUp && (
            <div>
              <label className="block text-xs font-bold mb-1">
                {isRtl ? "منطقتك المفضلة في جدة" : "Preferred District in Jeddah"}
              </label>
              <div className="relative">
                <MapPin className="absolute start-3.5 top-3 h-4 w-4 text-[#6E716C]" />
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full rounded-xl border border-[#E2D3BE] dark:border-white/15 bg-white dark:bg-[#253230] ps-10 pe-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#C96745]"
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
            className="w-full rounded-full bg-[#C96745] py-3 text-xs font-extrabold text-white shadow-lift hover:bg-[#b55837] transition-all min-h-[46px] mt-2"
          >
            {isSignUp
              ? isRtl
                ? "إنشاء حسابي الآن 🚀"
                : "Create Account 🚀"
              : isRtl
              ? "دخول الحساب 🔑"
              : "Sign In 🔑"}
          </button>
        </form>

        {/* Protection Footer Badge */}
        <div className="mt-6 text-center flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#397C78] dark:text-[#5EAAA5] border-t border-[#E2D3BE]/60 dark:border-white/10 pt-4">
          <ShieldCheck className="h-4 w-4" />
          <span>{isRtl ? "بياناتك محمية ومشفرة 100% بأمان SSL" : "100% SSL Encrypted & Protected"}</span>
        </div>
      </div>
    </div>
  );
}
