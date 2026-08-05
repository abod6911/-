import {
  distanceKm,
  districts,
  getDistrict,
  places,
  travelMinutes,
  type BudgetLevel,
  type GroupType,
  type Mood,
  type Place,
} from "@/data/jeddah";

export interface PlanRequest {
  districtId: string | null;
  group: GroupType;
  groupSize: number;
  durationMin: number;
  moods: Mood[];
  environment: "indoor" | "outdoor" | "any";
  budgetLevel: BudgetLevel;
  budgetPerPerson?: number | null;
  prefs: string[];
  startHour: number;
}

export interface PlanStop {
  place: Place;
  startMinutes: number;
  travelFromPrev: number;
  alternative?: Place | undefined;
}

export type PlanFlavor = "nearest" | "balanced" | "premium";

export interface GeneratedPlan {
  id: string;
  flavor: PlanFlavor;
  titleAr: string;
  subtitleAr: string;
  stops: PlanStop[];
  pricePerPerson: number;
  totalPrice: number;
  durationMin: number;
  travelMin: number;
  distanceKm: number;
  indoorOnly: boolean;
  needsReservation: boolean;
  verified: boolean;
  confidence: number;
}

export const WEIGHTS = {
  mood: 0.25,
  budget: 0.2,
  distance: 0.15,
  verified: 0.15,
  time: 0.1,
  variety: 0.1,
  freshness: 0.05,
};

function budgetCap(req: PlanRequest) {
  if (req.budgetPerPerson && req.budgetPerPerson > 0) return req.budgetPerPerson;
  return { economy: 100, balanced: 250, premium: 900 }[req.budgetLevel];
}

function passesHardFilters(place: Place, req: PlanRequest, cap: number) {
  if (place.pricePerPerson > cap) return false;
  if (req.environment === "indoor" && !place.indoor) return false;
  if (req.environment === "outdoor" && place.indoor) return false;
  if (!place.groups.includes(req.group)) return false;
  if (req.prefs.includes("kids") && !place.kidsFriendly) return false;
  if (req.prefs.includes("accessible") && !place.accessible) return false;
  if (req.prefs.includes("noReservation") && place.reservation) return false;
  if (req.prefs.includes("noOutdoor") && !place.indoor) return false;
  // opening hours: must be open at the intended start hour
  if (place.closesAt - 1 <= req.startHour || place.opensAt > req.startHour + 3) return false;
  return true;
}

function score(place: Place, req: PlanRequest, cap: number, origin: string | null, flavor: PlanFlavor) {
  const moodHit = req.moods.length
    ? place.moods.filter((m) => req.moods.includes(m)).length / req.moods.length
    : 0.6;
  const budgetFit = 1 - Math.abs(place.pricePerPerson - cap * 0.55) / Math.max(cap, 1);
  const km = origin ? distanceKm(getDistrict(origin), getDistrict(place.districtId)) : 8;
  const nearScore = Math.max(0, 1 - km / 30);
  const timeFit = place.durationMin <= req.durationMin * 0.6 ? 1 : 0.5;
  const verified = place.verified ? 1 : 0.45;

  let s =
    WEIGHTS.mood * moodHit +
    WEIGHTS.budget * Math.max(0, budgetFit) +
    WEIGHTS.distance * nearScore +
    WEIGHTS.verified * verified +
    WEIGHTS.time * timeFit +
    WEIGHTS.variety * 0.6 +
    WEIGHTS.freshness * (place.verified ? 1 : 0.3);

  if (flavor === "nearest") s += nearScore * 0.35 + (place.reservation ? -0.1 : 0.05);
  if (flavor === "premium") s += (place.pricePerPerson / Math.max(cap, 1)) * 0.3;
  if (req.prefs.includes("quiet") && place.moods.includes("calm")) s += 0.08;
  if (req.prefs.includes("nearby")) s += nearScore * 0.2;
  return s;
}

function pick(pool: Place[], req: PlanRequest, cap: number, origin: string | null, flavor: PlanFlavor, used: Set<string>) {
  const ranked = pool
    .filter((p) => !used.has(p.id))
    .map((p) => {
      const baseScore = score(p, req, cap, origin, flavor);
      const ratingBonus = (p.rating || 4.5) / 10;
      const viewsBonus = Math.min(0.15, (p.viewsCount || 0) / 100000);
      const randomJitter = (Math.random() - 0.5) * 0.35; // Ensures dynamic variety on every generation
      return { p, s: baseScore + ratingBonus + viewsBonus + randomJitter };
    })
    .sort((a, b) => b.s - a.s);
  return ranked.map((r) => r.p);
}

