import React, { createContext, useContext, useEffect, useState } from "react";
import type { GeneratedPlan } from "@/lib/planner";
import type { ReadyPlan } from "@/data/jeddah";

export type SavedPlan = GeneratedPlan | ReadyPlan;

export interface UserProfile {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: UserProfile | null;
  savedPlans: SavedPlan[];
  favorites: string[];
  login: (name: string, email: string) => void;
  logout: () => void;
  savePlan: (plan: SavedPlan) => void;
  removeSavedPlan: (planId: string) => void;
  toggleFavorite: (placeId: string) => void;
  isFavorite: (placeId: string) => boolean;
  isPlanSaved: (planId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("wesh_user");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return { id: "guest", name: "زائر جدة", email: "guest@weshalkhutta.sa" };
  });

  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("wesh_saved_plans");
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
      const saved = localStorage.getItem("wesh_favorites");
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
      if (user) localStorage.setItem("wesh_user", JSON.stringify(user));
      else localStorage.removeItem("wesh_user");
    }
  }, [user]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("wesh_saved_plans", JSON.stringify(savedPlans));
    }
  }, [savedPlans]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("wesh_favorites", JSON.stringify(favorites));
    }
  }, [favorites]);

  const login = (name: string, email: string) => {
    setUser({ id: `user_${Date.now()}`, name, email });
  };

  const logout = () => {
    setUser(null);
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
        logout,
        savePlan,
        removeSavedPlan,
        toggleFavorite,
        isFavorite,
        isPlanSaved,
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
