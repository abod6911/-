/**
 * JEDDAW Platform — 100-Point Deterministic Scoring Engine
 * File: src/lib/scoring-engine.ts
 */

import { type Place } from "@/data/jeddah";

export interface ScoreBreakdown {
  moodScore: number;       // Max 25
  distanceScore: number;   // Max 20
  budgetScore: number;     // Max 20
  groupScore: number;      // Max 15
  ratingScore: number;     // Max 10
  freshnessScore: number;  // Max 5
  convenienceScore: number;// Max 5
  totalScore: number;      // Max 100
  reasonCodes: string[];
}

export interface PlaceScoreResult {
  place: Place;
  scores: ScoreBreakdown;
}

export function scorePlaceDeterministic(
  place: Place,
  requestParams: {
    moods?: string[];
    budgetMax?: number;
    groupType?: string;
    targetDistrictId?: string;
    indoorPreference?: boolean;
    kidsFriendly?: boolean;
  }
): PlaceScoreResult {
  const reasonCodes: string[] = [];

  // 1. Mood Score (Max 25)
  let moodScore = 0;
  if (requestParams.moods && requestParams.moods.length > 0) {
    const matches = requestParams.moods.filter((m) => place.moods.includes(m as any));
    if (matches.length > 0) {
      moodScore = 25;
      reasonCodes.push("matches_mood");
    }
  } else {
    moodScore = 15; // default fallback mood score
  }

  // 2. Distance & Location Match Score (Max 20)
  let distanceScore = 10;
  if (requestParams.targetDistrictId) {
    if (place.districtId === requestParams.targetDistrictId) {
      distanceScore = 20;
      reasonCodes.push("close_to_previous_stop");
    }
  } else {
    distanceScore = 15;
  }

  // 3. Budget Fit Score (Max 20)
  let budgetScore = 15;
  if (requestParams.budgetMax && requestParams.budgetMax > 0) {
    if (place.pricePerPerson <= requestParams.budgetMax) {
      budgetScore = 20;
      reasonCodes.push("within_budget");
    } else if (place.pricePerPerson <= requestParams.budgetMax * 1.15) {
      budgetScore = 10;
    } else {
      budgetScore = 0;
    }
  } else {
    if (place.pricePerPerson <= 100) {
      budgetScore = 20;
      reasonCodes.push("within_budget");
    }
  }

  // 4. Group Suitability Score (Max 15)
  let groupScore = 10;
  if (requestParams.groupType && place.groups.includes(requestParams.groupType as any)) {
    groupScore = 15;
    reasonCodes.push("suitable_for_group");
  }
  if (requestParams.kidsFriendly && place.kidsFriendly) {
    reasonCodes.push("family_friendly");
  }

  // 5. Rating Score (Max 10)
  const ratingScore = Math.min(10, Math.round((place.rating || 4.5) * 2));
  if ((place.rating || 4.5) >= 4.8) {
    reasonCodes.push("high_reliable_rating");
  }

  // 6. Data Freshness & Verification Score (Max 5)
  const freshnessScore = place.verified ? 5 : 3;

  // 7. Convenience Score (Parking & Reservation) (Max 5)
  let convenienceScore = 3;
  if (!place.reservation) {
    convenienceScore += 2;
    reasonCodes.push("no_reservation_needed");
  }
  if (requestParams.indoorPreference && place.indoor) {
    reasonCodes.push("indoor_weather_safe");
  }

  // Small deterministic jitter (0-3 pts) based on place ID to ensure variety among close scores
  const jitter = (place.id.charCodeAt(place.id.length - 1) % 3);

  const totalScore = Math.min(
    100,
    moodScore + distanceScore + budgetScore + groupScore + ratingScore + freshnessScore + convenienceScore + jitter
  );

  return {
    place,
    scores: {
      moodScore,
      distanceScore,
      budgetScore,
      groupScore,
      ratingScore,
      freshnessScore,
      convenienceScore,
      totalScore,
      reasonCodes,
    },
  };
}

export const REASON_CODE_TRANSLATIONS: Record<string, { ar: string; en: string }> = {
  close_to_previous_stop: { ar: "موقع قريب ومتميز بين المحطات", en: "Convenient location close to stops" },
  within_budget: { ar: "يناسب ميزانيتك المحددة تماماً", en: "Fits your budget perfectly" },
  open_at_arrival: { ar: "مفتوح ومستعد لاستقبالك عند الوصول", en: "Open at your arrival time" },
  matches_mood: { ar: "يطابق الجو والمود المطلوب بالضبط", en: "Matches requested mood & vibe" },
  suitable_for_group: { ar: "مناسب ومريح لنوع مجموعتكم", en: "Ideal for your group type" },
  family_friendly: { ar: "يناسب الأطفال والعائلات", en: "Family & kid friendly" },
  no_reservation_needed: { ar: "سهل الدخول ولا يحتاج حجز مسبق", en: "Easy entry, no advance booking needed" },
  indoor_weather_safe: { ar: "مكان داخلي مكيف ومناسب للطقس", en: "Indoor air-conditioned & weather safe" },
  high_reliable_rating: { ar: "تقييم عالي وموثق من الزوار", en: "High verified visitor rating" },
};