const flavorMeta: Record<PlanFlavor, { titleAr: string; subtitleAr: string }> = {
  nearest: { titleAr: "الأقرب والأسرع", subtitleAr: "مسافات قصيرة وتنفيذ سريع بدون تعقيد." },
  balanced: { titleAr: "الخطة الموزونة", subtitleAr: "أفضل توازن بين الجودة والسعر والتنوع." },
  premium: { titleAr: "التجربة المميزة", subtitleAr: "إطلالات أحلى وتجارب أعلى مستوى." },
};

function buildPlan(req: PlanRequest, flavor: PlanFlavor): GeneratedPlan | null {
  const cap = budgetCap(req);
  const origin = req.districtId;
  const eligible = places.filter((p) => passesHardFilters(p, req, cap));
  if (eligible.length < 2) return null;

  const used = new Set<string>();
  const activityPool = eligible.filter((p) => ["activity", "outdoor", "culture", "shopping"].includes(p.kind));
  const foodPool = eligible.filter((p) => p.kind === "food");
  const cafePool = eligible.filter((p) => p.kind === "cafe");

  const activities = pick(activityPool, req, cap, origin, flavor, used);
  const main = activities[0];
  if (!main) return null;
  used.add(main.id);

  // keep the rest geographically close to the first stop
  const nearFirst = (list: Place[]) =>
    [...list].sort(
      (a, b) =>
        distanceKm(getDistrict(main.districtId), getDistrict(a.districtId)) -
        distanceKm(getDistrict(main.districtId), getDistrict(b.districtId)),
    );

  const foods = pick(foodPool, req, cap, main.districtId, flavor, used);
  const food = (flavor === "nearest" ? nearFirst(foods) : foods)[0];
  if (food) used.add(food.id);

  const cafes = pick(cafePool, req, cap, main.districtId, flavor, used);
  const cafe = (flavor === "nearest" ? nearFirst(cafes) : cafes)[0];

  const chosen: Place[] = [main];
  if (food) chosen.push(food);
  const shortPlan = req.durationMin <= 150;
  if (cafe && !shortPlan) chosen.push(cafe);

  // build timeline
  const stops: PlanStop[] = [];
  let clock = req.startHour * 60;
  let travelTotal = 0;
  let kmTotal = 0;
  chosen.forEach((place, i) => {
    let travel = 0;
    if (i === 0) {
      const km = origin ? distanceKm(getDistrict(origin), getDistrict(place.districtId)) : 6;
      travel = travelMinutes(km);
      kmTotal += km;
    } else {
      const prev = chosen[i - 1]!;
      const km = distanceKm(getDistrict(prev.districtId), getDistrict(place.districtId));
      travel = travelMinutes(km);
      kmTotal += km;
    }
    travelTotal += travel;
    clock += travel;
    const altPool = place.kind === "food" ? foods : place.kind === "cafe" ? cafes : activities;
    stops.push({
      place,
      startMinutes: clock,
      travelFromPrev: travel,
      alternative: altPool.find((p) => p.id !== place.id && !chosen.some((c) => c.id === p.id)),
    });
    clock += place.durationMin + 10;
  });

  const pricePerPerson = chosen.reduce((s, p) => s + p.pricePerPerson, 0);
  const durationMin = chosen.reduce((s, p) => s + p.durationMin, 0) + travelTotal;
  const verifiedCount = chosen.filter((p) => p.verified).length;

  return {
    id: `${flavor}-${chosen.map((c) => c.id).join("-")}`,
    flavor,
    ...flavorMeta[flavor],
    stops,
    pricePerPerson,
    totalPrice: pricePerPerson * req.groupSize,
    durationMin,
    travelMin: travelTotal,
    distanceKm: Math.round(kmTotal * 10) / 10,
    indoorOnly: chosen.every((p) => p.indoor),
    needsReservation: chosen.some((p) => p.reservation),
    verified: verifiedCount === chosen.length,
    confidence: Math.round(
      (verifiedCount / chosen.length) * 60 + (stops.every((s) => s.alternative) ? 25 : 10) + 10,
    ),
  };
}

export function generatePlans(req: PlanRequest): GeneratedPlan[] {
  const flavors: PlanFlavor[] = ["nearest", "balanced", "premium"];
  const out: GeneratedPlan[] = [];
  for (const f of flavors) {
    const plan = buildPlan(req, f);
    if (plan && !out.some((p) => p.id === plan.id)) out.push(plan);
  }
  return out;
}

export const formatClock = (minutes: number) => {
  const total = ((minutes % 1440) + 1440) % 1440;
  const h24 = Math.floor(total / 60);
  const m = total % 60;
  const suffix = h24 >= 12 ? "م" : "ص";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
};

export const formatDuration = (min: number) => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h && m) return `${h} ساعة و${m} دقيقة`;
  if (h) return `${h} ساعات`;
  return `${m} دقيقة`;
};

export const allDistricts = districts;