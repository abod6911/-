/**
 * JEDDAW Platform — User Preferences Memory with Explicit Consent & Group Profiles
 * File: src/lib/user-preferences.ts
 */

export interface SavedUserPreferences {
  consentGiven: boolean;
  usualBudgetScope?: "economy" | "balanced" | "premium";
  preferredGroupType?: string;
  preferredNeighborhoods?: string[];
  indoorPreference?: boolean;
  hasKids?: boolean;
  preferredMoods?: string[];
}

export interface GroupProfile {
  id: string;
  name: string;
  memberCount: number;
  groupType: string;
  usualBudget: number | null;
  preferredMoods: string[];
  childrenIncluded: boolean;
}

const PREF_STORAGE_KEY = "jeddaw_user_preferences_v1";

export function loadUserPreferences(): SavedUserPreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PREF_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveUserPreferencesWithConsent(prefs: SavedUserPreferences): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PREF_STORAGE_KEY, JSON.stringify({ ...prefs, consentGiven: true }));
  } catch {
    // Storage quota fallback
  }
}

export function clearUserPreferences(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PREF_STORAGE_KEY);
}

export const DEFAULT_GROUP_PROFILES: GroupProfile[] = [
  {
    id: "g1",
    name: "شلة الجامعة 🎓",
    memberCount: 4,
    groupType: "friends",
    usualBudget: 60,
    preferredMoods: ["games", "coffee", "food"],
    childrenIncluded: false,
  },
  {
    id: "g2",
    name: "العائلة 👨‍👩‍👧‍👦",
    memberCount: 5,
    groupType: "family",
    usualBudget: 90,
    preferredMoods: ["culture", "calm", "sea"],
    childrenIncluded: true,
  },
  {
    id: "g3",
    name: "زملاء العمل 💼",
    memberCount: 3,
    groupType: "coworkers",
    usualBudget: 100,
    preferredMoods: ["coffee", "calm"],
    childrenIncluded: false,
  },
];
