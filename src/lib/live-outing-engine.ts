import { getPlace, places, type Place } from "@/data/jeddah";

export interface OutingStopProgress {
  placeId: string;
  place: Place;
  status: "pending" | "current" | "arrived" | "skipped" | "replaced";
  estimatedArrival: string; // e.g. "07:30 PM"
  actualArrival?: string;
  durationMin: number;
  cost: number;
  replacementReason?: string;
}

export interface LiveOutingState {
  id: string;
  titleAr: string;
  titleEn: string;
  startedAt: string; // e.g. "07:00 PM"
  stops: OutingStopProgress[];
  currentStopIndex: number;
  totalBudget: number;
  spentBudget: number;
  remainingMinutes: number;
  status: "active" | "completed" | "cancelled";
  lastNotificationMessageAr?: string;
  lastNotificationMessageEn?: string;
}

/**
 * Initialize a new Live Outing from a set of place IDs or a ReadyPlan
 */
export function createLiveOuting(
  titleAr: string,
  titleEn: string,
  placeIds: string[],
  startHour: number = 19
): LiveOutingState {
  let currentTimeMinutes = startHour * 60; // e.g. 19:00 = 1140 min
  let spentBudget = 0;
  let totalMin = 0;

  const stops: OutingStopProgress[] = placeIds.map((id, index) => {
    const p = getPlace(id);
    const arrivalHour = Math.floor(currentTimeMinutes / 60);
    const arrivalMin = currentTimeMinutes % 60;
    const formattedArrival = formatTimeString(arrivalHour, arrivalMin);

    spentBudget += p.pricePerPerson;
    totalMin += p.durationMin + 20; // 20 min transit
    currentTimeMinutes += p.durationMin + 20;

    return {
      placeId: p.id,
      place: p,
      status: index === 0 ? "current" : "pending",
      estimatedArrival: formattedArrival,
      durationMin: p.durationMin,
      cost: p.pricePerPerson,
    };
  });

  return {
    id: `outing-${Date.now()}`,
    titleAr: titleAr || "طلعة جدة المباشرة",
    titleEn: titleEn || "Live Jeddah Outing",
    startedAt: formatTimeString(startHour, 0),
    stops,
    currentStopIndex: 0,
    totalBudget: spentBudget,
    spentBudget: stops[0]?.cost || 0,
    remainingMinutes: totalMin,
    status: "active",
  };
}

/**
 * Action 1: Mark Arrived at current stop
 */
export function markStopArrived(state: LiveOutingState): LiveOutingState {
  const nextStops = [...state.stops];
  const current = nextStops[state.currentStopIndex];

  if (!current) return state;

  current.status = "arrived";
  const now = new Date();
  current.actualArrival = formatTimeString(now.getHours(), now.getMinutes());

  const nextIndex = state.currentStopIndex + 1;
  if (nextIndex < nextStops.length) {
    nextStops[nextIndex]!.status = "current";
    return {
      ...state,
      stops: nextStops,
      currentStopIndex: nextIndex,
      spentBudget: state.spentBudget + (nextStops[nextIndex]?.cost || 0),
      lastNotificationMessageAr: `وصلتم بحمد الله إلى (${current.place.nameAr})! المحطة التالية: (${nextStops[nextIndex]?.place.nameAr})`,
      lastNotificationMessageEn: `Arrived at (${current.place.nameEn})! Next stop: (${nextStops[nextIndex]?.place.nameEn})`,
    };
  }

  return {
    ...state,
    stops: nextStops,
    status: "completed",
    lastNotificationMessageAr: "اكتملت الطلعة بنجاح! نتمنى لكم أوقاتاً ممتعة مع جِدّاو 🎉",
    lastNotificationMessageEn: "Outing completed successfully! Enjoy your time with JEDDAW 🎉",
  };
}

/**
 * Action 2: Skip current stop
 */
export function skipCurrentStop(state: LiveOutingState): LiveOutingState {
  const nextStops = [...state.stops];
  const current = nextStops[state.currentStopIndex];

  if (!current) return state;

  current.status = "skipped";
  const nextIndex = state.currentStopIndex + 1;

  if (nextIndex < nextStops.length) {
    nextStops[nextIndex]!.status = "current";
  }

  const recalculated = recalculateSchedule(nextStops, nextIndex);

  return {
    ...state,
    stops: recalculated,
    currentStopIndex: nextIndex < nextStops.length ? nextIndex : state.currentStopIndex,
    status: nextIndex >= nextStops.length ? "completed" : "active",
    lastNotificationMessageAr: `تم تخطي (${current.place.nameAr}) وإعادة توقيت باقي المحطات.`,
    lastNotificationMessageEn: `Skipped (${current.place.nameEn}) and updated schedule.`,
  };
}

