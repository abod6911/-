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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4 backdrop-blur-sm">
      <div className="surface-card w-full max-w-md overflow-hidden border border-border p-6 shadow-lift animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h2 className="text-xl font-bold">{t("authTitle")}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-mist transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-2 text-sm text-muted-foreground">{t("authDesc")}</p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold mb-1">{t("nameLabel")}</label>
              <div className="relative">
                <User className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  placeholder="محمد العتيبي"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-pearl ps-9 pe-3 py-2 text-sm"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold mb-1">{t("emailLabel")}</label>
            <div className="relative">
              <Mail className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-border bg-pearl ps-9 pe-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">{t("passwordLabel")}</label>
            <div className="relative">
              <Lock className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-border bg-pearl ps-9 pe-3 py-2 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-coral py-3 text-sm font-bold text-accent-foreground shadow-lift hover:opacity-90 transition-opacity"
          >
            {isSignUp ? t("signUp") : t("signIn")}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs font-semibold text-teal hover:underline"
          >
            {isSignUp ? t("alreadyHaveAccount") : t("dontHaveAccount")}
          </button>
        </div>
      </div>
    </div>
  );
}
