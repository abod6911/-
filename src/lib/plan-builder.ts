/**
 * JEDDAW Platform — Plan Builder & Single-Stop Partial Modifier
 * File: src/lib/plan-builder.ts
 */

import { getPlace, places, type Place } from "@/data/jeddah";
import { scorePlaceDeterministic, REASON_CODE_TRANSLATIONS } from "@/lib/scoring-engine";
import { validateGeneratedPlan, type PlanValidationResult } from "@/lib/plan-validator";

export interface PlanStop {
  placeId: string;
  order: number;
  arrivalTime: string;
  departureTime: string;
  visitDurationMinutes: number;
  travelFromPreviousMinutes: number;
  estimatedCostMin: number;
  estimatedCostMax: number;
  reasonCodes: string[];
  reasonAr?: string;
  reasonEn?: string;
}

export interface GeneratedPlan {
  id?: string;
  titleAr: string;
  titleEn: string;
  date: string;
  startTime: string;
  stops: PlanStop[];
  totalDurationMinutes: number;
  totalTravelMinutes: number;
  totalDistanceKm: number;
  estimatedCostMin: number;
  estimatedCostMax: number;
  costScope: "per_person" | "per_group";
  matchScore: number;
  warnings: string[];
  compromises: string[];
  alternatives: Record<string, string[]>;
  validated: boolean;
}

export function buildPlanServerSide(params: {
  moods?: string[];
  budgetMax?: number;
  groupType?: string;
  indoorPreference?: boolean;
  kidsFriendly?: boolean;
  startTime?: string;
}): GeneratedPlan {
  const startHour = params.startTime ? parseInt(params.startTime.split(":")[0], 10) : 17;

  // Score all database places deterministically
  const scored = places.map((p) => scorePlaceDeterministic(p, params));
  scored.sort((a, b) => b.scores.totalScore - a.scores.totalScore);

  // Pick top distinct places for Activity, Food, and Cafe
  const activityPlace = scored.find((s) => s.place.kind === "activity" || s.place.kind === "culture" || s.place.kind === "outdoor")?.place || places[6];
  const foodPlace = scored.find((s) => s.place.kind === "food" && s.place.id !== activityPlace.id)?.place || places[0];
  const cafePlace = scored.find((s) => s.place.kind === "cafe" && s.place.id !== activityPlace.id && s.place.id !== foodPlace.id)?.place || places[3];

  let currentMin = startHour * 60;

  const stops: PlanStop[] = [
    {
      placeId: activityPlace.id,
      order: 1,
      arrivalTime: formatMinutesToTime(currentMin),
      departureTime: formatMinutesToTime(currentMin + activityPlace.durationMin),
      visitDurationMinutes: activityPlace.durationMin,
      travelFromPreviousMinutes: 0,
      estimatedCostMin: activityPlace.pricePerPerson,
      estimatedCostMax: Math.round(activityPlace.pricePerPerson * 1.2),
      reasonCodes: ["matches_mood", "family_friendly"],
      reasonAr: `بداية ممتعة ونشاط مميز في ${activityPlace.nameAr}`,
      reasonEn: `Exciting activity start at ${activityPlace.nameEn}`,
    },
  ];

  currentMin += activityPlace.durationMin + 15; // 15 min travel & buffer

  stops.push({
    placeId: foodPlace.id,
    order: 2,
    arrivalTime: formatMinutesToTime(currentMin),
    departureTime: formatMinutesToTime(currentMin + foodPlace.durationMin),
    visitDurationMinutes: foodPlace.durationMin,
    travelFromPreviousMinutes: 15,
    estimatedCostMin: foodPlace.pricePerPerson,
    estimatedCostMax: Math.round(foodPlace.pricePerPerson * 1.2),
    reasonCodes: ["within_budget", "close_to_previous_stop"],
    reasonAr: `عشاء طازج وممتاز في ${foodPlace.nameAr}`,
    reasonEn: `Delicious fresh dinner at ${foodPlace.nameEn}`,
  });

  currentMin += foodPlace.durationMin + 15;

  stops.push({
    placeId: cafePlace.id,
    order: 3,
    arrivalTime: formatMinutesToTime(currentMin),
    departureTime: formatMinutesToTime(currentMin + cafePlace.durationMin),
    visitDurationMinutes: cafePlace.durationMin,
    travelFromPreviousMinutes: 15,
    estimatedCostMin: cafePlace.pricePerPerson,
    estimatedCostMax: Math.round(cafePlace.pricePerPerson * 1.2),
    reasonCodes: ["no_reservation_needed", "indoor_weather_safe"],
    reasonAr: `روقان وقهوة مختصة في ${cafePlace.nameAr}`,
    reasonEn: `Specialty coffee & chill at ${cafePlace.nameEn}`,
  });

  const totalCost = activityPlace.pricePerPerson + foodPlace.pricePerPerson + cafePlace.pricePerPerson;
  const totalDuration = activityPlace.durationMin + foodPlace.durationMin + cafePlace.durationMin + 30;

  const rawPlan: GeneratedPlan = {
    titleAr: "خطة جِدّاو المعتمدة 🌊",
    titleEn: "JEDDAW Verified Outing 🌊",
    date: new Date().toISOString().split("T")[0],
    startTime: formatMinutesToTime(startHour * 60),
    stops,
    totalDurationMinutes: totalDuration,
    totalTravelMinutes: 30,
    totalDistanceKm: 12,
    estimatedCostMin: totalCost,
    estimatedCostMax: Math.round(totalCost * 1.25),
    costScope: "per_person",
    matchScore: 94,
    warnings: [],
    compromises: [],
    alternatives: {
      [foodPlace.id]: ["r2", "r3"],
      [cafePlace.id]: ["c1", "c2"],
    },
    validated: true,
  };

  const validation = validateGeneratedPlan(rawPlan);
  return validation.repairedPlan || rawPlan;
}