/**
 * Action 3: Handle Closed Place (المكان مغلق)
 * Finds a nearby open replacement place of same kind/category without changing the rest of the plan!
 */
export function handleClosedPlace(state: LiveOutingState): LiveOutingState {
  const current = state.stops[state.currentStopIndex];
  if (!current) return state;

  const currentPlace = current.place;
  // Find replacement in same district or nearby with same kind
  const candidates = places.filter(
    (p) =>
      p.id !== currentPlace.id &&
      (p.kind === currentPlace.kind || p.categoryAr === currentPlace.categoryAr) &&
      !state.stops.some((s) => s.placeId === p.id)
  );

  const replacement = candidates[0] || places.find((p) => p.id !== currentPlace.id) || currentPlace;

  const nextStops = [...state.stops];
  nextStops[state.currentStopIndex] = {
    ...current,
    placeId: replacement.id,
    place: replacement,
    status: "current",
    cost: replacement.pricePerPerson,
    durationMin: replacement.durationMin,
    replacementReason: `تم استبدال المكان المغلق ببديل قريب ممتاز (${replacement.nameAr})`,
  };

  const recalculated = recalculateSchedule(nextStops, state.currentStopIndex);

  return {
    ...state,
    stops: recalculated,
    lastNotificationMessageAr: `المكان مغلق؟ لا تشيل هم! تم اختيار بديل قريب ممتاز: (${replacement.nameAr}) وتعديل المواعيد.`,
    lastNotificationMessageEn: `Spot closed? Replaced with nearby spot: (${replacement.nameEn}) and updated ETA.`,
  };
}

/**
 * Action 4: Handle Crowded Place (المكان مزدحم)
 * Replaces current stop with a low-crowd alternative nearby
 */
export function handleCrowdedPlace(state: LiveOutingState): LiveOutingState {
  const current = state.stops[state.currentStopIndex];
  if (!current) return state;

  const currentPlace = current.place;
  const candidates = places.filter(
    (p) =>
      p.id !== currentPlace.id &&
      (p.kind === currentPlace.kind || p.moods.includes("calm")) &&
      !p.trending &&
      !state.stops.some((s) => s.placeId === p.id)
  );

  const replacement = candidates[0] || currentPlace;

  const nextStops = [...state.stops];
  nextStops[state.currentStopIndex] = {
    ...current,
    placeId: replacement.id,
    place: replacement,
    status: "current",
    cost: replacement.pricePerPerson,
    durationMin: replacement.durationMin,
    replacementReason: `مراعاتاً للازدحام: اخترنا لكم مكان رايق وهادئ (${replacement.nameAr})`,
  };

  const recalculated = recalculateSchedule(nextStops, state.currentStopIndex);

  return {
    ...state,
    stops: recalculated,
    lastNotificationMessageAr: `لتجنب الزحمة، تم اختيار مكان هادئ ورايق: (${replacement.nameAr}).`,
    lastNotificationMessageEn: `To avoid crowd, switched to a relaxed spot: (${replacement.nameEn}).`,
  };
}

/**
 * Helper: Recalculate estimated arrival times for remaining stops
 */
function recalculateSchedule(stops: OutingStopProgress[], startIndex: number): OutingStopProgress[] {
  let currentTimeMinutes = 19 * 60; // 19:00 default start
  const now = new Date();
  currentTimeMinutes = now.getHours() * 60 + now.getMinutes();

  return stops.map((stop, index) => {
    if (index < startIndex) return stop;

    const arrivalHour = Math.floor(currentTimeMinutes / 60) % 24;
    const arrivalMin = currentTimeMinutes % 60;

    const updatedStop = {
      ...stop,
      estimatedArrival: formatTimeString(arrivalHour, arrivalMin),
    };

    currentTimeMinutes += stop.durationMin + 20;
    return updatedStop;
  });
}

function formatTimeString(hour: number, minute: number): string {
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  const period = hour >= 12 ? "م" : "ص";
  const minStr = minute < 10 ? `0${minute}` : `${minute}`;
  return `${h12}:${minStr} ${period}`;
}
