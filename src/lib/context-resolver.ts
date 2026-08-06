/**
 * JEDDAW Platform — Page Context Resolver
 * File: src/lib/context-resolver.ts
 */

export interface PageContext {
  currentRoute: string;
  currentPlaceId: string | null;
  currentPlanId: string | null;
  currentPlanVersion: string | null;
  activeFilters: Record<string, any>;
  selectedLanguage: "ar" | "en";
  currentNeighborhood: string | null;
}

export function getCurrentPageContext(): PageContext {
  let route = "/";
  if (typeof window !== "undefined") {
    route = window.location.pathname;
  }

  return {
    currentRoute: route,
    currentPlaceId: null,
    currentPlanId: null,
    currentPlanVersion: null,
    activeFilters: {},
    selectedLanguage: "ar",
    currentNeighborhood: null,
  };
}