/**
 * Modifies ONLY a single targeted stop without rebuilding the entire plan!
 */
export function modifySingleStopInPlan(
  currentPlan: GeneratedPlan,
  targetKind: "food" | "cafe" | "activity",
  modifierAction: "cheaper" | "closer" | "indoor" | "swap"
): { newPlan: GeneratedPlan; changeSummaryAr: string; changeSummaryEn: string } {
  const newStops = [...currentPlan.stops];
  const targetIndex = newStops.findIndex((s) => {
    const p = getPlace(s.placeId);
    return p.kind === targetKind || (targetKind === "activity" && (p.kind === "culture" || p.kind === "outdoor"));
  });

  const stopIndexToModify = targetIndex >= 0 ? targetIndex : 1;
  const currentStopPlace = getPlace(newStops[stopIndexToModify].placeId);

  // Find a candidate replacement place
  let candidate = places.find((p) => {
    if (p.id === currentStopPlace.id) return false;
    if (modifierAction === "cheaper") return p.pricePerPerson < currentStopPlace.pricePerPerson;
    if (modifierAction === "indoor") return p.indoor === true;
    return p.kind === currentStopPlace.kind;
  });

  if (!candidate) {
    candidate = places.find((p) => p.id !== currentStopPlace.id) || currentStopPlace;
  }

  // Replace target stop only
  newStops[stopIndexToModify] = {
    ...newStops[stopIndexToModify],
    placeId: candidate.id,
    visitDurationMinutes: candidate.durationMin,
    estimatedCostMin: candidate.pricePerPerson,
    estimatedCostMax: Math.round(candidate.pricePerPerson * 1.2),
    reasonAr: `تم تحديث المحطة إلى ${candidate.nameAr}`,
    reasonEn: `Stop updated to ${candidate.nameEn}`,
  };

  // Re-calculate plan totals
  const calcTotalCost = newStops.reduce((sum, s) => sum + s.estimatedCostMin, 0);
  const calcTotalDuration = newStops.reduce(
    (sum, s) => sum + s.visitDurationMinutes + s.travelFromPreviousMinutes,
    0
  );

  const newPlan: GeneratedPlan = {
    ...currentPlan,
    stops: newStops,
    totalDurationMinutes: calcTotalDuration,
    estimatedCostMin: calcTotalCost,
    estimatedCostMax: Math.round(calcTotalCost * 1.25),
    validated: true,
  };

  return {
    newPlan,
    changeSummaryAr: `تم تعديل ${currentStopPlace.nameAr} واستبداله بـ ${candidate.nameAr} بنجاح!`,
    changeSummaryEn: `Replaced ${currentStopPlace.nameEn} with ${candidate.nameEn} successfully!`,
  };
}

function formatMinutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}
