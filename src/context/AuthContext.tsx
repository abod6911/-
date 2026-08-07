import React, { createContext, useContext, useEffect, useState } from "react";
import type { GeneratedPlan } from "@/lib/planner";
import type { ReadyPlan } from "@/data/jeddah";

export type SavedPlan = GeneratedPlan | ReadyPlan;

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  district?: string;
  isGuest: boolean;
  createdAt?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  savedPlans: SavedPlan[];
  favorites: string[];
  login: (name: string, email: string, district?: string) => boolean;
  register: (name: string, email: string, password: string, district?: string) => { success: boolean; message?: string };
  logout: () => void;
  savePlan: (plan: SavedPlan) => void;
  removeSavedPlan: (planId: string) => void;
  toggleFavorite: (placeId: string) => void;
  isFavorite: (placeId: string) => boolean;
  isPlanSaved: (planId: string) => boolean;
  loginAttempts: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Input Sanitization Guard
export function sanitizeInput(str: string): string {
  return str.replace(/[<>'"/]/g, "").trim();
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loginAttempts, setLoginAttempts] = useState(0);

  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("jeddaw_user") || localStorage.getItem("wesh_user");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return { id: "guest", name: "زائر جدة", email: "guest@jeddaw.sa", district: "الكورنيش", isGuest: true };
  });

  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("jeddaw_saved_plans") || localStorage.getItem("wesh_saved_plans");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return [];
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("jeddaw_favorites") || localStorage.getItem("wesh_favorites");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem("jeddaw_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("jeddaw_user");
      }
    }
  }, [user]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("jeddaw_saved_plans", JSON.stringify(savedPlans));
    }
  }, [savedPlans]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("jeddaw_favorites", JSON.stringify(favorites));
    }
  }, [favorites]);

  const login = (name: string, email: string, district?: string): boolean => {
    const cleanName = sanitizeInput(name);
    const cleanEmail = sanitizeInput(email);

    setUser({
      id: `user_${Date.now()}`,
      name: cleanName || "عضو جِدّاو",
      email: cleanEmail,
      district: district || "جدة",
      isGuest: false,
      createdAt: new Date().toLocaleDateString("ar-SA"),
    });

    setLoginAttempts(0);
    return true;
  };

  const register = (name: string, email: string, password: string, district?: string) => {
    if (password.length < 6) {
      return { success: false, message: "كلمة المرور يجب أن لا تقل عن 6 أحرف لحماية حسابك." };
    }
    if (!email.includes("@") || !email.includes(".")) {
      return { success: false, message: "صيغة البريد الإلكتروني غير صحيحة." };
    }

    login(name, email, district);
    return { success: true };
  };

  const logout = () => {
    setUser({ id: "guest", name: "زائر جدة", email: "guest@jeddaw.sa", district: "الكورنيش", isGuest: true });
  };

  const savePlan = (plan: SavedPlan) => {
    if (!savedPlans.some((p) => p.id === plan.id)) {
      setSavedPlans((prev) => [plan, ...prev]);
    }
  };

  const removeSavedPlan = (planId: string) => {
    setSavedPlans((prev) => prev.filter((p) => p.id !== planId));
  };

  const toggleFavorite = (placeId: string) => {
    setFavorites((prev) =>
      prev.includes(placeId) ? prev.filter((id) => id !== placeId) : [...prev, placeId],
    );
  };

  const isFavorite = (placeId: string) => favorites.includes(placeId);
  const isPlanSaved = (planId: string) => savedPlans.some((p) => p.id === planId);

  return (
    <AuthContext.Provider
      value={{
        user,
        savedPlans,
        favorites,
        login,
        register,
        logout,
        savePlan,
        removeSavedPlan,
        toggleFavorite,
        isFavorite,
        isPlanSaved,
        loginAttempts,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
