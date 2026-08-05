import React, { useState } from "react";
import { Lock, Mail, User, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export function AuthModal({ onClose }: { onClose: () => void }) {
  const { t } = useLanguage();
  const { login } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const displayName = isSignUp && name ? name : email.split("@")[0];
    login(displayName, email);
    onClose();
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-content animate-modal-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h2 className="text-xl font-bold">{t("authTitle")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("authDesc")}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-mist transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="mt-4 grid grid-cols-2 gap-1 rounded-xl bg-mist p-1">
          <button
            type="button"
            onClick={() => setIsSignUp(false)}
            className={`rounded-lg py-2.5 text-sm font-bold transition-all ${
              !isSignUp ? "bg-pearl text-navy shadow-soft" : "text-muted-foreground hover:text-navy"
            }`}
          >
            {t("signIn")}
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp(true)}
            className={`rounded-lg py-2.5 text-sm font-bold transition-all ${
              isSignUp ? "bg-pearl text-navy shadow-soft" : "text-muted-foreground hover:text-navy"
            }`}
          >
            {t("signUp")}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {isSignUp && (
            <div className="animate-fade-in">
              <label className="block text-xs font-semibold mb-1.5">{t("nameLabel")}</label>
              <div className="relative">
                <User className="absolute start-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  placeholder="محمد العتيبي"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-pearl ps-10 pe-3 py-3 text-sm transition-all focus:border-teal focus:ring-2 focus:ring-teal/15 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold mb-1.5">{t("emailLabel")}</label>
            <div className="relative">
              <Mail className="absolute start-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-border bg-pearl ps-10 pe-3 py-3 text-sm transition-all focus:border-teal focus:ring-2 focus:ring-teal/15 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5">{t("passwordLabel")}</label>
            <div className="relative">
              <Lock className="absolute start-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-border bg-pearl ps-10 pe-3 py-3 text-sm transition-all focus:border-teal focus:ring-2 focus:ring-teal/15 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-coral py-3.5 text-sm font-bold text-accent-foreground shadow-lift transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-15px_oklch(0.706_0.166_33.4/0.5)] active:scale-[0.98]"
          >
            {isSignUp ? t("signUp") : t("signIn")}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs font-semibold text-teal hover:underline underline-offset-4"
          >
            {isSignUp ? t("alreadyHaveAccount") : t("dontHaveAccount")}
          </button>
        </div>
      </div>
    </div>
  );
}
