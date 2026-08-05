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

export type { BudgetLevel, GroupType, Mood, Place };
export { distanceKm, districts, getDistrict, places, travelMinutes };

export interface TrendingPlace {
  place: Place;
  rank: number;
  badgeAr: string;
  badgeEn: string;
  reasonAr: string;
  reasonEn: string;
  weeklyViews: number;
}

export const getTrendingPlaces = (): TrendingPlace[] => {
  return [
    {
      place: places.find((p) => p.id === "c1") || places[0],
      rank: 1,
      badgeAr: "🔥 ترند #1 كافيهات البحر",
      badgeEn: "#1 Sea Cafe Trend",
      reasonAr: "أعلى مكان مطلوب لجلسات الغروب والقهوة المختصة على الكورنيش هذا الأسبوع.",
      reasonEn: "Top booked spot for sunset coffee on the Corniche this week.",
      weeklyViews: 14200,
    },
    {
      place: places.find((p) => p.id === "r1") || places[1],
      rank: 2,
      badgeAr: "🐟 ترند #2 مطاعم بحرية",
      badgeEn: "#2 Seafood Trend",
      reasonAr: "سمك طازج وجلسات ساحلية مع خصم 20% ساري الآن.",
      reasonEn: "Fresh catch right on the Corniche with 20% active discount.",
      weeklyViews: 11800,
    },
    {
      place: places.find((p) => p.id === "p1") || places[2],
      rank: 3,
      badgeAr: "🚲 ترند #3 أنشطة خارجية",
      badgeEn: "#3 Outdoor Trend",
      reasonAr: "تأجير دراجات ومسار بحري مميز وقت الغروب.",
      reasonEn: "Popular seaside cycling track during sunset hours.",
      weeklyViews: 9800,
    },
    {
      place: places.find((p) => p.id === "k1") || places[3],
      rank: 4,
      badgeAr: "🏛️ ترند #4 جدة التاريخية",
      badgeEn: "#4 Heritage Trend",
      reasonAr: "جولة البلد بين الرواشين والبيوت القديمة الأكثر تصويراً.",
      reasonEn: "Historic Balad walking tour with iconic heritage spots.",
      weeklyViews: 8400,
    },
    {
      place: places.find((p) => p.id === "p3") || places[4],
      rank: 5,
      badgeAr: "🏎️ ترند #5 حماس الشلة",
      badgeEn: "#5 Youth Action Trend",
      reasonAr: "كارتينغ تكييف كامل وتحديات حماسية لمجموعات الأصدقاء.",
      reasonEn: "Full AC indoor karting circuit ideal for group challenges.",
      weeklyViews: 7600,
    },
    {
      place: places.find((p) => p.id === "c4") || places[5],
      rank: 6,
      badgeAr: "☕ ترند #6 رووف أبحر",
      badgeEn: "#6 Obhur Rooftop Trend",
      reasonAr: "مقهى سطح بإطلالة بانورامية هادئة على مياه أبحر.",
      reasonEn: "Rooftop café with a serene panoramic Obhur view.",
      weeklyViews: 6900,
    },
  ];
};
