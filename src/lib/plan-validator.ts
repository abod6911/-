/**
 * JEDDAW Platform — Plan Validator & Automatic Repair Engine
 * File: src/lib/plan-validator.ts
 */

import { getPlace, places, type Place } from "@/data/jeddah";

export interface PlanValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  repairedAutomatically: boolean;
  repairedPlan?: any;
}

export function validateGeneratedPlan(plan: any): PlanValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let repairedAutomatically = false;

  if (!plan || !Array.isArray(plan.stops) || plan.stops.length === 0) {
    return {
      valid: false,
      errors: ["الخطة فارغة أو لا تحتوي على محطات."],
      warnings: [],
      repairedAutomatically: false,
    };
  }

  // 1. Verify every placeId exists in database places
  const validStops: any[] = [];
  const seenIds = new Set<string>();

  for (const stop of plan.stops) {
    const dbPlace = places.find((p) => p.id === stop.placeId);

    if (!dbPlace) {
      errors.push(`المكان الموصى به (${stop.placeId}) غير موجود في قاعدة بيانات جِدّاو المعتمدة.`);
      repairedAutomatically = true;
      continue;
    }

    if (seenIds.has(stop.placeId)) {
      warnings.push(`تم استبعاد المحطة المكررة (${dbPlace.nameAr}).`);
      repairedAutomatically = true;
      continue;
    }

    seenIds.add(stop.placeId);

    // Re-verify open hours at arrival time if arrival time exists
    if (stop.arrivalTime) {
      const hour = parseInt(stop.arrivalTime.split(":")[0], 10);
      if (!isNaN(hour)) {
        const isOpenAtArrival =
          dbPlace.opensAt <= dbPlace.closesAt
            ? hour >= dbPlace.opensAt && hour < dbPlace.closesAt
            : hour >= dbPlace.opensAt || hour < dbPlace.closesAt;

        if (!isOpenAtArrival) {
          warnings.push(`المكان (${dbPlace.nameAr}) يكون مغلقاً وقت الوصول (${stop.arrivalTime}).`);
        }
      }
    }

    // Re-assign accurate DB costs & duration
    validStops.push({
      ...stop,
      visitDurationMinutes: dbPlace.durationMin,
      estimatedCostMin: dbPlace.pricePerPerson,
      estimatedCostMax: Math.round(dbPlace.pricePerPerson * 1.2),
    });
  }

  if (validStops.length === 0) {
    return {
      valid: false,
      errors: ["لم يتبقَّ محطات صالحة بعد الفحص."],
      warnings,
      repairedAutomatically: false,
    };
  }

  // Re-calculate totals strictly from DB verified data
  const calcTotalCost = validStops.reduce((sum, s) => sum + s.estimatedCostMin, 0);
  const calcTotalDuration = validStops.reduce(
    (sum, s) => sum + s.visitDurationMinutes + (s.travelFromPreviousMinutes || 15),
    0
  );

  const repairedPlan = {
    ...plan,
    stops: validStops,
    totalDurationMinutes: calcTotalDuration,
    estimatedCostMin: calcTotalCost,
    estimatedCostMax: Math.round(calcTotalCost * 1.25),
    validated: true,
  };

  return {
    valid: true,
    errors: [],
    warnings,
    repairedAutomatically,
    repairedPlan,
  };
}
